import { Button } from "@/components/ui/button";
import { BookOpen, Plus } from "lucide-react";

interface ClassesEmptyStateProps {
  onCreate: () => void;
}

/** First-run state: no classes exist yet, with a clear primary action. */
export function ClassesEmptyState({ onCreate }: ClassesEmptyStateProps) {
  return (
    <div
      data-ocid="classes.empty_state"
      className="flex flex-col items-center justify-center gap-5 rounded-xl border border-dashed border-border bg-card/60 px-6 py-16 text-center shadow-elevated"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-glow-cyan">
        <BookOpen className="h-8 w-8" />
      </span>
      <div className="space-y-1.5">
        <h2 className="font-display text-lg font-semibold text-foreground">
          هێشتا هیچ پۆلێک نییە
        </h2>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          یەکەم پۆلت دروست بکە بۆ ئەوەی قوتابیان بە وانە و پلەوە ببەستیتەوە.
        </p>
      </div>
      <Button
        type="button"
        data-ocid="classes.empty_create_button"
        onClick={onCreate}
        className="gap-2 shadow-glow-cyan"
      >
        <Plus className="h-4 w-4" />
        زیادکردنی یەکەم پۆل
      </Button>
    </div>
  );
}
