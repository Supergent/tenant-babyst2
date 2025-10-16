/**
 * AI Agent Configuration
 *
 * Configures the AI assistant agent for helping users with their tasks.
 * Uses OpenAI GPT-4 for intelligent task management assistance.
 */

import { Agent } from "@convex-dev/agent";
import { components } from "./_generated/api";

// Check which AI provider is configured
const openaiKey = process.env.OPENAI_API_KEY;
const anthropicKey = process.env.ANTHROPIC_API_KEY;

let languageModel: any;

if (openaiKey) {
  // Use OpenAI if available
  const { openai } = await import("@ai-sdk/openai");
  languageModel = openai.chat("gpt-4o-mini");
} else if (anthropicKey) {
  // Fall back to Anthropic
  const { anthropic } = await import("@ai-sdk/anthropic");
  languageModel = anthropic.chat("claude-3-5-sonnet-20241022");
} else {
  throw new Error(
    "No AI provider configured. Please set OPENAI_API_KEY or ANTHROPIC_API_KEY in your environment variables."
  );
}

/**
 * Task Assistant Agent
 *
 * Helps users organize, prioritize, and manage their to-do lists.
 */
export const taskAssistant = new Agent(components.agent, {
  name: "Task Assistant",
  languageModel,
  instructions: `You are a helpful task management assistant for an ultraminimal to-do list application.

Your role is to help users:
- Break down complex tasks into manageable subtasks
- Prioritize tasks based on urgency and importance
- Suggest better task descriptions and titles
- Provide motivation and productivity tips
- Answer questions about their tasks

Keep your responses:
- Concise and actionable
- Friendly but professional
- Focused on the user's specific tasks
- Practical and immediately useful

Remember: This is an ultraminimal app, so keep suggestions simple and focused.`,
});
