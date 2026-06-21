"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { profile, accentColor, RESUME_URL } from "@/lib/data";
import type { AccentKey } from "@/lib/types";
import { EASE, Item, Stagger } from "./motion";

/* ── syntax tokens for code blocks ─────────────────────────────────────── */
type Tok = "kw" | "str" | "jinja" | "bool" | "fn" | "plain" | "comment";
const TOK_COLOR: Record<Tok, string> = {
  kw: "var(--c-accent-blue)",
  str: "var(--c-syntax-string)",
  jinja: "var(--c-accent-purple)",
  bool: "var(--c-accent-amber)",
  fn: "var(--c-accent-teal)",
  plain: "var(--c-ink-muted)",
  comment: "var(--c-ink-low)",
};
export type CodeSeg = [string, Tok?];
export type CodeLine = CodeSeg[];

export function CodeBlock({ lines }: { lines: CodeLine[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="overflow-x-auto border border-line-code bg-code px-[18px] py-4 font-mono text-[12.5px] leading-[1.75]"
    >
      {lines.map((line, i) => (
        <div key={i} className="whitespace-pre">
          {line.length === 0 ? (
            " "
          ) : (
            line.map((seg, j) => (
              <span key={j} style={{ color: TOK_COLOR[seg[1] ?? "plain"] }}>
                {seg[0]}
              </span>
            ))
          )}
        </div>
      ))}
    </motion.div>
  );
}

/* ── section shell — the "models / x.sql" frame around each panel ──────── */
export function SectionShell({
  accent,
  path,
  layer,
  code,
  compiled,
  children,
}: {
  accent: AccentKey;
  path: string;
  layer: string;
  code: CodeLine[];
  compiled: string;
  children: ReactNode;
}) {
  return (
    <Stagger inView className="border-b border-line-soft px-6 py-7 sm:px-7">
      <Item>
        <div className="mb-3 font-mono text-[11px] tracking-[1px] text-ink-low">
          <span style={{ color: accentColor[accent] }}>●</span> {path}{" "}
          <span className="text-ink-lower">· {layer}</span>
        </div>
      </Item>
      <Item>
        <CodeBlock lines={code} />
      </Item>
      <Item>
        <div className="mt-5 font-mono text-[10px] tracking-[1.5px] text-ink-lower">
          {compiled}
        </div>
      </Item>
      {children}
    </Stagger>
  );
}

/* ── status pill ───────────────────────────────────────────────────────── */
export function StatusPill({ accent }: { accent?: string }) {
  const open = profile.openToWork;
  // Theme var (not the bright JS accent) so the pill text clears AA on light.
  const col = `var(${open ? "--c-accent-green" : "--c-accent-amber"})`;
  void accent;
  return (
    <span
      className="inline-flex items-center gap-[7px] border px-3 py-[5px] font-mono text-[12px]"
      style={{
        borderColor: `color-mix(in srgb, ${col} 38%, transparent)`,
        background: `color-mix(in srgb, ${col} 12%, transparent)`,
        color: col,
      }}
    >
      <span
        className="dot inline-block h-[7px] w-[7px]"
        style={{
          background: col,
          animation: open ? "statuspulse 2s infinite" : "none",
        }}
      />
      {open ? profile.statusOpen : profile.statusClosed}
    </span>
  );
}

/* ── bordered mono tag/chip ────────────────────────────────────────────── */
export function Tag({
  children,
  small,
  color,
}: {
  children: ReactNode;
  small?: boolean;
  color?: string;
}) {
  return (
    <motion.span
      whileHover={{ y: -2, borderColor: "var(--c-line-hover)", color: "var(--c-ink-soft)" }}
      transition={{ duration: 0.18, ease: EASE }}
      className={
        small
          ? "inline-flex items-center gap-[6px] border border-line-mid px-[9px] py-[3px] font-mono text-[11px] text-ink-faint"
          : "inline-flex items-center gap-[6px] border border-line-mid bg-chrome px-[11px] py-[5px] font-mono text-[12px] text-ink-muted"
      }
    >
      {color && <span style={{ color, fontSize: '9px' }}>●</span>}
      <span>{children}</span>
    </motion.span>
  );
}

/* ── resume button ─────────────────────────────────────────────────────── */
export function ResumeButton({
  accent,
  label = "↓ resume.pdf",
}: {
  accent: string;
  label?: string;
}) {
  return (
    <motion.a
      href={RESUME_URL}
      download
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -2, filter: "brightness(1.08)" }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.18, ease: EASE }}
      className="inline-flex cursor-pointer items-center font-mono text-[12.5px] font-bold"
      style={{ background: accent, color: "var(--c-on-accent)", padding: "8px 16px" }}
    >
      {label}
    </motion.a>
  );
}
