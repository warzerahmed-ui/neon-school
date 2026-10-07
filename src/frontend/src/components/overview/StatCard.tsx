import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type StatTone = "cyan" | "magenta" | "violet";

interface StatCardProps {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  tone: StatTone;
  index: number;
}

const toneStyles: Record<
  StatTone,
  { icon: string; glow: string; rail: string }
> = {
  cyan: {
    icon: "bg-primary/15 text-primary",
    glow: "shadow-glow-cyan",
    rail: "from-primary/70 to-primary/0",
  },
  magenta: {
    icon: "bg-accent/15 text-accent",
    glow: "shadow-glow-magenta",
    rail: "from-accent/70 to-accent/0",
  },
  violet: {
    icon: "bg-chart-5/15 text-chart-5",
    glow: "shadow-glow-soft",
    rail: "from-chart-5/70 to-chart-5/0",
  },
};

/**
 * Neon summary stat card: glowing icon chip, large display value, and a
 * gradient rail that lights up on hover.
 */
export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone,
  index,
}: StatCardProps) {
  const styles = toneStyles[tone];

  return (
    <Card
      data-ocid={`overview.stat_card.${index}`}
      className={cn(
        "group relative overflow-hidden border-border bg-card/80 shadow-elevated transition-smooth",
        "hover:-translate-y-0.5 hover:border-neon",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 top-0 h-px bg-gradient-to-r opacity-60 transition-opacity duration-300 group-hover:opacity-100",
          styles.rail,
        )}
      />
      <CardContent className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="font-display text-3xl font-bold leading-none tracking-tight text-foreground tabular-nums md:text-4xl">
            {value}
          </p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-smooth group-hover:scale-105",
            styles.icon,
            styles.glow,
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </CardContent>
    </Card>
  );
}
