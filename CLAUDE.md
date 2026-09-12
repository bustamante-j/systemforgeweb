# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev      # Vite dev server
npm run lint     # oxlint (config in .oxlintrc.json)
npm run build    # production build to dist/
npm run preview  # serve the built dist/
```

There is no test runner in this project. `npm run lint` and `npm run build` are the production checks.

## Architecture

Static marketing/catalog SPA: Vite + React 19 + react-router-dom v7 + GSAP, plain JSX (no TypeScript), deployed on Vercel.

The site is a **shop catalog**: light-first, organised into category shelves of product cards, each card showing the real site running in a frame. There is deliberately no hero — the catalog opens with its title, one line of copy, a count, and then the filter bar.

**Content is data, not markup.** `src/data/site.js` is the single source of truth: `siteConfig` (brand name, TikTok handle/URL used across Header, Footer, HomePage, TemplateDetailPage), the `categories` array, and the `templates` array consumed by HomePage and `getTemplateById`. Adding or editing a template means editing that array only — no new routes or components. Each template's `id` is the `/templates/:templateId` URL segment, `category` files it on a shelf (the catalog's primary organisation and what the filter chips switch), `theme` (`light` | `dark`) drives the theme filter, `tier` (`standard` | `premium`) puts a Premium flag on the card, and `name`/`audience`/`description`/`tags`/category label/tier are what the search box matches against. `visibleTags()` drops the tag that merely repeats the theme badge — the search index keeps it, so filtering the display never makes a template unfindable.

**Shelves.** `categories` declares the shelf order and each shelf's label and blurb; `categoryOf(value)` resolves one, falling back to a title-cased label for a category no one declared. HomePage builds `shelfOrder` once at module load: declared categories first, then any category a template carries that the list doesn't know about, minus any shelf with nothing on it. So a new category needs a row in `categories` plus templates pointing at it, and a typo'd category shows up at the end rather than silently dropping the card. A shelf only renders when the current search and filters leave something on it.

A previous commit moved this catalog to Supabase and was reverted (`79ace8c`); the static data module is the intended design. Don't reintroduce a backend unless asked.

**Routing** lives entirely in [src/App.jsx](src/App.jsx): every route nests under `Layout` (skip link → Header → NavOverlay → `<Outlet>` in `<main id="main-content">` → Footer → grain), plus `RouteTransition`, which resets scroll, fades `<main>` in behind a sweeping hairline, and calls `ScrollTrigger.refresh()` on the next frame because the incoming page is a different height. `HomePage` *is* the catalog (intro + search + category chips + theme filter + shelves + ordering summary); `/` and `/templates` both render it. Unknown template ids render `NotFoundPage` inline from `TemplateDetailPage` (URL preserved) rather than redirecting. `vercel.json` rewrites all paths to `index.html`, which is what makes deep links to detail/legal pages work in production.

The sticky filter bar and the shelves share one `<section className="catalog">`, and that wrapper is what scopes the sticky: without it the bar unsticks only at the end of the document and rides down over the call to action and the footer.

**Live previews** (`LivePreview`) embed third-party demo sites from `template.demoUrl` in a sandboxed `<iframe>` with `tabIndex="-1"` and a visible fallback line behind it. Keep the sandbox/referrerPolicy attributes when touching it. The iframe is fixed at a real 1280×800 desktop viewport and scaled down — the demos use `100vh` heroes, so a taller frame renders them as empty voids.

Each preview is a whole third-party site, so the catalog is the one page here with a real performance ceiling, and the component is built around not blowing through it. Easy-to-break details:

- A **module-level queue** grants load slots one or two at a time (fewer on a 3g/low-core phone), nearest-to-viewport first, so a grid of demos never starts at once. `priority` (used by `TemplateDetailPage`, which shows a single demo) skips the queue. A slot is released on `onLoad` or after a 15s timeout, so one dead demo cannot wedge the queue.
- `pump()` seeds its nearest-first search with the first waiting entry rather than with `null`. Filtering the catalog down to nothing unmounts every card at once and each reports `Infinity` for its distance on the way out; comparing against `Infinity` alone left `next` null and threw.
- `data-status` on `.preview-frame` drives the CSS: `idle` → `loading` (skeleton sweep) → `ready` (iframe fades in), plus `deferred` for Data Saver / 2g visitors, whose frames stay a label until they tap through to the detail page, and `stalled` for a demo that timed out.
- The scale factor is written straight to the DOM as `--preview-scale` by **one shared ResizeObserver**, never through React state — resizing must not re-render the grid. 1280 lives in both `FRAME_WIDTH` and `.preview-viewport iframe`; keep them in step.
- `.preview-viewport iframe` needs `max-width: none` to escape the global `iframe { max-width: 100% }` reset, and `.preview-viewport` carries `contain` + `content-visibility: auto` so scrolled-past demos stop costing anything. Its `aspect-ratio` is what holds the box open under `content-visibility` — don't remove it.

## Motion

All GSAP goes through [src/lib/motion.js](src/lib/motion.js), which registers the plugins once at module load and exports `gsap`, `ScrollTrigger`, `SplitText`, the `EASE_PRESS` / `EASE_OUT` curves, and `sectionMotion`. Import from there, not from `gsap` directly, so registration can never be missed. Components drive animation through `useGSAP` with a `scope` ref; nothing uses a bare `useEffect`.

**`sectionMotion(root)`** is the page-wide choreography, declared in markup with data attributes rather than wired up per component — a page needs one `useGSAP(() => sectionMotion(root.current), { scope: root })` call and nothing more:

`data-reveal="lines"` (SplitText line masks) · `"up"` · `"rule"` (hairline draws across) · `"rail"` (scrubbed vertical draw) · `"wipe"` (a frame opens from its centre line) · `data-stagger` · `data-parallax="-26"` · `data-count="6"`.

**The reduced-motion contract, and the one rule that follows from it.** `sectionMotion` builds nothing at all under `prefers-reduced-motion: reduce`, and every reveal is a `from`/`fromTo` — with no tween to write a start value, the element simply renders finished. So **no element may hide itself in the stylesheet and rely on a tween to bring it back**. `.section-marker-rule` and `.order-rail` were written that way once and disappeared entirely for reduced-motion visitors; they now sit visible in CSS and the tween sets scale 0 itself when it builds.

Motion here is restrained on purpose — the products are the moving part. Beyond `sectionMotion`, the only choreography is the card re-stock in HomePage: filtering fades the cards back in rather than blinking them, skipped on the first pass (the scroll reveals already own the entrance) and skipped entirely under reduced motion.

Use `transform`, `opacity` and `clip-path` only.

## Conventions

- **Type is one width axis.** Archivo is self-hosted as a *width*-variable file pinned to weight 700 (`wdth` 62–125). Headings, product names and the catalog title sit at 100%; `.marker` runs it Condensed at 64% for section markers; `.display` (Expanded, 118%, uppercase) is now only the footer wordmark — page titles are plain sentence-case headings. Space Grotesk sets body copy and JetBrains Mono every readout (`.readout`).
- **Fonts** are self-hosted from [public/fonts/](public/fonts/), not fetched from Google, which keeps two origins and a stylesheet round trip off the critical path. `latin-ext` is split out behind its `unicode-range` purely for the ₱ in `PriceTag`. The filenames are unhashed and `vercel.json` caches them `immutable` for a year, so **rename the file if you ever swap a font** (the width-variable cut is `archivo-wdth-*`, renamed from the old static `archivo-*` for exactly this reason). [index.html](index.html) preloads the two that carry first paint.
- **Utility classes land on `<p>` as often as on `<span>`**, and the global `p { max-width: 62ch }` quietly caps them there. `.readout`, `.eyebrow` and `.card-audience` reset it explicitly. If a centred label mysteriously strands itself at the left of its box, this is why.
- **Mobile is the primary target** — most visitors arrive from TikTok on a phone. Things that look arbitrary but are not: the search input must stay at `16px` (iOS zooms the page in on focus below that); the fixed header and sticky catalog bar drop `backdrop-filter` under 850px (re-blurring every scrolled frame is expensive on a phone GPU); `--header-h` drops to 56px there so the header and the filter bar under it both fit; and `.search-input` takes a `140px` flex basis rather than `auto`, because a wrapping flex container breaks lines on content width and an auto-sized field pushed the theme filter onto a row of its own, making the sticky bar three rows deep. The chips take that second row and scroll sideways in it.
- **The header is fixed, not sticky**, and `.main-content` reserves `--header-h` for it.
- **Styling**: one global stylesheet, [src/index.css](src/index.css) — hand-written CSS, no Tailwind or CSS modules. Light-first. Surfaces (`--paper`, `--surface`), text (`--ink`, `--muted`), the two working colours (`--accent` cold, `--ember` hot and rationed), hairlines, radii, type, rhythm and the `--z-*` layer scale are custom properties on `:root`; reuse those tokens instead of literal hex values, and don't invent a z-index outside the scale. Class names are flat and semantic (`.section`, `.container`, `.button`/`.button-secondary`/`.button-ghost`, `.shelf`, `.card`, `.chip`, `.preview-frame`). Responsive breakpoints are 1080px, 850px and 600px, plus `pointer: coarse` and `prefers-reduced-motion` blocks.
- **Page shape**: content pages render `<PageHeader title>` followed by `<section className="section"><div className="container">…`, and major sections open with the `.section-marker` spine (index, condensed label, drawn rule). Text stays minimal on purpose — the demos are the page, not the copy around them. Rules are drawn inside the gutters (see `.page-head::after`) so they line up with the text rather than running past it.
- **Accessibility is load-bearing** and applied consistently: one `h1` per route with no heading-level skips (shelves are `h2`, the cards inside them `h3`), `aria-label` on every nav, filter group, tag list, and preview link, `aria-pressed` on the chips and segmented filters, `inert` on `<main>`/`<footer>` while the nav overlay is open (which is what contains focus without a hand-rolled trap), an `.sr-only` live region for the filtered results count that survives the mobile collapse hiding its visible twin, and `:focus-visible` outlines throughout. The card's "view template" bar appears on `:focus-visible` as well as hover, since the frame is reachable by keyboard. Preserve this when adding UI.
- **Code style**: no semicolons, single quotes, 2-space indent, `export default function` components, imports and JSX props kept roughly alphabetical.
