"use client";

import { motion } from "framer-motion";
import { VIEW_LABEL } from "@/lib/graph";
import { RESUME_URL } from "@/lib/data";
import type { ViewId } from "@/lib/types";
import { EASE } from "./motion";

export type NavKey =
  | "about"
  | "education"
  | "experience"
  | "projects"
  | "skills"
  | "contact";

const LINKS: { key: NavKey; label: string }[] = [
  { key: "about", label: "about" },
  { key: "education", label: "education" },
  { key: "experience", label: "experience" },
  { key: "projects", label: "projects" },
  { key: "skills", label: "skills" },
];

export default function NavHeader({
  view,
  modalLabel,
  activeNav,
  accent,
  onHome,
  onNav,
}: {
  view: ViewId;
  modalLabel: string | null;
  activeNav: NavKey | null;
  accent: string;
  onHome: () => void;
  onNav: (key: NavKey) => void;
}) {
  const crumbs: { label: string; onClick?: () => void }[] = [
    { label: "src.prajwal", onClick: onHome },
  ];
  if (view === "overview") {
    crumbs.push({ label: "lineage" });
  } else {
    crumbs.push({ label: VIEW_LABEL[view], onClick: () => onNav(view as NavKey) });
  }
  if (modalLabel) crumbs.push({ label: modalLabel });

  return (
    <div className="flex flex-none flex-wrap items-center gap-x-4 gap-y-2 border-b border-line bg-panel px-4 py-[10px]">
      {/* breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-[12px]">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-ink-lower">/</span>}
              {c.onClick && !last ? (
                <button
                  onClick={c.onClick}
                  className="text-ink-muted transition-colors hover:text-ink"
                >
                  {c.label}
                </button>
              ) : (
                <span className={last ? "text-ink" : "text-ink-muted"}>
                  {c.label}
                </span>
              )}
            </span>
          );
        })}
      </div>

      {/* nav links + actions */}
      <div className="ml-auto flex items-center gap-1 font-mono text-[12px]">
        {LINKS.map((l) => {
          const on = activeNav === l.key;
          return (
            <button
              key={l.key}
              onClick={() => onNav(l.key)}
              className="relative px-[10px] py-[5px] transition-colors"
              style={{ color: on ? "var(--c-ink)" : "var(--c-ink-ghost)" }}
            >
              {l.label}
              {on && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-[8px] -bottom-[1px] h-[2px]"
                  style={{ background: accent }}
                  transition={{ duration: 0.25, ease: EASE }}
                />
              )}
            </button>
          );
        })}
        <span className="mx-1 h-4 w-px bg-line-mid" />
        <button
          onClick={() => onNav("contact")}
          className="px-[10px] py-[5px] transition-colors"
          style={{ color: activeNav === "contact" ? "var(--c-ink)" : "var(--c-ink-ghost)" }}
        >
          contact
        </button>
        <span className="mx-1 h-4 w-px bg-line-mid" />
        <motion.a
          href={RESUME_URL}
          download
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -1, filter: "brightness(1.08)" }}
          whileTap={{ scale: 0.97 }}
          className="ml-1 flex items-center font-bold"
          style={{ background: accent, color: "var(--c-on-accent)", padding: "5px 12px" }}
        >
          ↓ resume.pdf
        </motion.a>
      </div>
    </div>
  );
}
