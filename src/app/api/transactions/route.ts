import { NextResponse } from "next/server";
import { db } from "@/drizzle";
import { cardLoads } from "@/drizzle/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const pendingRecords = await db
      .select()
      .from(cardLoads)
      .where(eq(cardLoads.status, "PENDING"));

    const transactions = pendingRecords.map((record) => ({
      id: record.id.toString(),
      reqNumber: record.reqNumber,
      status: record.status as "PENDING" | "SUCCESS" | "FAILED",
      createdAt: record.createdAt?.toISOString() || new Date().toISOString(),
    }));

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching pending transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 },
    );
  }
}
