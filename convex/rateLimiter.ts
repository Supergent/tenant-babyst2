/**
 * Rate Limiter Configuration
 *
 * Configures rate limiting for all API endpoints to prevent abuse.
 * Uses token bucket algorithm for burst tolerance.
 */

import { RateLimiter, MINUTE } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

export const rateLimiter = new RateLimiter(components.rateLimiter, {
  // Task operations - balanced limits for normal usage
  createTask: {
    kind: "token bucket",
    rate: 20, // 20 tasks per minute
    period: MINUTE,
    capacity: 5, // Allow burst of 5
  },

  updateTask: {
    kind: "token bucket",
    rate: 50, // 50 updates per minute
    period: MINUTE,
    capacity: 10,
  },

  deleteTask: {
    kind: "token bucket",
    rate: 30, // 30 deletes per minute
    period: MINUTE,
    capacity: 5,
  },

  // AI Assistant operations - lower limits due to cost
  sendMessage: {
    kind: "token bucket",
    rate: 10, // 10 messages per minute
    period: MINUTE,
    capacity: 3, // Allow small burst
  },

  createThread: {
    kind: "token bucket",
    rate: 5, // 5 new threads per minute
    period: MINUTE,
    capacity: 2,
  },

  // Dashboard queries - higher limits for read operations
  // Note: These use check() not limit() since they're queries
  dashboard: {
    kind: "token bucket",
    rate: 100, // 100 dashboard loads per minute
    period: MINUTE,
    capacity: 10,
  },
});
