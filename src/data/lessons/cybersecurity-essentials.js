// src/data/courses/cybersecurityEssentials.js

const cybersecurityEssentials = [
  {
    slug: "cybersecurity-intro",
    title: "Cybersecurity Essentials — Overview & Ethics",
    content: [
      {
        type: "text",
        value:
`Welcome to Cybersecurity Essentials. This module covers fundamentals, ethics, and the responsible mindset.
Learners will understand different attacker motives, the importance of legal permission, and how professional pentesting differs from malicious hacking.`
      },
      {
        type: "text",
        value:
`Learning objectives:
1. Define confidentiality, integrity, availability (CIA triad).
2. Understand attacker motivations (crime, espionage, research, activism).
3. Learn laws, consent, and rules of engagement for testing systems.`
      },
      {
        type: "text",
        value:
`Ethics & Safety — mandatory:  
• Always get explicit written permission before interacting with systems you don't own.  
• Use isolated lab environments (local VMs, Docker, or cloud sandboxes).  
• Follow responsible disclosure for discovered vulnerabilities.`
      },
      {
        type: "text",
        value:
`Visualization idea (lesson UI):  
Show an interactive “Ethics Decision Tree” graphic — user chooses scenarios (e.g., "Found open port on client host") and the tree shows legal/ethical responses and consequences. Use color-coded outcomes (green = allowed, yellow = ask/notify, red = forbidden).`
      },
      {
        type: "text",
        value:
`Exercise: Draft a simple written “Rules of Engagement” (one page) for a mock pentest of a demo web app — include scope, allowed methods, timings, and contact points.`
      }
    ]
  },

  {
    slug: "threat-landscape-and-actors",
    title: "Threat Landscape & Attackers",
    content: [
      {
        type: "text",
        value:
`Deep dive: Understand threat actors (script kiddies, cybercriminal gangs, nation-states, insiders) and typical attack lifecycles.`
      },
      {
        type: "text",
        value:
`Topics covered:
- Attack surface and attack vectors
- Kill chain and MITRE ATT&CK high-level mapping
- Risk vs likelihood vs impact`
      },
      {
        type: "text",
        value:
`Visualization idea (lesson UI):  
Interactive MITRE ATT&CK map — clickable tactics (Initial Access, Persistence, Exfiltration). Clicking a tactic shows non-actionable examples, detection signals, and controls. Use timeline visualization to show progression of an attack.`
      },
      {
        type: "text",
        value:
`Exercise: Pick a small web service and draw its attack surface diagram (hosts, ports, services, external integrations). Mark high-risk components.`
      }
    ]
  },

  {
    slug: "networking-basics-for-security",
    title: "Networking Fundamentals for Security",
    content: [
      {
        type: "text",
        value:
`A practical networking primer: IP addressing, subnets, ports, TCP vs UDP, DNS basics, HTTP(S), TLS at a conceptual level — all from a defender/pentester perspective.`
      },
      {
        type: "text",
        value:
`Key concepts:
- IP addressing & subnetting (how segmentation reduces exposure)
- Ports & services: why open ports matter
- Protocol flows: TCP 3-way handshake, TLS handshake (high level)`
      },
      {
        type: "text",
        value:
`Lab (safe): Use a local virtual lab (e.g., Docker Compose with two containers) to capture and visualize traffic between client and server. The emphasis is reading and interpreting flows, not tampering.`
      },
      {
        type: "text",
        value:
`Visualization idea (lesson UI):  
Packet Flow Animator — show a simplified animated handshake between client and server. Highlight fields (SYN, SYN-ACK, ACK) and TLS steps. Allow users to step through the handshake with annotations.`
      },
      {
        type: "text",
        value:
`Exercise: Diagram the path of an HTTPS request to your demo app — show DNS lookup, TCP setup, TLS negotiation, HTTP request/response.`
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
