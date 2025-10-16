/**
 * Endpoint Layer: Dashboard
 *
 * Provides aggregate data and summaries for the dashboard view.
 * Handles authentication and composes database operations.
 */

import { v } from "convex/values";
import { query } from "../_generated/server";
import { authComponent } from "../auth";
import * as Dashboard from "../db/dashboard";

/**
 * Get dashboard summary with key metrics
 */
export const summary = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    return Dashboard.loadSummary(ctx, user._id);
  },
});

/**
 * Get recent tasks for dashboard table view
 */
export const recent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    return Dashboard.loadRecent(ctx, user._id, args.limit ?? 10);
  },
});
