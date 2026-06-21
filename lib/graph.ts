import { EXPERIENCE, PROJECTS, SKILLS } from "./data";
import type { GNode, ModalId, ViewId } from "./types";

/* Root source node, anchored on the left of every view. */
export const ROOT: GNode = {
  id: "me",
  kind: "SOURCE",
  title: "Prajwal Tidke",
  label: "src.prajwal",
  sub: "Data engineer",
  body: "The source everything descends from.",
  accent: "blue",
  modal: "about",
};

/* Overview: the four top-level models. */
export const MAINS: GNode[] = [
  {
    id: "about",
    kind: "SOURCE",
    title: "About",
    label: "src.about",
    sub: "Bio, timeline & education",
    body: "Who I am, the timeline, and what I optimize for.",
    accent: "blue",
    expandTo: "about",
  },
  {
    id: "experience",
    kind: "STAGING",
    title: "Experience",
    label: "stg.experience",
    sub: `${EXPERIENCE.length} roles`,
    body: "Roles across finance, enterprise, and research.",
    accent: "teal",
    expandTo: "experience",
  },
  {
    id: "projects",
    kind: "MART",
    title: "Projects",
    label: "mart.projects",
    sub: `${PROJECTS.length} case studies`,
    body: "Standalone builds, mostly from the masters.",
    accent: "amber",
    expandTo: "projects",
  },
];

type SubView = { parentId: string; children: GNode[] };

export const SUB: Record<Exclude<ViewId, "overview">, SubView> = {
  about: {
    parentId: "about",
    children: [
      {
        id: "education",
        kind: "SOURCE",
        title: "Education",
        label: "src.education",
        sub: "SDSU",
        body: "Where the fundamentals were forged.",
        accent: "blue",
        modal: "education",
      },
      {
        id: "skills",
        kind: "STAGING",
        title: "Skills",
        label: "stg.skills",
        sub: `${SKILLS.length} domains`,
        body: "The full data + AI toolchain.",
        accent: "teal",
        modal: "skills",
      },
      {
        id: "certificates",
        kind: "MART",
        title: "Certificates",
        label: "mart.certificates",
        sub: "2 awards",
        body: "Awards and certifications.",
        accent: "amber",
        modal: "certificates",
      },
    ],
  },
  experience: {
    parentId: "experience",
    children: EXPERIENCE.map((e, i) => ({
      id: `exp${i}`,
      kind: "STAGING",
      title: e.company,
      label: `stg.exp_${i + 1}`,
      sub: e.role,
      body: `${e.role} · ${e.span}`,
      accent: "teal",
      modal: `exp:${i}` as const,
    })),
  },
  projects: {
    parentId: "projects",
    children: PROJECTS.map((p, i) => ({
      id: p.id,
      kind: "MART",
      title: p.name,
      label: `mart.${p.slug}`,
      sub: "case study",
      body: p.problem,
      accent: "amber",
      modal: `proj:${i}` as const,
    })),
  },
};

/* The main node that owns a given sub-view (for the morph + breadcrumb). */
export function mainFor(view: Exclude<ViewId, "overview">): GNode {
  return MAINS.find((m) => m.id === SUB[view].parentId)!;
}

/* Breadcrumb label for a view. */
export const VIEW_LABEL: Record<ViewId, string> = {
  overview: "lineage",
  experience: "experience",
  projects: "projects",
  about: "about",
};

/* Breadcrumb / tab label for an open modal. */
export function modalLabel(id: ModalId): string {
  if (id === "about") return "about.md";
  if (id === "contact") return "contact.md";
  if (id === "education") return "education.sql";
  if (id === "skills") return "skills.yml";
  if (id === "certificates") return "certificates.md";
  const [kind, nStr] = id.split(":");
  const i = Number(nStr);
  if (kind === "proj") return PROJECTS[i].file;
  if (kind === "exp") return `exp_${i + 1}.sql`;
  if (kind === "skill") return `${SKILLS[i].name.split(" ")[0]}.yml`;
  return "";
}

/* Which nav link should highlight for an open modal. */
export function modalNav(id: ModalId): "about" | "contact" | "experience" | "projects" | "skills" {
  if (id === "about") return "about";
  if (id === "contact") return "contact";
  if (id === "education") return "about";
  if (id === "skills") return "about";
  if (id === "certificates") return "about";
  const kind = id.split(":")[0];
  if (kind === "proj") return "projects";
  if (kind === "exp") return "experience";
  return "about";
}
