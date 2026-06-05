import express from "express";
import Stripe from "stripe";
import authMiddleware, { AuthRequest } from "../middleware/auth";

const router = express.Router();
let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");
  }
  return _stripe;
}

// ==========================================
// 1. ONBOARDING FLOW (DEFERRED EXPRESS)
// ==========================================
router.post("/onboard", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { email } = req.user!;
    
    // Create a new Express connected account
    const account = await getStripe().accounts.create({
      type: 'express',
      email: email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
    });

    // Create an account link for onboarding
    const accountLink = await getStripe().accountLinks.create({
      account: account.id,
      refresh_url: `${req.headers.origin}/connect/refresh`,
      return_url: `${req.headers.origin}/connect/success`,
      type: 'account_onboarding',
    });

    res.json({ url: accountLink.url, accountId: account.id });
  } catch (error: any) {
    console.error("Connect Onboarding Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 2. SEPARATE CHARGES (MULTI-PARTY PAYMENT)
// ==========================================
router.post("/multi-party-checkout", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { amount, orderId } = req.body;
    // Create a PaymentIntent on the platform account
    // with a transfer_group to link subsequent transfers
    const paymentIntent = await getStripe().paymentIntents.create({
      amount: amount, // Total amount charged to the customer
      currency: 'usd',
      transfer_group: `ORDER_${orderId}`,
      automatic_payment_methods: { enabled: true },
    });

    // Return the client secret to the frontend to complete payment
    res.json({ 
      clientSecret: paymentIntent.client_secret, 
      transferGroup: `ORDER_${orderId}` 
    });
  } catch (error: any) {
    console.error("Multi-Party Checkout Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 3. EXECUTE TRANSFERS (MULTI-PARTY SPLIT)
// ==========================================
// In a robust production system, this is usually called by a webhook 
// (e.g., charge.succeeded) or a background worker after payment confirmation.
router.post("/execute-transfers", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { orderId, recipients } = req.body;
    
    // recipients format: [{ connectAccountId: 'acct_123', amount: 500 }]
    const transferResults = [];
    
    for (const recipient of recipients) {
      // Transfer funds from platform balance to the connected account
      const transfer = await getStripe().transfers.create({
        amount: recipient.amount,
        currency: 'usd',
        destination: recipient.connectAccountId,
        transfer_group: `ORDER_${orderId}`, 
      });
      transferResults.push(transfer);
    }

    res.json({ success: true, transfers: transferResults });
  } catch (error: any) {
    console.error("Execute Transfers Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 4. PAYOUT SCHEDULING + CROSS-BORDER
// ==========================================
router.post("/configure-payouts", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { accountId, scheduleInterval } = req.body; // e.g. 'manual', 'daily', 'weekly', 'monthly'
    
    const updatedAccount = await getStripe().accounts.update(accountId, {
      settings: {
        payouts: {
          schedule: {
            interval: scheduleInterval, // "manual" requires you to trigger payouts
          },
        },
      },
    });

    res.json({ success: true, account: updatedAccount.id });
  } catch (error: any) {
    console.error("Payout Config Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Manual Payout Trigger (if interval is manual)
router.post("/trigger-payout", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { accountId, amount, currency } = req.body;
    
    // Cross-border can be tricky. Using on_behalf_of on the charge helps.
    // Here we assume standard payout to the connected account's default currency.
    const payout = await getStripe().payouts.create(
      {
        amount, 
        currency: currency || 'usd',
      },
      {
        stripeAccount: accountId, // Make the payout ON the connected account
      }
    );

    res.json({ success: true, payout });
  } catch (error: any) {
    console.error("Payout Trigger Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 5. RISK MANAGEMENT & RESERVES
// ==========================================
// For true sovereign risk management, we might want to hold back a reserve
// amount from a transfer to cover potential chargebacks.
router.post("/reserve-transfer", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { orderId, connectAccountId, totalAmount, reservePercent } = req.body;
    
    // E.g., 10% reserve
    const reserveAmount = Math.floor(totalAmount * (reservePercent / 100));
    const transferAmount = totalAmount - reserveAmount;

    // 1. Transfer the main amount to the connected account
    const transfer = await getStripe().transfers.create({
      amount: transferAmount,
      currency: 'usd',
      destination: connectAccountId,
      transfer_group: `ORDER_${orderId}`,
    });

    // 2. The platform retains `reserveAmount`. You can log this in your DB 
    // to release it after 30-90 days via another transfer.
    
    res.json({ 
      success: true, 
      transfer,
      reserveHeld: reserveAmount,
      reserveReleaseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });
  } catch (error: any) {
    console.error("Reserve Transfer Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
