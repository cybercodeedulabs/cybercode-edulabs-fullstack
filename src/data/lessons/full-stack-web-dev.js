const fullStackWebDev = [
    {
  slug: "intro-to-full-stack",
  title: "Introduction to Full-Stack Development",
  content: [
    {
      type: "text",
      value: `
Welcome to the **Full-Stack Web Development Course**! 🚀  
In this course, you’ll learn to build complete web applications from scratch — both **frontend** (the part users see) and **backend** (the part that processes data, APIs, and logic).

Let’s start by understanding what *Full-Stack* actually means.
      `
    },
    {
      type: "text",
      value: `
### 🧠 What is Full-Stack Development?

Full-stack development means working on *both sides* of an application — **frontend** and **backend**, plus knowing how they connect through APIs and databases.

A full-stack developer:
- Designs responsive interfaces (Frontend)
- Builds REST APIs and handles requests (Backend)
- Works with data storage, queries, and relationships (Database)
- Understands deployment, scaling, and version control

Simply put — they can **take an idea from concept to a running web app**.
      `
    },
    {
      type: "text",
      value: `
### 🧩 How the Web Works: A Simple Analogy

Think of a web app like a restaurant:

| Layer | Role | Example |
|-------|------|----------|
| **Frontend** | The waiter — takes your order and shows you the menu | React, HTML, CSS, JS |
| **Backend** | The kitchen — prepares your food based on the order | Node.js, Express |
| **Database** | The storage — holds all ingredients and recipes | MongoDB, MySQL |

When you click a button in your browser:
1. The **frontend** sends a request to the **backend** (like placing an order).
2. The **backend** processes the request and interacts with the **database**.
3. The **database** returns data (like the meal).
4. The **backend** sends that data back to the **frontend**, which displays it to you.
      `
    },
    {
      type: "text",
      value: `
### ⚙️ The Full-Stack Developer Toolchain

To build this complete workflow, you'll use a combination of technologies:

| Purpose | Tool/Tech |
|----------|------------|
| Frontend | HTML, CSS, JavaScript, React |
| Backend | Node.js, Express.js |
| Database | MongoDB or MySQL |
| Version Control | Git & GitHub |
| Deployment | Netlify (Frontend), Render/Heroku (Backend) |

Each part is critical — and by the end of this course, you’ll be comfortable setting up and connecting all of them seamlessly.
      `
    },
    {
      type: "code",
      language: "bash",
      runnable: false,
      value: `
# ✅ Step 1: Install Node.js and npm
sudo apt install nodejs npm -y

# ✅ Step 2: Check versions
node -v
npm -v

# ✅ Step 3: Set up your full-stack project folder
mkdir fullstack-app && cd fullstack-app
npm init -y
      `
    },
    {
      type: "text",
      value: `
### 💡 Developer Insight

> Every web page you interact with — whether it's YouTube, LinkedIn, or Netflix — is a full-stack system.  
> The frontend delivers user experience, while the backend manages millions of user requests every second.

Understanding both sides empowers you to:
- Debug issues across the stack
- Collaborate effectively with designers and backend teams
- Build projects *independently* without relying on others
      `
    },
    {
      type: "text",
      value: `
### 🧭 Course Roadmap

Here’s what you’ll master step by step:

1. **Frontend Development (React)** — Learn how browsers render content, use components, and manage state.
2. **Backend Development (Node.js + Express)** — Create APIs and handle client-server communication.
3. **Databases (MongoDB)** — Store, query, and secure application data.
4. **Authentication & Deployment** — Add user login and host your app online.

After completing this course, you’ll be able to **build and deploy full-stack apps** professionally — the same skills companies look for in junior to mid-level developers.
      `
    },
    {
      type: "text",
      value: `
### 🔁 Recap

- Full-stack = Frontend + Backend + Database.
- Everything a user sees or interacts with comes from the *frontend*.
- Everything that happens behind the scenes (like saving data, verifying login, etc.) happens in the *backend*.
- The *database* ensures your data persists even when the app restarts.

In short — **you’ll learn to build both sides and connect them.**
      `
    },
    {
      type: "component",
      value: ClientServerFlow
    }
  ]
},

  ];

  export default fullStackWebDev;