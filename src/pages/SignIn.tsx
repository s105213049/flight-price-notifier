import { useEffect } from "react";
import { useNavigate } from "react-router";

import { AuthForm } from "@/components/AuthForm";
import { AuthLayout } from "@/components/AuthLayout";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { usePageMeta } from "@/hooks/use-page-meta";
import { friendlyAuthError } from "@/lib/authErrors";

export default function SignInPage() {
  usePageMeta({
    title: "Sign in / 登入 — Flight Price Notifier",
    description: "登入 Flight Price Notifier，管理你的航線與目標價。",
  });
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (session) void navigate("/app", { replace: true });
  }, [session, navigate]);

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return friendlyAuthError(error.message);
    await navigate("/app", { replace: true });
    return null;
  }

  return (
    <AuthLayout>
      <AuthForm mode="signin" onSubmit={signIn} />
    </AuthLayout>
  );
}
