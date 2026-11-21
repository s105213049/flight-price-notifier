export function SiteFooter() {
  return (
    <footer className="relative">
      <div aria-hidden className="h-8 bg-gingham opacity-70" />
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:px-8">
        <p>© 2026 Flight Price Notifier</p>
        <p className="font-mono text-xs tracking-wide">TPE → NRT · ICN</p>
      </div>
    </footer>
  );
}
