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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Class, ClassId, Student, StudentInput } from "@/types";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const NO_CLASS = "none";

interface StudentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  classes: Class[];
  isPending: boolean;
  onSubmit: (input: StudentInput) => void;
}

interface FormErrors {
  name?: string;
  classId?: string;
  enrollmentDate?: string;
}

/** Convert a backend nanosecond timestamp into a `yyyy-mm-dd` input value. */
function toDateInputValue(timestamp: bigint): string {
  const date = new Date(Number(timestamp / 1_000_000n));
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

/** Convert a `yyyy-mm-dd` input value into a backend nanosecond timestamp. */
function toTimestamp(value: string): bigint {
  return BigInt(new Date(`${value}T00:00:00`).getTime()) * 1_000_000n;
}

export function StudentFormDialog({
  open,
  onOpenChange,
  student,
  classes,
  isPending,
  onSubmit,
}: StudentFormDialogProps) {
  const [name, setName] = useState("");
  const [classId, setClassId] = useState<string>(NO_CLASS);
  const [enrollmentDate, setEnrollmentDate] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const isEditing = student !== null;

  useEffect(() => {
    if (!open) return;
    if (student) {
      setName(student.name);
      setClassId(
        student.classId !== undefined ? student.classId.toString() : NO_CLASS,
      );
      setEnrollmentDate(toDateInputValue(student.enrollmentDate));
    } else {
      setName("");
      setClassId(NO_CLASS);
      setEnrollmentDate(new Date().toISOString().slice(0, 10));
    }
    setErrors({});
  }, [open, student]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      nextErrors.name = "تکایە ناوی قوتابی بنووسە (لانیکەم ٢ پیت).";
    }
    if (enrollmentDate === "") {
      nextErrors.enrollmentDate = "تکایە بەرواری تۆمارکردن هەڵبژێرە.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      name: trimmedName,
      classId: classId === NO_CLASS ? undefined : (BigInt(classId) as ClassId),
      enrollmentDate: toTimestamp(enrollmentDate),
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-ocid="students.form_dialog"
        className="border-border bg-card shadow-elevated sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-lg text-foreground">
            {isEditing ? "دەستکاریکردنی قوتابی" : "زیادکردنی قوتابی نوێ"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEditing
              ? "زانیارییەکانی قوتابی بگۆڕە و پاشەکەوتی بکە."
              : "زانیارییەکانی قوتابی نوێ پڕ بکەرەوە بۆ زیادکردنی بۆ لیستەکە."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="student-name" className="text-foreground">
              ناوی قوتابی
            </Label>
            <Input
              id="student-name"
              data-ocid="students.name_input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="بۆ نموونە: ئاراس محەمەد"
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "student-name-error" : undefined}
              className="focus-neon"
            />
            {errors.name ? (
              <p
                id="student-name-error"
                data-ocid="students.name_error"
                className="text-xs text-destructive"
              >
                {errors.name}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="student-class" className="text-foreground">
              پۆل
            </Label>
            <Select value={classId} onValueChange={setClassId}>
              <SelectTrigger
                id="student-class"
                data-ocid="students.class_select"
                className="w-full focus-neon"
              >
                <SelectValue placeholder="پۆل هەڵبژێرە" />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover">
                <SelectItem value={NO_CLASS}>بێ پۆل</SelectItem>
                {classes.map((item) => (
                  <SelectItem
                    key={item.id.toString()}
                    value={item.id.toString()}
                  >
                    {item.name} · {item.subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="student-date" className="text-foreground">
              بەرواری تۆمارکردن
            </Label>
            <Input
              id="student-date"
              type="date"
              data-ocid="students.date_input"
              value={enrollmentDate}
              onChange={(event) => setEnrollmentDate(event.target.value)}
              aria-invalid={errors.enrollmentDate ? true : undefined}
              aria-describedby={
                errors.enrollmentDate ? "student-date-error" : undefined
              }
              className="focus-neon"
            />
            {errors.enrollmentDate ? (
              <p
                id="student-date-error"
                data-ocid="students.date_error"
                className="text-xs text-destructive"
              >
                {errors.enrollmentDate}
              </p>
            ) : null}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              data-ocid="students.cancel_button"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="border-neon"
            >
              پاشگەزبوونەوە
            </Button>
            <Button
              type="submit"
              data-ocid="students.submit_button"
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
                "زیادکردنی قوتابی"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
