import { RequireAuth } from "@/components/auth/RequireAuth";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { anonymousAuth, authenticatedAuth } from "./test-utils";

const useAuthMock = vi.fn();

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock("@tanstack/react-router", () => ({
  Navigate: ({ to }: { to: string }) => (
    <div data-ocid="navigate" data-to={to} />
  ),
}));

describe("RequireAuth", () => {
  beforeEach(() => {
    useAuthMock.mockReset();
  });

  it("renders children for an authenticated user", () => {
    useAuthMock.mockReturnValue(authenticatedAuth());
    render(
      <RequireAuth>
        <div data-ocid="protected">secret dashboard</div>
      </RequireAuth>,
    );

    expect(screen.getByTestId("protected")).toBeInTheDocument();
    expect(screen.queryByTestId("navigate")).not.toBeInTheDocument();
  });

  it("shows a loading state while the session is restoring", () => {
    useAuthMock.mockReturnValue(
      anonymousAuth({ isInitializing: true, isAuthenticated: false }),
    );
    render(
      <RequireAuth>
        <div data-ocid="protected">secret dashboard</div>
      </RequireAuth>,
    );

    expect(screen.getByTestId("auth.loading_state")).toBeInTheDocument();
    expect(screen.queryByTestId("protected")).not.toBeInTheDocument();
  });

  it("redirects an unauthenticated visitor to the login page", () => {
    useAuthMock.mockReturnValue(anonymousAuth());
    render(
      <RequireAuth>
        <div data-ocid="protected">secret dashboard</div>
      </RequireAuth>,
    );

    expect(screen.getByTestId("navigate")).toHaveAttribute("data-to", "/login");
    expect(screen.queryByTestId("protected")).not.toBeInTheDocument();
  });
});
