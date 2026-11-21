import { Link } from "react-router";
import { Plane } from "lucide-react";

export function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2.5" aria-label="Flight Price Notifier home">
      <span className="grid size-8 place-items-center rounded-lg bg-gradient-primary shadow-glow transition-transform group-hover:-rotate-6">
        <Plane className="size-4 text-primary-foreground" strokeWidth={2.25} />
      </span>
      <span className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
        Flight Price Notifier
      </span>
    </Link>
  );
}
