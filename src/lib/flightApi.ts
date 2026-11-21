// Client for the AWS flight API (API Gateway → Lambda → DynamoDB).
// The browser holds no AWS credentials; it only calls these public HTTP endpoints.
const DEFAULT_API_URL = "https://q991h28tt5.execute-api.us-east-1.amazonaws.com";

export const FLIGHT_API_URL = (
  (import.meta.env["VITE_FLIGHT_API_URL"] as string | undefined) ?? DEFAULT_API_URL
).replace(/\/+$/, "");

export type PlanName = "tokyo" | "seoul" | "london";

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
};

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

export async function subscribe(input: {
  email: string;
  plan_name: PlanName;
  target_price: number;
}): Promise<void> {
  const res = await fetch(`${FLIGHT_API_URL}/subscribe`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await readError(res));
}
