import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export interface AuthState {
  /** True once a valid, non-anonymous identity is present. */
  isAuthenticated: boolean;
  /** True while the stored session is being restored on mount. */
  isInitializing: boolean;
  /** True while an interactive sign-in is in flight. */
  isLoggingIn: boolean;
  /** True when the last sign-in attempt failed. */
  isLoginError: boolean;
  /** The error from the last failed sign-in attempt, if any. */
  loginError?: Error;
  /** The signed-in principal as text, or null. */
  principal: string | null;
  /** Start an Internet Identity sign-in. */
  login: () => void;
  /** Clear the session and sign out. */
  logout: () => void;
}

/**
 * Thin, typed wrapper over the platform Internet Identity context so pages and
 * guards depend on one stable auth surface.
 */
export function useAuth(): AuthState {
  const {
    identity,
    login,
    clear,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    isLoginError,
    loginError,
  } = useInternetIdentity();

  return {
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    isLoginError,
    loginError,
    principal: identity ? identity.getPrincipal().toText() : null,
    login: () => login(),
    logout: () => clear(),
  };
}
