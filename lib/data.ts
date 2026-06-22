import type {
  DagNode,
  DagEdge,
  Experience,
  Project,
  SkillDomain,
  Education,
  TreeNode,
  JumpGroup,
  SectionId,
  AccentKey,
  Photo,
} from "./types";
import { GENERATED_PHOTOS } from "./photos.generated";

/* ────────────────────────────────────────────────────────────────────────
   CONTENT — single source of truth, drawn from the résumé. Every visible
   string lives here so the UI never has to be touched.
   ──────────────────────────────────────────────────────────────────────── */

/** Résumé file in /public — served at site root, downloadable everywhere. */
export const RESUME_URL = "/Prajwal_Tidke_Resume_DE.pdf";

export const profile = {
  handle: "prajwal.tidke",
  name: "Prajwal Tidke",
  title: "Data Engineer & AI Engineer",
  focus: "Databricks · AI/ML · RAG · AWS/Azure",
  location: "Sunnyvale, CA",
  tenure: "5+ yrs building",
  openToWork: true,
  statusOpen: "Open to data / AI engineering roles",
  statusClosed: "Currently heads-down",
  email: "mailto:ptidke9@gmail.com",
  github: "github.com/pTidke",
  linkedin: "linkedin.com/in/ptidke9",
  tags: ["Lakehouse", "Streaming", "RAG", "LLM Apps"],
};

/* ── README / about.md card content ────────────────────────────────────── */
export const readme = {
  name: "Prajwal Tidke",
  tagline:
    "I build the ingestion, transformation, and retrieval layers that production AI runs on.",
  summary: [
    "Data/AI Engineer with 5+ years building high-scale batch and streaming pipelines — multi-terabyte daily volumes across finance, manufacturing, and healthcare. I optimize lakehouse architectures on AWS, Databricks, and Snowflake.",
    "Currently a Graduate AI Data Engineer at SDSU's LINC Lab, building the ingestion, retrieval, and evaluation layers behind KALM — a clinical mental-health companion. Recent work centers on production data pipelines for RAG and LLM-powered applications.",
  ],
  glance: [
    ["role", "Data Engineer & AI Engineer"],
    ["focus", "Databricks · AI/ML · RAG · AWS/Azure"],
    ["based", "Sunnyvale, CA"],
    // ["studying", "MS Big Data Analytics, SDSU (4.0)"],
    ["status", "open to data / AI engineering roles"],
  ] as [string, string][],
  stack: [
    "Python", "PySpark", "Spark", "Kafka", "Airflow", "dbt", "Databricks",
    "Snowflake", "Delta Lake", "Apache Iceberg", "DuckDB", "AWS",
    "Azure OpenAI", "LangChain", "ChromaDB", "RAG",
  ],
  links: [
    { icon: "✉", label: "ptidke9@gmail.com", href: "mailto:ptidke9@gmail.com" },
    { icon: "in", label: "· linkedin", href: `https://${"linkedin.com/in/ptidke9"}` },
    { icon: "gh", label: "· github", href: `https://${"github.com/pTidke"}` },
    { icon: "↗", label: "portfolio", href: "#" },
  ],
};

export const accentColor: Record<AccentKey, string> = {
  blue: "#5b9dff",
  teal: "#2dd4bf",
  amber: "#fbbf24",
  green: "#4ade80",
  violet: "#a78bfa",
};

/** macOS window traffic-lights — universal signal, never themed. */
export const WINDOW_LIGHTS = ["#ff5f57", "#febc2e", "#28c840"] as const;

/* ── DAG NODES ─────────────────────────────────────────────────────────── */
export const NODES: DagNode[] = [
  // sources
  { id: "identity", kind: "SOURCE", label: "src.identity", sub: "name · title · status", body: "Who I am — role, focus, and current availability.", accent: "blue", col: 0, row: 0 },
  { id: "about", kind: "SOURCE", label: "src.about", sub: "summary · principles", body: "What I build and what I optimize for.", accent: "blue", col: 0, row: 1 },
  { id: "education", kind: "SOURCE", label: "src.education", sub: "SDSU · 4.0", body: "Where the fundamentals were forged.", accent: "blue", col: 0, row: 2 },
  // staging
  { id: "experience", kind: "STAGING", label: "stg.experience", sub: "4 roles", body: "Five years across finance, enterprise & research.", accent: "teal", col: 1, row: 0 },
  { id: "skills", kind: "STAGING", label: "stg.skills", sub: "6 domains · 35+ tools", body: "The full data + AI toolchain.", accent: "teal", col: 1, row: 1 },
  // marts (6 projects)
  { id: "p1", kind: "MART", label: "mart.risk_pulse", sub: "real-time risk", body: "Real-time Kafka risk pipeline with a RAG query layer.", accent: "amber", col: 2, row: 0 },
  { id: "p2", kind: "MART", label: "mart.ai_supremacy", sub: "country AI scoring", body: "7-dimension AI scoring across 195 countries.", accent: "amber", col: 2, row: 1 },
  { id: "p3", kind: "MART", label: "mart.trafficsens", sub: "accident prediction", body: "ML + geospatial severity and hotspot detection.", accent: "amber", col: 2, row: 2 },
  { id: "p4", kind: "MART", label: "mart.allabouttax", sub: "AI tax advisory", body: "Stateful AI assistant with streaming + RBAC.", accent: "amber", col: 2, row: 3 },
  { id: "p5", kind: "MART", label: "mart.wildfire", sub: "fire-risk ML", body: "Geospatial XGBoost forest-fire risk assessment.", accent: "amber", col: 2, row: 4 },
  { id: "p6", kind: "MART", label: "mart.medivu", sub: "healthcare analytics", body: "1M+ clinical records in PySpark, surfaced in Tableau.", accent: "amber", col: 2, row: 5 },
  // output
  { id: "contact", kind: "OUTPUT", label: "mart.contact", sub: "links · resume", body: "How to reach me + the resume download.", accent: "green", col: 3, row: 0 },
  { id: "gallery", kind: "OUTPUT", label: "exp.gallery", sub: "photography", body: "Frames from off the clock.", accent: "violet", col: 3, row: 1 },
];

/* Build provenance — derived from the real model count so the console never lies. */
export const BUILD = { pass: NODES.length, warn: 0, error: 0 };

export const EDGES: DagEdge[] = [
  { from: "identity", to: "experience" },
  { from: "identity", to: "skills" },
  { from: "about", to: "experience" },
  { from: "about", to: "skills" },
  { from: "education", to: "skills" },
  { from: "experience", to: "p1" },
  { from: "experience", to: "p2" },
  { from: "skills", to: "p1" },
  { from: "skills", to: "p3" },
  { from: "skills", to: "p4" },
  { from: "skills", to: "p5" },
  { from: "skills", to: "p6" },
  { from: "p1", to: "contact" },
  { from: "skills", to: "contact" },
  { from: "about", to: "gallery" },
];

/* ── FILE → labels ─────────────────────────────────────────────────────── */
export const FILE: Record<SectionId, string> = {
  graph: "Graph",
  identity: "identity.sql",
  about: "about.md",
  experience: "experience.sql",
  skills: "skills.yml",
  education: "education.sql",
  certificates: "certificates.sql",
  contact: "contact.md",
  gallery: "gallery.parquet",
  p1: "risk_pulse.sql",
  p2: "ai_supremacy_index.sql",
  p3: "trafficsens.sql",
  p4: "allabouttax.sql",
  p5: "wildfire.sql",
  p6: "medivu.sql",
};

export const DOT_COLOR: Record<SectionId, AccentKey> = {
  graph: "blue",
  identity: "blue",
  about: "blue",
  education: "blue",
  certificates: "amber",
  experience: "teal",
  skills: "teal",
  p1: "amber", p2: "amber", p3: "amber", p4: "amber", p5: "amber", p6: "amber",
  contact: "green",
  gallery: "violet",
};

/* ── ABOUT ─────────────────────────────────────────────────────────────── */
export const about = {
  bio: readme.tagline,
  optimizesFor: [
    { key: "freshness_sla ↑", desc: "minute-level pipelines, 99.9% SLA" },
    { key: "compute_cost ↓", desc: "Z-ordering, predicate pushdown" },
    { key: "answer_faithfulness", desc: "RAGAS-gated retrieval quality" },
    { key: "data_contracts", desc: "schema drift fails the build" },
  ],
};

/* ── EXPERIENCE ────────────────────────────────────────────────────────── */
export const EXPERIENCE: Experience[] = [
  {
    role: "Graduate AI Data Engineer",
    company: "SDSU · LINC Lab",
    span: "Feb 2025 — May 2026",
    highlight: "p95 latency −55%",
    body: "Building the production data backbone behind KALM, a clinical mental-health companion. Owned an ingestion pipeline parsing 1.5K+ multi-format clinical documents into ChromaDB via Google LangExtract — removing 15 hrs/week of manual annotation. Built a metadata-tagged chunking + semantic-filtering retrieval layer over ChromaDB and Azure OpenAI (p95 3.8s → 1.7s), and a RAGAS + LLM-as-judge eval harness gating answers at a 0.96 faithfulness threshold with HIPAA-aligned PII/PHI redaction. Designed KALM's 5-stage deterministic crisis-response state machine.",
    metric: "0.96 faithfulness gate",
    stack: ["Python", "Azure OpenAI", "ChromaDB", "LangExtract", "RAGAS", "FastAPI"],
    tenure: "1 yr 4 mo",
    product: "KALM",
    domain: "clinical AI / healthcare",
    columns: [
      { label: "documents_ingested", value: "1.5K+ (via LangExtract)" },
      { label: "annotation_saved", value: "15 hrs/week" },
      { label: "p95_latency", value: "3.8s → 1.7s (-55%)" },
      { label: "faithfulness", value: "0.96 (200-query eval)" },
      { label: "crisis_routing", value: "5-stage deterministic state machine" },
      { label: "compliance", value: "HIPAA-aligned PII/PHI" },
    ],
    link: { label: "Visit KALM", href: "https://kalm-omega.vercel.app/", kind: "live" },
  },
  {
    role: "Senior Data Engineer",
    company: "TresVista Analytics",
    span: "Oct 2023 — Aug 2024",
    highlight: "−$42K/yr compute · 1.2 TB/day",
    body: "Designed ELT pipelines on a Databricks Medallion architecture orchestrating portfolio analytics for a $550B+ AUM fund-of-funds client (+30% reliability). Architected an event-driven AWS SQS/SNS → S3 ingestion system processing 1.2 TB/day, and tuned high-cardinality tables with Delta Lake Z-Ordering — cutting compute $42K/year and median query latency 38%. Integrated 7 market & alt-data feeds via a custom API connector with PyTest data-contract CI gates (45% less manual analysis, 100% SLA). Best Mentor Award.",
    metric: "$550B+ AUM",
    stack: ["Databricks", "PySpark", "Delta Lake", "AWS", "dbt"],
    tenure: "11 mo",
    product: "Portfolio Analytics",
    domain: "finance / data engineering",
    columns: [
      { label: "aum_supported", value: "$550B+ fund-of-funds" },
      { label: "ingestion_volume", value: "1.2 TB/day" },
      { label: "compute_savings", value: "$42K/year" },
      { label: "query_latency", value: "38% faster" },
      { label: "manual_analysis", value: "-45% (at 100% SLA)" },
      { label: "data_feeds", value: "7 integrated" },
    ]
  },
  {
    role: "Senior Data Engineer",
    company: "LTIMindtree",
    span: "Jul 2021 — Oct 2023",
    highlight: "$650K/yr saved · 99.9% SLA",
    body: "Directed technical planning, code reviews, and Agile delivery across 5+ enterprise clients. Led the migration of legacy infrastructure to AWS Glue and Snowflake with SCD Type 2 history tracking — securing $650K/year in operating savings and lifting data-freshness SLAs to 99.9%. Built curated reporting datasets feeding Power BI (NA) and AWS QuickSight (EU) across SQL Server, Oracle, and Snowflake, standardizing the metrics consumed by C-suite across both regions.",
    metric: "legacy → Glue + Snowflake",
    stack: ["AWS Glue", "Snowflake", "Airflow", "Power BI"],
    tenure: "2 yrs 4 mo",
    product: "Enterprise Data Infrastructure",
    domain: "enterprise / data engineering",
    columns: [
      { label: "clients", value: "5+ enterprise clients" },
      { label: "operating_savings", value: "$650K/year" },
      { label: "data_freshness", value: "99.9% SLA" },
      { label: "migration", value: "legacy to AWS Glue/Snowflake" },
      { label: "reporting", value: "Power BI (NA) & QuickSight (EU)" },
    ]
  },
  {
    role: "Data Engineer",
    company: "LTIMindtree",
    span: "Jul 2020 — Jul 2021",
    highlight: "regulatory reporting −80%",
    body: "Overhauled legacy batch ETL, tuning Spark and Snowflake via predicate pushdown and indexing strategies to accelerate monthly regulatory reporting timelines by 80%. Built a schema-validation framework across 7+ downstream reporting pipelines, catching schema drift and cutting production data errors by 63%.",
    metric: "errors −63%",
    stack: ["Spark", "Snowflake", "Python", "SQL"],
    tenure: "1 yr 1 mo",
    product: "Reporting Pipelines",
    domain: "enterprise / data engineering",
    columns: [
      { label: "regulatory_reporting", value: "-80% timelines" },
      { label: "production_errors", value: "-63%" },
      { label: "pipelines_validated", value: "7+ downstream" },
      { label: "tuning_strategies", value: "predicate pushdown & indexing" },
    ]
  },
];

/* ── SKILLS (6 domains) ────────────────────────────────────────────────── */
export const SKILLS: SkillDomain[] = [
  { name: "languages", tools: ["Python", "PySpark", "Scala", "SQL", "Java", "Pandas", "Bash", "TypeScript"], color: accentColor.blue, accent: "blue" },
  { name: "orchestration", tools: ["Airflow", "Spark", "Kafka", "Flink", "AWS Kinesis", "Faust", "dbt", "AWS Glue"], color: accentColor.amber, accent: "amber" },
  { name: "lakehouse & storage", tools: ["Databricks", "Snowflake", "Delta Lake", "Apache Iceberg", "S3", "DuckDB", "PostgreSQL", "MinIO"], color: accentColor.teal, accent: "teal" },
  { name: "cloud & devops", tools: ["AWS", "Azure", "Docker", "Kubernetes", "Terraform", "CI/CD", "PyTest", "Git"], color: accentColor.green, accent: "green" },
  { name: "modeling & quality", tools: ["Medallion", "Dimensional Modeling", "SCD Type 2", "Data Contracts", "Great Expectations", "Data Quality"], color: accentColor.blue, accent: "blue" },
  { name: "ai systems", tools: ["RAG", "LangChain", "Azure OpenAI", "ChromaDB", "RAGAS", "FastAPI", "XGBoost", "Scikit-Learn"], color: accentColor.teal, accent: "teal" },
];

export const TOOL_COLORS: Record<string, string> = {};
SKILLS.forEach((domain) => {
  domain.tools.forEach((tool) => {
    TOOL_COLORS[tool] = domain.color!;
  });
});

/* ── PROJECTS (6) ──────────────────────────────────────────────────────── */
export const PROJECTS: Project[] = [
  {
    id: "p1", file: "risk_pulse.sql", name: "Risk Pulse", slug: "risk_pulse",
    problem: "Portfolio risk signals arrive too slowly and too far from the data to act on in real time.",
    approach: "A real-time Kafka pipeline computing 5-min VWAP, volatility, and drawdown alerts into a date-partitioned Parquet lake on embedded DuckDB — with dbt marts under enforced data contracts, an Iceberg/MinIO snapshot benchmarked against Parquet, and a RAG layer for natural-language risk queries.",
    metrics: [
      { label: "warm p50", value: "11ms → 0.5ms", accent: true },
      { label: "data-quality tests", value: "10" },
      { label: "equity symbols", value: "8" },
    ],
    stack: ["Kafka", "DuckDB", "dbt", "Apache Iceberg", "MinIO", "Azure OpenAI"],
    links: [
      { label: "repo", href: "https://github.com/pTidke/RiskPulse", kind: "repo" },
    ],
  },
  {
    id: "p2", file: "ai_supremacy_index.sql", name: "AI Supremacy Index", slug: "ai_supremacy_index",
    problem: "There was no composite, comparable measure of national AI resilience.",
    approach: "A 7-dimension AI resilience score built from 31 heterogeneous sources across 195 countries, with log transforms, coverage-weighted aggregation, and a Three.js globe.",
    metrics: [
      { label: "countries", value: "195", accent: true },
      { label: "rows ingested", value: "~53.7k" },
      { label: "sources", value: "31 → 8" },
    ],
    stack: ["Python", "Pandas", "Next.js", "Three.js", "Ant Design", "Nivo"],
    links: [
      { label: "frontend", href: "https://github.com/pTidke/ai-supremacy-index", kind: "repo" },
      { label: "backend", href: "https://github.com/pTidke/aisi-data-processing", kind: "repo" },
    ],
  },
  {
    id: "p3", file: "trafficsens.sql", name: "TrafficSensAI", slug: "trafficsens_ai",
    problem: "Accident severity and persistent hotspots are hard to predict from raw geospatial data.",
    approach: "A full-stack ML + geospatial platform: DBSCAN spatial clustering for hotspot corridors and a Random Forest severity classifier served over a Flask REST API.",
    metrics: [
      { label: "clustering", value: "DBSCAN", accent: true },
      { label: "classifier", value: "Random Forest" },
      { label: "serving", value: "Flask API" },
    ],
    stack: ["Python", "Scikit-Learn", "DBSCAN", "Random Forest", "Flask", "ArcGIS"],
    links: [
      { label: "live demo", href: "https://trafficsensai.onrender.com/", kind: "live" },
      { label: "repo", href: "https://github.com/pTidke/TrafficSensAI", kind: "repo" },
    ],
  },
  {
    id: "p4", file: "allabouttax.sql", name: "AllAboutTax", slug: "allabouttax",
    problem: "Tax guidance is generic and stateless — nothing remembers a user's situation across a conversation.",
    approach: "A full-stack AI tax assistant with persistent conversation memory, real-time streaming, and role-based access control over a headless CMS.",
    metrics: [
      { label: "AI memory", value: "threadId → user", accent: true },
      { label: "streaming", value: "Vercel AI SDK" },
      { label: "CMS", value: "Sanity + ISR" },
    ],
    stack: ["Next.js 15", "React 19", "OpenAI Assistants", "PostgreSQL", "Prisma", "Sanity"],
    links: [
      { label: "live site", href: "https://www.allabouttax.in/", kind: "live" },
      { label: "repo", href: "https://github.com/pTidke/nextjs-allabouttax", kind: "repo" },
    ],
  },
  {
    id: "p5", file: "wildfire.sql", name: "Wildfire Risk", slug: "wildfire_risk",
    problem: "Forest-fire risk needs to be surfaced before ignition, not after.",
    approach: "Geospatial ML on satellite and meteorological data, modeling high-risk zones with XGBoost.",
    metrics: [
      { label: "F1 score", value: "~71.67%", accent: true },
      { label: "model", value: "XGBoost" },
      { label: "data", value: "satellite + met" },
    ],
    stack: ["Python", "XGBoost", "Geopandas", "Rasterio"],
    links: [
      { label: "repo", href: "https://github.com/pTidke/BDA602", kind: "repo" },
    ],
  },
  {
    id: "p6", file: "medivu.sql", name: "Medi-vu", slug: "medi_vu",
    problem: "Clinical-outcome data sat unused without a scalable way to analyze and present it.",
    approach: "A scalable healthcare analytics platform: 1M+ records processed in PySpark and surfaced through interactive executive Tableau dashboards.",
    metrics: [
      { label: "records", value: "1M+", accent: true },
      { label: "engine", value: "PySpark" },
      { label: "BI", value: "Tableau" },
    ],
    stack: ["Databricks", "PySpark", "Tableau", "SQL"],
    links: [
      { label: "site", href: "https://sites.google.com/sdsu.edu/medi-vu/home", kind: "live" },
      { label: "Tableau", href: "https://public.tableau.com/app/profile/prajwal.tidke/viz/MediVu/Story1", kind: "data" },
      { label: "repo", href: "https://github.com/pTidke/Medi-vu", kind: "repo" },
    ],
  },
];

/* ── EDUCATION ─────────────────────────────────────────────────────────── */
export const EDUCATION: Education[] = [
  {
    school: "San Diego State University",
    degree: "M.S. Big Data Analytics",
    span: "Aug 2024 — May 2026",
    detail: "Academic Excellence Award · CGPA 4.0/4.0 — distributed data systems, ML, and applied LLMs.",
    coursework: [
      "Deep Learning", "Data Mining", "Big Data Engineering", "Statistical Learning",
      "Data Visualization", "AI & Machine Learning", "Cloud Computing", "Cybersecurity",
      "Natural Language Processing",
    ],
    accent: "blue",
  },
  {
    school: "Indian Institute of Information Technology, Design and Manufacturing, Jabalpur",
    degree: "B.Tech, Computer Science and Engineering",
    span: "Aug 2016 — May 2020",
    detail: "Core fundamentals in Computer Science and Engineering · CGPA 3.2/4.0.",
    coursework: [
      "Data Structures", "Algorithms", "Database Systems", "Operating Systems",
      "Computer Networks", "Software Engineering", "Object-Oriented Programming",
      "Web Technologies", "Cryptography & Network Security",
    ],
    accent: "teal",
  },
];

/* ── CERTIFICATES ──────────────────────────────────────────────────────── */
export const CERTIFICATES = [
  {
    title: "dbt Fundamentals",
    issuer: "dbt Labs",
    span: "Issued Jun 2026",
    href: "https://credentials.getdbt.com/acdb0463-e895-4a9b-a776-c26b8b913bd1#acc.TiNkupyV",
  },
  {
    title: "Data Engineer",
    issuer: "DataCamp",
    span: "Issued Apr 2026",
    href: "https://www.datacamp.com/certificate/DE0010911538103",
  },
  {
    title: "Data Scientist",
    issuer: "DataCamp",
    span: "Issued Apr 2026",
    href: "https://www.datacamp.com/certificate/DS0029871418512",
  },
  {
    title: "AI Engineer for Data Scientists Associate",
    issuer: "DataCamp",
    span: "Issued May 2026",
    href: "https://www.datacamp.com/certificate/AEDS0010526670380",
  },
  {
    title: "Academy Accreditation - Platform Administrator",
    issuer: "Databricks",
    span: "Issued Apr 2026",
    href: "https://credentials.databricks.com/41e85afb-6ad4-4d06-986d-67a99062454d#acc.hoWNrAeM",
  },
  {
    title: "Academy Accreditation - GCP Databricks Platform Architect",
    issuer: "Databricks",
    span: "Issued Apr 2026",
    href: "https://credentials.databricks.com/fb839461-de47-4071-a903-798f63109094#acc.apuhrIlR",
  },
  {
    title: "Academy Accreditation - AWS Databricks Platform Architect",
    issuer: "Databricks",
    span: "Issued Apr 2026",
    href: "https://credentials.databricks.com/730c4b36-fcde-4a5c-9272-22ac83d6e427#acc.6mnTXK2q",
  },
  {
    title: "Academy Accreditation - Azure Databricks Platform Architect",
    issuer: "Databricks",
    span: "Issued Apr 2026",
    href: "https://credentials.databricks.com/0f18894a-b8ea-48dc-bafb-657699b6323c#acc.C9YbKgjq",
  },
  {
    title: "Academy Accreditation - AI Agent Fundamentals",
    issuer: "Databricks",
    span: "Issued Apr 2026",
    href: "https://credentials.databricks.com/a7e8dd14-9063-49c4-9135-3e48fc99641e#acc.qrjs7AIb",
  },
  {
    title: "Academy Accreditation - Databricks Fundamentals",
    issuer: "Databricks",
    span: "Issued Apr 2026",
    href: "https://credentials.databricks.com/a7e8dd14-9063-49c4-9135-3e48fc99641e#acc.qrjs7AIb",
  },
  {
    title: "Academy Accreditation - Generative AI Fundamentals",
    issuer: "Databricks",
    span: "Issued Apr 2026",
    href: "https://credentials.databricks.com/9a15582e-f54c-4c89-aeaa-474004ca8227#acc.DrF7CIfl",
  },
];

/* ── PHOTOGRAPHY ───────────────────────────────────────────────────────────
   Off-the-clock frames. The list (paths, dimensions, EXIF) is generated by
   scripts/optimize-photos.mjs from originals in photo-src/ — re-run it after
   adding photos. To add a human caption/location to any frame, key it by src
   in PHOTO_META below; everything else is read straight from EXIF. */
export const PHOTO_META: Record<string, { title?: string; location?: string }> = {
  // "/photography/01.jpg": { title: "Golden hour", location: "Big Sur, CA" },
};

export const PHOTOS: Photo[] = GENERATED_PHOTOS.map((p) => ({
  ...p,
  ...PHOTO_META[p.src],
}));

/* ── AI ASSISTANT (UI only — backend stubbed for now) ──────────────────── */
export const ASK_SUGGESTIONS = [
  '"Tell me about his experience at TresVista"',
  '"What are his technical skills?"',
  '"How can I reach out to him?"',
];

/* ── derived file slugs ────────────────────────────────────────────────── */
const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

const EXP_FILE = (i: number) =>
  `${slug(EXPERIENCE[i].company.split("·")[0])}.sql`;
const SKILL_FILE = (i: number) => `${slug(SKILLS[i].name)}.yml`;

/* ── FILE EXPLORER TREE ────────────────────────────────────────────────────
   experience/ and skills/ are collapsible folders (like projects/), each
   holding one file per role / domain. Leaves open the matching modal. */
export const TREE: TreeNode[] = [
  {
    key: "models",
    label: "models/",
    children: [
      { key: "identity", label: "identity.sql", id: "identity", dot: "blue" },
      { key: "about", label: "about.md", id: "about", dot: "blue" },
      { key: "education", label: "education.sql", id: "education", dot: "blue" },
      {
        key: "f-experience",
        label: "experience/",
        children: EXPERIENCE.map((_, i) => ({
          key: `exp${i}`,
          label: EXP_FILE(i),
          modal: `exp:${i}` as const,
          dot: "teal" as const,
        })),
      },
      {
        key: "f-skills",
        label: "skills/",
        children: SKILLS.map((_, i) => ({
          key: `skill${i}`,
          label: SKILL_FILE(i),
          modal: `skill:${i}` as const,
          dot: "teal" as const,
        })),
      },
      {
        key: "f-projects",
        label: "projects/",
        children: PROJECTS.map((p, i) => ({
          key: p.id,
          label: p.file,
          modal: `proj:${i}` as const,
          dot: "amber" as const,
        })),
      },
      { key: "gallery", label: "gallery.parquet", modal: "gallery", dot: "violet" },
      { key: "contact", label: "contact.md", id: "contact", dot: "green" },
    ],
  },
  { key: "resume", label: "resume.pdf", resume: true },
];

/* ── ⌘K JUMP LIST ──────────────────────────────────────────────────────────
   Real, human names grouped by area so the console reads like a menu, not a
   list of filenames. Each item opens a section or a modal directly. */
export const JUMP_GROUPS: JumpGroup[] = [
  {
    label: "About",
    items: [
      { key: "identity", title: "Identity", hint: "name · role · status", file: "identity.sql", accent: "blue", id: "identity" },
      { key: "about", title: "About", hint: "summary · what I optimize for", file: "about.md", accent: "blue", id: "about" },
      { key: "education", title: "Education", hint: "MS Big Data Analytics · SDSU", file: "education.sql", accent: "blue", id: "education" },
      { key: "gallery", title: "Photography", hint: "off the clock · gallery", file: "gallery.parquet", accent: "violet", modal: "gallery" },
    ],
  },
  {
    label: "Experience",
    items: EXPERIENCE.map((e, i) => ({
      key: `exp${i}`,
      title: e.company,
      hint: e.role,
      file: EXP_FILE(i),
      accent: "teal" as const,
      modal: `exp:${i}` as const,
    })),
  },
  {
    label: "Skills",
    items: SKILLS.map((s, i) => ({
      key: `skill${i}`,
      title: s.name,
      hint: `${s.tools.length} tools`,
      file: SKILL_FILE(i),
      accent: "teal" as const,
      modal: `skill:${i}` as const,
    })),
  },
  {
    label: "Projects",
    items: PROJECTS.map((p, i) => ({
      key: p.id,
      title: p.name,
      hint: p.slug,
      file: p.file,
      accent: "amber" as const,
      modal: `proj:${i}` as const,
    })),
  },
  {
    label: "Contact",
    items: [
      { key: "contact", title: "Contact", hint: "links · resume", file: "contact.md", accent: "green", id: "contact" },
    ],
  },
];

export const JUMP_ITEMS = JUMP_GROUPS.flatMap((g) => g.items);
