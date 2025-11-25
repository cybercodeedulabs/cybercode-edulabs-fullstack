// src/data/courseData.js
const courseData = [
  // ======================================================
  // Programming & Development
  // ======================================================
  {
    title: "Golang",
    slug: "golang",
    category: "Programming & Development",
    description:
      "Learn Go programming with a focus on backend, cloud-native, and microservices development.",

    // NEW FIELDS
    duration: "6 Weeks",
    level: "Intermediate",
    mode: "Self-paced + Labs",
    language: "English",
    lastUpdated: "2025",

    skills: [
      "Golang Syntax & Memory Model",
      "Goroutines & Concurrency",
      "REST API Development",
      "Microservices Architecture",
      "Dockerizing Go Apps",
    ],

    includes: [
      "40+ Lessons",
      "Hands-on Cloud Labs",
      "Microservice Architecture Blueprint",
      "Downloadable Source Code",
      "Lifetime Access",
      "Certificate of Completion",
    ],

    projects: [
      "RESTful API Server",
      "Task Manager Microservice",
      "Containerized Go Application",
    ],

    tools: ["Go", "Docker", "Postman", "Git", "Kubernetes"],

    why: "Golang powers scalable cloud-native systems, making it ideal for backend, DevOps, and microservices engineering.",

    faqs: [
      {
        q: "Do I need prior experience?",
        a: "Basic programming knowledge is helpful, but not mandatory.",
      },
      {
        q: "Will I learn concurrency?",
        a: "Yes, Go’s concurrency model is a major part of this course.",
      },
    ],

    // Career / Future Scope
    idealFor: [
      "Developers moving into backend roles",
      "Engineers targeting cloud-native platforms",
      "DevOps engineers wanting to build internal tools",
    ],
    careerPaths: [
      "Golang Backend Developer",
      "Cloud-native Engineer",
      "Microservices Developer",
      "Platform Engineer",
    ],
    outcomes: [
      "Build production-grade REST APIs in Go",
      "Implement concurrency using goroutines and channels",
      "Containerize and deploy Go services using Docker / Kubernetes",
    ],
    salaryRange: {
      india: "₹6–14 LPA (mid-level Go backend roles)",
      global: "$80K–130K (Go backend / platform roles)",
      note: "Ranges vary by company, location, and prior experience.",
    },
    marketDemand:
      "Go is widely adopted by modern product companies, startups, and cloud vendors for high-performance backend systems.",
    demandTags: ["High demand", "Cloud-native", "Scalable systems"],
    nextRecommended: ["microservices-go-kubernetes", "devops-docker-kubernetes"],
  },

  {
    title: "Python Programming (Job-Focused)",
    slug: "python-job-focused",
    category: "Programming & Development",
    description:
      "Master Python with hands-on projects tailored to real-world job roles and interview prep.",

    duration: "8 Weeks",
    level: "Beginner to Intermediate",
    mode: "Hybrid Learning",
    language: "English",
    lastUpdated: "2025",

    skills: [
      "Python Foundations",
      "APIs & JSON",
      "OOP",
      "Automation Scripting",
      "Project Deployment",
    ],

    includes: [
      "60+ Lessons",
      "Hands-on Assignments",
      "Interview Prep Questions",
      "Downloadable Scripts",
      "Lifetime Access",
    ],

    projects: ["API Data Fetcher", "Automation Script", "CLI Utility Tool"],

    tools: ["Python", "VS Code", "Git", "Postman"],

    why: "Python remains the #1 job-focused skill for automation, backend, cloud, and data fields.",

    faqs: [
      {
        q: "Is this for freshers?",
        a: "Yes, this course is designed to help freshers become job-ready.",
      },
      {
        q: "Is certificate included?",
        a: "Yes, after completing all lessons and quizzes.",
      },
    ],

    idealFor: [
      "Freshers targeting their first developer role",
      "Working professionals transitioning into IT",
      "Testers / support engineers moving into automation",
    ],
    careerPaths: [
      "Python Developer",
      "Automation Engineer",
      "Backend Developer (Python)",
      "Support Engineer with scripting skills",
    ],
    outcomes: [
      "Write clean, modular Python code for real projects",
      "Create automation scripts to solve everyday problems",
      "Consume APIs and work with JSON / files confidently",
    ],
    salaryRange: {
      india: "₹3.5–8 LPA (entry to early-mid Python roles)",
      global: "$55K–100K (Python dev / automation roles)",
      note: "Higher ranges possible with experience and strong project portfolio.",
    },
    marketDemand:
      "Python skills are requested across web, cloud, automation, and data roles — making it one of the most versatile languages.",
    demandTags: ["Beginner-friendly", "High versatility", "Multi-domain"],
    nextRecommended: ["python-data-science-ai", "devops-docker-kubernetes"],
  },

  {
    title: "Python Programming (Absolute Beginners)",
    slug: "python-absolute-beginners",
    category: "Programming & Development",
    description:
      "Start your coding journey with Python from scratch, designed for complete beginners.",

    duration: "6 Weeks",
    level: "Beginner",
    mode: "Self-paced",
    language: "English",
    lastUpdated: "2025",

    skills: ["Variables", "Loops", "Functions", "OOP Basics"],

    includes: ["30+ Lessons", "Beginner Labs", "Practice Exercises", "Lifetime Access"],

    projects: ["Simple Calculator", "Expense Tracker"],

    tools: ["Python", "VS Code"],

    why: "Perfect starting point for students with zero coding background.",

    faqs: [
      {
        q: "Do I need prior experience?",
        a: "No prior coding knowledge needed.",
      },
    ],

    idealFor: [
      "Students from non-CS backgrounds",
      "School / college students trying coding for the first time",
      "Working professionals exploring IT as a new path",
    ],
    careerPaths: [
      "Python Learner (foundation stage)",
      "Future Python Developer",
      "Future Data / Cloud / Automation Engineer",
    ],
    outcomes: [
      "Understand core programming concepts with Python",
      "Write basic programs using variables, loops, and functions",
      "Build confidence to attempt job-focused Python tracks",
    ],
    salaryRange: {
      india:
        "Foundation course — enables you to move into job-focused Python / data / cloud tracks.",
      global:
        "Builds the base to later target global Python and data opportunities.",
      note: "This course is a starting step; salary depends on next specialization.",
    },
    marketDemand:
      "Beginner-friendly Python skills are ideal for entering multiple IT paths without confusion.",
    demandTags: ["Zero-to-one", "Strong foundation", "Great for beginners"],
    nextRecommended: ["python-job-focused", "python-data-science-ai"],
  },

  {
    title: "Full-Stack Web Dev",
    slug: "full-stack-web-dev",
    category: "Programming & Development",
    description:
      "Build responsive web apps using modern stacks: React, Node.js, Express, MongoDB & more.",

    duration: "12 Weeks",
    level: "Beginner to Intermediate",
    mode: "Self-paced + Live Projects",
    language: "English",
    lastUpdated: "2025",

    skills: [
      "HTML/CSS/JS",
      "React",
      "Express",
      "MongoDB",
      "Authentication",
      "API Design",
    ],

    includes: [
      "80+ Lessons",
      "3 Major Projects",
      "Deployment Guides",
      "Premium UI Components",
    ],

    projects: ["Portfolio Website", "E-commerce App", "Social Media Clone"],

    tools: ["React", "Node.js", "MongoDB", "GitHub"],

    why: "Become industry-ready in both frontend and backend development.",

    faqs: [
      {
        q: "Do we deploy apps?",
        a: "Yes, you will deploy to cloud platforms.",
      },
    ],

    idealFor: [
      "Students targeting full-stack developer roles",
      "Frontend devs wanting backend exposure",
      "Backend devs wanting frontend skills",
    ],
    careerPaths: [
      "Full-Stack Developer",
      "Frontend Developer",
      "Backend Developer (Node.js)",
    ],
    outcomes: [
      "Build and deploy complete web applications end-to-end",
      "Implement authentication, routing, and basic security",
      "Showcase production-ready projects in your portfolio",
    ],
    salaryRange: {
      india: "₹4–10 LPA (junior to mid full-stack roles)",
      global: "$60K–110K (full-stack roles)",
      note: "Portfolio strength and live projects directly impact offers.",
    },
    marketDemand:
      "Full-stack developers remain among the most in-demand roles in startups and product companies.",
    demandTags: ["Portfolio heavy", "Startups love this", "End-to-end skills"],
    nextRecommended: ["devops-docker-kubernetes", "cloud-security-devsecops"],
  },

  {
    title: "Version Control with Git & GitHub",
    slug: "version-control-git-github",
    category: "Programming & Development",
    description:
      "Track code changes, collaborate with teams, and manage projects using Git and GitHub.",

    duration: "2 Weeks",
    level: "Beginner",
    mode: "Self-paced",
    language: "English",
    lastUpdated: "2025",

    skills: ["Branching", "Merging", "Pull Requests", "Rebasing"],

    includes: ["Hands-on Git Labs", "GitHub Projects", "Team Workflow"],

    projects: ["Real Git Collaboration Simulation"],

    tools: ["Git", "GitHub"],

    why: "Git is the foundation of all modern software development.",

    faqs: [
      { q: "Is GitHub included?", a: "Yes, all exercises use GitHub." },
    ],

    idealFor: [
      "Any developer working on team projects",
      "Students preparing for internships",
      "New joiners in software teams",
    ],
    careerPaths: [
      "Developer comfortable with team workflows",
      "Contributor to open-source projects",
    ],
    outcomes: [
      "Use Git confidently for everyday development",
      "Collaborate using branches, PRs, and code reviews",
    ],
    salaryRange: {
      india:
        "Core skill — used alongside your primary stack (Python, JS, Go, etc.).",
      global: "Mandatory for almost all software roles worldwide.",
      note: "Git enhances employability but is not a standalone job role.",
    },
    marketDemand:
      "Every modern software team expects Git skills as a basic requirement.",
    demandTags: ["Mandatory skill", "Collaboration", "Team-ready"],
    nextRecommended: ["full-stack-web-dev", "devops-docker-kubernetes"],
  },

  {
    title: "Microservices with Go and Kubernetes",
    slug: "microservices-go-kubernetes",
    category: "Programming & Development",
    description:
      "Design and deploy scalable microservices with Go, Docker, and Kubernetes.",

    duration: "10 Weeks",
    level: "Intermediate",
    mode: "Self-paced + Cloud Labs",
    language: "English",
    lastUpdated: "2025",

    skills: [
      "Go Microservices",
      "Containers",
      "Kubernetes",
      "Service Mesh",
      "Observability",
    ],

    includes: [
      "5 Microservices Projects",
      "Cloud Deployment",
      "Monitoring Stack",
    ],

    projects: ["Order Service", "Auth Service", "API Gateway"],

    tools: ["Go", "Docker", "K8s", "Prometheus", "Grafana"],

    why: "Microservices are the backbone of modern scalable applications.",

    faqs: [
      { q: "Is Kubernetes included?", a: "Yes, full hands-on labs." },
    ],

    idealFor: [
      "Backend developers moving into distributed systems",
      "DevOps / SRE engineers handling microservices",
    ],
    careerPaths: [
      "Microservices Developer",
      "Platform / SRE Engineer",
      "Cloud-native Backend Engineer",
    ],
    outcomes: [
      "Design and build microservices that communicate reliably",
      "Deploy microservices to Kubernetes clusters",
      "Instrument services with logging, metrics, and tracing",
    ],
    salaryRange: {
      india: "₹10–20 LPA (microservices / SRE roles with experience)",
      global: "$110K–160K (cloud-native / platform roles)",
      note: "These are typically mid to senior-level roles.",
    },
    marketDemand:
      "Companies modernizing monoliths into microservices heavily seek Go + Kubernetes skills.",
    demandTags: ["Advanced track", "Platform-level roles", "High impact"],
    nextRecommended: ["cloud-security-devsecops", "terraform-iac"],
  },

  // ======================================================
  // Cloud & DevOps
  // ======================================================

  {
    title: "AWS Certified Training",
    slug: "aws-certified-training",
    category: "Cloud & DevOps",
    description:
      "Prepare for AWS certifications with real-world cloud lab practice and expert instruction.",

    duration: "10 Weeks",
    level: "Beginner to Advanced",
    mode: "Self-paced + Labs",
    language: "English",
    lastUpdated: "2025",

    skills: ["VPC", "EC2", "S3", "Lambda", "IAM", "CloudFormation"],

    includes: ["Certification Prep", "Mock Exams", "Cloud Labs"],

    projects: ["Serverless App", "Multi-tier VPC Architecture"],

    tools: ["AWS Console", "CLI", "Terraform"],

    why: "AWS certification is one of the most in-demand cloud skills worldwide.",

    faqs: [
      { q: "Is hands-on provided?", a: "Yes, AWS cloud labs included." },
    ],

    idealFor: [
      "Freshers aiming for cloud engineer roles",
      "Developers / admins targeting AWS certification",
    ],
    careerPaths: [
      "Cloud Engineer (AWS)",
      "AWS Solutions Architect (with experience)",
      "DevOps Engineer with AWS focus",
    ],
    outcomes: [
      "Understand key AWS services with hands-on practice",
      "Be ready to attempt AWS certification exams",
      "Design basic cloud architectures on AWS",
    ],
    salaryRange: {
      india: "₹5–12 LPA (cloud / AWS-focused roles)",
      global: "$70K–130K (cloud engineer / architect roles)",
      note: "Certifications plus projects strongly increase opportunities.",
    },
    marketDemand:
      "AWS remains the most widely adopted public cloud, with continuous demand for certified and hands-on engineers.",
    demandTags: ["Certification-friendly", "Cloud-first", "High demand"],
    nextRecommended: ["devops-docker-kubernetes", "cloud-security-devsecops"],
  },

  {
    title: "DevOps (Docker & Kubernetes)",
    slug: "devops-docker-kubernetes",
    category: "Cloud & DevOps",
    description:
      "Hands-on DevOps training covering CI/CD pipelines, Docker, and Kubernetes orchestration.",

    duration: "8 Weeks",
    level: "Beginner to Intermediate",
    mode: "Self-paced + Labs",
    language: "English",
    lastUpdated: "2025",

    skills: ["Docker", "Kubernetes", "CI/CD", "Monitoring", "GitOps"],

    includes: ["DevOps Projects", "Pipeline Templates", "Cloud Labs"],

    projects: ["CI/CD Pipeline", "Microservice Deployment"],

    tools: ["Docker", "K8s", "Jenkins", "ArgoCD"],

    why: "DevOps bridges development & deployment — a must-have skill.",

    faqs: [
      {
        q: "Do we deploy on Kubernetes?",
        a: "Yes, hands-on exercises included.",
      },
    ],

    idealFor: [
      "Developers transitioning into DevOps",
      "System admins moving to cloud-native setups",
    ],
    careerPaths: ["DevOps Engineer", "Cloud DevOps Engineer", "SRE (entry-level)"],
    outcomes: [
      "Containerize applications with Docker",
      "Deploy applications on Kubernetes clusters",
      "Set up CI/CD pipelines for automated delivery",
    ],
    salaryRange: {
      india: "₹6–14 LPA (DevOps-focused roles)",
      global: "$80K–140K (DevOps / SRE roles)",
      note: "Hands-on experience with real projects is highly valued.",
    },
    marketDemand:
      "Every modern engineering team aims to automate deployments, making DevOps roles consistently in demand.",
    demandTags: ["Automation heavy", "Cross-functional", "High ROI"],
    nextRecommended: ["cloud-security-devsecops", "terraform-iac"],
  },

  {
    title: "Private Cloud with OpenStack",
    slug: "private-cloud-openstack",
    category: "Cloud & DevOps",
    description:
      "Build and manage your own private cloud using OpenStack, the leading open-source cloud OS.",

    duration: "6 Weeks",
    level: "Intermediate",
    mode: "Self-paced + Labs",
    language: "English",
    lastUpdated: "2025",

    skills: ["Compute", "Networking", "Storage", "Identity"],

    includes: ["OpenStack Cluster Setup", "Admin Workflows"],

    projects: ["Private Cloud Deployment"],

    tools: ["OpenStack", "KVM", "Linux"],

    why: "Organizations rely on OpenStack for scalable private cloud deployments.",

    faqs: [
      { q: "Is hands-on included?", a: "Yes, full practical labs." },
    ],

    idealFor: [
      "System admins handling data center workloads",
      "Cloud engineers working with private clouds",
    ],
    careerPaths: [
      "OpenStack Administrator",
      "Private Cloud Engineer",
      "Infrastructure Engineer",
    ],
    outcomes: [
      "Understand core OpenStack components",
      "Deploy and manage a basic OpenStack-based private cloud",
    ],
    salaryRange: {
      india: "₹8–16 LPA (private cloud roles with experience)",
      global: "$90K–140K (infra / private cloud roles)",
      note: "Often part of enterprise infrastructure teams.",
    },
    marketDemand:
      "Used in telcos, enterprises, and regulated industries that need on-prem or private cloud control.",
    demandTags: ["Enterprise", "Infrastructure-heavy", "Specialized"],
    nextRecommended: ["cloud-security-devsecops"],
  },

  {
    title: "Terraform & Infrastructure as Code (IaC)",
    slug: "terraform-iac",
    category: "Cloud & DevOps",
    description:
      "Automate infrastructure provisioning using Terraform with real-world IaC workflows.",

    duration: "4 Weeks",
    level: "Intermediate",
    mode: "Self-paced",
    language: "English",
    lastUpdated: "2025",

    skills: ["Modules", "Provisioners", "State Management", "Cloud Automation"],

    includes: ["IaC Projects", "Reusable Terraform Modules"],

    projects: ["AWS VPC Automation", "S3 + CloudFront Deployment"],

    tools: ["Terraform", "AWS", "Git"],

    why: "Terraform is the industry standard for IaC automation.",

    faqs: [
      { q: "Is AWS needed?", a: "Basic AWS knowledge recommended." },
    ],

    idealFor: [
      "Cloud engineers wanting programmable infra",
      "DevOps engineers automating environments",
    ],
    careerPaths: [
      "Cloud DevOps Engineer",
      "Infrastructure as Code Specialist",
    ],
    outcomes: [
      "Write Terraform code to automate cloud resources",
      "Use modules and remote state in real projects",
    ],
    salaryRange: {
      india: "₹7–15 LPA (cloud / DevOps with IaC skills)",
      global: "$90K–140K (cloud / platform roles)",
      note: "Terraform skills combine very well with AWS / DevOps.",
    },
    marketDemand:
      "IaC skills are standard in teams that manage multi-account or multi-environment cloud setups.",
    demandTags: ["Automation", "Cloud-native", "Reusable infra"],
    nextRecommended: ["cloud-security-devsecops"],
  },

  {
    title: "Cloud Security & DevSecOps",
    slug: "cloud-security-devsecops",
    category: "Cloud & DevOps",
    description:
      "Secure your cloud infrastructure and implement DevSecOps practices in your pipelines.",

    duration: "6 Weeks",
    level: "Intermediate",
    mode: "Self-paced + Labs",
    language: "English",
    lastUpdated: "2025",

    skills: ["IAM Hardening", "Threat Modeling", "Shift-left Security"],

    includes: ["Security Labs", "Pipeline Security Tools"],

    projects: ["Secure CI/CD Pipeline"],

    tools: ["AWS", "SAST", "DAST", "Kubernetes"],

    why: "Security is a mandatory part of every DevOps pipeline today.",

    faqs: [{ q: "Do we do hands-on?", a: "Yes, cloud labs included." }],

    idealFor: [
      "DevOps engineers upskilling into security",
      "Security engineers working with CI/CD",
    ],
    careerPaths: [
      "DevSecOps Engineer",
      "Cloud Security Engineer",
      "Security-focused DevOps Engineer",
    ],
    outcomes: [
      "Identify and fix common cloud misconfigurations",
      "Integrate security checks into CI/CD pipelines",
    ],
    salaryRange: {
      india: "₹10–22 LPA (DevSecOps / cloud security roles)",
      global: "$110K–170K (security-focused cloud roles)",
      note: "Security + DevOps is a premium skill combination.",
    },
    marketDemand:
      "Regulation, compliance, and breaches keep pushing demand for DevSecOps and cloud security roles.",
    demandTags: ["Security-first", "Premium skill", "Compliance focused"],
    nextRecommended: [],
  },

  // ======================================================
  // Data Science & AI
  // ======================================================

  {
    title: "Python for Data Science & AI",
    slug: "python-data-science-ai",
    category: "Data Science & AI",
    description:
      "Use Python to explore data, train models, and deploy AI solutions for real-world use cases.",

    duration: "10 Weeks",
    level: "Beginner to Intermediate",
    mode: "Self-paced",
    language: "English",
    lastUpdated: "2025",

    skills: ["NumPy", "Pandas", "ML Basics", "Data Visualization"],

    includes: ["Datasets", "ML Tasks", "Real-World Case Studies"],

    projects: ["Sales Prediction Model", "Customer Segmentation"],

    tools: ["Python", "Jupyter", "Scikit-learn"],

    why: "A solid course for anyone entering AI and ML.",

    faqs: [{ q: "Is math needed?", a: "Basic understanding is enough." }],

    idealFor: [
      "Python learners entering data science",
      "Freshers interested in AI / ML basics",
    ],
    careerPaths: [
      "Junior Data Analyst",
      "ML Enthusiast (entry level)",
      "Data Engineer (with further upskilling)",
    ],
    outcomes: [
      "Work comfortably with datasets using NumPy and Pandas",
      "Build simple ML models and evaluate them",
    ],
    salaryRange: {
      india: "₹4–9 LPA (entry-level data roles with projects)",
      global: "$65K–110K (data-focused roles)",
      note: "Stronger math and projects lead to higher roles.",
    },
    marketDemand:
      "Foundational data and ML skills are widely sought across domains like finance, retail, and SaaS.",
    demandTags: ["Data-first", "AI foundation", "In-demand"],
    nextRecommended: ["ml-with-aws"],
  },

  {
    title: "Machine Learning with AWS",
    slug: "ml-with-aws",
    category: "Data Science & AI",
    description:
      "Build and deploy machine learning models using AWS SageMaker and ML pipelines.",

    duration: "8 Weeks",
    level: "Intermediate",
    mode: "Self-paced + Labs",
    language: "English",
    lastUpdated: "2025",

    skills: ["SageMaker", "ML Pipelines", "Model Deployment"],

    includes: ["AWS ML Labs", "Real Projects"],

    projects: ["Fraud Detection Model"],

    tools: ["Python", "AWS SageMaker"],

    why: "Learn ML from a production-grade cloud perspective.",

    faqs: [{ q: "Need AWS knowledge?", a: "Basic AWS understanding helps." }],

    idealFor: [
      "Data science learners wanting cloud deployment",
      "Cloud engineers entering ML workflows",
    ],
    careerPaths: [
      "ML Engineer (with more math / DS)",
      "Cloud ML Engineer",
      "Data Engineer with ML exposure",
    ],
    outcomes: [
      "Train ML models using AWS SageMaker",
      "Deploy models and expose them as endpoints",
    ],
    salaryRange: {
      india: "₹8–18 LPA (cloud + ML combined skills)",
      global: "$100K–160K (ML / cloud roles)",
      note: "Strong DS + cloud skills are highly valued.",
    },
    marketDemand:
      "As more companies move ML workloads to the cloud, ML + AWS combined skills are growing in demand.",
    demandTags: ["Cloud ML", "Production-ready", "High growth"],
    nextRecommended: [],
  },

  // ======================================================
  // Networking & Security
  // ======================================================

  {
    title: "Linux Essentials for SysAdmins",
    slug: "linux-essentials",
    category: "Networking & Security",
    description:
      "Learn the core Linux commands and concepts every system administrator must know.",

    duration: "4 Weeks",
    level: "Beginner",
    mode: "Self-paced",
    language: "English",
    lastUpdated: "2025",

    skills: ["Commands", "Permissions", "Shell Scripting"],

    includes: ["Linux Labs", "Automation Basics"],

    projects: ["Shell Script Automation"],

    tools: ["Linux", "Bash"],

    why: "Linux is mandatory for cloud, DevOps, and cybersecurity.",

    faqs: [{ q: "Do I need a Linux PC?", a: "No, we provide cloud labs." }],

    idealFor: [
      "Anyone entering cloud / DevOps / security",
      "Windows users wanting to understand Linux",
    ],
    careerPaths: [
      "Linux System Administrator",
      "Junior DevOps Engineer",
      "Support Engineer (Linux)",
    ],
    outcomes: [
      "Navigate Linux confidently using the command line",
      "Write basic shell scripts to automate tasks",
    ],
    salaryRange: {
      india: "₹3–7 LPA (entry-level Linux / support roles)",
      global: "$45K–80K (sysadmin / support roles)",
      note: "Linux is a base skill that enables higher-level specializations.",
    },
    marketDemand:
      "Linux remains the backbone of servers, cloud, and containers.",
    demandTags: ["Foundation skill", "Server-focused", "Must-have"],
    nextRecommended: ["devops-docker-kubernetes", "cybersecurity-essentials"],
  },

  {
    title: "Introduction to Networking (CCNA)",
    slug: "networking-ccna",
    category: "Networking & Security",
    description:
      "Build a solid foundation in networking aligned with Cisco CCNA standards.",

    duration: "8 Weeks",
    level: "Beginner",
    mode: "Self-paced",
    language: "English",
    lastUpdated: "2025",

    skills: ["IP Addressing", "Routing", "Switching", "Subnetting"],

    includes: ["Packet Tracer Labs", "Real Network Configs"],

    projects: ["Router + Switch Lab Setup"],

    tools: ["Cisco PT", "GNS3"],

    why: "Perfect for beginners entering networking.",

    faqs: [
      {
        q: "Do we use Cisco Packet Tracer?",
        a: "Yes, labs are included.",
      },
    ],

    idealFor: [
      "Students targeting networking roles",
      "System admins adding networking depth",
    ],
    careerPaths: [
      "Network Support Engineer",
      "Junior Network Engineer",
    ],
    outcomes: [
      "Understand core networking concepts and protocols",
      "Configure basic routers and switches in labs",
    ],
    salaryRange: {
      india: "₹3–7 LPA (entry networking roles)",
      global: "$45K–85K (junior networking roles)",
      note: "Certification + labs improves opportunities.",
    },
    marketDemand:
      "Networks remain crucial for all IT infrastructure; CCNA-level knowledge is a strong start.",
    demandTags: ["Structured career", "Infra-focused", "Cert-ready"],
    nextRecommended: ["cybersecurity-essentials"],
  },

  {
    title: "Cybersecurity Essentials for All",
    slug: "cybersecurity-essentials",
    category: "Networking & Security",
    description:
      "Learn how to secure systems, networks, and yourself online—must-have skills for everyone.",

    duration: "6 Weeks",
    level: "Beginner",
    mode: "Self-paced",
    language: "English",
    lastUpdated: "2025",

    skills: ["Threats", "Attacks", "Defense Basics"],

    includes: ["Simulators", "Attack Scenarios"],

    projects: ["Security Incident Simulation"],

    tools: ["Linux", "Cyber Simulators"],

    why: "Ideal for beginners who want to understand cybersecurity fundamentals.",

    faqs: [
      {
        q: "Is coding required?",
        a: "No, basic computer knowledge is enough.",
      },
    ],

    idealFor: [
      "Students curious about cybersecurity",
      "IT professionals adding security awareness",
      "Non-tech users wanting to be safer online",
    ],
    careerPaths: [
      "Security-aware IT Professional",
      "Future Security Analyst (with advanced tracks)",
      "Compliance / Security Champion in teams",
    ],
    outcomes: [
      "Understand common threats & attacks",
      "Apply basic protection steps on systems and accounts",
    ],
    salaryRange: {
      india:
        "Foundation-level course — prepares you for advanced security tracks.",
      global:
        "Security awareness is expected across organizations in every role.",
      note: "This is a fundamentals course; salaries depend on advanced specialization.",
    },
    marketDemand:
      "Cyber awareness is now essential in every company and for every digital citizen.",
    demandTags: ["Essential", "High awareness", "Security-first mindset"],
    nextRecommended: ["cloud-security-devsecops"],
  },

  {
    title: "Basics of Cloud Computing (AWS or AZURE)",
    slug: "basics-cloudcom",
    category: "Networking & Security",
    description:
      "Understand the fundamentals of cloud platforms with guided labs on AWS and Azure.",

    duration: "4 Weeks",
    level: "Beginner",
    mode: "Self-paced",
    language: "English",
    lastUpdated: "2025",

    skills: ["Cloud Basics", "Compute", "Storage", "Networking"],

    includes: ["Cloud Console Labs"],

    projects: ["Simple Cloud Deployment"],

    tools: ["AWS", "Azure"],

    why: "Great starting point before choosing AWS/DevOps tracks.",

    faqs: [
      {
        q: "Which cloud will I learn?",
        a: "Both AWS and Azure basics.",
      },
    ],

    idealFor: [
      "Students exploring cloud careers",
      "IT professionals moving from on-prem to cloud",
    ],
    careerPaths: [
      "Cloud-ready Engineer (foundation stage)",
      "Future AWS / Azure / DevOps Engineer",
    ],
    outcomes: [
      "Understand core cloud concepts across providers",
      "Get confidence to choose a deeper AWS / Azure track",
    ],
    salaryRange: {
      india:
        "Acts as a launchpad for more specialized cloud / DevOps learning.",
      global:
        "Cloud awareness is now expected in most infra and software roles.",
      note: "This course provides strong fundamentals; specialization drives pay.",
    },
    marketDemand:
      "Cloud adoption continues to grow, and cloud fundamentals are now baseline expectations.",
    demandTags: ["Cloud foundation", "Multi-cloud view", "Future-ready"],
    nextRecommended: ["aws-certified-training", "devops-docker-kubernetes"],
  },

  // ======================================================
  // Hands-on Labs & Practice
  // ======================================================

  {
    title: "Home Lab Setup for Cloud Practice",
    slug: "home-lab-setup-cloud-practice",
    category: "Hands-on Labs & Practice",
    description:
      "Build your own cloud practice environment at home to gain hands-on skills affordably.",

    duration: "2 Weeks",
    level: "Beginner",
    mode: "Self-paced",
    language: "English",
    lastUpdated: "2025",

    skills: ["Virtualization", "Networking", "Cloud Practice"],

    includes: ["VM Setup", "Router Simulator"],

    projects: ["Mini Cloud Lab"],

    tools: ["VirtualBox", "Ubuntu", "Docker"],

    why: "Hands-on foundational knowledge before learning AWS, DevOps, or Kubernetes.",

    faqs: [
      {
        q: "Is a powerful PC required?",
        a: "A basic laptop is enough.",
      },
    ],

    idealFor: [
      "Students who want low-cost practice",
      "Learners preparing for AWS / DevOps / Kubernetes tracks",
    ],
    careerPaths: [
      "Hands-on learner ready for cloud tracks",
    ],
    outcomes: [
      "Set up a mini lab using VMs and containers",
      "Practice networking and Linux safely at home",
    ],
    salaryRange: {
      india:
        "Enabler course — helps you practice for better cloud / DevOps roles.",
      global:
        "Practical lab skills significantly improve your learning speed and confidence.",
      note: "This course boosts your readiness for higher-value tracks.",
    },
    marketDemand:
      "Hands-on learners with home or cloud labs progress faster in interviews and on the job.",
    demandTags: ["Practice-focused", "Budget-friendly", "Skill accelerator"],
    nextRecommended: ["linux-essentials", "aws-certified-training", "devops-docker-kubernetes"],
  },
];

export default courseData;
