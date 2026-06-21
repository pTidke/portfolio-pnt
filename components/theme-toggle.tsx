"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EASE } from "./motion";

type Theme = "dark" | "light";

function current(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export default function ThemeToggle({ compact }: { compact?: boolean }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTheme(current());
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode — ignore */
    }
  }

  // Render the dark default until mounted so SSR + first paint stay consistent.
  const label = mounted && theme === "light" ? "light" : "dark";
  const icon = mounted && theme === "light" ? "☀" : "☾";

  return (
    <button
      onClick={toggle}
      aria-label={`switch to ${label === "light" ? "dark" : "light"} theme`}
      title={`theme: ${label}`}
      className={
        "flex items-center gap-[6px] border border-line-mid font-mono text-ink-muted transition-colors hover:text-ink " +
        (compact ? "px-[9px] py-[5px] text-[11px]" : "px-[10px] py-[5px] text-[11px]")
      }
    >
      <motion.span
        key={icon}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.25, ease: EASE }}
        className="inline-block leading-none"
      >
        {icon}
      </motion.span>
      {!compact && <span>{label}</span>}
    </button>
  );
}
