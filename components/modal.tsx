"use client";

import { AnimatePresence, motion } from "framer-motion";
import { modalLabel } from "@/lib/graph";
import { WINDOW_LIGHTS } from "@/lib/data";
import type { ModalId } from "@/lib/types";
import { springSoft } from "./motion";
import { ModalBody } from "./sections";

export default function Modal({
  id,
  accent,
  onClose,
}: {
  id: ModalId | null;
  accent: string;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {id && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="fixed inset-0 z-[900] flex justify-center px-4 pb-6 pt-[7vh] sm:px-6"
          style={{
            background: "var(--c-scrim)",
            backdropFilter: "blur(4px)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={springSoft}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[86vh] w-[760px] max-w-[96vw] flex-col overflow-hidden border border-line-mid bg-window"
            style={{ boxShadow: "var(--shadow-pop)" }}
          >
            {/* modal title bar */}
            <div className="flex flex-none items-center gap-3 border-b border-line bg-chrome px-4 py-[10px]">
              <div className="flex gap-2">
                {WINDOW_LIGHTS.map((c) => (
                  <span key={c} className="dot inline-block h-3 w-3" style={{ background: c }} />
                ))}
              </div>
              <span className="font-mono text-[12px] text-ink-muted">
                {modalLabel(id)}
              </span>
              <button
                onClick={onClose}
                aria-label="close"
                className="ml-auto flex h-6 w-6 items-center justify-center border border-line-mid text-ink-low transition-colors hover:border-line-mid hover:text-ink"
              >
                ×
              </button>
            </div>

            {/* body */}
            <div className="overflow-y-auto">
              <ModalBody id={id} accent={accent} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
