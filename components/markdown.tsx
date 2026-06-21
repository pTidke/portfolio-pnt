import type { ReactNode } from "react";

/* Minimal, dependency-free markdown renderer for assistant replies.
   Covers the subset the Foundry agent emits: **bold**, *italic*, `code`,
   [links](url), bullet/numbered lists, and #-headings. Not a full CommonMark
   parser — deliberately small and theme-aware (uses --c-* tokens). */

const INLINE =
  /(\[[^\]]+\]\([^)]+\))|(\*\*[^*]+\*\*)|(`[^`]+`)|(\*[^*]+\*)|(_[^_]+_)/g;

function renderInline(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  INLINE.lastIndex = 0;

  while ((m = INLINE.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const tok = m[0];
    const key = `${keyBase}-${i++}`;

    if (tok.startsWith("[")) {
      const link = /\[([^\]]+)\]\(([^)]+)\)/.exec(tok)!;
      nodes.push(
        <a
          key={key}
          href={link[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
          style={{ color: "var(--c-accent-blue)" }}
        >
          {link[1]}
        </a>,
      );
    } else if (tok.startsWith("**")) {
      nodes.push(
        <strong key={key} className="font-semibold" style={{ color: "var(--c-ink)" }}>
          {tok.slice(2, -2)}
        </strong>,
      );
    } else if (tok.startsWith("`")) {
      nodes.push(
        <code
          key={key}
          className="px-1 py-[1px] font-mono text-[12px]"
          style={{ background: "var(--c-line-mid)", color: "var(--c-ink)" }}
        >
          {tok.slice(1, -1)}
        </code>,
      );
    } else {
      nodes.push(<em key={key}>{tok.slice(1, -1)}</em>);
    }
    last = m.index + tok.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ text }: { text: string }) {
  const lines = text.split(/\r?\n/);
  const blocks: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let para: string[] = [];

  const flushPara = () => {
    if (para.length) {
      const k = blocks.length;
      blocks.push(
        <p key={`p-${k}`} className="m-0">
          {renderInline(para.join(" "), `p${k}`)}
        </p>,
      );
      para = [];
    }
  };

  const flushList = () => {
    if (!list) return;
    const k = blocks.length;
    const cls = `m-0 flex flex-col gap-[3px] pl-[18px] ${list.ordered ? "list-decimal" : "list-disc"}`;
    const items = list.items.map((it, j) => (
      <li key={j}>{renderInline(it, `li${k}-${j}`)}</li>
    ));
    blocks.push(
      list.ordered ? (
        <ol key={`l-${k}`} className={cls}>{items}</ol>
      ) : (
        <ul key={`l-${k}`} className={cls}>{items}</ul>
      ),
    );
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushPara();
      flushList();
      continue;
    }

    const head = /^#{1,6}\s+(.*)$/.exec(line);
    const bullet = /^[-*]\s+(.*)$/.exec(line);
    const num = /^\d+\.\s+(.*)$/.exec(line);

    if (head) {
      flushPara();
      flushList();
      const k = blocks.length;
      blocks.push(
        <p key={`h-${k}`} className="m-0 font-semibold" style={{ color: "var(--c-ink)" }}>
          {renderInline(head[1], `h${k}`)}
        </p>,
      );
    } else if (bullet) {
      flushPara();
      if (!list || list.ordered) {
        flushList();
        list = { ordered: false, items: [] };
      }
      list.items.push(bullet[1]);
    } else if (num) {
      flushPara();
      if (!list || !list.ordered) {
        flushList();
        list = { ordered: true, items: [] };
      }
      list.items.push(num[1]);
    } else {
      flushList();
      para.push(line);
    }
  }
  flushPara();
  flushList();

  return <div className="flex flex-col gap-[8px]">{blocks}</div>;
}
