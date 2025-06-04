const fullStackWebDev = [
    {
      slug: "intro-to-full-stack",
      title: "Introduction to Full-Stack Development",
      content: [
        {
          type: "text",
          value:
            "Full-stack development involves working on both frontend and backend of web applications."
        },
        {
          type: "code",
          language: "javascript",
          value: `// Example: Simple Express server
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello Full-Stack World!');
});

app.listen(3000, () => console.log('Server started on port 3000'));`,
runnable: true
        }
      ]
    },
    {
      slug: "frontend-basics",
      title: "Frontend Basics with React",
      content: [
        {
          type: "text",
          value: "React is a popular JavaScript library for building UI components."
        },
        {
          type: "code",
          language: "jsx",
          value: `function Hello() {
  return <h1>Hello from React!</h1>;
}`,
runnable: true
        }
      ]
    },
    {
      slug: "backend-basics",
      title: "Backend Basics with Node.js",
      content: [
        {
          type: "text",
          value: "Node.js allows JavaScript to run on the server side."
        },
        {
          type: "code",
          language: "javascript",
          value: `const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.end('Hello Node.js!');
});

server.listen(3000);`,
runnable: true
        }
      ]
    }
  ];

  export default fullStackWebDev;