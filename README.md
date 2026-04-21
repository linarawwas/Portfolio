# Lina Rawas — Portfolio

Personal portfolio site for Lina Rawas, Full Stack Engineer and Founder of The Agile Labs. Built with a "Constructivist Control Room" design language — dark editorial, dense information architecture, intentional asymmetry, operational framing.

Live: [portfolio.theagilelabs.com](https://portfolio.theagilelabs.com)

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 + TypeScript |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS v4 (CSS-first config) |
| Animations | Framer Motion 12 |
| Routing | Wouter 3 |
| UI Primitives | shadcn/ui (new-york style) + Radix UI |
| Server | Express 4 (SPA host, production only) |
| Server Bundle | esbuild |
| Package Manager | pnpm |
| Node Requirement | **≥ 20** (project uses Vite 7 and Tailwind v4 Oxide engine) |

---

## Project Structure

```
lina-portfolio/
├── client/
│   ├── index.html                  # Entry HTML — OG/Twitter meta, fonts, analytics
│   └── src/
│       ├── main.tsx                # React root mount
│       ├── App.tsx                 # Router + providers (ThemeProvider, TooltipProvider)
│       ├── index.css               # Tailwind v4 CSS-first config, design tokens, base styles
│       ├── lib/
│       │   └── portfolioData.ts    # Single source of truth for all content
│       ├── pages/
│       │   ├── Home.tsx            # Main portfolio page (all sections)
│       │   ├── TrxPage.tsx         # TRX case study deep-dive
│       │   └── NotFound.tsx        # 404 fallback
│       ├── components/
│       │   ├── ui/                 # shadcn/ui primitives (button, dialog, etc.)
│       │   ├── ErrorBoundary.tsx
│       │   └── ...
│       ├── contexts/
│       │   └── ThemeContext.tsx    # Dark-mode provider (default: dark)
│       └── hooks/
│           └── useMobile.tsx
├── server/
│   └── index.ts                    # Express static server for production SPA serving
├── package.json
├── vite.config.ts
├── tsconfig.json
└── patches/
    └── wouter@3.7.1.patch          # pnpm patch for wouter
```

---

## Routes

| Path | Component | Title |
|---|---|---|
| `/` | `Home.tsx` | `Lina Rawas — Full Stack Engineer & Founder` |
| `/trx` | `TrxPage.tsx` | `TRX Case Study — Lina Rawas` |
| `*` | `NotFound.tsx` | — |

Document titles are set per-route via `useEffect` + `document.title`. `TrxPage` restores the previous title on unmount.

---

## Content Architecture

All content lives in [`client/src/lib/portfolioData.ts`](client/src/lib/portfolioData.ts). This is the **only file to edit** when updating copy, projects, roles, or skills.

### Exports

| Export | Used In | Description |
|---|---|---|
| `heroSubtitles` | `Home` hero | Rotating subtitle lines |
| `navLinks` | `Home` nav | Section anchor links |
| `aboutLayers` | `Home` about | Four-layer stack summary (Product, Frontend, Backend, Infra) |
| `projects` | `Home` work | All project entries (featured + supporting) |
| `featuredProject` | `Home` | `projects[0]` — TRX |
| `supportingProjects` | `Home` | `projects[1–5]` |
| `experiences` | `Home` experience | Work history entries |
| `skillGroups` | `Home` skills | Skill categories with primary/secondary distinction |
| `trxPainPoints` | `TrxPage` | Problem statement cards |
| `trxDecisions` | `TrxPage` | Architecture decision records |
| `trxResults` | `TrxPage` | Outcome metrics |
| `trxStackLayers` | `TrxPage` | Stack diagram layers |
| `contactLinks` | `Home` contact | Email, LinkedIn, CV anchor |
| `siteMeta` | `Home`, `index.html` | Title, description, domain |

### Skill shape

```typescript
{
  category: string;    // display name, e.g. "Frontend"
  short: string;       // orbit node label, e.g. "FE"
  description: string; // shown in the detail panel when the node is active
  skills: {
    name: string;
    primary: boolean;  // true = amber pill, false = muted pill
  }[];
}
```

### Project shape

```typescript
{
  key: string;
  name: string;
  description: string;
  type?: "featured";          // only set on TRX
  badges?: string[];          // e.g. ["Production", "SaaS"]
  metrics?: string[];         // e.g. ["3k+ txn/mo"]
  stack?: string[];           // tech stack tags
  actions?: {
    label: string;
    href: string;
    kind: "primary" | "ghost";
    external?: boolean;
  }[];
  backgroundImage?: string;   // CloudFront URL for featured card
  tags?: string[];            // used on supporting cards
  visual?: string;            // visual variant key for supporting card illustrations
  repoUrl?: string;
  liveUrl?: string;
  collaboratorNote?: string;
}
```

---

## Design System

### Philosophy

> "Constructivist Control Room" — expose system structure through dense, intentional information blocks. Use asymmetry, editorial framing, and operational language. Every content grouping feels like a panel inside a living control room.

### Colors

| Role | Value |
|---|---|
| Background | `#0a0a0f` |
| Primary accent | `rgba(245, 158, 11)` — amber |
| Secondary accent | `rgba(99, 102, 241)` — indigo |
| Muted text | `slate-400` / `slate-500` |
| Borders | `white/8` – `white/15` |

### Typography

| Role | Font |
|---|---|
| Display / headings | Syne (Google Fonts) |
| Body / UI | DM Sans (Google Fonts) |
| Code / mono labels | JetBrains Mono (Google Fonts) |

### Key CSS patterns

```css
/* Global flex min-size reset (prevents overflow shrink issues) */
.flex { min-width: 0; min-height: 0; }

/* Container */
/* mobile: 16px padding — 288px usable on 320px screen */
/* sm:    24px padding */
/* lg:    max-width 1280px, 32px padding */
```

Tailwind v4 is configured entirely in [`client/src/index.css`](client/src/index.css) — there is no `tailwind.config.ts`.

---

## Development Setup

### Prerequisites

- Node.js **≥ 20** (Vite 7 and Tailwind v4 Oxide engine require it)
- pnpm (declared as package manager) — or npm/yarn also work

### Install

```bash
pnpm install
# or
npm install
```

### Run dev server

```bash
pnpm dev
# or
npm run dev
```

The Vite dev server starts on `http://localhost:5173` with `--host` (LAN accessible).

### Type check

```bash
pnpm check
# or
npm run check
```

---

## Build & Production

### Build

```bash
pnpm build
# or
npm run build
```

This runs two steps in sequence:

1. `vite build` — bundles the React SPA into `dist/public/`
2. `esbuild server/index.ts` — bundles the Express server into `dist/index.js`

### Serve production build

```bash
pnpm start
# or
npm start
```

Starts the Express server (`NODE_ENV=production node dist/index.js`). It serves `dist/public` as static files and returns `index.html` for all unmatched routes (SPA catch-all).

Default port: `3000` (override with `PORT` env var).

### Preview Vite build locally

```bash
pnpm preview
```

---

## Environment Variables

All vars are optional — the site functions without them (some features degrade gracefully).

| Variable | Used In | Effect if unset |
|---|---|---|
| `VITE_ANALYTICS_ENDPOINT` | `index.html` Umami script | Analytics not loaded |
| `VITE_ANALYTICS_WEBSITE_ID` | `index.html` Umami script | Analytics not loaded |
| `PORT` | `server/index.ts` | Defaults to `3000` |

Create a `.env` file at the project root for local overrides:

```env
VITE_ANALYTICS_ENDPOINT=https://your-umami-instance.com/script.js
VITE_ANALYTICS_WEBSITE_ID=your-website-id
PORT=3000
```

---

## Home Page Sections

All sections are implemented as named sub-components inside `Home.tsx`.

| Section | Component | Notes |
|---|---|---|
| Navigation | `NavBar` | Sticky, smooth-scroll anchors, mobile hamburger |
| Hero | `HeroSection` | Rotating subtitles, animated badge, stats panel (desktop only) |
| About | `AboutSection` | Four-layer stack grid |
| Work | `WorkSection` | Featured TRX card + supporting project grid |
| Experience | `ExperienceSection` | Desktop: horizontal scroll timeline with progress bar. Mobile: accordion |
| Skills | `SkillsSection` | Desktop: interactive orbit (click nodes to expand). Mobile: accordion by category |
| Contact | `ContactSection` | Email + LinkedIn links |

---

## TRX Case Study (`/trx`)

A full engineering case study covering:

- **Problem** — pain points in Lebanese water distribution (manual reconciliation, dual-currency complexity, field connectivity)
- **Architecture decisions** — exchange rate snapshotting, read-time aggregation, offline-first sync queue, partial indexing
- **Stack** — layered diagram from Testing down to Infrastructure
- **Results** — 3 hrs/day saved, $1,200/mo in salaries, 3,000+ txn/mo

All TRX content is driven by `trxPainPoints`, `trxDecisions`, `trxResults`, and `trxStackLayers` from `portfolioData.ts`.

---

## Adding / Editing Content

### Update a work experience

Edit the relevant entry in the `experiences` array in `portfolioData.ts`. Fields: `role`, `company`, `location`, `dates`, `symbol` (2-letter badge), `accent`, `bullets`.

### Add a project

Add an entry to the `projects` array. Set `type: "featured"` only for the primary featured card (currently TRX). Supporting projects use `tags` and `visual` for their grid cards.

### Update skills

Edit `skillGroups`. Set `primary: true` on the 2–4 core skills per category (rendered as amber pills). Add a `description` sentence — it appears in the desktop orbit detail panel.

### Update TRX case study

Edit `trxPainPoints`, `trxDecisions`, `trxResults`, or `trxStackLayers` arrays. No component changes needed.

---

## Known Constraints

- **Node 18**: The project runs with warnings on Node 18 but requires Node 20+ for a clean build. Upgrade Node before deploying to production.
- **Private project links**: Supporting projects (I-Stay, CarsLB, Alumni CMS, LMS, Gutenberg) have empty `repoUrl` and `liveUrl`. They render a "Not public" badge by design.
- **Bundle size**: The client bundle exceeds Vite's 500KB advisory due to Framer Motion and Recharts. This is expected — no action needed unless performance degrades.
- **pnpm patch**: `wouter@3.7.1` has a pnpm patch in `patches/`. If upgrading wouter, verify or remove the patch.
