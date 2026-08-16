import { logger, task } from "@trigger.dev/sdk/v3";
import { db } from "@/drizzle";
import { cardLoads, walletTransactions, auditLogs } from "@/drizzle/db/schema";
import { eq } from "drizzle-orm";

interface ReconcilePayload {
  reqNumber: string;
}

export const reconcileTransactionJob = task({
  id: "reconcile-transaction",
  maxDuration: 60, // 1 minute compute time max
  run: async (payload: ReconcilePayload, { ctx }) => {
    // 1. Guard against empty payloads (e.g. clicking 'Test Run' in dashboard without JSON)
    if (!payload || !payload.reqNumber) {
      logger.error("Missing reqNumber in payload. If testing from the dashboard, ensure you provide JSON like { \"reqNumber\": \"REQ-123\" }");
      return { success: false, message: "Missing reqNumber in payload" };
    }

    const { reqNumber } = payload;
    logger.log(`Starting reconciliation for single transaction: ${reqNumber}`);

    try {
      await db.transaction(async (tx) => {
        // 2. Check idempotency: is it already FAILED?
        const [cardLoad] = await tx
          .select()
          .from(cardLoads)
          .where(eq(cardLoads.reqNumber, reqNumber));

        if (!cardLoad) {
          logger.warn(`Transaction not found: ${reqNumber}`);
          return; // Skip if it doesn't exist
        }

        if (cardLoad.status === "FAILED") {
          logger.info(`Transaction already failed, skipping: ${reqNumber}`);
          return; // Idempotency: skip if already failed
        }

        // 3. Update card_loads to FAILED
        await tx
          .update(cardLoads)
          .set({ status: "FAILED" })
          .where(eq(cardLoads.reqNumber, reqNumber));

        // 4. Update wallet_transactions to FAILED
        await tx
          .update(walletTransactions)
          .set({ status: "FAILED" })
          .where(eq(walletTransactions.reqNumber, reqNumber));

        // 5. Insert Audit Log
        await tx.insert(auditLogs).values({
          reqNumber,
          action: "MANUAL_FAIL",
        });
      });
      
      logger.info(`Successfully failed transaction: ${reqNumber}`);
      return { success: true, reqNumber };
    } catch (error) {
      logger.error(`Failed to process transaction: ${reqNumber}`, { error });
      // Throw the error so Trigger.dev registers this task as Failed and allows auto-retries
      throw error; 
    }
  },
});
