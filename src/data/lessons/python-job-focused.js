const pythonJobFocused = [
    {
      slug: "python-intro",
      title: "Introduction to Python",
      content: [
        {
          type: "text",
          value:
            "Python is a versatile, high-level programming language widely used for web development, automation, and data science."
        },
        {
          type: "code",
          language: "python",
          value: `print("Hello, Cybercode EduLabs!")`,
          runnable: true
        }
      ]
    },
    {
      slug: "variables-and-data-types",
      title: "Variables and Data Types",
      content: [
        {
          type: "text",
          value:
            "Python is dynamically typed. Variables can be assigned without declaring types explicitly."
        },
        {
          type: "code",
          language: "python",
          value: `name = "Cybercode EduLabs"
age = 25
print(name, age)`,
runnable: true
        }
      ]
    },
    {
      slug: "control-flow",
      title: "Control Flow",
      content: [
        {
          type: "text",
          value: "Python uses if, for, and while loops to control program flow."
        },
        {
          type: "code",
          language: "python",
          value: `for i in range(5):
    print(i)

if age > 18:
    print("Adult")
else:
    print("Minor")`,
    runnable: true
        }
      ]
    }
  ];
export default pythonJobFocused;