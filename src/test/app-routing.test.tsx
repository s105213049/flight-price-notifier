import { matchRoutes } from "react-router";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/integrations/supabase/client", () => ({ supabase: {} }));

const { routes } = await import("@/router");

// Match routes without rendering: loaders need the network the test run lacks.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const matches = matchRoutes(routes, "/") ?? [];
    expect(matches.at(-1)?.route.id).toBe("index");
  });
});
