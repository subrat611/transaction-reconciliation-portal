import {
  mysqlTable,
  varchar,
  timestamp,
  mysqlEnum,
  int,
  serial,
} from "drizzle-orm/mysql-core";

// --- Enums ---
export const statusEnum = mysqlEnum("status", [
  "PENDING",
  "SUCCESS",
  "FAILED",
]);

export const transactionTypeEnum = mysqlEnum("transaction_type", [
  "credit",
  "debit",
  "fee",
]);

// --- Tables ---

export const cardLoads = mysqlTable("card_loads", {
  id: serial("id").primaryKey(),
  reqNumber: varchar("req_number", { length: 255 }).notNull().unique(),
  status: statusEnum.notNull().default("PENDING"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const walletTransactions = mysqlTable("wallet_transactions", {
  id: serial("id").primaryKey(),
  reqNumber: varchar("req_number", { length: 255 }).notNull(),
  type: transactionTypeEnum.notNull(),
  status: statusEnum.notNull().default("PENDING"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const auditLogs = mysqlTable("audit_logs", {
  id: serial("id").primaryKey(),
  reqNumber: varchar("req_number", { length: 255 }).notNull(), // Mapping to the transaction
  action: varchar("action", { length: 255 }).notNull(), // e.g., "MANUAL_FAIL"
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
