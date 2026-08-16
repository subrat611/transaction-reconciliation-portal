import "dotenv/config";
import { db } from "../index";
import { cardLoads, walletTransactions } from "./schema";

async function main() {
  console.log("Seeding database...");

  // Generate 20 dummy transactions
  const dummyData = Array.from({ length: 20 }).map((_, i) => ({
    reqNumber: `REQ-${Math.floor(Date.now() / 1000)}-${i + 1}`,
  }));

  try {
    for (const data of dummyData) {
      // 1. Insert Card Load
      await db.insert(cardLoads).values({
        reqNumber: data.reqNumber,
        status: "PENDING",
      });

      // 2. Insert corresponding Wallet Transactions (credit, debit, fee)
      await db.insert(walletTransactions).values([
        {
          reqNumber: data.reqNumber,
          type: "credit",
          status: "PENDING",
        },
        {
          reqNumber: data.reqNumber,
          type: "debit",
          status: "PENDING",
        },
        {
          reqNumber: data.reqNumber,
          type: "fee",
          status: "PENDING",
        },
      ]);
    }

    console.log("✅ Successfully seeded 20 pending transactions.");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    process.exit(0);
  }
}

main();
