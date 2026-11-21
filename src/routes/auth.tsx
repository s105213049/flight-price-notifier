import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { AuthForm } from "@/components/AuthForm";
import { AuthLayout } from "@/components/AuthLayout";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { friendlyAuthError } from "@/lib/authErrors";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in / 登入 — Flight Price Notifier" },
      { name: "description", content: "登入 Flight Price Notifier，管理你的航線與目標價。" },
      { property: "og:title", content: "Sign in — Flight Price Notifier" },
      { property: "og:description", content: "登入 Flight Price Notifier，管理你的航線與目標價。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (session) void navigate({ to: "/app", replace: true });
  }, [session, navigate]);

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return friendlyAuthError(error.message);
    await navigate({ to: "/app", replace: true });
    return null;
  }

  return (
    <AuthLayout>
      <AuthForm mode="signin" onSubmit={signIn} />
    </AuthLayout>
  );
}
