import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { shortenPrincipal } from "@/lib/format";
import { LogOut, Menu, ShieldCheck } from "lucide-react";

interface DashboardHeaderProps {
  onOpenSidebar: () => void;
}

export function DashboardHeader({ onOpenSidebar }: DashboardHeaderProps) {
  const { principal, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-md md:px-6">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="کردنەوەی لیستی ڕێنمایی"
        data-ocid="nav.open_sidebar_button"
        onClick={onOpenSidebar}
        className="lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary shadow-glow-cyan sm:flex">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-semibold text-foreground">
            سیستەمی بەڕێوەبردنی قوتابخانە
          </p>
          <p
            className="truncate font-mono text-xs text-muted-foreground"
            dir="ltr"
          >
            {principal ? shortenPrincipal(principal) : "—"}
          </p>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        data-ocid="auth.logout_button"
        onClick={logout}
        className="gap-2 border-neon"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">چوونەدەرەوە</span>
      </Button>
    </header>
  );
}
