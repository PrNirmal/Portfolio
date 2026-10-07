import documentAnalyserShot from "@/assets/document_analyser.png";
import interviewShot from "@/assets/interview.png";

export interface ProjectItem {
  id: string;
  number: string;
  title: string;
  category: string;
  technologies: string[];
  description: string;
  screenshot: string;
  liveDemo?: string;
  github?: string;
  statusNote?: string;
}

export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  subtitle: string;
  description: string;
  capabilities: string[];
  technologies?: string[];
  isCurrent?: boolean;
}

export interface TechItem {
  name: string;
  category: "Languages" | "AI / ML" | "Frameworks" | "Database" | "Tools" | "Practices";
  isConcept?: boolean;
  officialLogo?: string;
}

export const PERSONAL_INFO = {
  name: "Nirmal Kumar P R",
  location: "Chennai, India",
  email: "prnirmalramesh04@gmail.com",
  phone: "+91 77086 19166",
  phoneRaw: "+917708619166",
  github: "https://github.com/PrNirmal",
  linkedin: "https://www.linkedin.com/in/prnirmal/",
  resumeUrl: "https://drive.google.com/file/d/1PCENAqA9ht4QgQ61kiqDuTeeCiOldX1r/view?usp=sharing",
  resumeLocalFallback: "/resume/Nirmal-Kumar-Resume.pdf",
  headline: "Building software and intelligent applications that solve real problems.",
  subheadline:
    "Software developer turning generative AI into reliable, shipped products: retrieval, agents, and the SaaS around them.",
  role: "JUNIOR AI ENGINEER",
  copyrightYear: "2026",
};

export const HERO_ROLES = [
  "DEVELOPER",
  "JUNIOR AI ENGINEER",
  "AI APPLICATION DEVELOPER",
  "SOFTWARE DEVELOPER",
  "GENERATIVE AI",
];

export const WHAT_I_BUILD_ITEMS = [
  {
    number: "01",
    title: "SOFTWARE DEVELOPMENT",
    description: "Web, backend and mobile application development.",
    items: ["WEB", "BACKEND", "MOBILE", "API"],
    detail: "Building production-grade user interfaces, resilient server microservices, and cross-platform mobile apps with strict architectural integrity.",
  },
  {
    number: "02",
    title: "AI APPLICATIONS",
    description: "LLM-powered applications and Generative AI systems.",
    items: ["LLM", "RAG", "PROMPT", "AI"],
    detail: "Synthesizing deep semantic intelligence with modern web apps, utilizing semantic embeddings, vector stores, and structured prompting.",
  },
  {
    number: "03",
    title: "INTELLIGENT AUTOMATION",
    description: "AI-assisted workflows and business automation.",
    items: ["WORKFLOW", "AUTOMATION", "INTELLIGENCE"],
    detail: "Transforming high-friction business operations into automated event-driven pipelines with built-in validation and observability.",
  },
  {
    number: "04",
    title: "ENTERPRISE SOFTWARE",
    description: "Software applications, SaaS products and business systems.",
    items: ["SaaS", "SYSTEMS", "DATA", "OPERATIONS"],
    detail: "Engineering enterprise SaaS features, secure role-based access controls, relational data schemas, and optimized business logic.",
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: "rag-document-assistant",
    number: "01",
    title: "AI DOCUMENT ASSISTANT",
    category: "RAG / GENERATIVE AI / APPLICATION",
    technologies: ["Python", "FastAPI", "React", "ChromaDB", "LLM API"],
    description: "End-to-end RAG application for document-based question answering.",
    screenshot: documentAnalyserShot,
    liveDemo: "https://rag-lab-ui.onrender.com/",
    github: "https://github.com/PrNirmal/rag-lab/tree/main/rag-01-document-qa",
  },
  {
    id: "interview-analyser",
    number: "02",
    title: "INTERVIEW ANALYSER",
    category: "GENERATIVE AI / RESEARCH INTELLIGENCE",
    technologies: ["React", "TypeScript", "FastAPI", "LLM API"],
    description:
      "Analyzes expert interviews against a research guide to surface cross-market insights backed by verified quote citations.",
    screenshot: interviewShot,
    github: "https://github.com/PrNirmal/Interview_analyser",
  },
  {
    id: "diabetic-retinopathy",
    number: "03",
    title: "DIABETIC RETINOPATHY SEGMENTATION",
    category: "MACHINE LEARNING / COMPUTER VISION",
    technologies: ["Python", "TensorFlow", "Swin Transformer", "U-Net"],
    description: "Swin Transformer-based medical image segmentation system.",
    screenshot: "/projects/project-02.jpg",
    github: "https://github.com/PrNirmal/Diabetic-retinopathy",
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    period: "JUNE 2025 — PRESENT",
    role: "JUNIOR AI ENGINEER",
    company: "BlastOut Solutions",
    subtitle: "SOFTWARE DEVELOPMENT · AI APPLICATIONS · ENTERPRISE SaaS",
    description:
      "Worked on enterprise SaaS products and AI-powered applications as a software developer and AI engineer.",
    capabilities: [
      "Software Development",
      "Enterprise SaaS",
      "Backend",
      "Web",
      "Mobile",
      "AI Applications",
      "LLM Integration",
      "RBAC",
      "Testing",
      "Performance Optimization",
    ],
    isCurrent: true,
  },
  {
    period: "FEB 2025 — MAY 2025",
    role: "APP & WEB DEVELOPMENT INTERN",
    company: "BlastOut Solutions",
    subtitle: "MOBILE, WEB & BACKEND DEVELOPMENT",
    description:
      "Worked across mobile, web and backend development while contributing to production applications.",
    capabilities: [
      "Mobile Development",
      "Web Development",
      "Backend Development",
      "Automated Testing",
      "Firebase Integration",
    ],
    technologies: ["Flutter", "React", "FastAPI", "Firebase", "Playwright"],
    isCurrent: false,
  },
];

export const TECH_STACK: TechItem[] = [
  // Languages
  { name: "Python", category: "Languages", officialLogo: "python" },
  { name: "JavaScript", category: "Languages", officialLogo: "javascript" },
  { name: "TypeScript", category: "Languages", officialLogo: "typescript" },
  { name: "SQL", category: "Languages", officialLogo: "sql" },

  // AI / ML
  { name: "Generative AI", category: "AI / ML", officialLogo: "openai", isConcept: true },
  { name: "LLMs", category: "AI / ML", officialLogo: "huggingface", isConcept: true },
  { name: "Prompt Engineering", category: "AI / ML", officialLogo: "anthropic", isConcept: true },
  { name: "AI Agent Development", category: "AI / ML", officialLogo: "agent", isConcept: true },
  { name: "LangChain", category: "AI / ML", officialLogo: "langchain" },
  { name: "LangGraph", category: "AI / ML", officialLogo: "langgraph" },
  { name: "TensorFlow", category: "AI / ML", officialLogo: "tensorflow" },
  { name: "NLP", category: "AI / ML", officialLogo: "spacy", isConcept: true },
  { name: "RAG", category: "AI / ML", officialLogo: "chromadb", isConcept: true },

  // Frameworks / Development
  { name: "FastAPI", category: "Frameworks", officialLogo: "fastapi" },
  { name: "React", category: "Frameworks", officialLogo: "react" },
  { name: "Flutter", category: "Frameworks", officialLogo: "flutter" },
  { name: "Firebase", category: "Frameworks", officialLogo: "firebase" },
  { name: "REST APIs", category: "Frameworks", officialLogo: "postman", isConcept: true },

  // Database
  { name: "SQL", category: "Database", officialLogo: "sql" },
  { name: "Firebase Firestore", category: "Database", officialLogo: "firestore" },
  { name: "PostgreSQL", category: "Database", officialLogo: "postgresql" },

  // Tools
  { name: "Playwright", category: "Tools", officialLogo: "playwright" },
  { name: "Git", category: "Tools", officialLogo: "git" },
  { name: "GitHub", category: "Tools", officialLogo: "github" },
  { name: "Figma", category: "Tools", officialLogo: "figma" },

  // Practices
  { name: "SDLC", category: "Practices", officialLogo: "sdlc", isConcept: true },
  { name: "Agile Development", category: "Practices", officialLogo: "jira", isConcept: true },
  { name: "Version Control", category: "Practices", officialLogo: "versioncontrol", isConcept: true },
  { name: "CI/CD Concepts", category: "Practices", officialLogo: "githubactions", isConcept: true },
];

export const EDUCATION = {
  degree: "B.E. COMPUTER SCIENCE AND ENGINEERING",
  institution: "University College of Engineering, Villupuram",
  period: "2021 — 2025",
  cgpa: "7.98",
};

export const CERTIFICATIONS = [
  {
    title: "Python Programming",
    issuer: "BlastOut Solutions",
  },
  {
    title: "The Complete 2024 Web Development Bootcamp",
    issuer: "Udemy",
  },
];

export const ABOUT_CONTENT = {
  headline: "I like turning complicated ideas into systems that actually work.",
  supporting:
    "My work spans software development, AI applications, backend systems, web and mobile applications, and intelligent automation.",
};
