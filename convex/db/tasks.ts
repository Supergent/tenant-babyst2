/**
 * Database Layer: Tasks
 *
 * This is the ONLY file that directly accesses the tasks table using ctx.db.
 * All tasks-related database operations are defined here as pure async functions.
 */

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

/**
 * CREATE - Insert a new task
 */
export async function createTask(
  ctx: MutationCtx,
  args: {
    userId: string;
    title: string;
    description?: string;
  }
) {
  const now = Date.now();
  return await ctx.db.insert("tasks", {
    userId: args.userId,
    title: args.title,
    description: args.description,
    status: "active",
    createdAt: now,
    updatedAt: now,
  });
}

/**
 * READ - Get task by ID
 */
export async function getTaskById(ctx: QueryCtx, id: Id<"tasks">) {
  return await ctx.db.get(id);
}

/**
 * READ - Get all tasks for a user
 */
export async function getTasksByUser(ctx: QueryCtx, userId: string) {
  return await ctx.db
    .query("tasks")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .order("desc")
    .collect();
}

/**
 * READ - Get tasks by user and status
 */
export async function getTasksByUserAndStatus(
  ctx: QueryCtx,
  userId: string,
  status: "active" | "completed" | "deleted"
) {
  return await ctx.db
    .query("tasks")
    .withIndex("by_user_and_status", (q) =>
      q.eq("userId", userId).eq("status", status)
    )
    .order("desc")
    .collect();
}

/**
 * READ - Get active tasks for a user
 */
export async function getActiveTasksByUser(ctx: QueryCtx, userId: string) {
  return await getTasksByUserAndStatus(ctx, userId, "active");
}

/**
 * READ - Get completed tasks for a user
 */
export async function getCompletedTasksByUser(ctx: QueryCtx, userId: string) {
  return await getTasksByUserAndStatus(ctx, userId, "completed");
}

/**
 * READ - Get recent tasks (for dashboard)
 */
export async function getRecentTasks(ctx: QueryCtx, userId: string, limit: number = 10) {
  return await ctx.db
    .query("tasks")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .order("desc")
    .take(limit);
}

/**
 * READ - Count tasks by status
 */
export async function countTasksByStatus(
  ctx: QueryCtx,
  userId: string,
  status: "active" | "completed" | "deleted"
) {
  const tasks = await getTasksByUserAndStatus(ctx, userId, status);
  return tasks.length;
}

/**
 * UPDATE - Complete a task
 */
export async function completeTask(ctx: MutationCtx, id: Id<"tasks">) {
  return await ctx.db.patch(id, {
    status: "completed",
    completedAt: Date.now(),
    updatedAt: Date.now(),
  });
}

/**
 * UPDATE - Reactivate a completed task
 */
export async function reactivateTask(ctx: MutationCtx, id: Id<"tasks">) {
  return await ctx.db.patch(id, {
    status: "active",
    completedAt: undefined,
    updatedAt: Date.now(),
  });
}

/**
 * UPDATE - Update task details
 */
export async function updateTask(
  ctx: MutationCtx,
  id: Id<"tasks">,
  args: {
    title?: string;
    description?: string;
  }
) {
  return await ctx.db.patch(id, {
    ...args,
    updatedAt: Date.now(),
  });
}

/**
 * DELETE - Soft delete a task (set status to deleted)
 */
export async function softDeleteTask(ctx: MutationCtx, id: Id<"tasks">) {
  return await ctx.db.patch(id, {
    status: "deleted",
    updatedAt: Date.now(),
  });
}

/**
 * DELETE - Hard delete a task (permanent removal)
 */
export async function hardDeleteTask(ctx: MutationCtx, id: Id<"tasks">) {
  return await ctx.db.delete(id);
}