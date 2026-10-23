# website

The site and the docs for `@hzblj/kara-ui` — Next.js (App Router), Tailwind 4 and `tailwind-variants`, in zyplot's
house style with kara's orange. Every page is static. Private; never published.

## Map

| Path | What it is |
| --- | --- |
| `app/` | Routes only: `/` (the landing page), `/docs` and `/docs/[...slug]` (guides, `/docs/components`, `/docs/components/<id>`), `llms.txt`, `llms-full.txt`, `sitemap`, `robots`, `manifest`, and `og/[...slug]` (every page's social image, drawn at build). They render what `src/` exports. |
| `src/site.ts` | The site's URL, name, links and hero copy. |
| `src/analytics/` | `GoogleAnalytics` (Google's tag, production deployments only), `track` and `AnalyticsEvents` (every custom event, typed), `LinkTracking` (outbound and `data-cta` clicks, one listener). |
| `src/seo/` | `pageMetadata` (title, description, canonical and the Open Graph and Twitter cards — a page states them in full, since Next replaces rather than merges them), `SEO_PAGES` (every page with a social image), `OgCard` (the image, drawn by `next/og` with the static Inter cuts in `fonts/`) and the JSON-LD. |
| `src/theme/` | Light/dark and the iOS/Android preference: `HEAD_SCRIPT` sets both on `<html>` before the first paint (cookies `kara-theme`, `kara-platform`), `ThemeToggle`, `ThemeSync`, `useColorScheme` / `usePlatform`. |
| `src/ui/` | Shared parts: `Wordmark` (`KaraMark`: four quarter-disc leaves opening from the middle, like a flower), `CodeBlock` (shiki, at build time), `Inline` (the `code`/**bold**/[link]() markdown the docs' strings carry), `MobileNav`, icons. |
| `src/marketing/` | The landing page: `ComponentStrip` (two rows of captures in `MarqueeTrack`, scrollers that drift by themselves and that a finger, a trackpad or a dragging mouse moves) and `MarkBloom` (the mark between the components and the footer, its leaves opening each time it scrolls into view). |
| `src/docs/pages.ts` | Every guide's title and description, the sidebar (`NAV`) and the pager's `READING_ORDER`. |
| `src/docs/guides/` | The guides' content, one `Guide` each (`Content` + the `headings` the TOC follows), registered in `index.ts`. |
| `src/docs/search/` | The docs' search: `SEARCH_INDEX` (components, guides and their sections, built from the registry and the guides at build time), `search` (term matching and ranking), `SearchDialog` (the palette, mounted once in the docs layout; ⌘K / Ctrl+K, `/`) and `SearchTrigger` (the sidebar's field, the mobile header's button). |
| `src/docs/components/registry.ts` | What a component page *says*: summary, what each platform renders, host, snippet, examples, which types get props tables, platform notes. |
| `src/docs/components/` | The gallery, a component page, `DeviceMedia` (a capture in the site's appearance; video plays in view or on hover) and the generated `PropsTable`. |
| `src/docs/source/` | Read from the checkout at build time: `api.ts` (props from the library's `*.types.ts` — JSDoc, and defaults from each platform's implementation), `tokens.ts` (the theme's primitives and palette), `changelog.ts` (`packages/kara-ui/CHANGELOG.md`), `media.ts` (what is in `public/media`). |
| `public/media/<platform>/<appearance>/` | The captures — `<id>.webp` stills and `<id>.mp4` loops — written by `apps/example/scripts/capture-shots.sh`. |

## Rules

**Nothing about a component's API is written here.** Props tables come from the library's types, defaults from the
implementations, tokens from the theme. A prop without a description is a missing JSDoc in `packages/`, not something to
patch in the site. The registry holds only what the types cannot say: prose, snippets and platform notes.

**The site reads the repo, so it builds from the repo.** `src/docs/source/` resolves paths from `process.cwd()` up to the
monorepo root — run Next from `apps/website` (the workspace scripts do). Nothing reads the disk at runtime: every route
is static.

**Captures are regenerated, never edited.** A new component gets a scene in `apps/example/src/shots/`, an entry in
`shots.json`, a registry entry here — then `yarn shots --only <id>`. Each capture's URL carries a version from its own file
(`src/docs/source/media.ts`), so a reshot one is never served from a browser's cache. A component without captures still gets its page, with the snippet in place of a preview.

**Both appearances and both platforms are in the markup.** The toggle and the platform switch flip classes on `<html>`,
and CSS (`dark:`, `android:`) shows one of each pair — never React state, which would be wrong until hydration.

**Highlighting happens on the server.** `CodeBlock` and `highlight` run shiki at build time; a client component gets the
HTML as a prop. Do not import shiki from a `'use client'` file.

**Analytics: Vercel's and Google's, from production only.** `<Analytics />` (page views) and `<SpeedInsights />` (Core
Web Vitals) sit in the root layout and report once each is enabled in the Vercel project; `<GoogleAnalytics />`
(`src/analytics/`, property `G-D1JC6JRTTX`) renders only when `VERCEL_ENV` is `production`, so previews and `yarn site`
send nothing. Google's tag sets the `_ga` cookies — Vercel's two set none. A custom event is a key in `AnalyticsEvents`
sent with `track()`, which reaches both; a link stays in a server component and gets `data-cta` instead of a handler.

**`yarn tsc:check` is the type check**, with the monorepo's TypeScript — `next build` skips its own (`ignoreBuildErrors`),
because it cannot drive TypeScript 7. `next typegen` writes the route types first.
