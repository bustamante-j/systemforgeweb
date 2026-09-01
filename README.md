# System Forge website

A React catalog for System Forge portfolio website templates.

## Local development

```bash
npm install
npx vercel env pull .env.local
npm run dev
```

## Production checks

```bash
npm run lint
npm run build
```

## Content configuration

Template catalog data is stored in the Supabase `public.templates` table. Manage
published templates through the Supabase dashboard. The public site can only read
rows where `is_published` is `true`; row-level security blocks browser writes.

The database migration and seed data are stored in `supabase/migrations` and
`supabase/seed.sql`. To apply committed database changes to the linked project:

```bash
npx supabase link --project-ref qxdlzjhpyoykobdofrrr
npx supabase db push --include-seed
```

The TikTok profile remains in `src/data/site.js`. Update
`siteConfig.tiktokHandle` and `siteConfig.tiktokUrl` there if the assumed
`@systemforge1` handle is different.

The frontend requires these public environment variables:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

## Deployment

The project is linked to Vercel. `vercel.json` rewrites client-side routes back
to `index.html`, and pushes to `main` deploy automatically.
