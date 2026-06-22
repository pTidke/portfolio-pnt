"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { JUMP_GROUPS, accentColor, ASK_SUGGESTIONS } from "@/lib/data";
import type { JumpItem } from "@/lib/types";
import { EASE } from "./motion";
import { Markdown } from "./markdown";

type Mode = "jump" | "ask";
interface Msg {
  role: "user" | "assistant";
  text: string;
}

/* Slide-up bottom drawer — the console expands upward from the dock, never a
   floating box on top. Jump list reads like a grouped menu of real names. */
export default function CommandPalette({
  open,
  accent,
  onClose,
  onJump,
  initialMode = "jump",
}: {
  open: boolean;
  accent: string;
  onClose: () => void;
  onJump: (item: JumpItem) => void;
  initialMode?: Mode;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);
  const [askInput, setAskInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [sending, setSending] = useState(false);
  const conversationId = useRef<string | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const askRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const keyNav = useRef(false);

  useEffect(() => {
    if (open) {
      setMode(initialMode); // open in the mode the trigger asked for (⌘K → ask)
      setTimeout(
        () => (initialMode === "ask" ? askRef : inputRef).current?.focus(),
        40,
      );
    } else {
      setQuery("");
      setSel(0);
    }
  }, [open, initialMode]);

  const groups = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return JUMP_GROUPS;
    return JUMP_GROUPS.map((g) => ({
      ...g,
      items: g.items.filter((it) =>
        (it.title + " " + it.hint + " " + it.file).toLowerCase().includes(q),
      ),
    })).filter((g) => g.items.length > 0);
  }, [query]);

  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const selKey = flat[sel]?.key;

  // Scroll the selected row into view only on keyboard nav (not on hover).
  useEffect(() => {
    if (!keyNav.current) return;
    keyNav.current = false;
    if (selKey) rowRefs.current[selKey]?.scrollIntoView({ block: "nearest" });
  }, [sel, selKey]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, sending]);

  function onSearchKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      keyNav.current = true;
      setSel((s) => Math.min(s + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      keyNav.current = true;
      setSel((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter") {
      const it = flat[sel] ?? flat[0];
      if (it) onJump(it);
    }
  }

  /* ── Ask AI — live via /api/ask (Azure AI Foundry Agent). ─────────────── */
  async function sendAsk() {
    const q = askInput.trim();
    if (!q || sending) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setAskInput("");
    setSending(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, conversationId: conversationId.current }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "request failed");
      conversationId.current = data.conversationId; // keep the conversation for follow-ups
      setMessages((m) => [...m, { role: "assistant", text: data.answer }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "Sorry — I couldn't reach the assistant just now. Try again in a moment, or reach me from the contact page.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  const tabStyle = (activeMode: Mode) =>
    mode === activeMode
      ? { background: accent, color: "var(--c-on-accent)" }
      : { background: "var(--c-active)", color: "var(--c-ink-muted)" };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="fixed inset-0 z-[999] flex items-end justify-center"
          style={{ background: "var(--c-scrim)" }}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.34, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="flex h-[50vh] max-h-[460px] w-full max-w-[1480px] flex-col overflow-hidden border-x border-t border-line-mid bg-panel"
            style={{ boxShadow: "var(--shadow-pop)" }}
          >
            {/* header — console identity + mode tabs */}
            <div className="flex flex-none items-center gap-3 border-b border-line bg-chrome px-4 py-[9px]">
              <span className="flex items-center gap-[7px] font-mono text-[10px] tracking-[1.5px] text-ink-lower">
                <span className="dot inline-block h-[7px] w-[7px] bg-accent-blue" />
                CONSOLE
              </span>
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => setMode("jump")}
                  className="cursor-pointer px-[11px] py-1 font-mono text-[12px]"
                  style={tabStyle("jump")}
                >
                  jump
                </button>
                <button
                  onClick={() => setMode("ask")}
                  className="cursor-pointer px-[11px] py-1 font-mono text-[12px]"
                  style={tabStyle("ask")}
                >
                  ask AI
                </button>
                <button
                  onClick={onClose}
                  aria-label="close console"
                  className="ml-1 border border-line-mid px-[8px] py-1 font-mono text-[11px] text-ink-low transition-colors hover:text-ink"
                >
                  esc
                </button>
              </div>
            </div>

            {/* ── JUMP ─────────────────────────────────────────────────── */}
            {mode === "jump" && (
              <>
                <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
                  {groups.map((g) => (
                    <div key={g.label} className="mb-1">
                      <div className="px-3 py-[6px] font-mono text-[10px] tracking-[1.5px] text-ink-lower">
                        {g.label}
                      </div>
                      {g.items.map((it) => {
                        const on = it.key === selKey;
                        return (
                          <button
                            key={it.key}
                            ref={(el) => {
                              rowRefs.current[it.key] = el;
                            }}
                            onClick={() => onJump(it)}
                            onMouseEnter={() =>
                              setSel(flat.findIndex((f) => f.key === it.key))
                            }
                            className="flex w-full items-center gap-[11px] px-3 py-[9px] text-left"
                            style={{
                              background: on ? "var(--c-active)" : "transparent",
                              borderLeft: `2px solid ${on ? accent : "transparent"}`,
                            }}
                          >
                            <span
                              className="dot inline-block h-2 w-2 flex-none"
                              style={{ background: accentColor[it.accent] }}
                            />
                            <span className="text-[13px] text-ink">
                              {it.title}
                            </span>
                            <span className="text-[12.5px] text-ink-ghost">
                              {it.hint}
                            </span>
                            <span className="ml-auto font-mono text-[11px] text-ink-lower">
                              {it.file}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                  {flat.length === 0 && (
                    <div className="px-3 py-[16px] text-[13px] text-ink-ghost">
                      Nothing matches “{query}”. Try the{" "}
                      <span className="text-accent-blue">ask AI</span> tab.
                    </div>
                  )}
                </div>

                {/* prompt row at bottom — terminal feel */}
                <div className="flex flex-none items-center gap-[10px] border-t border-line bg-code px-4 py-[12px]">
                  <span className="font-mono text-[13px] text-accent-blue">▸</span>
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSel(0);
                    }}
                    onKeyDown={onSearchKey}
                    placeholder="type to filter — a role, project, skill…"
                    className="flex-1 bg-transparent font-mono text-[13px] text-ink"
                  />
                  <span className="hidden font-mono text-[11px] text-ink-lower sm:inline">
                    ↑↓ move · ↵ open · esc close
                  </span>
                </div>
              </>
            )}

            {/* ── ASK ──────────────────────────────────────────────────── */}
            {mode === "ask" && (
              <>
                <div
                  ref={scrollRef}
                  className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-[14px]"
                >
                  {messages.length === 0 && (
                    <div className="text-[13px] leading-[1.5] text-ink-faint">
                      <span className="mb-[10px] inline-flex items-center gap-[6px] border border-line-mid px-[8px] py-[3px] font-mono text-[10px] uppercase tracking-[1px] text-accent-amber">
                        <span className="dot inline-block h-[5px] w-[5px] bg-accent-amber" />
                        preview
                      </span>
                      <div>
                        Soon you&apos;ll be able to ask anything about my work —{" "}
                        {ASK_SUGGESTIONS.map((s, i) => (
                          <span key={i}>
                            <span className="text-accent-blue">{s}</span>
                            {i < ASK_SUGGESTIONS.length - 1 ? ", " : ""}
                          </span>
                        ))}
                        .
                      </div>
                      <div className="mt-[10px] font-mono text-[11px] text-ink-low">
                        Live answers are coming soon. Switch to{" "}
                        <span className="text-accent-blue">jump</span> to reach any
                        section now.
                      </div>
                    </div>
                  )}
                  {messages.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, ease: EASE }}
                      className="flex"
                      style={{
                        justifyContent:
                          m.role === "user" ? "flex-end" : "flex-start",
                      }}
                    >
                      <div
                        className="max-w-[80%] px-[13px] py-[9px] text-[13px] leading-[1.45]"
                        style={
                          m.role === "user"
                            ? { background: accent, color: "var(--c-on-accent)" }
                            : {
                                background: "var(--c-active)",
                                color: "var(--c-ink-soft)",
                                border: "1px solid var(--c-line-mid)",
                              }
                        }
                      >
                        {m.role === "assistant" ? (
                          <Markdown text={m.text} />
                        ) : (
                          m.text
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {sending && (
                    <div className="self-start font-mono text-[12px] text-accent-teal">
                      assistant is thinking
                      <span className="animate-blink">…</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-none items-end gap-[9px] border-t border-line bg-code px-[14px] py-3">
                  <textarea
                    ref={askRef}
                    rows={1}
                    value={askInput}
                    onChange={(e) => setAskInput(e.target.value)}
                    onKeyDown={(e) => {
                      // Enter sends; Shift+Enter inserts a newline.
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendAsk();
                      }
                    }}
                    placeholder="ask about my experience, projects, stack…  (⇧↵ for new line)"
                    className="max-h-[120px] flex-1 resize-none border border-line-mid bg-card px-3 py-[10px] text-[13px] leading-[1.45] text-ink [field-sizing:content]"
                  />
                  <motion.button
                    onClick={sendAsk}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center whitespace-nowrap font-mono text-[12.5px] font-bold"
                    style={{
                      background: accent,
                      color: "var(--c-on-accent)",
                      padding: "10px 14px",
                    }}
                  >
                    send ↵
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
