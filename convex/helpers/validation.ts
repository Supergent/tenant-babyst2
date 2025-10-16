/**
 * Validation Helpers
 *
 * Pure functions for input validation.
 * NO database access, NO ctx parameter.
 */

/**
 * Validate task title
 */
export function isValidTaskTitle(title: string): boolean {
  return title.trim().length > 0 && title.length <= 200;
}

/**
 * Validate task description
 */
export function isValidTaskDescription(description: string | undefined): boolean {
  if (description === undefined) return true;
  return description.length <= 5000;
}

/**
 * Validate thread title
 */
export function isValidThreadTitle(title: string | undefined): boolean {
  if (title === undefined) return true;
  return title.length <= 200;
}

/**
 * Validate message content
 */
export function isValidMessageContent(content: string): boolean {
  return content.trim().length > 0 && content.length <= 10000;
}

/**
 * Sanitize task title
 */
export function sanitizeTaskTitle(title: string): string {
  return title.trim().slice(0, 200);
}

/**
 * Sanitize task description
 */
export function sanitizeTaskDescription(description: string | undefined): string | undefined {
  if (description === undefined) return undefined;
  return description.trim().slice(0, 5000);
}

/**
 * Validate and sanitize task input
 */
export function validateAndSanitizeTask(args: {
  title: string;
  description?: string;
}): {
  valid: boolean;
  error?: string;
  sanitized?: {
    title: string;
    description?: string;
  };
} {
  if (!isValidTaskTitle(args.title)) {
    return {
      valid: false,
      error: "Task title must be between 1 and 200 characters",
    };
  }

  if (!isValidTaskDescription(args.description)) {
    return {
      valid: false,
      error: "Task description must be less than 5000 characters",
    };
  }

  return {
    valid: true,
    sanitized: {
      title: sanitizeTaskTitle(args.title),
      description: sanitizeTaskDescription(args.description),
    },
  };
}
