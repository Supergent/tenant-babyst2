import { defineApp } from "convex/server";
import betterAuth from "@convex-dev/better-auth/convex.config";
import rateLimiter from "@convex-dev/rate-limiter/convex.config";
import agent from "@convex-dev/agent/convex.config";
import textStreaming from "@convex-dev/persistent-text-streaming/convex.config";

const app = defineApp();

// Better Auth MUST be first
app.use(betterAuth);

// Rate limiting for API protection
app.use(rateLimiter);

// AI agent for task assistance
app.use(agent);

// Real-time text streaming for AI responses
app.use(textStreaming);

export default app;
