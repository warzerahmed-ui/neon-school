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
import type { Class } from "@/types";
import { Loader2, TriangleAlert } from "lucide-react";

interface DeleteClassDialogProps {
  target: Class | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
}

/** Confirmation step before a class is permanently removed. */
export function DeleteClassDialog({
  target,
  onOpenChange,
  onConfirm,
  isPending,
}: DeleteClassDialogProps) {
  const studentCount = target ? Number(target.studentCount) : 0;

  return (
    <AlertDialog open={target !== null} onOpenChange={onOpenChange}>
      <AlertDialogContent
        data-ocid="classes.delete_dialog"
        className="border-border bg-card shadow-elevated"
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 font-display text-lg">
            <TriangleAlert className="h-5 w-5 text-destructive" />
            سڕینەوەی پۆل
          </AlertDialogTitle>
          <AlertDialogDescription>
            دڵنیایت لە سڕینەوەی{" "}
            <span className="font-semibold text-foreground">
              {target?.name}
            </span>
            ؟ ئەم کردارە ناگەڕێتەوە.
            {studentCount > 0 ? (
              <span className="mt-2 block text-destructive">
                {studentCount} قوتابی لەم پۆلەدا تۆمارکراون و بێ پۆل دەبن.
              </span>
            ) : null}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            data-ocid="classes.delete_cancel_button"
            disabled={isPending}
          >
            پاشگەزبوونەوە
          </AlertDialogCancel>
          <AlertDialogAction
            data-ocid="classes.delete_confirm_button"
            onClick={(event) => {
              event.preventDefault();
              onConfirm();
            }}
            disabled={isPending}
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
