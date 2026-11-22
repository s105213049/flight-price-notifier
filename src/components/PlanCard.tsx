import { useEffect, useState, type FormEvent } from "react";
import { BellRing, CheckCircle2, Clock, CreditCard, Loader2, Plane, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MONTHLY_PRICE_TWD,
  statusOf,
  type Plan,
  type Subscription,
  type SubscriptionStatus,
} from "@/lib/flightApi";

const twd = new Intl.NumberFormat("zh-TW");

type PlanCardProps = {
  plan: Plan;
  subscription: Subscription | undefined;
  saving: boolean;
  cancelling: boolean;
  onSubmit: (targetPrice: number) => void;
  onCancel: () => void;
};

function StatusBadge({ status, until }: { status: SubscriptionStatus; until?: string }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">
        <CheckCircle2 className="size-3.5" />
        已訂閱
      </span>
    );
  }
  if (status === "cancelled") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
        <Clock className="size-3.5" />
        已取消{until ? ` · 服務至 ${until}` : ""}
      </span>
    );
  }
  if (status === "expired") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
        <XCircle className="size-3.5" />
        已過期
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-medium text-amber-600">
      <CreditCard className="size-3.5" />
      待付款
    </span>
  );
}

/** One fixed route with a TWD target-price input and its subscription / payment state. */
export function PlanCard({ plan, subscription, saving, cancelling, onSubmit, onCancel }: PlanCardProps) {
  const status = statusOf(subscription);
  const paid = status === "active" || status === "cancelled";
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
  const busy = saving || cancelling;
  let submitLabel = `訂閱並付款 NT$${MONTHLY_PRICE_TWD}／月`;
  if (paid) submitLabel = "更新目標價";
  else if (status === "pending_payment") submitLabel = `完成付款 NT$${MONTHLY_PRICE_TWD}／月`;

  return (
    <div className="relative rounded-3xl border-2 border-border bg-gradient-card p-6 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <span className="grid size-11 place-items-center rounded-2xl border-2 border-secondary-foreground/20 bg-secondary text-primary-glow">
          <Plane className="size-5" />
        </span>
        {status ? <StatusBadge status={status} until={subscription?.current_period_end_date} /> : null}
      </div>

      <h2 className="mt-5 text-2xl font-semibold text-foreground">{plan.label}</h2>
      <p className="mt-1 font-mono text-sm text-muted-foreground">
        {plan.origin} → {plan.destination} · 下個月最低價
      </p>

      {subscription ? (
        <div className="mt-5 rounded-2xl border-2 border-primary/40 bg-accent p-4">
          <p className="text-xs text-muted-foreground">目前目標價 Target</p>
          <p className="mt-1 font-mono text-lg font-semibold text-foreground">
            NT${twd.format(subscription.target_price)}
          </p>
          {status === "active" && subscription.current_period_end_date ? (
            <p className="mt-1 text-xs text-muted-foreground">
              本期至 {subscription.current_period_end_date}，到期自動續扣
            </p>
          ) : null}
          {status === "pending_payment" ? (
            <p className="mt-1 text-xs text-muted-foreground">尚未付款，付款後才會開始寄送降價通知。</p>
          ) : null}
          {status === "cancelled" ? (
            <p className="mt-1 text-xs text-muted-foreground">
              不會再扣款，{subscription.current_period_end_date ?? "本期結束"} 前仍會收到通知。
            </p>
          ) : null}
        </div>
      ) : null}

      <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {subscription ? "新的目標價（新台幣）" : "目標價（新台幣）"}
        </label>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-muted-foreground">NT$</span>
          <Input
            id={inputId}
            inputMode="numeric"
            placeholder={String(plan.referencePrice)}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={busy}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          參考：最近最低約 NT${twd.format(plan.referencePrice)}，目標價設得比它高就會很快收到通知。
        </p>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={busy}>
          {saving ? <Loader2 className="animate-spin" /> : paid ? <BellRing /> : <CreditCard />}
          {submitLabel}
        </Button>
      </form>

      {status === "active" ? (
        <Button
          type="button"
          variant="ghost"
          className="mt-2 w-full text-muted-foreground"
          disabled={busy}
          onClick={onCancel}
        >
          {cancelling ? <Loader2 className="animate-spin" /> : null}
          取消訂閱
        </Button>
      ) : null}
    </div>
  );
}
