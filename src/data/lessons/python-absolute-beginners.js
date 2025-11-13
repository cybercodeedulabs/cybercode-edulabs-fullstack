// src/data/lessons/python-absolute-beginners.js
import InputOutputSimulator from "../../components/simulations/python-absolute-beginners/InputOutputSimulator";
import DataTypesSimulator from "../../components/simulations/python-absolute-beginners/DataTypesSimulator";
import ConditionSimulator from "../../components/simulations/python-absolute-beginners/ConditionSimulator";
import LoopSimulator from "../../components/simulations/python-absolute-beginners/LoopSimulator";
import FunctionSimulator from "../../components/simulations/python-absolute-beginners/FunctionSimulator";
import MiniProjectSimulator from  "../../components/simulations/python-absolute-beginners/MiniProjectSimulator";
import GuessNumberSimulator from "../../components/simulations/python-absolute-beginners/GuessNumberSimulator";

const pythonAbsoluteBeginners = [
  {
    slug: "getting-started",
    title: "Getting Started with Python",
    content: [
      {
        type: "text",
        value: `
Welcome to **Python Programming for Absolute Beginners**!  
In this lesson, you’ll understand what Python is, why it’s popular, and how to write your first program.

Python is one of the easiest programming languages to start with.  
It’s used in **web development, automation, data science, AI, DevOps, and cloud computing**.
        `
      },
      {
        type: "text",
        value: `
✅ **Objectives**
- Learn how to run Python code.
- Understand print statements and basic syntax.
- Execute your first "Hello World" program.
        `
      },
      {
        type: "code",
        language: "python",
        runnable: true,
        value: `print("Welcome to Cybercode EduLabs!")`
      },
      {
        type: "text",
        value: `
💡 **Explanation:**
- \`print()\` is a built-in Python function used to display output.
- Text inside quotes (\`"..." or '...'\`) is called a **string**.
- Every Python statement ends automatically — no semicolons needed!
        `
      },
      { type: "component", value: InputOutputSimulator }
    ]
  },

  {
    slug: "basic-syntax",
    title: "Python Basic Syntax and Indentation",
    content: [
      {
        type: "text",
        value: `
Unlike many programming languages that use curly braces or keywords,  
Python uses **indentation** (spaces or tabs) to define code blocks.

This makes Python code clean and human-readable.
        `
      },
      {
        type: "code",
        language: "python",
        runnable: true,
        value: `def greet(name):
    print(f"Hello, {name}")

greet("Student")`
      },
      {
        type: "text",
        value: `
💡 **Explanation:**
- \`def greet(name):\` defines a function named \`greet\` that takes one parameter.
- The **indentation (4 spaces)** after the colon tells Python what belongs inside the function.
- \`f"Hello, {name}"\` is an **f-string**, used for formatted text output.
        `
      }
    ]
  },

  {
    slug: "data-types",
    title: "Understanding Python Data Types",
    content: [
      {
        type: "text",
        value: `
Python has several **data types** used to store different kinds of values.

Let's explore the most common ones:
- **int** → whole numbers
- **float** → decimal numbers
- **str** → text data
- **bool** → True/False values
        `
      },
      {
        type: "code",
        language: "python",
        runnable: true,
        value: `num = 10
price = 99.99
name = "Cybercode"
is_active = True

print(num, price, name, is_active)`
      },
      {
        type: "text",
        value: `
💡 **Explanation:**
- Variables in Python are created automatically when you assign a value.
- Python automatically detects the type (dynamic typing).
- You can check the type using the \`type()\` function.
        `
      },
      {
        type: "code",
        language: "python",
        runnable: true,
        value: `print(type(num))
print(type(price))
print(type(name))
print(type(is_active))`
      },
      { type: "component", value: DataTypesSimulator }
    ]
  },

  {
    slug: "user-input",
    title: "Getting User Input",
    content: [
      {
        type: "text",
        value: `
In Python, you can get input from users using the **input()** function.

All input is received as a string, so you may need to convert it for numeric operations.
        `
      },
      {
        type: "code",
        language: "python",
        runnable: true,
        value: `name = input("Enter your name: ")
print("Welcome,", name)

age = int(input("Enter your age: "))
print("You will be", age + 1, "next year!")`
      },
      {
        type: "text",
        value: `
💡 **Explanation:**
- \`input()\` always returns text.
- Use \`int()\` or \`float()\` to convert user input to numbers.
        `
      },
      { type: "component", value: InputOutputSimulator }
    ]
  },

  {
    slug: "conditional-statements",
    title: "Decision Making with if-else",
    content: [
      {
        type: "text",
        value: `
Programs often need to make decisions — Python uses **if, elif, and else** for this purpose.
        `
      },
      {
        type: "code",
        language: "python",
        runnable: true,
        value: `age = 18

if age >= 18:
    print("You are eligible to vote.")
else:
    print("You are not eligible yet.")`
      },
      {
        type: "text",
        value: `
💡 **Explanation:**
- \`if\` checks a condition.
- \`>=\` is a **comparison operator** meaning "greater than or equal to".
- Indentation defines what runs when the condition is true or false.
        `
      },
      { type: "component", value: ConditionSimulator }
    ]
  },

  {
    slug: "loops",
    title: "Loops and Repetition",
    content: [
      {
        type: "text",
        value: `
Loops allow you to repeat tasks efficiently.

Python has two main loop types:
- **for loop** — iterate over a sequence
- **while loop** — repeat while a condition is true
        `
      },
      {
        type: "code",
        language: "python",
        runnable: true,
        value: `for i in range(5):
    print("Iteration:", i)`

      },
      {
        type: "code",
        language: "python",
        runnable: true,
        value: `count = 0
while count < 3:
    print("Count:", count)
    count += 1`
      },
      {
        type: "text",
        value: `
💡 **Explanation:**
- \`range(5)\` generates numbers from 0 to 4.
- The \`while\` loop repeats as long as its condition is true.
- Be careful to update variables in while loops to avoid infinite loops.
        `
      },
      { type: "component", value: LoopSimulator }
    ]
  },

  {
    slug: "functions",
    title: "Functions and Reusability",
    content: [
      {
        type: "text",
        value: `
Functions make your code organized and reusable.

Define a function once, and use it multiple times across your program.
        `
      },
      {
        type: "code",
        language: "python",
        runnable: true,
        value: `def add(a, b):
    return a + b

result = add(5, 7)
print("Sum:", result)`
      },
      {
        type: "text",
        value: `
💡 **Explanation:**
- Functions are defined using the \`def\` keyword.
- The \`return\` statement sends a result back to the caller.
        `
      },
      { type: "component", value: FunctionSimulator }
    ]
  },

  {
    slug: "collections",
    title: "Working with Lists and Dictionaries",
    content: [
      {
        type: "text",
        value: `
Python’s **lists** and **dictionaries** are used everywhere.

- **Lists** store ordered items.
- **Dictionaries** store key-value pairs.
        `
      },
      {
        type: "code",
        language: "python",
        runnable: true,
        value: `# List example
fruits = ["apple", "banana", "cherry"]
print(fruits[1])  # banana

# Dictionary example
student = {"name": "Alice", "age": 22}
print(student["name"])`
      },
      {
        type: "text",
        value: `
💡 **Explanation:**
- Lists are mutable (you can modify them).
- Dictionaries are used for structured data — like database records.
        `
      }
    ]
  },

  {
    slug: "file-handling",
    title: "File Handling Basics",
    content: [
      {
        type: "text",
        value: `
Python can read and write files easily using the built-in \`open()\` function.
        `
      },
      {
        type: "code",
        language: "python",
        runnable: false,
        value: `with open("example.txt", "w") as f:
    f.write("Hello from Cybercode!")`
      },
      {
        type: "code",
        language: "python",
        runnable: false,
        value: `with open("example.txt", "r") as f:
    data = f.read()
    print(data)`
      },
      {
        type: "text",
        value: `
💡 **Explanation:**
- The \`with open(...)\` structure automatically closes files.
- Use **'w'** for write and **'r'** for read.
        `
      }
    ]
  },

  {
    slug: "final-mini-project",
    title: "Mini Project: Simple Calculator",
    content: [
      {
        type: "text",
        value: `
🎯 **Goal:** Combine everything you’ve learned to build a simple calculator.
        `
      },
      {
        type: "code",
        language: "python",
        runnable: true,
        value: `def add(a, b): return a + b
def subtract(a, b): return a - b
def multiply(a, b): return a * b
def divide(a, b): return a / b

print("Simple Calculator")
x = float(input("Enter first number: "))
y = float(input("Enter second number: "))

print("Choose operation: + - * /")
op = input("Operation: ")

if op == '+':
    print("Result:", add(x, y))
elif op == '-':
    print("Result:", subtract(x, y))
elif op == '*':
    print("Result:", multiply(x, y))
elif op == '/':
    print("Result:", divide(x, y))
else:
    print("Invalid operation!")`
      },
      {
        type: "text",
        value: `
💡 **Explanation:**
This project ties together:
- **Input/Output**
- **Functions**
- **Conditionals**
- **Data Conversion**
and demonstrates logical program design.
        `
      },
      { type: "component", value: MiniProjectSimulator },
    ]
  },
  {
  slug: "guess-the-number",
  title: "Bonus Project: Guess the Number Game",
  content: [
    {
      type: "text",
      value: `
🎯 **Goal:** Practice Python loops, conditions, and random number generation  
by building a fun "Guess the Number" game!
      `
    },
    {
      type: "text",
      value: `
In this project, the computer randomly picks a number,  
and the player has to guess it with hints.
You'll learn how to use:
- The \`random\` module
- Loops
- Conditional logic
- User input handling
      `
    },
    {
      type: "code",
      language: "python",
      runnable: false,
      value: `import random

secret_number = random.randint(1, 10)
attempts = 0

print("🎲 Guess the Number (1–10)!")

while True:
    guess = int(input("Enter your guess: "))
    attempts += 1

    if guess == secret_number:
        print(f"✅ Correct! You guessed it in {attempts} tries.")
        break
    elif guess < secret_number:
        print("⬆️ Try a higher number.")
    else:
        print("⬇️ Try a lower number.")`
    },
    {
      type: "text",
      value: `
💡 **Explanation:**
- The \`random.randint(1, 10)\` generates a random number between 1 and 10.
- The \`while True\` loop continues until the user guesses correctly.
- We keep track of guesses using the \`attempts\` variable.
- Conditional statements provide real-time feedback.
      `
    },
    { type: "component", value: GuessNumberSimulator }
  ]
}

];

export default pythonAbsoluteBeginners;
