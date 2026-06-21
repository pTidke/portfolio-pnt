"use client";

import { motion } from "framer-motion";
import { readme, TOOL_COLORS } from "@/lib/data";
import { EASE, Item, Stagger } from "./motion";
import { Tag } from "./ui";

/* "// SECTION" header with a rule that runs to the edge. */
function Heading({ label }: { label: string }) {
  return (
    <Item>
      <div className="mb-4 mt-7 flex items-center gap-4">
        <span className="font-mono text-[11px] tracking-[1.5px] text-ink-faint">
          // {label}
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>
    </Item>
  );
}

export default function AboutMd() {
  return (
    <Stagger inView className="px-6 py-7 sm:px-8">
      {/* name + tagline */}
      <Item>
        <h1 className="text-[34px] font-semibold leading-[1.1] tracking-[-0.5px] text-ink-bright">
          {readme.name}
        </h1>
      </Item>
      <Item>
        <p className="mt-3 max-w-[640px] text-[16px] leading-[1.55] text-ink-muted">
          {readme.tagline}
        </p>
      </Item>

      {/* summary */}
      <Heading label="SUMMARY" />
      {readme.summary.map((para, i) => (
        <Item key={i}>
          <p className="mt-3 max-w-[660px] text-[14.5px] leading-[1.65] text-ink-soft first:mt-0">
            {para}
          </p>
        </Item>
      ))}

      {/* at a glance */}
      <Heading label="AT A GLANCE" />
      <div className="flex flex-col">
        {readme.glance.map(([k, v]) => (
          <Item key={k}>
            <div className="flex items-baseline gap-4 py-[5px] font-mono text-[13px]">
              <span className="w-[78px] flex-none text-ink-ghost">{k}</span>
              <span className="text-ink-soft">{v}</span>
            </div>
          </Item>
        ))}
      </div>

      {/* core stack */}
      <Heading label="CORE STACK" />
      <Item>
        <div className="flex flex-wrap gap-[10px]">
          {readme.stack.map((s) => (
            <Tag key={s} small color={TOOL_COLORS[s]}>
              {s}
            </Tag>
          ))}
        </div>
      </Item>



      {/* links */}
      <Heading label="LINKS" />
      <Item>
        <div className="flex flex-wrap gap-[10px]">
          {readme.links.map((l) => (
            <motion.a
              key={l.label}
              href={l.href}
              whileHover={{ y: -2, borderColor: "var(--c-line-hover)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18, ease: EASE }}
              className="flex items-center gap-[9px] border border-line-mid bg-card px-[15px] py-[11px] font-mono text-[13px] no-underline"
            >
              <span className="text-ink-muted">{l.icon}</span>
              <span className="text-ink-soft">{l.label}</span>
            </motion.a>
          ))}
        </div>
      </Item>
    </Stagger>
  );
}
