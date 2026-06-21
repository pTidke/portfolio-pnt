---
name: Prajwal Tidke — Portfolio
description: A data-engineering portfolio that renders as the IDE it was built in — every section a dbt model that compiles to a verified fact.
colors:
  # Surfaces (dark theme = canonical; light values live in §2 + sidecar)
  base: "#06090f"
  window: "#0a0f1c"
  panel: "#0a1120"
  chrome: "#0c1322"
  code: "#070c16"
  card: "#0b1322"
  inset: "#0c1626"
  active: "#13203a"
  # Lines / dividers
  line: "#1c2740"
  line-soft: "#131c2e"
  line-mid: "#243049"
  line-code: "#19233a"
  # Ink ramp (brightest → faintest)
  ink-bright: "#f1f5fb"
  ink: "#e6ecf5"
  ink-soft: "#d4ddea"
  ink-dim: "#b8c4d6"
  ink-muted: "#9fb0c9"
  ink-faint: "#8a97ad"
  ink-ghost: "#7e8ba6"
  ink-low: "#5d6b88"
  ink-lower: "#4a5878"
  # Accents — layer-coded semantics, vivid on dark
  lineage-blue: "#5b9dff"
  staging-teal: "#2dd4bf"
  mart-amber: "#fbbf24"
  exposure-green: "#4ade80"
  jinja-purple: "#c084fc"
  string-green: "#7fd88f"
  # Fixed signals (theme-independent)
  on-accent: "#04101f"
  light-red: "#ff5f57"
  light-yellow: "#febc2e"
  light-green: "#28c840"
typography:
  display:
    fontFamily: "var(--font-plex), 'IBM Plex Sans', system-ui, sans-serif"
    fontSize: "40px"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.5px"
  headline:
    fontFamily: "var(--font-plex), 'IBM Plex Sans', system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "normal"
  title:
    fontFamily: "var(--font-plex), 'IBM Plex Sans', system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "var(--font-plex), 'IBM Plex Sans', system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "var(--font-jetbrains), 'JetBrains Mono', ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "1.5px"
  code:
    fontFamily: "var(--font-jetbrains), 'JetBrains Mono', ui-monospace, monospace"
    fontSize: "12.5px"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "normal"
rounded:
  sharp: "0px"
  dot: "9999px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "16px"
  lg: "24px"
  xl: "28px"
components:
  button-primary:
    backgroundColor: "{colors.lineage-blue}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label}"
    rounded: "{rounded.sharp}"
    padding: "8px 16px"
  button-ghost:
    backgroundColor: "{colors.window}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.sharp}"
    padding: "5px 11px"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink-dim}"
    rounded: "{rounded.sharp}"
    padding: "15px 17px"
  tag:
    backgroundColor: "{colors.chrome}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.sharp}"
    padding: "5px 11px"
  input-search:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    typography: "{typography.code}"
    rounded: "{rounded.sharp}"
    padding: "10px 12px"
  nav-link-active:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    typography: "{typography.code}"
    rounded: "{rounded.sharp}"
    padding: "5px 10px"
---

# Design System: Prajwal Tidke — Portfolio

## 1. Overview

**Creative North Star: "The Compiled Resume"**

Every section of this portfolio is a dbt model. The source — SQL or YAML — sits on top in a real code block; the rendered, human-readable fact compiles below it, stamped `COMPILED · 1 row`. The whole site is the artifact: an IDE shell (window chrome with traffic lights, a file explorer, a command palette, a console dock reading `PASS=14 WARN=0 ERROR=0`) wrapped around a drill-down DAG where `src.prajwal` descends into `stg.experience`, `mart.projects`, `stg.skills`. The design doesn't *claim* data-engineering competence; it *renders* as the tool that competence is practiced in. Provenance is the aesthetic — facts arrive compiled, verified, lineage-traceable.

The voice is minimal, calm, and editorial — confident through restraint, not volume. The IDE metaphor stays a well-kept editor, never a busy console. Whitespace, a disciplined mono/sans split, and a single structural accent (Lineage Blue) carry the identity; the other accents are strict layer semantics, not decoration. It ships dark by default and light by choice, both themes engineered to clear WCAG AA independently.

This system explicitly rejects: **busy, dashboard-y density** (the metaphor must not become an actual cluttered dashboard); **neon dark-mode theatrics** (no gamer-RGB glow, no cyber gradients, no "hacker terminal" costume); and **the generic SaaS-template / bootcamp portfolio** (no stock hero gradients, no identical card grids, no eyebrow above every section).

**Key Characteristics:**
- Sharp corners everywhere — `border-radius: 0` is enforced globally; only dots are round.
- Dual-theme by CSS variable — every surface/ink color is a `--c-*` token; nothing is raw hex.
- Mono for the machine, sans for the human — JetBrains Mono carries paths, code, labels, provenance; IBM Plex Sans carries prose.
- One structural accent (Lineage Blue) + layer-coded semantic accents (teal/amber/green/purple).
- Quiet motion: a 2px lift on hover, staggered reveals, and a single signature — data pulsing through the DAG edges.

## 2. Colors

A dim, near-black slate field on dark; a cool, near-white paper on light. In both, color is rationed: surfaces and ink are quiet, and saturated accent appears only where it carries meaning.

Every color is defined twice — a dark value (canonical, in the frontmatter) and a light value — behind a `--c-*` CSS variable that flips on `html[data-theme="light"]`. Light values are given below in brackets.

### Primary
- **Lineage Blue** (`#5b9dff` dark / `#1a56db` light): The one structural accent. It marks the active model, the lineage edges of the DAG, the nav underline, the file-tree selection rule, the primary `resume.pdf` button, and SQL keywords. When something is *the current focus* or *the path between facts*, it is Lineage Blue. The text form darkens on light so labels clear AA; the fill/edge form stays vivid in both.

### Secondary — Layer Semantics
These four are not decoration; each names a dbt layer or exposure and is used only for its layer.
- **Staging Teal** (`#2dd4bf` / `#0f766e`): `staging` models — experience and skills.
- **Mart Amber** (`#fbbf24` / `#92610a`): `mart` models — project case studies, headline metrics.
- **Exposure Green** (`#4ade80` / `#177a3a`): exposures and live status — the contact surface, the `ready` build state, the open-to-work pill.
- **Jinja Purple** (`#c084fc` / `#7e22ce`) & **String Green** (`#7fd88f` / `#1f7a40`): syntax highlighting inside code blocks only (Jinja refs, quoted strings).

### Neutral
- **Field Black** (`base #06090f` / `#eef1f7`): the page behind the window, dusted with a faint radial dot-grid (`--c-grid`).
- **Window / Panel / Chrome / Code / Card / Inset** (`#0a0f1c…#0c1626` / `#ffffff…#f0f4fa`): the layered editor surfaces — window shell, side panels, title chrome, code blocks, content cards, inset metric strips. They step in close lightness; the hierarchy is read by hairline, not by heavy contrast.
- **Line ramp** (`line #1c2740`, `line-mid #243049`, `line-soft`, `line-code` / `#d3dbe8…`): hairline borders and dividers. `line-mid` is the interactive/stronger edge; `line-soft` the faintest section rule.
- **Ink ramp** (`ink-bright #f1f5fb` → `ink-lower #4a5878` / `#0b1220` → `#a3adc0`): nine steps from headline ink to faint scaffolding. `ink`/`ink-soft`/`ink-dim` carry content; `ink-muted` carries secondary metadata (the AA floor on light); `ink-low`/`ink-lower` are decorative scaffolding only.

### Fixed Signals
- **On-Accent** (`#04101f`): dark navy text sat on any vivid accent fill (buttons, active palette tabs). Theme-independent — it reads on the bright accent in both modes.
- **Window Lights** (`#ff5f57`, `#febc2e`, `#28c840`): the macOS traffic-light dots. Universal; never themed.

### Named Rules
**The Lineage Blue Rule.** Blue is structural, not decorative. It means *active / focused / on the path*. The other accents are layer codes — never reach for teal or amber to "add color"; reach for them only when the thing genuinely belongs to that dbt layer.

**The Dual-Surface Rule.** No raw hex in components. Every surface/ink color is a `--c-*` variable or a Tailwind token that resolves to one, and both themes must independently clear AA — body ≥4.5:1, large ≥3:1. A value that only passes on dark is a bug, not a style.

**The Rationed-Accent Rule.** Accent text must clear contrast on its own surface. Bright accents are for *fills, dots, borders, and edges* (contrast-exempt); accent *text, numbers, and the status pill* use the darkened `--c-accent-*` text variant. If you're typing an accent hex into a component, you're doing it wrong.

## 3. Typography

**Display / Body Font:** IBM Plex Sans (`var(--font-plex)`, with system-ui fallback) — weights 400 / 500 / 600.
**Label / Code Font:** JetBrains Mono (`var(--font-jetbrains)`, with ui-monospace fallback) — weights 400 / 500 / 700.

**Character:** A clean humanist sans for everything a person reads, paired on a hard contrast axis with a developer-grade mono for everything a machine emits. The two never blur. Plex carries warmth and authority in the names and prose; JetBrains carries provenance — paths, SQL, layer tags, metrics, the `COMPILED` stamps.

### Hierarchy
- **Display** (Plex 600, 40px / 34px in modals, line-height 1.05, letter-spacing −0.5px): the name on the identity/about model. One per surface.
- **Headline** (Plex 600, 24px, 1.1): project and modal titles.
- **Title** (Plex 600, 17px, 1.3): card headings — a role, a degree, a domain.
- **Body** (Plex 400, 14.5–16px, ~1.6): prose, bios, case-study copy. Held to a `max-width` of ~640–660px (≈65–75ch).
- **Label** (JetBrains 500, 9–11px, letter-spacing 1px–1.5px, often layer names): the mono metadata voice — `EXPLORER · portfolio`, `SOURCE` / `STAGING` / `MART`, `COMPILED · 1 row`, breadcrumbs, tags.
- **Code** (JetBrains 400, 12.5px, 1.75): the SQL/YAML code blocks with per-token syntax color.

### Named Rules
**The Mono-for-Machine Rule.** JetBrains Mono is reserved for what a machine would emit: code, file paths, layer tags, metrics, build output, provenance stamps. IBM Plex Sans is reserved for what a human writes: names, headings, prose. Never set body prose in mono "for the dev look," and never set a path in sans.

**The Compiled-Fact Rule.** Content arrives as a compiled result of code shown directly above it. A heading without its `models / x.sql` source line and `COMPILED · …` stamp breaks the metaphor. Keep the source → compile → fact rhythm.

## 4. Elevation

A hybrid system. The structural hierarchy is **tonal and hairline** — surfaces step in close lightness and are separated by 1px `line` borders, not shadows. Shadows are reserved for things that genuinely *float above the page*: the window shell, modals, the command palette, and DAG nodes on hover. All shadow and scrim values are theme variables, so depth is rendered correctly on both surfaces rather than casting black onto pale paper.

### Shadow Vocabulary
- **Window** (`--shadow-window`: `0 28px 90px rgba(0,0,0,.6)` dark / `0 20px 60px rgba(15,23,42,.14)` light): the desktop app window lifting off the dot-grid.
- **Pop** (`--shadow-pop`: `0 30px 90px rgba(0,0,0,.7)` / `0 24px 70px rgba(15,23,42,.20)`): modals and the command palette.
- **Node rest / hover** (`--shadow-node` / `--shadow-node-hover`): DAG nodes sit with a faint shadow and lift on hover, hover also adding a `0 0 0 3px {accent}30` colored ring.
- **Scrim** (`--c-scrim`: `rgba(3,6,12,.74)` / `rgba(15,23,42,.32)`) + a 3–4px backdrop blur behind modals and palette.

### Named Rules
**The Sharp-Edge Rule.** `border-radius` is `0` on every box. The Tailwind radius scale is hard-zeroed so stray `rounded-*` utilities are no-ops. The *only* round things are dots and the window traffic-lights (opt-in via `.dot`, 9999px). A rounded card is a regression.

**The Theme-Tuned Shadow Rule.** Never cast a black shadow on the light surface. Shadows are `--shadow-*` variables — deep black on dark, soft slate-tinted and lower-opacity on light. If a light-mode surface looks muddy underneath, the shadow token is wrong.

## 5. Components

Precise and restrained. Everything is sharp-cornered and hairline-bordered, quiet at rest, with exactly one accent and a 2px lift on interaction. No element shouts.

### Buttons
- **Shape:** sharp (`0px`).
- **Primary** (`resume.pdf`): Lineage Blue fill, On-Accent (`#04101f`) text, JetBrains 500 bold, `8px 16px`. The one filled element on a surface.
- **Ghost** (`⌘K search`, `▸ run`, theme toggle): transparent on `line-mid` hairline border, `ink-muted` text, mono; text brightens to `ink` on hover.
- **Hover / Focus:** `translateY(-2px)` + `brightness(1.08)` on fills; `scale(0.97)` on tap. 150–180ms, ease-out.

### Chips / Tags
- **Style:** `line-mid` hairline border, mono, two sizes — small (bare, `ink-faint`) and standard (on `chrome` fill, `ink-muted`).
- **State:** hover lifts 2px and shifts border to `line-hover` with text to `ink-soft`.

### Cards / Containers
- **Corner Style:** sharp (`0px`).
- **Background:** `card`; inset/metric strips use `inset` on a `line-mid` border.
- **Shadow Strategy:** none at rest — separated by `line` hairline. (See Elevation.)
- **Border:** 1px `line`. The single "current role" card takes a *full* `accent-teal` border (never a side-stripe) plus a `● latest` mono marker.
- **Internal Padding:** `15px 17px` typical.

### Inputs / Fields
- **Style:** `line-mid` hairline on `card` (or bare transparent in the palette), mono, `ink` text, sharp.
- **Focus:** native outline suppressed; rely on the border + a blinking `accent-teal` caret block in the console/ask surfaces.
- **Placeholder:** `ink-low` — kept legible, never decorative-faint.

### Navigation
- **Style:** a breadcrumb (`src.prajwal / lineage`) plus mono nav links; the active link gets an animated Lineage-Blue underline (`layoutId` shared-element). Default `ink-ghost` → active `ink`. Mobile collapses to a compact top bar with the palette trigger + theme toggle.

### Signature: The Lineage DAG
The centerpiece. `src.prajwal` (a SOURCE node) on the left; four layer-coded model nodes on the right; click to drill into a sub-view of children, click the parent to zoom back — all morphing via shared-layout spring motion. Nodes are `chrome`-filled, hairline-bordered, lifting to an accent border + `node-hover` fill + colored glow ring on hover. **Edges carry the signature motion:** a faint structural dashed line is always drawn, and a two-layer pulse (blurred glow halo + crisp core, Lineage Blue) travels each edge source→target, linearly and continuously — data flowing through the lineage. `pathLength`-normalized so every edge pulses at uniform speed; gated by `prefers-reduced-motion` (reduced users get the static line).

### Signature: The Compile Block
Each section opens with a `models / x.sql · layer` path line, a syntax-highlighted SQL/YAML code block, and a `COMPILED · N rows` stamp — then the rendered content. This source→compile→fact unit is the spine of the whole site.

## 6. Do's and Don'ts

### Do:
- **Do** keep `border-radius: 0` on every box. Round only dots and the window traffic-lights via `.dot`.
- **Do** route every color through a `--c-*` variable or Tailwind token, and verify both themes clear AA independently (body ≥4.5:1, large ≥3:1).
- **Do** reserve Lineage Blue for structure (active / lineage / focus) and use the teal/amber/green accents *only* for their dbt layer.
- **Do** split type strictly: JetBrains Mono for machine output (code, paths, labels, metrics), IBM Plex Sans for human prose.
- **Do** keep motion quiet — a 2px hover lift, staggered list reveals, and the one DAG-edge pulse. Always ship a `prefers-reduced-motion` fallback.
- **Do** preface rendered content with its compiled source (`models / x.sql` → code → `COMPILED`).

### Don't:
- **Don't** let the IDE metaphor become a **busy, dashboard-y** surface — cramped panels, competing data, viz-for-its-own-sake. Restraint is the brief.
- **Don't** reach for **neon dark-mode theatrics** — gamer-RGB glow, saturated cyber gradients, "hacker terminal" costume.
- **Don't** ship **generic SaaS-template / bootcamp-portfolio** moves — stock hero gradients, identical card grids, or a tiny uppercase eyebrow above every section.
- **Don't** use a `border-left`/`border-right` colored **side-stripe** to emphasize a card. Use a full border + a mono marker (as the "current role" card does).
- **Don't** type an accent hex into a component, and **never** cast a black shadow on the light surface — both are token failures.
- **Don't** set body prose in mono or a file path in sans. The machine/human split is load-bearing.
