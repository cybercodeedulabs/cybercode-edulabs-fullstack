// src/data/lessons/networking-ccna.js
// Lesson 1 — Networking Basics (expanded, tutorial style)
import BasicLanSimulator from "../../components/simulations/ccna/BasicLanSimulator";
import NetworkDeviceQuiz from "../../components/simulations/ccna/NetworkDeviceQuiz";
import OSIFlowSimulation from "../../components/simulations/ccna/OSIFlowSimulation";
import IPSubnetVisualizer from "../../components/simulations/ccna/IPSubnetVisualizer";
import PacketRoutingSimulator from "../../components/simulations/ccna/PacketRoutingSimulator";
import VLANIsolationSimulator from "../../components/simulations/ccna/VLANIsolationSimulator";
import StaticRouteSimulator from "../../components/simulations/ccna/StaticRouteSimulator";
import DynamicRoutingSimulator from "../../components/simulations/ccna/DynamicRoutingSimulator";
import VLANTrafficFlowSimulator from "../../components/simulations/ccna/VLANTrafficFlowSimulator";
import STPSimulator from "../../components/simulations/ccna/STPSimulator";
import DHCPSimulator from "../../components/simulations/ccna/DHCPSimulator";
import ACLSimulator from "../../components/simulations/ccna/ACLSimulator";
import NATSimulator from "../../components/simulations/ccna/NATSimulator";
import SecurityEventSimulator from "../../components/simulations/ccna/SecurityEventSimulator";

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
  type: "image",
  value: "/lessonimages/ccna/packet-flow-diagram.png",
  alt: "Packet Flow Across Routers"
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
{
    slug: "switching-and-vlans",
    title: "Switching and VLANs",
    content: [
      {
        type: "text",
        value: `
### 🧩 Introduction to Switching

Switching is a core concept in networking where data packets are forwarded at **Layer 2 (Data Link)** using MAC addresses.  
Unlike routers, switches build a **MAC address table (CAM Table)** to learn which devices are connected to which ports.

**Key Switching Concepts:**
- **MAC Learning:** Switch records the source MAC and port.
- **Forwarding:** Packets are sent only to the destination port (unicast).
- **Flooding:** Unknown destinations or broadcasts go to all ports.
- **Aging:** MAC entries expire after inactivity.
- **Switch Fabric:** Hardware-based frame forwarding at wire speed.
`
      },
      {
        type: "image",
        value: "/lessonimages/ccna/switching-diagram.png",
        alt: "Switch forwarding frames based on MAC table"
      },
      {
        type: "text",
        value: `
### 🧭 VLAN Fundamentals

A **Virtual Local Area Network (VLAN)** is a logical segmentation of a switch into multiple broadcast domains.  
By default, all devices on a switch belong to VLAN 1 and can communicate freely.

**Why VLANs?**
- Reduce broadcast traffic  
- Increase security by isolating traffic  
- Improve management by grouping departments logically  

**VLAN Terminology**
| Term | Description |
|------|--------------|
| Access Port | Connects end devices to a specific VLAN |
| Trunk Port | Carries multiple VLANs between switches |
| VLAN ID | Identifier (1–4094) that defines VLAN scope |
| Tagging | IEEE 802.1Q header inserted to mark VLAN ID |
| Native VLAN | VLAN not tagged on trunk ports (default 1) |
`
      },
      {
        type: "component",
        value: VLANIsolationSimulator
      },
      {
        type: "text",
        value: `
### 🧪 VLAN Configuration Example

\`\`\`bash
# Create VLANs
Switch(config)# vlan 10
Switch(config-vlan)# name HR
Switch(config)# vlan 20
Switch(config-vlan)# name IT

# Assign ports
Switch(config)# interface fastEthernet 0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 10

Switch(config)# interface fastEthernet 0/2
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 20

# Verify
Switch# show vlan brief
\`\`\`
`
      },
      {
        type: "text",
        value: `
### 🧠 Key Takeaways

- Switches use MAC tables to forward traffic efficiently.  
- VLANs isolate traffic at Layer 2 for security and scalability.  
- Trunks allow VLANs to span multiple switches.  
- VLAN tagging (802.1Q) keeps traffic separated on shared links.
`
      }
    ]
  },
  {
    slug: "ip-routing-and-static-routes",
    title: "IP Routing and Static Routes",
    content: [
      {
        type: "text",
        value: `
### 🌍 What is IP Routing?

IP Routing is the process of **forwarding data packets from one network to another** based on their destination IP addresses.  
Every router acts as a **network traffic manager** — it decides the best path for data to travel across interconnected networks.

When a packet arrives on a router:
1. The router **checks the destination IP** in the header.  
2. It looks up the **routing table** for the most specific match.  
3. The router **forwards** the packet out through the proper interface.  
4. If no match is found, the router may forward it to a **default route (0.0.0.0/0)** or **drop** it.

`
      },
      {
        type: "text",
        value: `
### 🧠 Understanding the Routing Table

A **routing table** contains all the known paths a router can use to reach various networks.  
Each entry includes:

| Field | Description |
|--------|-------------|
| **Destination Network** | The network or subnet the router can reach |
| **Subnet Mask / Prefix** | Defines the network boundary |
| **Next-Hop Address** | The next router on the path |
| **Outgoing Interface** | The interface through which packets exit |
| **Administrative Distance** | Priority ranking of the route source |
| **Metric** | Path cost (used by dynamic protocols) |

#### Example Routing Table
| Destination | Next Hop | Interface | Type | Metric |
|--------------|-----------|-----------|-------|---------|
| 192.168.1.0/24 | — | G0/0 | Connected | — |
| 192.168.2.0/24 | 10.0.0.2 | G0/1 | Static | 1 |
| 0.0.0.0/0 | 10.0.0.254 | G0/2 | Default | 1 |

📘 *Routers always prefer the route with the **longest prefix match** (most specific subnet).*
`
      },
      {
        type: "image",
        value: "/lessonimages/ccna/static-routing-overview.png",
        alt: "Static routing overview showing multiple routers and next-hop paths"
      },
      {
        type: "text",
        value: `
### ⚙️ How Routing Works — Step by Step

Let’s trace how a router decides where to forward a packet.

1. **Packet arrives** on an incoming interface.
2. Router checks **destination IP** (e.g., 192.168.2.25).
3. Looks up the routing table — finds all possible matches.
4. Picks the **route with the longest prefix** (most specific network).
5. Determines the **next hop** and **egress interface**.
6. Rewrites the **Layer 2 (MAC) header** to reach the next hop.
7. Forwards the packet.

If **no route matches**, the router:
- Uses the **default route (0.0.0.0/0)** if configured.
- Otherwise, discards the packet and sends an ICMP “Destination Unreachable” back to the source.

💡 *Every hop in the path repeats this decision process until the packet reaches its destination.*
`
      },
      {
        type: "text",
        value: `
### 🛠️ Static Routing Explained

A **Static Route** is a manually configured route that defines how traffic should reach a specific network.  
Unlike dynamic routing protocols (like OSPF, EIGRP, or BGP), static routes **don’t change automatically** — they remain in place until manually updated.

#### ✅ Advantages:
- Simple and predictable.
- Uses minimal CPU and bandwidth.
- Perfect for small networks or lab environments.

#### ⚠️ Disadvantages:
- Doesn’t adapt to network failures automatically.
- Needs manual updates when topology changes.
`
      },
      {
        type: "text",
        value: `
### 🔧 Example: Configuring a Static Route

Consider the following topology:

\`\`\`
[PC1]--192.168.1.0/24--[R1]--10.0.0.0/30--[R2]--192.168.2.0/24--[PC2]
\`\`\`

To allow PC1 to reach PC2, we configure R1 and R2 with static routes:

**On Router R1:**
\`\`\`bash
R1(config)# ip route 192.168.2.0 255.255.255.0 10.0.0.2
\`\`\`

**On Router R2:**
\`\`\`bash
R2(config)# ip route 192.168.1.0 255.255.255.0 10.0.0.1
\`\`\`

✅ Now, both routers know how to reach each other’s LAN networks.

#### How it Works
- R1 sees a packet destined for 192.168.2.25.
- It checks the routing table and finds:  
  \`192.168.2.0/24 → next-hop 10.0.0.2\`
- It forwards the packet to R2’s interface.
- R2 recognizes 192.168.2.25 as part of its LAN and delivers it directly.
`
      },
      {
        type: "component",
        value: StaticRouteSimulator
      },
      {
        type: "text",
        value: `
### 🧩 Verifying Static Routes on Cisco IOS

Use these commands to confirm your configuration:

\`\`\`bash
R1# show ip route
C    192.168.1.0/24 is directly connected, GigabitEthernet0/0
S    192.168.2.0/24 [1/0] via 10.0.0.2, GigabitEthernet0/1

R1# ping 192.168.2.10
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 192.168.2.10, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5)
\`\`\`

If you see “!” — it means the static route is working correctly 🎉
`
      },
      {
        type: "text",
        value: `
### 🧮 The Default Route

A **default route** acts as a catch-all path for unknown destinations.

\`\`\`bash
R1(config)# ip route 0.0.0.0 0.0.0.0 10.0.0.254
\`\`\`

💡 This is used to forward traffic to the **Internet** or an **upstream router** when no specific match exists.

#### Example:
When R1 receives traffic for 8.8.8.8 (Google DNS) — it doesn’t match any internal route.  
It sends the packet via the default route to 10.0.0.254 (ISP gateway).
`
      },
      {
        type: "text",
        value: `
### 🧠 Key Takeaways

- Every router builds and maintains its own routing table.  
- The **longest prefix match** decides the route for each packet.  
- **Static routes** give manual control, while **default routes** handle unknown traffic.  
- Use static routes in small or stable environments; for large ones, use dynamic routing protocols.  

In the next lesson, we’ll explore **Dynamic Routing (RIP, OSPF)** to automate route learning and failover.
`
      }
    ]
  },
  {
    slug: "dynamic-routing-protocols",
    title: "Dynamic Routing Protocols (RIP & OSPF)",
    content: [
      {
        type: "text",
        value: `
### 🌐 Introduction

While **Static Routing** provides precise control, it’s inefficient in large or frequently changing networks.  
**Dynamic Routing Protocols** automate the exchange of routing information between routers, adapting to topology changes instantly.

These protocols ensure:
- Automatic **route discovery**  
- Continuous **route maintenance**  
- **Failover and redundancy** in case of link failures  

There are two main categories:
1. **Distance Vector Protocols** – Exchange entire routing tables periodically (e.g., RIP).  
2. **Link State Protocols** – Share link state information and build a topology map (e.g., OSPF, IS-IS).  
`
      },
      {
        type: "image",
        value: "/lessonimages/ccna/dynamic-routing-overview.png",
        alt: "Dynamic routing overview showing routers exchanging routing updates automatically"
      },
      {
        type: "text",
        value: `
### 🧭 1. Distance Vector Routing (RIP)

**RIP (Routing Information Protocol)** is one of the earliest routing protocols, using **hop count** as its metric.

#### 📋 Key Characteristics:
- Uses **UDP port 520**.
- Metric = number of hops (max 15 hops).
- Updates sent every **30 seconds**.
- Simple to configure but not scalable for large networks.

#### Example Topology
\`\`\`
[R1]——[R2]——[R3]
\`\`\`

#### Configuration Example
\`\`\`bash
R1(config)# router rip
R1(config-router)# version 2
R1(config-router)# network 192.168.1.0
R1(config-router)# network 10.0.0.0
R1(config-router)# no auto-summary
\`\`\`

RIP routers will automatically share their networks and learn others dynamically.
`
      },
      {
        type: "text",
        value: `
### 🔍 Verifying RIP Routes

To view learned routes:
\`\`\`bash
R1# show ip route rip
R    192.168.3.0/24 [120/1] via 10.0.0.2, 00:00:12, GigabitEthernet0/1
\`\`\`

Legend:
- **R** – Route learned via RIP  
- **120** – Administrative distance for RIP  
- **1** – Metric (hop count)  
`
      },
      {
        type: "text",
        value: `
### ⚙️ 2. Link State Routing (OSPF)

**OSPF (Open Shortest Path First)** uses the **Dijkstra algorithm** to calculate the shortest path to each destination.  
Unlike RIP, OSPF doesn’t send the entire table — it only shares **link state updates (LSAs)** when a change occurs.

#### 🧩 Key Features:
- Uses **Cost (based on bandwidth)** as metric.  
- Supports **areas** for hierarchical design.  
- Converges rapidly after network changes.  
- Uses **multicast (224.0.0.5, 224.0.0.6)** for communication.

#### Example Configuration
\`\`\`bash
R1(config)# router ospf 1
R1(config-router)# network 192.168.1.0 0.0.0.255 area 0
R1(config-router)# network 10.0.0.0 0.0.0.3 area 0
\`\`\`

✅ This enables OSPF on two interfaces, both part of Area 0 (Backbone Area).
`
      },
      {
        type: "text",
        value: `
### 📡 OSPF Adjacency Formation Process

When two OSPF routers connect:
1. They send **Hello packets** to discover neighbors.
2. They establish a **2-Way** communication.
3. They exchange **Database Description (DBD)** packets.
4. They send **Link State Requests (LSR)** to learn missing info.
5. They become **Fully Adjacent** and synchronize LSDBs.

💡 OSPF routers maintain the same **Link State Database (LSDB)** within an area.
`
      },
      {
        type: "component",
        value: DynamicRoutingSimulator
      },
      {
        type: "text",
        value: `
### 🔎 Verifying OSPF Routes

\`\`\`bash
R1# show ip route ospf
O    192.168.3.0/24 [110/2] via 10.0.0.2, 00:00:13, GigabitEthernet0/1
\`\`\`

Legend:
- **O** — Route learned via OSPF  
- **110** — Administrative Distance for OSPF  
- **2** — Cost metric (sum of outgoing interface costs)
`
      },
      {
        type: "text",
        value: `
### ⚔️ RIP vs OSPF Comparison

| Feature | RIP | OSPF |
|----------|-----|------|
| Algorithm | Distance Vector | Link State |
| Metric | Hop Count | Cost (Bandwidth) |
| Max Hops | 15 | Unlimited |
| Convergence | Slow | Fast |
| Protocol | UDP 520 | IP Protocol 89 |
| Scalability | Small Networks | Large Networks |
| Updates | Periodic (30s) | Event-Driven |
| Administrative Distance | 120 | 110 |
`
      },
      {
        type: "text",
        value: `
### 🧠 Summary

- **RIP** shares full routing tables regularly; easy but slow and limited.  
- **OSPF** builds a full topology map; fast, reliable, and scalable.  
- Dynamic protocols adapt automatically — ideal for enterprise networks.  
- CCNA engineers must understand both concepts deeply and know when to use static vs dynamic routing.
`
      }
    ]
  },
  {
  slug: "vlans-and-trunking",
  title: "VLANs and Trunking",
  content: [
    {
      type: "text",
      value: `
### 🧭 What You'll Learn
- What VLANs are and why they're used
- How VLAN segmentation improves performance and security
- Access vs. Trunk ports
- VLAN tagging (IEEE 802.1Q)
- VLAN configuration on Cisco switches
- VLAN Trunking Protocol (VTP)
- Hands-on simulator demonstration
      `
    },
    {
      type: "text",
      value: `
### 🔍 What is a VLAN?
A **VLAN (Virtual Local Area Network)** logically divides a physical network into smaller, isolated segments.  
Instead of using multiple switches to separate departments, you can use a single managed switch and configure VLANs.

For example:
- VLAN 10 → HR Department
- VLAN 20 → IT Department
- VLAN 30 → Sales Department

Each VLAN acts as an independent network — devices in one VLAN can’t communicate with another without a router (Inter-VLAN Routing).
      `
    },
    {
      type: "text",
      value: `
### ⚙️ Why VLANs?
VLANs improve **security**, **performance**, and **flexibility**.

| Benefit | Description |
|----------|-------------|
| **Security** | Limits communication between different departments. |
| **Performance** | Reduces broadcast traffic in large LANs. |
| **Scalability** | VLANs can be expanded without adding physical switches. |
| **Manageability** | Simplifies troubleshooting and traffic analysis. |
      `
    },
    {
      type: "text",
      value: `
### 💡 Access vs Trunk Ports

| Port Type | Description | Example |
|------------|-------------|----------|
| **Access Port** | Carries traffic for a single VLAN. | PC or printer connected to switch |
| **Trunk Port** | Carries multiple VLANs between switches. | Switch-to-switch or switch-to-router link |

Each frame on a trunk port includes a **VLAN tag** — an extra 4-byte field added to the Ethernet frame as per **IEEE 802.1Q**.
      `
    },
    {
      type: "image",
      value: "/lessonimages/ccna/vlan-trunking-diagram.png",
      alt: "Diagram illustrating VLANs, trunk links, and access ports."
    },
    {
      type: "text",
      value: `
### 🧱 VLAN Tagging (802.1Q)
When frames traverse a trunk link, switches insert a tag identifying the VLAN ID.  
When the frame reaches an access port, the tag is removed before delivery to the device.

Each VLAN tag includes:
- **12-bit VLAN ID**
- **3-bit priority code (for QoS)**
- **1-bit Canonical Format Indicator**
      `
    },
    {
      type: "text",
      value: `
### 🧩 VLAN Configuration Example (Cisco)
Here’s a sample Cisco IOS configuration for creating and assigning VLANs:

\`\`\`bash
Switch> enable
Switch# configure terminal
Switch(config)# vlan 10
Switch(config-vlan)# name HR
Switch(config-vlan)# exit
Switch(config)# vlan 20
Switch(config-vlan)# name IT
Switch(config-vlan)# exit

! Assign ports to VLANs
Switch(config)# interface fastEthernet0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 10
Switch(config-if)# exit

! Configure trunk port
Switch(config)# interface gigabitEthernet0/1
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk allowed vlan 10,20,30
Switch(config-if)# end
Switch# write memory
\`\`\`

💡 VLAN trunks typically use **802.1Q** encapsulation by default.
      `
    },
    {
      type: "text",
      value: `
### 📈 VLAN Trunking Protocol (VTP)
Cisco’s **VTP** manages VLANs centrally.  
When a new VLAN is created on one switch (VTP Server mode), it can automatically propagate to other switches in the same domain.

| Mode | Description |
|------|--------------|
| **Server** | Can create, modify, and delete VLANs. |
| **Client** | Receives VLAN info from servers; cannot modify. |
| **Transparent** | Doesn’t participate in VTP updates. |
      `
    },
    {
      type: "component",
      value: VLANTrafficFlowSimulator
    },
    {
      type: "text",
      value: `
### 🎯 Summary
- VLANs isolate traffic for performance and security.  
- Trunks carry traffic between switches using tags.  
- VTP automates VLAN propagation across the network.  
- VLANs are foundational for scalable, segmented, and secure networks.
      `
    }
  ]
},
{
  slug: "stp-introduction-and-operations",
  title: "Spanning Tree Protocol (STP) — Introduction & Operations",
  content: [
    {
      type: "text",
      value: `
### 🔗 Lesson Overview

In switched Ethernet networks with redundant links, frames can loop and cause broadcast storms, MAC table instability, and full network outage. The **Spanning Tree Protocol (STP)** creates a loop-free Layer 2 topology by electing a single active spanning tree and blocking redundant links.  

This lesson gives a practical, engineer-focused explanation of STP internals, how decisions are made (root election, path cost, port roles), timers and convergence behavior, modern RSTP/MST variants, configuration examples, common operational pitfalls, and a hands-on simulation pointer to practice root election and link failures.
      `
    },

    {
      type: "text",
      value: `
### 🎯 Learning Objectives

After completing this lesson you will be able to:
- Explain why STP is required and what problems it prevents.
- Describe the Bridge ID, how the Root Bridge is elected, and how path costs are used.
- Identify STP port roles (Root, Designated, Blocked) and port states (Blocking, Listening, Learning, Forwarding).
- Understand key STP timers and their effect on convergence.
- Compare classic STP (802.1D) with RSTP (802.1w) and MST.
- Apply basic STP configuration (priority, PortFast, BPDU Guard, Root Guard) and troubleshoot common issues.
      `
    },

    {
      type: "image",
      value: "/lessonimages/ccna/stp-overview-diagram.png",
      alt: "Spanning Tree topology with root, designated and blocked ports"
    },

    {
      type: "text",
      value: `
## 1) Why STP exists — the problem statement

- Switches forward frames based on MAC learning and do **not** decrement TTL. When redundant physical links exist for resiliency, frames (especially broadcasts and unknown unicasts) can traverse loops indefinitely.  
- Consequences: broadcast storms, overwhelming CPU on switches, MAC table instability (flapping), and eventual network collapse.

**STP's purpose:** discover a loop-free subset of links (a tree). It chooses one switch as the **Root Bridge** and disables (blocks) selected redundant ports so there is exactly one forwarding path between any two switches.
      `
    },

    {
      type: "text",
      value: `
## 2) Bridge ID & Root Bridge Election (step-by-step)

**Bridge ID = Priority : MAC-address**

- Default priority is typically 32768 (platform-specific). Lower Bridge ID wins.
- Root election algorithm:
  1. All switches advertise themselves as potential root by sending BPDUs (Bridge Protocol Data Units).
  2. Switches compare root IDs in received BPDUs. The switch advertising the lowest root ID becomes the Root Bridge.
  3. Tie-breaker: lower MAC address.

**Engineering tip:** Set a low priority on the intended core switch to force it to be root (e.g., 4096). Configure your backup root with a slightly higher priority.
      `
    },

    {
      type: "code",
      language: "bash",
      runnable: false,
      value: `# Example (Cisco IOS) — set switch to be root for VLAN 1
enable
configure terminal
spanning-tree vlan 1 priority 4096
end
write memory`
    },

    {
      type: "text",
      value: `
## 3) Path Cost — selecting best path to root

- STP uses an additive **path cost** metric per link. The switch chooses the path to the root with the **lowest total cost**.
- Historically common cost values (consult vendor docs for exact defaults):
  - 10 Mbps → 100
  - 100 Mbps → 19
  - 1 Gbps → 4
  - 10 Gbps → 2

If two paths have equal cost, STP breaks ties using bridge IDs and port IDs. You can manually set interface cost to influence path selection.
      `
    },

    {
      type: "text",
      value: `
## 4) Port Roles & States (what each port means)

**Port roles**
- **Root Port (RP):** On non-root switches, the port with the best path to the root (one RP per non-root switch).
- **Designated Port (DP):** For each LAN segment, the port that forwards frames towards the root (one DP per segment).
- **Blocked Port:** Ports that would cause loops; kept in blocking so they do not forward frames.

**Port states in classic 802.1D**
- **Blocking** — only listens for BPDUs.
- **Listening** — preparing to forward; not learning MACs.
- **Learning** — learning MAC addresses; not forwarding.
- **Forwarding** — normal data forwarding and MAC learning.
- **Disabled** — administratively down.

RSTP simplifies states and achieves faster transitions (discarding → learning → forwarding). RSTP introduces edge ports and proposal/agreement handshake for quick convergence.
      `
    },

    {
      type: "text",
      value: `
## 5) Timers & Convergence

**Classic STP (802.1D) timers**
- **Hello Time:** interval between BPDUs (default 2s)
- **Forward Delay:** time spent in listening/learning (default 15s)
- **Max Age:** BPDU lifetime (default 20s)

Classic STP reconvergence can take 30–50 seconds. **RSTP (802.1w)** reduces convergence using faster handshakes and edge-port optimizations.

**When to tune:** Only tune timers with caution — test in a lab. Prefer RSTP/MST for faster, safer convergence in production.
      `
    },

    {
      type: "text",
      value: `
## 6) RSTP (802.1w) & MST Overview

- **RSTP (802.1w):** Faster convergence than classic STP; replaces listening/learning with discarding/learning and uses handshake (proposal/agree) to rapidly bring point-to-point links to forwarding.
- **MST (Multiple Spanning Tree):** Groups VLANs into instances to allow load sharing and fewer STP instances across the network (better scale than per-VLAN STP).

**Recommendation:** Use RSTP or MST for modern networks. PVST/PVST+ (Cisco) runs per-VLAN STP and has its own tradeoffs.
      `
    },

    {
      type: "image",
      value: "/lessonimages/ccna/stp-timers-diagram.png",
      alt: "STP timers and convergence illustration"
    },

    {
      type: "text",
      value: `
## 7) Common Operational Issues & Troubleshooting Checklist

**Common issues**
- Wrong root placement → suboptimal traffic or asymmetric paths.
- Unintended blocked interfaces due to incorrect priorities.
- Link flapping causing repeated topology recalculations.
- Edge devices (like rogue switches) injecting BPDUs causing instability.

**Troubleshooting steps**
1. \`show spanning-tree\` — verify root bridge for each VLAN and this bridge ID.
2. Confirm root bridge matches your design (priority/MAC).
3. Check port roles & states to see which ports are blocking unexpectedly.
4. Inspect interface speeds and STP costs if path selection is wrong.
5. Look for frequent topology changes (BPDU storms or flapping).
6. Validate trunk native VLANs and BPDU settings (BPDU guard, BPDU filter).
7. Use PortFast + BPDU Guard on access ports attached to end hosts to prevent accidental topology changes.

**Helpful CLI checks**
\`\`\`text
show spanning-tree
show spanning-tree interface GigabitEthernet0/1 detail
show logging
show interfaces status
\`\`\`
      `
    },

    {
      type: "text",
      value: `
## 8) Configuration Best Practices (practical rules)

- **Decide root(s) explicitly:** configure the designated core/distribution switches with low priorities (root and secondary root).
- **Enable RSTP/MST** where supported — avoid relying on slow classic STP.
- **PortFast** on access ports connected to end hosts:
  - Avoids unnecessary STP delay for host ports.
  - Always enable **BPDU Guard** on PortFast ports to protect against rogue switches.
- **Root Guard** on ports where you expect the root not to appear (protects topology).
- Keep STP mode consistent across devices in the domain (RSTP vs PVST etc).
- Document STP design and verify in staged lab before production changes.
      `
    },

    {
      type: "code",
      language: "bash",
      runnable: false,
      value: `# Examples (Cisco-like)
# 1) Force a switch to be root for VLAN 1
configure terminal
spanning-tree vlan 1 priority 4096
end
write memory

# 2) Enable PortFast and BPDU Guard on an access interface
interface FastEthernet0/24
switchport mode access
spanning-tree portfast
spanning-tree bpduguard enable
exit

# 3) Set an interface cost (rarely needed)
interface GigabitEthernet0/1
spanning-tree cost 4
exit`
    },

    {
      type: "text",
      value: `
## 9) Lab / Simulation (recommended)

Use the interactive STP simulator to:
- Force different switches to become root by changing priorities.
- Disable/enable links to observe which ports move from blocked → forwarding.
- Toggle between STP and RSTP and compare convergence time in the simulator logs.
- Validate PortFast + BPDU Guard by connecting a simulated rogue switch.

**Component name to include in your lesson:** \`STPSimulator\`  
(Place component at: /src/components/simulations/ccna/STPSimulator.jsx)
      `
    },

    {
      type: "component",
      value: STPSimulator
    },

    {
      type: "text",
      value: `
## 10) Practical Checklist (pre-deployment)

- [ ] Identify and configure the intended Root Bridge and Backup Root (set priorities).
- [ ] Use RSTP/MST if fast convergence is required.
- [ ] Configure PortFast on access ports and enable BPDU Guard.
- [ ] Apply Root Guard where appropriate on distribution/access boundaries to prevent root takeover.
- [ ] Test failover scenarios in a lab (link down/up, switch reboot).
- [ ] Monitor logs for frequent topology changes and investigate flapping interfaces.

---

### ✅ Summary

STP is a core protocol to protect switched networks from loops. Knowing how to manipulate priorities, interpret BPDU information, and apply protection features (PortFast, BPDU Guard, Root Guard) will keep network topologies stable and predictable. Use RSTP/MST for faster convergence and scale, and always validate changes in a staged environment before rolling into production.
      `
    }
  ]
},
{
  slug: "dhcp-dns-intro",
  title: "DHCP & DNS in Enterprise Networks",
  content: [
    {
      type: "text",
      value: `
### 🔁 Lesson Overview

This lesson covers Dynamic Host Configuration Protocol (DHCP) and Domain Name System (DNS) as used in enterprise networks. You'll learn DHCP address allocation types (automatic, dynamic, static/reservations), how leases and scopes work, and the DHCP message flow (Discover → Offer → Request → Acknowledge). For DNS, we'll cover name resolution, common record types (A, AAAA, CNAME, PTR, NS), recursive vs iterative queries, forwarders, and caching.

The lesson includes a hands-on DHCP simulator to visualize the 4-stage DHCP handshake, a short lease lifecycle (T1/T2) for demonstrations, plus diagrams for DHCP message flow and DNS resolution.
      `
    },

    {
      type: "text",
      value: `
### 🎯 Learning Objectives

After this lesson you will be able to:
- Explain DHCP operation modes: automatic, dynamic, and static binding / reservations.
- Configure a DHCP scope and understand lease parameters (lease time, T1 renewal, T2 rebinding).
- Describe the 4-message DHCP exchange and what information is carried in each message.
- Explain DNS architecture, record types and the difference between recursive and iterative resolution.
- Diagnose common DHCP/DNS issues (no lease, exhausted pool, DNS misconfigurations).
      `
    },

    {
      type: "image",
      value: "/lessonimages/ccna/dhcp-process-diagram.png",
      alt: "DHCP message flow: Discover, Offer, Request, ACK"
    },

    {
      type: "text",
      value: `
## 1) DHCP fundamentals

- **Scope (pool):** the address range and parameters (default gateway, DNS servers, lease time).
- **Lease:** time-limited allocation; client must renew before expiry.
- **Allocation types:**
  - **Automatic:** handed out permanently (rare).
  - **Dynamic:** assigned for a lease period.
  - **Static reservation:** a specific MAC gets a fixed IP.
- **Essential messages:**
  - **DHCPDISCOVER** — client broadcasts to locate DHCP servers.
  - **DHCPOFFER** — server offers an IP and options.
  - **DHCPREQUEST** — client requests the offered IP.
  - **DHCPACK** — server acknowledges & finalizes the lease.
      `
    },

    {
      type: "code",
      language: "bash",
      runnable: false,
      value: `# Example: configure DHCP pool (Cisco-like)
ip dhcp pool LAB
 network 192.168.10.0 255.255.255.0
 default-router 192.168.10.1
 dns-server 8.8.8.8
 lease 7`
    },

    {
      type: "text",
      value: `
## 2) Lease lifecycle & timers (T1 / T2)

- **Lease Time** — how long a client may use the IP (examples: minutes → days).
- **T1 (Renewal):** client unicasts a DHCPREQUEST to the server at 50% of lease time.
- **T2 (Rebind):** client broadcasts a DHCPREQUEST at 87.5% of lease time if renewal fails.
- **When lease expires:** client must start the DHCPDISCOVER flow again.

In the simulator we use a short default lease (e.g., 30s) so you can observe renewal/rebind behavior quickly.
      `
    },

    {
      type: "image",
      value: "/lessonimages/ccna/dns-resolution-diagram.png",
      alt: "DNS resolution flow: recursive & iterative queries"
    },

    {
      type: "text",
      value: `
## 3) DNS basics

- **Authoritative server:** holds records for a domain.
- **Recursive resolver:** resolves names on behalf of clients (may use forwarders).
- **Common records:** A, AAAA, CNAME, MX, PTR, NS, TXT.
- **Recursive vs Iterative:** recursive resolver queries root/TLD/authoritative servers; iterative responses return referrals.

**Troubleshooting tips:** use \`dig\`/\`nslookup\`, check TTL, inspect forwarders and caching, verify glue records for public domains.
      `
    },

    {
      type: "text",
      value: `
## 4) DHCP / DNS Operational Checklist & Troubleshooting

- Ensure DHCP relay (ip helper) configured on routers for cross-subnet clients.
- Monitor lease pool utilization (avoid exhaustion).
- Use static reservations for servers and infrastructure.
- Enable dynamic DNS updates carefully (security & ACLs).
- Verify DNS resolution path and caches; check TTLs and zone configuration.
- Use packet captures to trace the DHCP 4-message flow and DNS queries.
      `
    },

    {
      type: "text",
      value: `
## 5) Lab / Simulation (recommended)

Use the interactive **DHCPSimulator** to:
- Create a scope, adjust lease and pool size.
- Add clients and observe DHCPDISCOVER → DHCPOFFER → DHCPREQUEST → DHCPACK.
- Observe T1 (renew) and T2 (rebind) when leases are active.
- Simulate pool exhaustion and server NAK behavior.
- Export/import topology/pool for repeatable labs.

**Component name to include in your lesson:** \`DHCPSimulator\`
(Place component at: /src/components/simulations/ccna/DHCPSimulator.jsx)
      `
    },

    {
      type: "component",
      value: DHCPSimulator
    },

    {
      type: "text",
      value: `
## 6) Summary & Practical Tips

- Choose conservative lease times for stable hosts; short leases for guest/mobile networks.
- Use reservations for critical devices.
- Monitor DHCP logs and pool utilization.
- Keep DNS servers properly delegated and monitor caching behavior.
      `
    }
  ]
},
{
  slug: "acl-access-control-lists",
  title: "Access Control Lists (ACLs) — Filtering & Policy Enforcement",
  content: [
    {
      type: "text",
      value: `
### 🔐 Lesson Overview

Access Control Lists (ACLs) are fundamental to controlling traffic in IP networks. ACLs filter packets based on fields such as source/destination IP, protocol, and ports. This lesson explains standard and extended ACLs, how routers apply ACLs (inbound vs outbound), ordering and implicit deny, and common deployment patterns for inter-VLAN filtering, server protection, and Internet egress control.

You'll get hands-on practice with an interactive ACL simulator that visualizes rule matching, counters, and hit/miss debugging.
      `
    },

    {
      type: "text",
      value: `
### 🎯 Learning Objectives

After this lesson you will be able to:
- Distinguish standard vs extended ACLs and their use-cases.
- Write ACLs to permit/deny traffic using protocol/port and IP match criteria.
- Understand rule order, first-match semantics, and implicit deny.
- Apply ACLs inbound/outbound and interpret counters for troubleshooting.
- Use ACLs to protect servers and limit inter-VLAN access.
      `
    },

    {
      type: "image",
      value: "/lessonimages/ccna/acl-standard-vs-extended.png",
      alt: "Standard vs Extended ACLs — quick comparison"
    },

    {
      type: "text",
      value: `
## 1) Standard vs Extended ACLs

**Standard ACLs** (Cisco classic): match only source IP (or network). Useful for broad access control near destination (e.g., permit/deny subnets).

**Extended ACLs**: match source, destination, protocol (tcp/udp/icmp), and ports (e.g., eq 80). Use near source for precise filtering (prevent unwanted traffic from entering network domain).

**Example (Cisco-like):**
- Standard: \`access-list 10 permit 10.10.10.0 0.0.0.255\`
- Extended: \`access-list 101 permit tcp 10.20.20.0 0.0.0.255 any eq 22\`

**Important:** ACLs are processed top-to-bottom; the first match wins. There is an **implicit deny all** at the end of every ACL.
      `
    },

    {
      type: "code",
      language: "bash",
      runnable: false,
      value: `# Apply extended ACL (example)
configure terminal
ip access-list extended BLOCK_SSH
 permit tcp 10.20.20.0 0.0.0.255 any eq 22
 deny ip any 10.30.30.0 0.0.0.255
interface GigabitEthernet0/1
 ip access-group BLOCK_SSH in
end
write memory`
    },

    {
      type: "text",
      value: `
## 2) Troubleshooting checklist

- show access-lists — view rules and counters
- Check interface binding and direction (in/out)
- Remember first-match semantics; ensure specific rules precede general ones
- Use hit counters to identify matching rules
- Beware of implicit deny at end of ACL
      `
    },

    {
      type: "text",
      value: `
## 3) Lab / Simulator (recommended)

Use the interactive **ACLSimulator** to:
- Create standard and extended ACLs.
- Reorder rules and observe first-match behavior.
- Simulate test packets (src IP, dst IP, proto, dst port) and watch rule matching visualization.
- Bind ACLs to virtual interfaces (HR, IT, Servers, Internet) and test direction inbound/outbound.

**Component name to include in your lesson:** \`ACLSimulator\`
      `
    },

    {
      type: "component",
      value: ACLSimulator
    },

    {
      type: "text",
      value: `
## 4) Practical Examples

- Block SSH from Internet to Servers but allow HTTP/HTTPS.
- Only allow HR subnet to access a subset of servers.
- Rate-limit or drop ICMP from external networks (use policing for production).

---

### ✅ Summary
ACLs are powerful and lightweight. Use them carefully: always document, test in lab, and monitor counters after deployment.
      `
    }
  ]
},
{
  slug: "nat-pat-intro",
  title: "NAT & PAT — Network Address Translation and Port Address Translation",
  content: [
    {
      type: "text",
      value: `
### 🔁 Lesson Overview

Network Address Translation (NAT) allows multiple hosts in a private address space to communicate with external networks using a smaller set of public IP addresses. This lesson explains:
- Static NAT (one-to-one mapping),
- Dynamic NAT (pool-based mapping),
- PAT (Port Address Translation / NAT overload: many-to-one using ports),
how NAT tables are built and used, common configuration examples, pitfalls (translation exhaustion, asymmetric routing), and debugging techniques.

Includes NAT translation simulator to visualize translation table entries and PAT port allocation behavior.
      `
    },

    {
      type: "text",
      value: `
### 🎯 Learning Objectives

After this lesson you will be able to:
- Describe the difference between static NAT, dynamic NAT, and PAT.
- Configure basic NAT / PAT on a router for IPv4 networks.
- Read NAT translation tables and diagnose common NAT-related problems.
- Understand how PAT uses source ports to multiplex many private hosts on one public IP.
- Explain pitfalls: port exhaustion, NAT + firewall state, and asymmetric routing implications.
      `
    },

    {
      type: "image",
      value: "/lessonimages/ccna/nat-flow-diagram.png",
      alt: "NAT flow: private -> NAT device -> public (static/dynamic/PAT)"
    },

    {
      type: "text",
      value: `
## 1) NAT types (concise)

- **Static NAT (1:1)** — maps a private IP to a specific public IP. Use for servers that need a stable public address.
- **Dynamic NAT (pool)** — router assigns an available public IP from a pool when a private host initiates a connection.
- **PAT / NAT Overload (many-to-1)** — many private hosts share a single public IP; router differentiates sessions by using source ports.

**When to use which:**
- Use **static** for inbound-accessible servers (web, mail).
- Use **dynamic** when you have a small set of public addresses, but don't need inbound address stability.
- Use **PAT** for typical enterprise Internet access where one/few public IPs are shared.
      `
    },

    {
      type: "code",
      language: "bash",
      runnable: false,
      value: `# Examples (Cisco-like)

# 1) Static NAT (map internal web server to public IP)
ip nat inside source static 10.30.30.10 203.0.113.10

# 2) Dynamic NAT (pool)
ip nat pool PUB_POOL 203.0.113.11 203.0.113.20 netmask 255.255.255.0
access-list 10 permit 10.10.10.0 0.0.0.255
ip nat inside source list 10 pool PUB_POOL

# 3) PAT (many-to-1)
access-list 20 permit 10.10.10.0 0.0.0.255
ip nat inside source list 20 interface GigabitEthernet0/0 overload

# Show translations
show ip nat translations
show ip nat statistics`
    },

    {
      type: "text",
      value: `
## 2) NAT translation table & examples

A NAT table entry typically looks like:
- **static**: InsideLocal -> InsideGlobal (1:1)
- **dynamic/PAT**: InsideLocal:port -> InsideGlobal:translatedPort

Example PAT entry:
- 10.10.10.5:54721 -> 203.0.113.5:60245

**Key commands:**
- \`show ip nat translations\` — current mapping table
- \`clear ip nat translation\` — remove specific entries
- \`show ip nat statistics\` — pool usage and counters
      `
    },

    {
      type: "text",
      value: `
## 3) Common issues & troubleshooting

- **Pool exhaustion**: dynamic pool empty — new translations fail.
- **Port exhaustion**: PAT uses limited port space (approx 64k), which may be reduced in practice by firewall/stateful tracking.
- **Asymmetric routing**: traffic returning via a different path will bypass NAT device → connection failure.
- **Firewall state cleanup**: NAT + firewalls require consistent state; clearing NAT may drop active sessions.
- **Logging**: enable logging on NAT device and inspect translation table during tests.

Troubleshooting checklist:
1. Check \`show ip nat translations\` for expected entries.
2. Verify ACLs used for NAT matches (inside networks).
3. Confirm NAT applied to correct interfaces (\`ip nat inside/outside\`).
4. Check for asymmetric routing or missing return route.
      `
    },

    {
      type: "image",
      value: "/lessonimages/ccna/nat-table-diagram.png",
      alt: "NAT translation table visualization (Inside Local/Global, Outside Local/Global)"
    },

    {
      type: "text",
      value: `
## 4) Lab / Simulation (recommended)

Use the interactive **NATSimulator** to:
- Configure static, dynamic, and PAT translations.
- Observe translation table entries created in real-time.
- Simulate many clients to see PAT port allocation and exhaustion behavior.
- Simulate asymmetric routing and observe failed sessions.

**Component name to include in your lesson:** \`NATSimulator\`  
(Place component at: /src/components/simulations/ccna/NATSimulator.jsx)
      `
    },

    {
      type: "component",
      value: NATSimulator
    },

    {
      type: "text",
      value: `
## 5) Practical checklist (pre-deployment)

- Document which hosts require inbound static NAT and reserve public IPs accordingly.
- Monitor translation table and pool usage; set alerts for exhaustion.
- Consider using multiple PAT addresses or load-balancers to spread port usage.
- Validate routing paths to avoid asymmetric routing — ensure return path traverses NAT device.
- Test failover scenarios (NAT device reboot, IP pool changes) in lab before production.
      `
    },

    {
      type: "text",
      value: `
## Summary

NAT and PAT are essential tools to conserve IPv4 addresses and control inbound/outbound connectivity. Know when to use static vs dynamic vs PAT, monitor translation tables closely, and account for pitfalls (exhaustion and asymmetric routing). Use the NATSimulator to practice and validate designs before deployment.
      `
    }
  ]
},
{
  slug: "wan-technologies-overview",
  title: "WAN Technologies — PPP, HDLC, MPLS, Metro Ethernet, Frame Relay",
  content: [
    {
      type: "text",
      value: `
### 🌐 Lesson Overview

Wide Area Network (WAN) technologies connect branch offices, data centers, and remote sites across carrier networks.  
This lesson introduces traditional and modern WAN options, including:
- Legacy serial encapsulations (HDLC, PPP),
- Modern high-speed carrier services (MPLS, Metro Ethernet),
- Frame Relay concepts (for exam compatibility),
- Key WAN control-plane and data-plane fundamentals,
- Encapsulation negotiation (LCP/NCP), authentication, and link monitoring.

Two diagrams included:
- *wan-topologies.png*
- *ppp-lcp-ncp-flow.png*
      `
    },

    {
      type: "text",
      value: `
### 🎯 Learning Objectives

After completing this lesson you will be able to:
- Differentiate between HDLC and PPP encapsulations.
- Explain PPP components (LCP, NCP, CHAP/PAP authentication).
- Describe MPLS forwarding (labels, LSR, LSPs).
- Understand Metro Ethernet handoff types (E-Line, E-LAN, E-Tree).
- Recognize Frame Relay concepts for CCNA familiarity (DLCI, LMI).
- Compare WAN technologies and choose the correct one for a scenario.
      `
    },

    {
      type: "image",
      value: "/lessonimages/ccna/wan-topologies.png",
      alt: "WAN topologies: serial, MPLS cloud, Metro Ethernet"
    },

    {
      type: "text",
      value: `
## 1) HDLC (High-Level Data Link Control)

- Cisco-proprietary by default (only works between Cisco devices unless using ISO mode).
- Simple, low-overhead encapsulation for serial links.
- No authentication or negotiation.

**Key Notes:**
- Often the default on Cisco serial interfaces.
- Limited flexibility — PPP is preferred in modern deployments.
      `
    },

    {
      type: "text",
      value: `
## 2) PPP – Point-to-Point Protocol

PPP enhances serial links with authentication, multilink support, and negotiation.

### PPP Components:
- **LCP (Link Control Protocol):** establishes, configures, tests link.
- **NCP (Network Control Protocol):** negotiates Layer 3 parameters (IPCP for IPv4).
- **CHAP/PAP:** authentication methods.

### Why PPP?
- Multi-vendor support
- Authentication
- Link quality monitoring
- Supports multiple protocols (IP, IPX historically)

**Common Commands (Cisco-like):**
\`\`\`
interface Serial0/0
 encapsulation ppp
 ppp authentication chap
 ppp chap hostname BranchRouter
 ppp chap password MySecret
\`\`\`
      `
    },

    {
      type: "image",
      value: "/lessonimages/ccna/ppp-lcp-ncp-flow.png",
      alt: "PPP flow: LCP negotiation -> authentication -> NCP (IPCP)"
    },

    {
      type: "text",
      value: `
## 3) MPLS (Multiprotocol Label Switching)

MPLS is widely used in service provider networks.

### Key Concepts:
- Traffic forwarded based on **labels**, not IP lookup.
- Label-Switched Routers (LSRs)
- Label-Switched Paths (LSPs)
- Supports QoS, VPNs (L3VPN / L2VPN)

**Use Cases:**
- Enterprise WAN connectivity between branches
- Carrier-provided L3VPN services
- Deterministic latency paths

**Exam Tip:** MPLS itself is not encrypted — encryption requires overlays like DMVPN, IPsec, or SSL VPN.
      `
    },

    {
      type: "text",
      value: `
## 4) Metro Ethernet

Carrier Ethernet delivered to customer premises.

### Service Types:
- **E-Line:** point-to-point
- **E-LAN:** multipoint-to-multipoint
- **E-Tree:** point-to-multipoint

Benefits:
- High bandwidth (10 Mbps → 10 Gbps)
- Simple Ethernet handoff
- Scalable and cost-effective
      `
    },

    {
      type: "text",
      value: `
## 5) Frame Relay (Legacy Concept)

Although mostly obsolete, CCNA still touches on it.

### Key Terms:
- **DLCI (Data-Link Connection Identifier):** identifies virtual circuit
- **LMI:** link management interface (keepalive)
- **PVC:** permanent virtual circuit
- **NBMA:** non-broadcast multi-access topology

Used in older hub-and-spoke WANs.

**Exam Tip:** Frame Relay maps DLCI → remote site.
      `
    },

    {
      type: "text",
      value: `
## 6) Choosing the Right WAN Technology

| Requirement | Best Choice |
|------------|-------------|
| Highest bandwidth | Metro Ethernet |
| Multi-site connectivity over provider cloud | MPLS L3VPN |
| Legacy low-cost serial link | PPP/HDLC |
| Need authentication on serial | PPP |
| Legacy hub–spoke NBMA | Frame Relay (theory only) |

      `
    },

    {
      type: "text",
      value: `
## Summary

WAN technologies connect geographically dispersed sites. PPP provides robust serial encapsulation features, MPLS powers modern service provider networks, and Metro Ethernet delivers scalable high-speed access. Understanding WAN fundamentals helps you design reliable enterprise networks.

Diagrams are provided for quick exam-ready visualization.
      `
    }
  ]
},
{
  slug: "network-security-essentials",
  title: "Network Security Essentials — Firewalls, IDS/IPS, AAA & Port Security",
  content: [
    {
      type: "text",
      value: `
### 🔒 Lesson Overview

This lesson covers core network security concepts you must know as an engineer: perimeter and host firewalls, intrusion detection/prevention (IDS/IPS), Layer-2 security controls (port security, DHCP snooping, Dynamic ARP Inspection), and AAA (RADIUS/TACACS+) for device authentication and authorization.

We'll examine common attacks (MAC flooding, ARP spoofing, DHCP spoofing, BPDU attacks), how to detect and mitigate them, CLI configuration examples, and hands-on practice with a Security Event Simulator to test defenses and observe log/alert behavior.
      `
    },

    {
      type: "text",
      value: `
### 🎯 Learning Objectives

After this lesson you will be able to:
- Explain the role and differences between firewalls, IDS, and IPS.
- Configure basic Layer-2 protections: port security, DHCP snooping, Dynamic ARP Inspection (DAI).
- Describe common attacks on switching and how to mitigate them.
- Configure AAA (RADIUS/TACACS+) basics for device login and command authorization.
- Use the Security Event Simulator to trigger attacks and observe detection/mitigation.
      `
    },

    {
      type: "image",
      value: "/lessonimages/ccna/firewall-ids-ips-overview.png",
      alt: "Firewall, IDS and IPS relationship overview"
    },

    {
      type: "text",
      value: `
## 1) Firewall vs IDS vs IPS — quick comparison

- **Firewall:** enforces policy at network boundaries (packet/port/application). Can be stateful (tracks connections) or stateless.
- **IDS (Intrusion Detection System):** passive — monitors traffic and raises alerts.
- **IPS (Intrusion Prevention System):** inline — can block/drop malicious traffic in real time.

**Design tip:** Use firewall + IDS/IPS together: firewall for broad filtering and IPS for deep protocol/behavioral detection.
      `
    },

    {
      type: "text",
      value: `
## 2) Layer-2 security: Port Security, DHCP Snooping, DAI

**Port Security**
- Limits MAC addresses on an access port.
- Modes: secure (sticky), protect (drop offending frames), restrict (drop + log + counter).
**CLI (Cisco-like):**
\`\`\`text
interface FastEthernet0/5
 switchport mode access
 switchport port-security
 switchport port-security maximum 2
 switchport port-security violation restrict
 switchport port-security mac-address sticky
\`\`\`

**DHCP Snooping**
- Validates DHCP messages, builds binding database, prevents rogue DHCP servers.
- Mark trusted ports (uplinks) and untrusted ports (access).
**Dynamic ARP Inspection (DAI)**
- Uses DHCP snooping DB to validate ARP messages and prevent ARP spoofing.
      `
    },

    {
      type: "text",
      value: `
## 3) Common switching attacks & mitigations

- **MAC Flooding** — overwhelms CAM table causing switch to flood: mitigate with port security.
- **ARP Spoofing / ARP Poisoning** — use DAI and port security.
- **DHCP Spoofing** — enable DHCP Snooping and mark uplinks as trusted.
- **BPDU Attacks** — enable BPDU Guard on edge ports and use Root Guard on distribution links.
- **STP Manipulation** — root guard / consistent root configuration.

**Operational checklist**
1. Apply PortFast on access ports and BPDU Guard for host-facing ports.
2. Enable DHCP Snooping and DAI where DHCP is used.
3. Document and secure trunk/native VLAN settings.
4. Monitor logs and set alerts for port-security violations and DHCP anomalies.
      `
    },

    {
      type: "image",
      value: "/lessonimages/ccna/aaa-auth-flow.png",
      alt: "AAA authentication and authorization flow (TACACS+/RADIUS)"
    },

    {
      type: "text",
      value: `
## 4) AAA — Authentication, Authorization, Accounting

- **Authentication:** verify identity (local, RADIUS, TACACS+).
- **Authorization:** what commands or access levels a user can execute.
- **Accounting:** logging who did what and when.

**TACACS+ vs RADIUS**
- TACACS+ separates AAA functions and is preferred for device administration (command authorization).
- RADIUS is commonly used for network access (802.1X), integrates with NAS devices.

**Example TACACS+ config (Cisco-like):**
\`\`\`text
tacacs server TAC1
 address ipv4 198.51.100.10
 key MySecretKey

aaa new-model
aaa authentication login default group tacacs+ local
aaa authorization exec default group tacacs+ local
\`\`\`
      `
    },

    {
      type: "text",
      value: `
## 5) Firewall basics & rule hygiene

- Prefer least-privilege rules; place specific permit rules above general ones.
- Use stateful inspection for TCP flows; allow established/related return traffic.
- Log denied flows for troubleshooting and anomaly detection.
- Segment management plane (separate management VLAN, ACLs for SSH/HTTPS).

**Simple firewall example (pseudocode):**
\`\`\`text
permit tcp 10.10.10.0/24 any eq 80
permit tcp 10.10.10.0/24 any eq 443
deny ip any any log
\`\`\`
      `
    },

    {
      type: "text",
      value: `
## 6) Monitoring & incident response

- Collect logs centrally (syslog/ELK/SIEM); configure alerting for port-security violations, DHCP anomalies, and IPS detections.
- Run periodic attack simulations in lab (using Security Event Simulator) to validate rules and detection.
- Maintain playbooks for common incidents (isolate port, disable user, gather PCAP).

**Helpful commands**
\`\`\`text
show port-security interface FastEthernet0/5
show ip dhcp snooping binding
show logging
show ip access-lists
\`\`\`
      `
    },

    {
      type: "text",
      value: `
## 7) Lab / Simulation (recommended)

Use the interactive **SecurityEventSimulator** to:
- Trigger MAC flood and observe port-security actions.
- Simulate DHCP spoofing and verify DHCP snooping blocks rogue servers.
- Simulate ARP poisoning and confirm DAI stops poisoning.
- Test BPDU Guard by emulating a switch on an access port.

**Component name to include in your lesson:** \`SecurityEventSimulator\`  
      `
    },

    {
      type: "component",
      value: SecurityEventSimulator
    },

    {
      type: "text",
      value: `
## 8) Practical checklist (pre-deployment)

- [ ] Enable PortFast & BPDU Guard on host ports.
- [ ] Deploy DHCP Snooping and DAI on access switches.
- [ ] Configure Port Security with appropriate violation mode.
- [ ] Implement TACACS+/RADIUS for device access; test failover/auth fallback.
- [ ] Centralize logs and create SIEM alerts for critical events.
- [ ] Validate defenses with scheduled lab tests.

---

### ✅ Summary

Network security requires layered defenses: correct Layer-2 protections, careful ACL/firewall rules, strong AAA, and active monitoring. Use the SecurityEventSimulator to practice detection and response before deploying changes in production.
      `
    }
  ]
},


];

export default networkingCCNA;
