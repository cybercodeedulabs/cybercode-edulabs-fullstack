// src/data/lessons/networking-ccna.js
// Lesson 1 — Networking Basics (expanded, tutorial style)
import BasicLanSimulator from "../../components/simulations/ccna/BasicLanSimulator";
import NetworkDeviceQuiz from "../../components/simulations/ccna/NetworkDeviceQuiz";
import OSIFlowSimulation from "../../components/simulations/ccna/OSIFlowSimulation";

const networkingCCNA = [
  {
    slug: "networking-basics",
    title: "Networking Basics",
    content: [
      // Intro
      {
        type: "text",
        title: "Overview — What is a Computer Network?",
        value: `
A **computer network** is a collection of devices (hosts) — such as PCs, servers, printers, and mobile devices — connected together so they can **exchange data and share resources**.

At a practical level, networks let users:
- Access the internet
- Share files and printers
- Use remote services (mail, databases, authentication)
- Build distributed applications (web, cloud, microservices)

This lesson takes a practical, job-focused approach: you'll learn not just definitions, but how networks are built, how data moves, and what you must know to configure and troubleshoot basic networks in real environments.
        `
      },

      // Why networking matters
      {
        type: "text",
        title: "Why Networking Matters in Real Jobs",
        value: `
Networking underpins almost every IT role:
- System administrators depend on networks to connect servers and monitoring systems.
- DevOps engineers rely on networking concepts for CI/CD, container orchestration, and cloud connectivity.
- Security engineers design and validate firewalls, segmentation, and secure remote access.

Understanding networking makes your work predictable: you will be able to identify whether a service failure is an application bug, a firewall rule, or an IP routing issue — which saves time and reduces outages.
        `
      },

      // Image - overview
      {
        type: "image",
        value: "/lessonimages/ccna/networking-overview-diagram.png",
        alt: "High-level network diagram: clients, switch, router, internet cloud"
      },

      // Types of networks
      {
        type: "text",
        title: "Common Network Types (practical view)",
        value: `
**LAN (Local Area Network)** — small geographic area (office, home). Usually high-speed Ethernet or Wi-Fi.  
**WAN (Wide Area Network)** — connects multiple LANs across cities or countries (via ISPs, MPLS, VPN).  
**MAN (Metropolitan Area Network)** — larger than LAN, smaller than WAN (campus networks).  
**PAN (Personal Area Network)** — very small, personal devices (Bluetooth, tethering).

**Job note:** when someone says "configure the network", they usually mean LAN + routing to upstream ISP with correct IP/subnet and access controls.
        `
      },

      // Devices
      {
        type: "text",
        title: "Network Devices — Role and Behavior",
        value: `
Below are the devices you will encounter and what each does in practical terms:

- **NIC (Network Interface Card)**: hardware in each device; gets an IP and MAC address.
- **Switch**: lives inside a LAN. Forwards Ethernet frames based on MAC addresses. Switches create separate collision domains for each port (full-duplex reduces collisions).
- **Router**: routes IP packets between different networks/subnets and the internet. A router uses routing tables and forwarding logic.
- **Firewall**: applies security policy by filtering traffic (stateful or stateless).
- **Access Point (AP)**: provides Wi-Fi connectivity and bridges wireless clients to the wired LAN.
- **Load Balancer**: distributes incoming service requests across multiple servers.

**Important:** switches operate at Layer 2 (Ethernet frames), routers operate at Layer 3 (IP packets). This L2/L3 separation is fundamental to design and troubleshooting.
        `
      },

      // Image - devices
      {
        type: "image",
        value: "/lessonimages/ccna/network-devices.png",
        alt: "Icons and short descriptions of Router, Switch, Firewall, Access Point"
      },

      // Small lab simulation placeholder
      {
        type: "component",
        title: "🧩 Simulation: Basic LAN Setup (interactive)",
        value: BasicLanSimulator
      },

      // How data flows - packet journey
      {
        type: "text",
        title: "How Data Flows — the Packet Journey (step-by-step)",
        value: `
Imagine PC-A (192.168.1.10) pings PC-B (192.168.1.20) through a switch:

1. **Application Layer**: ping app creates an ICMP packet.
2. **Transport/Network**: OS builds an IP packet (src=192.168.1.10, dst=192.168.1.20).
3. **Data Link**: NIC wraps the IP packet in an Ethernet frame. Destination MAC = PC-B's MAC.
4. **Switch**: receives frame, looks up MAC in CAM table, forwards frame only to the port where PC-B is attached.
5. **PC-B**: receives frame, strips headers, processes IP/ICMP, responds.

If PC-B were on a different subnet (192.168.2.20), the packet goes to the default gateway (router), which routes the packet across subnets.

**Visual debugging tip:** use \`ping\`, \`traceroute\` (or \`tracert\` on Windows) to see hop-by-hop behavior and identify where packets stop.
        `
      },

      // Subnetting intro
      {
        type: "text",
        title: "IP Addressing & Subnetting (practical introduction)",
        value: `
**IP Address (IPv4)**: four octets, e.g., 192.168.1.10. A network mask (e.g., /24) separates network and host bits.

- **Network example:** 192.168.1.0/24
  - Network: 192.168.1.0
  - Usable hosts: 192.168.1.1–192.168.1.254
  - Broadcast: 192.168.1.255

**Why subnet?**
- Segmentation for security (separate servers from workstations).
- Better performance and smaller broadcast domains.
- Logical organization of services (VLANs per department).

**Quick rule:** For /24, host count = 2^(32-24) - 2 = 254 usable hosts. For interviews, always be ready to explain this math step-by-step.
        `
      },

      // Subnetting example code-like explanation
      {
        type: "code",
        language: "text",
        runnable: false,
        value: `# Example: divide 192.168.1.0/24 into two /25 subnets
Subnet 1: 192.168.1.0/25 -> hosts 192.168.1.1 - 192.168.1.126
Subnet 2: 192.168.1.128/25 -> hosts 192.168.1.129 - 192.168.1.254`
      },

      // Broadcast vs Collision domain explanation
      {
        type: "text",
        title: "Collision Domains vs Broadcast Domains (practical)",
        value: `
**Collision domain** — where frames can collide (historically with hubs / half-duplex Ethernet). Modern switches make each port its own collision domain (full duplex), so collisions are rare with switches.

**Broadcast domain** — where broadcast frames are forwarded (Layer 2). A VLAN or an L2 switch defines a broadcast domain. Routers separate broadcast domains: broadcasts do not cross routers.

**Practical implication:** To reduce unnecessary broadcast traffic, split large networks with VLANs or subnets, and place routers/firewalls accordingly.
        `
      },

      // VLANs introduction
      {
        type: "text",
        title: "VLANs — Logical segmentation",
        value: `
**VLAN (Virtual LAN)**: creates multiple logical broadcast domains on the same physical switch. VLANs provide segmentation and security without extra cabling.

Example: VLAN 10 = Finance, VLAN 20 = Engineering. A trunk link between switches carries multiple VLANs using 802.1Q tagging. To communicate across VLANs, use a router or Layer 3 switch (inter-VLAN routing).
        `
      },

      // Basic Cisco IOS snippets - configuration examples
      {
        type: "code",
        language: "bash",
        runnable: false,
        value: `! Basic switch port configuration (Cisco IOS)
configure terminal
interface GigabitEthernet0/1
 description "Workstation Port"
 switchport mode access
 switchport access vlan 10
 spanning-tree portfast
exit

! Basic router interface and routing
configure terminal
interface GigabitEthernet0/0
 ip address 192.168.1.1 255.255.255.0
 no shutdown
exit

ip route 0.0.0.0 0.0.0.0 203.0.113.1  ! default route to ISP`
      },

      // Troubleshooting section
      {
        type: "text",
        title: "Troubleshooting — a practical checklist",
        value: `
When something breaks, follow this checklist (work like an engineer):

1. **Ping test**:
   - Ping loopback: ` + "`127.0.0.1`" + ` (local stack check).
   - Ping local IP: confirms NIC/driver.
   - Ping gateway: verify L2 + L3 local path.
   - Ping external IP: verify routing to internet.
2. **Check ARP**: ` + "`arp -a`" + ` to see MAC/IP mappings.
3. **Check switch CAM table** (on managed switches): confirm MAC learning.
4. **Traceroute**: find the hop where packets stop.
5. **Check VLANs/trunk config**: mis-tagging often causes “no connectivity but same IP range” issues.
6. **Port status**: check \`show interfaces\` for errors, speed/duplex mismatches.
7. **Check firewall rules**: blocked ports or IPs frequently cause failures.

Document steps and results — engineers rely on reproducible steps when escalating.
        `
      },

      // Simulation quiz placeholder
      {
        type: "component",
        title: "🧠 Quiz Simulation: Identify Network Devices",
        value: NetworkDeviceQuiz
      },

      // Common tools / commands
      {
        type: "text",
        title: "Essential Commands & Tools (practical use)",
        value: `
**Windows**
- ` + "`ipconfig /all`" + ` — view IP config
- ` + "`ping <ip>`" + ` — connectivity test
- ` + "`tracert <host>`" + ` — trace route

**Linux / macOS**
- ` + "`ifconfig || ip a`" + ` — network interfaces
- ` + "`ping <host>`" + `
- ` + "`traceroute <host>`" + `

**Network tools**
- Wireshark — packet capture & analysis (learn to filter by IP, TCP/UDP ports).
- nmap — network scanning and discovery.
- netstat / ss — socket information and listening services.

**Job tip:** Be able to show a captured packet from Wireshark and explain each header quickly in interviews.
        `
      },

      // Real-world scenario
      {
        type: "text",
        title: "Real-World Example: Small Office Setup (step-by-step)",
        value: `
Typical small office network plan:
1. ISP modem connects to office **router** (public IP).
2. Router NATs and forwards to internal **switch** (192.168.10.0/24).
3. Switch ports assigned to VLAN 10 (employees) and VLAN 20 (guests).
4. Wi-Fi access points trunk VLANs, use captive portal for guest VLAN.
5. Firewall rules block guest -> internal servers; allow guest -> internet.

**Deliverable for a junior engineer:** Provide a concise diagram, IP plan, VLAN mapping, and simple ACL rules. This is often in the job description for junior network roles.
        `
      },

      // Interview/assessment checklist
      {
        type: "text",
        title: "What interviewers expect from a CCNA-level candidate",
        value: `
- Clear understanding of IP/subnet math and ability to calculate subnets fast.
- Can explain the difference between switch vs router vs firewall.
- Familiarity with switching concepts (VLANs, STP, trunking).
- Basic CLI comfort (showing interfaces, ping, traceroute, basic routing commands).
- Troubleshooting mindset and ability to describe steps taken.
- Security basics — VLAN separation, basic ACLs, SSH instead of telnet.

Practice answering scenario questions with a short plan and steps you would take.
        `
      },

      // Further reading / study plan
      {
        type: "text",
        title: "Study Plan & Resources (30-day starter)",
        value: `
Days 1–7: IP addressing & subnetting practice (daily drills).  
Days 8–14: Ethernet fundamentals, switching & VLAN hands-on in a lab.  
Days 15–21: Routing basics (static and dynamic overview), small home lab with 2 routers.  
Days 22–30: Security basics, Wi-Fi + troubleshooting, prepare 20 interview Q&A.

Resources:
- Cisco Packet Tracer (simulation) or GNS3 for realistic labs.
- Wireshark for packet analysis.
- CCNA official guide for structured topics.
        `
      },

      // Summary
      {
        type: "text",
        title: "Key Takeaways — Lesson 1",
        value: `
- Networks connect devices for communication and resource sharing.  
- Switches operate at L2 (MAC), routers at L3 (IP).  
- Subnetting and VLANs are the primary tools for segmentation.  
- Troubleshooting follows methodical steps; familiarity with CLI tools is essential.  
- Hands-on lab practice (Packet Tracer/GNS3/Wireshark) accelerates understanding.
        `
      }
    ]
  },
  {
  slug: "osi-model-explained",
  title: "The OSI Model Explained",
  content: [
    {
      type: "text",
      value: `
### 🧩 What is the OSI Model?

The **OSI (Open Systems Interconnection)** model is a conceptual framework that defines how data travels from one device to another over a network.  
It breaks the process into **seven distinct layers**, each responsible for a specific part of data communication.

The OSI model ensures **interoperability** between systems, meaning devices from different vendors (like Cisco, Juniper, HP) can communicate seamlessly.

---

### 🌈 The 7 Layers of the OSI Model

| Layer | Name | Function | Example Protocols / Devices |
|-------|------|-----------|-----------------------------|
| 7 | **Application** | Provides network services to user applications | HTTP, FTP, DNS, SMTP |
| 6 | **Presentation** | Translates, encrypts, or compresses data | SSL/TLS, JPEG, MP3 |
| 5 | **Session** | Manages connections and sessions between systems | RPC, NetBIOS |
| 4 | **Transport** | Provides reliable delivery and error correction | TCP, UDP |
| 3 | **Network** | Routes packets between different networks | IP, ICMP, Routers |
| 2 | **Data Link** | Handles MAC addresses and frames | Ethernet, Switches |
| 1 | **Physical** | Transmits raw bits over cables or air | Hubs, Cables, Wi-Fi |

Remember it using this mnemonic:  
👉 **"All People Seem To Need Data Processing"**

---

### ⚙️ How Data Moves Through the OSI Layers

When a user sends an email or visits a website:
1. The **Application Layer** creates the data (e.g., your HTTP request).  
2. The **Presentation Layer** encrypts or compresses it.  
3. The **Session Layer** opens a communication session with the server.  
4. The **Transport Layer** breaks it into **segments**.  
5. The **Network Layer** assigns **IP addresses** and routes data.  
6. The **Data Link Layer** adds **MAC addresses**.  
7. The **Physical Layer** transmits bits across the cable.

On the receiving side, this process **reverses** (de-encapsulation).

---

### 📡 OSI Model Visualization

      `
    },
    {
      type: "image",
      value: "/lessonimages/ccna/osi-model-diagram.png",
      alt: "Layered OSI Model Diagram showing flow from Application to Physical"
    },
    {
      type: "text",
      value: `
---

### 🧠 Why OSI Model Matters for CCNA Students

- Helps troubleshoot issues layer-by-layer.  
  Example: If a website isn’t loading, is it a **Physical** issue (cable), **Network** issue (IP), or **Application** issue (DNS/HTTP)?
- Used in almost every **Cisco exam** question and real-world troubleshooting.
- Essential for **network design, packet analysis**, and **security inspection**.

---

### 🧪 Simulation: OSI Layer Data Flow Visualizer

This is a **custom-built simulation** (you’ll create it under \`/simulations/ccna/OSIFlowSimulation.jsx\`)  
that visually demonstrates **how data moves through each OSI layer**.

#### 💻 Simulation Description:
- You type a message like “Ping 192.168.1.1”.
- The simulator animates data **encapsulation**:
  - Adds headers/trailers layer by layer.
  - Shows what each layer contributes (e.g., IP header, TCP segment, frame, bits).
- You can toggle between **Sender View** and **Receiver View**.
- It shows color-coded packets traveling across a cable animation.
- The receiver then decapsulates layer by layer.

#### Example concept:
Each transition shows:
> “Transport Layer: Added TCP header”  
> “Network Layer: Added IP header (192.168.1.10 → 8.8.8.8)”  
> “Data Link Layer: Added MAC Frame”  
> “Physical Layer: Bits on the wire ⚡”

When reversed:
> “Receiver: Removed Physical layer bits → Up to Application Layer ✅”

---

### 🧩 Advanced Concept: Encapsulation & Decapsulation

Encapsulation means adding protocol-specific headers at each OSI layer.

For example, when sending an HTTP request:
- HTTP data is wrapped with a **TCP header** (Transport Layer)
- That’s wrapped with an **IP header** (Network Layer)
- Then wrapped with a **Frame header/trailer** (Data Link)
- Finally transmitted as **Bits** (Physical Layer)

Decapsulation is the reverse at the receiver side.

---

### ⚠️ Common Exam Tip

Cisco questions often ask:
> “At which OSI layer does a router operate?”

✅ **Answer:** Network Layer  
> “At which OSI layer do switches operate?”

✅ **Answer:** Data Link Layer  

---

### 🎯 Quick Recap

- The OSI model has **7 layers** — from **Application** (top) to **Physical** (bottom).
- Each layer performs **a unique function** in network communication.
- **Encapsulation/Decapsulation** describes data flow.
- It’s a must-know for **network design and troubleshooting**.

---
        `
    },
    {
      type: "component",
      value: OSIFlowSimulation
    }
  ]
},

];

export default networkingCCNA;
