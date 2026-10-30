export interface ProjectItem {
  id: number;
  short: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  highlights: string[];
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  accentColor: string;
  secondaryColor: string;
  architecturePattern: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  subtitle: string;
  period: string;
  bullets: string[];
  tech: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  event: string;
  metric: string;
  detail: string;
  certificateUrl?: string;
  kind: 'patent' | 'hackathon' | 'certification' | 'coding';
}

export interface StationWaypoint {
  id: string;
  index: string;
  label: string;
  shortTitle: string;
  progress: number;
  zTarget: number;
  subtitle: string;
}

export const RESUME_DATA = {
  name: "Yashasvi Singh Rajput",
  brandMark: "Yashasvi",
  role: "AI & Machine Learning Engineer · Full-Stack Developer",
  tagline:
    "Transforming complex AI, computer vision & RAG architectures into immersive, real-world software systems.",
  location: "Bhopal, Madhya Pradesh, India, 462022",
  phone: "+91 9131206100",
  email: "ryashasvi77@gmail.com",
  linkedinUrl: "https://www.linkedin.com/in/yashasvi-s-rajput-492154319",
  githubUrl: "https://github.com/YashasviRajput13",
  resumePdfPath: "/assets/aistudio/Yashasvi_673c9656.pdf",

  summary:
    "Computer Science Engineering undergraduate (AI & ML) with a strong base in algorithms, data structures and object-oriented design, driven by solving real-world problems through technology. Built AI-based applications in Python and Java, applied computer vision with OpenCV, and contributed to a published patent. Recognised at national-level hackathons for rapid prototyping and teamwork. Eager to contribute to defence-oriented research in intelligent systems, surveillance and secure technologies.",

  aboutBrushLines: [
    "I'm Yashasvi Singh Rajput,",
    "an AI & ML engineer",
    "passionate about",
    "intelligent systems,",
    "computer vision &",
    "full-stack architecture."
  ],

  education: {
    institution: "Oriental Institute of Science and Technology",
    location: "Bhopal, India",
    degree: "B.Tech in CSE (Artificial Intelligence & Machine Learning)",
    period: "Sep 2024 – Present",
    cgpa: "8.35",
    coursework: [
      "Data Structures and Algorithms",
      "Object-Oriented Programming",
      "Database Management Systems",
      "Web Technology",
      "Project Management"
    ],
    researchInterests: [
      "Defence-Oriented Intelligent Systems",
      "Computer Vision & Autonomous Surveillance",
      "RAG & Agentic AI Workflows",
      "Secure Distributed Systems"
    ]
  },

  heroMetrics: [
    { value: "8.35", label: "B.Tech CSE (AI & ML) CGPA", context: "Oriental Institute of Science & Tech" },
    { value: "Patent", label: "Published Indian Patent", context: "AI-Based Drone for Crop Monitoring" },
    { value: "Top 3", label: "2nd Runner-Up Tech Sprint '26", context: "Google Developer Hackathon · 100+ Teams" },
    { value: "Top 15K", label: "Google's The Big Code 2026", context: "Qualified Round 1 National Ranking" }
  ],

  skillPillars: [
    {
      lanternTitleTop: "AI, ML &",
      lanternTitleBottom: "Computer Vision",
      category: "Machine Learning & Intelligent Systems",
      skills: [
        "Python",
        "OpenCV",
        "NumPy",
        "Pandas",
        "RAG Pipelines",
        "Agentic AI",
        "Google Gemini API",
        "Groq API",
        "Sentence Transformers",
        "pgvector"
      ]
    },
    {
      lanternTitleTop: "Backend &",
      lanternTitleBottom: "Core Systems",
      category: "Backend Engineering & Databases",
      skills: [
        "Java",
        "Core Java",
        "C++",
        "Spring Boot",
        "Spring MVC",
        "FastAPI",
        "RESTful APIs",
        "Collections Framework",
        "Multithreading",
        "MySQL & PostgreSQL"
      ]
    },
    {
      lanternTitleTop: "Full-Stack &",
      lanternTitleBottom: "Cloud Infra",
      category: "Frontend, Frameworks & Developer Tools",
      skills: [
        "React.js",
        "Next.js",
        "TypeScript",
        "JavaScript (ES6)",
        "Tailwind CSS",
        "Supabase",
        "Firebase",
        "Docker",
        "Git & GitHub",
        "IntelliJ IDEA & VS Code"
      ]
    }
  ],

  experiences: [
    {
      id: "gdg-oist",
      role: "Organizer & Technical Team Member",
      organization: "Google Developer Groups (GDG) OIST",
      subtitle: "Official Campus Developer Community · Bhopal, India",
      period: "2025 – Present",
      bullets: [
        "Designed and built the official GDG OIST website in React and Tailwind CSS over 2 months as one of 2 developers, shipping a responsive, cross-device site.",
        "Integrated Supabase and Firebase to power a CMS managing 5–6 pages of dynamic content (events, team info), enabling non-technical team members to update content without code changes."
      ],
      tech: ["React", "Tailwind CSS", "Supabase", "Firebase", "No-Code CMS"],
      liveUrl: "https://gdg-oist.vercel.app/",
      githubUrl: "https://github.com/YashasviRajput13/gdg-oist.git"
    },
    {
      id: "btg-cii",
      role: "AI/ML Contributor (Tender Live)",
      organization: "BTG by CII",
      subtitle: "Confederation of Indian Industry · AI Procurement Workflows",
      period: "2025 – 2026",
      bullets: [
        "Developed AI-powered tender discovery and document analysis workflows using Agentic AI and Google Gemini.",
        "Implemented tender data extraction to identify deadlines, budgets, and eligibility criteria using Python, BeautifulSoup, FastAPI, Google Gemini, and Agentic AI."
      ],
      tech: ["Python", "FastAPI", "Google Gemini", "Agentic AI", "BeautifulSoup"],
      githubUrl: "https://github.com/YashasviRajput13/Tender_Live.git"
    }
  ] as ExperienceItem[],

  projects: [
    {
      id: 0,
      short: "01",
      title: "Tender Live",
      subtitle: "Agentic AI Tender Discovery & Extraction",
      category: "BTG by CII · Document Intelligence",
      image: "/assets/aistudio/image_9d47e27b.png",
      description:
        "AI-powered tender discovery and document analysis workflows using Agentic AI and Google Gemini to extract deadlines, budgets, and eligibility criteria.",
      highlights: [
        "Developed AI-powered tender discovery and multi-document analysis workflows using Agentic AI and Google Gemini.",
        "Implemented automated tender data extraction to identify deadlines, budgets, and eligibility criteria from unstructured procurement notices.",
        "Engineered high-throughput scraping and FastAPI orchestration pipelines with BeautifulSoup and structured JSON schema validation."
      ],
      techStack: ["Python", "FastAPI", "Google Gemini", "Agentic AI", "BeautifulSoup"],
      githubUrl: "https://github.com/YashasviRajput13/Tender_Live.git",
      accentColor: "#A78BFA",
      secondaryColor: "#818CF8",
      architecturePattern: "BeautifulSoup Crawler → FastAPI Pipeline → Agentic Gemini Extractor → Structured Procurement Feed"
    },
    {
      id: 1,
      short: "02",
      title: "Automated Email",
      subtitle: "Automated Email Writer & Gmail Extension",
      category: "Java Spring Boot · Chrome Extension",
      image: "/assets/aistudio/image_8c442383.png",
      description:
        "An AI-powered tool to generate context-aware email replies with customizable tones, integrating Groq AI directly inside Gmail via a Chrome extension.",
      highlights: [
        "Built an AI-powered tool to generate context-aware email replies with customizable professional, concise, and friendly tones.",
        "Integrated Groq AI with Gmail using a custom Chrome extension for one-click automatic reply generation inside the compose toolbar.",
        "Containerized the Java Spring Boot REST backend and React dashboard with Docker for reproducible deployment."
      ],
      techStack: ["Java", "Spring Boot", "React", "Groq API", "Chrome Extension", "Docker"],
      githubUrl: "https://github.com/YashasviRajput13/Automated-email-writer",
      accentColor: "#34D399",
      secondaryColor: "#10B981",
      architecturePattern: "Gmail DOM Observer → Spring Boot REST Controller → Groq LPU Inference → Streamed Compose Injection"
    },
    {
      id: 2,
      short: "03",
      title: "Dev-OS",
      subtitle: "AI-Powered Codebase Intelligence Platform",
      category: "RAG · Semantic Code Retrieval",
      image: "/assets/aistudio/image_b0f9c7c0.png",
      description:
        "Built an AI-powered codebase intelligence platform using RAG and semantic search for context-aware code retrieval across live repositories.",
      highlights: [
        "Built an AI-powered codebase intelligence platform using Retrieval-Augmented Generation (RAG) and semantic search for context-aware code retrieval.",
        "Indexes and understands live repositories through AST-aware parsing, intelligent chunking, and dense vectorization in PostgreSQL pgvector.",
        "Combines Sentence Transformers embeddings with Google Gemini and Groq inference for ultra-low-latency architectural Q&A."
      ],
      techStack: ["Python", "FastAPI", "Next.js", "PostgreSQL", "pgvector", "Sentence Transformers", "RAG", "Gemini", "Groq"],
      githubUrl: "https://github.com/YashasviRajput13/DevOs_Project.git",
      accentColor: "#719CED",
      secondaryColor: "#38BDF8",
      architecturePattern: "AST Chunker → Sentence Transformers → pgvector Cosine Search → Gemini/Groq Synthesis"
    },
    {
      id: 3,
      short: "04",
      title: "Citizen Platform",
      subtitle: "AI-Powered Citizen Services Portal",
      category: "GovTech · Conversational AI Portal",
      image: "/assets/aistudio/image_b9ab0c5c.png",
      description:
        "A conversational AI portal for easy access to government schemes and procedures, helping citizens discover relevant public services faster.",
      highlights: [
        "Built a conversational AI portal for easy access to government schemes, eligibility criteria, and application procedures.",
        "Helped users find relevant public services faster, significantly reducing time spent searching fragmented portals.",
        "Implemented a secure contact and notification system using NodeMailer for citizen feedback and scheme update alerts."
      ],
      techStack: ["React.js", "TypeScript", "Vite", "NodeMailer", "HTML/CSS", "Vercel"],
      githubUrl: "https://github.com/YashasviRajput13/CivicAI.git",
      liveUrl: "https://civic-ai-gules.vercel.app/",
      accentColor: "#F59E0B",
      secondaryColor: "#FBBF24",
      architecturePattern: "Conversational Intent Matcher → Scheme Knowledge Graph → NodeMailer Dispatch → Vercel Edge"
    },
    {
      id: 4,
      short: "05",
      title: "Face Detector",
      subtitle: "Face Detection & Autonomous Crop Drone Vision",
      category: "OpenCV · Surveillance & Published Patent",
      image: "/assets/aistudio/image_4ebc1cc4.png",
      description:
        "Real-time face detection system for images and video streams using Python and OpenCV, paired with patented AI-based drone crop monitoring research.",
      highlights: [
        "Developed a real-time face detection and tracking system for still images and live video streams using Python, OpenCV, and computer vision cascades.",
        "Contributed to a published Indian Patent on an AI-Based Drone for Crop Monitoring combining aerial computer vision with agricultural telemetry.",
        "Engineered frame preprocessing, histogram equalization, and bounding-box confidence filtering for low-light surveillance."
      ],
      techStack: ["Python", "OpenCV", "Computer Vision", "NumPy", "Aerial Telemetry"],
      githubUrl: "https://github.com/YashasviRajput13/Tech-Sim-Plus-Internship.git",
      certificateUrl: "https://www.linkedin.com/in/yashasvi-s-rajput-492154319/overlay/Certifications/454637604/treasury/",
      accentColor: "#F43F5E",
      secondaryColor: "#FB7185",
      architecturePattern: "Video Frame Buffer → OpenCV Grayscale & Haar/DNN Cascade → Spatial Localization → Telemetry Alert"
    },
    {
      id: 5,
      short: "06",
      title: "GDG OIST Website",
      subtitle: "Official GDG Campus Website & Dynamic CMS",
      category: "Community Platform · Full-Stack CMS",
      image: "/assets/aistudio/image_862d2828.png",
      description:
        "Official Google Developer Groups OIST platform featuring a custom Supabase & Firebase CMS powering 5–6 pages of live events and team rosters.",
      highlights: [
        "Designed and built the official GDG OIST website in React and Tailwind CSS over 2 months as one of 2 lead developers.",
        "Integrated Supabase and Firebase to power a headless CMS managing 5–6 pages of dynamic content (events, speaker lineups, team info).",
        "Empowered non-technical community organizers to publish events and update rosters in real time without code changes."
      ],
      techStack: ["React.js", "Tailwind CSS", "Supabase", "Firebase", "Responsive UI"],
      githubUrl: "https://github.com/YashasviRajput13/gdg-oist.git",
      liveUrl: "https://gdg-oist.vercel.app/",
      accentColor: "#60A5FA",
      secondaryColor: "#3B82F6",
      architecturePattern: "React SPA + Tailwind UI → Supabase Real-Time Tables & Firebase Auth → Zero-Code Admin CMS"
    }
  ] as (ProjectItem & { image?: string; certificateUrl?: string })[],

  achievements: [
    {
      id: "patent-drone",
      title: "Indian Patent Published — AI-Based Drone for Crop Monitoring",
      event: "Intellectual Property India · Published Patent",
      metric: "Published Patent",
      detail: "Co-invented an intelligent aerial drone system leveraging computer vision for automated crop health diagnostics and precision surveillance.",
      certificateUrl: "https://www.linkedin.com/in/yashasvi-s-rajput-492154319/overlay/Certifications/454637604/treasury/",
      kind: "patent"
    },
    {
      id: "tech-sprint-26",
      title: "2nd Runner-Up — Google Developer Hackathon (Tech Sprint ’26)",
      event: "Google Developer Hackathon · 100+ Competing Teams",
      metric: "2nd Runner-Up",
      detail: "Podium finish among 100+ engineering teams for rapid AI architecture prototyping, technical execution, and live product demonstration.",
      kind: "hackathon"
    },
    {
      id: "manit-hackathon",
      title: "Top 21 Finalist from 1,000+ Applicants — MANIT Bhopal Hackathon",
      event: "NIT Bhopal National Hackathon · 36-Hour Sprint",
      metric: "Top 2% (21 / 1,000+)",
      detail: "Selected among 21 elite teams nationwide from 1,000+ applicants; architected and shipped an AI-powered Event Recommendation System in 36 hours.",
      kind: "hackathon"
    },
    {
      id: "hack-and-make",
      title: "National Selection — Hack&Make at MP Startup Summit 2026",
      event: "Madhya Pradesh Startup Summit 2026",
      metric: "Selected / 10,000+ Entries",
      detail: "Recognized among 10,000+ national entries for high-impact engineering innovation and scalable prototype design.",
      kind: "hackathon"
    },
    {
      id: "google-big-code",
      title: "Qualified Round 1 — Google’s The Big Code 2026",
      event: "Google National Competitive Programming & AI Challenge",
      metric: "Top 15,000 Nationwide",
      detail: "Ranked among the Top 15,000 participants across India demonstrating strong algorithmic problem-solving and data structure mastery.",
      kind: "coding"
    },
    {
      id: "nptel-java",
      title: "NPTEL Certified Java Developer — Silver Badge (87%)",
      event: "NPTEL / IIT Certification in Core & Object-Oriented Java",
      metric: "87% · Silver Badge",
      detail: "Awarded Silver Badge certification with an 87% score covering Core Java, Multithreading, Collections Framework, and Exception Handling.",
      certificateUrl: "https://www.linkedin.com/in/yashasvi-s-rajput-492154319/overlay/Certifications/1259085886/treasury/",
      kind: "certification"
    },
    {
      id: "tuf-sde-sheet",
      title: "Winner — SDE Sheet Challenge by Takeuforward",
      event: "Striver's SDE Sheet Algorithmic Mastery Challenge",
      metric: "Challenge Winner",
      detail: "Completed comprehensive Data Structures & Algorithms problem sets across graphs, dynamic programming, trees, and greedy paradigms.",
      kind: "coding"
    }
  ] as AchievementItem[],

  waypoints: [
    {
      id: "hero",
      index: "00",
      label: "Sanctuary",
      shortTitle: "Torii Sanctuary",
      progress: 0.0,
      zTarget: -20,
      subtitle: "Yashasvi Singh Rajput · AI & ML Portfolio"
    },
    {
      id: "about",
      index: "01",
      label: "About",
      shortTitle: "About & Education",
      progress: 0.22,
      zTarget: -100,
      subtitle: "B.Tech CSE (AI & ML) · OIST Bhopal · CGPA 8.35"
    },
    {
      id: "skills",
      index: "02",
      label: "Skills & Experience",
      shortTitle: "Skills & Experience",
      progress: 0.44,
      zTarget: -200,
      subtitle: "GDG OIST · BTG by CII · Python, Java & AI Stack"
    },
    {
      id: "projects",
      index: "03",
      label: "Projects",
      shortTitle: "3D Project Ring",
      progress: 0.66,
      zTarget: -350,
      subtitle: "Interactive 360° Sakura Island Showcase"
    },
    {
      id: "achievements",
      index: "04",
      label: "Honours",
      shortTitle: "Patent & Honours",
      progress: 0.83,
      zTarget: -425,
      subtitle: "Published Patent · National Hackathon Podiums"
    },
    {
      id: "connect",
      index: "05",
      label: "Connect",
      shortTitle: "Connect Raft",
      progress: 0.98,
      zTarget: -475,
      subtitle: "Let's Build Something Impressive"
    }
  ] as StationWaypoint[]
};
