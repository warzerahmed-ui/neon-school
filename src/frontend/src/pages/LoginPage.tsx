import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "@tanstack/react-router";
import { AlertTriangle, Fingerprint, GraduationCap } from "lucide-react";

export function LoginPage() {
  const {
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    isLoginError,
    loginError,
    login,
  } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 start-1/4 h-96 w-96 animate-glow-drift rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 end-1/4 h-96 w-96 animate-glow-drift rounded-full bg-accent/20 blur-3xl"
      />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-card/80 shadow-elevated backdrop-blur-md lg:grid-cols-2">
        <section className="relative hidden flex-col justify-between bg-glass p-10 lg:flex">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 animate-neon-pulse rounded-full bg-primary shadow-glow-cyan" />
            <span className="font-display text-sm font-semibold tracking-widest text-foreground uppercase">
              نیۆن شەو
            </span>
          </div>

          <div className="space-y-5">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15 text-primary shadow-glow-cyan">
              <GraduationCap className="h-7 w-7" />
            </span>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">
              سیستەمی <span className="text-neon-gradient">بەڕێوەبردنی</span>{" "}
              قوتابخانە
            </h1>
            <p className="max-w-sm text-base leading-relaxed text-muted-foreground">
              قوتابیان و پۆلەکان بە شێوەیەکی ڕوون و خێرا بەڕێوە ببە — لە ژوورێکی
              کۆنترۆڵی نیۆنی.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs tracking-wider text-muted-foreground uppercase">
            <span className="h-px flex-1 bg-gradient-to-r from-primary/60 to-transparent" />
            <span>Neon Şev · Control Room</span>
          </div>
        </section>

        <section className="flex flex-col justify-center gap-6 p-8 sm:p-10">
          <div className="space-y-2 lg:hidden">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary shadow-glow-cyan">
              <GraduationCap className="h-6 w-6" />
            </span>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              سیستەمی بەڕێوەبردنی قوتابخانە
            </h1>
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-xl font-semibold text-foreground">
              چوونەژوورەوە
            </h2>
            <p className="text-sm text-muted-foreground">
              بە Internet Identity بچۆ ژوورەوە — هیچ وشەیەکی نهێنی پێویست نییە.
            </p>
          </div>

          {isLoginError ? (
            <div
              data-ocid="auth.error_state"
              role="alert"
              className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive-foreground"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <span>
                چوونەژوورەوە سەرکەوتوو نەبوو. تکایە دووبارە هەوڵ بدە.
                {loginError?.message ? (
                  <span
                    className="mt-1 block font-mono text-xs opacity-80"
                    dir="ltr"
                  >
                    {loginError.message}
                  </span>
                ) : null}
              </span>
            </div>
          ) : null}

          <Button
            type="button"
            size="lg"
            data-ocid="auth.login_button"
            onClick={login}
            disabled={isInitializing || isLoggingIn}
            className="w-full gap-2 shadow-glow-cyan"
          >
            {isInitializing || isLoggingIn ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
                {isInitializing ? "دەستپێکردن..." : "چوونەژوورەوە..."}
              </>
            ) : (
              <>
                <Fingerprint className="h-5 w-5" />
                چوونەژوورەوە بە Internet Identity
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            بەردەوامبوون واتە ڕەزامەندی لەسەر مەرجەکانی بەکارهێنان.
          </p>
        </section>
      </div>
    </div>
  );
}
