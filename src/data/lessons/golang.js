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
      value: `File handling allows Go programs to create, modify, and retrieve data stored in files. 
In backend systems, logs, configuration files, and persistent user data all rely on efficient file management.  
Go simplifies this using the **os**, **io**, and **bufio** packages.  
Before Go 1.16, the \`ioutil\` package handled these tasks, but it’s now merged into the \`os\` and \`io\` packages.`
    },
    {
      type: 'text',
      value: `Let’s explore file creation, writing, reading, and appending step-by-step, 
and understand what happens inside the OS each time a file operation occurs.`
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
    // Step 1: Create or open a file for writing
    file, err := os.Create("example.txt")
    if err != nil {
        fmt.Println("Error creating file:", err)
        return
    }

    // Step 2: Ensure file resources are released at the end
    defer file.Close()

    // Step 3: Write text data into the file
    _, err = file.WriteString("Welcome to Cybercode EduLabs Golang lessons!")
    if err != nil {
        fmt.Println("Error writing to file:", err)
        return
    }

    fmt.Println("File created and written successfully.")
}`,
      runnable: true
    },
    {
      type: 'text',
      value: `### 🧠 Deep Explanation

- **os.Create("example.txt")**  
  Requests the OS to create or empty an existing file. If it doesn’t exist, Go creates it with default permissions (0644).  
  Under the hood, the OS allocates a *file descriptor* — a numeric handle to that open file — which Go keeps track of internally.

- **defer file.Close()**  
  The \`defer\` statement postpones execution until the surrounding function finishes, ensuring even in case of panic or early return, 
  the file handle gets closed and memory is freed.

- **file.WriteString()**  
  Converts your string into bytes (\`[]byte\`) and streams them to the file through the descriptor.

- **Error Handling**  
  Go forces explicit error checking to make the program reliable and predictable.`
    },
    {
      type: 'text',
      value: `### 📘 Reading from a File
Reading a file simply reverses the process — Go reads bytes from disk and converts them back into text.`
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
      value: `### 🔍 Internal Process:
- \`os.ReadFile()\` opens, reads, and closes the file automatically.
- It loads all bytes into memory (best for small/medium files).
- For huge files, use buffered reading:

\`\`\`go
scanner := bufio.NewScanner(file)
for scanner.Scan() {
    fmt.Println(scanner.Text())
}
\`\`\`

This reads line by line, using far less memory.`
    },
    {
      type: 'text',
      value: `### ⚙️ Appending to Files
To add new data without overwriting:

\`\`\`go
file, err := os.OpenFile("example.txt", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
\`\`\`

- **O_APPEND**: writes at the end of the file  
- **O_CREATE**: creates if it doesn’t exist  
- **O_WRONLY**: opens in write-only mode  
- **0644**: Unix permissions (rw-r--r--)`
    },
    {
      type: 'text',
      value: `✅ **Exercise:**  
Create a file named \`activity.log\` and each time the program runs, append the current timestamp using:

\`\`\`go
time.Now().Format("2006-01-02 15:04:05")
\`\`\``
    },
    {
      type: 'text',
      value: `🚀 **Mini Project Idea:**  
Develop a CLI "Note Saver" where you can:
- \`add <text>\` → saves a note
- \`list\` → lists all saved notes
- \`delete <line>\` → deletes a note  

This will solidify your understanding of reading/writing and string parsing in Go.`
    }
  ]
},
{
  slug: 'working-with-pointers',
  title: 'Working with Pointers in Go',
  content: [
    {
      type: 'text',
      value: `A **pointer** in Go is a variable that stores the *memory address* of another variable.  
Instead of working with a copy of data, pointers let you work directly with the actual memory location, 
making your programs more efficient, especially when passing large structs or arrays to functions.`
    },
    {
      type: 'code',
      language: 'go',
      value: `package main

import "fmt"

func main() {
    x := 10
    p := &x  // 'p' now stores the memory address of 'x'

    fmt.Println("Value of x:", x)
    fmt.Println("Address of x:", p)
    fmt.Println("Value pointed by p:", *p)

    *p = 20 // modifies 'x' through its pointer
    fmt.Println("Updated x:", x)
}`,
      runnable: true
    },
    {
      type: 'text',
      value: `### 🧠 Detailed Breakdown:
- \`&x\` gives the **address** of variable x.  
- \`p := &x\` means p points to x’s address.  
- \`*p\` dereferences the pointer to get or modify the original value.  

When you assign \`*p = 20\`, the value stored at x’s address changes — no copying occurs!`
    },
    {
      type: 'text',
      value: `### 🔬 Why Use Pointers?
- Functions in Go receive arguments by value (copy).  
- For large structs or arrays, copying is inefficient.  
- Pointers allow functions to modify the original data without copying it.

For example:`
    },
    {
      type: 'code',
      language: 'go',
      value: `func increment(n *int) {
    *n = *n + 1
}

func main() {
    val := 5
    increment(&val)
    fmt.Println(val) // prints 6
}`,
      runnable: true
    },
    {
      type: 'text',
      value: `✅ **Exercise:**  
Write a function \`swap(a, b *int)\` that swaps two integers using pointers.`
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
      value: `🚀 **Mini Project Idea:**  
Create a small interactive “Pointer Playground” program that lets users input numbers, 
modify them using functions, and display how pointers affect the data.`
    }
  ]
},
{
  slug: 'goroutines-and-channels',
  title: 'Channels and Synchronization in Go',
  content: [
    {
      type: 'text',
      value: `Go’s biggest strength is **concurrency** — the ability to perform multiple tasks simultaneously.  
This is achieved using **goroutines** (lightweight threads) and **channels** (communication pipelines).`
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
    go worker(ch)  // start worker in a separate goroutine

    message := <-ch  // wait for data from the channel
    fmt.Println(message)
}`,
      runnable: true
    },
    {
      type: 'text',
      value: `### 🧠 What Happens Internally:
- \`go worker(ch)\` creates a new **goroutine** — a lightweight, independent thread managed by Go’s runtime.
- The main function and goroutine run concurrently.
- \`ch <- "Task completed!"\` sends data into the channel.
- \`<-ch\` receives that data, synchronizing both routines.

Channels prevent **race conditions** by ensuring safe communication.`
    },
    {
      type: 'text',
      value: `### 🧰 Buffered Channels
Buffered channels let you send multiple messages before blocking.`
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
      value: `### ⚙️ Select Statement
Use \`select\` to handle multiple channels simultaneously, similar to \`switch\` for concurrency:

\`\`\`go
select {
case msg1 := <-ch1:
    fmt.Println("Received:", msg1)
case msg2 := <-ch2:
    fmt.Println("Received:", msg2)
default:
    fmt.Println("No messages yet")
}
\`\`\`

✅ **Exercise:**  
Write a program that starts 3 goroutines, each sending a unique message to a shared channel. 
The main goroutine should receive and print all messages.`
    },
    {
      type: 'text',
      value: `🚀 **Mini Project Idea:**  
Build a “Task Queue” system where multiple workers (goroutines) process tasks fetched from a channel.  
This simulates how background job systems (like Celery or RabbitMQ) work in real life.`
    }
  ]
},
{
  slug: 'working-with-databases',
  title: 'Working with Databases in Go',
  content: [
    {
      type: 'text',
      value: `Databases allow persistent storage for real-world applications.  
Go’s \`database/sql\` package offers a consistent interface for SQL-based systems.  
It works with drivers like \`pq\` (PostgreSQL), \`mysql\`, or \`sqlite3\`.`
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
      value: `### 🧠 Key Concepts:
- **sql.Open()** initializes a connection pool.
- The blank import \`_ "github.com/mattn/go-sqlite3"\` registers the SQLite driver.
- **db.Exec()** executes SQL commands (CREATE, INSERT, DELETE).
- Always close your database using \`defer db.Close()\`.`
    },
    {
      type: 'text',
      value: `✅ **Exercise:**  
Extend this to fetch and display all student names using \`db.Query()\` and a loop.`
    },
    {
      type: 'text',
      value: `🚀 **Mini Project Idea:**  
Build a CLI student management tool where users can:
- Add new student records
- View all students
- Delete a student by ID`
    }
  ]
},
{
  slug: 'unit-testing-in-go',
  title: 'Unit Testing in Go',
  content: [
    {
      type: 'text',
      value: `Testing is built into Go as a first-class feature.  
The \`testing\` package allows developers to write tests for every function and maintain reliable, bug-free code.`
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
      value: `### 🧠 Deep Explanation:
- Tests live in files ending with \`_test.go\`.
- Functions must start with \`Test\` and take a \`*testing.T\` argument.
- Use \`go test\` to run all tests in the package.
- Failures print with \`t.Errorf\` or stop immediately with \`t.Fatalf\`.`
    },
    {
      type: 'text',
      value: `✅ **Exercise:**  
Write a test for a \`Multiply\` function that checks multiple input combinations.`
    },
    {
      type: 'text',
      value: `🚀 **Mini Project Idea:**  
Create a calculator module with Add, Subtract, Multiply, and Divide functions — and test each thoroughly.`
    }
  ]
},
{
  slug: 'go-deployment-and-best-practices',
  title: 'Go Deployment & Best Practices',
  content: [
    {
      type: 'text',
      value: `Now that you can build functional Go programs, let’s learn how to deploy them safely and efficiently.  
Go’s single binary model means you can compile once and run anywhere — a huge advantage over languages that require runtimes.`
    },
    {
      type: 'text',
      value: `### 🏗️ Building Your Application:
\`\`\`
go build -o myapp
./myapp
\`\`\`
This generates a portable binary that runs on your OS.`
    },
    {
      type: 'text',
      value: `### 🔐 Environment Variables:
Store sensitive values (like database URLs, API keys) securely using environment variables.`
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
      value: `### 💡 Best Practices:
- Use clear, descriptive names.
- Always handle errors.
- Keep functions small and testable.
- Use Go modules for dependency management.
- Use goroutines wisely — avoid blocking main threads.
- Run \`go fmt ./...\` for code consistency.`
    },
    {
      type: 'text',
      value: `🚀 **Mini Project Idea:**  
Deploy your Go web API to Render or Railway.  
Set environment variables for DB credentials and PORT.  
Use \`go build\` to create a binary before pushing to your cloud host.`
    },
  ],
},
];
export default golangLessons;
