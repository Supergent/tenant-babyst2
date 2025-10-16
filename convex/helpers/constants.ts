/**
 * Application Constants
 *
 * Centralized constants used across the application.
 */

/**
 * Pagination limits
 */
export const PAGINATION = {
  TASKS_DEFAULT: 50,
  MESSAGES_DEFAULT: 50,
  RECENT_TASKS: 10,
} as const;

/**
 * Task status types
 */
export const TASK_STATUS = {
  ACTIVE: "active",
  COMPLETED: "completed",
  DELETED: "deleted",
} as const;

/**
 * Thread status types
 */
export const THREAD_STATUS = {
  ACTIVE: "active",
  ARCHIVED: "archived",
} as const;

/**
 * Message role types
 */
export const MESSAGE_ROLE = {
  USER: "user",
  ASSISTANT: "assistant",
} as const;

/**
 * Rate limit configuration
 */
export const RATE_LIMITS = {
  // Tasks
  CREATE_TASK: { rate: 20, period: 60000 }, // 20 per minute
  UPDATE_TASK: { rate: 50, period: 60000 }, // 50 per minute
  DELETE_TASK: { rate: 30, period: 60000 }, // 30 per minute

  // AI Assistant
  SEND_MESSAGE: { rate: 10, period: 60000 }, // 10 per minute
  CREATE_THREAD: { rate: 5, period: 60000 }, // 5 per minute
} as const;

/**
 * Validation limits
 */
export const VALIDATION_LIMITS = {
  TASK_TITLE_MAX: 200,
  TASK_DESCRIPTION_MAX: 5000,
  THREAD_TITLE_MAX: 200,
  MESSAGE_CONTENT_MAX: 10000,
} as const;
