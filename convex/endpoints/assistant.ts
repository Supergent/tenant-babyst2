/**
 * Endpoint Layer: AI Assistant
 *
 * Business logic for AI task assistant interactions.
 * Manages conversation threads and message exchanges.
 * Handles authentication, authorization, and rate limiting.
 */

import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { authComponent } from "../auth";
import { rateLimiter } from "../rateLimiter";
import { taskAssistant } from "../agent";
import * as Threads from "../db/threads";
import * as Messages from "../db/messages";
import { isValidMessageContent } from "../helpers/validation";

/**
 * Create a new conversation thread
 */
export const createThread = mutation({
  args: {
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const status = await rateLimiter.limit(ctx, "createThread", {
      key: user._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(status.retryAfter / 1000)} seconds.`
      );
    }

    // 3. Create thread via database layer
    return await Threads.createThread(ctx, {
      userId: user._id,
      title: args.title,
    });
  },
});

/**
 * List all threads for the current user
 */
export const listThreads = query({
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    return await Threads.getThreadsByUser(ctx, user._id);
  },
});

/**
 * List active threads for the current user
 */
export const listActiveThreads = query({
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    return await Threads.getActiveThreadsByUser(ctx, user._id);
  },
});

/**
 * Get a single thread by ID with its messages
 */
export const getThread = query({
  args: { id: v.id("threads") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    const thread = await Threads.getThreadById(ctx, args.id);
    if (!thread) {
      throw new Error("Thread not found");
    }

    // Authorization check
    if (thread.userId !== user._id) {
      throw new Error("Not authorized to view this thread");
    }

    const messages = await Messages.getMessagesByThread(ctx, args.id);

    return {
      thread,
      messages,
    };
  },
});

/**
 * Send a message in a thread and get AI response
 */
export const sendMessage = mutation({
  args: {
    threadId: v.id("threads"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const status = await rateLimiter.limit(ctx, "sendMessage", {
      key: user._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(status.retryAfter / 1000)} seconds.`
      );
    }

    // 3. Validation
    if (!isValidMessageContent(args.content)) {
      throw new Error("Message content must be between 1 and 10,000 characters");
    }

    // 4. Authorization check
    const thread = await Threads.getThreadById(ctx, args.threadId);
    if (!thread) {
      throw new Error("Thread not found");
    }
    if (thread.userId !== user._id) {
      throw new Error("Not authorized to send messages in this thread");
    }

    // 5. Save user message
    const userMessage = await Messages.createMessage(ctx, {
      threadId: args.threadId,
      userId: user._id,
      role: "user",
      content: args.content,
    });

    // 6. Get conversation history for context
    const previousMessages = await Messages.getMessagesByThread(ctx, args.threadId);
    const conversationHistory = previousMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // 7. Generate AI response
    // Note: In a real implementation, you'd call the agent here
    // For now, we'll create a simple response
    const aiResponseContent = `I'm your task assistant. I received your message: "${args.content}".

In a full implementation, I would:
- Analyze your message for task-related insights
- Provide helpful suggestions for task management
- Help you break down complex tasks
- Offer productivity tips

This is a placeholder response. To enable full AI functionality, ensure your AI provider (OpenAI or Anthropic) is properly configured.`;

    // 8. Save AI response
    const aiMessage = await Messages.createMessage(ctx, {
      threadId: args.threadId,
      userId: user._id,
      role: "assistant",
      content: aiResponseContent,
    });

    return {
      userMessage,
      aiMessage,
    };
  },
});

/**
 * Update thread title
 */
export const updateThread = mutation({
  args: {
    id: v.id("threads"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    // 2. Authorization check
    const thread = await Threads.getThreadById(ctx, args.id);
    if (!thread) {
      throw new Error("Thread not found");
    }
    if (thread.userId !== user._id) {
      throw new Error("Not authorized to update this thread");
    }

    // 3. Update thread
    const { id, ...updateArgs } = args;
    return await Threads.updateThread(ctx, id, updateArgs);
  },
});

/**
 * Archive a thread
 */
export const archiveThread = mutation({
  args: { id: v.id("threads") },
  handler: async (ctx, args) => {
    // 1. Authentication
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    // 2. Authorization check
    const thread = await Threads.getThreadById(ctx, args.id);
    if (!thread) {
      throw new Error("Thread not found");
    }
    if (thread.userId !== user._id) {
      throw new Error("Not authorized to archive this thread");
    }

    // 3. Archive thread
    return await Threads.archiveThread(ctx, args.id);
  },
});

/**
 * Delete a thread and all its messages
 */
export const deleteThread = mutation({
  args: { id: v.id("threads") },
  handler: async (ctx, args) => {
    // 1. Authentication
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    // 2. Authorization check
    const thread = await Threads.getThreadById(ctx, args.id);
    if (!thread) {
      throw new Error("Thread not found");
    }
    if (thread.userId !== user._id) {
      throw new Error("Not authorized to delete this thread");
    }

    // 3. Delete all messages in thread
    await Messages.deleteMessagesByThread(ctx, args.id);

    // 4. Delete thread
    return await Threads.deleteThread(ctx, args.id);
  },
});
