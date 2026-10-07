import { StatCard } from "@/components/overview/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/hooks/use-backend";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  GraduationCap,
  LayoutGrid,
  RefreshCw,
  Users,
} from "lucide-react";

const SKELETON_IDS = Array.from(
  { length: 3 },
  (_, i) => `overview-skeleton-${i}`,
);

function formatCount(value: bigint): string {
  return value.toLocaleString("en-US");
}

function formatAverage(value: number): string {
  if (!Number.isFinite(value)) return "0";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
}

export function OverviewPage() {
  const { data, isLoading, isError, refetch, isFetching } = useDashboardStats();

  const totalStudents = data?.totalStudents ?? 0n;
  const totalClasses = data?.totalClasses ?? 0n;
  const averageClassSize = data?.averageClassSize ?? 0;
  const isEmpty = totalStudents === 0n && totalClasses === 0n;

  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            گشتی
          </h1>
          <p className="text-sm text-muted-foreground">
            کورتەیەکی گشتی لەسەر قوتابیان و پۆلەکان.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          data-ocid="overview.refresh_button"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="gap-2 border-neon"
        >
          <RefreshCw
            className={isFetching ? "h-4 w-4 animate-spin" : "h-4 w-4"}
            aria-hidden="true"
          />
          نوێکردنەوە
        </Button>
      </div>

      {isLoading ? (
        <div
          data-ocid="overview.loading_state"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {SKELETON_IDS.map((id) => (
            <Card key={id} className="border-border bg-card/80 shadow-elevated">
              <CardContent className="flex items-start justify-between gap-4">
                <div className="w-full space-y-3">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-9 w-20" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-11 w-11 rounded-xl" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <Card
          data-ocid="overview.error_state"
          className="border-destructive/40 bg-card/80 shadow-elevated"
        >
          <CardContent className="flex flex-col items-start gap-4 py-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/15 text-destructive">
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="space-y-1">
                <p className="font-display text-sm font-semibold text-foreground">
                  نەتوانرا ئامارەکان باربکرێن
                </p>
                <p className="text-sm text-muted-foreground">
                  پەیوەندی بە سێرڤەرەوە سەرکەوتوو نەبوو. تکایە دووبارە هەوڵ بدە.
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              data-ocid="overview.retry_button"
              onClick={() => void refetch()}
              disabled={isFetching}
              className="gap-2 border-neon"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              هەوڵدانەوە
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              index={1}
              label="کۆی قوتابیان"
              value={formatCount(totalStudents)}
              hint="قوتابی تۆمارکراو لە سیستەم"
              icon={Users}
              tone="cyan"
            />
            <StatCard
              index={2}
              label="کۆی پۆلەکان"
              value={formatCount(totalClasses)}
              hint="پۆلی چالاک"
              icon={LayoutGrid}
              tone="magenta"
            />
            <StatCard
              index={3}
              label="تێکڕای قەبارەی پۆل"
              value={formatAverage(averageClassSize)}
              hint="قوتابی بۆ هەر پۆلێک"
              icon={GraduationCap}
              tone="violet"
            />
          </div>

          {isEmpty ? (
            <Card
              data-ocid="overview.empty_state"
              className="border-border bg-card/80 shadow-elevated"
            >
              <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-glow-cyan">
                  <GraduationCap className="h-7 w-7" aria-hidden="true" />
                </span>
                <div className="space-y-1">
                  <p className="font-display text-lg font-semibold text-foreground">
                    هێشتا هیچ داتایەک نییە
                  </p>
                  <p className="mx-auto max-w-md text-sm text-muted-foreground">
                    بۆ دەستپێکردن، سەرەتا پۆلێک دروست بکە و پاشان قوتابیان تۆمار
                    بکە. ئامارەکان بە شێوەی خۆکار نوێ دەبنەوە.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button
                    asChild
                    data-ocid="overview.create_class_button"
                    className="gap-2 shadow-glow-cyan"
                  >
                    <Link to="/dashboard/classes">
                      <LayoutGrid className="h-4 w-4" aria-hidden="true" />
                      دروستکردنی پۆل
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    data-ocid="overview.add_student_button"
                    className="gap-2 border-neon"
                  >
                    <Link to="/dashboard/students">
                      <Users className="h-4 w-4" aria-hidden="true" />
                      زیادکردنی قوتابی
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </>
      )}
    </div>
  );
}
