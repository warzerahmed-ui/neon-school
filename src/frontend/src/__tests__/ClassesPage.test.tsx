import { ClassesPage } from "@/pages/ClassesPage";
import type { Class, ClassInput } from "@/types";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEffect, useState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

interface Store {
  classes: Class[];
  version: number;
  listeners: Set<() => void>;
}

const store: Store = { classes: [], version: 0, listeners: new Set() };

function bump() {
  store.version += 1;
  for (const listener of store.listeners) listener();
}

function resetStore() {
  store.classes = [];
  store.version = 0;
  store.listeners = new Set();
}

function useStoreVersion(): number {
  const [version, setVersion] = useState(store.version);
  useEffect(() => {
    const listener = () => setVersion(store.version);
    store.listeners.add(listener);
    return () => {
      store.listeners.delete(listener);
    };
  }, []);
  return version;
}

function useClassesMock() {
  useStoreVersion();
  return {
    data: store.classes,
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  };
}

function useCreateClassMock() {
  return {
    isPending: false,
    mutate: (input: ClassInput, opts?: { onSuccess?: () => void }) => {
      const id = BigInt(store.classes.length);
      store.classes = [
        ...store.classes,
        { id, name: input.name, subject: input.subject, studentCount: 0n },
      ];
      bump();
      opts?.onSuccess?.();
    },
  };
}

function useUpdateClassMock() {
  return {
    isPending: false,
    mutate: (
      { id, input }: { id: bigint; input: ClassInput },
      opts?: { onSuccess?: () => void },
    ) => {
      store.classes = store.classes.map((item) =>
        item.id === id
          ? { ...item, name: input.name, subject: input.subject }
          : item,
      );
      bump();
      opts?.onSuccess?.();
    },
  };
}

function useDeleteClassMock() {
  return {
    isPending: false,
    mutate: (id: bigint, opts?: { onSuccess?: () => void }) => {
      store.classes = store.classes.filter((item) => item.id !== id);
      bump();
      opts?.onSuccess?.();
    },
  };
}

vi.mock("@/hooks/use-backend", () => ({
  useClasses: () => useClassesMock(),
  useCreateClass: () => useCreateClassMock(),
  useUpdateClass: () => useUpdateClassMock(),
  useDeleteClass: () => useDeleteClassMock(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

beforeEach(() => {
  resetStore();
  Element.prototype.hasPointerCapture = () => false;
  Element.prototype.setPointerCapture = () => {};
  Element.prototype.releasePointerCapture = () => {};
  Element.prototype.scrollIntoView = () => {};
});

describe("ClassesPage", () => {
  it("shows the empty state when there are no classes", () => {
    render(<ClassesPage />);
    expect(screen.getByTestId("classes.empty_state")).toBeInTheDocument();
  });

  it("creates a class and shows it in the list", async () => {
    const user = userEvent.setup();
    render(<ClassesPage />);

    await user.click(screen.getByTestId("classes.create_button"));
    const dialog = await screen.findByTestId("classes.form_dialog");
    await user.type(
      within(dialog).getByTestId("classes.name_input"),
      "پۆلی ١٠",
    );
    await user.type(
      within(dialog).getByTestId("classes.subject_input"),
      "بیرکاری",
    );
    await user.click(within(dialog).getByTestId("classes.submit_button"));

    await waitFor(() => {
      expect(screen.getByTestId("classes.table")).toBeInTheDocument();
    });
    expect(screen.getByText("پۆلی ١٠")).toBeInTheDocument();
    expect(screen.getByText("بیرکاری")).toBeInTheDocument();
  });

  it("validates that name and subject are required", async () => {
    const user = userEvent.setup();
    render(<ClassesPage />);

    await user.click(screen.getByTestId("classes.create_button"));
    const dialog = await screen.findByTestId("classes.form_dialog");
    await user.click(within(dialog).getByTestId("classes.submit_button"));

    expect(
      within(dialog).getByTestId("classes.name_error"),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByTestId("classes.subject_error"),
    ).toBeInTheDocument();
    expect(store.classes).toHaveLength(0);
  });

  it("deletes a class only after confirmation", async () => {
    store.classes = [
      { id: 0n, name: "پۆلی ١٠", subject: "بیرکاری", studentCount: 0n },
    ];
    const user = userEvent.setup();
    render(<ClassesPage />);

    await user.click(screen.getByTestId("classes.delete_button.1"));
    const dialog = await screen.findByTestId("classes.delete_dialog");
    await user.click(
      within(dialog).getByTestId("classes.delete_confirm_button"),
    );

    await waitFor(() => {
      expect(screen.getByTestId("classes.empty_state")).toBeInTheDocument();
    });
  });
});
