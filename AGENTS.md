## Project rules

- Plain Vite + React SPA, statically hosted on Vercel (`vite build` → `dist/`). No SSR, no server functions; `vercel.json` rewrites every path to `index.html` so deep links resolve client-side.
- Routing uses React Router; the route table lives in `src/router.tsx` and pages live in `src/pages/`.
- Backend is the user's own Supabase project, used for authentication only (built-in users list); never add app data tables, RPCs, or client data queries — app data lives in an external AWS service added in later milestones.
- Signed-in pages are children of the `authenticated` layout route (client-side loader redirecting to `/auth`); public pages stay direct children of the root.
- One Supabase client lives in `src/integrations/supabase/client.ts`, reading `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`; never hardcode URLs or keys elsewhere.
- One auth listener lives in `src/components/AuthProvider.tsx`; read session state via `useAuth()` instead of adding new listeners.
- React component files use PascalCase (`FeatureCard.tsx`); hooks/utils keep camelCase. Generated shadcn files in `src/components/ui/` are exempt.
- Never commit real emails or names in code or demo data; use `example.com` placeholders.
