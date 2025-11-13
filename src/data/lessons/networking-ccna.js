// src/data/lessons/networking-ccna.js
// Lesson 1 — Networking Basics (expanded, tutorial style)
import BasicLanSimulator from "../../components/simulations/ccna/BasicLanSimulator";
import NetworkDeviceQuiz from "../../components/simulations/ccna/NetworkDeviceQuiz";
import OSIFlowSimulation from "../../components/simulations/ccna/OSIFlowSimulation";
import IPSubnetVisualizer from "../../components/simulations/ccna/IPSubnetVisualizer";
import PacketRoutingSimulator from "../../components/simulations/ccna/PacketRoutingSimulator";

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
{
  slug: "ip-addressing-and-subnetting",
  title: "IP Addressing & Subnetting",
  content: [
    {
      type: "text",
      value: `
### 🌐 What is an IP Address?

An **IP address (Internet Protocol Address)** is a unique number assigned to each device connected to a network.  
It allows computers to **find and communicate** with each other, much like a phone number identifies a person.

An IPv4 address is **32 bits long**, represented as four octets separated by dots:

\`\`\`
192.168.10.15
\`\`\`

Each octet can range from **0 to 255**, because it represents 8 bits (2⁸ = 256 possible values).

---

### 🧩 IP Address Structure

An IP address is divided into two parts:

| Part | Description |
|------|--------------|
| **Network Portion** | Identifies the specific network. |
| **Host Portion** | Identifies a specific device (host) within that network. |

Example:  
In the address **192.168.10.15/24**,  
- **192.168.10** → Network portion  
- **.15** → Host portion  
- **/24** → Subnet mask (means 24 bits reserved for the network)

---

### ⚙️ Subnet Mask and CIDR Notation

A **Subnet Mask** defines how many bits are used for the network.

| CIDR | Subnet Mask | No. of Hosts | Example Network |
|------|--------------|--------------|-----------------|
| /8   | 255.0.0.0    | 16,777,214   | 10.0.0.0        |
| /16  | 255.255.0.0  | 65,534       | 172.16.0.0      |
| /24  | 255.255.255.0| 254          | 192.168.1.0     |
| /30  | 255.255.255.252 | 2         | Point-to-Point Link |

---

### 🧮 How Subnetting Works

Subnetting divides a larger network into smaller, more efficient subnetworks.

**Example:**
You have a network **192.168.10.0/24** (254 hosts).  
You want 4 subnets.

Each new subnet steals **2 bits** from the host portion:
\`\`\`
Original Mask: /24 → 11111111.11111111.11111111.00000000  
New Mask: /26 → 11111111.11111111.11111111.11000000
\`\`\`

This gives:
- **4 Subnets** → 192.168.10.0, .64, .128, .192  
- **62 Hosts per subnet**

---

### 🧠 Why Subnetting Matters

- Controls broadcast domains  
- Improves security and performance  
- Efficiently manages IP allocation  
- Reduces congestion in enterprise networks

---

### 📊 IPv4 Address Classes

| Class | Range | Default Mask | Usage |
|-------|--------|---------------|--------|
| A | 1.0.0.0 – 126.255.255.255 | /8 | Large organizations |
| B | 128.0.0.0 – 191.255.255.255 | /16 | Medium networks |
| C | 192.0.0.0 – 223.255.255.255 | /24 | Small networks |
| D | 224.0.0.0 – 239.255.255.255 | — | Multicasting |
| E | 240.0.0.0 – 255.255.255.255 | — | Experimental |

---

### 🧮 Binary to Decimal Conversion

Each octet in an IP address represents **8 bits**:

| Binary | Decimal |
|---------|----------|
| 11000000.10101000.00000001.00000001 | 192.168.1.1 |

Each bit has a value of **128, 64, 32, 16, 8, 4, 2, 1**

\`\`\`
192 = 128 + 64
168 = 128 + 32 + 8
1 = 1
\`\`\`

---

### 🔍 Public vs Private IPs

| Type | Range | Example |
|------|--------|----------|
| **Private (LAN use)** | 10.0.0.0–10.255.255.255 | 10.0.0.1 |
| | 172.16.0.0–172.31.255.255 | 172.16.10.1 |
| | 192.168.0.0–192.168.255.255 | 192.168.1.10 |
| **Public (Internet)** | Anything outside these ranges | 8.8.8.8 |

---

### 🧪 Simulation: IP Subnet Visualizer (Unique Concept)

This is a **highly interactive simulation** you’ll create under:
\`/simulations/ccna/IPSubnetVisualizer.jsx\`

#### 💡 Description:
- User inputs **network address** (e.g., 192.168.10.0) and **CIDR mask** (e.g., /26).  
- The simulator dynamically shows:
  - Binary and decimal representation
  - Number of subnets and hosts
  - Broadcast address
  - First and last usable IPs per subnet
- It visually *draws boxes* representing subnets with color-coded host ranges.
- A “Next Subnet” button scrolls through available subnets.

#### 🧭 Example Output:

---

### 🔥 Advanced Section: VLSM (Variable Length Subnet Masking)

VLSM allows **different subnet sizes** within one network block.  
This saves IPs by assigning just enough for each subnet.

Example:  
- Subnet A (50 hosts) → /26  
- Subnet B (10 hosts) → /28  
- Subnet C (2 hosts) → /30  

Each network gets *exactly what it needs*, no waste.

---

### 🧩 Quick Recap

- IPv4 addresses are **32-bit identifiers**
- **Subnetting** divides networks for better control
- **CIDR notation** simplifies addressing
- **VLSM** optimizes usage in modern networks
- Private vs Public IPs define internal vs Internet usage
- Subnetting is a **core CCNA skill** for routers and switches

---
      `
    },
    {
      type: "image",
      value: "/lessonimages/ccna/ip-subnet-diagram.png",
      alt: "Illustration showing IP address division into network and host portions"
    },
    {
      type: "component",
      value: IPSubnetVisualizer
    }
  ]
},
{
  slug: "routing-fundamentals",
  title: "Routing Fundamentals & Packet Flow",
  content: [
    {
      type: "text",
      value: `
### 🔹 1. Introduction to Routing

Routing is the process of determining the best path for data to travel from a source to its destination across interconnected networks.  
Unlike switches that operate within a single LAN (Layer 2), **routers operate at Layer 3 (the Network Layer)**, using IP addresses to make forwarding decisions.

When a packet leaves a network, it relies on routers to find its way to the next network.  
Each router in this journey acts like a checkpoint — examining the packet’s destination IP and deciding where to forward it next.

#### Real-world Analogy:
Think of routing like a GPS system. When you enter a destination, the GPS determines the best roads (routes) to take to reach your goal efficiently.

`
    },
    {
      type: "text",
      value: `
### 🔹 2. Role of a Router

A **router** connects multiple networks together.  
It examines packet headers, identifies destination IP addresses, and makes **path decisions** based on its internal routing table.

Each interface of a router belongs to a **different network**.

#### Example:
Router A might have:
- G0/0 → 192.168.10.1/24
- G0/1 → 10.0.0.1/24

This means Router A connects both **192.168.10.0/24** and **10.0.0.0/24** networks.
Packets arriving on one interface can be routed to another, as long as Router A knows how to reach the destination.

`
    },
    {
      type: "text",
      value: `
### 🔹 3. Types of Routing

Routing can be categorized into three main types based on how routes are learned and managed:

| Type | Description | Example Use |
|------|--------------|-------------|
| **Static Routing** | Manually configured routes by network administrators. | Small networks or fixed topologies. |
| **Dynamic Routing** | Automatically learned routes via routing protocols (like OSPF, RIP, EIGRP). | Medium to large scalable networks. |
| **Default Routing** | Used when no specific route matches a packet’s destination (usually 0.0.0.0/0). | Internet-bound traffic. |

#### Example:
\`ip route 0.0.0.0 0.0.0.0 10.0.0.254\`  
➡ This defines a default route that forwards all unknown traffic to the next-hop router 10.0.0.254.
`
    },
    {
      type: "text",
      value: `
### 🔹 4. Routing Table Explained

Each router maintains a **routing table**, which lists:
- Known networks
- Next-hop addresses
- Outgoing interfaces
- Metrics (e.g., cost or hop count)

#### Example: Routing Table of Router A

| Destination Network | Subnet Mask | Next Hop | Interface |
|----------------------|-------------|-----------|------------|
| 192.168.10.0 | 255.255.255.0 | — | G0/0 |
| 192.168.20.0 | 255.255.255.0 | 10.0.0.2 | G0/1 |
| 10.0.0.0 | 255.255.255.0 | — | G0/2 |
| 0.0.0.0 | 0.0.0.0 | 10.0.0.254 | G0/2 |

Each time a packet arrives, the router checks this table to determine the **next hop**.

`
    },
    {
      type: "text",
      value: `
### 🔹 5. How Packet Forwarding Works

Let’s follow the step-by-step process:

1️⃣ The packet arrives on a router interface.  
2️⃣ The router extracts the **destination IP address**.  
3️⃣ It compares the address with entries in its **routing table**.  
4️⃣ It selects the **best match** (longest prefix match).  
5️⃣ The router encapsulates the packet in a new frame (with next-hop MAC).  
6️⃣ The packet is forwarded through the outgoing interface.

If the router cannot find a matching route, it uses a **default route** or discards the packet.

`
    },
    {
      type: "text",
      value: `
### 🔹 6. Static vs Dynamic Routing Example

#### Example: Static Routing
\`\`\`
RouterA(config)# ip route 192.168.2.0 255.255.255.0 10.0.0.2
\`\`\`
➡ Manually tells RouterA to send packets for 192.168.2.0/24 via 10.0.0.2.

#### Example: Dynamic Routing (OSPF)
\`\`\`
RouterA(config)# router ospf 1
RouterA(config-router)# network 192.168.10.0 0.0.0.255 area 0
RouterA(config-router)# network 10.0.0.0 0.0.0.255 area 0
\`\`\`
➡ RouterA automatically exchanges routes with other routers in the same OSPF area.

`
    },
    {
      type: "text",
      value: `
### 🔹 7. Common Routing Protocols Overview

| Protocol | Type | Metric | Convergence Speed | Suitable For |
|-----------|------|---------|------------------|---------------|
| **RIP** | Distance Vector | Hop Count | Slow | Simple LANs |
| **EIGRP** | Hybrid | Composite | Fast | Cisco-only setups |
| **OSPF** | Link-State | Cost (Bandwidth) | Very Fast | Large enterprises |
| **BGP** | Path Vector | Policy-Based | Moderate | Internet-scale routing |

Routing protocols help routers exchange network information automatically and adapt to topology changes.

`
    },
    {
      type: "text",
      value: `
### 🔹 8. Routing Decision Example

Suppose a packet with destination 172.16.10.25 arrives at Router A.  
Router A’s routing table is checked in the following order:

1️⃣ Look for an exact match (172.16.10.0/24).  
2️⃣ If not found, check for a broader match (172.16.0.0/16).  
3️⃣ If still not found, forward via **default route (0.0.0.0/0)**.  
4️⃣ If no match, drop the packet.

This process is known as **Longest Prefix Match (LPM)** — the route with the most specific (longest) subnet mask is always chosen.

`
    },
    {
      type: "text",
      value: `
### 🔹 9. Visual Example: Multi-Hop Routing

\`\`\`
PC (192.168.10.10)
→ Router A (192.168.10.1 / 10.0.0.1)
→ Router B (10.0.0.2 / 172.16.0.1)
→ Router C (172.16.0.2 / 192.168.20.1)
→ Web Server (192.168.20.10)
\`\`\`

Each router acts as a hop.  
At each hop:
- The **destination IP** remains the same.  
- The **source/destination MAC addresses** change for every link.  
- The **TTL (Time to Live)** decreases by one.

If the packet reaches zero TTL, it’s dropped, and an ICMP “Time Exceeded” message is sent back (used in traceroute).

`
    },
    {
      type: "component",
      value: PacketRoutingSimulator,
      description: "Visualize packet movement hop-by-hop through multiple routers with routing table lookups and next-hop animations."
    },
    {
      type: "text",
      value: `
### 🔹 10. Summary

| Concept | Description |
|----------|--------------|
| **Router** | A Layer 3 device that forwards packets between networks. |
| **Routing Table** | Stores known routes and next-hop information. |
| **Static Routing** | Manually configured paths. |
| **Dynamic Routing** | Automatically learned using protocols. |
| **Default Route** | Used when no specific route matches. |
| **Longest Prefix Match** | The router selects the most specific route to the destination. |

Routing is the backbone of global connectivity — it allows millions of networks to interconnect seamlessly, forming the Internet.

`
    }
  ]
},

];

export default networkingCCNA;
