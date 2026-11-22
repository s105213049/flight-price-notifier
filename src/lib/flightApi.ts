// Client for the AWS flight API (API Gateway → Lambda → DynamoDB).
// The browser holds no AWS credentials; it only calls these public HTTP endpoints.
const DEFAULT_API_URL = "https://q991h28tt5.execute-api.us-east-1.amazonaws.com";

export const FLIGHT_API_URL = (
  (import.meta.env["VITE_FLIGHT_API_URL"] as string | undefined) ?? DEFAULT_API_URL
).replace(/\/+$/, "");

export type PlanName = "tokyo" | "seoul" | "london";

export type SubscriptionStatus = "pending_payment" | "active" | "cancelled" | "expired";

export type Subscription = {
  email: string;
  route: string;
  plan_name: PlanName;
  origin: string;
  destination: string;
  target_price: number;
  currency: "TWD";
  created_at: string;
  updated_at: string;
  /** Missing on rows created before M2 (unpaid legacy rows) — treat as pending_payment. */
  subscription_status?: SubscriptionStatus;
  /** Last day of the paid period, Asia/Taipei date (YYYY-MM-DD). */
  current_period_end_date?: string;
};

/** Monthly price shown in the UI. The charged amount comes from the server (flight/ecpay secret). */
export const MONTHLY_PRICE_TWD = 300;

export function statusOf(sub: Subscription | undefined): SubscriptionStatus | undefined {
  if (!sub) return undefined;
  return sub.subscription_status ?? "pending_payment";
}

export type Plan = {
  name: PlanName;
  label: string;
  cityZh: string;
  origin: string;
  destination: string;
  route: string;
  referencePrice: number;
};

export const PLANS: Plan[] = [
  {
    name: "tokyo",
    label: "台北 ✈ 東京",
    cityZh: "東京",
    origin: "TPE",
    destination: "TYO",
    route: "TPE-TYO",
    referencePrice: 9325,
  },
  {
    name: "seoul",
    label: "台北 ✈ 首爾",
    cityZh: "首爾",
    origin: "TPE",
    destination: "SEL",
    route: "TPE-SEL",
    referencePrice: 5989,
  },
  {
    name: "london",
    label: "台北 ✈ 倫敦",
    cityZh: "倫敦",
    origin: "TPE",
    destination: "LON",
    route: "TPE-LON",
    referencePrice: 23854,
  },
];

async function readError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string };
    return body.error ?? `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status}`;
  }
}

export async function listSubscriptions(email: string): Promise<Subscription[]> {
  const res = await fetch(`${FLIGHT_API_URL}/subscriptions?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error(await readError(res));
  const body = (await res.json()) as { subscriptions?: Subscription[] };
  return body.subscriptions ?? [];
}

export type SubscribeResult =
  | { kind: "checkout"; html: string }
  | { kind: "updated"; subscription_status: SubscriptionStatus; current_period_end_date?: string };

/**
 * POST /subscribe. Two kinds of success response:
 * - text/html: an auto-submitting ECPay checkout form (new / unpaid / expired subscription)
 * - application/json: target price updated in place (already active, or cancelled but still in its paid period)
 */
export async function subscribe(input: {
  email: string;
  plan_name: PlanName;
  target_price: number;
}): Promise<SubscribeResult> {
  const res = await fetch(`${FLIGHT_API_URL}/subscribe`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await readError(res));
  const ctype = res.headers.get("content-type") ?? "";
  if (ctype.includes("text/html")) {
    return { kind: "checkout", html: await res.text() };
  }
  const body = (await res.json()) as {
    subscription_status?: SubscriptionStatus;
    current_period_end_date?: string;
  };
  return {
    kind: "updated",
    subscription_status: body.subscription_status ?? "active",
    current_period_end_date: body.current_period_end_date,
  };
}

/**
 * Hand the browser to ECPay. Scripts inside innerHTML never run, so rebuild the
 * server-signed form as real DOM nodes (values untouched — they are covered by CheckMacValue) and submit it.
 */
export function submitCheckout(html: string): void {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const source = doc.querySelector("form");
  if (!source) throw new Error("付款表單格式錯誤");
  const form = document.createElement("form");
  form.method = "POST";
  form.action = source.getAttribute("action") ?? "";
  form.style.display = "none";
  source.querySelectorAll("input").forEach((field) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = field.getAttribute("name") ?? "";
    input.value = field.getAttribute("value") ?? "";
    form.appendChild(input);
  });
  document.body.appendChild(form);
  form.submit();
}

export async function cancelSubscription(input: {
  email: string;
  route: string;
}): Promise<{ subscription_status: SubscriptionStatus; current_period_end_date?: string }> {
  const res = await fetch(`${FLIGHT_API_URL}/cancel`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await readError(res));
  return (await res.json()) as { subscription_status: SubscriptionStatus; current_period_end_date?: string };
}
