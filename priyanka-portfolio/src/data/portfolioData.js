export const portfolioData = {
  personal: {
    name: "Priyanka Kumari",
    title: "Software Engineer | Full Stack Engineer | MERN and Microservices",
    location: "Bengaluru, India",
    phone: "+91 8292634243",
    email: "priyankasahu.1011@gmail.com",
    linkedin: "https://linkedin.com/in/priyanka-kumari-cse",
    github: "https://github.com/priyankak10",
  },
  summary:
    "Software Engineer with 9+ years of experience delivering enterprise engineering platforms across React frontend, Node.js microservices, and .NET systems. Primary impact includes full ownership of CI Tool WebUI, ownership of core CI Tool backend 4 API services, frontend ownership of APK Infra Client, and end-to-end ownership of PLCPortal. Delivered feature-driven solutions for CI reporting, build orchestration, PR progress, and program visibility in unified operational workflows.",
  skills: {
    languages: ["JavaScript", "Python", "C#"],
    frontend: ["ReactJS", "Material UI", "Highcharts"],
    backend: ["Node.js", "Express.js", "REST APIs", "Microservices"],
    platforms: ["Cloud Foundry", "Kubernetes", "CI/CD", "Git"],
    dataAndQuality: ["MongoDB", "Redis", "Protractor", "Unit Testing"],
    automations: [
      "Jenkins",
      "GitHub Copilot",
      "python",
      "Automation Scripting",
    ],
  },
  sidebar: {
    coreStack: [
      "JavaScript, ReactJS, NodeJS",
      "Python, C#",
      "Automations",
      "Material UI, Highcharts",
      "REST APIs, Microservices",
    ],
    engineeringTools: [
      "GitHub Copilot",
      "Git and CI/CD workflows",
      "Cloud Foundry",
      "Kubernetes and Docker",
      "Automation scripting",
    ],
    strengths: [
      "End-to-end ownership",
      "AI-accelerated implementation",
      "Reliable production delivery",
      "Fast adaptation to new tools",
    ],
  },
  experience: [
    {
      company: "Intel Technology India Pvt. Ltd.",
      role: "Software Engineer",
      startDate: "Dec 2016",
      endDate: "Present",
      location: "Bengaluru, India",
      highlights: [
        "Implemented and Owned the CI Tool WebUI and key backend services in a distributed platform, delivering end-to-end features from requirement analysis through production rollout.",
        "Built high-usage product workflows for reservation, task execution, and build orchestration, including quick-build, retrigger and prefill, and role-based operational actions.",
        "Built a Python and Jenkins automation workflow to generate and publish custom builds based on specific event triggers and configuration requirements",
        "Implemented service-layer features across PR, program, build, and queue domains with robust APIs, filterable queries, validation controls, health metrics, and event publication.",
        "Increased platform performance with Redis caching improvements in lifecycle-tracking applications.",
        "Led end-to-end migration of all WebUI deployments from Cloud Foundry to self-hosted Kubernetes with common gateway, including exploration, pre-production testing, and final rollout.",
        "Improved production stability by resolving edge cases in filtering logic, task forms, table behavior, reservation paths, and API request handling.",
        "Accelerated implementation using GitHub Copilot for scaffolding and refactoring, backed by review and testing discipline.",
      ],
    },
  ],
  keyOwnership: [
    {
      area: "Kubernetes Migration (Cloud Foundry to Self-Hosted)",
      impact: [
        "Led end-to-end exploration, pre-production testing, and production migration of WebUI deployments.",
        "Improved scalability, deployment consistency, and operational control through standardized cluster and gateway patterns.",
      ],
    },
    {
      area: "CI Tool WebUI (Full Ownership)",
      impact: [
        "Created WebUI from scratch and delivered a baseline aligned to CI reporting and tracking requirements.",
        "Unified program visibility, build pipeline status, live logs, and pull request progress in one interface.",
        "Implemented reservation and task workflows, role-based actions, and reliability improvements for high-usage flows.",
      ],
    },
    {
      area: "CI Tool Backend Microservices (Owned)",
      impact: [
        "api-prs: paginated retrieval, date filters, approval update APIs, and health/metrics endpoints.",
        "api-programs: program discovery, dynamic filtering, domain reviewers APIs, variant model updates, and health/metrics.",
        "api-builds and api-queue: diff-manifest and build APIs, trigger/event publication flows, RC promotion, and request hardening.",
      ],
    },
    {
      area: "APK Infra Client UI (Frontend Ownership)",
      impact: [
        "Owned UI for app-tag based compatibility automation with create, edit, share, and run-test workflows.",
        "Delivered analytics visibility for compatibility, ABI, CPU/memory, Dex2Oat, and AI-related fields.",
        "Implemented install-lite and launch-lite, compare and export capabilities, and recurring production stability fixes.",
      ],
    },
    {
      area: "PLCPortal (.NET Product Lifecycle and Program Tracking)",
      impact: [
        "Full ownership of features, bug fixes, enhancements, and production changes.",
        "Maintained dashboards integrating Jira, DNG, HP ALM, and Zephyr Scale.",
        "Migrated platform from .NET 3 to .NET 5 and replaced end-of-life modules.",
      ],
    },
  ],
  education: [
    {
      degree: "B.Tech, Computer Science",
      institute: "Biju Patnaik University of Technology, Bhubaneshwar",
      year: "2016",
      score: "CGPA: 8.55",
    },
    {
      degree: "Higher Secondary (CBSE)",
      institute: "Gurunanak Higher Secondary School, Ranchi",
      year: "2011",
      score: "72%",
    },
    {
      degree: "Secondary School (CBSE)",
      institute: "Jawahar Navodaya Vidyalaya, Gumla",
      year: "2009",
      score: "91.6%",
    },
  ],
  awardsAndCertifications: [
    "Division Recognition Award (twice)",
    "2nd Prize in company Hackathon and Innovation Fair",
    "Product Assurance and Security White Belt",
  ],
};

const monthIndex = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

export const parseMonthYear = (value) => {
  if (!value || typeof value !== "string") return null;

  const normalized = value.trim().toLowerCase();
  if (normalized === "present") {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  const [monthLabel, yearLabel] = normalized.split(/\s+/);
  const month = monthIndex[monthLabel?.slice(0, 3)];
  const year = Number(yearLabel);

  if (Number.isNaN(year)) return null;

  if (month === undefined) {
    return new Date(year, 0, 1);
  }

  return new Date(year, month, 1);
};

export const formatDateRange = (startDate, endDate) => {
  const endLabel = endDate === "Present" ? "Present" : endDate;
  return `${startDate} - ${endLabel}`;
};

const getDurationLabel = (startDate, endDate) => {
  const start = parseMonthYear(startDate);
  const end = parseMonthYear(endDate || "Present");

  if (!start || !end || end < start) return "";

  const totalMonths =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years > 0 && months > 0) return `${years}y ${months}m`;
  if (years > 0) return `${years}y`;
  return `${months}m`;
};

export const getExperienceTimeline = () => {
  return [...portfolioData.experience]
    .map((item) => ({
      ...item,
      parsedStartDate: parseMonthYear(item.startDate),
      parsedEndDate: parseMonthYear(item.endDate || "Present"),
      dateRangeLabel: formatDateRange(item.startDate, item.endDate),
      durationLabel: getDurationLabel(item.startDate, item.endDate),
    }))
    .sort((a, b) => (b.parsedStartDate || 0) - (a.parsedStartDate || 0));
};
