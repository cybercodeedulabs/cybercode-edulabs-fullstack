// src/data/courses/cybersecurityEssentials.js
import DecisionTreeSimulator from "../../components/simulations/DecisionTreeSimulator";
import ThreatMapSimulator from "../../components/simulations/ThreatMapSimulator";
import PacketFlowSimulator from "../../components/simulations/PacketFlowSimulator";
import PacketTimelineSimulator from "../../components/simulations/PacketTimelineSimulator";
import LinuxPermissionSimulator from "../../components/simulations/LinuxPermissionSimulator";
import FirewallSimulator from "../../components/simulations/FirewallSimulator";
import PhishingEmailSimulator from "../../components/simulations/PhishingEmailSimulator";
import VulnerabilityScannerSimulator from "../../components/simulations/VulnerabilityScannerSimulator";
import SIEMLogAnalyzerSimulator from "../../components/simulations/SIEMLogAnalyzerSimulator";
import ForensicsSimulator from "../../components/simulations/ForensicsSimulator";





const cybersecurityEssentials = [
  {
    slug: "cybersecurity-intro",
    title: "Cybersecurity Essentials — Overview & Ethics",
    content: [
      {
        type: "text",
        value: `
Cybersecurity is not just about firewalls or antiviruses — it’s about **trust, resilience, and responsibility**.  
Before you touch a single tool or command, you must adopt the **mindset** of an ethical defender.

This lesson introduces the values that differentiate a **professional cybersecurity expert** from a **malicious attacker**.  
Whether you’re training to become a **SOC Analyst**, **Penetration Tester**, or **Security Engineer**, ethics is your foundation.
      `
      },
      {
        type: "image",
        value: "/lessonimages/cybersecurity/ethics-overview-diagram.png",
        alt: "Cybersecurity Ethics Overview Diagram"
      },
      {
        type: "text",
        value: `
### 🌐 The Real-World Importance
Every organization, from hospitals to banks, is under constant attack.  
Cybersecurity professionals protect:
- **Confidentiality** (prevent data leaks)
- **Integrity** (prevent tampering)
- **Availability** (prevent downtime)

💡 One careless click or misconfigured server can expose millions of records — this is why **ethical responsibility** is not optional.
      `
      },
      {
        type: "text",
        value: `
### 🧭 Ethics in Action
Cybersecurity professionals operate under **Rules of Engagement (RoE)** that clearly define what is allowed.  
Example:
- A penetration tester may only test *approved systems* during a defined window.
- Discovering a bug? You report it **responsibly**, not exploit it.

This professional discipline builds your reputation and ensures you stay within legal boundaries.
      `
      },
      {
        type: "image",
        value: "/lessonimages/cybersecurity/ethical-decision-tree.png",
        alt: "Interactive Ethical Decision Tree for Cybersecurity"
      },
      {
        type: "text",
        value: `
### 🧠 Visualization Idea (Interactive Simulation)
Create a mini “Ethical Decision Tree” inside the website —  
when learners face scenarios such as:
- “You find a company database exposed online”
- “Your friend asks you to test a website without permission”

They choose an action, and the system highlights:
- ✅ Green (Ethical & Legal)
- ❌ Red (Unethical or Illegal)

This simulation reinforces decision-making under real-world pressure.
      `
      },

      // Simulation for Ethics
      {
        type: "component",
        value: DecisionTreeSimulator
      },

      {
        type: "text",
        value: `
### 🧩 Career Focus
Ethics training is mandatory for certifications like:
- **CEH (Certified Ethical Hacker)**
- **CompTIA Security+**
- **OSCP**
- **Cybersecurity Analyst (CySA+)**

A single unethical decision can end your career — even with technical brilliance.
      `
      },
      {
        type: "text",
        value: `
### 🧾 Exercise — Write Your Own Rules of Engagement (RoE)
Create a one-page RoE document for a **fictional web app pentest**.  
Include:
1. **Scope** – which servers or endpoints are allowed  
2. **Tools** – what types of scans or actions are authorized  
3. **Timing** – when the test is allowed  
4. **Emergency contacts** – who to notify in case of issues  
5. **Termination clause** – what stops the test immediately
      `
      },
      {
        type: "text",
        value: `
### 🧱 Bonus Mini Project
Create a visual “Ethical Pledge” for Cybercode EduLabs learners.  
Each student digitally signs this before starting lab access — reinforcing accountability and professional integrity.
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
The cyber world operates like a battlefield — with attackers, defenders, intelligence, and countermeasures constantly evolving.

Understanding *who* the attackers are, *why* they attack, and *how* they operate is fundamental to becoming a strong cybersecurity professional.
      `
      },
      {
        type: "image",
        value: "/lessonimages/cybersecurity/global-threat-map.png",
        alt: "Global Threat Map showing real-time attacks worldwide"
      },
      {
        type: "text",
        value: `
### ⚔️ The Modern Cyber Battlefield
Attackers vary in motivation, funding, and tactics:
- **Script Kiddies** — Beginners using ready-made tools without full understanding.
- **Cybercriminals** — Organized groups focused on profit (ransomware, data theft).
- **Hacktivists** — Ideology-driven attackers (social or political causes).
- **Nation-State Actors** — Highly skilled teams funded by governments.
- **Insiders** — Employees who cause harm, intentionally or accidentally.

Each type has distinct patterns that defenders must recognize.
      `
      },
      {
        type: "text",
        value: `
### 🧠 How It’s Used in the Real World
Security Operations Centers (SOCs) and Threat Intelligence Teams:
- Track **Indicators of Compromise (IoCs)** like IPs, hashes, or domains.
- Use **MITRE ATT&CK Framework** to map each tactic and technique.
- Feed insights into SIEM (e.g., Splunk, ELK) for automated detection.

This transforms data into actionable defense.
      `
      },
      {
        type: "image",
        value: "/lessonimages/cybersecurity/mitre-attack-lifecycle.png",
        alt: "MITRE ATT&CK Framework Lifecycle Diagram"
      },
      {
        type: "text",
        value: `
### 🔍 Visualization Idea (Interactive Dashboard)
Imagine a *Cyber Threat Map* in the lesson UI:
- Animated lines show ongoing simulated attacks from different regions.
- Hovering reveals details like “Ransomware Campaign – Origin: Russia – Target: Finance.”
- Clicking highlights the MITRE ATT&CK phase: *Initial Access → Lateral Movement → Data Exfiltration*.

This gamified visualization helps learners connect **attacker behavior** with **defensive strategy**.
      `
      },

      // Simulation for Threat Map
      {
        type: "component",
        value: ThreatMapSimulator
      },

      {
        type: "text",
        value: `
### 🧩 Career Relevance
Understanding threat actors and frameworks is essential for:
- **SOC Analyst** → Detecting real-world intrusions
- **Threat Intelligence Specialist** → Tracking APT groups
- **Penetration Tester** → Emulating realistic attacker patterns
- **Incident Responder** → Containing attacks efficiently
      `
      },
      {
        type: "text",
        value: `
### 🧾 Exercise — Attack Surface Mapping
Pick a simple app like a *To-Do Web Service* and identify its attack surface:
1. Web server  
2. API endpoints  
3. Database  
4. Authentication module  
5. Third-party integrations  

Then mark which components might attract each type of attacker (e.g., insiders → database, cybercriminals → APIs).
      `
      },
      {
        type: "text",
        value: `
### 🚀 Mini Project
Design a small “Threat Intelligence Report” — summarize one real-world breach (e.g., SolarWinds, Equifax) and map its phases to MITRE ATT&CK tactics.

Deliverables:
- Timeline of the attack  
- MITRE mapping  
- Defense recommendations
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
Networking is the foundation of cybersecurity. Every cyberattack, data breach, or defense operation relies on understanding **how packets travel** and **how systems communicate**.
      `
      },
      {
        type: "image",
        value: "/lessonimages/cybersecurity/network-topology-basics.png",
        alt: "Network topology diagram showing clients, firewall, servers, and internet gateways"
      },
      {
        type: "text",
        value: `
### 🌐 Why It Matters
- Attackers exploit open ports, weak firewalls, and misconfigured routing.  
- Defenders analyze logs, packets, and flows to trace attacks.  
- Understanding TCP/IP and OSI layers lets you dissect incidents confidently.
      `
      },
      {
        type: "text",
        value: `
### ⚙️ How It’s Used Professionally
- **SOC Analysts** monitor network traffic for suspicious spikes.  
- **Penetration Testers** map ports/services to identify weak points.  
- **Network Engineers** design segmentation to limit attack spread.
      `
      },
      {
        type: "text",
        value: `
### 🧠 Core Concepts
| Concept | Description | Tool Example |
|----------|--------------|---------------|
| IP Addressing | Identifies devices on a network | ifconfig, ip addr |
| Ports & Protocols | Define communication endpoints | nmap, netstat |
| Firewalls | Filter allowed/blocked traffic | iptables, AWS SG |
| DNS | Resolves names to IPs | dig, nslookup |
| VPN | Encrypts traffic tunnels | OpenVPN |
      `
      },
      {
        type: "image",
        value: "/lessonimages/cybersecurity/tcp-handshake-diagram.png",
        alt: "Animated TCP 3-way handshake diagram showing SYN, SYN-ACK, ACK"
      },
      {
        type: "text",
        value: `
### 📘 Visualization Idea
Interactive **Packet Flow Simulator** — the learner clicks “Start Handshake” and watches:
1️⃣ SYN → 2️⃣ SYN-ACK → 3️⃣ ACK  
Then TLS negotiation lights up green (encrypted) or red (plain text).
      `
      },

      // Packet flow simulator
      {
        type: "component",
        value: PacketFlowSimulator
      },

      {
        type: "text",
        value: `
### 🧪 Safe Lab Exercise
- Run two Docker containers (client/server).  
- Capture packets with Wireshark or tcpdump.  
- Identify handshake, protocol, and ports.  
Record: *Who initiated connection? Which port was used?*
      `
      },
      {
        type: "text",
        value: `
### 🚀 Mini Project
Design a **network segmentation plan** for a startup:  
- Public subnet for web app  
- Private subnet for DB  
- Jump host for admins  
Document how segmentation reduces attack surface.
      `
      }
    ]
  },

  {
    slug: "network-traffic-analysis",
    title: "Network Traffic Analysis & Packet Inspection",
    content: [
      {
        type: "text",
        value: `
Once you know networking theory, the next skill is reading **live network packets** — the digital footprints of every connection.
      `
      },
      {
        type: "image",
        value: "/lessonimages/cybersecurity/packet-analysis-dashboard.png",
        alt: "Network packet analysis dashboard showing protocol breakdown and alerts"
      },
      {
        type: "text",
        value: `
### 🔍 Why Analysts Care
- Attackers hide C2 (command-and-control) traffic inside normal protocols.  
- Malware detection often starts by inspecting outbound packets.  
- SOC teams identify breaches by correlating anomalies with network logs.
      `
      },
      {
        type: "text",
        value: `
### 🧠 Core Concepts
- **PCAP Files** – Raw packet captures  
- **Protocol Dissection** – Viewing HTTP, DNS, SSL fields  
- **Indicators of Compromise (IoCs)** – Suspicious IPs/domains  
- **TLS Fingerprinting** – Detecting fake certificates  
- **Filtering Rules** – “Show all traffic to 10.0.0.5 over port 443”
      `
      },
      {
        type: "text",
        value: `
### 🧪 Practical Task
Open a sample PCAP (safe) and:
1. Count HTTP vs HTTPS requests  
2. Identify DNS queries  
3. Spot any unusual large outbound traffic
      `
      },
      {
        type: "text",
        value: `
### 💡 Visualization Idea
A dynamic **Packet Timeline View** — packets animate across the screen with labels like “SYN”, “GET /index.html”, “TLS Handshake”. Hover to view headers and payload size.
      `
      },

      // Packet timeline simulator
      {
        type: "component",
        value: PacketTimelineSimulator
      },

      {
        type: "text",
        value: `
### 🧾 Exercise
Create your own filter in Wireshark to display only TCP port 80 traffic.  
Then modify it to show only failed handshakes.  
Document how this helps detect scanning or DoS activity.
      `
      },
      {
        type: "text",
        value: `
### 🚀 Mini Project
Simulate a DDoS detection scenario using a safe synthetic dataset.  
Generate normal vs attack traffic, analyze spikes, and produce a small **SOC-style alert summary** explaining your findings.
      `
      }
    ]
  },

  {
    slug: "linux-basics-for-cybersec",
    title: "Linux Essentials for Security & System Hardening",
    content: [
      {
        type: "text",
        value: `Linux is the operating system that powers most servers, cloud systems and security tooling. This lesson focuses on safe administration, file permissions, logs, basic hardening and the command-line skills every defender and tester must have.`
      },
      {
        type: "image",
        value: "/lessonimages/cybersecurity/linux-file-permission-matrix.png",
        alt: "Linux file permission matrix (rwx for user/group/other)"
      },
      {
        type: "text",
        value: `### Learning Objectives
- Understand Linux filesystem structure and permission model (u/g/o, rwx).  
- Use essential commands for process, network and log inspection.  
- Apply basic hardening: remove unused services, secure SSH, limit user privileges.  
- Practice safe, reproducible labs using VMs or containers (no production systems).`
      },
      {
        type: "text",
        value: `### Quick Commands (must-know)
- List files & permissions: \`ls -l\`  
- Change permissions/owner: \`chmod 640 file\`, \`chown user:group file\`  
- Check processes: \`ps aux\`, \`top\`  
- Network sockets: \`ss -ltnp\` or \`netstat -tulnp\`  
- Read logs: \`sudo tail -n 200 /var/log/auth.log\` or \`journalctl -u ssh.service\``
      },
      {
        type: "code",
        language: "bash",
        value: `# Create a limited user and test permissions
sudo adduser student1
sudo usermod -aG developers student1
sudo touch /srv/app/config.txt
sudo chown root:developers /srv/app/config.txt
sudo chmod 640 /srv/app/config.txt
# As 'student1' verify you cannot write to the file
su - student1
echo "test" >> /srv/app/config.txt  # should be denied`,
        runnable: false
      },
      {
        type: "text",
        value: `### System Hardening Checklist (practical)
- Disable unnecessary services (systemctl disable --now <service>)  
- Ensure SSH uses key-based auth, disable root login, and configure strong KDF/algorithms.  
- Regularly review sudoers and group membership.  
- Configure a basic host-based firewall (ufw/iptables) with least-privilege rules.`
      },
      {
        type: "text",
        value: `### Log Investigation & Forensics (starter)
- Common logs: /var/log/auth.log, /var/log/syslog, /var/log/messages  
- Look for: repeated failed logins, suspicious sudo usage, new service start times.  
- Use \`grep\` or \`awk\` to filter logs for suspicious patterns.`
      },
      {
        type: "text",
        value: `### Visualization / Interactive UI Ideas
- **Permission Matrix**: toggle rwx bits visually and show access results for specific users.  
- **Process Tree**: interactive map of parent → child processes highlighting unknown binaries.`
      },

      // Linux permission simulator
      {
        type: "component",
        value: LinuxPermissionSimulator
      },

      {
        type: "image",
        value: "/lessonimages/cybersecurity/linux-log-analysis-flow.png",
        alt: "Linux log analysis flow: system -> log files -> SIEM"
      },
      {
        type: "text",
        value: `### Safe Lab Exercise
Set up a disposable VM or Docker container:
1. Add a user 'student1' and add them to a non-privileged group.  
2. Create /srv/app/config.txt owned by root:developers with 640 perms. Verify student cannot write.  
3. Simulate failed logins and then search /var/log/auth.log for related entries.  
Document commands used and explain how each step improves security.`
      },
      {
        type: "text",
        value: `### Mini Project – Hardening Script
Create a bash script that checks:
- SSH root login disabled (\`/etc/ssh/sshd_config\`)  
- Password policy (check /etc/login.defs or /etc/pam.d)  
- Running services list vs an approved list and print differences  
Output a simple report that can be reviewed by an instructor.`
      },
      {
        type: "text",
        value: `### Career Notes
Skills here are directly applicable for:
- SOC Engineer (log triage, host hardening)  
- Incident Responder (forensic basics)  
- Cloud Security Engineer (secure AMIs and images)  
Include these in your portfolio: screenshot of hardened config, sample log analysis snippet, and the hardening script.`
      }
    ]
  },

  {
    slug: "firewalls-ids-ips",
    title: "Firewalls, IDS & IPS — Defensive Shields of the Network",
    content: [
      {
        type: "text",
        value: `
Every secure network is protected by layers — **Firewalls**, **Intrusion Detection Systems (IDS)**, and **Intrusion Prevention Systems (IPS)**.  
These are your **first line of defense** against external and internal threats.
      `
    },
    {
      type: "image",
      value: "/lessonimages/cybersecurity/defense-in-depth.png",
      alt: "Defense in Depth layered security architecture"
    },
    {
      type: "image",
      value: "/lessonimages/cybersecurity/firewall-layers-diagram.png",
      alt: "Firewall and IDS layered defense architecture diagram"
    },
    {
      type: "text",
      value: `
### 🎯 Learning Objectives
- Understand the role of firewalls, IDS, and IPS in network defense.  
- Learn how packet filtering and rule matching work.  
- Differentiate between detection and prevention systems.  
- Simulate how packets are allowed or blocked based on configured rules.
      `
    },
    {
      type: "text",
      value: `
### 🧱 1. Firewalls — Gatekeepers of Traffic
A **firewall** inspects network packets and decides whether to allow or deny them based on rules.

**Types:**
- **Packet Filtering Firewall:** Basic checks (IP, port, protocol).  
- **Stateful Firewall:** Tracks session states (connection initiation and termination).  
- **Application Firewall / WAF:** Filters HTTP requests at Layer 7 for attacks like SQLi, XSS.

**Example Rule:**
\`ALLOW tcp FROM 192.168.1.0/24 TO ANY PORT 22\`
      `
    },
    {
      type: "code",
      language: "bash",
      value: `# Basic UFW firewall commands (Ubuntu)
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status verbose`,
      runnable: false
    },
    {
      type: "text",
      value: `
### 🕵️ 2. Intrusion Detection & Prevention Systems
IDS and IPS go beyond simple filtering — they analyze **patterns**, **signatures**, and **behavior**.

| Feature | IDS | IPS |
|----------|-----|-----|
| Action | Detects only | Detects + Blocks |
| Placement | Out-of-band | Inline |
| Tools | Snort, Suricata, Zeek | Snort (IPS mode), Suricata |
| Focus | Alerting | Active defense |

An IDS monitors traffic and raises alerts; an IPS can drop malicious packets before they reach the host.
      `
    },
    {
      type: "image",
      value: "/lessonimages/cybersecurity/ids-packet-flow.png",
      alt: "Packet flow through IDS and IPS detection pipeline"
    },
    {
      type: "text",
      value: `
### 💻 3. Simulation — Firewall Rule Visualizer (UI Idea)
Learner can toggle rules like:
- Allow Port 22 → ✅ SSH connects
- Deny Port 80 → ❌ HTTP blocked
- Allow 443 → ✅ HTTPS works

Each action updates a **live diagram** showing packet traversal through firewall → IDS → host.  
This visual reinforcement builds intuition on how layered defense functions.
      `
    },
    {
      type: "text",
      value: `
### 💻 Interactive Simulation — Firewall Rule Visualizer  
Below is a live simulation. Toggle Allow/Deny for each port and send packets to see what happens!
      `
    },

    // ✅ Simulation Component Integration
    {
      type: "component",
      value: FirewallSimulator
    },

    {
      type: "text",
      value: `
### 🧪 Safe Lab Exercise
1. Run two Docker containers — client and web server.  
2. Enable UFW on the server; only allow ports 22 and 443.  
3. From client, try \`curl\` on 80 and 443 — note responses.  
4. Observe blocked connections in \`/var/log/ufw.log\`.  
5. (Optional) Install Snort in IDS mode and capture alerts.  
Record which packets were dropped vs allowed.
      `
    },
    {
      type: "text",
      value: `
### 🚀 Mini Project — “Build Your Own Mini-Firewall”
Create a Python script that:
- Reads a simple ruleset (JSON: port, protocol, action).  
- Accepts simulated packets as input.  
- Outputs “ALLOW” or “BLOCK” with rule match reason.

Optional: visualize results in browser using your simulation interface.
      `
    },
    {
      type: "text",
      value: `
### 🎓 Career Notes
Knowledge of firewall and IDS operations is critical for:
- **SOC Analyst** — interpreting alerts and tuning signatures.  
- **Network Security Engineer** — designing rule sets and segmenting networks.  
- **Red Teamers** — understanding bypass methods (for ethical testing).  

Mastering these tools helps you think like both **defender and attacker**.
      `
    }
  ]
},
{
  slug: "malware-phishing-endpoint-protection",
  title: "Malware, Phishing & Endpoint Protection — Guarding the Human and the Machine",
  content: [
    {
      type: "text",
      value: `
The most sophisticated firewalls and IDS won't help if malware slips through an unsuspecting user’s click.  
**Endpoint security** protects where humans and machines meet — your laptop, phone, and email inbox.
      `
    },
    {
      type: "image",
      value: "/lessonimages/cybersecurity/malware-types-overview.png",
      alt: "Overview of common malware types and infection vectors"
    },
    {
      type: "text",
      value: `
### 🦠 Common Malware Types
| Type | Description | Example |
|------|--------------|----------|
| Virus | Attaches to files and spreads when executed | ILOVEYOU |
| Worm | Self-replicates without human action | Conficker |
| Trojan | Disguises as legitimate software | FakeAV |
| Ransomware | Encrypts data and demands payment | WannaCry |
| Spyware | Monitors user activity silently | Pegasus |
      `
    },
    {
      type: "image",
      value: "/lessonimages/cybersecurity/phishing-flow.png",
      alt: "Phishing attack flow from email to credential theft"
    },
    {
      type: "text",
      value: `
### 🎯 Phishing Attacks
Phishing is **social engineering via email or messages**:
- Pretends to be a trusted source (bank, HR, cloud login)
- Tricks user into clicking links or giving credentials
- Can install malware or steal data
      `
    },
    {
      type: "text",
      value: `
### 💻 Interactive Simulation — Phishing Email Classifier
Below is a simulation where you review sample emails and classify them as *Phishing* or *Legitimate*.  
This builds critical human firewall instincts.
      `
    },
    {
      type: "component",
      value: PhishingEmailSimulator
    },
    {
      type: "text",
      value: `
### 🧰 Endpoint Defense Layers
| Layer | Description |
|--------|-------------|
| Antivirus | Scans and quarantines malicious files |
| EDR | Monitors process behavior and isolates suspicious actions |
| DLP | Prevents sensitive data from leaving the device |
| Patch Management | Keeps OS and apps up-to-date |
| User Awareness | Trains users to spot phishing attempts |
      `
    },
    {
      type: "image",
      value: "/lessonimages/cybersecurity/endpoint-defense-architecture.png",
      alt: "Endpoint defense architecture showing AV, EDR, DLP, and user awareness"
    },
    {
      type: "text",
      value: `
### 🧪 Safe Lab Exercise
1. Set up a Windows or Linux VM with an open-source antivirus (ClamAV, Windows Defender).  
2. Download the **EICAR test file** (safe malware test) and observe detection behavior.  
3. Simulate phishing awareness by analyzing real vs fake email headers.
      `
    },
    {
      type: "text",
      value: `
### 🚀 Mini Project — Endpoint Defense Report
Create a short report documenting:
- How ransomware encrypts data  
- How antivirus or EDR detects it  
- What prevention methods users can adopt (patching, backups, training)
      `
    },
    {
      type: "text",
      value: `
### 🎓 Career Notes
Mastering endpoint protection is essential for:
- **SOC Analyst** — analyzing alerts from antivirus and EDR tools  
- **Incident Responder** — isolating infected machines  
- **Security Awareness Trainer** — educating users on phishing defense  
      `
    }
  ]
},
{
  slug: "vulnerability-management",
  title: "Vulnerability Management & Patch Lifecycle",
  content: [
    {
      type: "text",
      value: `
Every system has weaknesses — **vulnerabilities** — that attackers exploit.  
Vulnerability management ensures those weaknesses are **identified, prioritized, and patched** before exploitation.
      `
    },
    {
      type: "image",
      value: "/lessonimages/cybersecurity/vulnerability-lifecycle.png",
      alt: "Vulnerability management lifecycle diagram"
    },
    {
      type: "text",
      value: `
### 🧱 The Lifecycle
1. **Discovery** – Identify assets and scan for known vulnerabilities  
2. **Assessment** – Analyze severity using CVSS (Common Vulnerability Scoring System)  
3. **Prioritization** – Fix high-risk systems first  
4. **Remediation** – Apply patches, updates, or mitigations  
5. **Verification** – Re-scan to ensure the issue is resolved
      `
    },
    {
      type: "image",
      value: "/lessonimages/cybersecurity/cvss-score-chart.png",
      alt: "CVSS scoring chart showing critical, high, medium, low"
    },
    {
      type: "text",
      value: `
### 💻 Interactive Simulation — Vulnerability Scanner
Run the following simulation to perform a scan across virtual hosts and analyze detected CVEs.
      `
    },
    {
      type: "component",
      value: VulnerabilityScannerSimulator
    },
    {
      type: "text",
      value: `
### 🧪 Safe Lab Exercise
- Use **Nmap** or **OpenVAS** in a safe lab VM.  
- Scan a local Docker network (avoid public IPs).  
- Identify open ports, outdated services, and related CVEs.  
Document your scan summary and prioritize which vulnerabilities to fix first.
      `
    },
    {
      type: "text",
      value: `
### 🚀 Mini Project
Create a **Patch Management Tracker** in Excel or JSON format.  
Track:
- System name  
- Software version  
- Last patched date  
- CVE reference  
- Status (Pending / Fixed / Verified)
      `
    },
    {
      type: "text",
      value: `
### 🎓 Career Notes
Knowledge of vulnerability scanning and patch management is key for:
- **SOC Analyst** – detecting vulnerable systems  
- **Vulnerability Manager** – overseeing patch compliance  
- **Penetration Tester** – validating real-world exploitability  
- **Security Engineer** – automating remediation workflows
      `
    }
  ]
},
{
  slug: "siem-incident-response",
  title: "SIEM & Incident Response — Detect, Analyze, Respond",
  content: [
    {
      type: "text",
      value: `
In modern cybersecurity, prevention alone is not enough — detection and response are equally critical.  
This is where **SIEM (Security Information and Event Management)** and **Incident Response (IR)** come into play.
      `
    },
    {
      type: "image",
      value: "/lessonimages/cybersecurity/siem-architecture.png",
      alt: "SIEM system architecture showing log sources, correlation engine, dashboards, and SOC workflow"
    },
    {
      type: "text",
      value: `
### 🔍 SIEM Components
1. **Log Collection:** Data from firewalls, servers, endpoints, and cloud systems.  
2. **Normalization & Correlation:** Identifies patterns across multiple sources.  
3. **Alerting & Dashboards:** Notifies analysts about suspicious behavior.  
4. **Threat Hunting:** Analysts proactively search for anomalies.
      `
    },
    {
      type: "text",
      value: `
### ⚡ Incident Response Phases (NIST Model)
1. **Preparation** — Develop response policies and tools.  
2. **Detection & Analysis** — Identify potential security events.  
3. **Containment** — Isolate affected systems to prevent spread.  
4. **Eradication** — Remove the root cause.  
5. **Recovery** — Restore operations safely.  
6. **Post-Incident Review** — Document lessons learned.
      `
    },
    {
      type: "image",
      value: "/lessonimages/cybersecurity/incident-response-cycle.png",
      alt: "Incident response lifecycle showing preparation, detection, containment, eradication, recovery, and review"
    },
    {
      type: "text",
      value: `
### 💻 Interactive Simulation — SIEM Log Analyzer
Watch live logs and identify when a potential incident occurs.
      `
    },
    {
      type: "component",
      value: SIEMLogAnalyzerSimulator
    },
    {
      type: "text",
      value: `
### 🧪 Safe Lab Exercise
- Deploy **Wazuh**, **Splunk**, or **ELK Stack** in a local VM.  
- Ingest Linux and web server logs.  
- Create a rule to detect repeated failed logins or privilege escalations.  
- Document alert triggers and analyst response.
      `
    },
    {
      type: "text",
      value: `
### 🚀 Mini Project
Build a small **Incident Response Playbook** (Markdown or PDF):  
Include:
- How to identify a brute-force attack  
- What containment steps to take  
- Communication protocol  
- Evidence collection checklist
      `
    },
    {
      type: "text",
      value: `
### 🎓 Career Notes
Mastery of SIEM and IR workflows is required for:
- **SOC Analyst (Tier 1 & 2)**  
- **Incident Responder**  
- **Threat Hunter**  
- **Blue Team Engineer**
      `
    }
  ]
},
{
  slug: "digital-forensics-evidence-handling",
  title: "Digital Forensics & Evidence Handling",
  content: [
    {
      type: "text",
      value: `
Digital forensics is the science of collecting, preserving, and analyzing digital evidence.  
This lesson teaches how to treat evidence properly, verify integrity, and build a defensible timeline.
      `
    },
    {
      type: "image",
      value: "/lessonimages/cybersecurity/forensics-process.png",
      alt: "Digital forensics process: Identification → Preservation → Collection → Examination → Analysis → Reporting"
    },
    {
      type: "text",
      value: `
### 🔎 Key Concepts
- **Chain of Custody** — who handled evidence and when  
- **Hashing** — proving evidence integrity (SHA-256, MD5 historically)  
- **Mounting read-only images** — avoid modifying original media  
- **File carving** — recover deleted files from raw bytes  
- **Timeline analysis** — reconstruct events chronologically
      `
    },
    {
      type: "image",
      value: "/lessonimages/cybersecurity/chain-of-custody.png",
      alt: "Chain of custody example with timestamps, handlers, and storage"
    },
    {
      type: "text",
      value: `
### 💻 Interactive Simulation — Forensics Lab
Practice ingesting a sample, compute SHA-256, build a timeline, and try a simple carving exercise.
      `
    },
    {
      type: "component",
      value: ForensicsSimulator
    },
    {
      type: "text",
      value: `
### 🧪 Safe Lab Exercise
1. Create a forensic image of a test VM disk (use dd or OSFClone).  
2. Compute SHA-256 of the original image and the copy — confirm they match.  
3. Use \`strings\` and hex viewers to find deleted file fragments and attempt carving.
      `
    },
    {
      type: "text",
      value: `
### 🚀 Mini Project
Produce a short forensic report for a simulated incident:
- Evidence description  
- SHA-256 hash values  
- Timeline of events  
- Findings and recommended next steps
      `
    },
    {
      type: "text",
      value: `
### 🎓 Career Notes
Skills here feed directly into:
- **Forensic Analyst** — evidence collection and analysis  
- **Incident Responder** — preserving and triaging compromised systems  
- **eDiscovery Specialist** — legal admissibility of digital evidence
      `
    }
  ]
},


];

export default cybersecurityEssentials;
