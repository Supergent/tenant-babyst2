/**
 * Endpoint Layer: Tasks
 *
 * Business logic for task management.
 * Composes database operations from the db layer.
 * Handles authentication, authorization, and rate limiting.
 */

import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { authComponent } from "../auth";
import { rateLimiter } from "../rateLimiter";
import * as Tasks from "../db/tasks";
import { validateAndSanitizeTask } from "../helpers/validation";

/**
 * Create a new task
 */
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const status = await rateLimiter.limit(ctx, "createTask", {
      key: user._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(status.retryAfter / 1000)} seconds.`
      );
    }

    // 3. Validation and sanitization
    const validation = validateAndSanitizeTask(args);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // 4. Create task via database layer
    return await Tasks.createTask(ctx, {
      userId: user._id,
      ...validation.sanitized!,
    });
  },
});

/**
 * List all tasks for the current user
 */
export const list = query({
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    return await Tasks.getTasksByUser(ctx, user._id);
  },
});

/**
 * List active tasks for the current user
 */
export const listActive = query({
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    return await Tasks.getActiveTasksByUser(ctx, user._id);
  },
});

/**
 * List completed tasks for the current user
 */
export const listCompleted = query({
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    return await Tasks.getCompletedTasksByUser(ctx, user._id);
  },
});

/**
 * Get a single task by ID
 */
export const get = query({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    const task = await Tasks.getTaskById(ctx, args.id);
    if (!task) {
      throw new Error("Task not found");
    }

    // Authorization check
    if (task.userId !== user._id) {
      throw new Error("Not authorized to view this task");
    }

    return task;
  },
});

/**
 * Update task details
 */
export const update = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const status = await rateLimiter.limit(ctx, "updateTask", {
      key: user._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(status.retryAfter / 1000)} seconds.`
      );
    }

    // 3. Authorization check
    const task = await Tasks.getTaskById(ctx, args.id);
    if (!task) {
      throw new Error("Task not found");
    }
    if (task.userId !== user._id) {
      throw new Error("Not authorized to update this task");
    }

    // 4. Validation (only if fields are being updated)
    if (args.title !== undefined || args.description !== undefined) {
      const validation = validateAndSanitizeTask({
        title: args.title ?? task.title,
        description: args.description,
      });
      if (!validation.valid) {
        throw new Error(validation.error);
      }
    }

    // 5. Update task
    const { id, ...updateArgs } = args;
    return await Tasks.updateTask(ctx, id, updateArgs);
  },
});

/**
 * Complete a task
 */
export const complete = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    // 1. Authentication
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const status = await rateLimiter.limit(ctx, "updateTask", {
      key: user._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(status.retryAfter / 1000)} seconds.`
      );
    }

    // 3. Authorization check
    const task = await Tasks.getTaskById(ctx, args.id);
    if (!task) {
      throw new Error("Task not found");
    }
    if (task.userId !== user._id) {
      throw new Error("Not authorized to complete this task");
    }

    // 4. Complete task
    return await Tasks.completeTask(ctx, args.id);
  },
});

/**
 * Reactivate a completed task
 */
export const reactivate = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    // 1. Authentication
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const status = await rateLimiter.limit(ctx, "updateTask", {
      key: user._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(status.retryAfter / 1000)} seconds.`
      );
    }

    // 3. Authorization check
    const task = await Tasks.getTaskById(ctx, args.id);
    if (!task) {
      throw new Error("Task not found");
    }
    if (task.userId !== user._id) {
      throw new Error("Not authorized to reactivate this task");
    }

    // 4. Reactivate task
    return await Tasks.reactivateTask(ctx, args.id);
  },
});

/**
 * Delete a task (soft delete)
 */
export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    // 1. Authentication
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const status = await rateLimiter.limit(ctx, "deleteTask", {
      key: user._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(status.retryAfter / 1000)} seconds.`
      );
    }

    // 3. Authorization check
    const task = await Tasks.getTaskById(ctx, args.id);
    if (!task) {
      throw new Error("Task not found");
    }
    if (task.userId !== user._id) {
      throw new Error("Not authorized to delete this task");
    }

    // 4. Soft delete task
    return await Tasks.softDeleteTask(ctx, args.id);
  },
});

/**
 * Permanently delete a task (hard delete)
 */
export const permanentlyDelete = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    // 1. Authentication
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const status = await rateLimiter.limit(ctx, "deleteTask", {
      key: user._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(status.retryAfter / 1000)} seconds.`
      );
    }

    // 3. Authorization check
    const task = await Tasks.getTaskById(ctx, args.id);
    if (!task) {
      throw new Error("Task not found");
    }
    if (task.userId !== user._id) {
      throw new Error("Not authorized to permanently delete this task");
    }

    // 4. Hard delete task
    return await Tasks.hardDeleteTask(ctx, args.id);
  },
});
