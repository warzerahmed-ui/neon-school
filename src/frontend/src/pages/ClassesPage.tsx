import { ClassFormDialog } from "@/components/classes/ClassFormDialog";
import { ClassesEmptyState } from "@/components/classes/ClassesEmptyState";
import { ClassesTable } from "@/components/classes/ClassesTable";
import { DeleteClassDialog } from "@/components/classes/DeleteClassDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useClasses,
  useCreateClass,
  useDeleteClass,
  useUpdateClass,
} from "@/hooks/use-backend";
import type { Class, ClassInput } from "@/types";
import { AlertTriangle, BookOpen, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SKELETON_ROWS = Array.from(
  { length: 4 },
  (_, i) => `class-skeleton-${i}`,
);

export function ClassesPage() {
  const { data: classes, isLoading, isError, refetch } = useClasses();
  const createClass = useCreateClass();
  const updateClass = useUpdateClass();
  const deleteClass = useDeleteClass();

  const [formOpen, setFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Class | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const items = classes ?? [];
  const totalStudents = items.reduce(
    (sum, item) => sum + Number(item.studentCount),
    0,
  );

  function openCreate() {
    setEditingClass(null);
    setFormError(null);
    setFormOpen(true);
  }

  function openEdit(item: Class) {
    setEditingClass(item);
    setFormError(null);
    setFormOpen(true);
  }

  function handleSubmit(input: ClassInput) {
    setFormError(null);
    if (editingClass) {
      const target = editingClass;
      updateClass.mutate(
        { id: target.id, input },
        {
          onSuccess: () => {
            setFormOpen(false);
            setEditingClass(null);
            toast.success("پۆل نوێکرایەوە", { description: input.name });
          },
          onError: () => {
            setFormError("نوێکردنەوەی پۆل سەرکەوتوو نەبوو. دووبارە هەوڵ بدە.");
          },
        },
      );
      return;
    }
    createClass.mutate(input, {
      onSuccess: () => {
        setFormOpen(false);
        toast.success("پۆل زیادکرا", { description: input.name });
      },
      onError: () => {
        setFormError("زیادکردنی پۆل سەرکەوتوو نەبوو. دووبارە هەوڵ بدە.");
      },
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    deleteClass.mutate(target.id, {
      onSuccess: () => {
        setDeleteTarget(null);
        toast.success("پۆل سڕایەوە", { description: target.name });
      },
      onError: () => {
        setDeleteTarget(null);
        toast.error("سڕینەوەی پۆل سەرکەوتوو نەبوو.");
      },
    });
  }

  const isFormPending = createClass.isPending || updateClass.isPending;

  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            پۆلەکان
          </h1>
          <p className="text-sm text-muted-foreground">
            پۆل و وانەکان بەڕێوە ببە و قوتابیان بە هەر پۆلێکەوە ببەستەوە.
          </p>
        </div>
        <Button
          type="button"
          data-ocid="classes.create_button"
          onClick={openCreate}
          className="gap-2 shadow-glow-cyan"
        >
          <Plus className="h-4 w-4" />
          پۆلی نوێ
        </Button>
      </div>

      {!isLoading && !isError && items.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:max-w-md">
          <div className="rounded-xl border border-border bg-card/80 p-4 shadow-elevated">
            <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
              کۆی پۆلەکان
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-primary">
              {items.length}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card/80 p-4 shadow-elevated">
            <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
              کۆی قوتابیان
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-accent">
              {totalStudents}
            </p>
          </div>
        </div>
      ) : null}

      {isLoading ? (
        <div
          data-ocid="classes.loading_state"
          className="space-y-3 rounded-xl border border-border bg-card/80 p-4 shadow-elevated"
        >
          {SKELETON_ROWS.map((id) => (
            <Skeleton key={id} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <div
          data-ocid="classes.error_state"
          className="flex flex-col items-center gap-4 rounded-xl border border-destructive/40 bg-destructive/10 px-6 py-12 text-center"
        >
          <AlertTriangle className="h-8 w-8 text-destructive" />
          <div className="space-y-1">
            <h2 className="font-display text-lg font-semibold text-foreground">
              بارکردنی پۆلەکان سەرکەوتوو نەبوو
            </h2>
            <p className="text-sm text-muted-foreground">
              پەیوەندی بە سێرڤەرەوە دروست نەبوو. دووبارە هەوڵ بدە.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            data-ocid="classes.retry_button"
            onClick={() => void refetch()}
            className="gap-2 border-neon"
          >
            <RefreshCw className="h-4 w-4" />
            هەوڵدانەوە
          </Button>
        </div>
      ) : items.length === 0 ? (
        <ClassesEmptyState onCreate={openCreate} />
      ) : (
        <ClassesTable
          classes={items}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
        />
      )}

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <BookOpen className="h-3.5 w-3.5 text-primary" />
        <span>
          دەتوانیت لە فۆرمی قوتابی، پۆلێک بۆ هەر قوتابییەک دیاری بکەیت.
        </span>
      </div>

      <ClassFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingClass(null);
        }}
        editingClass={editingClass}
        onSubmit={handleSubmit}
        isPending={isFormPending}
        errorMessage={formError}
      />

      <DeleteClassDialog
        target={deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={handleDelete}
        isPending={deleteClass.isPending}
      />
    </div>
  );
}
