const pythonAbsoluteBeginners = [
    {
      slug: "getting-started",
      title: "Getting Started with Python",
      content: [
        {
          type: "text",
          value:
            "Welcome! This lesson covers how to write your first Python program."
        },
        {
          type: "code",
          language: "python",
          value: `print("Welcome to Cybercode EduLabs!")`,
          runnable: true
        }
      ]
    },
    {
      slug: "basic-syntax",
      title: "Python Basic Syntax",
      content: [
        {
          type: "text",
          value:
            "Python uses indentation to define code blocks, making code readable and clean."
        },
        {
          type: "code",
          language: "python",
          value: `def greet(name):
    print(f"Hello, {name}")

greet("Student")`,
runnable: true
        }
      ]
    },
    {
      slug: "data-types",
      title: "Basic Data Types",
      content: [
        {
          type: "text",
          value:
            "Learn about Python's basic data types: int, float, string, and boolean."
        },
        {
          type: "code",
          language: "python",
          value: `num = 10
price = 99.99
name = "Cybercode"
is_active = True

print(num, price, name, is_active)`,
runnable: true
        }
      ]
    }
  ];

  export default pythonAbsoluteBeginners;