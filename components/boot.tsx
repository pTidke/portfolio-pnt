"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { profile, BUILD, NODES } from "@/lib/data";

/* Render-style boot log: timestamped lines print in sequence, then the overlay
   lifts to reveal the IDE. Kept short (~1.8s) and skippable (click / any key). */
const LOG: { text: string; accent?: boolean }[] = [
  { text: "incoming request — resolving prajwal.tidke" },
  { text: "waking warehouse · cold start" },
  { text: "dbt run --select portfolio" },
  { text: `compiling ${NODES.length} models` },
  { text: "materializing lineage graph" },
  { text: "injecting environment · theme · fonts" },
  { text: `build → PASS=${BUILD.pass} WARN=${BUILD.warn} ERROR=${BUILD.error}` },
  { text: "steady hands. clean pipelines. portfolio is live", accent: true },
];

export default function BootSequence({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  const [base, setBase] = useState<Date | null>(null);

  useEffect(() => {
    setBase(new Date());

    if (reduce) {
      setN(LOG.length);
      const t = setTimeout(onDone, 350);
      return () => clearTimeout(t);
    }

    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setN(i);
      if (i >= LOG.length) {
        clearInterval(id);
        setTimeout(onDone, 620);
      }
    }, 165);

    const skip = () => {
      clearInterval(id);
      onDone();
    };
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      clearInterval(id);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // client-only timestamps → no SSR/CSR mismatch (server renders 0 lines)
  const ts = (i: number) => {
    if (!base) return "--:--:--";
    const d = new Date(base.getTime() + i * 2400 + i * i * 300);
    return d.toTimeString().slice(0, 8);
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="dot-grid fixed inset-0 z-[2000] flex flex-col items-center justify-center px-6"
      style={{ background: "var(--c-base)" }}
    >
      <div className="w-full max-w-[680px] font-mono">
        {/* banner */}
        <div
          className="mb-7 border bg-code px-6 py-5"
          style={{ borderColor: "var(--c-line-mid)", boxShadow: "var(--shadow-node)" }}
        >
          <div className="mb-2 flex items-center gap-[7px] text-[10px] tracking-[2px] text-ink-lower">
            <span className="dot inline-block h-[7px] w-[7px] bg-accent-green" />
            BOOT · src.prajwal
          </div>
          <div className="text-[24px] font-bold uppercase tracking-[6px] text-ink-bright">
            {profile.name}
          </div>
          <div className="mt-1 text-[12px] tracking-[1px] text-ink-faint">
            {profile.title.toLowerCase()} · portfolio
          </div>
        </div>

        {/* log lines */}
        <div className="flex flex-col gap-[10px]">
          {LOG.slice(0, n).map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="flex items-baseline gap-3 text-[13px] uppercase tracking-[1px]"
            >
              <span className="flex-none tabular-nums text-ink-lower">{ts(i)}</span>
              <span className={l.accent ? "text-accent-green" : "text-ink-dim"}>
                {l.text}
                {i === n - 1 && (
                  <span className="ml-[6px] inline-block h-[13px] w-[7px] translate-y-[1px] animate-blink bg-accent-teal align-middle" />
                )}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-7 text-[10px] tracking-[1.5px] text-ink-lower">
          press any key to skip
        </div>
      </div>
    </motion.div>
  );
}
