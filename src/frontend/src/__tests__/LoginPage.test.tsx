import { LoginPage } from "@/pages/LoginPage";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { anonymousAuth, authenticatedAuth } from "./test-utils";

const useAuthMock = vi.fn();

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => useAuthMock(),
}));

// `Navigate` is only reached in the authenticated branch; stub it so the test
// can assert the redirect target without booting a full router.
vi.mock("@tanstack/react-router", () => ({
  Navigate: ({ to }: { to: string }) => (
    <div data-ocid="navigate" data-to={to} />
  ),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    useAuthMock.mockReset();
  });

  it("renders the neon login page with a sign-in button", () => {
    useAuthMock.mockReturnValue(anonymousAuth());
    render(<LoginPage />);

    expect(screen.getByTestId("auth.login_button")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Internet Identity/ }),
    ).toBeEnabled();
  });

  it("calls login when the sign-in button is clicked", async () => {
    const login = vi.fn();
    useAuthMock.mockReturnValue(anonymousAuth({ login }));
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.click(screen.getByTestId("auth.login_button"));

    expect(login).toHaveBeenCalledTimes(1);
  });

  it("shows a loading label and disables the button while logging in", () => {
    useAuthMock.mockReturnValue(anonymousAuth({ isLoggingIn: true }));
    render(<LoginPage />);

    expect(screen.getByTestId("auth.login_button")).toBeDisabled();
    expect(screen.getByText("چوونەژوورەوە...")).toBeInTheDocument();
  });

  it("shows an error state when the last sign-in failed", () => {
    useAuthMock.mockReturnValue(
      anonymousAuth({
        isLoginError: true,
        loginError: new Error("popup closed"),
      }),
    );
    render(<LoginPage />);

    expect(screen.getByTestId("auth.error_state")).toBeInTheDocument();
    expect(screen.getByText("popup closed")).toBeInTheDocument();
  });

  it("redirects an authenticated visitor to the dashboard", () => {
    useAuthMock.mockReturnValue(authenticatedAuth());
    render(<LoginPage />);

    expect(screen.getByTestId("navigate")).toHaveAttribute(
      "data-to",
      "/dashboard",
    );
  });
});
