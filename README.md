# Portfolio — IDE / dbt-DAG themed

Next.js (App Router) + Tailwind CSS + Framer Motion. Rebuild of `Portfolio.dc.html`.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Where to edit content

**Everything visible lives in `lib/data.ts`** — one file. Replace the dummy
(`lorem ipsum`) copy there; no component needs touching.

- `profile` — name, title, status, location, links, tags
- `about` — bio + "what I optimize for"
- `EXPERIENCE` — 3 roles
- `SKILLS` — 6 domains, 25+ tools
- `PROJECTS` — 7 case studies (each is its own DAG node + tab)
- `EDUCATION` — 2 degrees
- `NODES` / `EDGES` — the lineage graph wiring (only touch to re-layout the DAG)

## Design rules baked in

- **No border-radius anywhere** — enforced globally in `app/globals.css`
  (`border-radius: 0 !important`) and in `tailwind.config.ts`. All corners boxed.
- Fonts: IBM Plex Sans (UI) + JetBrains Mono (code/labels), via `next/font`.
- Motion: shared springs/variants in `components/motion.tsx`.

## Ask-AI (⌘K → "ask AI")

The palette UI is complete but the backend is **stubbed**. To go live, replace
the `sendAsk()` body in `components/palette.tsx` (marked `TODO(backend)`) with a
`fetch('/api/ask', …)` call to a route that hits Claude (`claude-opus-4-8`).

## Navigation model (drill-down DAG)

Overview shows `src.prajwal` → 4 main nodes: **About · Experience · Projects · Skills**.
- **Experience / Projects / Skills** expand into a sub-DAG (the node morphs to the
  left as the parent; children fan out). Defined in `lib/graph.ts` (`MAINS`, `SUB`).
- **About** is a leaf → opens its modal directly. Education is folded into About.
- A **leaf** node (a role / project / skill domain) opens a centered **modal**
  (`components/modal.tsx` → `ModalBody` in `components/sections.tsx`).
- No editor tabs — navigation is the **header** (`components/nav.tsx`): section links
  + breadcrumb (`~ / projects / project_one.sql`) + Contact + resume.
- Narrow screens fall back to stacked-scroll sections.

## Corners

Boxy everywhere EXCEPT dots + the red/blue/green window lights — those use the
`.dot` class (`app/globals.css`). Tailwind radius tokens are all `0`.

## Layout map

- `components/Workspace.tsx` — state machine (view + modal) + responsive shell
- `components/nav.tsx` — navigation header + breadcrumb
- `components/dag.tsx` — hierarchical drill-down DAG with morph
- `components/modal.tsx` — modal shell; `ModalBody` (in `sections.tsx`) dispatches content
- `components/chrome.tsx` — title bar, file tree, console dock, mobile bars
- `components/sections.tsx` — model panels + per-role / per-domain modal views
- `components/about-md.tsx` — the README-style About card (+ education)
- `components/palette.tsx` — ⌘K command palette
- `components/ui.tsx` — code blocks, section shell, pills, tags
- `lib/data.ts` — all content · `lib/graph.ts` — DAG hierarchy
