import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { BookOpen, GraduationCap, LayoutDashboard, X } from "lucide-react";

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  ocid: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    to: "/dashboard",
    label: "گشتی",
    icon: LayoutDashboard,
    ocid: "nav.overview_link",
  },
  {
    to: "/dashboard/students",
    label: "قوتابیان",
    icon: GraduationCap,
    ocid: "nav.students_link",
  },
  {
    to: "/dashboard/classes",
    label: "پۆلەکان",
    icon: BookOpen,
    ocid: "nav.classes_link",
  },
];

interface DashboardSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function DashboardSidebar({ open, onClose }: DashboardSidebarProps) {
  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="داخستنی لیستی ڕێنمایی"
          data-ocid="nav.close_sidebar_button"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden"
        />
      ) : null}

      <aside
        data-ocid="nav.sidebar"
        className={cn(
          "fixed inset-y-0 start-0 z-50 flex w-72 flex-col border-e border-sidebar-border bg-sidebar transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0",
          open
            ? "translate-x-0"
            : "-translate-x-full rtl:translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 animate-neon-pulse rounded-full bg-primary shadow-glow-cyan" />
            <span className="font-display text-sm font-semibold tracking-widest text-sidebar-foreground uppercase">
              نیۆن شەو
            </span>
          </div>
          <button
            type="button"
            aria-label="داخستنی لیستی ڕێنمایی"
            data-ocid="nav.close_sidebar_button"
            onClick={onClose}
            className="text-muted-foreground transition-smooth hover:text-foreground lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                data-ocid={item.ocid}
                activeOptions={{ exact: item.to === "/dashboard" }}
                onClick={onClose}
                className="group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-smooth hover:bg-sidebar-accent hover:text-sidebar-foreground"
                activeProps={{
                  className:
                    "bg-sidebar-accent text-sidebar-foreground shadow-glow-cyan before:absolute before:inset-y-2 before:start-0 before:w-0.5 before:rounded-full before:bg-primary",
                }}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <p className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
            v1.0 · نیۆن شەو
          </p>
        </div>
      </aside>
    </>
  );
}
