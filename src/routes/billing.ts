import express from "express";
import Stripe from "stripe";
import authMiddleware, { AuthRequest } from "../middleware/auth";
import { stripeEventQueue } from "../services/queue";

const router = express.Router();

let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");
  }
  return _stripe;
}

// Sovereign Memory Store for Idempotency
// Note: In production, replace this Set with Redis or PostgreSQL for cross-instance durability
const processedEvents = new Set<string>();

// Webhook endpoint needs raw body
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (!sig || !endpointSecret) {
      throw new Error("Missing signature or secret");
    }
    event = getStripe().webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const eventId = event.id;

  // === IDEMPOTENCY CHECK ===
  if (processedEvents.has(eventId)) {
    console.log(`⏭️ Idempotent skip: ${eventId} (${event.type})`);
    return res.status(200).send({ received: true, idempotent: true });
  }

  try {
    // === ENQUEUE FOR ASYNC PROCESSING ===
    // We hand off the event to BullMQ, keeping our webhook response sub-500ms
    await stripeEventQueue.add(event.type, event, {
      jobId: eventId, // BullMQ can also use this for idempotency
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      }
    });

    // === MARK AS PROCESSED ===
    processedEvents.add(eventId);
    // Cleanup simple memory leak after 24 hrs
    setTimeout(() => processedEvents.delete(eventId), 24 * 60 * 60 * 1000);

    console.log(`✅ Queued: ${eventId} (${event.type})`);
    res.status(200).send({ received: true });
  } catch (error) {
    console.error(`❌ Error queuing ${eventId}:`, error);
    // Do NOT mark as processed on failure (allow retry)
    res.status(500).send({ error: 'Processing queuing failed' });
  }
});


// Checkout session creation endpoint
router.post("/create-checkout-session", authMiddleware, async (req: AuthRequest, res) => {
  const { planId } = req.body; // e.g. 'price_...' 
  const userId = req.user?.email;

  if (!planId) return res.status(400).json({ error: "Missing planId" });

  try {
    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: planId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.origin}/?success=true`,
      cancel_url: `${req.headers.origin}/?canceled=true`,
      customer_email: userId, // associate session with user email
    });

    res.json({ url: session.url });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
