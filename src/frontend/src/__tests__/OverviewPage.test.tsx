import { OverviewPage } from "@/pages/OverviewPage";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const useDashboardStatsMock = vi.fn();

vi.mock("@/hooks/use-backend", () => ({
  useDashboardStats: () => useDashboardStatsMock(),
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    children,
    ...rest
  }: {
    to: string;
    children: React.ReactNode;
  }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
}));

function statsQuery(overrides: Record<string, unknown> = {}) {
  return {
    data: undefined,
    isLoading: false,
    isError: false,
    isFetching: false,
    refetch: vi.fn(),
    ...overrides,
  };
}

describe("OverviewPage", () => {
  beforeEach(() => {
    useDashboardStatsMock.mockReset();
  });

  it("renders the three summary stat cards with formatted values", () => {
    useDashboardStatsMock.mockReturnValue(
      statsQuery({
        data: {
          totalStudents: 12n,
          totalClasses: 3n,
          averageClassSize: 4,
        },
      }),
    );
    render(<OverviewPage />);

    expect(screen.getByTestId("overview.stat_card.1")).toHaveTextContent("12");
    expect(screen.getByTestId("overview.stat_card.2")).toHaveTextContent("3");
    expect(screen.getByTestId("overview.stat_card.3")).toHaveTextContent("4");
  });

  it("shows a loading state while stats are fetching", () => {
    useDashboardStatsMock.mockReturnValue(statsQuery({ isLoading: true }));
    render(<OverviewPage />);

    expect(screen.getByTestId("overview.loading_state")).toBeInTheDocument();
    expect(
      screen.queryByTestId("overview.stat_card.1"),
    ).not.toBeInTheDocument();
  });

  it("shows an error state with a retry action when the query fails", () => {
    const refetch = vi.fn();
    useDashboardStatsMock.mockReturnValue(
      statsQuery({ isError: true, refetch }),
    );
    render(<OverviewPage />);

    expect(screen.getByTestId("overview.error_state")).toBeInTheDocument();
    expect(screen.getByTestId("overview.retry_button")).toBeInTheDocument();
  });

  it("shows the empty state when there are no students or classes", () => {
    useDashboardStatsMock.mockReturnValue(
      statsQuery({
        data: { totalStudents: 0n, totalClasses: 0n, averageClassSize: 0 },
      }),
    );
    render(<OverviewPage />);

    expect(screen.getByTestId("overview.empty_state")).toBeInTheDocument();
  });
});
