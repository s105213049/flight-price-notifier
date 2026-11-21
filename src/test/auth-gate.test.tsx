import { matchRoutes } from "react-router";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/integrations/supabase/client", () => ({ supabase: {} }));

const { routes } = await import("@/router");

const idsFor = (path: string) => (matchRoutes(routes, path) ?? []).map((m) => m.route.id);

// The dashboard must only be reachable through the sign-in gate.
describe("Auth gate", () => {
  it("serves /app from inside the signed-in-only layout", () => {
    const ids = idsFor("/app");
    expect(ids).toContain("authenticated");
    expect(ids.at(-1)).toBe("app");
  });

  it("keeps the landing page and sign-in pages public", () => {
    for (const path of ["/", "/auth", "/signup"]) {
      expect(idsFor(path)).not.toContain("authenticated");
    }
  });
});
