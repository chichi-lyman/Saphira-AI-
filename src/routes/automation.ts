import express from "express";
import authMiddleware, { AuthRequest } from "../middleware/auth";
import { AutomationSystem } from "../services/automationSystem";
import { db } from "../db/index";
import { sql } from "drizzle-orm";

const router = express.Router();

router.post("/audit", authMiddleware, async (req: AuthRequest, res) => {
  const { tenantId, documentId, riskLevel, findingSummary } = req.body;

  if (!tenantId || !documentId || !riskLevel || !findingSummary) {
    return res.status(400).json({ error: "Missing required audit parameters." });
  }

  try {
    // Step 1: Tell the database engine exactly who the current client is
    // Step 2: Saphira runs her automated audit queries safely inside the wall
    const result = await db.transaction(async (tx) => {
      // Secure the transaction context for this tenant only via RLS
      await tx.execute(sql`SET LOCAL app.current_tenant_id = ${tenantId};`);

      // Attempt to read the document safely (will return nothing if RLS blocks it)
      const docs = await tx.execute(
        sql`SELECT * FROM corporate_documents WHERE document_id = ${documentId}`
      );

      // Saphira automated audit insertion
      const logInsertion = await tx.execute(
        sql`INSERT INTO saphira_audit_logs (tenant_id, document_id, risk_level, finding_summary) 
            VALUES (${tenantId}, ${documentId}, ${riskLevel}, ${findingSummary})
            RETURNING log_id`
      );

      return {
        documentsFound: docs.rowCount,
        auditLogId: logInsertion.rows[0]?.log_id,
      };
    });

    res.json({ success: true, message: "Audit transaction completed securely.", result });
  } catch (error: any) {
    console.error("Audit error:", error);
    res.status(500).json({ error: "Audit transaction failed", details: error.message });
  }
});

router.get("/tasks", authMiddleware, (req: AuthRequest, res) => {
  const userId = req.user?.email || "anonymous_user";
  const tasks = AutomationSystem.getTasksByUser(userId);
  res.json({ tasks });
});

router.post("/tasks", authMiddleware, (req: AuthRequest, res) => {
  const userId = req.user?.email || "anonymous_user";
  const { type, schedule, data } = req.body;
  
  if (!type || !schedule) {
    return res.status(400).json({ error: "Missing type or schedule" });
  }

  const task = AutomationSystem.addTask(userId, type, schedule, data);
  res.json({ task });
});

router.delete("/tasks/:id", authMiddleware, (req: AuthRequest, res) => {
  const { id } = req.params;
  const success = AutomationSystem.removeTask(id);
  if (success) {
    res.json({ message: "Task removed" });
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

export default router;
