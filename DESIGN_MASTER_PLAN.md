# Lina Rawas Portfolio — Design Master Plan
**Theme: Constructivist Control Room → Tactical HUD Retrofuturism**
**Stack: React + TypeScript + Tailwind CSS + Framer Motion (already installed)**

---

## Design Philosophy

The portfolio's stated identity is "Constructivist Control Room." This plan fully commits to that direction by layering **Tactical HUD Retrofuturism** — the aesthetic of an operational system interface — on top of a set of structural and polish improvements. Every change must feel like it belongs to a living system dashboard, not a decorative portfolio. The amber color already in use is deliberately phosphor amber — the same color as old-school operational terminal displays. Lean into that.

**Restraint rule:** HUD elements are accents, not wallpaper. No glitch effects, no heavy scanline overlays over text, no decorative elements that obscure content. Every HUD addition must either carry meaning (status, system language) or add depth (corner brackets, surface texture).

---

## Files in scope

- `client/src/pages/Home.tsx` — primary page, all sections
- `client/src/pages/TrxPage.tsx` — TRX case study page
- `client/src/App.tsx` — app root, global wrappers
- `client/index.html` — for any global asset links
- `client/src/index.css` (or equivalent global CSS file) — for noise texture, scanline, and cursor CSS

---

## LAYER 1 — FOUNDATION POLISH

These are structural and quality improvements that apply regardless of theme. Implement all of these first.

---

### 1.1 — Noise / Grain Texture Overlay

**What:** A subtle noise grain texture layered over the entire dark background, giving the flat black depth and a premium physical feel.

**Where:** `client/src/App.tsx` — add a single fixed overlay `div` as the first child inside the `<ErrorBoundary>` wrapper, before `<ThemeProvider>`. This ensures it appears on every page.

**How to implement:**

1. Create a noise PNG or use a base64-encoded SVG noise filter. The easiest approach is to add an inline SVG filter in the global CSS and apply it via a `div`. Alternatively, use a CSS-only approach with `background-image`.

2. Add this `div` as the very first element inside the router's rendered page shell — it must be `position: fixed`, `inset: 0`, `z-index: 0`, and `pointer-events: none`.

3. Use this CSS approach — add to `client/src/index.css` (global stylesheet):

```css
.noise-overlay {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.038;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 200px 200px;
  mix-blend-mode: overlay;
}
```

4. In `client/src/App.tsx`, add `<div className="noise-overlay" aria-hidden="true" />` as the first child of the outermost wrapper div surrounding the `Router`.

**Expected result:** The background gains subtle physical texture. It's invisible until you look for it, but the portfolio feels significantly more premium with it present.

---

### 1.2 — Global Scroll Progress Bar

**What:** A 1.5px amber horizontal line at the very top of the viewport (above the navigation) that fills left to right as the user scrolls from top to bottom of the page.

**Where:** `client/src/pages/Home.tsx` — add as a new component `ScrollProgressBar` rendered inside the `Navigation` component, as the absolute first element inside the `<header>` tag, before the container div.

On `client/src/pages/TrxPage.tsx`, add the same `ScrollProgressBar` component as the first element inside the `<StickyNav>` div, before the container div.

**How to implement:**

```tsx
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 top-0 z-50 h-[1.5px] w-full origin-left bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.7)]"
    />
  );
}
```

Import `useSpring` from `framer-motion` (already installed). Place `<ScrollProgressBar />` at the top level of both pages — outside the header, as a sibling to it.

**Visual spec:**
- Height: `1.5px`
- Color: `bg-amber-400`
- Glow: `shadow-[0_0_10px_rgba(245,158,11,0.7)]`
- z-index: `z-50` (above nav)
- Position: `fixed top-0 left-0`
- Width: 100%, `origin-left`, scaled by `scaleX`

---

### 1.3 — Ambient Per-Section Radial Glows

**What:** Each major section gets a subtle ambient radial gradient bloom behind it, color-coded by the section's identity. This creates visual wayfinding — the page breathes with color as you scroll — without ever being loud.

**Where:** Inside each section in `client/src/pages/Home.tsx`, add a `position: absolute` glow div as the first child of each `<section>`.

**Spec per section:**

| Section | ID | Glow color |
|---|---|---|
| About | `#about` | Indigo: `rgba(99,102,241,0.065)` |
| Work | `#work` | Amber: `rgba(245,158,11,0.055)` |
| Experience | `#experience` | Amber: `rgba(245,158,11,0.05)` |
| Skills | `#skills` | Indigo: `rgba(99,102,241,0.055)` |
| Contact | `#contact` | Emerald: `rgba(16,185,129,0.055)` |

**Implementation for each — add this as the first child inside every section tag:**

```tsx
// Example for Work section (amber glow from top-center):
<div
  aria-hidden="true"
  className="pointer-events-none absolute inset-x-0 top-0 h-[60vh]"
  style={{
    background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(245,158,11,0.055), transparent)"
  }}
/>
```

All glows use the same structure. Swap color per section. Use `position: relative` on the section if it isn't already (add `className="relative"` to sections that are missing it).

---

### 1.4 — Hero Name Letter-Stagger Animation

**What:** On first load, the words "Full Stack", "Engineer", and "& Founder" in the hero h1 animate in with a word-by-word staggered reveal — each word fades up from `y: 20` to `y: 0` with `opacity: 0` → `1`, staggered by 80ms per word.

**Where:** `client/src/pages/Home.tsx`, inside `HeroSection`, the `<h1>` element (currently at the block with `font-display text-[clamp(2.2rem,9vw,7rem)]`).

**Current structure of h1:**
```tsx
<h1 className="font-display text-[clamp(2.2rem,9vw,7rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.05em] text-white">
  <span className="block">Full Stack</span>
  <span className="flex items-end gap-3 text-white">
    <span>Engineer</span>
    {/* amber line */}
  </span>
  <span className="block pl-[8vw] md:pl-[12vw]">& Founder</span>
</h1>
```

**How to implement:** Wrap each text span (`Full Stack`, `Engineer`, `& Founder`) individually in a `motion.span` with staggered delays. Do not animate the amber line separately — it already has its own animation.

```tsx
// Word reveal variants — define once above the component
const wordReveal = {
  hidden: { opacity: 0, y: 22 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }
  }),
};
```

Apply `initial="hidden" animate="visible"` to the h1, and pass `custom={delay}` to each motion.span:
- "Full Stack" → `custom={0.1}`
- "Engineer" → `custom={0.22}`
- "& Founder" → `custom={0.36}`

**Important:** Wrap this entire animation in a `reduceMotion` guard — if `useReducedMotion()` returns true, render the words statically without animation.

---

### 1.5 — Bento Grid for Work Section

**What:** Replace the current uniform 3-column grid of supporting projects with an asymmetric bento-style layout. The current TRX featured card stays as a large hero card. The 5 supporting projects are rearranged into a bento grid with varying cell sizes that communicate hierarchy.

**Where:** `client/src/pages/Home.tsx`, inside `WorkSection`, the `<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-[1fr_0.9fr_1.1fr]">` element that wraps the `otherProjects.map(...)`.

**Current layout:** 5 cards in a 3-column responsive grid — all equal size.

**New bento layout spec:**

The 5 projects in order are: I-Stay AI, CarsLB, Alumni CMS, LMS, Gutenberg Reader.

```
Desktop layout (≥1280px):
[ I-Stay AI — wide (col-span-2) ] [ CarsLB — normal ]
[ Alumni CMS — normal ]  [ LMS — tall (row-span-2, but implemented with min-height) ] [ Gutenberg — normal ]
```

Implement using CSS Grid with `grid-template-columns: 1fr 1fr 1fr` and `grid-template-rows: auto` on a container, then apply `col-span` and `row-span` classes to specific cards.

**Exact grid classes:**
```tsx
// Container:
<div className="grid gap-5 xl:grid-cols-3 xl:grid-rows-[auto_auto]">

// I-Stay AI (index 0): spans 2 columns
className="... xl:col-span-2"

// CarsLB (index 1): normal (1 col)
// no extra classes

// Alumni CMS (index 2): normal (1 col)
// no extra classes

// LMS (index 3): taller — give it a min-height
className="... xl:row-span-2"  // or just increase the visual height with a taller ProjectVisual area

// Gutenberg (index 4): normal (1 col)
// no extra classes
```

For the `xl:col-span-2` card (I-Stay AI), increase the visual preview area height from `min-h-[10.5rem]` to `min-h-[16rem]` and center the `ProjectVisual` content to fill the extra space. This makes it feel like a wider featured card, not just a stretched small card.

**On mobile/tablet (< 1280px):** Keep the existing `md:grid-cols-2` layout — bento only activates at `xl` breakpoint.

---

### 1.6 — TRX Case Study Metadata Header

**What:** Directly below the TRX hero section heading (below the `<p>` intro paragraph) and above the metrics Panel, add a single horizontal metadata strip showing: `Sole engineer · Production · Lebanon · 2023–present · ~10 min read`.

**Where:** `client/src/pages/TrxPage.tsx`, inside the hero section's `<div className="mx-auto max-w-5xl text-center">`, between the closing `</p>` of the intro paragraph and the `<Panel className="mt-10 ...">` metrics panel.

**Implementation:**
```tsx
<div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
  {[
    "Sole engineer",
    "Production system",
    "Lebanon",
    "2023–present",
    "~10 min read",
  ].map((item, i) => (
    <span key={item} className="flex items-center gap-4">
      {item}
      {i < 4 && <span className="h-px w-4 bg-white/15" />}
    </span>
  ))}
</div>
```

---

## LAYER 2 — HUD RETROFUTURISM

These changes define the visual identity. They transform the portfolio from "good dark design" into "operational system interface." Each change is targeted — applied to specific components, not the entire page.

---

### 2.1 — Corner Bracket Decorations on All Panels

**What:** The `ControlPanel` component in `Home.tsx` and the `Panel` component in `TrxPage.tsx` each get decorative corner brackets in their four corners — the `⌐ ¬` style targeting reticle brackets seen on sci-fi HUD interfaces. These are purely decorative SVG or CSS elements.

**Why:** This is the single most identity-defining change. Every panel immediately reads as an "operational interface panel" rather than a generic card.

**Where:** Modify the `ControlPanel` component in `Home.tsx` (line ~187) and the `Panel` component in `TrxPage.tsx` (line ~78).

**How to implement:**

Add a `HudBrackets` component:

```tsx
function HudBrackets({ color = "rgba(245,158,11,0.35)" }: { color?: string }) {
  const style = { borderColor: color } as React.CSSProperties;
  return (
    <>
      {/* Top-left */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-3 h-4 w-4 border-l-[1.5px] border-t-[1.5px]"
        style={style}
      />
      {/* Top-right */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r-[1.5px] border-t-[1.5px]"
        style={style}
      />
      {/* Bottom-left */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b-[1.5px] border-l-[1.5px]"
        style={style}
      />
      {/* Bottom-right */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b-[1.5px] border-r-[1.5px]"
        style={style}
      />
    </>
  );
}
```

**Modify `ControlPanel`** to include `HudBrackets` and ensure it has `position: relative`:

```tsx
function ControlPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm ${className}`}
    >
      <HudBrackets color="rgba(245,158,11,0.3)" />
      {children}
    </div>
  );
}
```

**Modify `Panel` in `TrxPage.tsx`** the same way — add `relative` and include `<HudBrackets color="rgba(245,158,11,0.25)" />`.

**Bracket sizing notes:**
- Size: `h-4 w-4` (16px × 16px)
- Position offset from corner: `3` (12px from edge)
- Border width: `1.5px`
- Color: amber at 30–35% opacity — visible but not aggressive

---

### 2.2 — Phosphor Scanline Effect on Hero ControlPanel

**What:** The "Operational proof" ControlPanel in the hero section (right side, desktop only) gets a very subtle horizontal scanline overlay — thin repeating horizontal lines at 3% opacity — mimicking a CRT phosphor display. This applies ONLY to this panel, nowhere else on the page.

**Where:** `client/src/pages/Home.tsx` — the `<ControlPanel className="w-full max-w-[28rem] overflow-hidden ...">` in `HeroSection`.

**How to implement:**

Add a `before:` pseudo-element via a utility class, OR add an absolutely positioned overlay div as the first child of that specific ControlPanel:

```tsx
// Inside the hero ControlPanel, as the very first child:
<div
  aria-hidden="true"
  className="pointer-events-none absolute inset-0 z-10 rounded-[1.75rem]"
  style={{
    backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)",
  }}
/>
```

**Spec:**
- Lines every 4px (3px transparent + 1px dark)
- Opacity of lines: `rgba(0,0,0,0.04)` — very subtle, almost invisible
- `z-index: 10` — above content background, below actual text content (use `z-10` on overlay, ensure panel content has `relative z-20` or similar)
- `border-radius` matching the panel: `rounded-[1.75rem]`
- `pointer-events: none`

Also add a very faint amber inner glow to this specific panel:
```
shadow-[inset_0_0_40px_rgba(245,158,11,0.04),0_24px_80px_rgba(0,0,0,0.35)]
```

---

### 2.3 — Terminal Log Redesign for TRX Decisions Section

**What:** The 5 engineering decision cards in `TrxPage.tsx` (the `#decisions` section) are redesigned from generic Panel cards into a terminal/command-log interface. Each card becomes a monospaced log entry with a `>` prompt prefix, `[PROBLEM]` and `[DECISION]` label chips, and a blinking cursor at the end of each active decision.

**Where:** `client/src/pages/TrxPage.tsx`, the `#decisions` section, specifically the `trxDecisions.map()` block.

**Current structure:**
```tsx
<Panel key={item.problem} className="border-l-[3px] border-l-amber-400 p-7 md:p-8">
  <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">The problem</div>
  <p className="mt-3 text-sm leading-7 text-slate-300">{item.problem}</p>
  <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.24em] text-amber-300">The decision</div>
  <p className="mt-3 text-sm leading-7 text-slate-200">{item.decision}</p>
</Panel>
```

**New structure — replace the entire `trxDecisions.map()` block:**

```tsx
<div className="space-y-3">
  {trxDecisions.map((item, index) => (
    <motion.div
      key={item.problem}
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="relative overflow-hidden rounded-[1.4rem] border border-white/8 bg-[#0d0e15] p-6 md:p-7"
    >
      {/* HUD brackets — same HudBrackets component from Home.tsx (copy or share) */}
      <HudBrackets color="rgba(245,158,11,0.2)" />

      {/* Terminal header bar */}
      <div className="mb-5 flex items-center gap-3 border-b border-white/6 pb-4">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-600">
          decision_{String(index + 1).padStart(2, "0")}.log
        </span>
      </div>

      {/* Problem block */}
      <div className="flex gap-3">
        <span className="mt-0.5 shrink-0 font-mono text-[11px] text-amber-400/70">›</span>
        <div>
          <span className="mb-2 inline-block rounded border border-red-400/25 bg-red-400/8 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.3em] text-red-300">
            problem
          </span>
          <p className="text-sm leading-7 text-slate-400">{item.problem}</p>
        </div>
      </div>

      {/* Decision block */}
      <div className="mt-5 flex gap-3">
        <span className="mt-0.5 shrink-0 font-mono text-[11px] text-emerald-400/70">›</span>
        <div>
          <span className="mb-2 inline-block rounded border border-emerald-400/25 bg-emerald-400/8 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.3em] text-emerald-300">
            decision
          </span>
          <p className="text-sm leading-7 text-slate-200">{item.decision}</p>
        </div>
      </div>

      {/* Blinking cursor at the end */}
      <div className="mt-4 flex items-center gap-1 font-mono text-[11px] text-amber-400/50">
        <span>›</span>
        <span className="inline-block h-3 w-1.5 animate-pulse bg-amber-400/60" />
      </div>
    </motion.div>
  ))}
</div>
```

**Also update the section heading** — change the eyebrow from the plain `<div>Engineering decisions</div>` style to include a terminal prompt:
```tsx
<div className="font-mono text-[11px] uppercase tracking-[0.28em] text-amber-300">
  <span className="mr-2 text-amber-400/50">›_</span>Engineering decisions
</div>
```

**Layout change:** Change the container from `grid gap-5 lg:grid-cols-2` to a single-column `space-y-3` — terminal logs read vertically, not in a grid. This makes them feel like sequential entries in a log file.

---

### 2.4 — Status Chips on Experience Cards

**What:** The experience cards in `DesktopTimeline` and `MobileTimeline` in `Home.tsx` get a status chip in the top-right area. The current role gets `[ACTIVE]` in emerald, past roles get `[COMPLETED]` in slate. The Founder role additionally gets `[PRODUCTION]` in amber.

**Where:** `client/src/pages/Home.tsx`, inside the `DesktopTimeline` `article` element and the `MobileTimeline` `article` element.

**Status mapping:**
- Index 0 (Founder, The Agile Labs — "Present"): `[ACTIVE]` emerald + `[PRODUCTION]` amber
- Index 1 (I-Stay — "Aug 2024", ended): `[COMPLETED]` slate
- Index 2 (Codi-Tech — "Jun 2023", ended): `[COMPLETED]` slate
- Index 3 (CodeBrave — "Present"): `[ACTIVE]` emerald

**Implementation — add a `StatusChip` component:**

```tsx
function StatusChip({ status }: { status: "active" | "completed" | "production" }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded border border-emerald-400/25 bg-emerald-400/8 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.28em] text-emerald-300">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
        active
      </span>
    );
  }
  if (status === "production") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded border border-amber-400/25 bg-amber-400/8 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.28em] text-amber-300">
        production
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.28em] text-slate-500">
      completed
    </span>
  );
}
```

**In `DesktopTimeline`:** In the `article` element, find the existing top row with the number badge and date. Add the status chip(s) next to or below the date. For index 0, render both `<StatusChip status="active" />` and `<StatusChip status="production" />` in a `flex gap-2`. For index 3, render `<StatusChip status="active" />`. For indices 1 and 2, render `<StatusChip status="completed" />`.

**In `MobileTimeline`:** Same logic. Place the chip(s) directly below the company/location line, before the ChevronDown toggle.

---

### 2.5 — Hero Boot Sequence Intro

**What:** On the very first page load, before the hero content is visible, a 1.8-second "system boot" sequence plays — 3–4 terminal-style status lines stream in one by one, then the entire sequence fades out and the real hero content fades in. This only plays once per session (use `sessionStorage` to track).

**Where:** `client/src/pages/Home.tsx`, add a new component `BootSequence` and render it conditionally at the top of the main `Home` component return, above `<Navigation />`.

**Sequence lines (display in order, each appearing 380ms after the previous):**
```
CONNECTING TO NODE...       [OK]
AUTH: LINA_RAWAS            [VERIFIED]
LOADING INTERFACE...        [READY]
```

After all 3 lines appear, wait 400ms, then fade the entire boot overlay out with `opacity: 0` over 500ms, then unmount it.

**Implementation:**

```tsx
function BootSequence({ onDone }: { onDone: () => void }) {
  const [lines, setLines] = useState<number>(0);
  const [fading, setFading] = useState(false);
  const reduceMotion = useReducedMotion();

  const bootLines = [
    { left: "CONNECTING TO NODE...", right: "OK" },
    { left: "AUTH: LINA_RAWAS", right: "VERIFIED" },
    { left: "LOADING INTERFACE...", right: "READY" },
  ];

  useEffect(() => {
    if (reduceMotion) { onDone(); return; }

    const already = sessionStorage.getItem("boot_done");
    if (already) { onDone(); return; }

    const timers: ReturnType<typeof setTimeout>[] = [];

    bootLines.forEach((_, i) => {
      timers.push(setTimeout(() => setLines(i + 1), 300 + i * 380));
    });

    timers.push(setTimeout(() => setFading(true), 300 + bootLines.length * 380 + 300));
    timers.push(setTimeout(() => {
      sessionStorage.setItem("boot_done", "1");
      onDone();
    }, 300 + bootLines.length * 380 + 800));

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      animate={{ opacity: fading ? 0 : 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0a0a0f]"
    >
      <div className="w-full max-w-sm space-y-3 px-8 font-mono text-[11px] uppercase tracking-[0.28em]">
        {bootLines.slice(0, lines).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="flex items-center justify-between"
          >
            <span className="text-slate-400">
              <span className="mr-2 text-amber-400/60">›</span>
              {line.left}
            </span>
            <span className="text-emerald-400/80">[{line.right}]</span>
          </motion.div>
        ))}
        {lines > 0 && lines < bootLines.length + 1 && (
          <div className="flex items-center gap-1 text-amber-400/50">
            <span>›</span>
            <span className="inline-block h-3 w-1.5 animate-pulse bg-amber-400/60" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
```

**In the main `Home` component:** Add `const [booted, setBooted] = useState(false)` state. Render `{!booted && <BootSequence onDone={() => setBooted(true)} />}`. When `booted` is false, also hide overflow on the page body by adding `overflow-hidden` to the main wrapper until booted.

**Check sessionStorage on initial render** — if `sessionStorage.getItem("boot_done")` already exists, set `booted` to `true` immediately so the sequence doesn't replay on same-session navigation.

---

### 2.6 — Cursor Glow Follower

**What:** A soft amber radial glow that follows the mouse cursor across the entire page with a spring lag (~120ms). It's a `position: fixed`, `pointer-events: none` div that creates a 400px diameter soft amber bloom wherever the cursor is, at ~8% opacity. The effect is felt rather than seen — it turns the dark background into an interactive surface.

**Where:** `client/src/App.tsx` — add as a single global component rendered inside the router wrapper, so it appears on all pages.

**Implementation:**

```tsx
function CursorGlow() {
  const [pos, setPos] = useState({ x: -500, y: -500 });
  const springConfig = { stiffness: 80, damping: 20, mass: 0.5 };
  const x = useSpring(pos.x, springConfig);
  const y = useSpring(pos.y, springConfig);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed z-0 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        x,
        y,
        background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)",
      }}
    />
  );
}
```

Import `useSpring` from framer-motion. Add `<CursorGlow />` inside the `App` component, as a sibling to the `Router` output. Only render it on non-touch devices — add a check: `const isTouchDevice = window.matchMedia("(hover: none)").matches` and return null if true.

---

## LAYER 3 — INTERACTION ENHANCEMENTS

---

### 3.1 — Magnetic CTA Buttons

**What:** The two primary CTA buttons — "See my work" (hero section, amber button) and "Case study" (TRX featured card, amber button) — have a magnetic hover effect. As the cursor approaches and hovers within the button bounds, the button content subtly shifts toward the cursor by up to 6px. On mouse leave, it springs back to center.

**Where:**
- `client/src/pages/Home.tsx` — the `<Button asChild className="group h-14 rounded-full bg-amber-400 ...">` in `HeroSection`
- `client/src/pages/Home.tsx` — the first action button in the `featured.actions.map()` inside `WorkSection`

**Implementation — create a `MagneticButton` wrapper component:**

```tsx
function MagneticButton({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 20 });
  const y = useSpring(0, { stiffness: 200, damping: 20 });
  const reduceMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.28);
    y.set((e.clientY - cy) * 0.28);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      <motion.div style={{ x, y }}>
        {children}
      </motion.div>
    </div>
  );
}
```

Wrap only the two amber primary CTA buttons in `<MagneticButton>`. Do not apply to secondary/outline buttons.

---

### 3.2 — TRX Featured Card 3D Tilt

**What:** The TRX featured card in the Work section responds to mouse movement with a subtle 3D perspective tilt — the card rotates along the X and Y axes by a maximum of ±4 degrees as the cursor moves across it. On mouse leave, it smoothly returns to flat. This makes the featured card feel like a physical panel in a control room.

**Where:** `client/src/pages/Home.tsx`, inside `WorkSection`, the `<ControlPanel className="group relative overflow-hidden border-amber-400/15">` element.

**Implementation — create a `TiltCard` wrapper:**

```tsx
function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(0, { stiffness: 150, damping: 18 });
  const rotateY = useSpring(0, { stiffness: 150, damping: 18 });
  const reduceMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rotateY.set(((e.clientX - cx) / (rect.width / 2)) * 4);
    rotateX.set(-((e.clientY - cy) / (rect.height / 2)) * 4);
  };

  const handleMouseLeave = () => { rotateX.set(0); rotateY.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

Replace the `<ControlPanel className="group relative overflow-hidden border-amber-400/15">` wrapper with `<TiltCard className="group relative overflow-hidden">` where the inner `ControlPanel` becomes a plain div with the same classes, OR wrap the entire ControlPanel in a `TiltCard` div with `perspective: 1200px` set on the wrapper.

**Max rotation:** ±4 degrees. Do not exceed this — it looks broken at higher values.

---

## SUMMARY — Implementation Order

Execute in this exact order to avoid dependency issues:

| Step | Change | File | Complexity |
|---|---|---|---|
| 1 | Noise texture overlay | `index.css` + `App.tsx` | Low |
| 2 | Scroll progress bar | `Home.tsx` + `TrxPage.tsx` | Low |
| 3 | Ambient section glows | `Home.tsx` | Low |
| 4 | Hero name letter-stagger | `Home.tsx` | Low |
| 5 | Case study metadata | `TrxPage.tsx` | Low |
| 6 | `HudBrackets` component + apply to all Panels | `Home.tsx` + `TrxPage.tsx` | Medium |
| 7 | Scanline overlay on hero ControlPanel | `Home.tsx` | Low |
| 8 | Status chips on experience cards | `Home.tsx` | Medium |
| 9 | Bento grid (Work section) | `Home.tsx` | Medium |
| 10 | Terminal log (TRX decisions) | `TrxPage.tsx` | Medium |
| 11 | Boot sequence | `Home.tsx` | Medium |
| 12 | Cursor glow | `App.tsx` | Medium |
| 13 | Magnetic CTA buttons | `Home.tsx` | Medium |
| 14 | TRX card 3D tilt | `Home.tsx` | Medium |

---

## Critical constraints

1. **`useReducedMotion()` guard on ALL animations.** Every Framer Motion animation and the boot sequence must check `useReducedMotion()` and fall back to static rendering. This hook is already used throughout the codebase — follow the existing pattern.

2. **`pointer-events: none` on all decorative overlays.** Every `HudBrackets`, scanline, noise texture, and cursor glow element must have `pointer-events: none` so they never interfere with clicks or keyboard navigation.

3. **HUD brackets use `overflow: hidden` panels correctly.** Most ControlPanel instances already have `overflow-hidden`. The bracket spans use `absolute` positioning and will be clipped if inside overflow-hidden. Add `overflow: visible` to the outermost wrapper and move `overflow: hidden` to an inner content div where needed, OR increase the panel size to account for the bracket inset (current bracket offset is 12px from edge, well inside the border-radius, so this is not an issue).

4. **Boot sequence uses `sessionStorage`, not `localStorage`.** The boot sequence must replay on a fresh browser open but not on same-session in-page navigation. `sessionStorage.getItem("boot_done")` is the correct persistence mechanism.

5. **Cursor glow is desktop-only.** Check `window.matchMedia("(hover: none)").matches` and return null from `CursorGlow` on touch devices.

6. **Magnetic buttons are desktop-only.** Same check — if `hover: none`, render the children unwrapped (no MagneticButton wrapper effect).

7. **Bento grid must not break on mobile.** All bento `xl:col-span-*` and `xl:row-span-*` classes must be prefixed with `xl:` — default (mobile/tablet) must remain a clean 1- or 2-column grid identical to today.
