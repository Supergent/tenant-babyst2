"use client";

/**
 * Convex Provider with Better Auth
 *
 * Wraps the app with Convex + Better Auth integration.
 * This must be a client component.
 */

"use client";

import { ConvexProviderWithAuth } from "@convex-dev/better-auth/react";
import { convex } from "@/lib/convex";
import { authClient } from "@/lib/auth-client";
import { ReactNode } from "react";
import { AppProviders } from "@jn78bp632rvzbm5y1dw8ewfbzd7sj714/components";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithAuth client={convex} authClient={authClient}>
      <AppProviders>{children}</AppProviders>
    </ConvexProviderWithAuth>
  );
}
