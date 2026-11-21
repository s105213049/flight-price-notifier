import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "signin" | "signup";

const copy = {
  signin: {
    title: "Sign in / 登入",
    subtitle: "歡迎回來，繼續追蹤你的航線。",
    submit: "Sign in",
    switchText: "還沒有帳號？",
    switchLabel: "Sign up / 註冊",
    switchTo: "/signup",
  },
  signup: {
    title: "Sign up / 註冊",
    subtitle: "建立帳號，開始盯緊機票價格。",
    submit: "Create account",
    switchText: "已經有帳號？",
    switchLabel: "Sign in / 登入",
    switchTo: "/auth",
  },
} as const;

export function AuthForm({
  mode,
  onSubmit,
  notice,
}: {
  mode: Mode;
  onSubmit: (email: string, password: string) => Promise<string | null>;
  notice?: string | null;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const t = copy[mode];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const message = await onSubmit(email.trim(), password);
    setPending(false);
    if (message) setError(message);
  }

  return (
    <div className="w-full max-w-sm animate-fade-up rounded-2xl border border-border bg-gradient-card p-8 shadow-card">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t.subtitle}</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 bg-background/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            minLength={6}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 bg-background/50"
          />
          {mode === "signup" && (
            <p className="text-xs text-muted-foreground">至少 6 個字元 · At least 6 characters</p>
          )}
        </div>

        {error && (
          <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
        {notice && (
          <p className="rounded-lg border border-success/40 bg-success/10 px-3 py-2 text-sm text-success">
            {notice}
          </p>
        )}

        <Button type="submit" variant="hero" size="xl" className="w-full" disabled={pending}>
          {pending && <Loader2 className="animate-spin" />}
          {t.submit}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t.switchText}{" "}
        <Link to={t.switchTo} className="font-medium text-primary-glow hover:underline">
          {t.switchLabel}
        </Link>
      </p>
    </div>
  );
}
