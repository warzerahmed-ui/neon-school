import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Student } from "@/types";
import { Loader2 } from "lucide-react";

interface DeleteStudentDialogProps {
  student: Student | null;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteStudentDialog({
  student,
  isPending,
  onCancel,
  onConfirm,
}: DeleteStudentDialogProps) {
  return (
    <AlertDialog
      open={student !== null}
      onOpenChange={(open) => {
        if (!open && !isPending) onCancel();
      }}
    >
      <AlertDialogContent
        data-ocid="students.delete_dialog"
        className="border-border bg-card shadow-elevated"
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-lg text-foreground">
            سڕینەوەی قوتابی
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            دڵنیایت لە سڕینەوەی{" "}
            <span className="font-semibold text-foreground">
              {student?.name}
            </span>
            ؟ ئەم کردارە ناگەڕێتەوە.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            data-ocid="students.delete_cancel_button"
            disabled={isPending}
            className="border-neon"
          >
            پاشگەزبوونەوە
          </AlertDialogCancel>
          <AlertDialogAction
            data-ocid="students.delete_confirm_button"
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault();
              onConfirm();
            }}
            className="gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                سڕینەوە...
              </>
            ) : (
              "سڕینەوە"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
