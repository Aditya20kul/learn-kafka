# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An interactive single-page app for learning Apache Kafka. Seven concept pages, each with prose plus a hand-built, step-through SVG animation, followed by an Interview Q&A page. No backend — everything is static content plus client-side state. Dark mode is the default; a light theme exists.

## Commands

```bash
npm run dev       # Vite dev server (default http://localhost:5173)
npm run build     # tsc (type-check, no emit) THEN vite build — type errors fail the build
npm run preview   # serve the production build from dist/
npm run lint      # eslint . --ext ts,tsx --max-warnings 0  (zero warnings tolerated)
```

There is **no test runner** configured — don't invent `npm test`. `npm run build` is the reliable correctness gate: `tsconfig.json` has `strict`, `noUnusedLocals`, and `noUnusedParameters`, so an unused import or variable breaks the build.

## Stack

Vite + React 18 + TypeScript, React Router v6, Tailwind CSS, Framer Motion (animation), `lucide-react` (icons), `clsx` (conditional classNames). `@xyflow/react`, `recharts`, and `tailwind-merge` are in `package.json` but **not used anywhere in `src/`** — all diagrams are hand-rolled SVG, not React Flow or chart libraries.

## Architecture

### Content lives in `src/data/` — these arrays drive everything

- **`concepts.ts`** — the ordered list of 7 concepts (`id`, `slug`, `title`, `shortTitle`, `icon`, `color`, `order`). This single array is the source of truth for the sidebar nav, the prev/next `ConceptNav`, progress tracking, and route slugs. **Adding a concept means: add an entry here, create the matching `src/pages/` file, and register its `<Route>` in `src/App.tsx`** — these three are not auto-generated from each other.
- **`simulationSteps.ts`** — a `SimStep[]` (`id`, `label`, `description`) per simulation. The length of this array is the step count, and each simulation reads `currentStep` to decide what to draw. This array is the contract between the playback controls (which show `label`/`description`) and the SVG (which keys its frame off the index).
- **`interviewQuestions.ts`** — `InterviewQuestion[]` (`level`, `type`, `question`, `answer` as markdown-ish string, `tags`) for the Interview Q&A page.

### Concept page pattern (`src/pages/`)

Every concept page is one file and follows the same skeleton: wrap in `<PageWrapper>` (Framer Motion enter/exit), header + prose with `<SectionHeader>` / `<ConceptCallout>` (variants: `insight` | `warning` | `info`) / `<CodeBlock>`, then the interactive sim, then `<ConceptNav />` at the bottom. The sim is wired in two lines:

```tsx
const controls = useSimulation(offsetSteps.length)   // page owns the engine
// ...
<OffsetSim controls={controls} />                    // sim is driven by it
```

### Simulations are pure functions of `currentStep` (`src/simulations/`)

A simulation component holds **no animation state of its own**. It receives `controls` and derives every visual (which cells are highlighted, where a pointer sits, whether a crash overlay shows) from `controls.currentStep`. It renders an inline `<svg>` using Framer Motion `<motion.g>` keyed on the step for transitions, and ends with `<StepControls controls={controls} steps={...} />`. To change an animation, edit the step array in `simulationSteps.ts` and the per-step branching in the sim — keep the two in sync.

### The simulation engine (`hooks/useSimulation.ts` + `hooks/useInterval.ts`)

`useSimulation(totalSteps)` owns all timing and progression: `state` (`idle` | `playing` | `paused` | `stepping` | `complete`), `currentStep`, and `speed`. While playing it auto-advances via `useInterval` at `Math.round(1200 / speed)` ms and lands on `complete` at the last step. The SVG is "dumb"; this hook is the only place timing lives. `useInterval` is the standard ref-based pattern that survives changing callbacks/delays.

### Progress tracking (`context/ProgressContext.tsx`)

`ProgressProvider` (wrapping the app in `App.tsx`) persists a `{ conceptId: true }` map to `localStorage` under key `kafka-learn-progress`. `AppShell` marks the current concept complete in a `useEffect` on route change — visiting a page completes it. Use the `useProgress()` exported **from the context**.

> Gotcha: `hooks/useProgress.ts` is a near-duplicate standalone implementation using the same storage key but its own React state. It is **not** the one wired into the app (the context is). Prefer the context version; don't add a second source of truth.

### Theming & design tokens

Colors are CSS variables defined in `src/index.css` — `:root` is the dark palette, `.light` overrides it. `tailwind.config.ts` maps those vars to Tailwind tokens (`bg-primary`, `text-text-2`, etc.), so components style with either named tokens or the arbitrary-value form `text-[var(--text-2)]`; both resolve to the same variable. **SVG simulations reference `var(--...)` directly** for fills/strokes, so diagrams re-theme automatically. Tailwind `darkMode` is `'class'` and `index.html` ships with `class="dark"` on `<html>`.

The theme toggle adds/removes the `dark`/`light` class on `document.documentElement`. Note there are **two independent toggle buttons** (`TopBar` for mobile, `ThemeToggle` in the desktop sidebar) and each keeps its own local `isDark` state — they are not synchronized with each other.

### Layout (`components/layout/`)

`AppShell` renders a desktop sidebar at ≥1024px and a `TopBar` + slide-over `MobileSidebar` below that (breakpoint enforced via the `.desktop-sidebar` / `.mobile-only` rules in `index.css`). Routes are lazy-loaded with `React.lazy` + `Suspense` in `App.tsx`.

## Conventions

- Reusable primitives are `Button` and `ConceptCallout` — both are variant-driven and composed with `clsx`. Reach for these rather than re-styling raw elements.
- `dist/` is **committed to the repo** (only `node_modules/` and `.claude/` are gitignored), so a build will show up as tracked changes in `git status`.
