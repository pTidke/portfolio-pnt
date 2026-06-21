"use client";

import { motion } from "framer-motion";
import { ROOT, MAINS } from "@/lib/graph";
import { accentColor } from "@/lib/data";
import type { SectionId } from "@/lib/types";
import { EASE } from "./motion";

/* Which stacked section each lineage branch scrolls to on mobile. */
const TARGET: Record<string, SectionId> = {
  about: "about",
  experience: "experience",
  projects: "p1",
  skills: "skills",
};

/* Mobile-native lineage: the desktop DAG canvas is desktop geometry, so on a
   phone the metaphor is rethought as a vertical branch — src.prajwal feeding
   the four areas — that doubles as the section nav. */
export default function MobileLineage({
  onJump,
}: {
  onJump: (id: SectionId) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="border-b border-line bg-window px-[14px] py-[18px]"
    >
      {/* root */}
      <div className="flex items-center gap-[10px]">
        <span
          className="dot inline-block h-[9px] w-[9px] flex-none"
          style={{ background: accentColor[ROOT.accent] }}
        />
        <div className="min-w-0">
          <div className="text-[17px] font-semibold leading-tight text-ink-bright">
            {ROOT.title}
          </div>
          <div className="truncate font-mono text-[11px] text-ink-faint">
            {ROOT.label} · {ROOT.sub}
          </div>
        </div>
      </div>

      <div className="mb-1 mt-[14px] font-mono text-[10px] tracking-[1.5px] text-ink-lower">
        LINEAGE
      </div>

      {/* branches */}
      <div className="ml-[4px] flex flex-col border-l border-line pl-[14px]">
        {MAINS.map((m) => (
          <button
            key={m.id}
            onClick={() => onJump(TARGET[m.id])}
            className="flex items-center gap-[10px] border-b border-line-soft py-[12px] text-left last:border-b-0"
          >
            <span
              className="dot inline-block h-[8px] w-[8px] flex-none"
              style={{ background: accentColor[m.accent] }}
            />
            <div className="min-w-0 flex-1">
              <div className="text-[14.5px] font-semibold text-ink">{m.title}</div>
              <div className="truncate font-mono text-[11px] text-ink-faint">
                {m.label} · {m.sub}
              </div>
            </div>
            <span className="font-mono text-[12px] text-ink-low">→</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
