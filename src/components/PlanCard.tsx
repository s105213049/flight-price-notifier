import { useEffect, useState, type FormEvent } from "react";
import { BellRing, CheckCircle2, Loader2, Plane } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Plan, Subscription } from "@/lib/flightApi";

const twd = new Intl.NumberFormat("zh-TW");

type PlanCardProps = {
  plan: Plan;
  subscription: Subscription | undefined;
  saving: boolean;
  onSubmit: (targetPrice: number) => void;
};

/** One fixed route (Tokyo / Seoul) with a TWD target-price input and its subscribed state. */
export function PlanCard({ plan, subscription, saving, onSubmit }: PlanCardProps) {
  const subscribed = subscription !== undefined;
  const [value, setValue] = useState<string>(
    subscription ? String(subscription.target_price) : "",
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (subscription) setValue(String(subscription.target_price));
  }, [subscription]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const price = Number(value.replace(/[,\s]/g, ""));
    if (!Number.isFinite(price) || price <= 0) {
      setError("請輸入大於 0 的新台幣金額");
      return;
    }
    setError(null);
    onSubmit(Math.round(price));
  }

  const inputId = `target-${plan.name}`;

  return (
    <div className="relative rounded-3xl border-2 border-border bg-gradient-card p-6 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <span className="grid size-11 place-items-center rounded-2xl border-2 border-secondary-foreground/20 bg-secondary text-primary-glow">
          <Plane className="size-5" />
        </span>
        {subscribed ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">
            <CheckCircle2 className="size-3.5" />
            已訂閱
          </span>
        ) : null}
      </div>

      <h2 className="mt-5 text-2xl font-semibold text-foreground">{plan.label}</h2>
      <p className="mt-1 font-mono text-sm text-muted-foreground">
        {plan.origin} → {plan.destination} · 下個月最低價
      </p>

      {subscribed ? (
        <div className="mt-5 rounded-2xl border-2 border-primary/40 bg-accent p-4">
          <p className="text-xs text-muted-foreground">目前目標價 Target</p>
          <p className="mt-1 font-mono text-lg font-semibold text-foreground">
            NT${twd.format(subscription.target_price)}
          </p>
        </div>
      ) : null}

      <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {subscribed ? "新的目標價（新台幣）" : "目標價（新台幣）"}
        </label>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-muted-foreground">NT$</span>
          <Input
            id={inputId}
            inputMode="numeric"
            placeholder={String(plan.referencePrice)}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={saving}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          參考：最近最低約 NT${twd.format(plan.referencePrice)}，目標價設得比它高就會很快收到通知。
        </p>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? <Loader2 className="animate-spin" /> : <BellRing />}
          {subscribed ? "更新目標價" : "開始追蹤"}
        </Button>
      </form>
    </div>
  );
}
