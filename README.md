# System Forge website

A React catalog for System Forge portfolio website templates.

## Local development

```bash
npm install
npm run dev
```

## Production checks

```bash
npm run lint
npm run build
```

## Content configuration

Template details and the TikTok profile are stored in `src/data/site.js`.
Update `siteConfig.tiktokHandle` and `siteConfig.tiktokUrl` there if the assumed
`@systemforge1` handle is different.

## Deployment

The project is ready for Vercel. `vercel.json` rewrites client-side routes back
to `index.html` so detail and information pages work when opened directly.
