import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    // Hard kill every default rounded value — sharp corners everywhere.
    borderRadius: {
      none: "0",
      DEFAULT: "0",
      sm: "0",
      md: "0",
      lg: "0",
      xl: "0",
      "2xl": "0",
      "3xl": "0",
      full: "0",
    },
    extend: {
      colors: {
        // Surfaces + ink resolve to theme vars (see globals.css) so the whole
        // IDE re-skins when html[data-theme] flips. Accents stay fixed below.
        base: "var(--c-base)",
        window: "var(--c-window)",
        panel: "var(--c-panel)",
        chrome: "var(--c-chrome)",
        code: "var(--c-code)",
        card: "var(--c-card)",
        inset: "var(--c-inset)",
        active: "var(--c-active)",
        line: {
          DEFAULT: "var(--c-line)",
          soft: "var(--c-line-soft)",
          mid: "var(--c-line-mid)",
          code: "var(--c-line-code)",
        },
        ink: {
          DEFAULT: "var(--c-ink)",
          bright: "var(--c-ink-bright)",
          soft: "var(--c-ink-soft)",
          dim: "var(--c-ink-dim)",
          muted: "var(--c-ink-muted)",
          faint: "var(--c-ink-faint)",
          ghost: "var(--c-ink-ghost)",
          low: "var(--c-ink-low)",
          lower: "var(--c-ink-lower)",
        },
        // Accent-as-text resolves to theme vars so labels/links clear AA on the
        // light surface. Decorative accent fills/dots use accentColor[] (lib/data).
        accent: {
          blue: "var(--c-accent-blue)",
          teal: "var(--c-accent-teal)",
          amber: "var(--c-accent-amber)",
          green: "var(--c-accent-green)",
          purple: "var(--c-accent-purple)",
          violet: "var(--c-accent-violet)",
        },
        syntax: {
          keyword: "var(--c-accent-blue)",
          string: "var(--c-syntax-string)",
          jinja: "var(--c-accent-purple)",
          bool: "var(--c-accent-amber)",
        },
      },
      fontFamily: {
        sans: ["var(--font-plex)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      keyframes: {
        blink: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        dash: {
          to: { strokeDashoffset: "-22" },
        },
      },
      animation: {
        blink: "blink 1.1s steps(1) infinite",
        dash: "dash 1s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
