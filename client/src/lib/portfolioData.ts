/*
Design reminder — Constructivist Control Room:
Expose system structure through dense, intentional information blocks.
Use asymmetry, editorial framing, and operational language instead of generic portfolio tropes.
Every content grouping should feel like a panel inside a living control room.
*/

export const heroSubtitles = [
  "I build systems that work when infrastructure doesn't.",
  "Product thinking. Engineering depth. Shipped.",
  "From problem to production — including the hard parts.",
];

export const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export const aboutLayers = [
  {
    title: "Product Layer",
    accent: "amber",
    summary: "Product · Requirements · UX thinking · Shipping",
    details: ["requirements", "user flows", "testing", "shipping"],
  },
  {
    title: "Frontend Layer",
    accent: "blue",
    summary: "Frontend · React · Next · TypeScript · Tailwind",
    details: ["React", "Next.js", "TypeScript", "Tailwind CSS", "state", "PWA"],
  },
  {
    title: "Backend Layer",
    accent: "amber",
    summary: "Backend · Node · Express · MongoDB · MySQL · APIs",
    details: ["Node.js", "Express", "MongoDB", "MySQL", "REST APIs", "Laravel"],
  },
  {
    title: "Infrastructure Layer",
    accent: "muted",
    summary: "Infra · PWA · IndexedDB · Offline sync · Playwright",
    details: ["IndexedDB", "offline-first", "sync queue", "Playwright", "multi-tenant"],
  },
] as const;

export const projects = [
  {
    key: "trx",
    name: "TRX",
    description: "Route accounting for Lebanese water distributors.",
    type: "featured",
    badges: ["Production", "SaaS"],
    metrics: ["3k+ txn/mo", "40% less reconciliation", "Sole engineer", "In active use"],
    stack: ["MongoDB", "Node.js", "React", "PWA", "Playwright", "TypeScript", "IndexedDB", "Express"],
    actions: [
      { label: "Case study", href: "/trx", kind: "primary" },
      { label: "trx.theagilelabs.com", href: "https://trx.theagilelabs.com", kind: "ghost", external: true },
    ],
    backgroundImage:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663583051886/TULUjKNVxbCZTvdkwLcvn5/trx-feature-background-Yu8JxgbeHwazWs7tZSCe5b.webp",
  },
  {
    key: "istay",
    name: "I-Stay AI Assessment Platform",
    description: "AI-assisted assessment and admin workflow for a competitive engineering program.",
    tags: ["React", "Node.js", "AI", "Admin"],
    visual: "ai-flow",
    repoUrl: "",
    liveUrl: "",
    collaboratorNote: "Private repository",
  },
  {
    key: "carslb",
    name: "CarsLB",
    description: "Automotive marketplace platform delivered inside an Agile team shipping cycle.",
    tags: ["Full stack", "Marketplace", "UI systems"],
    visual: "car-silhouette",
    repoUrl: "",
    liveUrl: "",
  },
  {
    key: "alumni-cms",
    name: "Alumni Portfolio CMS",
    description: "Portfolio management interface with structured content surfaces and modular cards.",
    tags: ["CMS", "Responsive UI", "Content"],
    visual: "masonry-cms",
    repoUrl: "",
    liveUrl: "",
  },
  {
    key: "lms",
    name: "LMS",
    description: "Learning management interface designed around progress visibility and task clarity.",
    tags: ["Education", "Dashboards", "Progress states"],
    visual: "learning-bars",
    repoUrl: "",
    liveUrl: "",
  },
  {
    key: "gutenberg",
    name: "Gutenberg Reader",
    description: "Reading interface concept for browsing structured literary content and collections.",
    tags: ["Reader", "Books", "Interface concept"],
    visual: "book-spines",
    repoUrl: "",
    liveUrl: "",
  },
] as const;

export const featuredProject = projects[0];
export const supportingProjects = [projects[1], projects[2], projects[3], projects[4], projects[5]];
export type AboutLayerTitle = (typeof aboutLayers)[number]["title"];
export type SkillCategory = (typeof skillGroups)[number]["category"];
export type SupportingProject = (typeof supportingProjects)[number];

export const experiences = [
  {
    role: "Founder & Product Engineer",
    company: "The Agile Labs",
    location: "Beirut, Lebanon",
    dates: "Oct 2023 – Present",
    symbol: "LR",
    accent: "amber",
    bullets: [
      "Identified a gap in Lebanese water distribution and built TRX — a production SaaS processing 3k+ monthly transactions with a paying client.",
      "Designed for offline-first field use, dual-currency financial accuracy, and end-to-end test coverage.",
      "Founded The Agile Labs as an agency delivering operational systems to utility distributors in Lebanon.",
    ],
  },
  {
    role: "Full Stack Intern",
    company: "I-Stay",
    location: "Remote",
    dates: "May 2024 – Aug 2024",
    symbol: "IS",
    accent: "blue",
    bullets: [
      "Selected from 90+ applicants for a competitive three-month engineering program.",
      "Built an AI-powered career assessment platform with admin portal and chatbot integration.",
      "Scraped and structured 100k+ legal documents into a searchable full-text database.",
    ],
  },
  {
    role: "Full Stack Developer",
    company: "Codi-Tech",
    location: "Lebanon",
    dates: "Nov 2022 – Jun 2023",
    symbol: "CT",
    accent: "amber",
    bullets: [
      "Delivered four full-stack applications in Agile teams of up to six people, from design to deployment.",
      "Contributed across CarsLB, Alumni Portfolio CMS, LMS, and Gutenberg Reader.",
      "Worked across user flows, product implementation, and release preparation.",
    ],
  },
  {
    role: "Coding Mentor",
    company: "CodeBrave",
    location: "Lebanon",
    dates: "Jul 2023 – Present",
    symbol: "CB",
    accent: "green",
    bullets: [
      "Trained 200+ students aged 10–18 in JavaScript, Python, OOP, and robotics.",
      "Collaborated with UNICEF and Al Ghurair Foundation to deliver structured curricula.",
      "Balanced teaching clarity with practical, project-based technical learning.",
    ],
  },
] as const;

export const skillGroups = [
  {
    category: "Languages",
    short: "Lang",
    description: "Core languages across every project. TypeScript throughout TRX; Python for data processing and scripting.",
    skills: [
      { name: "JavaScript ES6+", primary: true },
      { name: "TypeScript", primary: true },
      { name: "Python", primary: false },
      { name: "PHP", primary: false },
    ],
  },
  {
    category: "Frontend",
    short: "FE",
    description: "Built TRX's full frontend in React + TypeScript — PWA shell, IndexedDB offline storage, and animated UI.",
    skills: [
      { name: "React", primary: true },
      { name: "TypeScript", primary: true },
      { name: "Tailwind CSS", primary: true },
      { name: "Next.js", primary: true },
      { name: "Redux", primary: false },
      { name: "PWA", primary: false },
      { name: "IndexedDB", primary: false },
    ],
  },
  {
    category: "Backend",
    short: "BE",
    description: "Designed and built TRX's API layer, sync architecture, and all five of my production backends.",
    skills: [
      { name: "Node.js", primary: true },
      { name: "Express.js", primary: true },
      { name: "REST APIs", primary: true },
      { name: "Spring Boot", primary: false },
      { name: "Laravel", primary: false },
    ],
  },
  {
    category: "Databases",
    short: "DB",
    description: "MongoDB powers TRX with aggregation pipelines for real-time financial totals. MySQL used at Codi-Tech.",
    skills: [
      { name: "MongoDB", primary: true },
      { name: "MySQL", primary: false },
    ],
  },
  {
    category: "Testing",
    short: "QA",
    description: "Playwright covers TRX's full financial and sync flows end-to-end. Jest for isolated business logic.",
    skills: [
      { name: "Playwright", primary: true },
      { name: "Jest", primary: false },
    ],
  },
  {
    category: "Tooling",
    short: "Tool",
    description: "Design-to-code in Figma, API development in Postman, version control across GitHub and GitLab.",
    skills: [
      { name: "Git", primary: true },
      { name: "Figma", primary: true },
      { name: "Postman", primary: true },
      { name: "GitHub", primary: false },
      { name: "GitLab", primary: false },
      { name: "Swagger", primary: false },
    ],
  },
  {
    category: "Concepts",
    short: "Ops",
    description: "Offline-first architecture is the core of TRX. Agile delivery across Codi-Tech and I-Stay.",
    skills: [
      { name: "Offline-first", primary: true },
      { name: "Agile", primary: true },
      { name: "OOP", primary: true },
      { name: "SOLID", primary: false },
    ],
  },
] as const;

export const trxPainPoints = [
  {
    title: "Manual reconciliation overhead",
    description: "Teams were losing hours every day comparing paper records against spreadsheets.",
    severity: "warning",
  },
  {
    title: "Extra staffing for admin work",
    description: "Operational cost rose because manual workflows required support roles to keep up.",
    severity: "danger",
  },
  {
    title: "Hidden weekly losses",
    description: "Small accounting mismatches accumulated quietly and obscured the true business result.",
    severity: "danger",
  },
  {
    title: "Recurring customer disputes",
    description: "Paper-first delivery records made it hard to resolve whether customers had paid and in which currency.",
    severity: "warning",
  },
  {
    title: "Dual-currency complexity",
    description: "A moving USD/LBP rate made historical correctness fragile in any naïve accounting model.",
    severity: "danger",
  },
  {
    title: "Owner burnout",
    description: "The owner absorbed operational ambiguity personally instead of relying on trustworthy system output.",
    severity: "warning",
  },
] as const;

export const trxDecisions = [
  {
    problem: "Lebanon's USD/LBP rate changes constantly, so recalculating historical totals from a live rate makes past invoices wrong retroactively.",
    decision: "Snapshot the exchange rate into each transaction at write time so historical records remain immutable regardless of later rate movement.",
  },
  {
    problem: "Drivers sync in unpredictable order when they regain connectivity, and partial writes can corrupt totals if aggregations are stored too early.",
    decision: "Compute financial aggregations on read with MongoDB pipelines so the correct result emerges regardless of sync order.",
  },
  {
    problem: "Drivers lose connectivity mid-route constantly, which makes network-dependent workflows unusable in the field.",
    decision: "Run all screens from IndexedDB and use a custom sync queue with reconnection debounce and a concurrent-sync guard.",
  },
  {
    problem: "Deactivating customers or restoring data can corrupt delivery sequence numbering and allow duplicate shipment runs.",
    decision: "Use partial indexing on active customers only and enforce a compound database constraint for duplicate shipment prevention.",
  },
  {
    problem: "Financial logic and offline sync are critical, but live-database testing is slow, flaky, and environment-dependent.",
    decision: "Keep business logic unit-testable without infrastructure and cover end-to-end financial and sync flows with Playwright.",
  },
] as const;

export const trxResults = [
  { value: 3, suffix: "hrs", label: "saved per day" },
  { value: 1200, prefix: "$", label: "saved per month in salaries" },
  { value: 0, suffix: "", label: "missed deliveries" },
  { value: 3000, suffix: "+", label: "transactions per month" },
] as const;

export const trxStackLayers = [
  {
    title: "Testing",
    items: ["Playwright (E2E)", "Jest (unit)"],
  },
  {
    title: "Frontend",
    items: ["React", "TypeScript", "Tailwind", "PWA", "IndexedDB"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Express.js", "REST APIs"],
  },
  {
    title: "Database",
    items: ["MongoDB", "Aggregation pipelines"],
  },
  {
    title: "Infrastructure",
    items: ["Offline-first", "Sync queue", "Multi-tenant"],
  },
] as const;

export const contactLinks = {
  email: "mailto:lina@theagilelabs.com",
  emailLabel: "lina@theagilelabs.com",
  linkedin: "https://www.linkedin.com/in/linarawas",
  linkedinLabel: "LinkedIn",
  cv: "#experience",
};

export const siteMeta = {
  title: "Lina Rawas — Full Stack Engineer & Founder",
  description:
    "Full stack engineer and founder of The Agile Labs. Built TRX, a production SaaS for Lebanese water distributors. Product thinking. Engineering depth. Shipped.",
  domain: "portfolio.theagilelabs.com",
};
