import ClientServerFlow from "../../components/simulations/full-stack/ClientServerFlow";
import ReactComponentSimulator from "../../components/simulations/full-stack/ReactComponentSimulator";
import ExpressServerSimulator from "../../components/simulations/full-stack/ExpressServerSimulator";
import MongoDBCrudSimulator from "../../components/simulations/full-stack/MongoDBCrudSimulator";
import FetchApiSimulator from "../../components/simulations/full-stack/FetchApiSimulator";
import JwtAuthSimulator from "../../components/simulations/full-stack/JwtAuthSimulator";
import DeploymentPipelineSimulator from "../../components/simulations/full-stack/DeploymentPipelineSimulator";
import ProjectWorkflowSimulator from "../../components/simulations/full-stack/ProjectWorkflowSimulator";

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
{
  slug: "frontend-fundamentals",
  title: "Frontend Fundamentals with React",
  content: [
    {
      type: "text",
      value: `
Welcome to the **Frontend Development** section!  
Before we dive deep into full-stack development, it’s essential to master how the **frontend** works — because this is where users actually interact with your application.

Frontend development is about **building the user interface (UI)** and ensuring a smooth, fast, and intuitive user experience (UX).
      `
    },
    {
      type: "text",
      value: `
### 🧠 What Happens Inside the Browser

When you open a web page:
1. The browser downloads **HTML, CSS, and JavaScript** files.
2. It parses the HTML to create a **DOM (Document Object Model)**.
3. CSS styles are applied to make elements visually appealing.
4. JavaScript makes everything interactive — handling user actions like clicks and form inputs.

But managing complex UI manually with JavaScript becomes difficult — that’s why **React** was created.
      `
    },
    {
      type: "text",
      value: `
### ⚛️ Why React?

React is a **JavaScript library** for building **user interfaces**.  
It lets developers build **reusable components**, manage **application state**, and render UI efficiently using the **Virtual DOM**.

💡 The Virtual DOM is a lightweight in-memory copy of the real DOM.  
When data changes, React updates only what’s necessary — not the entire page.
      `
    },
    {
      type: "text",
      value: `
### 🔍 React Concepts in One Line Each:

| Concept | Description |
|----------|--------------|
| **Component** | A small, reusable piece of UI — like a button or a header. |
| **Props** | Data passed *into* a component from its parent. |
| **State** | Internal data that changes over time. |
| **Hooks** | Functions like \`useState\` and \`useEffect\` that add logic to components. |
| **JSX** | JavaScript + HTML combined in one syntax. |
      `
    },
    {
      type: "text",
      value: `
### 🧩 Your First React Component

Let’s look at the simplest React component — one that greets a user dynamically.
      `
    },
    {
      type: "code",
      language: "jsx",
      runnable: true,
      value: `import React, { useState } from "react";

function Greeting() {
  const [name, setName] = useState("Developer");
  return (
    <div>
      <h1>Hello, {name}! 👋</h1>
      <input 
        type="text" 
        placeholder="Enter your name" 
        onChange={(e) => setName(e.target.value)} 
      />
    </div>
  );
}

export default Greeting;`
    },
    {
      type: "text",
      value: `
### 💬 Step-by-Step Explanation

1. **Imports React and useState:** The \`useState\` hook lets this component hold changing data.
2. **Defines a component function:** React components are just functions that return UI.
3. **Returns JSX:** The \`<div>...</div>\` block defines what gets rendered.
4. **Handles events:** The input’s \`onChange\` updates the \`name\` value, causing a re-render.
5. **Automatic re-render:** When \`setName\` changes the state, React updates the DOM — instantly showing the new name.
      `
    },
    {
      type: "text",
      value: `
### ⚙️ React in Action (Virtual DOM Flow)

1. User types “John”.
2. React updates the Virtual DOM to reflect “John”.
3. React compares the new Virtual DOM with the previous one (diffing algorithm).
4. Only the changed element (text node) is updated in the real DOM.

This makes React **fast**, **efficient**, and **scalable**.
      `
    },
    {
      type: "text",
      value: `
### 🧱 React Component Hierarchy

React apps are built using nested components — like Lego blocks:

\`\`\`
<App>
 ├── <Header />
 ├── <TodoList />
 │     ├── <TodoItem />
 └── <Footer />
\`\`\`

Each component manages its own state and can communicate with others using **props**.
      `
    },
    {
      type: "text",
      value: `
### 💡 Best Practices for React Developers

✅ Keep components small and focused.  
✅ Use meaningful names and consistent folder structure.  
✅ Keep logic and UI separate (custom hooks are great for this).  
✅ Always start component names with capital letters (React convention).  
✅ Write reusable components wherever possible.  
      `
    },
    {
      type: "component",
      value: ReactComponentSimulator
    },
    {
      type: "text",
      value: `
### 🧠 Recap

- React allows you to build interactive UIs efficiently.  
- Components are independent, reusable units of UI.  
- State and props help control data flow and reactivity.  
- The Virtual DOM ensures fast rendering.  

Next, we’ll connect this frontend to a **backend server** and see how they communicate — bringing us one step closer to full-stack mastery.
      `
    }
  ]
},
{
  slug: "backend-with-node-express",
  title: "Backend Basics with Node.js and Express",
  content: [
    {
      type: "text",
      value: `
Welcome to the **Backend Development** section! 🚀  
If the frontend is the face of your application, the **backend** is its brain and heart —  
processing user requests, managing logic, and interacting with databases.

In this lesson, we’ll learn what happens when a user clicks a button on the frontend and how that request is processed on the backend using **Node.js** and **Express.js**.
      `
    },
    {
      type: "text",
      value: `
### 🧠 What Is Node.js?

Node.js is a **runtime environment** that allows JavaScript to run outside of the browser — on the server.  
It uses the **V8 JavaScript engine** (the same one used in Google Chrome) and lets you write both frontend and backend code using one language — JavaScript.

**Why Node.js?**
- It’s **fast** — built on an asynchronous, non-blocking architecture.
- It’s **lightweight** — ideal for building scalable APIs and microservices.
- It’s **everywhere** — one of the most in-demand backend technologies.
      `
    },
    {
      type: "text",
      value: `
### ⚙️ Setting Up Express.js

Express is a minimal and flexible web framework for Node.js.  
It simplifies the process of handling routes, middleware, and API responses.

Let’s create our first Express server:
      `
    },
    {
      type: "code",
      language: "javascript",
      runnable: true,
      value: `// server.js
const express = require('express');
const app = express();

// Default route
app.get('/', (req, res) => {
  res.send('🚀 Hello from the Express Backend!');
});

// Start server
app.listen(3000, () => console.log('✅ Server running at http://localhost:3000'));`
    },
    {
      type: "text",
      value: `
### 🧩 Explanation

1. **Import express:** Loads the Express framework.
2. **Initialize app:** Creates an instance of the Express server.
3. **Define a route:** \`app.get('/', ...)\` handles GET requests to the root URL.
4. **Send a response:** \`res.send()\` sends a text or JSON back to the client.
5. **Start listening:** The app listens on port 3000 for incoming requests.

Now, whenever a user visits \`http://localhost:3000\`, they’ll see the response “Hello from the Express Backend!”.
      `
    },
    {
      type: "text",
      value: `
### 🌍 How Requests Are Handled

1. The frontend sends a request to the backend using **fetch()** or **Axios**.
2. Express receives the request and matches it to a defined route.
3. Middleware (if any) processes or validates the data.
4. The server executes logic or queries the database.
5. The backend sends a response back to the frontend — usually in JSON format.

Every modern app — login systems, dashboards, social feeds — works on this principle.
      `
    },
    {
      type: "code",
      language: "javascript",
      runnable: false,
      value: `// Example: Handling JSON data with POST
app.use(express.json()); // middleware to parse JSON

app.post('/api/register', (req, res) => {
  const user = req.body;
  console.log('New user registered:', user);
  res.json({ success: true, message: 'User created successfully!' });
});`
    },
    {
      type: "text",
      value: `
💡 **Pro Tip:**
Always test your backend APIs with tools like **Postman** or **Thunder Client** (a VS Code extension).  
It helps you simulate client requests before connecting the frontend.
      `
    },
    {
      type: "text",
      value: `
### ⚡ Common Terms in Backend Development

| Term | Meaning |
|------|----------|
| **Route** | The URL pattern that defines where a request is sent (e.g., /login, /users) |
| **Request (req)** | The data sent from the client (headers, body, parameters) |
| **Response (res)** | The data the server sends back to the client |
| **Middleware** | Functions that modify or validate requests before reaching the main logic |
| **API Endpoint** | The address where frontend and backend communicate |
      `
    },
    {
      type: "component",
      value: ExpressServerSimulator
    },
    {
      type: "text",
      value: `
### 🧠 Real-World Analogy

Think of the backend as a restaurant kitchen:
- The **frontend** (waiter) takes your order.
- The **backend** (kitchen) prepares the meal.
- The **database** (storage) provides ingredients.
- The **response** (server output) is the final dish delivered to you.

React and Express together make this flow seamless.
      `
    },
    {
      type: "text",
      value: `
### ✅ Recap

- Node.js allows JavaScript to run on the server.  
- Express simplifies server creation and API handling.  
- Backend routes process user requests and send responses.  
- JSON is the universal data format for communication.  

Next, we’ll connect our backend to a **database** — storing and retrieving real information like users, products, or blog posts.
      `
    }
  ]
},
{
  slug: "database-integration-mongodb",
  title: "Database Integration with MongoDB (CRUD Operations)",
  content: [
    {
      type: "text",
      value: `
Welcome to the **Database Integration** section! 🗄️  
In this lesson, you’ll learn how your backend connects to a real database to **store, retrieve, and manage data**.

Until now, your backend could send static responses.  
Now, with a database, you can **save user accounts, products, or messages** that persist between sessions.
      `
    },
    {
      type: "text",
      value: `
### 🧠 What Is a Database?

A **database** is where all your application data lives — securely and persistently.

| Type | Description | Example |
|------|--------------|----------|
| **SQL** | Structured — uses tables and rows | MySQL, PostgreSQL |
| **NoSQL** | Document-based — stores JSON-like data | MongoDB, Firebase |

In full-stack JavaScript projects, **MongoDB** is the most popular NoSQL choice because it integrates seamlessly with Node.js through **Mongoose**.
      `
    },
    {
      type: "text",
      value: `
### ⚙️ Setting Up MongoDB

1. Create a MongoDB account at [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a new **cluster** and get your **connection string (URI)**.
3. Install Mongoose:
      `
    },
    {
      type: "code",
      language: "bash",
      runnable: false,
      value: `
# Install mongoose
npm install mongoose

# Example .env file
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/myapp
      `
    },
    {
      type: "text",
      value: `
### 🧩 Connecting Node.js to MongoDB

Use **Mongoose** to connect your backend with the database.
      `
    },
    {
      type: "code",
      language: "javascript",
      runnable: true,
      value: `// db.js
const mongoose = require('mongoose');
const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ Connection error:', err));`
    },
    {
      type: "text",
      value: `
Once connected, you can define **schemas and models** that represent your data structure.
      `
    },
    {
      type: "code",
      language: "javascript",
      runnable: true,
      value: `// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number
});

module.exports = mongoose.model('User', userSchema);`
    },
    {
      type: "text",
      value: `
### 🔁 CRUD Operations with Express + MongoDB

CRUD stands for:
- **C**reate — Add new data
- **R**ead — Retrieve data
- **U**pdate — Modify existing data
- **D**elete — Remove data

Let’s implement them in Express routes:
      `
    },
    {
      type: "code",
      language: "javascript",
      runnable: false,
      value: `const express = require('express');
const router = express.Router();
const User = require('./models/User');

// CREATE
router.post('/users', async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

// READ
router.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// UPDATE
router.put('/users/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
});

// DELETE
router.delete('/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

module.exports = router;`
    },
    {
      type: "text",
      value: `
### 💡 Understanding MongoDB Documents

Each record in MongoDB is a **document**, not a row.  
Documents are stored in **collections** (similar to tables) and formatted in JSON.

Example document:
\`\`\`json
{
  "_id": "64b1a02e1c89f1b5a0e2d345",
  "name": "Priya",
  "email": "priya@example.com",
  "age": 26
}
\`\`\`
      `
    },
    {
      type: "component",
      value: MongoDBCrudSimulator
    },
    {
      type: "text",
      value: `
### ⚡ Common Mistakes and Fixes

| Mistake | Solution |
|----------|-----------|
| Forgot to call \`app.use(express.json())\` | Add it before defining routes |
| Forgot to connect DB before using models | Import and await connection |
| Wrong cluster URI format | Check `.env` and ensure correct username/password |
| Missing schema export | Always export your Mongoose model |
      `
    },
    {
      type: "text",
      value: `
### ✅ Recap

- MongoDB stores JSON-like data (documents).
- Mongoose simplifies schema definition and data handling.
- CRUD = Create, Read, Update, Delete — the core of backend operations.
- With Express + MongoDB, your app can now store and manage real data.

Next up: **Lesson 5 — Connecting Frontend to Backend**  
You’ll learn how React components fetch this data dynamically and display it live.
      `
    }
  ]
},
{
  slug: "frontend-backend-integration",
  title: "Connecting Frontend with Backend (React + API Integration)",
  content: [
    {
      type: "text",
      value: `
Welcome to **Frontend-Backend Integration** 🌐  
You’ve built a frontend with React and a backend using Express + MongoDB — now it’s time to **connect them**.

This is where the user’s action on the UI triggers backend logic and data updates in the database.
      `
    },
    {
      type: "text",
      value: `
### 🧠 What Is an API?

An **API (Application Programming Interface)** acts as a bridge between frontend and backend.  
Your React app (client) sends **HTTP requests**, and the backend responds with **JSON** data.

Example flow:
1. The user clicks “Load Users”.
2. React sends a **GET request** to \`/api/users\`.
3. Express receives the request, fetches data from MongoDB.
4. Express sends back JSON → React displays it instantly.
      `
    },
    {
      type: "text",
      value: `
### ⚙️ Setting Up CORS

To allow communication between the frontend (React) and backend (Express), enable **CORS (Cross-Origin Resource Sharing)**.

\`\`\`bash
npm install cors
\`\`\`

Then in your Express app:
      `
    },
    {
      type: "code",
      language: "javascript",
      runnable: true,
      value: `// server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'Aarav' },
    { id: 2, name: 'Diya' },
    { id: 3, name: 'Raj' }
  ]);
});

app.listen(4000, () => console.log('✅ API running at http://localhost:4000'));`
    },
    {
      type: "text",
      value: `
### 🧩 Fetching Data in React

Now that our backend API is ready, we’ll use React’s **fetch()** or **Axios** to request data.
      `
    },
    {
      type: "code",
      language: "jsx",
      runnable: true,
      value: `import React, { useState, useEffect } from "react";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map(u => <li key={u.id}>{u.name}</li>)}
      </ul>
    </div>
  );
}

export default UserList;`
    },
    {
      type: "text",
      value: `
### 💬 Explanation

1. **useEffect()** runs once after the component mounts.
2. **fetch()** sends a GET request to the backend API.
3. **Response** is converted into JSON.
4. **State (users)** is updated, triggering a re-render.
5. **UI updates** automatically with the new data.

This is the standard React–API pattern used in every production web app.
      `
    },
    {
      type: "text",
      value: `
### 🔄 How the Communication Happens

| Step | Action |
|------|---------|
| 1 | React triggers a request (fetch/axios) |
| 2 | Express receives it via a route |
| 3 | Middleware (like JSON parser) processes the request |
| 4 | MongoDB data is read or modified |
| 5 | Server sends JSON response back |
| 6 | React updates the UI instantly |

Let’s visualize this entire lifecycle next. 👇
      `
    },
    {
      type: "component",
      value: FetchApiSimulator
    },
    {
      type: "text",
      value: `
### ⚡ Common Errors and Fixes

| Problem | Cause | Fix |
|----------|--------|-----|
| CORS Error | Different ports between frontend and backend | Use \`app.use(cors())\` |
| Network Error | Backend not running | Start server first (\`node server.js\`) |
| Empty Response | Forgot \`res.json()\` in backend | Always send valid JSON |
| Fetch Infinite Loop | Missing dependency array | Add \`[]\` in \`useEffect()\` |

Understanding these small details makes debugging much easier.
      `
    },
    {
      type: "text",
      value: `
### ✅ Recap

- APIs connect frontend and backend.  
- React uses **fetch()** or **Axios** to communicate.  
- Express responds with JSON from MongoDB.  
- The UI automatically updates when state changes.

Next, we’ll go deeper into **authentication and JWT-based login systems** — bringing real-world user management into your app.
      `
    }
  ]
},
{
  slug: "authentication-jwt",
  title: "Authentication and JWT (Secure Login System)",
  content: [
    {
      type: "text",
      value: `
Welcome to **User Authentication and JWT** 🔐  
This lesson focuses on securing your full-stack application — so only verified users can log in and access protected routes.

You’ll learn how **JSON Web Tokens (JWT)** work, how they are created, and how both frontend and backend use them to maintain secure sessions.
      `
    },
    {
      type: "text",
      value: `
### 🧠 What Is Authentication?

**Authentication** means verifying *who* a user is.  
When you log in to an app using your email and password, the backend checks your credentials, and if valid, gives you access.

**Authorization** means deciding *what* that user can do.  
Example: an admin can delete users, but a regular user cannot.
      `
    },
    {
      type: "text",
      value: `
### 🔍 The Role of JWT

JWT (JSON Web Token) is a secure way to authenticate users between frontend and backend.  
It’s a small, encrypted string that contains verified user data — like an access pass.

Example token:
\`\`\`json
{
  "user": "Priya",
  "role": "admin",
  "iat": 1731528000,
  "exp": 1731531600
}
\`\`\`

When encoded, it looks like this:
\`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\`
      `
    },
    {
      type: "text",
      value: `
### ⚙️ Setting Up Authentication in Express

1. Install required libraries:
\`\`\`bash
npm install bcryptjs jsonwebtoken
\`\`\`

2. Create user registration and login routes:
      `
    },
    {
      type: "code",
      language: "javascript",
      runnable: true,
      value: `const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();

app.use(express.json());

const users = []; // In-memory user store (demo only)

// REGISTER
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  users.push({ username, password: hashed });
  res.json({ message: 'User registered!' });
});

// LOGIN
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.status(400).json({ error: 'User not found' });
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ username }, 'secret123', { expiresIn: '1h' });
  res.json({ message: 'Login successful', token });
});

// PROTECTED ROUTE
app.get('/dashboard', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(403).json({ error: 'No token' });
  const token = auth.split(' ')[1];
  try {
    const verified = jwt.verify(token, 'secret123');
    res.json({ message: \`Welcome \${verified.username}\` });
  } catch {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
});

app.listen(5000, () => console.log('✅ Auth server running on port 5000'));`
    },
    {
      type: "text",
      value: `
### 💬 Step-by-Step Flow

1. **Registration:** The user’s password is hashed (never stored in plain text).  
2. **Login:** Credentials are verified, and a **JWT token** is issued.  
3. **Frontend stores** the token in localStorage or cookies.  
4. **Every request** to protected routes includes this token in the Authorization header.  
5. The backend verifies the token before responding.
      `
    },
    {
      type: "text",
      value: `
### 🧱 JWT Structure

A JWT has **three parts**, separated by dots:
\`\`\`
HEADER.PAYLOAD.SIGNATURE
\`\`\`

Example:
\`\`\`
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiUHJpeWEiLCJyb2xlIjoiYWRtaW4ifQ.T6wZ4b...
\`\`\`

| Part | Meaning |
|------|----------|
| Header | Algorithm & token type |
| Payload | Actual user data |
| Signature | Encrypted key verifying the token’s authenticity |
      `
    },
    {
      type: "component",
      value: JwtAuthSimulator
    },
    {
      type: "text",
      value: `
### ⚡ Common Mistakes and Fixes

| Mistake | Fix |
|----------|-----|
| Using same secret in public repo | Always use environment variable |
| Storing password without hashing | Use bcrypt to hash passwords |
| JWT token expired errors | Set proper expiration time |
| Missing \`Authorization\` header | Always include token in requests |

🔑 Remember: JWT tokens are stateless — the server doesn’t store sessions; instead, it validates the token itself.
      `
    },
    {
      type: "text",
      value: `
### ✅ Recap

- **JWT** provides stateless, secure authentication.
- **bcryptjs** hashes passwords for protection.
- **Express middleware** validates tokens before allowing access.
- **Frontend stores** and sends JWTs on every protected request.

Next, we’ll explore **Lesson 7: Deploying Your Full-Stack App** — bringing your project live on the internet using Netlify and Render.
      `
    }
  ]
},
{
  slug: "deployment-fullstack",
  title: "Deploying Your Full-Stack App (Frontend + Backend)",
  content: [
    {
      type: "text",
      value: `
Welcome to **Deployment** 🚀 — the final stage of your full-stack development journey.

So far you’ve built a powerful React + Node + MongoDB app locally.  
Now, let’s make it **accessible to the world** using cloud platforms.
      `
    },
    {
      type: "text",
      value: `
### 🌐 Why Deployment Matters

Deployment transforms your project into a **production-ready service** that others can use.  
In real-world jobs, developers are expected to:
- Push code to GitHub
- Host frontend (Netlify/Vercel)
- Deploy backend APIs (Render/Heroku/AWS)
- Connect both via environment variables
- Handle versioning and uptime monitoring
      `
    },
    {
      type: "text",
      value: `
### 🧱 Full-Stack Deployment Architecture

\`\`\`
User → Netlify (React) → Fetch API → Render (Express Server) → MongoDB Atlas
\`\`\`

Each layer communicates over HTTPS:
- **Frontend:** React app served as static files
- **Backend:** Express API hosted on Render
- **Database:** MongoDB Atlas Cloud
      `
    },
    {
      type: "text",
      value: `
### ⚙️ Step 1: Prepare Your Frontend

1. Inside your React project:
\`\`\`bash
npm run build
\`\`\`

2. This creates a \`build/\` folder containing optimized static files.  
3. Sign up at [https://www.netlify.com](https://www.netlify.com)
4. Create a **New Site from Git** → connect your GitHub repo.
5. Netlify automatically detects React and builds it.

✅ Once deployed, you’ll get a live URL like  
\`https://cybercode-fullstack.netlify.app\`
      `
    },
    {
      type: "text",
      value: `
### ⚙️ Step 2: Prepare Your Backend

Use **Render** (or alternatives like Railway, Vercel Functions, or AWS EC2).

1. Push your Express + MongoDB backend to GitHub.  
2. Sign up at [https://render.com](https://render.com)  
3. Create a **New Web Service**  
   - Select your repo  
   - Choose branch (main)  
   - Add start command:  
     \`node server.js\`  
4. Add Environment Variables:
   - \`MONGO_URI\` — from MongoDB Atlas  
   - \`JWT_SECRET\` — your secret key  
   - \`CORS_ORIGIN\` — your Netlify site URL
5. Click **Deploy** — Render builds and runs the server.
      `
    },
    {
      type: "text",
      value: `
### 🔗 Step 3: Connect Frontend ↔ Backend

Inside your React app, change API URLs from local to live:

\`\`\`js
// Old
fetch("http://localhost:5000/api/users")

// New
fetch("https://your-backend.onrender.com/api/users")
\`\`\`

Netlify → requests → Render → MongoDB Atlas → back to browser ✅
      `
    },
    {
      type: "text",
      value: `
### 🧪 Step 4: Test the Live Connection

- Open browser console → check API response.  
- Try logging in or posting new data.  
- Ensure CORS errors are fixed by allowing your frontend URL in backend settings.
      `
    },
    {
      type: "text",
      value: `
### 🧰 Step 5: Automate Deployment with CI/CD

Every time you **push to GitHub**, Netlify and Render will auto-build and redeploy your app.

This is called **Continuous Integration / Continuous Deployment (CI/CD)**.  
No manual uploads needed — everything stays synchronized.
      `
    },
    {
      type: "component",
      value: DeploymentPipelineSimulator
    },
    {
      type: "text",
      value: `
### ⚡ Common Deployment Issues

| Problem | Reason | Fix |
|----------|---------|-----|
| API 404 | Wrong endpoint URL | Verify live backend route |
| CORS error | Backend not allowing origin | Add Netlify URL in CORS |
| MongoDB timeout | Network block | Whitelist IPs in MongoDB Atlas |
| Build failed on Netlify | Missing env vars | Configure in Netlify settings |
| Invalid token after deploy | Different JWT_SECRET | Keep env secrets identical |
      `
    },
    {
      type: "text",
      value: `
### ✅ Recap

- React → Netlify for static hosting  
- Express + MongoDB → Render for backend  
- API URLs updated for production  
- CI/CD keeps your deployment up-to-date  
- Environment variables secure your data  

Next, we’ll wrap up the course with **Lesson 8: Capstone Project — Deploy Your Own Full-Stack App!**
      `
    }
  ]
},
{
  slug: "capstone-project",
  title: "Capstone Project — Build & Deploy Your Own Full-Stack App",
  content: [
    {
      type: "text",
      value: `
🎓 **Congratulations!** You've reached the Capstone Project — the final milestone in your Full-Stack Web Development journey.  
Now it’s time to build a **complete production-grade web application** that demonstrates all your skills from frontend to backend.
      `
    },
    {
      type: "text",
      value: `
### 🧱 Project Objective

You’ll design and develop a **Full-Stack MERN Application** (MongoDB, Express, React, Node.js) and deploy it to the cloud using **Netlify** and **Render**.

The goal is to show:
- Your ability to plan, design, and structure a full-stack app.
- How you integrate frontend and backend.
- How you implement authentication, CRUD operations, and live deployment.
      `
    },
    {
      type: "text",
      value: `
### 💡 Suggested Project Ideas

| Project | Description |
|----------|--------------|
| **1. Task Tracker App** | Users can create, update, and delete tasks. Add JWT login and database sync. |
| **2. Blog Platform** | Users register, post blogs, comment, and like posts. |
| **3. Expense Manager** | Add, edit, and view financial transactions — analytics via charts. |
| **4. Notes App (with Auth)** | Create personal notes — saved per user using JWT + MongoDB. |
| **5. Student Dashboard** | Display user info, enrolled courses, and progress tracking. |
      `
    },
    {
      type: "text",
      value: `
### 🧩 Mandatory Features

Your project **must** include the following:
1. **Frontend (React)** with at least 4 pages:
   - Home  
   - Login/Register  
   - Dashboard  
   - About/Settings  

2. **Backend (Express)** with:
   - User Authentication (JWT)  
   - At least 2 REST API routes (GET/POST/PUT/DELETE)  
   - MongoDB CRUD integration  

3. **Database (MongoDB)** using **Atlas Cloud**.

4. **Deployment**:
   - React → Netlify  
   - Backend → Render  
   - Environment variables properly configured  

5. **Documentation**:
   - GitHub README with setup instructions and screenshots  
   - Live links to both frontend and backend  
      `
    },
    {
      type: "text",
      value: `
### 🧠 Example Architecture

\`\`\`
React (Frontend)
  ↓ fetch()
Express.js (Backend)
  ↓ Mongoose
MongoDB Atlas (Database)
  ↑ JWT Authentication
Netlify + Render (Deployment)
\`\`\`

This mirrors real-world full-stack production apps used in companies today.
      `
    },
    {
      type: "text",
      value: `
### 🧪 Example API Endpoints

\`\`\`js
POST   /api/register     -> Create a new user
POST   /api/login        -> Generate JWT
GET    /api/tasks        -> Get all tasks (requires JWT)
POST   /api/tasks        -> Add a new task
DELETE /api/tasks/:id    -> Delete task
\`\`\`

Frontend uses \`fetch()\` or Axios to call these routes.
      `
    },
    {
      type: "component",
      value: ProjectWorkflowSimulator
    },
    {
      type: "text",
      value: `
### 📋 Evaluation Criteria

| Category | Weight | Description |
|-----------|--------|-------------|
| Functionality | 30% | App runs without major errors; all features work |
| Code Quality | 20% | Code readability, structure, and best practices |
| UI/UX | 15% | Clean, responsive design |
| Authentication & Security | 20% | JWT implementation, password hashing |
| Deployment & Docs | 15% | Working live links and README file |
      `
    },
    {
      type: "text",
      value: `
### 🧰 Tools & Libraries

| Category | Tool |
|-----------|------|
| Frontend | React, TailwindCSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Auth | JWT, bcryptjs |
| Deployment | Netlify (React), Render (Node) |
| Version Control | GitHub |
      `
    },
    {
      type: "text",
      value: `
### 🧭 Steps to Submit Your Project

1. Push your full project (both frontend & backend) to GitHub.  
2. Deploy frontend to Netlify and backend to Render.  
3. Add live links to README.  
4. Share your GitHub repo link and live URLs for evaluation.  

**Optional:** Record a 2-minute demo video explaining your app’s flow.
      `
    },
    {
      type: "text",
      value: `
### ✅ Learning Outcomes

By completing this project, you’ll gain:
- Real-world full-stack app development experience  
- Hands-on deployment workflow  
- Strong GitHub portfolio piece  
- Confidence to apply for full-stack or MERN developer roles  

**Congratulations — you’re now officially a Full-Stack Developer!** 🥳
      `
    }
  ]
},


  ];

  export default fullStackWebDev;