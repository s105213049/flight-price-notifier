import { Link } from "react-router";
import { ArrowRight, BellRing, Radar, CalendarX2 } from "lucide-react";

import { useAuth } from "@/components/AuthProvider";
import { FarePreview } from "@/components/FarePreview";
import { FeatureCard } from "@/components/FeatureCard";
import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/use-page-meta";

const TITLE = "Flight Price Notifier — 機票降價通知";
const DESCRIPTION =
  "設定航線與目標價，機票降價就通知你。Set a route and a target price — we email you when the fare drops.";


const features = [
  {
    icon: Radar,
    title: "盯緊熱門航線",
    subtitle: "Always-on route watching",
    description: "持續監控台北出發的熱門航線（東京、首爾），自動抓最低票價。",
  },
  {
    icon: BellRing,
    title: "達標自動通知",
    subtitle: "Target-price email alerts",
    description: "低於你設定的目標價，就寄 email 提醒你，附上立即訂購連結。",
  },
  {
    icon: CalendarX2,
    title: "隨時取消",
    subtitle: "Cancel anytime",
    description: "月訂閱制，不想用隨時停，沒有綁約。",
  },
];

function HeaderActions() {
  const { session } = useAuth();
  if (session) {
    return (
      <Button asChild variant="hero" size="sm">
        <Link to="/app">
          Dashboard <ArrowRight />
        </Link>
      </Button>
    );
  }
  return (
    <Button asChild variant="hero" size="sm">
      <Link to="/auth">Sign in / 登入</Link>
    </Button>
  );
}

function HeroActions() {
  const { session } = useAuth();
  if (session) {
    return (
      <Button asChild variant="hero" size="xl">
        <Link to="/app">
          前往儀表板 Dashboard <ArrowRight />
        </Link>
      </Button>
    );
  }
  return (
    <>
      <Button asChild variant="hero" size="xl">
        <Link to="/signup">
          免費開始 Get started <ArrowRight />
        </Link>
      </Button>
      <Button asChild variant="glass" size="xl">
        <Link to="/auth">Sign in / 登入</Link>
      </Button>
    </>
  );
}

export default function Index() {
  usePageMeta({ title: TITLE, description: DESCRIPTION });

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[720px] bg-hero-glow" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[720px] bg-grid" />

      <SiteHeader actions={<HeaderActions />} />

      <main className="relative">
        <section className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-24 pt-16 sm:px-8 md:pt-24 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-border bg-foreground/5 px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="size-1.5 rounded-full bg-success" />
              台北出發 · 東京 · 首爾
            </p>
            <h1
              className="animate-fade-up mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-gradient sm:text-6xl lg:text-7xl"
              style={{ animationDelay: "80ms" }}
            >
              Flight Price Notifier
            </h1>
            <p
              className="animate-fade-up mt-6 text-xl font-medium text-foreground sm:text-2xl"
              style={{ animationDelay: "160ms" }}
            >
              設定航線與目標價，機票降價就通知你
            </p>
            <p
              className="animate-fade-up mt-3 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg"
              style={{ animationDelay: "220ms" }}
            >
              Set a route and a target price — we email you when the fare drops.
            </p>
            <div
              className="animate-fade-up mt-9 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "300ms" }}
            >
              <HeroActions />
            </div>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: "250ms" }}>
            <FarePreview />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-28 sm:px-8">
          <Reveal className="mb-12 max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary-glow">Features</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              不用天天比價，預算內的機票自己找上門
            </h2>
            <p className="mt-4 text-muted-foreground">
              For travelers who are flexible on dates and firm on budget.
            </p>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.subtitle} delay={i * 100} className="h-full">
                <FeatureCard {...f} />
              </Reveal>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
