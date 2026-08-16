"use server";

import { tasks } from "@trigger.dev/sdk/v3";
import type { reconcileTransactionJob } from "@/trigger/reconcile";

export async function triggerReconciliation(reqNumbers: string[]) {
  try {
    // Loop through the selected records and trigger a separate background job for each one
    const promises = reqNumbers.map((reqNumber) =>
      tasks.trigger<typeof reconcileTransactionJob>(
        "reconcile-transaction",
        { reqNumber }
      )
    );

    const handles = await Promise.all(promises);
    
    // We just return the first job ID to display in the UI alert for debugging
    return { success: true, jobId: handles[0]?.id };
  } catch (error) {
    console.error("Failed to trigger reconciliation jobs:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}
