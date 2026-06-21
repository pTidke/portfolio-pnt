# Product

## Register

brand

## Users

Recruiter-first, two audiences on one surface:

- **Tech recruiters & hiring managers** — skimming fast, often on mobile, deciding in seconds whether Prajwal is worth a conversation. They need role, focus, proof, and a way to reach out without hunting.
- **Engineering peers & collaborators** — judging technical depth. They drill into projects, read the case studies, check the stack, and reward substance.

The win: a recruiter books an interview / reaches out; an engineer comes away convinced the work is real. Lead for the skim, reward the dig.

## Product Purpose

Personal portfolio for Prajwal Tidke (data engineering). The site itself is the artifact: an IDE / dbt-lineage metaphor — file explorer, command palette, a drill-down DAG of "models" (about, experience, projects, skills) — that demonstrates the craft it claims rather than asserting it. Success = the interface earns trust on its own merit; the metaphor reads as competence, not gimmick.

## Brand Personality

Minimal, calm, editorial. Confident through restraint, not volume. The IDE/DAG metaphor is the voice, but it must stay quiet and precise — a well-kept editor, not a busy console. Tone is understated and exact; let whitespace, typography, and a single deliberate accent carry the identity.

## Anti-references

- **Busy, dashboard-y density** — cramped panels, everything competing, data-viz-for-its-own-sake. The IDE metaphor must not become an actual cluttered dashboard.
- **Neon dark-mode cliché** — gamer-RGB glow, saturated cyber gradients, "hacker terminal" theatrics.
- **Generic SaaS-template / bootcamp portfolio** — stock hero gradients, identical card grids, eyebrow-on-every-section scaffolding.

## Design Principles

- **Show, don't tell.** The interface proves the skill (real DAG, working palette, theme system) instead of listing it.
- **Restraint is the flex.** Calm surfaces, one accent, generous space. Quiet reads as senior.
- **The metaphor serves the reader, never the other way around.** Every IDE/dbt affordance must aid navigation or comprehension; drop it if it only decorates.
- **Skim-first, depth-on-demand.** Surface the essentials instantly; layer detail behind drill-down for those who want it.
- **Craft in the details.** Sharp corners, intentional motion, honest contrast — small things, done right, are the whole argument.

## Accessibility & Inclusion

WCAG AA. Body text ≥4.5:1, large text ≥3:1 (contrast already enforced across the dark + light themes). `prefers-reduced-motion` honored — every Framer Motion / CSS animation has a reduced fallback (already wired in `globals.css`). Both themes must clear AA independently. Keyboard-navigable (command palette is ⌘K-driven); focus states legible on both surfaces.
