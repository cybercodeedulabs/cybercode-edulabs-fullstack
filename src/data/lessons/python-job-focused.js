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
Python isn't just for beginners — it’s the backbone of automation, DevOps, data pipelines, and backend services across the IT industry.
In this lesson, you'll understand why Python appears in job descriptions for backend, DevOps, SRE, and automation roles, and how to prepare a development environment that mirrors professional practice.
        `
      },
      {
        type: "text",
        value: `
Learning outcomes:
- Recognize where Python fits in modern systems (automation, backend, cloud integration).
- Prepare a reproducible development environment.
- Learn the small habits professionals use (version control, virtual environments, linting).
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
Command breakdown:
- 'sudo apt update' refreshes package index; 'sudo apt install python3 python3-pip -y' installs Python and pip.
- 'snap install --classic code' installs VS Code on systems with snap available (Ubuntu). Use appropriate installers for other OSes.
- 'git config --global' sets global Git identity used in commit metadata; in team settings, CI may override identity locally.
        `
      },
      {
        type: "text",
        value: `
Why virtual environments:
- Avoid dependency conflicts between projects.
- Make builds reproducible by pinning dependencies in requirements.txt or lock files.
- Tools: venv (built-in), virtualenv, pipenv, poetry.
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
# Verify python and pip refer to the venv path
which python
which pip
        `
      },
      {
        type: "text",
        value: `
Usage tips:
- Always check 'python --version' and 'pip freeze' when debugging environment issues.
- Commit a minimal README with local setup steps and a requirements.txt file generated via 'pip freeze > requirements.txt' (or use a lock file with poetry).
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
Overview:
Refresh of core Python language features used daily in automation and backend tasks: variables, types, formatting, loops, comprehensions. These basics are frequently probed during interviews and critical in debugging production scripts.
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
Line-by-line:
- 'name' is a string variable.
- 'version' demonstrates numeric types (float/int depending on value).
- 'is_active' is a boolean.
- f-strings are efficient and readable for variable interpolation: f"...{var}..."
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
      },
      {
        type: "text",
        value: `
Explanation & best practices:
- Use descriptive variable names.
- For production scripts, add logging instead of print statements, and use structured logging with levels (INFO, WARNING, ERROR).
- List comprehensions are concise; prefer readability over clever one-liners when collaborating in teams.
        `
      },
      {
        type: "text",
        value: `
Exercise:
- Modify the loop to skip servers whose names start with 'db' and print a warning for skipped items.
- Replace prints with 'logging' module calls and configure a basic logger.
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
Overview:
Functions decompose logic into reusable units. Modules (.py files) group related functions. Packages (folders with __init__.py) group modules and are used to distribute code. Learn how to structure code for testability and reuse.
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
Why return instead of print:
- Returning values separates concerns: function produces data; caller decides how to use it (print, log, test).
- Easier to unit-test return values.
- Add docstrings and type hints for clarity:
  def greet(user: str) -> str:
      """Return greeting for user"""
        `
      },
      {
        type: "text",
        value: `
Module & package structure:
- Put related functions in modules (e.g., utils.py).
- Group modules into packages:
  mypackage/
    __init__.py
    network.py
    aws_utils.py
- Use __all__ in __init__.py to define public API for the package.
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
      },
      {
        type: "text",
        value: `
Practical tip:
- Use relative imports within packages (from .network import ping).
- Keep modules small and focused to improve readability and test coverage.
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
Overview:
File operations and OS-level automation are central to DevOps tasks: collecting logs, rotating files, archiving artifacts, reading configs. This lesson demonstrates safe file writes and points to simulation practice.
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
      {
        type: "text",
        value: `
Code explanation:
- 'open(..., "a")' opens file in append mode; does not overwrite existing content.
- 'with' ensures file is closed when block ends—even on errors.
- 'os.path.abspath' shows exact path where file was written; helpful when scripts run under cron or containers where current working directory may differ.
        `
      },
      {
        type: "component",
        value: FileAutomationLab
      },
      {
        type: "text",
        value: `
Simulation note:
FileAutomationLab provides a sandbox to practice file creation, safe writes, cleanup, and directory handling. Use it to try creating temp directories, check file permissions, and test cleanup logic for idempotent scripts.
        `
      },
      {
        type: "text",
        value: `
Production considerations:
- Prefer Python's 'logging' module with rotating handlers (RotatingFileHandler or TimedRotatingFileHandler).
- When handling concurrent writes, use file locks or external logging services to avoid corruption.
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
Overview:
APIs are the glue between services. Learn how to call REST APIs, parse JSON responses, and handle errors robustly. This lesson demonstrates basic patterns and defensive coding practices.
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
Best practices:
- Use timeouts (requests.get(url, timeout=5)).
- Use sessions (requests.Session()) to reuse connections.
- Handle exceptions: requests.exceptions.RequestException covers common network errors.
- For retries, use urllib3 Retry or a small wrapper to implement exponential backoff.
        `
      },
      {
        type: "text",
        value: `
Exercise:
- Convert the example into a function that returns parsed data or raises a custom exception on failures. Add tests mocking network responses.
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
Overview:
Automating AWS tasks via boto3 is a common requirement. This lesson shows a minimal pattern for listing S3 buckets and discusses credential and security best practices.
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
      {
        type: "component",
        value: AwsS3Lab
      },
      {
        type: "text",
        value: `
Explain & secure:
- boto3.client('s3') creates a low-level client for S3 operations.
- list_buckets() returns a dict with 'Buckets'. Always check for the key to avoid KeyError.
- Authentication: prefer IAM roles (EC2 task roles, ECS tasks, Lambda roles) or environment variables configured in secure CI/CD rather than hard-coded keys.
        `
      },
      {
        type: "text",
        value: `
Production tips:
- Use pagination for listing large object sets (list_objects_v2 with ContinuationToken).
- Implement exponential backoff on throttling errors (HTTP 429) and use AWS SDK retry configuration.
        `
      }
    ]
  },

  {
    title: "Error Handling & Debugging",
    slug: "error-handling-debugging",
    content: [
      {
        type: "text",
        value: `
Overview:
Robust error handling and systematic debugging accelerate issue resolution and prevent production incidents. Learn to catch specific exceptions, log useful context, and use debug tools.
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
Explain the example:
- Specific exceptions allow precise handling and clearer logs.
- 'finally' is used for cleanup tasks such as closing file handles or releasing locks.
- Replace prints with logging and use logger.exception(...) inside except blocks to capture stack traces.
        `
      },
      {
        type: "text",
        value: `
Debugging tools:
- pdb: interactive debugger; use 'pdb.set_trace()' to drop into the interpreter.
- IDE breakpoints: let you step through code, inspect variables, and evaluate expressions.
- Reproduce issues with small scripts and add unit tests for the failing case.
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
Overview:
OOP organizes code into classes that encapsulate data and behavior. Use classes to model domain entities (e.g., Server, Job), encapsulate connection logic, and make code more maintainable.
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
Design notes:
- Use inheritance for clear is-a relationships; prefer composition for behavior reuse (inject a connector object rather than embedding connection code).
- Add type hints and docstrings for better IDE support and readability.
- For stateful systems, consider thread-safety, connection pooling, and resource cleanup (context managers).
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
Overview:
Relational databases are commonly used for storing logs, job metadata, and dashboards. SQLite is a great local dev DB; for production use Postgres/MySQL with proper connection pooling and migration tooling.
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
      {
        type: "component",
        value: SqliteLab
      },
      {
        type: "text",
        value: `
Explain the example:
- Use parameterized queries to avoid injection:
  cursor.execute("INSERT INTO logs (action) VALUES (?)", (action,))
- Use connection contexts (with sqlite3.connect(...) as conn:) to ensure commits and closes.
        `
      },
      {
        type: "text",
        value: `
Production suggestions:
- Use SQLAlchemy or an ORM for portability and easier migrations.
- Use Alembic for database migrations and connection pools (psycopg2 pool) for scalable web apps.
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
Overview:
Use Python for tasks that glue systems together: provisioning, backups, monitoring, and orchestrating tools. Scripts should be idempotent, safe, and easy to run in CI or cron.
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
      {
        type: "component",
        value: DevOpsAutomationLab
      },
      {
        type: "text",
        value: `
Why avoid os.system in serious scripts:
- os.system spawns a shell and returns exit code without capturing stdout/stderr. Prefer subprocess.run([...], check=True, capture_output=True, text=True) for safer command execution with proper error handling.
- Always validate inputs to shell commands and prefer passing arg lists instead of a joined string to avoid shell injection vulnerabilities.
        `
      },
      {
        type: "text",
        value: `
Idempotency:
- Ensure scripts can run multiple times without side effects (e.g., check if user exists before creating).
- Use flags or state files in /var or a DB to track completed steps.
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
Overview:
Flask is a lightweight framework ideal for building small APIs and dashboards used in automation tools and monitoring. This lesson demonstrates an endpoint pattern and notes production considerations.
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
      {
        type: "component",
        value: FlaskApiLab
      },
      {
        type: "text",
        value: `
Explain the example:
- Use 'jsonify' to ensure correct headers and JSON output.
- In development 'debug=True' helps live reload and error pages; do not enable in production.
- Use Blueprints in larger apps to segment routes by domain (auth, api, admin).
        `
      },
      {
        type: "text",
        value: `
Production deployment:
- Use Gunicorn or uWSGI behind Nginx.
- Add authentication (token-based, OAuth) and rate limiting for endpoints that make infrastructure changes.
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
Overview:
Unit tests increase confidence and catch regressions. Combine unit tests with integration tests in CI. Mock external services when unit-testing to keep tests fast and deterministic.
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
Testing guidance:
- Use pytest for cleaner syntax and fixtures.
- Use mocking (unittest.mock) to isolate external systems (network, AWS).
- Run tests in CI and fail builds when tests regress.
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
Overview:
Config files (YAML/JSON) are essential for parameterizing scripts and deployments. Validate configs and treat them as data, not code.
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
Best practices:
- Prefer 'yaml.safe_load' over 'yaml.load' for untrusted inputs.
- Validate config using jsonschema or custom checks.
- Keep secrets out of config files; use environment variables and secret managers (Vault, AWS Secrets Manager).
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
Overview:
Packaging makes your code reusable and deployable. Learn minimal packaging using setuptools and modern alternatives like pyproject.toml with build backends (poetry, flit).
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
      {
        type: "component",
        value: PackageBuilderLab
      },
      {
        type: "text",
        value: `
Packaging notes:
- 'setup.py' is legacy but still widely supported; prefer 'pyproject.toml' for new projects.
- Build wheels and publish to internal registries (Artifactory, Nexus) or TestPyPI for public projects.
- Pin dependency versions in requirements.txt or use poetry lock for reproducible installs.
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
Capstone overview:
Build a simple Flask dashboard that lists EC2 instances and interacts with S3, persists simple audit logs in SQLite, and can be packaged and containerized. This brings together Flask, boto3, SQLite, and packaging.
        `
      },
      {
        type: "code",
        language: "python",
        runnable: false,
        value: `
from flask import Flask, jsonify
import boto3
import sqlite3

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
Project checklist:
- Flask endpoint calling AWS boto3 (use simulated lab or mock in tests).
- SQLite to track actions locally; swap to Postgres in production.
- Dockerfile with a lightweight Gunicorn server for production.
- CI pipeline to run tests and build image; store artifacts in registry.
        `
      },
      {
        type: "text",
        value: `
Security reminders:
- Use IAM roles or environment variables (never checked-in keys).
- Add authentication and input validation before exposing any endpoint that triggers infrastructure changes.
        `
      }
    ]
  }
];

export default pythonJobFocused;
