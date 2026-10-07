import { createActor } from "@/backend";
import type {
  Class,
  ClassId,
  ClassInput,
  DashboardStats,
  Student,
  StudentId,
  StudentInput,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/** Shared actor handle for the school backend. */
export function useBackend() {
  return useActor(createActor);
}

export function useDashboardStats() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<DashboardStats>({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.getDashboardStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStudents(search: string, classFilter: ClassId | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Student[]>({
    queryKey: ["students", search, classFilter?.toString() ?? null],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listStudents(
        search.trim() === "" ? null : search,
        classFilter,
      );
    },
    enabled: !!actor && !isFetching,
  });
}

export function useClasses() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Class[]>({
    queryKey: ["classes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listClasses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateStudent() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: StudentInput) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.createStudent(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["students"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      void queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
}

export function useUpdateStudent() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: { id: StudentId; input: StudentInput }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.updateStudent(id, input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["students"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      void queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
}

export function useDeleteStudent() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: StudentId) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.deleteStudent(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["students"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      void queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
}

export function useCreateClass() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ClassInput) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.createClass(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["classes"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useUpdateClass() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: ClassId; input: ClassInput }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.updateClass(id, input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["classes"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useDeleteClass() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: ClassId) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.deleteClass(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["classes"] });
      void queryClient.invalidateQueries({ queryKey: ["students"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}
