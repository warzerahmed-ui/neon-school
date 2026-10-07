import { DeleteStudentDialog } from "@/components/students/DeleteStudentDialog";
import { StudentFormDialog } from "@/components/students/StudentFormDialog";
import { StudentsEmptyState } from "@/components/students/StudentsEmptyState";
import { StudentsTable } from "@/components/students/StudentsTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useClasses,
  useCreateStudent,
  useDeleteStudent,
  useStudents,
  useUpdateStudent,
} from "@/hooks/use-backend";
import type { ClassId, Student, StudentInput } from "@/types";
import { Plus, Search, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ALL_CLASSES = "all";

export function StudentsPage() {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState<string>(ALL_CLASSES);
  const [formOpen, setFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  const activeClassId =
    classFilter === ALL_CLASSES ? null : (BigInt(classFilter) as ClassId);

  const studentsQuery = useStudents(search, activeClassId);
  const classesQuery = useClasses();
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();

  const students = studentsQuery.data ?? [];
  const classes = classesQuery.data ?? [];
  const hasFilters = search.trim() !== "" || classFilter !== ALL_CLASSES;

  function openCreate() {
    setEditingStudent(null);
    setFormOpen(true);
  }

  function openEdit(student: Student) {
    setEditingStudent(student);
    setFormOpen(true);
  }

  function handleSubmit(input: StudentInput) {
    if (editingStudent) {
      const id = editingStudent.id;
      updateStudent.mutate(
        { id, input },
        {
          onSuccess: () => {
            setFormOpen(false);
            setEditingStudent(null);
            toast.success("گۆڕانکارییەکان پاشەکەوتکران.");
          },
          onError: () => {
            toast.error(
              "پاشەکەوتکردن سەرکەوتوو نەبوو. تکایە دووبارە هەوڵ بدە.",
            );
          },
        },
      );
    } else {
      createStudent.mutate(input, {
        onSuccess: () => {
          setFormOpen(false);
          toast.success("قوتابی نوێ زیادکرا.");
        },
        onError: () => {
          toast.error("زیادکردن سەرکەوتوو نەبوو. تکایە دووبارە هەوڵ بدە.");
        },
      });
    }
  }

  function handleDelete() {
    if (!deletingStudent) return;
    const id = deletingStudent.id;
    deleteStudent.mutate(id, {
      onSuccess: () => {
        setDeletingStudent(null);
        toast.success("قوتابی سڕایەوە.");
      },
      onError: () => {
        toast.error("سڕینەوە سەرکەوتوو نەبوو. تکایە دووبارە هەوڵ بدە.");
      },
    });
  }

  function clearFilters() {
    setSearch("");
    setClassFilter(ALL_CLASSES);
  }

  const isFormPending = createStudent.isPending || updateStudent.isPending;

  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            قوتابیان
          </h1>
          <p className="text-sm text-muted-foreground">
            بەڕێوەبردنی تۆمارەکانی قوتابیان — گەڕان، زیادکردن، دەستکاری و
            سڕینەوە.
          </p>
        </div>
        <Button
          type="button"
          data-ocid="students.add_button"
          onClick={openCreate}
          className="gap-2 shadow-glow-cyan"
        >
          <Plus className="h-4 w-4" />
          زیادکردنی قوتابی
        </Button>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card/60 p-4 shadow-elevated sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            data-ocid="students.search_input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="گەڕان بە ناوی قوتابی..."
            aria-label="گەڕان بە ناوی قوتابی"
            className="ps-9 focus-neon"
          />
        </div>
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger
            data-ocid="students.class_filter"
            aria-label="فلتەرکردن بە پۆل"
            className="w-full focus-neon sm:w-56"
          >
            <SelectValue placeholder="هەموو پۆلەکان" />
          </SelectTrigger>
          <SelectContent className="border-border bg-popover">
            <SelectItem value={ALL_CLASSES}>هەموو پۆلەکان</SelectItem>
            {classes.map((item) => (
              <SelectItem key={item.id.toString()} value={item.id.toString()}>
                {item.name} · {item.subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {studentsQuery.isLoading ? (
        <div
          data-ocid="students.loading_state"
          className="space-y-3 rounded-xl border border-border bg-card/60 p-4 shadow-elevated"
        >
          {Array.from({ length: 5 }, (_, i) => `student-skeleton-${i}`).map(
            (id) => (
              <Skeleton key={id} className="h-12 w-full rounded-lg" />
            ),
          )}
        </div>
      ) : studentsQuery.isError ? (
        <div
          data-ocid="students.error_state"
          className="flex flex-col items-center gap-3 rounded-xl border border-destructive/40 bg-destructive/10 px-6 py-12 text-center"
        >
          <p className="text-sm text-destructive-foreground">
            هێنانی لیستی قوتابیان سەرکەوتوو نەبوو.
          </p>
          <Button
            type="button"
            variant="outline"
            data-ocid="students.retry_button"
            onClick={() => void studentsQuery.refetch()}
            className="border-neon"
          >
            هەوڵدانەوە
          </Button>
        </div>
      ) : students.length === 0 ? (
        <StudentsEmptyState
          hasFilters={hasFilters}
          onAdd={openCreate}
          onClearFilters={clearFilters}
        />
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4 text-primary" />
            <span>
              {students.length} قوتابی
              {hasFilters ? " بەپێی فلتەرەکان" : ""}
            </span>
          </div>
          <StudentsTable
            students={students}
            classes={classes}
            onEdit={openEdit}
            onDelete={setDeletingStudent}
          />
        </div>
      )}

      <StudentFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingStudent(null);
        }}
        student={editingStudent}
        classes={classes}
        isPending={isFormPending}
        onSubmit={handleSubmit}
      />

      <DeleteStudentDialog
        student={deletingStudent}
        isPending={deleteStudent.isPending}
        onCancel={() => setDeletingStudent(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
