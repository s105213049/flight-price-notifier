import type { LucideIcon } from "lucide-react";

export function FeatureCard({
  icon: Icon,
  title,
  subtitle,
  description,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
}) {
  return (
    <article className="group relative h-full overflow-hidden rounded-3xl border-2 border-border bg-gradient-card p-7 shadow-card stitch transition-[border-color,transform] hover:-translate-y-1 hover:border-primary/40">
      <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-secondary/70 blur-3xl transition-opacity group-hover:bg-secondary" />
      <span className="mb-6 grid size-11 place-items-center rounded-2xl border-2 border-secondary-foreground/20 bg-secondary text-primary-glow">
        <Icon className="size-5" />
      </span>
      <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mt-1 text-sm font-semibold text-leaf">{subtitle}</p>
      <p className="mt-4 leading-relaxed text-muted-foreground">{description}</p>
    </article>
  );
}
