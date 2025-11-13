// src/data/lessons/python-job-focused.js
// Auto-generated detailed, job-focused lessons file for Cybercode EduLabs.
// This file includes extended explanations, line-by-line commentary, practical tips,
// mini-exercises, and preserves simulation components at their original lesson spots.
//
// IMPORTANT: keep import paths consistent with your project structure.
// The file is intentionally verbose to serve as a complete lesson reference.

import FileAutomationLab from "../../components/simulations/python-job-focused/FileAutomationLab";
import FlaskApiLab from "../../components/simulations/python-job-focused/FlaskApiLab";
import AwsS3Lab from "../../components/simulations/python-job-focused/AwsS3Lab";
import DevOpsAutomationLab from "../../components/simulations/python-job-focused/DevOpsAutomationLab";
import PackageBuilderLab from "../../components/simulations/python-job-focused/PackageBuilderLab";
import SqliteLab from "../../components/simulations/python-job-focused/SqliteLab";

const pythonJobFocused = [
  /* ---------------------------------------------------------------------------
     Lesson 1 : Introduction to Python for Professionals
     - Why Python matters in industry
     - Environment setup with rationale
     - Professional habits
     --------------------------------------------------------------------------- */
  {
    title: "Introduction to Python for Professionals",
    slug: "intro-to-python-for-professionals",
    content: [
      {
        type: "text",
        value: `
Overview (extended):
Python is used across many layers of modern software stacks: as a scripting language for automation, as a backend language for services (Flask, FastAPI), in cloud automation (boto3), in data pipelines (Airflow tasks), and for test automation. What makes Python ideal is its readability, vast ecosystem, and the balance between fast development and sufficient performance for many backend tasks.

This lesson gives you context on where you'll see Python in job descriptions, what employers expect in terms of environment setup, and the day-to-day workflows you should be comfortable with.
`
      },
      {
        type: "text",
        value: `
Workplace patterns & expectations:
- Reproducible environments: Projects should declare their dependencies and pin versions so that any developer or CI system gets the same behavior.
- Version control & branching: Use Git feature branches, write good commit messages, and open PRs for code review.
- Testing & automation: Tests should run in CI on every push; avoid hosting manual-only procedures.
- Logging & observability: Scripts and services should emit structured logs so they can be aggregated and monitored.
`
      },
      {
        type: "text",
        value: `
How to think like a professional:
- Small commits with meaningful messages.
- Keep functions small and focused; one responsibility per function.
- Write tests that verify both happy paths and edge cases.
- Automate repetitive tasks: if you perform it twice manually, script it.
`
      },
      {
        type: "code",
        language: "bash",
        runnable: false,
        value: `
# system-level setup (Ubuntu example)
sudo apt update && sudo apt install python3 python3-pip -y

# optional: install VS Code for development
sudo snap install --classic code

# configure git identity locally (used for commits)
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
`
      },
      {
        type: "text",
        value: `
Commands explained with reasoning:
- \`apt update\` refreshes package metadata so you have latest packages list.
- Installing \`python3\` and \`pip\` ensures you have the interpreter and package manager.
- VS Code is optional but widely used; ensure you install recommended extensions: Python, Pylance, and GitLens.
- Git identity helps team members track authorship; CI systems usually set their own identities when performing automated commits.
`
      },
      {
        type: "code",
        language: "bash",
        runnable: false,
        value: `
# virtual environment creation
python3 -m venv .venv
# activate it (Linux/macOS)
source .venv/bin/activate
# Windows (PowerShell)
# .venv\\Scripts\\Activate.ps1
`
      },
      {
        type: "text",
        value: `
Why use \`.venv\` and not only system Python:
- Multiple projects may need different versions of a library (e.g., boto3 1.x vs 2.x). Virtual environments prevent conflicts.
- In CI, you recreate the environment from lock files to ensure consistent test runs.
- Use \`.venv\` (dot-prefixed) to indicate it's project-local and often added to .gitignore.
`
      },
      {
        type: "text",
        value: `
Practical checklist for the first day at a new job:
1. Clone the repo and checkout the project's README.
2. Create and activate virtual environment.
3. Install dependencies from requirements.txt or pyproject.toml.
4. Run the test suite to ensure environment is correct.
5. Start the dev server (or run a small smoke test).
`
      },
      {
        type: "text",
        value: `
Mini-exercise:
- Create a project folder, initialize git, create a .venv, install the 'requests' package, and write a README that explains how to reproduce your environment.
`
      }
    ]
  },

  /* ---------------------------------------------------------------------------
     Lesson 2 : Python Fundamentals Refresher
     - Variables, types, formatting, loops, comprehensions
     - Practical advice for production-ready scripts
     --------------------------------------------------------------------------- */
  {
    title: "Python Fundamentals Refresher",
    slug: "python-fundamentals-refresher",
    content: [
      {
        type: "text",
        value: `
Overview (extended):
This lesson revisits language constructs you'll use constantly. Pay attention to writing code that is readable, predictable, and easy to test. Small language features like f-strings and comprehensions improve developer productivity and reduce bugs when used appropriately.
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
Explanation:
- Variables are dynamically typed; their type is determined at runtime.
- f-strings (formatted strings) are efficient and preferred for readability.
- Avoid ambiguous variable names; prefer descriptive names in production code.
- To inspect types during development, use the 'type()' function (e.g., type(version)).
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

# List comprehension
status = [f"{s}: OK" for s in servers]
print(status)
`
      },
      {
        type: "text",
        value: `
Detailed notes:
- Use logging instead of print() for anything that might be monitored or useful for debugging in production.
- When iterating many items (e.g., thousands of servers), consider generator expressions to avoid memory spikes.
- Example: (status for s in servers) is a generator if you use parentheses; list comprehensions create lists in memory.
`
      },
      {
        type: "text",
        value: `
Performance insight:
- For CPU-bound heavy tasks, Python's single-threaded nature (GIL) matters; in such cases use multiprocessing or native extensions.
- For I/O-bound tasks (network calls, file reads), consider using async/await or concurrent.futures for higher throughput.
`
      },
      {
        type: "text",
        value: `
Mini-exercises:
1. Replace print() with logging (basicConfig level INFO) and verify messages appear.
2. Implement a function that takes server names and returns only those that are not databases (e.g., filter out names starting with "db").
3. Benchmark a list comprehension vs for-loop for a million items and observe runtime/memory.
`
      }
    ]
  },

  /* ---------------------------------------------------------------------------
     Lesson 3 : Functions, Modules & Packages
     - Why modularization matters
     - Testing and packaging tips
     --------------------------------------------------------------------------- */
  {
    title: "Functions, Modules & Packages",
    slug: "functions-modules-packages",
    content: [
      {
        type: "text",
        value: `
Overview (extended):
Functions let you encapsulate behavior. Modules organize functions and classes. Packages group modules and provide an API boundary. Good modularization makes code testable and maintainable.
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
Why returning values is better than printing:
- Separation of concerns: function computes; caller decides I/O.
- Easier to unit test returned values using assert statements.
- You can reuse the function in different contexts (CLI, web API, background job).
`
      },
      {
        type: "text",
        value: `
Docstrings and typing:
- Add docstrings to explain parameters and return values.
- Use type hints for clarity:
  def greet(user: str) -> str:
      \"\"\"Return a greeting message for the given user.\"\"\"
`
      },
      {
        type: "text",
        value: `
Module/package organization:
- Use small modules (single responsibility) to ease testing.
- Expose a clean public API from your package via __init__.py using __all__.
- Keep CLI and library code separate: if your module is both a script and a library, guard CLI code with if __name__ == "__main__": to avoid running it on import.
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
Practical: Creating a reusable utility module
1. Create files utils.py and io_helpers.py.
2. Add functions and unit tests in tests/test_utils.py.
3. Run tests locally and ensure they pass in CI.
`
      }
    ]
  },

  /* ---------------------------------------------------------------------------
     Lesson 4 : File Handling & OS Automation
     - Safe file writes, atomic operations, and the simulation component
     --------------------------------------------------------------------------- */
  {
    title: "File Handling & OS Automation",
    slug: "file-handling-os-automation",
    content: [
      {
        type: "text",
        value: `
Overview (extended):
File operations are fundamental: logs, artifacts, backup rotation. This lesson shows safe patterns for file writes, explains why atomic operations matter, and points to the FileAutomationLab for hands-on practice.
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
Detailed explanation:
- Append mode ('a') ensures old logs are preserved. For rotating logs, you would rename the existing log file and create a new file, or preferably use logging.handlers.
- The 'with' statement is a context manager that ensures files are closed on exit. This prevents file descriptor leaks, especially when scripts run in long-lived processes.
- Use os.path.join() rather than concatenating strings for cross-platform compatibility.
`
      },
      {
        type: "component",
        value: FileAutomationLab
      },
      {
        type: "text",
        value: `
FileAutomationLab notes:
- The lab simulates making directories, copying files, cleaning tmp folders, and handling permission errors.
- Practice: Write a script that rotates logs when the file exceeds a threshold (e.g., 5 MB). The rotation should be atomic: write to a temporary file then rename.
`
      },
      {
        type: "text",
        value: `
Advanced ideas:
- For concurrent writes from multiple processes, use file locking (fcntl on Unix) or external logging services.
- For high-throughput logging, send logs to syslog or a remote ingestion endpoint and avoid heavy synchronous disk writes.
`
      }
    ]
  },

  /* ---------------------------------------------------------------------------
     Lesson 5 : Working with APIs (Requests + JSON)
     - Timeouts, sessions, retries, and error handling
     --------------------------------------------------------------------------- */
  {
    title: "Working with APIs (Requests + JSON)",
    slug: "working-with-apis",
    content: [
      {
        type: "text",
        value: `
Overview (extended):
API interactions require careful handling of timeouts, retries, authentication, and parsing. This lesson demonstrates practical, production-minded patterns using requests and JSON handling.
`
      },
      {
        type: "code",
        language: "python",
        runnable: true,
        value: `
import requests

response = requests.get("https://api.github.com/users/octocat", timeout=5)
if response.status_code == 200:
    data = response.json()
    print("Username:", data.get("login"))
    print("Followers:", data.get("followers"))
else:
    print("Error fetching data:", response.status_code)
`
      },
      {
        type: "text",
        value: `
Best practices explained:
- timeout=5 prevents the request from hanging forever; tune this based on expected latency.
- Use response.raise_for_status() when you want exceptions for 4xx/5xx responses.
- Wrap network calls in try/except to catch RequestException and log failures.
- For multiple calls, use requests.Session() to reuse TCP connections and improve performance.
`
      },
      {
        type: "text",
        value: `
Retries and backoff:
- Implement exponential backoff (e.g., 1s, 2s, 4s) for transient errors.
- Use urllib3.util.retry.Retry with requests.adapters.HTTPAdapter to configure retries for requests.Session().
`
      },
      {
        type: "text",
        value: `
Mini-exercise:
- Write a wrapper function fetch_json(url) that returns parsed JSON or raises a custom error with helpful diagnostics (URL, status, body snippet).
`
      }
    ]
  },

  /* ---------------------------------------------------------------------------
     Lesson 6 : Python for Cloud & AWS SDK (boto3)
     - Listing buckets, credentials, pagination, and simulation component
     --------------------------------------------------------------------------- */
  {
    title: "Python for Cloud & AWS SDK (boto3)",
    slug: "python-aws-boto3",
    content: [
      {
        type: "text",
        value: `
Overview (extended):
Boto3 is the standard AWS SDK for Python. This lesson covers basic usage (clients vs resources), credential best practices, and using simulated labs to avoid charging real accounts during development.
`
      },
      {
        type: "code",
        language: "python",
        runnable: false,
        value: `
import boto3

s3 = boto3.client('s3')
for bucket in s3.list_buckets().get('Buckets', []):
    print(bucket.get('Name'))
`
      },
      {
        type: "text",
        value: `
Notes on clients vs resources:
- client = low-level service client which returns dictionaries and mirrors API calls.
- resource = higher-level object-oriented interface (e.g., boto3.resource('s3')) useful for intuitive object operations.
- Beware of paging: list_buckets is small, but list_objects_v2 requires handling ContinuationToken when many objects exist.
`
      },
      {
        type: "component",
        value: AwsS3Lab
      },
      {
        type: "text",
        value: `
AwsS3Lab notes:
- The lab simulates S3 operations allowing you to practice PUT/GET and listing without real AWS creds.
- Practice: write a function upload_file(local_path, bucket, key) and handle common errors like NoSuchBucket or AccessDenied gracefully.
`
      },
      {
        type: "text",
        value: `
Credentials & security:
- Prefer IAM roles for EC2/ECS/Lambda. For local development, use named profiles in ~/.aws/credentials or environment variables.
- Never commit access keys to git.
`
      },
      {
        type: "text",
        value: `
Production patterns:
- Use S3 object lifecycle policies for archival, and multipart upload for large files.
- Instrument operations with metrics (latency, error rates) and alerts for failures.
`
      }
    ]
  },

  /* ---------------------------------------------------------------------------
     Lesson 7 : Error Handling & Debugging
     - Specific exceptions, stack traces, logging, and debugging tools
     --------------------------------------------------------------------------- */
  {
    title: "Error Handling & Debugging",
    slug: "error-handling-debugging",
    content: [
      {
        type: "text",
        value: `
Overview (extended):
Handling errors properly helps you recover gracefully and provides actionable logs for incident response. Learn to capture context, avoid swallowing exceptions, and reproduce issues locally.
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
Explanation and improvements:
- Replace print statements with logging. Example:
  import logging
  logger = logging.getLogger(__name__)
  logger.exception("Failed to process number")
- Use logger.exception in except blocks to automatically include stack trace in logs.
- Avoid a bare except: except Exception as e: is better when you need to log unknown issues, but prefer to handle known exceptions specifically.
`
      },
      {
        type: "text",
        value: `
Debugging techniques:
- Reproduce a failing scenario in a minimal script.
- Use pdb (import pdb; pdb.set_trace()) or IDE breakpoints to step through.
- Use logging with different handlers (console for dev, file or remote for production).
`
      },
      {
        type: "text",
        value: `
Mini-exercise:
- Convert the example to use logging, and add a unit test that mocks input() to supply invalid data and asserts the correct log message or raised exception.
`
      }
    ]
  },

  /* ---------------------------------------------------------------------------
     Lesson 8 : Object-Oriented Python for Projects
     - Classes, inheritance, composition, and design tips
     --------------------------------------------------------------------------- */
  {
    title: "Object-Oriented Python for Projects",
    slug: "object-oriented-python",
    content: [
      {
        type: "text",
        value: `
Overview (extended):
Classes model entities and encapsulate related behavior. Use composition to assemble behaviors and inheritance for clear hierarchical relationships. Favor small classes with well-defined responsibilities.
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
- Use __repr__ and __str__ methods to aid debugging when objects are printed.
- Consider making Server a dataclass (from dataclasses import dataclass) when the class primarily holds data.
- For connection logic, move actual network code out of connect() and into a ConnectionManager to allow easier testing/mocking.
`
      },
      {
        type: "text",
        value: `
Mini-exercise:
- Refactor Server class into a dataclass and inject a connector object that performs the real connect logic; write a unit test that mocks the connector.
`
      }
    ]
  },

  /* ---------------------------------------------------------------------------
     Lesson 9 : Databases with Python
     - SQLite example, parameterized queries, simulation component, production notes
     --------------------------------------------------------------------------- */
  {
    title: "Databases with Python",
    slug: "databases-with-python",
    content: [
      {
        type: "text",
        value: `
Overview (extended):
Databases store state, logs, and metadata. SQLite is excellent for prototypes and local dev. Understand parameterized queries and why ORMs or query builders are useful in production.
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
Explained and improved:
- Use parameterized queries to avoid SQL injection:
  cursor.execute("INSERT INTO logs (action) VALUES (?)", (action,))
- Prefer using 'with sqlite3.connect(...) as conn:' so commit/rollback happens automatically.
- For production, use PostgreSQL with psycopg2 and connection pooling.
`
      },
      {
        type: "text",
        value: `
Migration & schema:
- Use Alembic for tracking schema changes.
- Keep migrations in source control and apply them in CI/CD before deploy.
`
      },
      {
        type: "text",
        value: `
Mini-exercise:
- Modify the script to accept a command-line argument for the action string and insert it safely into the DB.
`
      }
    ]
  },

  /* ---------------------------------------------------------------------------
     Lesson 10 : Scripting & Automation (DevOps Tasks)
     - Use of subprocess, idempotency, simulation component
     --------------------------------------------------------------------------- */
  {
    title: "Scripting & Automation (DevOps Tasks)",
    slug: "scripting-and-automation",
    content: [
      {
        type: "text",
        value: `
Overview (extended):
Automation scripts should be safe, idempotent, and observable. This lesson shows patterns for executing shell commands safely, validating inputs, and integrating scripts into system workflows. The DevOpsAutomationLab gives you a safe practice environment.
`
      },
      {
        type: "code",
        language: "python",
        runnable: true,
        value: `
import subprocess

def create_user(username):
    # safer than os.system: pass arguments as a list
    try:
        subprocess.run(["sudo", "useradd", username], check=True, capture_output=True, text=True)
        print(f"User {username} created.")
    except subprocess.CalledProcessError as e:
        print("Failed to create user:", e.stderr)
        # handle error or retry as required

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
Why subprocess.run is better:
- It avoids shell interpolation vulnerabilities.
- You can capture stdout/stderr and the return code.
- 'check=True' raises an exception on non-zero exit, enabling immediate error handling rather than silently continuing.
`
      },
      {
        type: "text",
        value: `
Idempotency and safety:
- Check if user exists before creating: use 'id -u username' or inspect /etc/passwd.
- When modifying system state, either run scripts as part of a configuration management tool (Ansible) or add strict validation and dry-run modes.
`
      },
      {
        type: "text",
        value: `
Mini-exercise:
- Implement a 'delete_user' function that safely removes a user only if they exist and archives their home directory to a backup location.
`
      }
    ]
  },

  /* --------------------------------------------------------------------------- truncated for brevity in this step

  /* ---------------------------------------------------------------------------
     Lesson 11 : Web Development with Flask
     - Minimal API, Blueprint, deployment hints, simulation component
     --------------------------------------------------------------------------- */
  {
    title: "Web Development with Flask",
    slug: "web-development-with-flask",
    content: [
      {
        type: "text",
        value: `
Overview (extended):
Flask is great for small APIs and dashboards. This lesson covers structuring a Flask app, creating endpoints, and deploying with a production server. FlaskApiLab provides interactive practice.
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
Detailed notes:
- Use Blueprints to split large apps: auth_bp, api_bp, admin_bp.
- For testing, use Flask's test_client to simulate requests without network calls.
- In production, run Gunicorn with multiple workers behind Nginx and configure logging to files/aggregator.
`
      },
      {
        type: "text",
        value: `
Security & performance:
- Validate inputs (use marshmallow or pydantic for request schema validation).
- Apply rate limiting and authentication (JWT, OAuth2).
- Use connection pools for DB access; avoid opening a new DB connection per request.
`
      },
      {
        type: "text",
        value: `
Mini-exercise:
- Add an endpoint /instances that reads from a simulated AWS call (or mock) and returns instance summaries with basic pagination.
`
      }
    ]
  },

  /* ---------------------------------------------------------------------------
     Lesson 12 : Unit Testing & Best Practices
     - unittest vs pytest, mocking, CI integration
     --------------------------------------------------------------------------- */
  {
    title: "Unit Testing & Best Practices",
    slug: "unit-testing-best-practices",
    content: [
      {
        type: "text",
        value: `
Overview (extended):
Tests validate behavior and prevent regressions. Use unit tests for logic, integration tests for external services, and end-to-end tests for user flows. Integrate tests into CI to enforce quality.
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
Best practices:
- Prefer pytest for brevity and powerful fixtures; but unittest is fine and portable.
- Use mocking (unittest.mock or pytest-mock) to replace network calls, AWS calls, and DB access in unit tests.
- Keep unit tests fast and deterministic; let integration tests hit real services in controlled test environments.
`
      },
      {
        type: "text",
        value: `
CI suggestions:
- Run tests on pull requests and fail builds when tests regress.
- Optionally run linters (flake8), type checks (mypy), and security scans in CI.
- Cache dependencies in CI to reduce build times.
`
      }
    ]
  },

  /* ---------------------------------------------------------------------------
     Lesson 13 : Working with YAML, JSON & Config Files
     - Parsing, validation, secrets handling
     --------------------------------------------------------------------------- */
  {
    title: "Working with YAML, JSON & Config Files",
    slug: "working-with-yaml-json-configs",
    content: [
      {
        type: "text",
        value: `
Overview (extended):
Config files are the interface between runtime behavior and the code. Keep configs declarative and avoid putting secrets in them. Validate configs against a schema before using them in automation scripts.
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
Practical tips:
- Use yaml.safe_load() to avoid executing arbitrary YAML tags.
- Use jsonschema to validate the shape of configs.
- Separate environment-specific configs and secrets; use environment variables and secret managers for sensitive values.
`
      },
      {
        type: "text",
        value: `
Mini-exercise:
- Define a schema for an 'app' config with fields: host (string), port (int), debug (bool) and validate a sample YAML.
`
      }
    ]
  },

  /* ---------------------------------------------------------------------------
     Lesson 14 : Packaging & Virtual Environments
     - setup.py, pyproject.toml, building wheels, simulation component
     --------------------------------------------------------------------------- */
  {
    title: "Packaging & Virtual Environments",
    slug: "packaging-virtual-environments",
    content: [
      {
        type: "text",
        value: `
Overview (extended):
Packaging allows reusing your tools across projects or distributing them. Use pyproject.toml for modern builds and produce wheels for reliable installs. The PackageBuilderLab helps you practice building and installing a package locally.
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

# Create setup.py (legacy) or prefer pyproject.toml for modern workflows
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
- For new projects, prefer pyproject.toml with build-backend (PEP 517/518). Tools: poetry, flit.
- Build a wheel locally: python -m build (requires 'build' package).
- Test install from the local wheel in a fresh venv before publishing.
`
      },
      {
        type: "text",
        value: `
Mini-exercise:
- Create a minimal package with a CLI entry point and install it locally. Verify you can invoke the CLI from anywhere in the venv.
`
      }
    ]
  },

  /* ---------------------------------------------------------------------------
     Lesson 15 : Final Project - Automation Dashboard
     - Capstone: Flask + boto3 + SQLite + packaging + security
     --------------------------------------------------------------------------- */
  {
    title: "Final Project: Automation Dashboard",
    slug: "automation-dashboard-project",
    content: [
      {
        type: "text",
        value: `
Capstone (extended):
The capstone ties together Flask for UI/API, boto3 for cloud actions, SQLite for local persistence (or Postgres for production), and packaging/containerization for deployment. Think about the minimal viable product: list EC2 instances, trigger a simple action (e.g., tag instance), and record actions to the DB for audit.
`
      },
      {
        type: "code",
        language: "python",
        runnable: false,
        value: `
from flask import Flask, jsonify, request
import boto3
import sqlite3

app = Flask(__name__)
ec2 = boto3.client('ec2')

@app.route('/instances')
def instances():
    # Example: list instances and return simple summary
    resp = ec2.describe_instances()
    instances = []
    for r in resp.get('Reservations', []):
        for i in r.get('Instances', []):
            instances.append({
                "id": i.get('InstanceId'),
                "type": i.get('InstanceType'),
                "state": i.get('State', {}).get('Name')
            })
    return jsonify({"instances": instances})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
`
      },
      {
        type: "text",
        value: `
Project structure suggestions:
- app/
    __init__.py
    api/
        routes.py
    services/
        aws_service.py
    db/
        models.py
- tests/
- Dockerfile
- README.md
- requirements.txt or pyproject.toml
`
      },
      {
        type: "text",
        value: `
Security & operational considerations:
- Use IAM roles for AWS calls.
- Add authentication and authorization to endpoints.
- Run periodic integration tests in a sandbox AWS account to validate permissions and behavior.
- Use Docker for consistent deployment artifacts and a simple Gunicorn-based entrypoint for production.
`
      },
      {
        type: "text",
        value: `
Deliverables Checklist:
- Running Flask app that calls AWS (or mocks/simulators for dev).
- Local DB to record actions and basic queries to show audit logs.
- Dockerfile and simple CI pipeline script (GitHub Actions, GitLab CI) to run tests and build image.
- README with local development and deployment instructions.
`
      }
    ]
  }
];

export default pythonJobFocused;
