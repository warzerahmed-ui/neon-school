import type { AuthState } from "@/hooks/use-auth";
import type {
  Class,
  ClassId,
  ClassInput,
  DashboardStats,
  Student,
  StudentId,
  StudentInput,
} from "@/types";
import { vi } from "vitest";

/**
 * A typed, in-memory stand-in for the generated `Backend` actor. Every method
 * the app's hooks call is implemented against plain arrays so component tests
 * can drive real create/read/delete flows without a replica.
 */
export interface MockBackend {
  createStudent: (input: StudentInput) => Promise<Student>;
  updateStudent: (
    id: StudentId,
    input: StudentInput,
  ) => Promise<Student | null>;
  deleteStudent: (id: StudentId) => Promise<boolean>;
  listStudents: (
    search: string | null,
    classFilter: ClassId | null,
  ) => Promise<Student[]>;
  createClass: (input: ClassInput) => Promise<Class>;
  updateClass: (id: ClassId, input: ClassInput) => Promise<Class | null>;
  deleteClass: (id: ClassId) => Promise<boolean>;
  listClasses: () => Promise<Class[]>;
  getDashboardStats: () => Promise<DashboardStats>;
}

export interface MockBackendSeed {
  students?: Student[];
  classes?: Class[];
}

/**
 * Build a mock backend seeded with fixed records. Ids are assigned
 * deterministically from the seed so assertions can name them.
 */
export function createMockBackend(seed: MockBackendSeed = {}): MockBackend {
  const students = new Map<StudentId, Student>(
    (seed.students ?? []).map((student) => [student.id, student]),
  );
  const classes = new Map<ClassId, Class>(
    (seed.classes ?? []).map((item) => [item.id, item]),
  );
  let nextStudentId =
    students.size === 0
      ? 0n
      : BigInt(Math.max(...[...students.keys()].map(Number)) + 1);
  let nextClassId =
    classes.size === 0
      ? 0n
      : BigInt(Math.max(...[...classes.keys()].map(Number)) + 1);

  function withCounts(item: Class): Class {
    let count = 0n;
    for (const student of students.values()) {
      if (student.classId === item.id) count += 1n;
    }
    return { ...item, studentCount: count };
  }

  return {
    async createStudent(input) {
      const id = nextStudentId;
      nextStudentId += 1n;
      const student: Student = {
        id,
        name: input.name,
        classId: input.classId,
        enrollmentDate: input.enrollmentDate,
      };
      students.set(id, student);
      return student;
    },
    async updateStudent(id, input) {
      const existing = students.get(id);
      if (!existing) return null;
      const updated: Student = {
        id: existing.id,
        name: input.name,
        classId: input.classId,
        enrollmentDate: input.enrollmentDate,
      };
      students.set(id, updated);
      return updated;
    },
    async deleteStudent(id) {
      return students.delete(id);
    },
    async listStudents(search, classFilter) {
      const term = search?.trim().toLowerCase() ?? "";
      return [...students.values()].filter((student) => {
        const nameOk = term === "" || student.name.toLowerCase().includes(term);
        const classOk = classFilter === null || student.classId === classFilter;
        return nameOk && classOk;
      });
    },
    async createClass(input) {
      const id = nextClassId;
      nextClassId += 1n;
      const item: Class = {
        id,
        name: input.name,
        subject: input.subject,
        studentCount: 0n,
      };
      classes.set(id, item);
      return item;
    },
    async updateClass(id, input) {
      const existing = classes.get(id);
      if (!existing) return null;
      const updated: Class = {
        id: existing.id,
        name: input.name,
        subject: input.subject,
        studentCount: existing.studentCount,
      };
      classes.set(id, updated);
      return updated;
    },
    async deleteClass(id) {
      const existed = classes.delete(id);
      if (existed) {
        for (const [studentId, student] of students) {
          if (student.classId === id) {
            students.set(studentId, { ...student, classId: undefined });
          }
        }
      }
      return existed;
    },
    async listClasses() {
      return [...classes.values()].map(withCounts);
    },
    async getDashboardStats() {
      const totalStudents = BigInt(students.size);
      const totalClasses = BigInt(classes.size);
      const averageClassSize =
        classes.size === 0 ? 0 : Number(totalStudents) / Number(totalClasses);
      return { totalStudents, totalClasses, averageClassSize };
    },
  };
}

/** A signed-in auth state with a stable, non-anonymous principal. */
export function authenticatedAuth(
  overrides: Partial<AuthState> = {},
): AuthState {
  return {
    isAuthenticated: true,
    isInitializing: false,
    isLoggingIn: false,
    isLoginError: false,
    loginError: undefined,
    principal: "2vxsx-fae-aaaaa-aaa",
    login: vi.fn(),
    logout: vi.fn(),
    ...overrides,
  };
}

/** An unauthenticated auth state, as seen before any sign-in. */
export function anonymousAuth(overrides: Partial<AuthState> = {}): AuthState {
  return {
    isAuthenticated: false,
    isInitializing: false,
    isLoggingIn: false,
    isLoginError: false,
    loginError: undefined,
    principal: null,
    login: vi.fn(),
    logout: vi.fn(),
    ...overrides,
  };
}
