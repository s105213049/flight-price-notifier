import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Radar } from "lucide-react";

import { useAuthenticatedUser } from "@/components/AuthenticatedLayout";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/use-page-meta";
import { supabase } from "@/integrations/supabase/client";

export default function AppDashboard() {
  usePageMeta({
    title: "Dashboard — Flight Price Notifier",
    description: "你的航線追蹤儀表板。",
    robots: "noindex",
  });
  const user = useAuthenticatedUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
        <div
          className="animate-fade-up mt-10 rounded-2xl border border-dashed border-primary/40 bg-gradient-card p-8 shadow-card sm:p-12"
          style={{ animationDelay: "120ms" }}
        >
          <span className="grid size-12 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary-glow">
            <Radar className="size-6" />
          </span>
          <p className="mt-6 text-lg font-medium text-foreground sm:text-xl">
            你的航線追蹤儀表板即將上線 — 下一個里程碑會加上訂閱航線的功能。
          </p>
          <p className="mt-3 text-muted-foreground">
            Your dashboard is coming soon. Route-subscription will be added in the next milestone.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
