import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRevalidator } from "react-router";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

type AuthState = { session: Session | null; ready: boolean };

const AuthContext = createContext<AuthState>({ session: null, ready: false });

/** Single app-wide auth listener: keeps session state for UI and re-runs route loaders on identity changes. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const { revalidate } = useRevalidator();
  const [state, setState] = useState<AuthState>({ session: null, ready: false });

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setState({ session, ready: true });
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        void revalidate();
      }
    });
    void supabase.auth.getSession().then(({ data: { session } }) => {
      setState({ session, ready: true });
    });
    return () => data.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
