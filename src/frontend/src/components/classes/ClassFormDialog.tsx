import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Class, ClassInput } from "@/types";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ClassFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When provided the dialog edits this class; otherwise it creates one. */
  editingClass: Class | null;
  onSubmit: (input: ClassInput) => void;
  isPending: boolean;
  errorMessage: string | null;
}

interface FormErrors {
  name?: string;
  subject?: string;
}

/**
 * Create / rename dialog for a class. Owns its own draft state so a refetch
 * never clobbers what the user is typing.
 */
export function ClassFormDialog({
  open,
  onOpenChange,
  editingClass,
  onSubmit,
  isPending,
  errorMessage,
}: ClassFormDialogProps) {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const isEditing = editingClass !== null;

  // Seed the draft once per open, from the record being edited.
  useEffect(() => {
    if (!open) return;
    setName(editingClass?.name ?? "");
    setSubject(editingClass?.subject ?? "");
    setErrors({});
  }, [open, editingClass]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedSubject = subject.trim();

    const nextErrors: FormErrors = {};
    if (trimmedName === "") nextErrors.name = "ناوی پۆل پێویستە.";
    if (trimmedSubject === "") nextErrors.subject = "ناوی وانە پێویستە.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({ name: trimmedName, subject: trimmedSubject });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-ocid="classes.form_dialog"
        className="border-border bg-card shadow-elevated sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            {isEditing ? "دەستکاریکردنی پۆل" : "زیادکردنی پۆلی نوێ"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "ناو و وانەی پۆلەکە نوێ بکەرەوە."
              : "ناو و وانەی پۆلەکە بنووسە بۆ زیادکردنی."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="class-name">ناوی پۆل</Label>
            <Input
              id="class-name"
              data-ocid="classes.name_input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="بۆ نموونە: پۆلی ١٠ی ئەلف"
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "class-name-error" : undefined}
              autoComplete="off"
            />
            {errors.name ? (
              <p
                id="class-name-error"
                data-ocid="classes.name_error"
                className="text-xs text-destructive"
              >
                {errors.name}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="class-subject">وانە / پلە</Label>
            <Input
              id="class-subject"
              data-ocid="classes.subject_input"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="بۆ نموونە: بیرکاری"
              aria-invalid={errors.subject ? true : undefined}
              aria-describedby={
                errors.subject ? "class-subject-error" : undefined
              }
              autoComplete="off"
            />
            {errors.subject ? (
              <p
                id="class-subject-error"
                data-ocid="classes.subject_error"
                className="text-xs text-destructive"
              >
                {errors.subject}
              </p>
            ) : null}
          </div>

          {errorMessage ? (
            <p
              data-ocid="classes.form_error"
              role="alert"
              className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive-foreground"
            >
              {errorMessage}
            </p>
          ) : null}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              data-ocid="classes.cancel_button"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              پاشگەزبوونەوە
            </Button>
            <Button
              type="submit"
              data-ocid="classes.submit_button"
              disabled={isPending}
              className="gap-2 shadow-glow-cyan"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  پاشەکەوتکردن...
                </>
              ) : isEditing ? (
                "پاشەکەوتکردنی گۆڕانکاری"
              ) : (
                "زیادکردنی پۆل"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
