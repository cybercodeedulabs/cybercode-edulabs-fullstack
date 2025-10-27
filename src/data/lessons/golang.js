// src/data/courses/golangLessons.js

const golangLessons = [
{
  slug: 'introduction-to-golang',
  title: 'Introduction to Golang',
  content: [
    {
      type: 'text',
      value: `Go, often referred to as Golang, is an open-source programming language created at Google in 2007 and released in 2009. It was designed by Robert Griesemer, Rob Pike, and Ken Thompson with a focus on simplicity, reliability, and efficiency—especially for building scalable and high-performance backend systems.`,
    },
    {
      type: 'text',
      value: `Go's standout features include a clean syntax, garbage collection, fast compilation, and built-in support for concurrency through goroutines and channels. It is widely used for cloud services, microservices, networking tools, and modern DevOps workflows.`,
    },
    {
      type: 'text',
      value: `Go code is compiled to native machine code, which makes it extremely fast compared to interpreted languages. Its strong typing and explicit error handling make it ideal for building robust, production-ready software.`,
    },
    {
      type: 'text',
      value: `Now, let’s write your very first Go program. This is the classic “Hello, World!” example in Go.`,
    },
    {
      type: 'code',
      language: "go",
      value: `package main

import "fmt"

func main() {
    fmt.Println("Hello, Golang!")
}`,
      runnable: true,
    },
    {
      type: 'text',
      value: `🧠 **Explanation**:
- Every Go program starts with the \`main\` package.
- \`import "fmt"\` loads the formatting library to print text.
- \`func main()\` is the entry point.
- \`fmt.Println\` prints output to the console.`,
    },
    {
      type: 'text',
      value: `✅ **Exercise 1**: Modify the above program to print your name and one technology or tool you’re excited to build using Go.`,
    },
    {
      type: 'code',
      language: "go",
      value: `// Sample Solution
package main

import "fmt"

func main() {
    fmt.Println("Hi, I’m Arjun. I want to build a cloud-native monitoring tool with Go!")
}`,
      runnable: true,
    },
    {
      type: 'text',
      value: `✅ **Exercise 2**: Add two more lines to your program to print:
1. Why you chose to learn Golang.
2. Your programming background (beginner/intermediate/advanced).`,
    },
    {
      type: 'text',
      value: `💡 **Bonus Tip**: Save your Go files with a \`.go\` extension and run them using:
\`go run filename.go\`
You can also compile with:
\`go build filename.go\``,
    },
    {
      type: 'text',
      value: `🚀 **Mini Project Idea**: Create a Go program that introduces yourself using print statements. Include your name, background, and your career goal in tech.`,
    }
  ]
},

{
  slug: "go-packages-and-modules",
  title: "Go Packages and Modules",
  content: [
    {
      type: "text",
      value: "In Go, modular programming is enabled using packages and modules. Understanding how to structure your code into packages and use Go modules is essential for building scalable applications. Let’s break this down step by step."
    },
    {
      type: "text",
      value: "### What is a Package?\nA package in Go is a way to group related Go files together. Every Go file starts with a `package` declaration, which defines the package the file belongs to."
    },
    {
      type: "code",
      language: "go",
      value: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello from main package\")\n}",
      runnable: true
    },
    {
      type: "text",
      value: "In the example above, we use the `main` package which is special: it's the entry point of a Go program. Any executable Go program must have a package named `main` with a `main()` function."
    },
    {
      type: "text",
      value: "### Creating Custom Packages\nLet’s create a custom package to organize code better. Suppose you have a folder structure like:\n```\nmyproject/\n│\n├── main.go\n└── utils/\n    └── math.go\n```"
    },
    {
      type: "code",
      language: "go",
      value: "// utils/math.go\npackage utils\n\nfunc Add(a int, b int) int {\n    return a + b\n}",
      runnable: false
    },
    {
      type: "code",
      language: "go",
      value: "// main.go\npackage main\n\nimport (\n    \"fmt\"\n    \"myproject/utils\"\n)\n\nfunc main() {\n    result := utils.Add(10, 5)\n    fmt.Println(\"Result:\", result)\n}",
      runnable: false
    },
    {
      type: "text",
      value: "This approach promotes reusability and clean code structure. Each subfolder with a Go file becomes a package."
    },
    {
      type: "text",
      value: "### What are Go Modules?\nModules are a way to manage project dependencies. A Go module is a collection of packages with a `go.mod` file at its root. To initialize a module, use the command:"
    },
    {
      type: "code",
      language: "go",
      language: "bash",
      value: "go mod init myproject",
      runnable: false
    },
    {
      type: "text",
      value: "This will create a `go.mod` file, which tracks your dependencies and the version of Go being used. It also defines the module name used in import paths."
    },
    {
      type: "text",
      value: "### Import Paths in Modules\nIf your module name is `github.com/username/myproject`, then you’ll import your packages like this:"
    },
    {
      type: "code",
      language: "go",
      value: "import \"github.com/username/myproject/utils\"",
      runnable: false
    },
    {
      type: "text",
      value: "You can use `go get` to fetch third-party libraries and they’ll be added to `go.mod` and `go.sum`."
    },
    {
      type: "text",
      value: "### Exercise: Try Creating Your Own Module\n1. Run `go mod init mymodule`\n2. Create a `tools/strings.go` file and write a function to reverse strings\n3. Import and use that function in `main.go`"
    },
    {
      type: "code",
      language: "go",
      value: "// tools/strings.go\npackage tools\n\nfunc Reverse(input string) string {\n    reversed := \"\"\n    for i := len(input) - 1; i >= 0; i-- {\n        reversed += string(input[i])\n    }\n    return reversed\n}",
      runnable: false
    },
    {
      type: "code",
      language: "go",
      value: "// main.go\npackage main\n\nimport (\n    \"fmt\"\n    \"mymodule/tools\"\n)\n\nfunc main() {\n    fmt.Println(tools.Reverse(\"Golang\"))\n}",
      runnable: true
    },
    {
      type: "text",
      value: "### Summary\n- Every Go file belongs to a package\n- Packages allow code grouping and reuse\n- Modules help in dependency management and versioning\n- Use `go mod init`, `go get`, and `go build` to manage your modules\n\nBy mastering packages and modules, you can structure larger applications with better maintainability and clarity."
    }
  ]
},
{
  slug: 'go-variables-and-data-types',
  title: 'Go Variables & Data Types',
  content: [
    {
      type: 'text',
      value: 'In Go, variables are containers for storing data values. Go is a statically typed language, which means the variable type is known at compile time. Variables can be declared explicitly using the `var` keyword or implicitly using shorthand syntax.'
    },
    {
      type: 'text',
      value: 'Let’s explore both explicit and inferred variable declarations in Go.'
    },
    {
      type: 'code',
      language: "go",
      value:
`var name string
name = "Cybercode"`,
      runnable: true,
    },
    {
      type: 'code',
      language: "go",
      value:
`var age int = 25`,
      runnable: true,
    },
    {
      type: 'code',
      language: "go",
      value:
`country := "India" // Shorthand declaration`,
      runnable: true,
    },
    {
      type: 'text',
      value: '🧠 **Explanation**:\n- `var name string` declares a variable of type string.\n- `:=` is shorthand for declaration and assignment. Go infers the type automatically.\n- Variables must match their types. You can’t assign a string to an int variable.'
    },
    {
      type: 'code',
      language: "go",
      value:
`var number int = 10
number = "hello" // ❌ Compile-time error`,
      runnable: false,
    },
    {
      type: 'text',
      value: 'Go has several built-in basic data types:'
    },
    {
      type: 'text',
      value:
`- Integer: int, int8, int16, int32, int64
- Unsigned: uint, uint8, uint16, uint32, uint64
- Floating-point: float32, float64
- Boolean: bool
- String: string
- Complex numbers: complex64, complex128`
    },
    {
      type: 'text',
      value: '✅ Let’s see an example that demonstrates variable declaration and usage.'
    },
    {
      type: 'code',
      language: "go",
      value:
`package main

import "fmt"

func main() {
    var name string = "Cybercode"
    age := 21
    const isActive = true

    fmt.Println("Name:", name)
    fmt.Println("Age:", age)
    fmt.Println("Active:", isActive)
}`,
      runnable: true,
    },
    {
      type: 'text',
      value: '💡 **Constants**:\nUse `const` to declare constant values. These values cannot be changed later.'
    },
    {
      type: 'code',
      language: "go",
      value:
`const Pi = 3.14159`,
      runnable: true,
    },
    {
      type: 'text',
      value: '✅ Let’s do a quick program to calculate the area of a circle.'
    },
    {
      type: 'code',
      language: "go",
      value:
`package main

import "fmt"

func main() {
    radius := 5.5
    const Pi = 3.14

    area := Pi * radius * radius
    fmt.Println("Area of Circle:", area)
}`,
      runnable: true,
    },
    {
      type: 'text',
      value: '🧠 **Memory View Example** (Textual Diagram):'
    },
    {
      type: 'code',
      language: "go",
      value:
`+-----------------------+
|   Variable Name       |
|-----------------------|
|   Type     |  Value   |
|-----------|----------|
|   name    | "Go"     |
|   age     |  30      |
|   pi      |  3.14    |
|   valid   |  true    |
+-----------------------+`,
      runnable: false,
    },
    {
  type: "image",
  value:'/lessonimages/golang/variable-memory-layout.png',
  alt: "Variables memory layout in Golang"
},
    {
      type: 'text',
      value: '✅ **Exercise 1**: Declare a variable for your favorite programming language, your years of experience, and whether you enjoy backend or frontend development. Then print them all.'
    },
    {
      type: 'code',
      language: "go",
      value:
// Sample Exercise 1
`package main

import "fmt"

func main() {
    language := "Go"
    years := 2
    isBackend := true

    fmt.Println("Language:", language)
    fmt.Println("Years of Experience:", years)
    fmt.Println("Backend Dev:", isBackend)
}`,
      runnable: true,
    },
    {
      type: 'text',
      value: '✅ **Exercise 2**: Create a constant for the value of gravity (9.8), and calculate the weight of an object given its mass (e.g., 60kg).'
    },
    {
      type: 'code',
      language: "go",
      value:
// Sample Exercise 2
`package main

import "fmt"

func main() {
    const gravity = 9.8
    mass := 60.0

    weight := gravity * mass
    fmt.Println("Weight:", weight)
}`,
      runnable: true,
    },
    {
      type: 'text',
      value: '💡 **Bonus Tip**: Use `fmt.Printf("%T", variable)` to print the type of any variable for debugging and learning.'
    },
    {
      type: 'text',
      value: '🚀 **Mini Project Idea**: Write a Go program that takes your name, your current city, and your goal in tech, stores them in variables, and prints them out like a short profile card.'
    }
  ]
},

  {
    slug: 'go-control-flow',
    title: 'Go Control Flow Statements',
    content: [
      {
        type: 'text',
        value: 'Control flow statements allow us to dictate the order in which instructions are executed in a Go program. The most commonly used flow control constructs include conditionals (`if`, `else`, `switch`) and loops (`for`).'
      },
      {
        type: 'text',
        value: 'Let’s start with `if` and `else` statements in Go. These are used to execute blocks of code based on conditions.'
      },
      {
        type: 'code',
        language: 'go',
        value:
`package main

import "fmt"

func main() {
    age := 20

    if age >= 18 {
        fmt.Println("You are eligible to vote.")
    } else {
        fmt.Println("You are not eligible to vote.")
    }
}`,
        runnable: true
      },
      {
        type: 'text',
        value: '🧠 **Explanation**:\n- The `if` block checks if the condition is true.\n- The `else` block runs if the condition is false.\n- No parentheses are required around conditions in Go, but braces `{}` are mandatory.'
      },
      {
        type: 'text',
        value: 'Next, let’s look at the `switch` statement, a cleaner way to compare a variable against multiple values.'
      },
      {
        type: 'code',
        language: 'go',
        value:
`package main

import "fmt"

func main() {
    day := "Tuesday"

    switch day {
    case "Monday":
        fmt.Println("Start of the work week")
    case "Friday":
        fmt.Println("End of the work week")
    case "Saturday", "Sunday":
        fmt.Println("Weekend!")
    default:
        fmt.Println("Midweek day")
    }
}`,
        runnable: true
      },
      {
        type: 'text',
        value: '✅ Go’s `switch` supports multiple matching values in a case and does not require `break` statements like some other languages.'
      },
      {
        type: 'text',
        value: 'Now let’s learn about loops. Go only has one looping keyword: `for`. It can be used like a traditional loop or as a `while` loop.'
      },
      {
        type: 'code',
        language: 'go',
        value:
`package main

import "fmt"

func main() {
    for i := 1; i <= 5; i++ {
        fmt.Println("Count:", i)
    }
}`,
        runnable: true
      },
      {
        type: 'code',
        language: 'go',
        value:
`package main

import "fmt"

func main() {
    x := 3

    for x > 0 {
        fmt.Println(x)
        x--
    }
}`,
        runnable: true
      },
      {
        type: 'text',
        value: '💡 **Infinite Loop**:\nUse `for {}` to run an infinite loop. Make sure to use `break` or `return` to exit the loop.'
      },
      {
        type: 'code',
        language: 'go',
        value:
`for {
    fmt.Println("Running...")
    break
}`,
        runnable: false
      },
      {
        type: 'image',
        value: '/lessonimages/golang/control-flow-logic-diagram.png',
        alt: 'Control flow logic in Go'
      },
      {
        type: 'text',
        value: '✅ **Exercise 1**: Write a program that checks whether a number is positive, negative, or zero using `if`, `else if`, and `else`.'
      },
      {
        type: 'code',
        language: 'go',
        value:
`package main

import "fmt"

func main() {
    number := -5

    if number > 0 {
        fmt.Println("Positive number")
    } else if number < 0 {
        fmt.Println("Negative number")
    } else {
        fmt.Println("Zero")
    }
}`,
        runnable: true
      },
      {
        type: 'text',
        value: '✅ **Exercise 2**: Create a loop that prints numbers from 10 down to 1 using a `for` loop.'
      },
      {
        type: 'code',
        language: 'go',
        value:
`package main

import "fmt"

func main() {
    for i := 10; i >= 1; i-- {
        fmt.Println(i)
    }
}`,
        runnable: true
      },
      {
        type: 'text',
        value: '💡 **Bonus Tip**: Use `continue` to skip the current iteration of a loop and `break` to exit early.'
      },
      {
        type: 'text',
        value: '🚀 **Mini Project Idea**: Build a basic number guessing game. The program should have a predefined secret number, and the user should guess it. Use loops and conditional statements to give hints and detect success.'
      }
    ]
  },
  {
    slug: 'Functions in Go',
    title: 'Functions in Go',
    content: [
      {
        type: 'text',
        value: 'Functions in Go help organize and reuse code. You define them using the `func` keyword.',
      },
      {
        type: 'code',
        language: "go",
        value: `package main

import "fmt"

func greet(name string) string {
    return "Hello, " + name
}

func main() {
    msg := greet("Alice")
    fmt.Println(msg)
}`,
runnable : true
      },
      {
        type: 'text',
        value: '✅ Exercise: Create a function that takes two numbers and returns their sum and difference.',
      },
    ],
  },
  {
    slug: 'Structs and Methods',
    title: 'Structs and Methods',
    content: [
      {
        type: 'text',
        value: 'Go does not have classes, but it has structs and methods which provide similar functionality.',
      },
      {
        type: 'code',
        language: "go",
        value: `package main

import "fmt"

type Person struct {
    name string
    age  int
}

func (p Person) greet() {
    fmt.Println("Hi, I'm", p.name, "and I'm", p.age, "years old.")
}

func main() {
    p := Person{name: "Bob", age: 25}
    p.greet()
}`,
runnable : true
      },
      {
        type: 'text',
        value: '✅ Exercise: Define a struct for a `Book` with title and author, and a method to display details.',
      },
    ],
  },
  {
    slug: 'Arrays and Slices',
    title: 'Arrays and Slices',
    content: [
      {
        type: 'text',
        value: 'Arrays are fixed-size sequences, while slices are dynamic and more common in Go.',
      },
      {
        type: 'code',
        language: "go",
        value: `package main

import "fmt"

func main() {
    primes := [5]int{2, 3, 5, 7, 11}
    fmt.Println("Array:", primes)

    nums := []int{1, 2, 3, 4, 5}
    nums = append(nums, 6)
    fmt.Println("Slice:", nums)
}`,
runnable : true
      },
      {
        type: 'text',
        value: '✅ Exercise: Create a slice of your top 3 favorite programming languages and print each.',
      },
    ],
  },
  {
    slug: 'Maps in Go',
    title: 'Maps in Go',
    content: [
      {
        type: 'text',
        value: 'Maps are Go’s built-in key-value data structures, similar to dictionaries in Python.',
      },
      {
        type: 'code',
        language: "go",
        value: `package main

import "fmt"

func main() {
    scores := map[string]int{
        "Alice": 90,
        "Bob":   85,
    }
    scores["Charlie"] = 92
    fmt.Println(scores)
}`,
runnable : true
      },
      {
        type: 'text',
        value: '✅ Exercise: Create a map of three cities and their population. Print each city and population.',
      },
    ],
  },
  {
    slug: 'Concurrency with Goroutines',
    title: 'Concurrency with Goroutines',
    content: [
      {
        type: 'text',
        value: 'Go has built-in support for concurrency using goroutines. Use the `go` keyword to run functions concurrently.',
      },
      {
        type: 'code',
        language: "go",
        value: `package main

import (
    "fmt"
    "time"
)

func say(msg string) {
    for i := 0; i < 3; i++ {
        time.Sleep(500 * time.Millisecond)
        fmt.Println(msg)
    }
}

func main() {
    go say("Hello")
    say("World")
}`,
runnable : true
      },
      {
        type: 'text',
        value: '✅ Exercise: Create two concurrent goroutines to print messages like "Learning" and "Golang".',
      },
    ],
  },
  {
    slug: 'Handling Errors in Go',
    title: 'Handling Errors in Go',
    content: [
      {
        type: 'text',
        value: 'Go uses multiple return values for error handling instead of exceptions.',
      },
      {
        type: 'code',
        language: "go",
        value: `package main

import (
    "errors"
    "fmt"
)

func divide(a, b int) (int, error) {
    if b == 0 {
        return 0, errors.New("cannot divide by zero")
    }
    return a / b, nil
}

func main() {
    result, err := divide(10, 0)
    if err != nil {
        fmt.Println("Error:", err)
    } else {
        fmt.Println("Result:", result)
    }
}`,
runnable : true
      },
      {
        type: 'text',
        value: '✅ Exercise: Modify the function to handle division by zero and print a custom message.',
      },
    ],
  },
  {
  slug: 'go-interfaces',
  title: 'Interfaces in Go',
  content: [
    {
      type: 'text',
      value: 'Interfaces define behavior through method signatures. Any type that implements all methods of an interface automatically satisfies it.'
    },
    {
      type: 'code',
      language: 'go',
      value: `package main

import "fmt"

type Speaker interface {
    Speak()
}

type Human struct{}
func (h Human) Speak() { fmt.Println("Hello, I’m a human!") }

type Robot struct{}
func (r Robot) Speak() { fmt.Println("Beep boop!") }

func main() {
    var s Speaker
    s = Human{}
    s.Speak()

    s = Robot{}
    s.Speak()
}`,
      runnable: true
    },
    {
      type: 'text',
      value: '✅ **Exercise:** Create an interface `Shape` with methods `Area()` and `Perimeter()`, and implement it for `Circle` and `Rectangle`.'
    },
  ],
},
{
  slug: 'json-handling-in-go',
  title: 'Working with JSON in Go',
  content: [
    {
      type: 'code',
      language: 'go',
      value: `package main

import (
    "encoding/json"
    "fmt"
)

type Student struct {
    Name string \`json:"name"\`
    Age  int    \`json:"age"\`
}

func main() {
    s := Student{Name: "Asha", Age: 21}
    jsonData, _ := json.Marshal(s)
    fmt.Println(string(jsonData))

    var decoded Student
    json.Unmarshal(jsonData, &decoded)
    fmt.Println(decoded.Name, decoded.Age)
}`,
      runnable: true
    },
  ],
},
{
  slug: 'go-web-server',
  title: 'Building a Simple Web Server',
  content: [
    {
      type: 'code',
      language: 'go',
      value: `package main

import (
    "fmt"
    "net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Welcome to Cybercode EduLabs Golang Server!")
}

func main() {
    http.HandleFunc("/", handler)
    http.ListenAndServe(":8080", nil)
}`,
      runnable: true
    },
  ],
},
{
  slug: 'file-handling-in-go',
  title: 'File Handling in Go',
  content: [
    {
      type: 'text',
      value: 'Go provides the `os` and `io/ioutil` (deprecated in Go 1.16, replaced by `os` and `io`) packages to read, write, and manipulate files easily. Let’s learn how to handle files safely and efficiently.'
    },
    {
      type: 'code',
      language: 'go',
      value: `package main

import (
    "fmt"
    "os"
)

func main() {
    // Create a new file
    file, err := os.Create("example.txt")
    if err != nil {
        fmt.Println("Error creating file:", err)
        return
    }
    defer file.Close()

    // Write content to file
    file.WriteString("Welcome to Cybercode EduLabs Golang lessons!")

    fmt.Println("File created and written successfully.")
}`,
      runnable: true
    },
    {
      type: 'text',
      value: '✅ **Reading from a File** — Let’s read the same file we just created.'
    },
    {
      type: 'code',
      language: 'go',
      value: `package main

import (
    "fmt"
    "os"
)

func main() {
    data, err := os.ReadFile("example.txt")
    if err != nil {
        fmt.Println("Error reading file:", err)
        return
    }

    fmt.Println("File contents:")
    fmt.Println(string(data))
}`,
      runnable: true
    },
    {
      type: 'text',
      value: '🧠 **Explanation**:\n- `os.Create` creates or truncates a file.\n- Always `defer file.Close()` to free system resources.\n- `os.ReadFile` reads the entire file into memory as bytes.\n- Convert bytes to a string for printing.'
    },
    {
      type: 'text',
      value: '✅ **Exercise:** Write a program that creates a log file named `activity.log` and appends a timestamped message each time it runs.'
    },
    {
      type: 'text',
      value: '🚀 **Mini Project Idea:** Build a small "Note Saver" CLI app that allows the user to save, read, and delete text notes using file operations.'
    }
  ]
},
{
  slug: 'working-with-pointers',
  title: 'Working with Pointers in Go',
  content: [
    {
      type: 'text',
      value: 'Pointers in Go store memory addresses of variables. They allow you to modify values at a specific memory location and are a crucial concept for memory efficiency.'
    },
    {
      type: 'code',
      language: 'go',
      value: `package main

import "fmt"

func main() {
    x := 10
    p := &x

    fmt.Println("Value of x:", x)
    fmt.Println("Address of x:", p)
    fmt.Println("Value at pointer:", *p)

    *p = 20
    fmt.Println("Updated x:", x)
}`,
      runnable: true
    },
    {
      type: 'text',
      value: '🧠 **Explanation:**\n- `&x` gets the memory address of `x`.\n- `*p` dereferences the pointer to access the value.\n- Changes to `*p` reflect in the original variable.'
    },
    {
      type: 'text',
      value: '✅ **Exercise:** Write a function `swap(a, b *int)` that swaps the values of two integers using pointers.'
    },
    {
      type: 'code',
      language: 'go',
      value: `func swap(a, b *int) {
    temp := *a
    *a = *b
    *b = temp
}`,
      runnable: false
    },
    {
      type: 'text',
      value: '🚀 **Mini Project Idea:** Implement a small “Pointer Playground” where you modify values and observe how pointers affect data in functions.'
    }
  ]
},
{
  slug: 'goroutines-and-channels',
  title: 'Channels and Synchronization in Go',
  content: [
    {
      type: 'text',
      value: 'Channels in Go are used to safely communicate between goroutines. They help avoid data races by providing synchronized message passing.'
    },
    {
      type: 'code',
      language: 'go',
      value: `package main

import "fmt"

func worker(ch chan string) {
    ch <- "Task completed!"
}

func main() {
    ch := make(chan string)
    go worker(ch)

    message := <-ch
    fmt.Println(message)
}`,
      runnable: true
    },
    {
      type: 'text',
      value: '🧠 **Explanation:**\n- `make(chan string)` creates a new channel.\n- `ch <- value` sends data into the channel.\n- `<-ch` receives data from the channel.'
    },
    {
      type: 'text',
      value: '✅ **Buffered Channels:** Channels can also have buffers allowing multiple messages before blocking.'
    },
    {
      type: 'code',
      language: 'go',
      value: `ch := make(chan int, 3)
ch <- 10
ch <- 20
ch <- 30
fmt.Println(<-ch)
fmt.Println(<-ch)
fmt.Println(<-ch)`,
      runnable: false
    },
    {
      type: 'text',
      value: '✅ **Exercise:** Create a program that launches 3 goroutines, each sending a message to a shared channel, then receives and prints them all.'
    },
    {
      type: 'text',
      value: '🚀 **Mini Project Idea:** Build a small “Task Queue” system where multiple goroutines send tasks to a central channel for processing.'
    }
  ]
},
{
  slug: 'working-with-databases',
  title: 'Working with Databases in Go',
  content: [
    {
      type: 'text',
      value: 'Go supports connecting to SQL databases using the `database/sql` package and drivers like `pq` (PostgreSQL), `mysql`, or `sqlite3`.'
    },
    {
      type: 'code',
      language: 'go',
      value: `package main

import (
    "database/sql"
    "fmt"
    _ "github.com/mattn/go-sqlite3"
)

func main() {
    db, err := sql.Open("sqlite3", "./students.db")
    if err != nil {
        fmt.Println("Error:", err)
        return
    }
    defer db.Close()

    _, err = db.Exec("CREATE TABLE IF NOT EXISTS students (id INTEGER PRIMARY KEY, name TEXT)")
    if err != nil {
        fmt.Println("Table creation failed:", err)
        return
    }

    _, err = db.Exec("INSERT INTO students (name) VALUES (?)", "Asha")
    if err != nil {
        fmt.Println("Insert failed:", err)
        return
    }

    fmt.Println("Database operation successful!")
}`,
      runnable: false
    },
    {
      type: 'text',
      value: '🧠 **Explanation:**\n- The `_` before import means we’re importing for side effects (driver registration).\n- Always close the DB connection with `defer db.Close()`.\n- Use parameterized queries to avoid SQL injection.'
    },
    {
      type: 'text',
      value: '✅ **Exercise:** Extend this code to fetch and print all student names from the table.'
    },
    {
      type: 'text',
      value: '🚀 **Mini Project Idea:** Build a CLI student management tool that lets you add, list, and delete records using SQLite.'
    }
  ]
},
{
  slug: 'unit-testing-in-go',
  title: 'Unit Testing in Go',
  content: [
    {
      type: 'text',
      value: 'Testing is a first-class feature in Go. The `testing` package allows you to write and run unit tests easily using the `go test` command.'
    },
    {
      type: 'code',
      language: 'go',
      value: `package main

func Add(a, b int) int {
    return a + b
}`,
      runnable: false
    },
    {
      type: 'code',
      language: 'go',
      value: `package main

import "testing"

func TestAdd(t *testing.T) {
    got := Add(2, 3)
    want := 5

    if got != want {
        t.Errorf("got %d, want %d", got, want)
    }
}`,
      runnable: false
    },
    {
      type: 'text',
      value: '🧠 **Explanation:**\n- Test files must end with `_test.go`.\n- Use `t.Errorf` or `t.Fatalf` for assertions.\n- Run tests using `go test` in the terminal.'
    },
    {
      type: 'text',
      value: '✅ **Exercise:** Write a test for a `Multiply` function that verifies the correct output for multiple inputs.'
    },
    {
      type: 'text',
      value: '🚀 **Mini Project Idea:** Create a mini calculator package with `Add`, `Subtract`, `Multiply`, and `Divide` functions — and write unit tests for each.'
    }
  ]
},
{
  slug: 'go-deployment-and-best-practices',
  title: 'Go Deployment & Best Practices',
  content: [
    {
      type: 'text',
      value: 'Now that you’ve built Go applications, let’s talk about deploying and maintaining them efficiently. Go compiles into a single binary, making deployment extremely simple.'
    },
    {
      type: 'text',
      value: '### Building and Running a Go Binary:\nRun the following command to compile your app into an executable:\n```\ngo build -o appname\n./appname\n```'
    },
    {
      type: 'text',
      value: '### Environment Variables:\nStore secrets like database URLs or API keys in environment variables and access them using `os.Getenv()`.'
    },
    {
      type: 'code',
      language: 'go',
      value: `package main

import (
    "fmt"
    "os"
)

func main() {
    dbURL := os.Getenv("DB_URL")
    fmt.Println("Database URL:", dbURL)
}`,
      runnable: false
    },
    {
      type: 'text',
      value: '### Best Practices:\n- Use meaningful variable names.\n- Always handle errors.\n- Write unit tests.\n- Use Go modules for dependency tracking.\n- Keep functions small and focused.\n- Leverage goroutines responsibly for concurrency.'
    },
    {
      type: 'text',
      value: '🚀 **Mini Project Idea:** Deploy your Go web server to Render or Railway using `go build` and an environment variable for the port.'
    },
  ],
},


];
export default golangLessons;
