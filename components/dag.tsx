"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { accentColor } from "@/lib/data";
import { ROOT, MAINS, SUB } from "@/lib/graph";
import type { GNode, ModalId, ViewId } from "@/lib/types";
import { EASE, springSoft } from "./motion";

const CANVAS_W = 960;
const OV_H = 520;

/* overview geometry */
const ME = { x: 20, y: 218, w: 200, h: 84 };
const MAIN_X = 556;
const MAIN_W = 300;
const MAIN_H = 92;
const MAIN_TOP = [61, 214, 367]; // about, experience, projects

/* sub-view geometry */
const PARENT = { x: 20, w: 230, h: 92 };
const CHILD_X = 600;
const CHILD_W = 340;
const CHILD_H = 62;
const CHILD_GAP = 16;

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}
interface Geom {
  H: number;
  boxes: Record<string, Box>; // me + 3 mains, always present
  active: Set<string>; // which persistent boxes are visible/clickable
  children: { node: GNode; box: Box }[];
  edges: { d: string; key: string }[];
}

function elbow(x1: number, y1: number, x2: number, y2: number) {
  const midX = x1 + (x2 - x1) / 2;
  return `M ${x1} ${y1} H ${midX} V ${y2} H ${x2}`;
}

function geomFor(view: ViewId): Geom {
  const overviewBoxes: Record<string, Box> = {
    me: ME,
    about: { x: MAIN_X, y: MAIN_TOP[0], w: MAIN_W, h: MAIN_H },
    experience: { x: MAIN_X, y: MAIN_TOP[1], w: MAIN_W, h: MAIN_H },
    projects: { x: MAIN_X, y: MAIN_TOP[2], w: MAIN_W, h: MAIN_H },
  };

  if (view === "overview") {
    const meCy = ME.y + ME.h / 2;
    const edges = MAINS.map((m) => {
      const b = overviewBoxes[m.id];
      return {
        key: "ov-" + m.id,
        d: elbow(ME.x + ME.w, meCy, MAIN_X, b.y + b.h / 2),
      };
    });
    return {
      H: OV_H,
      boxes: overviewBoxes,
      active: new Set(["me", "about", "experience", "projects"]),
      children: [],
      edges,
    };
  }

  const sub = SUB[view];
  const kids = sub.children;
  const n = kids.length;
  const colH = n * CHILD_H + (n - 1) * CHILD_GAP;
  const H = Math.max(OV_H, colH + 56);
  const parentY = (H - PARENT.h) / 2;
  const colTop = (H - colH) / 2;

  // parent main slides to the left-root slot; everyone else parks faded.
  const boxes: Record<string, Box> = { ...overviewBoxes };
  boxes[sub.parentId] = { x: PARENT.x, y: parentY, w: PARENT.w, h: PARENT.h };

  const parentRight = PARENT.x + PARENT.w;
  const parentCy = parentY + PARENT.h / 2;

  const children = kids.map((node, i) => {
    const y = colTop + i * (CHILD_H + CHILD_GAP);
    return { node, box: { x: CHILD_X, y, w: CHILD_W, h: CHILD_H } };
  });
  const edges = children.map((c) => ({
    key: view + "-" + c.node.id,
    d: elbow(parentRight, parentCy, CHILD_X, c.box.y + c.box.h / 2),
  }));

  return { H, boxes, active: new Set([sub.parentId]), children, edges };
}

function NodeInner({ n, big }: { n: GNode; big?: boolean }) {
  return (
    <>
      <div className="flex items-center gap-[7px]">
        <span
          className="dot inline-block h-[9px] w-[9px] flex-none"
          style={{ background: accentColor[n.accent] }}
        />
        <span className="font-mono text-[9px] tracking-[1px] text-ink-muted">
          {n.kind}
        </span>
        {n.expandTo && (
          <span className="ml-auto font-mono text-[9px] text-ink-muted">
            expand →
          </span>
        )}
        {n.modal && (
          <span className="ml-auto font-mono text-[9px] text-ink-muted">
            open →
          </span>
        )}
      </div>
      {/* human heading leads (sans) — the recruiter skim reads this first */}
      <div
        className={
          "mt-1 truncate font-semibold text-ink-bright " +
          (big ? "text-[15px]" : "text-[13px]")
        }
      >
        {n.title}
      </div>
      {/* dbt model path + detail, quiet mono secondary — keeps the engineering voice */}
      <div
        className={
          "truncate font-mono text-ink-faint " + (big ? "text-[12px]" : "text-[11px]")
        }
      >
        {n.label}
        {n.sub ? ` · ${n.sub}` : ""}
      </div>
    </>
  );
}

export default function Dag({
  view,
  onExpand,
  onModal,
  onHome,
}: {
  view: ViewId;
  onExpand: (v: Exclude<ViewId, "overview">) => void;
  onModal: (m: ModalId) => void;
  onHome: () => void;
}) {
  const g = useMemo(() => geomFor(view), [view]);
  const [hover, setHover] = useState<string | null>(null);
  const prefersReduced = useReducedMotion();

  function clickPersistent(id: string) {
    if (view !== "overview" && id === SUB[view].parentId) {
      onHome();
      return;
    }
    const node = MAINS.find((m) => m.id === id);
    if (!node) return;
    if (node.expandTo) onExpand(node.expandTo as Exclude<ViewId, "overview">);
    else if (node.modal) onModal(node.modal);
  }

  const persistent: GNode[] = [ROOT, ...MAINS];

  return (
    <div className="px-[22px] pb-8 pt-[18px]">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mb-3 flex flex-wrap items-baseline gap-3"
      >
        <span className="font-mono text-[11px] tracking-[1.5px] text-accent-blue">
          LINEAGE
        </span>
        <span className="text-[13px] text-ink-low">
          {view === "overview"
            ? "About, experience, projects & skills branch from Prajwal — click any node to open it."
            : "Click a node to open it, or click the parent to go back."}
        </span>
      </motion.div>

      <div className="overflow-x-auto">
        <motion.div
          className="relative mx-auto"
          animate={{ height: g.H }}
          transition={springSoft}
          style={{ width: CANVAS_W, maxWidth: "100%" }}
        >
          {/* edges */}
          <svg
            className="pointer-events-none absolute inset-0 overflow-visible"
            width={CANVAS_W}
            height={g.H}
          >
            <defs>
              <filter
                id="edge-glow"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feGaussianBlur stdDeviation="2.6" />
              </filter>
            </defs>
            <AnimatePresence mode="popLayout">
              {g.edges.map((e, i) => (
                <motion.g
                  key={e.key}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE, delay: i * 0.04 }}
                >
                  {/* structural lineage line — always visible, draws in */}
                  <motion.path
                    d={e.d}
                    fill="none"
                    stroke={accentColor.blue}
                    strokeOpacity={0.28}
                    strokeWidth={1.4}
                    strokeDasharray="5 5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, ease: EASE, delay: i * 0.04 }}
                  />
                  {/* flowing pulse: a glow halo + crisp core travel source→target,
                      linearly and continuously — data moving through the lineage.
                      pathLength=1 normalizes speed across edges of any length. */}
                  {!prefersReduced && (
                    <>
                      <motion.path
                        d={e.d}
                        fill="none"
                        stroke={accentColor.blue}
                        strokeWidth={4}
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDasharray="0.16 0.84"
                        filter="url(#edge-glow)"
                        initial={{ strokeDashoffset: 1 }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{
                          duration: 2.2,
                          ease: "linear",
                          repeat: Infinity,
                          delay: 0.5 + i * 0.16,
                        }}
                      />
                      <motion.path
                        d={e.d}
                        fill="none"
                        stroke={accentColor.blue}
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDasharray="0.1 0.9"
                        initial={{ strokeDashoffset: 1 }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{
                          duration: 2.2,
                          ease: "linear",
                          repeat: Infinity,
                          delay: 0.5 + i * 0.16,
                        }}
                      />
                    </>
                  )}
                </motion.g>
              ))}
            </AnimatePresence>
          </svg>

          {/* persistent nodes: root + 4 mains (morph between views) */}
          {persistent.map((n) => {
            const box = g.boxes[n.id];
            if (!box) return null;
            const isActive = g.active.has(n.id);
            const isParentInSub =
              view !== "overview" && n.id === SUB[view].parentId;
            const on = hover === n.id && isActive;
            const big = view === "overview" && n.id !== "me";
            const col = accentColor[n.accent];
            return (
              <motion.button
                key={n.id}
                disabled={!isActive && n.id !== "me"}
                onClick={() => isActive && n.id !== "me" && clickPersistent(n.id)}
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover(null)}
                className="absolute left-0 top-0 flex flex-col items-stretch justify-center border px-[14px] text-left"
                animate={{
                  x: box.x,
                  y: box.y,
                  width: box.w,
                  height: box.h,
                  opacity: isActive ? 1 : 0,
                  scale: isActive ? 1 : 0.92,
                }}
                transition={springSoft}
                whileHover={isActive && n.id !== "me" ? { scale: 1.025 } : {}}
                whileTap={isActive && n.id !== "me" ? { scale: 0.985 } : {}}
                style={{
                  pointerEvents: isActive && n.id !== "me" ? "auto" : "none",
                  borderColor: on ? col : "var(--c-line-mid)",
                  background: on ? "var(--c-node-hover)" : "var(--c-chrome)",
                  boxShadow: on
                    ? `0 0 0 3px ${col}30, var(--shadow-node-hover)`
                    : "var(--shadow-node)",
                  cursor: isParentInSub ? "zoom-out" : "pointer",
                  zIndex: on ? 6 : 3,
                }}
              >
                <NodeInner n={n} big={big} />
              </motion.button>
            );
          })}

          {/* children of the current sub-view */}
          <AnimatePresence mode="popLayout">
            {g.children.map((c, i) => {
              const on = hover === c.node.id;
              const col = accentColor[c.node.accent];
              return (
                <motion.button
                  key={view + "-" + c.node.id}
                  onClick={() => c.node.modal && onModal(c.node.modal)}
                  onMouseEnter={() => setHover(c.node.id)}
                  onMouseLeave={() => setHover(null)}
                  className="absolute left-0 top-0 flex flex-col items-stretch justify-center border px-[14px] text-left"
                  initial={{ opacity: 0, x: c.box.x - 24, y: c.box.y, scale: 0.9 }}
                  animate={{ opacity: 1, x: c.box.x, y: c.box.y, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ ...springSoft, delay: 0.05 + i * 0.04 }}
                  whileHover={{ scale: 1.025 }}
                  whileTap={{ scale: 0.985 }}
                  style={{
                    width: c.box.w,
                    height: c.box.h,
                    borderColor: on ? col : "var(--c-line-mid)",
                    background: on ? "var(--c-node-hover)" : "var(--c-chrome)",
                    boxShadow: on
                      ? `0 0 0 3px ${col}30, var(--shadow-node-hover)`
                      : "var(--shadow-node)",
                    zIndex: on ? 6 : 4,
                  }}
                >
                  <NodeInner n={c.node} />
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
