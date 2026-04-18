export const personal = {
  name: "Karthick Pattabiraman",
  title: "Senior Java Backend Engineer",
  tagline:
    "I build backend systems that don't fall over at scale. 9+ years of shipping microservices, data pipelines, and APIs — from connected vehicle platforms processing 50,000+ daily commands to scheduling systems serving millions.",
  email: "thekarthickraman@gmail.com",
  linkedin: "https://linkedin.com/in/karthick-pattabiraman",
  github: "https://github.com/karthickraman",
};

export const about = {
  paragraphs: [
    "I've spent 9+ years obsessing over how backend systems behave under pressure. Not just whether they work — but whether they work when thousands of requests hit at the same time, when a dependency goes down, or when someone tries to game the system.",
    "Right now, I own 6 microservices powering a scheduling platform used by millions across two major product lines — designing GraphQL APIs, wiring up real-time event pipelines, and running chaos engineering experiments to keep everything resilient.",
    "Before this, I built the command pipeline for a connected vehicle platform — routing 50,000+ daily voice-to-vehicle commands with sub-second latency and processing 2M+ telemetry events per day. That's where I learned what production-grade reliability really means: 99.9% API availability, circuit breakers that actually trip when they should, and caching strategies that cut upstream calls by 60%.",
    "I'm the kind of engineer who'll push back on a design if the tradeoffs don't make sense, but I'll also stay up late to get a migration across the finish line. I care about the craft, but I care more about the outcome.",
  ],
  coreStack: [
    "Java 21",
    "Spring Boot",
    "Python",
    "GraphQL",
    "Apache Kafka",
    "Apache Flink",
    "AWS",
    "Redis",
    "PostgreSQL",
    "Docker & Kubernetes",
  ],
};

export interface SkillCategory {
  category: string;
  skills: string[];
}

export const skills: SkillCategory[] = [
  { category: "Languages", skills: ["Java", "Python", "JavaScript"] },
  {
    category: "Backend & APIs",
    skills: [
      "Spring Boot",
      "Spring Security (OAuth2, SSO)",
      "RESTful APIs",
      "GraphQL (DGS)",
      "MCP",
      "Microservices Architecture",
      "System Design",
    ],
  },
  {
    category: "Architecture",
    skills: [
      "Distributed Systems",
      "Event-Driven Architecture",
      "High Availability",
      "Performance Optimization",
      "Design Patterns",
      "Chaos Engineering",
    ],
  },
  {
    category: "Messaging & Streaming",
    skills: ["Apache Kafka", "Apache Flink", "AWS SNS/SQS"],
  },
  { category: "SQL Databases", skills: ["PostgreSQL", "BigQuery"] },
  {
    category: "NoSQL Databases",
    skills: ["DynamoDB", "Elasticsearch", "Google Datastore"],
  },
  { category: "Caching", skills: ["Redis"] },
  {
    category: "Cloud & Infrastructure",
    skills: [
      "AWS",
      "GCP",
      "Azure",
      "Docker",
      "Kubernetes",
    ],
  },
  {
    category: "Testing & Reliability",
    skills: ["JUnit", "SonarQube", "Chaos Engineering", "Resilience4j", "FMEA"],
  },
  {
    category: "DevOps & Observability",
    skills: [
      "Jenkins",
      "CI/CD",
      "Maven",
      "Splunk",
      "Wavefront",
      "PagerDuty",
      "Git",
    ],
  },
];

export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
  techStack?: string[];
}

export const experiences: Experience[] = [
  {
    company: "Altimetrik",
    role: "Senior Software Engineer",
    period: "Jul 2025 — Present",
    location: "Bangalore",
    description:
      "Owning the backend for a large-scale appointment scheduling platform used by millions of end users across two major product lines at a leading financial technology company.",
    highlights: [
      "Designed and developed core modules of the Schedule Management service — GraphQL APIs, shift management, and the V2 Booking schema now powering scheduling across 2 major product lines via a company-wide API federation.",
      "Eliminated per-appointment authorization overhead in the Calendar Segments API by replacing N sequential auth calls with a single batched call, cutting response time by ~70%.",
      "Built a real-time Apache Flink pipeline fanning out appointment events to 4 downstream systems with standardized retry and error-handling contracts across all Kafka producers.",
      "Led the Java 21 and Elasticsearch 8 migration across 6 services, replacing deprecated clients and resolving security vulnerabilities.",
      "Architected MCP servers for the Appointments and Expert Matching domains, integrating with AI models to enable real-time scheduling queries and expert matching — adopted by 3 internal teams within the first month.",
      "Executed chaos engineering experiments across 6 services — pod deletion, network fault injection, CPU/memory stress testing, and DNS fault tolerance — maintaining compliance with 30-day rolling resilience certification.",
    ],
    techStack: [
      "Java 21",
      "Spring Boot",
      "GraphQL",
      "Apache Flink",
      "Kafka",
      "Redis",
      "DynamoDB",
      "Elasticsearch",
      "Kubernetes",
      "AWS",
    ],
  },
  {
    company: "Altimetrik",
    role: "Senior Software Engineer",
    period: "Jul 2023 — Jul 2025",
    location: "Chennai",
    description:
      "Built microservices for a major automotive OEM's connected vehicle platform — third-party vehicle access, voice-to-vehicle command routing, and real-time telemetry ingestion.",
    highlights: [
      "Built 3 microservices for a third-party vehicle access gateway — Spring OAuth2, VIN-to-vehicle-ID mapping, and JWT token exchange securing ~800 monthly in-car delivery sessions for partners.",
      "Architected the Kafka-based command pipeline routing voice-to-vehicle commands (lock, unlock, remote start) from smart assistants, processing 50,000+ commands daily with sub-second p99 latency.",
      "Implemented Redis caching for vehicle state lookups (door status, location, fuel level), cutting upstream Connected Vehicle Cloud calls by ~60% and reducing response times from 1.2s to under 400ms.",
      "Owned the real-time telemetry ingestion pipeline — Spring Boot consumers processing ~2 million vehicle sensor events/day from Kafka to BigQuery, with Python ETL scripts handling data cleansing and anomaly detection.",
      "Added Resilience4j circuit breakers after running FMEA across 5 failure scenarios, reducing cascading failures by ~40% and maintaining 99.9% API availability with p95 latency < 800ms.",
    ],
    techStack: [
      "Java",
      "Spring Boot",
      "Spring OAuth2",
      "Kafka",
      "Redis",
      "GCP",
      "BigQuery",
      "Python",
      "Resilience4j",
      "Kubernetes",
    ],
  },
  {
    company: "Full Creative (Setmore)",
    role: "Software Engineer",
    period: "May 2019 — Jul 2023",
    location: "Chennai",
    description:
      "Backend engineering lead for Setmore, a SaaS scheduling platform serving small businesses globally.",
    highlights: [
      "Partnered with a major social platform's developer team on a beta integration program to add social media as a booking channel — drove a 45% increase in Booking Page traffic and contributed ~$90K in ad-driven revenue.",
      "Built third-party platform integrations — video conferencing for appointments and a native booking flow inside a call-center platform that improved agent productivity by 50% and cut call costs by 20%.",
      "Eliminated Booking Page API bottlenecks through Redis caching, query optimization, and datastore index tuning, reducing response times by 65%.",
      "Migrated the data layer to support micro-frontend architecture, transforming and validating ~3 million records with Python — enabled 2 new brand launches on the same codebase and sped up release cycles by 70%.",
      "Led a backend API team of 4 — code reviews, mentorship, and release ownership across the scheduling product line.",
    ],
  },
  {
    company: "Full Creative (Setmore)",
    role: "Jr. Software Engineer",
    period: "Jul 2017 — May 2019",
    location: "Chennai",
    description:
      "Early career — focused on core platform performance and reliability improvements.",
    highlights: [
      "Reduced signup API latency by 80%, directly improving new customer onboarding conversion.",
      "Led the migration from GCM to Firebase Cloud Messaging, improving push notification delivery reliability to 98%.",
    ],
  },
];

export interface Project {
  title: string;
  description: string;
  metric: string;
  techTags: string[];
}

export const projects: Project[] = [
  {
    title: "Connected Vehicle Command Pipeline",
    description:
      "Architected the Kafka-based pipeline routing voice-to-vehicle commands from smart assistants to connected vehicles. Lock, unlock, remote start — all processed with sub-second latency. Built the full chain: OAuth2 token exchange, VIN mapping, command routing, and response delivery.",
    metric: "50,000+ commands/day, sub-second p99",
    techTags: ["Kafka", "Spring Boot", "OAuth2", "Redis", "GCP"],
  },
  {
    title: "Scheduling Platform Backend",
    description:
      "Built the entire backend for an enterprise scheduling system — data access layer, GraphQL API surface, shift management with timezone handling, and a booking schema that handles millions of operations. Now serves two major product lines through a federated API gateway.",
    metric: "6 microservices, 2 product lines",
    techTags: ["Java 21", "Spring Boot", "GraphQL", "DynamoDB", "Elasticsearch"],
  },
  {
    title: "Real-Time Telemetry Pipeline",
    description:
      "Owned the ingestion pipeline processing ~2 million vehicle sensor events per day — Spring Boot consumers reading from Kafka, writing to BigQuery, with Python ETL scripts for data cleansing and anomaly detection on raw sensor feeds.",
    metric: "2M+ events/day processed",
    techTags: ["Kafka", "BigQuery", "Python", "Spring Boot"],
  },
  {
    title: "Real-Time Event Pipeline",
    description:
      "Designed a streaming pipeline that takes every booking state change and fans it out to four downstream consumers in real-time — notifications, analytics, engagement, and scheduling systems. Applied the Template Method pattern so every producer follows the same retry contract.",
    metric: "4 systems synced in real-time",
    techTags: ["Apache Flink", "Apache Kafka", "Event-Driven Architecture"],
  },
  {
    title: "API Performance & Resilience",
    description:
      "Implemented Redis caching for vehicle state lookups, cutting upstream calls by 60%. Added Resilience4j circuit breakers after running FMEA across 5 failure scenarios. On the scheduling side, eliminated API bottlenecks through caching, query optimization, and datastore index tuning.",
    metric: "99.9% availability, 65% faster responses",
    techTags: ["Redis", "Resilience4j", "Performance Tuning", "FMEA"],
  },
  {
    title: "MCP Server Integration",
    description:
      "Architected MCP servers for appointment and expert matching domains, integrating with AI models to enable real-time scheduling queries and intelligent expert matching. Adopted by 3 internal teams within the first month of launch.",
    metric: "3 teams adopted in month one",
    techTags: ["MCP", "AI Integration", "System Design"],
  },
];

export const education = {
  institution: "A.R.M College of Engineering and Technology",
  degree: "Bachelor of Engineering in Computer Science",
  period: "2012 — 2016",
  location: "Chennai",
};

export const certifications = [
  "AWS Solutions Architect",
  "CKA: Certified Kubernetes Administrator",
];

export const languages = [
  { language: "English", proficiency: "Fluent (professional working language)" },
  { language: "Swedish", proficiency: "Beginner (actively learning)" },
  { language: "Tamil", proficiency: "Native" },
];
