---
target: Workspace (src.prajwal portfolio)
total_score: 35
p0_count: 0
p1_count: 2
timestamp: 2026-06-20T06-48-59Z
slug: components-workspace-tsx
---
# Critique — Workspace (src.prajwal portfolio)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Breadcrumbs, active nav underline, tab bar, file-tree selection, console state — comprehensive. |
| 2 | Match System / Real World | 3 | dbt jargon (stg/mart/COMPILED/lineage) is fluent for engineers, opaque for non-technical recruiters. |
| 3 | User Control and Freedom | 4 | Esc, scrim click-out, breadcrumb home, parent-node zoom-back, tab close. |
| 4 | Consistency and Standards | 4 | Strong token system; both themes AA; consistent patterns throughout. |
| 5 | Error Prevention | 3 | Minimal input surface; no destructive actions to guard. |
| 6 | Recognition Rather Than Recall | 4 | File tree + ⌘K palette + nav + DAG all aid discovery; ⌘K advertised in chrome. |
| 7 | Flexibility and Efficiency | 4 | ⌘K palette, Esc, 4 redundant navigation paths. Excellent for power users. |
| 8 | Aesthetic and Minimalist Design | 4 | Calm, restrained, every element purposeful; sharp-corner system. |
| 9 | Error Recovery | 2 | Ask-AI returns a canned "backend offline"; the headline interactive feature dead-ends. |
| 10 | Help and Documentation | 3 | Contextual DAG instructions + palette hints; no deeper help (not needed). |
| **Total** | | **35/40** | **Good (upper band, near-excellent)** |

## Anti-Patterns Verdict

**Does this look AI-generated? No — convincingly not.**

**LLM assessment:** The dbt-lineage / IDE-as-portfolio metaphor is specific, committed, and original. It passes the category-reflex check at both altitudes: the first-order reflex for "data-engineer portfolio" is a generic dark dashboard; this commits to a literal working IDE instead. The second-order trap (editorial-typographic, or terminal-neon) is also avoided — it's calm, not theatrical. No gradient text, no glassmorphism, no decorative eyebrows (the SOURCE/STAGING/MART tags are functional dbt layer labels, not kickers), sharp corners enforced, real motion with a genuine signature (the edge pulse). This is voice, not slop.

**Deterministic scan:** `detect.mjs` over `components/` + `app/` returned `[]` — zero anti-pattern hits. Agrees with the LLM read.

**Visual evidence:** Both themes captured earlier this session (overview + drill-down). Light is calm/editorial and clears AA; dark is crisp; the edge pulse renders on both.

## Overall Impression

A genuinely distinctive, high-craft portfolio that proves data-engineering competence by *being* a data tool rather than describing one. The single biggest opportunity is the **recruiter-first half of the stated audience**: the interface is fluent for engineers but assumes dbt domain knowledge, and its two most novel interactive promises (Ask-AI, resume.pdf) currently dead-end — which is the one thing that can dent a "build something you can trust" brand.

## What's Working

1. **Committed, original metaphor.** Show-don't-tell executed fully: file tree, ⌘K palette, drill-down DAG, source→compile→fact rhythm. Nobody mistakes this for a template.
2. **Four redundant navigation paths** (DAG, file tree, command palette, nav bar) — outstanding recognition + power-user efficiency, all kept in sync.
3. **Craft under the hood.** Dual theme both clearing AA, sharp-corner system, restrained motion plus one real signature (pathLength-normalized edge pulse, reduced-motion gated).

## Priority Issues

- **[P1] Jargon barrier for the recruiter half.** dbt nomenclature (`stg.experience`, `mart.projects`, `COMPILED · 1 row`, layer tags) is the dominant read; a non-technical recruiter must translate "stg.experience = work history" before the skim pays off. The stated win (book an interview) depends on that skim landing fast. The node subtitles ("3 roles", "7 case studies") help — push that plain-language layer harder so the human meaning leads and the jargon is secondary. *Fix: /impeccable clarify.*
- **[P1] Ask-AI is a dead headline feature.** "Ask the assistant about my work" is the most novel, most-poked element and returns "demo assistant offline." Peak-end violation: a curious visitor pokes the standout feature and it's broken. On a "build something you can trust" brand, a visibly non-working flagship feature is the highest-leverage credibility risk. *Fix: wire a real (even canned-but-useful, data-keyed) Q&A, or relabel/cut it. /impeccable harden or /impeccable clarify.*
- **[P2] Provenance is theatre.** `PASS=14 WARN=0 ERROR=0 · last run just now` and `COMPILED · 1 row` are static and identical everywhere. Engineers (the depth audience) will clock it as decoration, mildly undercutting the "real tool" claim. *Fix: derive a couple of values from real data, or lean in knowingly. /impeccable harden.*
- **[P2] Mobile drops the centerpiece.** Below 880px the IDE collapses to stacked sections and the DAG — the signature — is desktop-only. A recruiter on a phone never sees the best idea. *Fix: a lightweight mobile lineage view or static DAG. /impeccable adapt.*
- **[P3] Primary CTA is a dead link.** `resume.pdf` (and the in-content resume buttons) point to `href="#"`. The site-wide primary action goes nowhere. *Fix: wire the real PDF.*

## Persona Red Flags

**Jordan (non-technical recruiter):** `stg.experience` / `mart.projects` / `COMPILED · 1 row` read as code, not career facts. SOURCE/STAGING/MART tags are meaningless without dbt context. Saved by the "click to expand" hint and the plain subtitles — but the first 5-second read is jargon-first.

**Alex (power-user engineer):** Superbly served on navigation — ⌘K, Esc, four paths. Red flags: Ask-AI dead-ends, `resume.pdf` is `href="#"`, and the static `PASS=14` reads as theatre to someone who knows what a real dbt run looks like.

**Casey (mobile recruiter):** The DAG centerpiece is absent on phone; the primary resume CTA dead-links. Theme preference persists across reloads (good). Touch targets mostly adequate.

## Minor Observations

- Lineage edges (bright blue @ 50% opacity) read slightly faint on the light surface — decorative, acceptable.
- "● latest" marker on the current-role card is a tasteful, compliant emphasis.
- `src.about` node vs the identity model is a slight IA overlap (about/identity both cover "who").
- The DAG's static structural dashed line + pulse are desktop-only (tied to the mobile-collapse issue).

## Questions to Consider

- What does a non-technical recruiter actually extract in the first 5 seconds — and does it say "senior data engineer worth interviewing" *before* they decode the metaphor?
- Should Ask-AI either work or not exist? A dead headline feature is the one thing that contradicts "build something you can trust."
- Is the DAG the right lead on mobile, or does the phone audience need a different first read?
