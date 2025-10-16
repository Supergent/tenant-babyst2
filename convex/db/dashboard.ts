/**
 * Database Layer: Dashboard
 *
 * Dashboard-specific database operations that aggregate data across multiple tables.
 * Uses type assertions for dynamic table queries as per Cleargent pattern.
 */

import type { QueryCtx } from "../_generated/server";
import type { DataModel } from "../_generated/dataModel";

const TABLES = ["tasks", "threads", "messages"] as const;
const PRIMARY_TABLE = "tasks";

/**
 * Load summary statistics for dashboard
 * Uses type assertion for dynamic table queries
 */
export async function loadSummary(ctx: QueryCtx, userId?: string) {
  const perTable: Record<string, number> = {};

  for (const table of TABLES) {
    // ✅ CORRECT - Use type assertion for dynamic table queries
    const records = await ctx.db.query(table as keyof DataModel).collect();
    const scopedRecords = userId
      ? records.filter((record: any) => record.userId === userId)
      : records;
    perTable[table] = scopedRecords.length;
  }

  const totals = Object.values(perTable);
  const totalRecords = totals.reduce((sum, count) => sum + count, 0);

  return {
    totalRecords,
    perTable,
    primaryTableCount: perTable[PRIMARY_TABLE] ?? 0,
  };
}

/**
 * Load recent records from primary table for dashboard
 */
export async function loadRecent(ctx: QueryCtx, userId?: string, limit = 5) {
  // ✅ CORRECT - Use type assertion for dynamic table query
  const records = await ctx.db.query(PRIMARY_TABLE as keyof DataModel).collect();
  const scopedRecords = userId
    ? records.filter((record: any) => record.userId === userId)
    : records;

  scopedRecords.sort((a: any, b: any) => {
    const aTime = a.updatedAt ?? 0;
    const bTime = b.updatedAt ?? 0;
    return bTime - aTime;
  });

  return scopedRecords.slice(0, limit).map((record: any) => ({
    _id: record._id,
    name: record.title ?? "Untitled",
    status: record.status,
    updatedAt: record.updatedAt ?? null,
  }));
}
