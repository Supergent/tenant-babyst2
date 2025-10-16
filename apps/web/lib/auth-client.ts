/**
 * Better Auth Client Configuration
 *
 * Client-side authentication utilities for the frontend.
 * CRITICAL: Must use /client/plugins path for convexClient plugin.
 */

import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins"; // CRITICAL: Must be /client/plugins NOT /client

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  plugins: [
    convexClient(), // Integrates Better Auth with Convex
  ],
});

// Export useful hooks
export const {
  useSession,
  signIn,
  signUp,
  signOut,
  useUser,
} = authClient;
