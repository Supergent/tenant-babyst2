/**
 * Convex Client Configuration
 *
 * Creates the Convex React client for frontend data fetching.
 */

import { ConvexReactClient } from "convex/react";

export const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL!
);
