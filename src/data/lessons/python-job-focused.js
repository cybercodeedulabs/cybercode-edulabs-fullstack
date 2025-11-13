// src/data/lessons/python-job-focused.js
import FileAutomationLab from "../../components/simulations/python-job-focused/FileAutomationLab";
import FlaskApiLab from "../../components/simulations/python-job-focused/FlaskApiLab";
import AwsS3Lab from "../../components/simulations/python-job-focused/AwsS3Lab";
import DevOpsAutomationLab from "../../components/simulations/python-job-focused/DevOpsAutomationLab";
import PackageBuilderLab from "../../components/simulations/python-job-focused/PackageBuilderLab";
import SqliteLab from "../../components/simulations/python-job-focused/SqliteLab";

const pythonJobFocused = [
  {
    title: "Introduction to Python for Professionals",
    slug: "intro-to-python-for-professionals",
    content: [
      {
        type: "text",
        value: `
Python isn't just for beginners — it’s the backbone of **automation, DevOps, data pipelines, and backend services** across the IT industry.  
In this lesson, you'll understand **why Python is in every job description** and how to set up your professional environment for coding like a developer.
        `
      },
      {
        type: "text",
        value: `
✅ **Objectives:**
- Understand where Python fits in backend, cloud, and DevOps.
- Learn the tools professionals use.
- Set up VS Code, Git, and Python virtual environments.
        `
      },
      {
        type: "code",
        language: "bash",
        runnable: false,
        value: `
# Install Python (if not installed)
sudo apt update && sudo apt install python3 python3-pip -y

# Install VS Code (optional)
sudo snap install --classic code

# Configure Git
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
        `
      },
      {
        type: "text",
        value: `
🔹 **Professional Tip:** Always use a virtual environment (\`venv\`) for every project. It isolates dependencies, prevents version conflicts, and reflects real-world DevOps practice.
        `
      },
      {
        type: "code",
        language: "bash",
        runnable: false,
        value: `
# Create and activate venv
python3 -m venv myenv
source myenv/bin/activate
        `
      }
    ]
  },

  {
    title: "Python Fundamentals Refresher",
    slug: "python-fundamentals-refresher",
    content: [
      {
        type: "text",
        value: `
This lesson quickly revisits Python essentials used in automation and backend scripts.  
Even professionals often overlook these basics while debugging complex systems.
        `
      },
      {
        type: "code",
        language: "python",
        runnable: true,
        value: `
# Variables and types
name = "Cybercode EduLabs"
version = 3.10
is_active = True

print(f"Welcome to {name}, Python {version} is_active={is_active}")
        `
      },
      {
        type: "text",
        value: `
💡 **Job Insight:** Companies test Python engineers on fundamentals during coding interviews — especially loops, conditionals, and comprehension syntax.
        `
      },
      {
        type: "code",
        language: "python",
        runnable: true,
        value: `
# Looping over a list
servers = ["app01", "app02", "db01"]
for s in servers:
    print(f"Connecting to {s}...")

# List comprehension (used in automation scripts)
status = [f"{s}: OK" for s in servers]
print(status)
        `
      }
    ]
  },

  {
    title: "Functions, Modules & Packages",
    slug: "functions-modules-packages",
    content: [
      {
        type: "text",
        value: `
In automation and backend development, **modular code** is everything.  
Functions make your scripts reusable, testable, and cleaner — the foundation for microservices and pipelines.
        `
      },
      {
        type: "code",
        language: "python",
        runnable: true,
        value: `
def greet(user):
    return f"Hello, {user}! Welcome to Cybercode EduLabs."

print(greet("Cybercode"))
        `
      },
      {
        type: "text",
        value: `
🔹 **Modules:** Store functions in a separate file like \`utils.py\`, then import them.

🔹 **Packages:** Create a folder with an \`__init__.py\` file — this becomes a reusable package for automation tools.
        `
      },
      {
        type: "code",
        language: "python",
        runnable: false,
        value: `
# Directory example:
automation_tool/
    __init__.py
    network.py
    aws_utils.py
        `
      }
    ]
  },

  {
    title: "File Handling & OS Automation",
    slug: "file-handling-os-automation",
    content: [
      {
        type: "text",
        value: `
Python’s file-handling and OS modules power most **DevOps scripts** — from log rotation to file uploads and data extraction.
        `
      },
      {
        type: "code",
        language: "python",
        runnable: true,
        value: `
import os, datetime

log_file = "system.log"
with open(log_file, "a") as f:
    f.write(f"Log entry created at {datetime.datetime.now()}\\n")

print("✅ Log updated:", os.path.abspath(log_file))
        `
      },
      { type: "component", value: FileAutomationLab },
      {
        type: "text",
        value: `
💡 **Tip:** In enterprise environments, always add exception handling and logging.  
It’s a key differentiator between beginner scripts and production-ready automation.
        `
      }
    ]
  },

  {
    title: "Working with APIs (Requests + JSON)",
    slug: "working-with-apis",
    content: [
      {
        type: "text",
        value: `
APIs are everywhere — backend developers and DevOps engineers use them daily.  
Python’s \`requests\` module lets you integrate third-party services and cloud platforms with ease.
        `
      },
      {
        type: "code",
        language: "python",
        runnable: true,
        value: `
import requests

response = requests.get("https://api.github.com/users/octocat")
if response.status_code == 200:
    data = response.json()
    print("Username:", data["login"])
    print("Followers:", data["followers"])
else:
    print("Error fetching data:", response.status_code)
        `
      },
      {
        type: "text",
        value: `
🔹 Use APIs for AWS, Jenkins, or Slack automation.  
🔹 Parse JSON responses — this is the core of **Python-based orchestration**.
        `
      }
    ]
  },

  {
    title: "Python for Cloud & AWS SDK (boto3)",
    slug: "python-aws-boto3",
    content: [
      {
        type: "text",
        value: `
AWS automation with Python is one of the most in-demand DevOps skills.  
With the \`boto3\` library, you can manage EC2 instances, S3 buckets, and IAM roles programmatically.
        `
      },
      {
        type: "code",
        language: "python",
        runnable: false,
        value: `
import boto3

s3 = boto3.client('s3')
for bucket in s3.list_buckets()['Buckets']:
    print(bucket['Name'])
        `
      },
      { type: "component", value: AwsS3Lab },
      {
        type: "text",
        value: `
💡 **Pro Tip:** Use IAM roles or environment variables for authentication — never hardcode AWS keys in scripts.
        `
      }
    ]
  },

  {
    title: "Final Project: Automation Dashboard",
    slug: "automation-dashboard-project",
    content: [
      {
        type: "text",
        value: `
🎯 **Capstone Project: Cloud Automation Dashboard**
- Build a Flask-based dashboard that automates AWS EC2 instance listing.
- Display instance names, IDs, and statuses in a web UI.
- Integrate with \`boto3\` and SQLite to track actions.
        `
      },
      {
        type: "code",
        language: "python",
        runnable: false,
        value: `
from flask import Flask, render_template
import boto3

app = Flask(__name__)
ec2 = boto3.client('ec2')

@app.route('/')
def index():
    instances = ec2.describe_instances()
    return {"count": len(instances['Reservations'])}

if __name__ == "__main__":
    app.run(debug=True)
        `
      },
      {
        type: "text",
        value: `
✅ **Deliverables:**
- Flask project folder
- AWS integration
- README.md documenting setup and results
        `
      }
    ]
  },
// Continuation — remaining lessons for python-job-focused.js

pythonJobFocused.push(
  {
    title: "Error Handling & Debugging",
    slug: "error-handling-debugging",
    content: [
      {
        type: "text",
        value: `
A professional developer doesn't just write code — they handle errors gracefully and log every critical operation.  
In this lesson, you'll learn structured exception handling and debugging techniques.
        `
      },
      {
        type: "code",
        language: "python",
        runnable: true,
        value: `
try:
    number = int(input("Enter a number: "))
    result = 10 / number
    print("Result:", result)
except ZeroDivisionError:
    print("❌ Cannot divide by zero!")
except ValueError:
    print("❌ Invalid input, please enter a number.")
finally:
    print("Execution complete.")
        `
      },
      {
        type: "text",
        value: `
💡 **Pro Tip:** Use Python's built-in \`logging\` module instead of print statements in production scripts.  
This ensures logs are stored persistently and can be integrated with monitoring systems like ELK or CloudWatch.
        `
      }
    ]
  },

  {
    title: "Object-Oriented Python for Projects",
    slug: "object-oriented-python",
    content: [
      {
        type: "text",
        value: `
Object-Oriented Programming (OOP) helps structure Python automation tools and backend apps cleanly.  
It allows reusability, encapsulation, and easy maintenance — core principles in enterprise-grade systems.
        `
      },
      {
        type: "code",
        language: "python",
        runnable: true,
        value: `
class Server:
    def __init__(self, name, ip):
        self.name = name
        self.ip = ip

    def connect(self):
        print(f"🔌 Connecting to {self.name} ({self.ip})")

class AWS_Server(Server):
    def connect(self):
        print(f"🌐 Connecting securely to AWS EC2: {self.name} ({self.ip})")

s1 = AWS_Server("web-prod-01", "10.0.0.5")
s1.connect()
        `
      },
      {
        type: "text",
        value: `
💼 **Use Case:** OOP concepts like inheritance and polymorphism are heavily used in tools like Ansible, Flask, and custom DevOps frameworks.
        `
      }
    ]
  },

  {
    title: "Databases with Python",
    slug: "databases-with-python",
    content: [
      {
        type: "text",
        value: `
Most backend systems and automation dashboards store results in databases.  
Here, you'll learn to interact with both local (SQLite) and enterprise (PostgreSQL) databases.
        `
      },
      {
        type: "code",
        language: "python",
        runnable: true,
        value: `
import sqlite3

conn = sqlite3.connect("labdata.db")
cursor = conn.cursor()

cursor.execute("CREATE TABLE IF NOT EXISTS logs (id INTEGER PRIMARY KEY, action TEXT)")
cursor.execute("INSERT INTO logs (action) VALUES ('Lab session started')")
conn.commit()

for row in cursor.execute("SELECT * FROM logs"):
    print(row)

conn.close()
        `
      },
      { type: "component", value: SqliteLab },
      {
        type: "text",
        value: `
🔹 SQLite is ideal for quick automation data.  
🔹 For production, use PostgreSQL or AWS RDS with the \`psycopg2\` library.
        `
      }
    ]
  },

  {
    title: "Scripting & Automation (DevOps Tasks)",
    slug: "scripting-and-automation",
    content: [
      {
        type: "text",
        value: `
Python can replace shell scripts for DevOps automation — creating users, managing services, and monitoring servers efficiently.
        `
      },
      {
        type: "code",
        language: "python",
        runnable: true,
        value: `
import os

def create_user(username):
    print(f"Creating user: {username}")
    os.system(f"sudo useradd {username}")

create_user("student01")
        `
      },
      { type: "component", value: DevOpsAutomationLab },
      {
        type: "text",
        value: `
⚙️ **Common Tasks Automated:**
- Log rotation
- Backup scripts
- Continuous Integration triggers (Jenkins)
- Cloud provisioning
        `
      }
    ]
  },

  {
    title: "Web Development with Flask",
    slug: "web-development-with-flask",
    content: [
      {
        type: "text",
        value: `
Flask is a lightweight web framework used for building backend APIs and dashboards.  
This lesson helps you create a basic REST API used in cloud automation dashboards.
        `
      },
      {
        type: "code",
        language: "python",
        runnable: false,
        value: `
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/status')
def status():
    return jsonify({"status": "running", "message": "Flask API is active"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
        `
      },
      { type: "component", value: FlaskApiLab },
      {
        type: "text",
        value: `
💡 **Pro Tip:** Many DevOps platforms (e.g., Jenkins or Grafana extensions) use Flask APIs for integration.
        `
      }
    ]
  },

  {
    title: "Unit Testing & Best Practices",
    slug: "unit-testing-best-practices",
    content: [
      {
        type: "text",
        value: `
Testing ensures your automation scripts and backend services work as expected.  
Learn how to use Python's \`unittest\` framework and integrate testing into CI/CD pipelines.
        `
      },
      {
        type: "code",
        language: "python",
        runnable: true,
        value: `
import unittest

def add(x, y):
    return x + y

class TestMath(unittest.TestCase):
    def test_add(self):
        self.assertEqual(add(2, 3), 5)

if __name__ == '__main__':
    unittest.main()
        `
      },
      {
        type: "text",
        value: `
✅ Add testing to every automation script.  
It builds confidence before deployments and avoids production incidents.
        `
      }
    ]
  },

  {
    title: "Working with YAML, JSON & Config Files",
    slug: "working-with-yaml-json-configs",
    content: [
      {
        type: "text",
        value: `
Infrastructure-as-Code tools like Terraform, Ansible, and Jenkins use YAML or JSON extensively.  
Mastering config file manipulation is a must for DevOps and backend engineers.
        `
      },
      {
        type: "code",
        language: "python",
        runnable: true,
        value: `
import yaml, json

config_yaml = """
server:
  name: app-server
  port: 8080
"""

data = yaml.safe_load(config_yaml)
print("Server Name:", data["server"]["name"])

# Convert YAML to JSON
json_output = json.dumps(data, indent=4)
print(json_output)
        `
      },
      {
        type: "text",
        value: `
💡 **Practical Use:** Parse Kubernetes manifests or Ansible playbooks dynamically.
        `
      }
    ]
  },

  {
    title: "Packaging & Virtual Environments",
    slug: "packaging-virtual-environments",
    content: [
      {
        type: "text",
        value: `
When you deploy scripts to production, you don't ship individual files — you package them.  
Learn to structure Python projects, create virtual environments, and publish them using \`pip\`.
        `
      },
      {
        type: "code",
        language: "bash",
        runnable: false,
        value: `
# Create a new package structure
mkdir mypackage
cd mypackage
touch __init__.py
touch main.py

# Create setup.py
echo "from setuptools import setup, find_packages
setup(name='mypackage', version='1.0', packages=find_packages())" > setup.py
        `
      },
      { type: "component", value: PackageBuilderLab },
      {
        type: "text",
        value: `
🚀 **Outcome:** You’ll be able to publish internal utilities or reusable automation libraries for your organization.
        `
      },
    ]
  },
),


];

export default pythonJobFocused;
