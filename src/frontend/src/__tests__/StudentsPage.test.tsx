import { StudentsPage } from "@/pages/StudentsPage";
import type { Class, ClassId, Student, StudentInput } from "@/types";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEffect, useState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// --- Stateful in-memory backend store -------------------------------------
// The page reads through `useStudents`/`useClasses` and writes through the
// mutation hooks. A shared store plus a version counter lets the mocked hooks
// re-render the page exactly as React Query would after invalidation.

interface Store {
  students: Student[];
  classes: Class[];
  version: number;
  listeners: Set<() => void>;
}

const store: Store = {
  students: [],
  classes: [],
  version: 0,
  listeners: new Set(),
};

function bump() {
  store.version += 1;
  for (const listener of store.listeners) listener();
}

function resetStore() {
  store.students = [];
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

function useStudentsMock(search: string, classFilter: ClassId | null) {
  useStoreVersion();
  const term = search.trim().toLowerCase();
  const data = store.students.filter((student) => {
    const nameOk = term === "" || student.name.toLowerCase().includes(term);
    const classOk = classFilter === null || student.classId === classFilter;
    return nameOk && classOk;
  });
  return { data, isLoading: false, isError: false, refetch: vi.fn() };
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

function useCreateStudentMock() {
  return {
    isPending: false,
    mutate: (input: StudentInput, opts?: { onSuccess?: () => void }) => {
      const id = BigInt(store.students.length);
      store.students = [
        ...store.students,
        {
          id,
          name: input.name,
          classId: input.classId,
          enrollmentDate: input.enrollmentDate,
        },
      ];
      bump();
      opts?.onSuccess?.();
    },
  };
}

function useUpdateStudentMock() {
  return {
    isPending: false,
    mutate: (
      { id, input }: { id: bigint; input: StudentInput },
      opts?: { onSuccess?: () => void },
    ) => {
      store.students = store.students.map((student) =>
        student.id === id
          ? {
              id: student.id,
              name: input.name,
              classId: input.classId,
              enrollmentDate: input.enrollmentDate,
            }
          : student,
      );
      bump();
      opts?.onSuccess?.();
    },
  };
}

function useDeleteStudentMock() {
  return {
    isPending: false,
    mutate: (id: bigint, opts?: { onSuccess?: () => void }) => {
      store.students = store.students.filter((student) => student.id !== id);
      bump();
      opts?.onSuccess?.();
    },
  };
}

vi.mock("@/hooks/use-backend", () => ({
  useStudents: (search: string, classFilter: ClassId | null) =>
    useStudentsMock(search, classFilter),
  useClasses: () => useClassesMock(),
  useCreateStudent: () => useCreateStudentMock(),
  useUpdateStudent: () => useUpdateStudentMock(),
  useDeleteStudent: () => useDeleteStudentMock(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

// Radix Select relies on pointer-capture APIs jsdom does not implement.
beforeEach(() => {
  resetStore();
  Element.prototype.hasPointerCapture = () => false;
  Element.prototype.setPointerCapture = () => {};
  Element.prototype.releasePointerCapture = () => {};
  Element.prototype.scrollIntoView = () => {};
});

function seedClass(id: bigint, name: string, subject: string): Class {
  return { id, name, subject, studentCount: 0n };
}

describe("StudentsPage", () => {
  it("shows the empty state when there are no students", () => {
    render(<StudentsPage />);
    expect(screen.getByTestId("students.empty_state")).toBeInTheDocument();
  });

  it("adds a student through the form and shows it in the list", async () => {
    store.classes = [seedClass(0n, "پۆلی ١٠", "بیرکاری")];
    const user = userEvent.setup();
    render(<StudentsPage />);

    await user.click(screen.getByTestId("students.add_button"));

    const dialog = await screen.findByTestId("students.form_dialog");
    await user.type(within(dialog).getByTestId("students.name_input"), "ئاراس");
    await user.click(within(dialog).getByTestId("students.submit_button"));

    await waitFor(() => {
      expect(screen.getByTestId("students.table")).toBeInTheDocument();
    });
    expect(screen.getByText("ئاراس")).toBeInTheDocument();
  });

  it("filters the list by the search term", async () => {
    store.students = [
      { id: 0n, name: "ئاراس", classId: undefined, enrollmentDate: 0n },
      { id: 1n, name: "دلێر", classId: undefined, enrollmentDate: 0n },
    ];
    const user = userEvent.setup();
    render(<StudentsPage />);

    expect(screen.getByText("ئاراس")).toBeInTheDocument();
    expect(screen.getByText("دلێر")).toBeInTheDocument();

    await user.type(screen.getByTestId("students.search_input"), "ئاراس");

    await waitFor(() => {
      expect(screen.queryByText("دلێر")).not.toBeInTheDocument();
    });
    expect(screen.getByText("ئاراس")).toBeInTheDocument();
  });

  it("deletes a student only after confirmation", async () => {
    store.students = [
      { id: 0n, name: "ئاراس", classId: undefined, enrollmentDate: 0n },
    ];
    const user = userEvent.setup();
    render(<StudentsPage />);

    await user.click(screen.getByTestId("students.delete_button.1"));

    const dialog = await screen.findByTestId("students.delete_dialog");
    expect(within(dialog).getByText("ئاراس")).toBeInTheDocument();

    await user.click(
      within(dialog).getByTestId("students.delete_confirm_button"),
    );

    await waitFor(() => {
      expect(screen.getByTestId("students.empty_state")).toBeInTheDocument();
    });
  });

  it("keeps the student when the delete confirmation is cancelled", async () => {
    store.students = [
      { id: 0n, name: "ئاراس", classId: undefined, enrollmentDate: 0n },
    ];
    const user = userEvent.setup();
    render(<StudentsPage />);

    await user.click(screen.getByTestId("students.delete_button.1"));
    const dialog = await screen.findByTestId("students.delete_dialog");
    await user.click(
      within(dialog).getByTestId("students.delete_cancel_button"),
    );

    await waitFor(() => {
      expect(
        screen.queryByTestId("students.delete_dialog"),
      ).not.toBeInTheDocument();
    });
    expect(screen.getByText("ئاراس")).toBeInTheDocument();
  });
});
