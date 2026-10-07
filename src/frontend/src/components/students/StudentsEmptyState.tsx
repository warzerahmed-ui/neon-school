import { Button } from "@/components/ui/button";
import { GraduationCap, Plus, SearchX } from "lucide-react";

interface StudentsEmptyStateProps {
  hasFilters: boolean;
  onAdd: () => void;
  onClearFilters: () => void;
}

export function StudentsEmptyState({
  hasFilters,
  onAdd,
  onClearFilters,
}: StudentsEmptyStateProps) {
  return (
    <div
      data-ocid="students.empty_state"
      className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-card/60 px-6 py-16 text-center shadow-elevated"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-glow-cyan">
        {hasFilters ? (
          <SearchX className="h-8 w-8" />
        ) : (
          <GraduationCap className="h-8 w-8" />
        )}
      </span>

      <div className="space-y-1">
        <h2 className="font-display text-lg font-semibold text-foreground">
          {hasFilters
            ? "هیچ قوتابییەک نەدۆزرایەوە"
            : "هێشتا هیچ قوتابییەک نییە"}
        </h2>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          {hasFilters
            ? "گەڕانەکەت هیچ ئەنجامێکی نەبوو. فلتەرەکان بگۆڕە یان پاکییان بکەرەوە."
            : "یەکەم قوتابی زیاد بکە بۆ ئەوەی لیستەکە دەست پێ بکات."}
        </p>
      </div>

      {hasFilters ? (
        <Button
          type="button"
          variant="outline"
          data-ocid="students.clear_filters_button"
          onClick={onClearFilters}
          className="border-neon"
        >
          پاککردنەوەی فلتەرەکان
        </Button>
      ) : (
        <Button
          type="button"
          data-ocid="students.empty_add_button"
          onClick={onAdd}
          className="gap-2 shadow-glow-cyan"
        >
          <Plus className="h-4 w-4" />
          زیادکردنی یەکەم قوتابی
        </Button>
      )}
    </div>
  );
}
