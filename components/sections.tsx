"use client";

import { motion } from "framer-motion";
import {
  profile,
  EXPERIENCE,
  SKILLS,
  PROJECTS,
  EDUCATION,
  CERTIFICATES,
  TOOL_COLORS,
} from "@/lib/data";
import type { ModalId, SectionId, ExternalLink } from "@/lib/types";
import { EASE, Item } from "./motion";
import {
  SectionShell,
  StatusPill,
  Tag,
  ResumeButton,
  type CodeLine,
} from "./ui";
import AboutMd from "./about-md";

/* ── external link (repo / live / data) ────────────────────────────────────
   ghost by default; `primary` fills with the accent for the one hero link. */
const LINK_GLYPH: Record<NonNullable<ExternalLink["kind"]>, string> = {
  repo: "↗",
  live: "▸",
  data: "▦",
};

function ExtLink({
  link,
  primary,
  accent,
}: {
  link: ExternalLink;
  primary?: boolean;
  accent?: string;
}) {
  return (
    <motion.a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={
        primary
          ? { y: -2, filter: "brightness(1.08)" }
          : { y: -2, borderColor: "var(--c-line-hover)" }
      }
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.18, ease: EASE }}
      className={
        "inline-flex items-center gap-[7px] font-mono text-[12px] no-underline " +
        (primary
          ? "font-bold px-[14px] py-[7px]"
          : "border border-line-mid bg-card px-[11px] py-[6px] text-ink-muted hover:text-ink")
      }
      style={primary ? { background: accent, color: "var(--c-on-accent)" } : undefined}
    >
      <span aria-hidden>{LINK_GLYPH[link.kind || "repo"]}</span>
      <span>{link.label}</span>
    </motion.a>
  );
}

/* ── IDENTITY ──────────────────────────────────────────────────────────── */
const identityCode: CodeLine[] = [
  [["{{ config(materialized=", "jinja"], ["'source'", "str"], [") }}", "jinja"]],
  [],
  [["select", "kw"]],
  [["  '" + profile.name + "'", "str"], ["  as name,"]],
  [["  '" + profile.title + "'", "str"], ["  as title,"]],
  [["  '" + profile.focus + "'", "str"], ["  as focus,"]],
  [["  true", "bool"], ["          as open_to_work"]],
  [["from", "kw"], [" raw.me"]],
];

function Identity({ accent }: { accent: string }) {
  return (
    <SectionShell
      accent="blue"
      path="models / identity.sql"
      layer="source"
      code={identityCode}
      compiled="COMPILED · 1 row"
    >
      <Item>
        <div className="mt-4 font-mono text-[13px] text-accent-blue">
          {profile.handle}
        </div>
      </Item>
      <Item>
        <h1 className="mt-1 text-[40px] font-semibold leading-[1.05] tracking-[-0.5px] text-ink-bright">
          {profile.name}
        </h1>
      </Item>
      <Item>
        <div className="mt-1 text-[16px] text-ink-muted">
          {profile.title} <span className="text-ink-lower">·</span>{" "}
          {profile.focus}
        </div>
      </Item>
      <Item>
        <div className="mt-4 flex flex-wrap items-center gap-[10px]">
          <StatusPill />
          <span className="font-mono text-[12px] text-ink-ghost">
            {profile.location}
          </span>
          <span className="font-mono text-[12px] text-ink-ghost">
            {profile.tenure}
          </span>
        </div>
      </Item>
      <Item>
        <div className="mt-4 flex flex-wrap gap-2">
          {profile.tags.map((t) => (
            <Tag key={t} small color={TOOL_COLORS[t]}>
              {t}
            </Tag>
          ))}
        </div>
      </Item>
      <Item>
        <div className="mt-5">
          <ResumeButton accent={accent} />
        </div>
      </Item>
    </SectionShell>
  );
}

/* ── EXPERIENCE ────────────────────────────────────────────────────────── */
const expCode: CodeLine[] = [
  [["{{ config(materialized=", "jinja"], ["'table'", "str"], [") }}", "jinja"]],
  [["select", "kw"], [" company, role, span, impact, stack"]],
  [["from", "kw"], [" "], ["{{ ref(", "jinja"], ["'career_history'", "str"], [") }}", "jinja"], [" "], ["order by", "kw"], [" span "], ["desc", "kw"]],
];

function Experience() {
  return (
    <SectionShell
      accent="teal"
      path="models / experience.sql"
      layer="staging"
      code={expCode}
      compiled={`COMPILED · ${EXPERIENCE.length} rows`}
    >
      <div className="mt-4 flex flex-col gap-3">
        {EXPERIENCE.map((e, i) => (
          <Item key={e.company}>
            <motion.div
              whileHover={i === 0 ? { y: -2 } : { y: -2, borderColor: "var(--c-line-hover)" }}
              transition={{ duration: 0.18, ease: EASE }}
              className={
                "border bg-card px-[17px] py-[15px] " +
                (i === 0 ? "border-accent-teal" : "border-line")
              }
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div className="text-[17px] font-semibold text-ink-bright">
                  {e.role}{" "}
                  <span className="font-normal text-ink-low">· {e.company}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[12px] text-ink-ghost">
                  {i === 0 && (
                    <span className="text-accent-teal">● latest</span>
                  )}
                  {e.span}
                </div>
              </div>
              <p className="mt-[7px] text-[14.5px] leading-[1.5] text-ink-dim">
                {e.body}
              </p>
              <div className="mt-[11px] flex flex-wrap gap-[6px]">
                {e.stack.map((s) => (
                  <Tag key={s} small color={TOOL_COLORS[s]}>
                    {s}
                  </Tag>
                ))}
              </div>
              {e.link && (
                <div className="mt-[13px]">
                  <ExtLink link={e.link} primary accent="var(--c-accent-teal)" />
                </div>
              )}
            </motion.div>
          </Item>
        ))}
      </div>
    </SectionShell>
  );
}

/* ── SKILLS ────────────────────────────────────────────────────────────── */
const skillsCode: CodeLine[] = [
  [["version:", "kw"], [" 2"]],
  [["models:", "kw"]],
  [["  - "], ["name:", "kw"], [" skills"]],
  [["    "], ["domains:", "kw"], [" [languages, orchestration, lakehouse, cloud, modeling, ai]"]],
];

function Skills() {
  return (
    <SectionShell
      accent="teal"
      path="models / skills.yml"
      layer="staging"
      code={skillsCode}
      compiled={`COMPILED · ${SKILLS.length} domains`}
    >
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SKILLS.map((d) => (
          <Item key={d.name}>
            <motion.div
              whileHover={{ y: -3, borderColor: "var(--c-line-hover)" }}
              transition={{ duration: 0.2, ease: EASE }}
              className="flex h-full flex-col border border-line bg-card p-[15px]"
            >
              {(() => {
                const c = `var(--c-accent-${d.accent || "teal"})`;
                return (
                  <>
                    <div className="mb-[12px] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-[7px]">
                        <span
                          className="inline-block h-[7px] w-[7px] flex-none"
                          style={{ background: c }}
                        />
                        <span className="font-mono text-[12px]" style={{ color: c }}>
                          {d.name}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-ink-ghost opacity-60">
                        {d.tools.length}
                      </span>
                    </div>
                    <ul className="flex-grow font-mono text-[12.5px]">
                      {d.tools.map((t) => (
                        <li
                          key={t}
                          className="flex items-baseline gap-[9px] py-[4px] text-ink-soft"
                        >
                          <span style={{ color: c }} className="flex-none">
                            -
                          </span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                );
              })()}
            </motion.div>
          </Item>
        ))}
      </div>
    </SectionShell>
  );
}

/* ── EDUCATION ─────────────────────────────────────────────────────────── */
const eduCode: CodeLine[] = [
  [["select", "kw"], [" school, degree, span, detail, coursework"]],
  [["from", "kw"], [" "], ["{{ ref(", "jinja"], ["'history'", "str"], [") }}", "jinja"], [" "], ["where", "kw"], [" kind = "], ["'education'", "str"]],
];

function EducationSection() {
  return (
    <SectionShell
      accent="blue"
      path="models / education.sql"
      layer="source"
      code={eduCode}
      compiled={`COMPILED · ${EDUCATION.length} rows`}
    >
      <div className="mt-4 flex flex-col gap-3">
        {EDUCATION.map((ed) => (
          <Item key={ed.school}>
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.18, ease: EASE }}
              className="border bg-card px-[17px] py-[15px]"
              style={{ borderColor: `var(--c-accent-${ed.accent || "blue"})` }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div className="text-[17px] font-semibold text-ink-bright">
                  {ed.degree}
                </div>
                <div className="font-mono text-[12px] text-ink-ghost">
                  {ed.span}
                </div>
              </div>
              <div className="mt-1 text-[14.5px] text-ink-muted">{ed.school}</div>
              <p className="mt-[7px] text-[14.5px] leading-[1.5] text-ink-dim">
                {ed.detail}
              </p>
              {ed.coursework && ed.coursework.length > 0 && (
                <div className="mt-[13px]">
                  <div className="mb-[8px] font-mono text-[11px] tracking-[1px] text-ink-ghost">
                    // relevant_coursework
                  </div>
                  <div className="flex flex-wrap gap-[6px]">
                    {ed.coursework.map((c) => (
                      <Tag key={c} small color={`var(--c-accent-${ed.accent || "blue"})`}>
                        {c}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </Item>
        ))}
      </div>
    </SectionShell>
  );
}

/* ── PROJECT (one per id) ──────────────────────────────────────────────── */
function ProjectSection({ id, accent }: { id: SectionId; accent: string }) {
  const p = PROJECTS.find((x) => x.id === id)!;
  const projCode: CodeLine[] = [
    [["select", "kw"], [" problem, approach, outcome"]],
    [["from", "kw"], [" "], ["{{ ref(", "jinja"], ["'experience'", "str"], [") }}", "jinja"], [" "], ["where", "kw"], [" project = "], ["'" + p.slug + "'", "str"]],
  ];
  return (
    <SectionShell
      accent="amber"
      path={`models / projects / ${p.file}`}
      layer="mart"
      code={projCode}
      compiled="COMPILED · case study"
    >
      <Item>
        <h2 className="mt-[10px] text-[24px] font-semibold text-ink-bright">
          {p.name}
        </h2>
      </Item>
      <div className="mt-[18px] flex flex-wrap gap-[14px]">
        {[
          { label: "problem", text: p.problem },
          { label: "approach", text: p.approach },
        ].map((b) => (
          <Item key={b.label} className="min-w-[200px] flex-1">
            <div className="h-full border border-line bg-card p-[14px]">
              <div className="font-mono text-[11px] text-accent-amber">
                {b.label}
              </div>
              <div className="mt-[6px] text-[14.5px] leading-[1.5] text-ink-dim">
                {b.text}
              </div>
            </div>
          </Item>
        ))}
      </div>
      <Item>
        <div className="mt-4 flex flex-wrap items-center gap-4 border border-line-mid bg-inset px-[18px] py-4">
          {p.metrics.map((m, i) => (
            <div key={m.label} className="flex items-center gap-4">
              {i > 0 && <span className="h-9 w-px bg-line-mid" />}
              <div>
                <div className="font-mono text-[11px] text-ink-ghost">
                  {m.label}
                </div>
                <div
                  className="text-[24px] font-semibold"
                  style={{ color: m.accent ? "var(--c-accent-amber)" : "var(--c-ink-bright)" }}
                >
                  {m.value}
                </div>
              </div>
            </div>
          ))}
          <div className="ml-auto flex flex-wrap gap-[6px]">
            {p.stack.map((s) => (
              <Tag key={s} small color={TOOL_COLORS[s]}>
                {s}
              </Tag>
            ))}
          </div>
        </div>
      </Item>
      {p.links && p.links.length > 0 && (
        <Item>
          <div className="mt-4 flex flex-wrap gap-[8px]">
            {p.links.map((l) => (
              <ExtLink key={l.href} link={l} />
            ))}
          </div>
        </Item>
      )}
      <Item>
        <div className="mt-3 font-mono text-[11px] text-ink-low">
          depends_on: stg.experience, stg.skills
        </div>
      </Item>
      <Item>
        <div className="mt-4">
          <ResumeButton accent={accent} label="↓ resume.pdf" />
        </div>
      </Item>
    </SectionShell>
  );
}

/* ── CONTACT ───────────────────────────────────────────────────────────── */
const contactCode: CodeLine[] = [
  [["exposures:", "kw"]],
  [["  - "], ["name:", "kw"], [" contact"]],
  [["    "], ["type:", "kw"], [" application"]],
  [["    "], ["maturity:", "kw"], [" "], ["high", "str"]],
];

function Contact({ accent }: { accent: string }) {
  const links = [
    { tag: "@", value: profile.email, href: `mailto:${profile.email}` },
    { tag: "gh", value: profile.github, href: `https://${profile.github}` },
    { tag: "in", value: profile.linkedin, href: `https://${profile.linkedin}` },
  ];
  return (
    <SectionShell
      accent="green"
      path="models / contact.md"
      layer="exposure"
      code={contactCode}
      compiled="COMPILED · exposure"
    >
      <Item>
        <div className="mt-4 flex flex-wrap items-center gap-[10px]">
          <StatusPill />
          <span className="text-[16px] text-ink-soft">
            Let&apos;s build something you can trust.
          </span>
        </div>
      </Item>
      <div className="mt-[18px] grid max-w-[640px] grid-cols-1 gap-[10px] sm:grid-cols-2">
        {links.map((l) => (
          <Item key={l.tag}>
            <motion.a
              href={l.href}
              whileHover={{ y: -2, borderColor: "var(--c-line-hover)" }}
              transition={{ duration: 0.18, ease: EASE }}
              className="flex items-center gap-[10px] border border-line bg-card px-[15px] py-[13px] no-underline"
            >
              <span className="font-mono text-[12px] text-accent-green">
                {l.tag}
              </span>
              <span className="font-mono text-[13px] text-ink-soft">
                {l.value}
              </span>
            </motion.a>
          </Item>
        ))}
      </div>
      <Item>
        <div className="mt-[18px]">
          <ResumeButton accent={accent} label="↓ download resume.pdf" />
        </div>
      </Item>
    </SectionShell>
  );
}

/* ── single-role modal view ────────────────────────────────────────────── */
function ExperienceModal({ index }: { index: number }) {
  const e = EXPERIENCE[index];
  const code: CodeLine[] = [
    [["select", "kw"], [" role, company, span, impact, stack"]],
    [["from", "kw"], [" "], ["{{ ref(", "jinja"], ["'career_history'", "str"], [") }}", "jinja"], [" "], ["where", "kw"], [" id = "], [String(index), "bool"]],
  ];
  return (
    <SectionShell
      accent="teal"
      path={`models / experience / exp_${index + 1}.sql`}
      layer="staging"
      code={code}
      compiled="COMPILED · 1 row"
    >
      <Item>
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-[24px] font-semibold text-ink-bright">
            {e.role} <span className="font-normal text-ink-low">· {e.company}</span>
          </h2>
          <span className="font-mono text-[12px] text-ink-ghost">{e.span}</span>
        </div>
      </Item>
      <Item>
        <p className="mt-3 max-w-[640px] text-[14.5px] leading-[1.6] text-ink-soft">
          {e.body}
        </p>
      </Item>

      {e.link && (
        <Item>
          <div className="mt-4">
            <ExtLink link={e.link} primary accent="var(--c-accent-teal)" />
          </div>
        </Item>
      )}

      <Item>
        <div className="mt-8 mb-4 flex items-center gap-4">
          <div className="uppercase tracking-widest text-[11px] font-mono text-ink-ghost">Details</div>
          <div className="h-px flex-1 bg-line-mid" />
        </div>
        <div className="flex flex-col gap-[10px] font-mono text-[13px]">
          <div className="flex items-start justify-between gap-4">
            <span className="text-ink-low">tenure</span>
            <span className="text-right text-ink-bright">{e.tenure}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <span className="text-ink-low">product</span>
            <span className="text-right text-ink-bright">{e.product}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <span className="text-ink-low">domain</span>
            <span className="text-right text-ink-bright">{e.domain}</span>
          </div>
        </div>
      </Item>

      <Item>
        <div className="mt-8 mb-4 flex items-center gap-4">
          <div className="uppercase tracking-widest text-[11px] font-mono text-ink-ghost">Columns</div>
          <div className="h-px flex-1 bg-line-mid" />
        </div>
        <div className="flex flex-col rounded-[6px] border border-line bg-card">
          {e.columns?.map((col, i) => (
            <div
              key={col.label}
              className={`flex items-center justify-between p-[12px] px-[16px] font-mono text-[12.5px] ${
                i > 0 ? "border-t border-line" : ""
              }`}
            >
              <span className="font-semibold text-ink-bright">{col.label}</span>
              <span className="text-right text-ink-ghost">{col.value}</span>
            </div>
          ))}
        </div>
      </Item>

      <Item>
        <div className="mt-6 flex flex-wrap gap-[6px]">
          {e.stack.map((s) => (
            <Tag key={s} small color={TOOL_COLORS[s]}>
              {s}
            </Tag>
          ))}
        </div>
      </Item>
    </SectionShell>
  );
}

/* ── single skill-domain modal view ────────────────────────────────────── */
function SkillModal({ index }: { index: number }) {
  const d = SKILLS[index];
  const slug = d.name.split(" ")[0];
  const code: CodeLine[] = [
    [["models:", "kw"]],
    [["  - "], ["name:", "kw"], [` ${slug}`]],
    [["    "], ["tools:", "kw"], [` [${d.tools.join(", ")}]`]],
  ];
  return (
    <SectionShell
      accent="teal"
      path={`models / skills / ${slug}.yml`}
      layer="staging"
      code={code}
      compiled={`COMPILED · ${d.tools.length} tools`}
    >
      <Item>
        <h2 className="mt-3 text-[24px] font-semibold text-ink-bright">
          {d.name}
        </h2>
      </Item>
      <Item>
        <div className="mt-4 flex flex-wrap gap-[10px]">
          {d.tools.map((t) => (
            <Tag key={t} small color={TOOL_COLORS[t]}>{t}</Tag>
          ))}
        </div>
      </Item>
    </SectionShell>
  );
}

/* ── CERTIFICATES ──────────────────────────────────────────────────────── */
const certCode: CodeLine[] = [
  [["select", "kw"], [" title, issuer, span, href"]],
  [["from", "kw"], [" "], ["{{ ref(", "jinja"], ["'history'", "str"], [") }}", "jinja"], [" "], ["where", "kw"], [" kind = "], ["'certificate'", "str"]],
];

function CertificatesSection() {
  return (
    <SectionShell
      accent="amber"
      path="models / certificates.sql"
      layer="source"
      code={certCode}
      compiled={`COMPILED · ${CERTIFICATES.length} rows`}
    >
      <div className="mt-4 flex flex-col gap-3">
        {CERTIFICATES.map((c) => (
          <Item key={c.title}>
            <motion.a
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2, borderColor: "var(--c-line-hover)" }}
              transition={{ duration: 0.18, ease: EASE }}
              className="block border border-line bg-card px-[17px] py-[15px] no-underline"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[17px] font-semibold text-ink-bright">
                    {c.title}
                  </span>
                  <span className="font-mono text-[10px] text-accent-amber opacity-60">↗</span>
                </div>
                <div className="font-mono text-[12px] text-ink-ghost">
                  {c.span}
                </div>
              </div>
              <div className="mt-1 font-mono text-[13px] text-accent-amber">
                {c.issuer}
              </div>
            </motion.a>
          </Item>
        ))}
      </div>
    </SectionShell>
  );
}

/* ── modal content dispatcher ──────────────────────────────────────────── */
export function ModalBody({ id, accent }: { id: ModalId; accent: string }) {
  if (id === "about") return <AboutMd />;
  if (id === "contact") return <Contact accent={accent} />;
  if (id === "education") return <EducationSection />;
  if (id === "skills") return <Skills />;
  if (id === "certificates") return <CertificatesSection />;
  const [kind, nStr] = id.split(":");
  const i = Number(nStr);
  if (kind === "proj") return <ProjectSection id={PROJECTS[i].id} accent={accent} />;
  if (kind === "exp") return <ExperienceModal index={i} />;
  if (kind === "skill") return <SkillModal index={i} />;
  return null;
}

/* ── dispatcher (mobile stacked sections) ──────────────────────────────── */
export function Section({
  id,
  accent,
}: {
  id: SectionId;
  accent: string;
}) {
  if (id === "identity") return <Identity accent={accent} />;
  if (id === "about") return <AboutMd />;
  if (id === "experience") return <Experience />;
  if (id === "skills") return <Skills />;
  if (id === "education") return <EducationSection />;
  if (id === "certificates") return <CertificatesSection />;
  if (id === "contact") return <Contact accent={accent} />;
  if (id.startsWith("p")) return <ProjectSection id={id} accent={accent} />;
  return null;
}
