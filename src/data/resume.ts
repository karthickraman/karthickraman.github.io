export const personal = {
  name: "Karthick Pattabiraman",
  title: "Senior Java Backend Engineer",
  tagline:
    "I build backend systems that don't fall over at scale. 9 years of shipping microservices, data pipelines, and APIs that real people depend on every day.",
  email: "thekarthickraman@gmail.com",
  linkedin: "https://linkedin.com/in/karthickraman",
  github: "https://github.com/karthickraman",
  resumeUrl: "/resume.pdf",
};

export const about = {
  paragraphs: [
    "I've spent the last 9 years obsessing over how backend systems behave under pressure. Not just whether they work — but whether they work when thousands of requests hit at the same time, when a dependency goes down, or when someone tries to game the system.",
    "Right now, I'm building the scheduling backbone for a platform used by millions. I've personally owned 190+ deliverables across 6 microservices — from designing the GraphQL APIs to wiring up real-time event pipelines that keep 4 downstream systems in sync.",
    "Before this, I spent 7 years at a SaaS startup where I grew from writing my first production API to leading the entire backend team. That's where I learned that good engineering isn't just about clean code — it's about shipping things that move the business forward.",
    "I'm the kind of engineer who'll push back on a design if the tradeoffs don't make sense, but I'll also stay up late to get a migration across the finish line. I care about the craft, but I care more about the outcome.",
  ],
  coreStack: [
    "Java 21",
    "Spring Boot",
    "GraphQL",
    "Apache Kafka",
    "Apache Flink",
    "AWS",
    "Redis",
    "DynamoDB",
    "Elasticsearch",
  ],
};

export interface SkillCategory {
  category: string;
  skills: string[];
}

export const skills: SkillCategory[] = [
  { category: "Languages", skills: ["Java", "JavaScript"] },
  {
    category: "Backend & APIs",
    skills: [
      "Spring Boot",
      "Spring MVC",
      "RESTful APIs",
      "GraphQL (DGS)",
      "API Design",
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
    ],
  },
  {
    category: "Messaging & Streaming",
    skills: ["Apache Kafka", "Apache Flink", "AWS SNS/SQS"],
  },
  { category: "SQL Databases", skills: ["MySQL", "BigQuery"] },
  {
    category: "NoSQL Databases",
    skills: ["DynamoDB", "MongoDB", "Elasticsearch", "Google Datastore"],
  },
  { category: "Caching", skills: ["Redis", "Guava"] },
  {
    category: "Cloud & Infrastructure",
    skills: [
      "AWS (S3, Lambda, API Gateway, CodeDeploy)",
      "Google Cloud (App Engine, Cloud Run)",
      "Docker",
      "Kubernetes",
    ],
  },
  {
    category: "Testing & Reliability",
    skills: ["Karate DSL", "Gatling", "JUnit", "FMEA", "Load Testing"],
  },
  {
    category: "DevOps & Observability",
    skills: [
      "Jenkins",
      "GitHub Actions",
      "SonarQube",
      "Splunk",
      "PagerDuty",
      "OPA/Rego",
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
    period: "Jul 2024 — Present",
    location: "Bangalore",
    description:
      "Owning the backend for a large-scale appointment scheduling platform used by millions of end users across two major product lines.",
    highlights: [
      "Designed and built a Schedule Management service from scratch — data layer, GraphQL APIs, shift lifecycle, and a complete booking schema covering create, update, reschedule, and cancel. Now published to a company-wide API federation.",
      "Found that one API was making 10+ sequential auth calls per request. Replaced it with a batched approach and cut response time by ~70%.",
      "Built a sliding-window rate limiter with Redis Lua scripts to stop bot-driven booking abuse — handles 500+ bookings per window atomically.",
      "Set up a real-time Flink pipeline that fans out booking events to 4 downstream systems, with consistent retry and error-handling across all producers.",
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
    ],
  },
  {
    company: "Full Creative (Setmore)",
    role: "Software Engineer",
    period: "May 2019 — Jul 2024",
    location: "Chennai",
    description:
      "Backend engineering lead for a SaaS scheduling platform serving small businesses globally.",
    highlights: [
      "Integrated Zoom, Google Meet, and Facebook as booking channels — the Facebook integration alone contributed ~$90K in ad-driven revenue for the business.",
      "Built a native booking flow inside a call-center platform, cutting call costs by 20% and boosting agent productivity by 50%.",
      "Improved the core Booking Page API response time by 65% through Redis caching and query optimization.",
      "Led the backend team — code reviews, mentoring junior engineers, and owning releases across the product line.",
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
      "Cut signup API latency by 80%, directly speeding up customer onboarding.",
      "Migrated push notifications from GCM to Firebase, pushing delivery reliability to 98%.",
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
    title: "Scheduling Platform Backend",
    description:
      "Built the entire backend for an enterprise scheduling system from the ground up — data access layer, GraphQL API surface, shift management with timezone handling, and a booking schema that handles millions of operations. Now serves two major product lines through a federated API gateway.",
    metric: "190+ deliverables, 6 microservices",
    techTags: ["Java 21", "Spring Boot", "GraphQL", "DynamoDB", "Elasticsearch"],
  },
  {
    title: "Real-Time Event Pipeline",
    description:
      "Designed a streaming pipeline that takes every booking state change and fans it out to four downstream consumers in real-time — notifications, analytics, engagement, and scheduling systems. Applied the Template Method pattern so every producer follows the same retry contract.",
    metric: "4 systems synced in real-time",
    techTags: ["Apache Flink", "Apache Kafka", "Event-Driven Architecture"],
  },
  {
    title: "Bot-Proof Rate Limiter",
    description:
      "Noticed automated bots were abusing the booking system. Wrote a per-customer rate limiter using Redis Lua scripts with a sliding-window algorithm — counts adjust atomically on every create and cancel, no race conditions.",
    metric: "Eliminated bot abuse entirely",
    techTags: ["Redis", "Lua Scripting", "Sliding Window"],
  },
  {
    title: "API Performance Overhaul",
    description:
      "The main booking page API was painfully slow. Profiled it, added Redis caching for hot paths, rewrote inefficient queries, and tuned datastore indexes. Users noticed the difference immediately.",
    metric: "65% faster response times",
    techTags: ["Redis", "Query Optimization", "Performance Tuning"],
  },
  {
    title: "Social Media Booking Channel",
    description:
      "Partnered directly with a social platform's developer team during their beta program to build a native booking integration. Turned a social media page into a revenue-generating booking channel for small businesses.",
    metric: "~$90K in new revenue",
    techTags: ["OAuth", "API Integration", "Revenue Impact"],
  },
  {
    title: "Auth Call Optimization",
    description:
      "One critical API was doing 10+ sequential authorization calls on every single request. Redesigned it to batch all checks into a single call and moved filtering into the policy engine. Simple fix, massive impact.",
    metric: "~70% latency reduction",
    techTags: ["OPA/Rego", "Batch Processing", "System Design"],
  },
];

export const education = {
  institution: "A.R.M College of Engineering and Technology",
  degree: "Bachelor of Engineering in Computer Science",
  period: "2012 — 2016",
  location: "Chennai",
};
