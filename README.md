# Flight Price Notifier

設定航線與目標價，機票降價就通知你。Set a route and a target price — we email you when the fare drops.

A Vite + React single-page app with React Router, Tailwind CSS and Supabase Auth, hosted as a static site on Vercel.

## Development

```sh
npm install
npm run dev      # local dev server
npm run build    # static build to dist/
npm test         # vitest
```

## Configuration

Copy the two browser-safe Supabase values into `.env` (and into Vercel → Project → Settings → Environment Variables):

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

## Routes

| Path | Page |
| --- | --- |
| `/` | Landing page |
| `/auth` | Sign in |
| `/signup` | Sign up |
| `/app` | Dashboard (signed-in only) |
