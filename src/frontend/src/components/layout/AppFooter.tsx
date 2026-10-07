export function AppFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-muted/40 px-6 py-4">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
        <span className="font-display tracking-widest uppercase">
          سیستەمی بەڕێوەبردنی قوتابخانە
        </span>
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
            window.location.hostname,
          )}`}
          target="_blank"
          rel="noreferrer"
          className="transition-smooth hover:text-primary"
        >
          © {year}. Built with love using caffeine.ai
        </a>
      </div>
    </footer>
  );
}
