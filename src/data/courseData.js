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

    projects: [
      "API Data Fetcher",
      "Automation Script",
      "CLI Utility Tool",
    ],

    tools: ["Python", "VS Code", "Git", "Postman"],

    why: "Python remains the #1 job-focused skill for automation, backend, cloud, and data fields.",

    faqs: [
      { q: "Is this for freshers?", a: "Yes, this course is designed to help freshers become job-ready." },
      { q: "Is certificate included?", a: "Yes, after completing all lessons and quizzes." },
    ],
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

    includes: [
      "30+ Lessons",
      "Beginner Labs",
      "Practice Exercises",
      "Lifetime Access",
    ],

    projects: ["Simple Calculator", "Expense Tracker"],

    tools: ["Python", "VS Code"],

    why: "Perfect starting point for students with zero coding background.",

    faqs: [
      { q: "Do I need prior experience?", a: "No prior coding knowledge needed." },
    ],
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

    projects: [
      "Portfolio Website",
      "E-commerce App",
      "Social Media Clone",
    ],

    tools: ["React", "Node.js", "MongoDB", "GitHub"],

    why: "Become industry-ready in both frontend and backend development.",

    faqs: [
      { q: "Do we deploy apps?", a: "Yes, you will deploy to cloud platforms." },
    ],
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

    faqs: [{ q: "Is GitHub included?", a: "Yes, all exercises use GitHub." }],
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

    faqs: [{ q: "Is hands-on provided?", a: "Yes, AWS cloud labs included." }],
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

    faqs: [{ q: "Do we deploy on Kubernetes?", a: "Yes, hands-on exercises included." }],
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

    faqs: [{ q: "Is hands-on included?", a: "Yes, full practical labs." }],
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

    faqs: [{ q: "Is AWS needed?", a: "Basic AWS knowledge recommended." }],
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

    faqs: [{ q: "Do we use Cisco Packet Tracer?", a: "Yes, labs are included." }],
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

    faqs: [{ q: "Is coding required?", a: "No, basic computer knowledge is enough." }],
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

    faqs: [{ q: "Which cloud will I learn?", a: "Both AWS and Azure basics." }],
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

    faqs: [{ q: "Is a powerful PC required?", a: "A basic laptop is enough." }],
  },
];

export default courseData;
