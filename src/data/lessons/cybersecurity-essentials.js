// src/data/courses/cybersecurityEssentials.js

const cybersecurityEssentials = [
   {
    slug: "cybersecurity-intro",
    title: "Cybersecurity Essentials — Overview & Ethics",
    content: [
      {
        type: "text",
        value: `
Welcome to *Cybersecurity Essentials*! Before touching a single tool or command, every cybersecurity professional must understand the **mindset** behind ethical hacking and digital defense.

Cybersecurity is not just about protecting machines — it’s about safeguarding people, businesses, and national interests. One careless click or misconfigured system can expose millions of records.
        `
      },
      {
        type: "text",
        value: `
### Why This Matters in the Real World
- Every company — from banks to hospitals — faces constant attacks from around the globe.  
- Professionals are trusted with **sensitive data** and **critical infrastructure**, so ethical awareness and legal boundaries are non-negotiable.  
- Mistakes in ethics can lead to **criminal charges**, even if the intent was educational.
        `
      },
      {
        type: "text",
        value: `
### How It’s Used in Practice
Ethical hackers, auditors, and SOC analysts work under **rules of engagement** that define exactly what they can test.  
For example:
- A bank may authorize a penetration test on its *staging* servers, not production.  
- A security researcher must report a bug responsibly — never exploit it publicly.

These professional boundaries separate a **licensed ethical hacker** from a **criminal attacker**.
        `
      },
      {
        type: "text",
        value: `
### Visualization Idea
An *Interactive “Ethics Decision Tree”*:  
Learner clicks through real-life scenarios like:
- “You found an exposed database on the internet.”
- “You received leaked credentials of your employer.”
and the system visually shows the correct legal/ethical path — green for allowed, red for forbidden.
        `
      },
      {
        type: "text",
        value: `
### Exercise
Write a one-page *Rules of Engagement (RoE)* for a fictional web app pentest.  
Include:
- Scope (what’s allowed)  
- Timing (when testing happens)  
- Emergency contacts (in case of accidental disruption)
        `
      }
    ]
  },

  {
    slug: "threat-landscape-and-actors",
    title: "Threat Landscape & Attackers — Understanding the Battlefield",
    content: [
      {
        type: "text",
        value: `
Cybersecurity is like modern warfare — defenders must understand who the enemies are, what motivates them, and how they operate.

### Why This Matters in the Real World
If you don’t know your enemy, you can’t defend effectively.  
- Security Operations Centers (SOCs) track threat groups daily.  
- CISOs use threat intelligence to prioritize defenses.  
- Penetration testers use this knowledge to simulate realistic attack behavior.

Without context, even a strong firewall can miss what’s coming next.
        `
      },
      {
        type: "text",
        value: `
### How It’s Used in Practice
Security teams classify attackers as:
- **Script Kiddies:** beginners using ready-made tools (low risk but noisy).  
- **Cybercriminals:** organized groups motivated by profit (ransomware, data theft).  
- **Nation-State Actors:** highly funded attackers targeting governments.  
- **Insiders:** employees who intentionally or accidentally cause breaches.

Defenders map attacks using the **MITRE ATT&CK framework** to identify where in the attack lifecycle they’re being targeted.
        `
      },
      {
        type: "text",
        value: `
### Visualization Idea
A *Threat Map Dashboard* showing animated global attacks in real time — similar to Kaspersky/Norwegian threat visualizers.  
Users click on attack paths to see the **MITRE stage** (e.g., Initial Access → Privilege Escalation → Data Exfiltration).
        `
      },
      {
        type: "text",
        value: `
### Exercise
Choose a simple web service (like a to-do app).  
Draw its attack surface diagram:
- Web server  
- Database  
- APIs  
- Third-party plugins  
Mark high-risk areas (like user input fields or admin panels).
        `
      }
    ]
  },

  {
    slug: "networking-basics-for-security",
    title: "Networking Fundamentals for Cybersecurity",
    content: [
      {
        type: "text",
        value: `
Networking is the foundation of every cyberattack and defense strategy.  
Understanding how data travels helps you spot when something goes wrong.
        `
      },
      {
        type: "text",
        value: `
### Why This Matters in the Real World
- Attackers exploit open ports and misconfigured network services.  
- Defenders monitor network flows to detect abnormal traffic.  
- Almost every incident investigation starts with packet analysis.

Without networking fundamentals, you can’t analyze an intrusion or secure communication.
        `
      },
      {
        type: "text",
        value: `
### How It’s Used in Practice
- Security analysts use tools like Wireshark to inspect traffic patterns.  
- Network engineers segment traffic to prevent attackers from moving laterally.  
- Penetration testers identify which ports and protocols reveal sensitive data.

Knowing TCP handshakes, DNS queries, and HTTPS flows lets you read a network trace like a story of what happened.
        `
      },
      {
        type: "text",
        value: `
### Visualization Idea
A *Packet Flow Animator* showing step-by-step handshake:
1. Client sends SYN  
2. Server responds SYN-ACK  
3. Client confirms with ACK  
Then the TLS negotiation begins — color-coded to show encrypted vs plain segments.
        `
      },
      {
        type: "text",
        value: `
### Exercise
Use a local virtual lab with two containers (client + server).  
Capture the handshake in Wireshark and annotate each step:
- What port is used?  
- Is encryption applied?  
- Can you identify the protocol in use?
        `
      }
    ]
  },

  {
    slug: "linux-basics-for-cybersec",
    title: "Linux Essentials for Security",
    content: [
      {
        type: "text",
        value:
`Linux is the platform of choice for many security tools. This lesson focuses on safe use: file permissions, basic process understanding, logs, and secure shell (SSH) concepts.`
      },
      {
        type: "text",
        value:
`Topics:
- Filesystem permissions & ownership (rwx, u/g/o)
- Common directories (/var/log, /etc)
- System logs and where to find them
- Non-privileged vs privileged operations — sudo, least-privilege principle`
      },
      {
        type: "text",
        value:
`Lab (safe): Use a disposable VM or container. Practice viewing logs, changing file permissions, and creating a small user with limited privileges. Focus on hardening steps.`
      },
      {
        type: "text",
        value:
`Visualization idea (lesson UI):  
File Permission Matrix — interactive grid showing owner/group/other and effects of toggling bits; apply to sample files and see "allowed"/"denied" outcomes visually.`
      },
      {
        type: "text",
        value:
`Exercise: Create a user, add it to a group with limited rights, and write a short report showing commands used and why this reduces risk.`
      }
    ]
  },

  {
    slug: "cryptography-basics",
    title: "Cryptography & Secure Communications (High Level)",
    content: [
      {
        type: "text",
        value:
`A conceptual introduction to symmetric vs asymmetric crypto, hashing, certificates, TLS, and common mistakes (weak algorithms, poor key management).`
      },
      {
        type: "text",
        value:
`Topics:
- Hash functions (purpose, one-way)
- Symmetric keys (AES) vs Asymmetric keys (RSA, ECC)
- Certificates (what a CA does) and certificate validation
- Common implementation pitfalls (hard-coded keys, weak randomness)`
      },
      {
        type: "text",
        value:
`Lab (safe): Generate a self-signed cert in a controlled environment and examine its fields. Learn how TLS cert expiry or mismatched names cause client failures.`
      },
      {
        type: "text",
        value:
`Visualization idea (lesson UI):  
Certificate Inspector — upload or paste a certificate (PEM), and show parsed fields graphically (issuer, subject, validity periods, key size). Add warnings for weak algorithms or short lifetimes.`
      },
      {
        type: "text",
        value:
`Exercise: Explain in one paragraph why storing passwords with a modern slow hash (e.g., bcrypt) is better than plain text or MD5.`
      }
    ]
  },

  {
    slug: "web-app-security-owasp",
    title: "Web Application Security — OWASP Top 10 (Deep Dive)",
    content: [
      {
        type: "text",
        value:
`Deep conceptual coverage of common web vulnerabilities (in OWASP Top 10 terms). Focus: how vulnerabilities arise, how to detect them, and how to mitigate — NOT how to exploit them.`
      },
      {
        type: "text",
        value:
`Module sections (each becomes a sub-lesson):
- Injection (why input validation & parameterized queries prevent it)
- Broken Auth (session management, multi-factor)
- Sensitive Data Exposure (encryption at rest/in transit)
- Broken Access Control (least privilege, enforce server-side checks)
...and other OWASP items.`
      },
      {
        type: "text",
        value:
`Safe Lab: Use an intentionally vulnerable app (in a contained lab you control) to **detect** vulnerabilities and then **fix** them. For example: find a page that echoes input and patch it by using proper escaping or parameterized queries.`
      },
      {
        type: "text",
        value:
`Visualization idea (lesson UI):  
Interactive Vulnerability Map per page: show a site map of the demo app and overlay vulnerability heatmap (high/medium/low). Clicking a node shows the vulnerability type, trace (how input flows through code), and recommended fix.`
      },
      {
        type: "text",
        value:
`Exercise: For a mocked login API, list all checks you would perform to ensure it's not susceptible to common auth weaknesses (rate limiting, lockouts, password policy, secure cookies).`
      }
    ]
  },

  {
    slug: "scanning-and-enumeration-concepts",
    title: "Scanning & Enumeration — Concepts and Detection",
    content: [
      {
        type: "text",
        value:
`High-level coverage of network and web asset discovery: what scanning is, why it is used, and how defenders detect/mitigate it. Emphasis on defensive detection and safe lab usage.`
      },
      {
        type: "text",
        value:
`Topics:
- Difference between passive and active discovery
- Port & service discovery (concepts, not commands)
- Fingerprinting and banner analysis (how defenders can use it to identify software versions)
- Rate control to avoid DoS during scans`
      },
      {
        type: "text",
        value:
`Safe Lab: Run discovery tools only inside an isolated test environment. Capture the telemetry and create detection rules that would flag that scanning activity (e.g., many SYNs to sequential ports).`
      },
      {
        type: "text",
        value:
`Visualization idea (lesson UI):  
Live Topology Discovery Demo — a simulated network map that fills in hosts/services as the learner "performs" discovery. The learner clicks “Start Discovery” and the UI reveals discovered nodes gradually, with a side panel showing which detection rules fired.`
      },
      {
        type: "text",
        value:
`Exercise: Design a simple IDS rule (pseudocode) that triggers when a single source IP probes more than 50 unique ports in 60 seconds. Explain false positives and tuning.`
      }
    ]
  },

  {
    slug: "vulnerability-assessment-vs-pentest",
    title: "Vulnerability Assessment vs Penetration Testing — Methodology",
    content: [
      {
        type: "text",
        value:
`Clarify the difference: vulnerability assessment (broad scanning/reporting) vs penetration testing (targeted, proof-of-concept exploitation with business impact analysis).`
      },
      {
        type: "text",
        value:
`Methodology steps for a professional pentest (high-level):
1. Scoping & Rules of Engagement  
2. Reconnaissance & Enumeration  
3. Vulnerability Identification & Validation  
4. Exploitation (limited & controlled, only with permission)  
5. Post-exploitation analysis (impact & cleanup)  
6. Reporting & Remediation verification`
      },
      {
        type: "text",
        value:
`Visualization idea (lesson UI):  
Pentest Workflow Canvas — interactive pipeline with clickable phases. Each phase expands into sub-checklists, typical tools (conceptual), and artifacts to collect (evidence, screenshots, logs).`
      },
      {
        type: "text",
        value:
`Exercise: Write a 1-page test plan for a mock internal pentest — define scope, timeframe, deliverables, and safe termination criteria.`
      }
    ]
  },

  {
    slug: "exploitation-concepts-safely",
    title: "Exploitation Concepts — Responsible Approach (High Level)",
    content: [
      {
        type: "text",
        value:
`High-level explanation of what exploitation means (privilege escalation, code execution concepts) — without providing exploit steps or code. Focus on risk analysis, detection, and mitigation.`
      },
      {
        type: "text",
        value:
`Topics:
- Principle of least privilege and why escalation is possible when it’s violated
- Buffer overflow & injection *concepts* (how improper input handling enables attacks)
- Importance of patch management and secure configuration`
      },
      {
        type: "text",
        value:
`Safe Lab: Simulate a privilege escalation scenario in a closed lab using intentionally vulnerable VM images that come with guided steps and remediation tasks — the platform must force learners to document the fix after validation.`
      },
      {
        type: "text",
        value:
`Visualization idea (lesson UI):  
Attack-Impact Flowchart — show how a low-severity vulnerability could chain into a high-impact outcome (e.g., weak credentials -> access -> sensitive data exposure). Provide “mitigation nodes” users can toggle to see how the chain breaks.`
      },
      {
        type: "text",
        value:
`Exercise: For a hypothetical web server with outdated modules, list three non-exploit remediation steps that reduce exploitability.`
      }
    ]
  },

  {
    slug: "post-exploitation-and-forensics",
    title: "Post-Exploitation, Logging & Forensics (Defender Focus)",
    content: [
      {
        type: "text",
        value:
`After an incident, defenders must investigate and learn. This lesson covers logging best practices, evidence preservation, and high-level forensic thinking.`
      },
      {
        type: "text",
        value:
`Topics:
- Centralized logging (syslog, ELK, cloud logging) and why structured logs help detection
- Preserving evidence: snapshots, immutable copies
- Timeline reconstruction from logs and PCAPs`
      },
      {
        type: "text",
        value:
`Visualization idea (lesson UI):  
Log Timeline Rebuilder — present sample logs and allow learners to filter by IP, user, or event. Then show a reconstructed timeline of attacker actions with clickable artifacts (log entries, mock pcap snippets).`
      },
      {
        type: "text",
        value:
`Exercise: Given a mocked set of logs, identify the top 3 suspicious events and propose immediate containment steps.`
      }
    ]
  },

  {
    slug: "reporting-remediation-and-communication",
    title: "Reporting, Remediation & Communication",
    content: [
      {
        type: "text",
        value:
`A professional pentest is only as valuable as its report and remediation follow-through. This lesson teaches how to write clear, actionable reports and work with engineering teams to fix issues.`
      },
      {
        type: "text",
        value:
`Report sections:
- Executive summary (business impact)
- Technical details (vulnerability, evidence, risk rating)
- Reproduction steps (high-level, safe)
- Remediation guidance
- Retest verification instructions`
      },
      {
        type: "text",
        value:
`Visualization idea (lesson UI):  
Interactive Report Builder — templates to drag & drop vulnerability cards into a report. Each card auto-populates severity, suggested remediation, and a “fix confirmed” checkbox that triggers re-test tasks.`
      },
      {
        type: "text",
        value:
`Exercise: Convert a single vulnerability discovery into a one-page executive summary and a one-page technical remediation for engineers.`
      }
    ]
  },

  {
    slug: "defensive-security-and-detection",
    title: "Defensive Security — Detection & Monitoring",
    content: [
      {
        type: "text",
        value:
`Understand how to design detection: what to log, how to alert, and how to triage incidents. This lesson bridges pentesting knowledge into defensive operations.`
      },
      {
        type: "text",
        value:
`Topics:
- Key telemetry sources (network flows, endpoint logs, application logs)
- Use of SIEM and creating detection rules
- Incident response basics and runbooks`
      },
      {
        type: "text",
        value:
`Visualization idea (lesson UI):  
SIEM Rule Simulator — let learners craft a simple rule (pseudocode) and then play a stream of synthetic events to see when the rule fires and how many alerts it generates (teaches tuning).`
      },
      {
        type: "text",
        value:
`Exercise: Draft a short incident response playbook for "suspicious login from new country" that includes isolation, evidence collection, and communication steps.`
      }
    ]
  },

  {
    slug: "labs-and-platform-setup",
    title: "Labs & Safe Environment Setup",
    content: [
      {
        type: "text",
        value:
`How to build safe, repeatable labs for hands-on learning. Emphasize containerized vulnerable apps, snapshotable VMs, and network segmentation.`
      },
      {
        type: "text",
        value:
`Recommended setup:
- Use Docker Compose to run intentionally vulnerable web apps in isolated networks.
- Use snapshot-capable VMs (VirtualBox / cloud with snapshots) for full-system exercises.
- Integrate ephemeral learnerspace: spin up per-learner labs and destroy after the session.
- Collect telemetry: forward logs/pcaps to the platform for visualization and grading.`
      },
      {
        type: "text",
        value:
`Visualization idea (lesson UI):  
Per-Lab Topology Visualizer — when a lab starts, show the temporary network map, container names, IPs, and exposed services. Provide buttons to "Open Browser to Target" or "Open Terminal (sandboxed)".`
      },
      {
        type: "text",
        value:
`Exercise: Create a Docker Compose file (conceptually) that runs a small two-container lab: a vulnerable web app and a logging collector. Describe the network isolation you will apply.`
      }
    ]
  },

  {
    slug: "capstone-simulated-pentest",
    title: "Capstone — Simulated (Guided & Ethical) Penetration Test",
    content: [
      {
        type: "text",
        value:
`Capstone: run a fully guided simulated pentest against an intentionally vulnerable environment you control. This is a *guided* exercise: hints, safe boundaries, and remediation steps are built in.`
      },
      {
        type: "text",
        value:
`Capstone flow (steps the student follows):
1. Read scope & rules of engagement.
2. Map target and enumerate assets.
3. Produce a prioritized vulnerability list (no public exploitation).
4. Validate via non-destructive proofs (logs, screenshots) and propose remediation.
5. Produce a final report (executive + technical).`
      },
      {
        type: "text",
        value:
`Visualization idea (lesson UI):  
Capstone Dashboard — combines an interactive topology, a “taskboard” of objectives, evidence uploader, and an auto-generated report draft. The platform can grade tasks and give feedback.`
      },
      {
        type: "text",
        value:
`Final Exercise: Complete the guided pentest. Submit your report and remediation plan. Include screenshots or log extracts as evidence.`
      }
    ]
  }
];

export default cybersecurityEssentials;
