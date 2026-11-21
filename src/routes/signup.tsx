import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { AuthForm } from "@/components/AuthForm";
import { AuthLayout } from "@/components/AuthLayout";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { friendlyAuthError } from "@/lib/authErrors";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up / 註冊 — Flight Price Notifier" },
      { name: "description", content: "建立 Flight Price Notifier 帳號，機票降到目標價就收到 email。" },
      { property: "og:title", content: "Sign up — Flight Price Notifier" },
      { property: "og:description", content: "建立帳號，機票降到目標價就收到 email 通知。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SignUpPage,
});

function SignUpPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (session) void navigate({ to: "/app", replace: true });
  }, [session, navigate]);

  async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) return friendlyAuthError(error.message);
    if (data.session) {
      await navigate({ to: "/app", replace: true });
    } else {
      setNotice("請到信箱點擊確認連結後再登入。Check your email to confirm your account.");
    }
    return null;
  }

  return (
    <AuthLayout>
      <AuthForm mode="signup" onSubmit={signUp} notice={notice} />
    </AuthLayout>
  );
}
