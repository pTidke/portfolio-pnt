"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FILE, TREE, DOT_COLOR, accentColor, BUILD, RESUME_URL, WINDOW_LIGHTS } from "@/lib/data";
import type { SectionId, ModalId, TreeNode } from "@/lib/types";
import { EASE } from "./motion";
import ThemeToggle from "./theme-toggle";

/* ── window title bar (desktop) ────────────────────────────────────────── */
export function WindowChrome({
  onOpenPalette,
}: {
  onOpenPalette: () => void;
}) {
  return (
    <div className="flex flex-none items-center gap-3 border-b border-line bg-chrome px-4 py-[11px]">
      <div className="flex gap-2">
        {WINDOW_LIGHTS.map((c) => (
          <span
            key={c}
            className="dot inline-block h-3 w-3"
            style={{ background: c }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 border border-line bg-code px-[14px] py-[5px] font-mono text-[12px] text-ink-ghost">
        <span className="text-ink-lower">~/</span>portfolio
        <span className="text-ink-lower">—</span>
        <span className="text-ink-muted">main</span>
      </div>
      <div className="ml-auto flex items-center gap-2 font-mono text-[11px]">
        <button
          onClick={onOpenPalette}
          className="flex items-center gap-[6px] border border-line-mid px-[11px] py-[5px] text-ink-muted transition-colors hover:text-ink"
        >
          <span className="text-accent-blue">▸</span> jump to file
        </button>
        <ThemeToggle />
      </div>
    </div>
  );
}

/* ── editor tab bar ────────────────────────────────────────────────────── */
export function TabBar({
  openTabs,
  active,
  accent,
  onSelect,
  onClose,
}: {
  openTabs: SectionId[];
  active: SectionId;
  accent: string;
  onSelect: (id: SectionId) => void;
  onClose: (id: SectionId, e: React.MouseEvent) => void;
}) {
  const tabs: { id: SectionId; closeable: boolean }[] = [
    { id: "graph", closeable: false },
    ...openTabs.map((id) => ({ id, closeable: true })),
  ];
  return (
    <div className="flex flex-none items-stretch overflow-x-auto border-b border-line bg-panel">
      {tabs.map((t) => {
        const on = active === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className="flex items-center gap-[7px] border-r border-line px-[14px] py-[9px]"
            style={{
              borderTop: `2px solid ${on ? accent : "transparent"}`,
              background: on ? "var(--c-window)" : "transparent",
              color: on ? "var(--c-ink)" : "var(--c-ink-ghost)",
            }}
          >
            <span
              className="dot inline-block h-[7px] w-[7px]"
              style={{ background: accentColor[DOT_COLOR[t.id]] }}
            />
            <span className="whitespace-nowrap font-mono text-[12px]">
              {t.id === "graph" ? "Graph" : FILE[t.id]}
            </span>
            {t.closeable && (
              <span
                onClick={(e) => onClose(t.id, e)}
                className="ml-[2px] cursor-pointer px-[2px] text-[14px] leading-none text-ink-low hover:text-ink-muted"
              >
                ×
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ── file explorer (desktop) — collapsible folders ─────────────────────── */
export function FileTree({
  activeSection,
  activeModal,
  accent,
  onOpenSection,
  onOpenModal,
}: {
  activeSection?: SectionId;
  activeModal?: ModalId | null;
  accent: string;
  onOpenSection: (id: SectionId) => void;
  onOpenModal: (id: ModalId) => void;
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggle = (k: string) =>
    setCollapsed((c) => ({ ...c, [k]: !c[k] }));

  /* draggable width — long role / skill names are never cropped, the user
     just widens the explorer. Clamped so it can't swallow the canvas. */
  const [width, setWidth] = useState(226);
  const drag = useRef<{ active: boolean; x: number; w: number }>({
    active: false,
    x: 0,
    w: 0,
  });

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!drag.current.active) return;
      const w = drag.current.w + (e.clientX - drag.current.x);
      setWidth(Math.min(460, Math.max(200, w)));
    };
    const up = () => {
      if (!drag.current.active) return;
      drag.current.active = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  const startDrag = (e: React.PointerEvent) => {
    drag.current = { active: true, x: e.clientX, w: width };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const renderNode = (node: TreeNode, depth: number) => {
    const pad = 16 + depth * 16;

    /* folder */
    if (node.children) {
      const open = !collapsed[node.key];
      return (
        <div key={node.key}>
          <button
            onClick={() => toggle(node.key)}
            className="flex w-full min-w-0 items-center gap-[6px] font-mono text-[13px] text-ink-ghost transition-colors hover:text-ink-muted"
            style={{ padding: `6px 16px 6px ${pad}px` }}
          >
            <span className="inline-block w-[10px] flex-none text-[9px] text-ink-low">
              {open ? "▾" : "▸"}
            </span>
            <span className="truncate">{node.label}</span>
          </button>
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="overflow-hidden"
              >
                {node.children.map((c) => renderNode(c, depth + 1))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    /* leaf */
    const active =
      (!!node.id && activeSection === node.id) ||
      (!!node.modal && activeModal === node.modal);
    const onClick = node.resume
      ? () => window.open(RESUME_URL, "_blank", "noopener,noreferrer")
      : node.id
        ? () => onOpenSection(node.id!)
        : node.modal
          ? () => onOpenModal(node.modal!)
          : undefined;

    return (
      <div
        key={node.key}
        onClick={onClick}
        title={node.label}
        className="flex min-w-0 items-center gap-2 font-mono text-[13px]"
        style={{
          padding: `6px 16px 6px ${pad}px`,
          marginTop: node.resume ? 8 : 0,
          cursor: onClick ? "pointer" : "default",
          color: node.resume
            ? "var(--c-ink-low)"
            : active
              ? "var(--c-ink)"
              : "var(--c-ink-dim)",
          background: active ? "var(--c-active)" : "transparent",
          borderLeft: `2px solid ${active ? accent : "transparent"}`,
          transition: "background .15s, color .15s",
        }}
      >
        {node.resume ? (
          <span className="flex-none text-[12px] leading-none">📄</span>
        ) : node.dot ? (
          <span
            className="dot inline-block h-[7px] w-[7px] flex-none"
            style={{ background: accentColor[node.dot] }}
          />
        ) : null}
        <span className="truncate">{node.label}</span>
      </div>
    );
  };

  return (
    <div className="relative flex-none" style={{ width }}>
      <div className="h-full overflow-y-auto border-r border-line bg-panel py-[14px]">
        <div className="px-4 pb-[10px] font-mono text-[10px] tracking-[1.5px] text-ink-lower">
          EXPLORER · portfolio
        </div>
        {TREE.map((n) => renderNode(n, 0))}
      </div>
      {/* drag handle — sits on the right border, widens the explorer */}
      <div
        onPointerDown={startDrag}
        className="group absolute right-0 top-0 z-10 h-full w-[7px] translate-x-1/2 cursor-col-resize"
      >
        <div className="mx-auto h-full w-px bg-transparent transition-colors group-hover:bg-accent-blue" />
      </div>
    </div>
  );
}

/* ── console dock (desktop) ────────────────────────────────────────────── */
export function ConsoleDock({
  onAsk,
  onJump,
}: {
  onAsk: () => void;
  onJump: () => void;
}) {
  return (
    <div className="flex-none border-t border-line bg-code px-4 py-[9px]">
      <div className="flex items-center gap-3 font-mono text-[11px]">
        <span className="flex items-center gap-[6px] text-accent-teal font-medium">
          <span className="dot inline-block h-[5px] w-[5px] bg-accent-teal" style={{ animation: "statuspulse 2s infinite" }} />
          Bay Area - Open to Work
        </span>
        <span className="hidden text-ink-lower sm:inline">|</span>
        <span className="hidden text-ink-ghost sm:inline">
          <span className="text-accent-green">PASS={BUILD.pass}</span>{" "}
          <span className="text-ink-low">
            WARN={BUILD.warn} ERROR={BUILD.error}
          </span>{" "}
          · last run just now
        </span>
        {/* secondary: plain file jump */}
        <button
          onClick={onJump}
          className="ml-auto border border-line-mid px-[10px] py-[3px] text-ink-muted transition-colors hover:text-ink"
        >
          jump to file
        </button>
      </div>

      {/* HERO — the AI assistant, made impossible to miss */}
      <button
        onClick={onAsk}
        className="group relative mt-2 flex w-full items-center gap-[11px] overflow-hidden border px-3 py-[11px] text-left transition-[box-shadow,border-color]"
        style={{
          borderColor: "var(--c-accent-teal)",
          background:
            "linear-gradient(90deg, color-mix(in srgb, var(--c-accent-teal) 14%, var(--c-card)) 0%, var(--c-card) 70%)",
          boxShadow: "0 0 24px -12px var(--c-accent-teal)",
        }}
      >
        {/* shimmer sweep on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 opacity-0 transition-all duration-700 ease-out group-hover:left-[110%] group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(90deg, transparent, color-mix(in srgb, var(--c-accent-teal) 22%, transparent), transparent)",
          }}
        />
        <span
          className="font-mono text-[15px] text-accent-teal"
          style={{ animation: "statuspulse 2s infinite" }}
          aria-hidden
        >
          ✦
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="font-mono text-[12.5px] font-semibold text-ink">
            Ask my AI anything about my work
          </span>
          <span className="truncate font-mono text-[11px] text-ink-low">
            projects · stack · experience — answered in seconds
          </span>
        </span>
        <span className="ml-auto flex flex-none items-center gap-[2px] border border-line-mid bg-panel px-[7px] py-[3px] font-mono text-[10.5px] text-ink-muted transition-colors group-hover:border-accent-teal group-hover:text-accent-teal">
          ⌘K
        </span>
      </button>
    </div>
  );
}

/* ── mobile bars ───────────────────────────────────────────────────────── */
export function MobileTopBar({ onOpenPalette }: { onOpenPalette: () => void }) {
  return (
    <div className="flex flex-none items-center gap-[10px] border-b border-line bg-chrome px-[14px] py-3">
      <span className="dot inline-block h-[10px] w-[10px] bg-accent-green" />
      <span className="font-mono text-[12px] text-ink-muted">~/portfolio</span>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle compact />
        <button
          onClick={onOpenPalette}
          className="border border-line-mid px-[11px] py-[5px] font-mono text-[12px] text-ink-muted"
        >
          ⌘K
        </button>
      </div>
    </div>
  );
}

export function MobileAskBar({ onOpenPalette }: { onOpenPalette: () => void }) {
  return (
    <div className="flex flex-col flex-none border-t border-line">
      <div className="flex items-center justify-center gap-[6px] bg-chrome px-3 py-2 font-mono text-[10px] text-accent-teal">
        <span className="dot inline-block h-[4px] w-[4px] bg-accent-teal" style={{ animation: "statuspulse 2s infinite" }} />
        Bay Area - Open to Work
      </div>
      <button
        onClick={onOpenPalette}
        className="flex items-center gap-[9px] border-t border-line bg-code px-[14px] py-[11px] text-left"
      >
        <span className="font-mono text-accent-blue">▸</span>
        <span className="font-mono text-[12.5px] text-ink-low">
          ask the assistant…
        </span>
        <span className="ml-auto font-mono text-[11px] text-accent-green">
          PASS={BUILD.pass}
        </span>
      </button>
    </div>
  );
}
