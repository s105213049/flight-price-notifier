import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// The dashboard must only be reachable through the sign-in gate.
describe("Auth gate", () => {
  it("serves /app from inside the signed-in-only layout", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const ids = router.matchRoutes("/app").map((m) => m.routeId);
    expect(ids).toContain("/_authenticated");
    expect(ids.at(-1)).toBe("/_authenticated/app");
  });

  it("keeps the landing page and sign-in pages public", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    for (const path of ["/", "/auth", "/signup"]) {
      const ids = router.matchRoutes(path).map((m) => m.routeId);
      expect(ids).not.toContain("/_authenticated");
    }
  });
});
