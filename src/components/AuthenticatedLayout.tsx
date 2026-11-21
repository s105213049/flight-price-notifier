import { Outlet, redirect, useRouteLoaderData } from "react-router";
import type { User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

// The session lives in browser storage, so this gate runs client-side.
export async function authenticatedLoader() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw redirect("/auth");
  return { user: data.user };
}

export function AuthenticatedLayout() {
  return <Outlet />;
}

/** The signed-in user, provided by the authenticated layout's loader. */
export function useAuthenticatedUser(): User {
  const data = useRouteLoaderData("authenticated") as { user: User } | undefined;
  if (!data) throw new Error("useAuthenticatedUser must be used inside the authenticated layout");
  return data.user;
}
