import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";

/**
 * Route guard: renders children only for authenticated users. While the stored
 * session is restoring it shows a neon loading state; unauthenticated visitors
 * are redirected to the login route.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div
        data-ocid="auth.loading_state"
        className="flex min-h-screen items-center justify-center bg-background"
      >
        <div className="flex flex-col items-center gap-4">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
          <p className="font-display text-sm tracking-widest text-muted-foreground uppercase">
            دەستپێکردن...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
