import { BellRing, TrendingDown } from "lucide-react";

/** Illustrative product preview: a watched route whose fare dropped below target. */
export function FarePreview() {
  return (
    <div className="relative mx-auto w-full max-w-md animate-float">
      <div className="absolute -inset-6 rounded-[2rem] bg-primary/20 blur-3xl" />
      <div className="relative rounded-2xl border border-border bg-gradient-card p-6 shadow-card">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Watching
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">
            <TrendingDown className="size-3.5" />
            降價了
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between font-mono">
          <div>
            <p className="text-3xl font-semibold text-foreground">TPE</p>
            <p className="text-xs text-muted-foreground">台北</p>
          </div>
          <div className="relative mx-4 h-px flex-1 bg-border">
            <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-glow shadow-glow" />
          </div>
          <div className="text-right">
            <p className="text-3xl font-semibold text-foreground">NRT</p>
            <p className="text-xs text-muted-foreground">東京</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-background/40 p-4">
            <p className="text-xs text-muted-foreground">目標價 Target</p>
            <p className="mt-1 font-mono text-lg text-foreground">NT$8,000</p>
          </div>
          <div className="rounded-xl border border-primary/40 bg-primary/10 p-4">
            <p className="text-xs text-muted-foreground">目前最低 Lowest</p>
            <p className="mt-1 font-mono text-lg font-semibold text-primary-glow">NT$7,450</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-background/40 p-3.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-gradient-primary">
            <BellRing className="size-4 text-primary-foreground" />
          </span>
          <p className="text-sm text-muted-foreground">
            Email sent · <span className="text-foreground">立即訂購 →</span>
          </p>
        </div>
      </div>
    </div>
  );
}
