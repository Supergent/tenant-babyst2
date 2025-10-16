"use client";

import * as React from "react";
import { ToastProvider } from "./toast";

/**
 * Theme Provider
 *
 * Handles theme switching and CSS variables.
 * Currently a pass-through, but can be extended for dark mode.
 */
export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <>{children}</>;
};

/**
 * App Providers (Base)
 *
 * Base providers that don't require Convex/Auth.
 * Use this in app-specific providers that will add ConvexProviderWithAuth.
 *
 * Note: Convex + Auth providers should be added at the app level (apps/web/providers/)
 * to avoid circular dependencies and ensure proper client-side hydration.
 */
export const AppProviders: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  );
};
