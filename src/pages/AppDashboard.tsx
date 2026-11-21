import { useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";

import { useAuthenticatedUser } from "@/components/AuthenticatedLayout";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { PlanCard } from "@/components/PlanCard";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/use-page-meta";
import { supabase } from "@/integrations/supabase/client";
import { PLANS, listSubscriptions, subscribe, type PlanName } from "@/lib/flightApi";

export default function AppDashboard() {
  usePageMeta({
    title: "Dashboard — Flight Price Notifier",
    description: "你的航線追蹤儀表板。",
    robots: "noindex",
  });
  const user = useAuthenticatedUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const email = (user.email ?? "").toLowerCase();

  const subsQuery = useQuery({
    queryKey: ["subscriptions", email],
    queryFn: () => listSubscriptions(email),
    enabled: email !== "",
  });

  const subscribeMutation = useMutation({
    mutationFn: (input: { plan_name: PlanName; target_price: number }) =>
      subscribe({ email, ...input }),
    onSuccess: async (_data, input) => {
      const plan = PLANS.find((p) => p.name === input.plan_name);
      toast.success(`已開始追蹤 ${plan?.label ?? ""}，目標價 NT$${input.target_price.toLocaleString("zh-TW")}`);
      await queryClient.invalidateQueries({ queryKey: ["subscriptions", email] });
    },
    onError: (err) => {
      toast.error(`訂閱失敗：${err instanceof Error ? err.message : "請稍後再試"}`);
    },
  });

  const subscriptions = subsQuery.data ?? [];

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    await navigate("/", { replace: true });
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-hero-glow" />
      <SiteHeader
        actions={
          <Button variant="glass" size="sm" onClick={handleSignOut}>
            <LogOut /> Sign out / 登出
          </Button>
        }
      />
      <main className="relative mx-auto w-full max-w-6xl flex-1 px-5 py-16 sm:px-8">
        <h1 className="animate-fade-up break-all text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Hi {user.email}
        </h1>
        <p className="animate-fade-up mt-3 text-muted-foreground" style={{ animationDelay: "60ms" }}>
          選一條航線、設定新台幣目標價。我們每 30 分鐘查一次下個月的最低票價，達標就寄 email 通知你。
        </p>
        {subsQuery.isError ? (
          <p className="mt-6 text-sm text-destructive">
            讀取訂閱失敗：{subsQuery.error instanceof Error ? subsQuery.error.message : "未知錯誤"}
          </p>
        ) : null}
        {subsQuery.isPending && email !== "" ? (
          <p className="mt-10 inline-flex items-center gap-2 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> 載入你的訂閱…
          </p>
        ) : (
          <div
            className="animate-fade-up mt-10 grid gap-6 md:grid-cols-2"
            style={{ animationDelay: "120ms" }}
          >
            {PLANS.map((plan) => (
              <PlanCard
                key={plan.name}
                plan={plan}
                subscription={subscriptions.find((s) => s.route === plan.route)}
                saving={
                  subscribeMutation.isPending &&
                  subscribeMutation.variables?.plan_name === plan.name
                }
                onSubmit={(target_price) =>
                  subscribeMutation.mutate({ plan_name: plan.name, target_price })
                }
              />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
