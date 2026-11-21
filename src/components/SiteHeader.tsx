import type { ReactNode } from "react";

import { Logo } from "@/components/Logo";

export function SiteHeader({ actions }: { actions?: ReactNode }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo />
        <div className="flex items-center gap-2">{actions}</div>
      </div>
    </header>
  );
}
