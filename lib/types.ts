export type SectionId =
  | "graph"
  | "identity"
  | "about"
  | "experience"
  | "skills"
  | "education"
  | "certificates"
  | "contact"
  | "p1"
  | "p2"
  | "p3"
  | "p4"
  | "p5"
  | "p6";

export type NodeKind = "SOURCE" | "STAGING" | "MART" | "OUTPUT";

export type AccentKey = "blue" | "teal" | "amber" | "green";

export interface DagNode {
  id: SectionId;
  kind: NodeKind;
  label: string;
  sub: string;
  body: string;
  accent: AccentKey;
  /** layout: 0=sources 1=staging 2=marts 3=output */
  col: 0 | 1 | 2 | 3;
  /** vertical order within the column */
  row: number;
}

export interface DagEdge {
  from: SectionId;
  to: SectionId;
}

/** A node in the file-explorer tree. A folder has `children`; a leaf opens
 *  either a section (`id`) or a modal (`modal`). `resume` is the download row. */
export interface TreeNode {
  label: string;
  key: string;
  id?: SectionId;
  modal?: ModalId;
  dot?: AccentKey;
  resume?: boolean;
  /** present ⇒ this row is a collapsible folder */
  children?: TreeNode[];
  /** start collapsed on first paint */
  collapsed?: boolean;
}

/** One row in the ⌘K jump list — carries a human title + where it goes. */
export interface JumpItem {
  key: string;
  title: string;
  hint: string;
  file: string;
  accent: AccentKey;
  id?: SectionId;
  modal?: ModalId;
}

export interface JumpGroup {
  label: string;
  items: JumpItem[];
}

/** An outbound link — repo, live site, dashboard. `kind` picks the glyph. */
export interface ExternalLink {
  label: string;
  href: string;
  kind?: "repo" | "live" | "data";
}

export interface Experience {
  role: string;
  company: string;
  span: string;
  highlight: string;
  body: string;
  metric: string;
  stack: string[];
  tenure: string;
  product: string;
  domain: string;
  columns: { label: string; value: string }[];
  /** product/demo link — e.g. the live KALM app */
  link?: ExternalLink;
}

export interface Project {
  id: SectionId;
  file: string;
  name: string;
  slug: string;
  problem: string;
  approach: string;
  metrics: { label: string; value: string; accent?: boolean }[];
  stack: string[];
  links?: ExternalLink[];
}

export interface SkillDomain {
  name: string;
  tools: string[];
  color?: string;
  accent?: AccentKey;
}

export interface Education {
  school: string;
  degree: string;
  span: string;
  detail: string;
  coursework?: string[];
  accent?: AccentKey;
}

/* ── drill-down DAG ────────────────────────────────────────────────────── */
export type ViewId = "overview" | "experience" | "projects" | "about";

/** A node in any DAG view. Either drills into a sub-view or opens a modal. */
export interface GNode {
  id: string;
  kind: NodeKind;
  /** human-readable heading — leads the node so non-technical readers skim fast */
  title: string;
  /** dbt model path — shown quiet/secondary, carries the engineering voice */
  label: string;
  sub: string;
  body: string;
  accent: AccentKey;
  /** clicking drills into this sub-view (an expandable main node) */
  expandTo?: ViewId;
  /** clicking opens this modal (a leaf node) */
  modal?: ModalId;
}

/** Every modal-openable piece of content. */
export type ModalId =
  | "about"
  | "contact"
  | "education"
  | "skills"
  | "certificates"
  | `proj:${number}`
  | `exp:${number}`
  | `skill:${number}`;
