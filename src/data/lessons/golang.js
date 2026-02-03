// src/data/courses/golangLessons.js
import React from "react";

const golangLessons = [
  {
    slug: "introduction-to-golang",
    title: "Introduction to Go: A Systems Language for the Real World",
    content: [
      {
        type: "text",
        value: `### Why This Lesson Exists

Modern software systems fail not because of lack of features, but because of **unpredictability at scale**:
- Hidden memory behavior
- Uncontrolled concurrency
- Slow startup times
- Fragile deployments

Go (Golang) was created to solve these **systems-level problems**, not to be a convenience language.
This lesson establishes the **mental model** you must carry throughout the entire course.`
      },

      {
        type: "text",
        value: `### Historical Context: Why Go Was Created

Before Go:
- **C/C++** offered speed but caused memory corruption, undefined behavior, and unsafe concurrency.
- **Java** and **C#** improved safety but introduced heavy runtimes, slow startup, and unpredictable GC pauses.
- **Scripting languages** improved developer speed but failed at high-performance backend systems.

Google needed a language that:
- Compiles fast
- Runs fast
- Is safe by default
- Scales across thousands of cores

Go was born in 2007 by **Robert Griesemer, Rob Pike, and Ken Thompson** to meet these exact needs.`
      },

      {
        type: "text",
        value: `### Core Design Philosophy of Go

Go makes **deliberate tradeoffs**:

- ❌ No implicit casting
- ❌ No inheritance
- ❌ No exceptions
- ❌ No hidden control flow

Instead, Go enforces:
- Explicit behavior
- Predictable memory
- Simple concurrency
- Clear failure handling

These choices are intentional — they make Go ideal for **cloud platforms, distributed systems, and security-critical software**.`
      },

      {
        type: "text",
        value: `### Mental Model: How Go Programs Execute

When you run a Go program:
1. Source code is compiled into a **single native binary**
2. No external runtime is required
3. The OS executes the binary directly
4. Go runtime manages:
   - Goroutines
   - Garbage collection
   - Scheduling

This model makes Go binaries:
- Easy to deploy
- Easy to containerize
- Easy to reason about in production`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

func main() {
    fmt.Println("Hello, Cybercode")
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### What This Code Actually Means (Not Just Syntax)

- \`package main\`  
  Declares this as an **executable program**, not a library.

- \`import "fmt"\`  
  Imports a **standard library package** — Go favors a rich standard library over heavy frameworks.

- \`func main()\`  
  Entry point. No magic, no annotations.

- \`fmt.Println\`  
  A safe, formatted output function that works consistently across platforms.`
      },

      {
        type: "text",
        value: `### Deep Dive: Why Go Compiles to a Single Binary

Unlike Java or Python:
- No VM startup delay
- No dependency hell
- No runtime mismatch

This is why Go is used in:
- Docker
- Kubernetes
- Terraform
- Cloud-native infrastructure

Single binaries mean **predictable behavior across environments**.`
      },

      {
        type: "text",
        value: `### Failure Scenarios & Anti-Patterns

❌ Writing Go like Java:
- Overusing structs as classes
- Trying to simulate inheritance
- Hiding errors

❌ Ignoring Go’s philosophy:
- Writing overly clever code
- Fighting compiler warnings

Go rewards **clarity over cleverness**.`
      },

      {
        type: "text",
        value: `### Real-World Mapping (Cybercode Context)

- **C3 Cloud**: Go powers control planes and distributed services
- **DigitalFort**: Go is ideal for security agents, scanners, and telemetry pipelines
- **EduLabs**: Go teaches how real infrastructure software is written`
      },

      {
        type: "text",
        value: `### Applied Lab (Non-Toy)

1. Compile the program using:
\`\`\`
go build
\`\`\`

2. Observe:
- Binary size
- Execution speed
- No runtime dependency

3. Delete source code and re-run the binary.
Explain why it still works.`
      },

      {
        type: "text",
        value: `### Reflection Questions (Answer in Your Own Words)

1. Why does Go avoid exceptions?
2. Why is a single binary important for cloud systems?
3. What problems does Go intentionally *not* try to solve?`
      },

      {
        type: "text",
        value: `### Advancement Hook

The next lesson dives into **variables and types**, where we explore how Go enforces safety at compile time and how this affects memory, performance, and concurrency.`
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
    slug: "go-variables-and-data-types",
    title: "Variables & Types in Go: Memory, Safety, and Compiler Guarantees",
    content: [
      {
        type: "text",
        value: `### Why This Lesson Exists

In real systems, failures often originate from:
- Type confusion
- Implicit conversions
- Unexpected data mutation

Go’s variable and type system is designed to **eliminate entire classes of bugs at compile time**.
This lesson builds the mental model required for systems and backend engineering.`
      },

      {
        type: "text",
        value: `### Historical Context: Why Strong Typing Matters

Language tradeoffs:
- **C** → power, but unsafe memory
- **Dynamic languages** → flexibility, but runtime failures
- **Java** → safety, but heavy runtime

Go enforces **explicit typing** to ensure predictability, performance, and safety at scale.`
      },

      {
        type: "text",
        value: `### Mental Model: Variables as Memory Contracts

A Go variable is a contract that defines:
- Size in memory
- Allowed operations
- Lifetime expectations

The compiler enforces this contract strictly.`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

func main() {
    var service string = "cybercode"
    var port int = 8080
    var secure bool = true

    fmt.Println(service, port, secure)
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### Type Safety at Compile Time

Go rejects invalid assignments **before execution**.
This prevents silent failures in production systems.`
      },

      {
        type: "code",
        language: "go",
        value: `package main

func main() {
    var port int = 8080
    // port = "http" // ❌ compile-time error
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### Short Declaration (:=)

The \`:=\` operator:
- Infers type once
- Locks it permanently
- Prevents type mutation`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

func main() {
    region := "us-east-1"
    replicas := 3

    fmt.Println(region, replicas)
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### Constants vs Variables

Constants:
- Do not occupy runtime memory
- Are evaluated at compile time
- Improve correctness and optimization`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

const MaxRetries = 5
const TimeoutSeconds = 30

func main() {
    fmt.Println(MaxRetries, TimeoutSeconds)
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### Preview: Stack vs Heap

Not all variables are equal.
Some stay on the stack, others escape to the heap.

This impacts:
- Garbage collection
- Latency
- Throughput

We will analyze this formally in the pointers lesson.`
      },

      {
        type: "text",
        value: `### Failure Scenarios & Anti-Patterns

❌ Overusing global variables  
❌ Treating \`:=\` as dynamic typing  
❌ Ignoring compiler warnings  

These lead to fragile systems.`
      },

      {
        type: "text",
        value: `### Applied Lab

1. Declare variables for:
   - service name
   - port
   - environment
2. Attempt invalid assignments.
3. Observe compiler feedback and explain it.`
      },

      {
        type: "text",
        value: `### Reflection Questions

1. Why does Go forbid implicit casting?
2. Why do constants not consume memory?
3. How does compile-time failure improve reliability?`
      },

      {
        type: "text",
        value: `### Advancement Hook

Next, we study **pointers**, where variables map directly to memory addresses and Go exposes controlled low-level power.`
      }
    ]
  },
  {
    slug: "working-with-pointers",
    title: "Pointers in Go: Memory, Escape Analysis, and Controlled Power",
    content: [
      {
        type: "text",
        value: `### Why This Lesson Exists

In systems programming, performance problems are rarely caused by algorithms alone.
They are caused by:
- Excessive copying
- Poor memory locality
- Uncontrolled heap growth

Pointers are Go’s controlled mechanism to **interact with memory efficiently** without sacrificing safety.`
      },

      {
        type: "text",
        value: `### Mental Model: Values vs Addresses

A normal variable holds a **value**.
A pointer holds the **address where the value lives**.

Understanding this distinction is mandatory for:
- Backend APIs
- Concurrent systems
- Large data structures`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

func main() {
    x := 10
    p := &x

    fmt.Println("Value:", x)
    fmt.Println("Address:", p)
    fmt.Println("Dereferenced:", *p)

    *p = 20
    fmt.Println("Updated value:", x)
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### What Changed in Memory?

- \`x\` is stored in memory
- \`p\` stores the address of \`x\`
- \`*p\` accesses the value at that address

No copying occurs. All operations act on the **same memory location**.`
      },
      {
        type: "image",
        value: "/lessonimages/golang/pointer-stack-memory.png",
        alt: "Golang pointer pointing to a stack variable and dereferencing memory"
      },


      {
        type: "code",
        language: "go",
        value: `// Memory view (conceptual)
//
// Stack:
// +---------+
// | x = 10  | <---- p points here
// +---------+
//
// p = &x`,
        runnable: false
      },

      {
        type: "text",
        value: `### Passing Values vs Passing Pointers

Go passes function arguments **by value**.
Pointers allow functions to modify original data safely.`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

func increment(n *int) {
    *n = *n + 1
}

func main() {
    value := 5
    increment(&value)
    fmt.Println(value)
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### Deep Dive: Escape Analysis (Critical Concept)

Go decides **where variables live**:
- Stack (fast, no GC)
- Heap (flexible, garbage collected)

If a variable’s address escapes its scope, Go moves it to the heap.
You cannot force this — only influence it.`
      },
      {
        type: "image",
        value: "/lessonimages/golang/escape-analysis-heap.png",
        alt: "Golang escape analysis showing variable moving from stack to heap"
      },

      {
        type: "code",
        language: "go",
        value: `// Example that may cause heap allocation
//
// func create() *int {
//     x := 10
//     return &x // x escapes to heap
// }`,
        runnable: false
      },

      {
        type: "text",
        value: `### Why Escape Analysis Matters

Heap allocations cause:
- Garbage collection overhead
- Latency spikes
- Reduced cache locality

Excessive pointer usage can **hurt performance** if not understood properly.`
      },

      {
        type: "text",
        value: `### Pointers in Real Systems

Pointers are essential in:
- API request/response structs
- Shared configuration
- Concurrent workloads

But misuse leads to:
- Hard-to-debug state
- Race conditions
- Memory pressure`
      },

      {
        type: "text",
        value: `### Failure Scenarios & Anti-Patterns

❌ Returning pointers to short-lived local data  
❌ Pointer chains that reduce readability  
❌ Using pointers everywhere “for performance”  

Correct usage requires **measurement and reasoning**, not assumptions.`
      },

      {
        type: "text",
        value: `### Applied Lab (Systems-Level)

1. Write a function \`swap(a, b *int)\`
2. Swap values without returning anything
3. Draw the memory diagram before and after the swap`
      },

      {
        type: "text",
        value: `### Reflection Questions

1. Why does Go restrict pointer arithmetic?
2. When does a variable escape to the heap?
3. Why can excessive pointers reduce performance?`
      },

      {
        type: "text",
        value: `### Advancement Hook

Next lesson explores **functions**, where pointers interact with:
- Call stacks
- Parameter passing
- Inlining and performance costs`
      }
    ]
  },
  {
    slug: "functions-in-go",
    title: "Functions in Go: Call Stack, Parameter Passing, and Performance",
    content: [
      {
        type: "text",
        value: `### Why This Lesson Exists

Functions are not just reusable code blocks.
In real systems, functions define:
- Stack frame creation
- Memory copying vs sharing
- Performance boundaries
- Abstraction costs

Misunderstanding functions leads to:
- Hidden performance issues
- Excessive allocations
- Poor API design`
      },

      {
        type: "text",
        value: `### Mental Model: What Happens When a Function Is Called

When a function is invoked:
1. A **stack frame** is created
2. Parameters are copied into that frame
3. Local variables live inside the frame
4. Control returns and the frame is destroyed

This model is fundamental to understanding performance and memory behavior.`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

func greet(name string) string {
    message := "Hello " + name
    return message
}

func main() {
    result := greet("Cybercode")
    fmt.Println(result)
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### Stack Frame Visualization (Conceptual)

Each function call creates its own frame:

main()
└── greet()
    ├── name (string)
    └── message (string)

When \`greet\` returns, its frame is destroyed.
No garbage collection is involved here.`
      },
      {
        type: "image",
        value: "/lessonimages/golang/function-call-stack.png",
        alt: "Golang function call stack showing nested stack frames and execution order"
      },

      {
        type: "code",
        language: "go",
        value: `// Stack view (simplified)
//
// |------------------|
// | greet frame      |
// | name = "Cybercode"|
// | message = "...   |
// |------------------|
// | main frame       |
// | result           |
// |------------------|`,
        runnable: false
      },

      {
        type: "text",
        value: `### Parameter Passing: Values vs Pointers

Go always passes parameters **by value**.
Passing a pointer still copies — but copies the **address**, not the data.`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

func updateValue(x int) {
    x = 20
}

func updatePointer(x *int) {
    *x = 20
}

func main() {
    a := 10
    updateValue(a)
    fmt.Println("After value call:", a)

    updatePointer(&a)
    fmt.Println("After pointer call:", a)
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### Why This Matters in Systems

- Passing large structs by value → expensive copying
- Passing pointers → shared access, lower cost
- Incorrect choice → performance degradation or unsafe APIs

Professional Go APIs are designed around this decision.`
      },

      {
        type: "text",
        value: `### Multiple Return Values (Error-Aware Design)

Go functions can return multiple values.
This enables explicit error handling without exceptions.`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import (
    "errors"
    "fmt"
)

func divide(a, b int) (int, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

func main() {
    result, err := divide(10, 2)
    if err != nil {
        fmt.Println("Error:", err)
        return
    }
    fmt.Println("Result:", result)
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### Deep Dive: Function Inlining (Compiler Optimization)

The Go compiler may **inline** small functions:
- Removes call overhead
- Improves performance
- Reduces stack usage

Inlining depends on:
- Function size
- Complexity
- Compiler heuristics`
      },

      {
        type: "code",
        language: "go",
        value: `// Likely inlineable
//
// func add(a, b int) int {
//     return a + b
// }
//
// Inlining removes the function call entirely`,
        runnable: false
      },

      {
        type: "text",
        value: `### Failure Scenarios & Anti-Patterns

❌ Very large functions (hard to inline, hard to test)  
❌ Passing huge structs by value unintentionally  
❌ Hiding errors instead of returning them  

Good Go functions are:
- Small
- Explicit
- Predictable`
      },

      {
        type: "text",
        value: `### Real-World Mapping (Cybercode Context)

- **C3 Cloud**: API handlers rely on clean function boundaries
- **DigitalFort**: Security pipelines require explicit error returns
- **Microservices**: Function design defines service reliability`
      },

      {
        type: "text",
        value: `### Applied Lab (Systems-Level)

1. Write a function that accepts a large struct by value.
2. Rewrite it to accept a pointer.
3. Reason which version is safer and which is faster.
(No guessing — explain based on memory behavior.)`
      },

      {
        type: "text",
        value: `### Reflection Questions

1. Why does Go avoid exceptions in functions?
2. When should you return a pointer vs a value?
3. Why is function inlining important for performance?`
      },

      {
        type: "text",
        value: `### Advancement Hook

Next lesson introduces **structs and methods**, where functions bind to data and form the foundation of Go’s object model.`
      }
    ]
  },
  {
    slug: "structs-and-methods",
    title: "Structs & Methods in Go: Data Modeling Without Classes",
    content: [
      {
        type: "text",
        value: `### Why This Lesson Exists

Most developers coming from Java, Python, or C++ try to **force Go into an object-oriented shape**.
This leads to:
- Over-engineered structs
- Confusing pointer usage
- Poor performance and readability

Go deliberately avoids classes.
Instead, it provides **structs + methods** — a simpler and more predictable model for real systems.`
      },

      {
        type: "text",
        value: `### Mental Model: Structs Are Data, Not Objects

A struct is:
- A **composite data type**
- A fixed memory layout
- A grouping of related fields

A struct does **not**:
- Encapsulate behavior automatically
- Enforce inheritance
- Hide memory costs

This explicitness is intentional.`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

type Service struct {
    Name string
    Port int
    Secure bool
}

func main() {
    svc := Service{
        Name: "auth-service",
        Port: 443,
        Secure: true,
    }

    fmt.Println(svc)
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### Memory Layout of a Struct (Conceptual)

Struct fields are laid out **sequentially in memory**.
Field order affects:
- Memory alignment
- Cache efficiency
- Binary size`
      },
      {
        type: "image",
        value: "/lessonimages/golang/struct-memory-layout.png",
        alt: "Golang struct memory layout showing sequential fields and alignment padding"
      },


      {
        type: "code",
        language: "go",
        value: `// Conceptual memory layout
//
// Service struct
// +------------------+
// | Name   (string)  |
// | Port   (int)     |
// | Secure (bool)    |
// +------------------+
//
// Actual layout may include padding for alignment`,
        runnable: false
      },

      {
        type: "text",
        value: `### Methods: Binding Behavior to Data

Methods are functions with a **receiver**.
The receiver defines *which type the method belongs to*.`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

type User struct {
    Username string
    Active   bool
}

func (u User) Status() string {
    if u.Active {
        return "active"
    }
    return "inactive"
}

func main() {
    user := User{Username: "cybercode", Active: true}
    fmt.Println(user.Status())
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### Value Receivers vs Pointer Receivers

This is a **systems decision**, not style preference.

- **Value receiver** → copies the struct
- **Pointer receiver** → shares the same memory`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

type Counter struct {
    Count int
}

func (c Counter) IncrementValue() {
    c.Count++
}

func (c *Counter) IncrementPointer() {
    c.Count++
}

func main() {
    c := Counter{Count: 0}

    c.IncrementValue()
    fmt.Println("After value method:", c.Count)

    c.IncrementPointer()
    fmt.Println("After pointer method:", c.Count)
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### Choosing the Correct Receiver (Rules You Must Follow)

Use **value receivers** when:
- Struct is small
- Method does not modify state
- Immutability is desired

Use **pointer receivers** when:
- Method modifies state
- Struct is large
- You want to avoid copying

Professional Go APIs follow this strictly.`
      },

      {
        type: "text",
        value: `### Methods and Escape Analysis

Using pointer receivers can cause structs to:
- Escape to the heap
- Increase GC pressure

This tradeoff must be **understood**, not guessed.`
      },

      {
        type: "code",
        language: "go",
        value: `// Pointer receivers may cause heap allocation
//
// func NewService() *Service {
//     svc := Service{Name: "api"}
//     return &svc
// }`,
        runnable: false
      },

      {
        type: "text",
        value: `### Failure Scenarios & Anti-Patterns

❌ Treating structs like classes  
❌ Mixing value and pointer receivers inconsistently  
❌ Huge structs passed by value  
❌ Methods that hide side effects  

These lead to fragile APIs and hard-to-debug systems.`
      },

      {
        type: "text",
        value: `### Real-World Mapping (Cybercode Context)

- **C3 Cloud**: Service and resource models are structs
- **DigitalFort**: Event payloads and alerts use struct schemas
- **Microservices**: Clean struct design defines API clarity`
      },

      {
        type: "text",
        value: `### Applied Lab (Systems-Level)

1. Design a \`Service\` struct with name, port, and status
2. Add:
   - One value receiver method
   - One pointer receiver method
3. Explain which fields change and why`
      },

      {
        type: "text",
        value: `### Reflection Questions

1. Why does Go avoid classes and inheritance?
2. When does a pointer receiver become dangerous?
3. How does struct size influence performance?`
      },

      {
        type: "text",
        value: `### Advancement Hook

Next lesson explores **arrays and slices**, where struct layout meets contiguous memory and performance-critical data access.`
      }
    ]
  },
  {
    slug: "arrays-and-slices",
    title: "Arrays & Slices in Go: Contiguous Memory, Slice Headers, and Performance",
    content: [
      {
        type: "text",
        value: `### Why This Lesson Exists

In Go, arrays and slices look simple.
In reality, slices are one of the **most misunderstood and performance-critical** features of the language.

Most production bugs related to:
- Unexpected data mutation
- Memory leaks
- Performance degradation

come from **incorrect slice usage**.`
      },

      {
        type: "text",
        value: `### Mental Model: Array vs Slice

An **array**:
- Has fixed size
- Is part of the value itself
- Copies entire memory when passed

A **slice**:
- Is a lightweight descriptor
- References an underlying array
- Shares memory by default`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

func main() {
    arr := [3]int{1, 2, 3}
    slice := []int{1, 2, 3}

    fmt.Println(arr)
    fmt.Println(slice)
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### Arrays: Fixed and Predictable

Arrays are rarely used directly in Go because:
- Size is part of the type
- Copying is expensive
- Inflexible for dynamic workloads

But arrays are **foundational** to understanding slices.`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

func modifyArray(a [3]int) {
    a[0] = 100
}

func main() {
    arr := [3]int{1, 2, 3}
    modifyArray(arr)
    fmt.Println(arr) // unchanged
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### Slices: Views Over Arrays

A slice is **not data**.
It is a small struct containing:
- Pointer to underlying array
- Length
- Capacity`
      },

      {
        type: "code",
        language: "go",
        value: `// Conceptual slice header
//
// type slice struct {
//     ptr *T
//     len int
//     cap int
// }`,
        runnable: false
      },

      {
        type: "text",
        value: `### Slice Sharing: The Hidden Danger

Multiple slices can point to the **same underlying array**.
Modifying one slice can affect others.`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

func main() {
    base := []int{1, 2, 3, 4}
    a := base[:2]
    b := base[1:3]

    a[1] = 99
    fmt.Println(base)
    fmt.Println(b)
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### Length vs Capacity

- **len** → number of accessible elements
- **cap** → how far slice can grow without reallocating

Understanding capacity is essential for performance.`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

func main() {
    s := make([]int, 0, 4)
    fmt.Println(len(s), cap(s))

    s = append(s, 1)
    s = append(s, 2)
    fmt.Println(len(s), cap(s))
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### Append and Reallocation (Critical)

When capacity is exceeded:
- A new array is allocated
- Data is copied
- Old array becomes garbage

This impacts:
- Performance
- GC pressure
- Memory locality`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

func main() {
    s := []int{1, 2}
    fmt.Printf("Before: len=%d cap=%d\\n", len(s), cap(s))

    s = append(s, 3, 4, 5)
    fmt.Printf("After: len=%d cap=%d\\n", len(s), cap(s))
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### Deep Dive: Slices in Function Calls

Slices are passed by value, but:
- The slice header is copied
- The underlying array is shared

This is why functions can mutate slice contents.`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

func modifySlice(s []int) {
    s[0] = 100
}

func main() {
    nums := []int{1, 2, 3}
    modifySlice(nums)
    fmt.Println(nums)
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### Failure Scenarios & Anti-Patterns

❌ Assuming slices are independent  
❌ Ignoring capacity growth  
❌ Appending to shared slices unintentionally  
❌ Returning subslices that outlive the original array  

These bugs are subtle and dangerous in production.`
      },

      {
        type: "text",
        value: `### Real-World Mapping (Cybercode Context)

- **C3 Cloud**: Request buffers and queues use slices
- **DigitalFort**: Event pipelines rely on slice batching
- **Microservices**: Efficient slice usage reduces GC pauses`
      },

      {
        type: "text",
        value: `### Applied Lab (Systems-Level)

1. Create a base slice with capacity 4
2. Create two subslices from it
3. Modify one subslice and observe the effect
4. Force reallocation using append and re-test behavior`
      },

      {
        type: "text",
        value: `### Reflection Questions

1. Why are slices preferred over arrays in Go?
2. When does append trigger reallocation?
3. Why can slice sharing be dangerous?`
      },

      {
        type: "text",
        value: `### Advancement Hook

Next lesson explores **maps**, where memory becomes non-contiguous and lookup behavior changes entirely.`
      }
    ]
  },
  {
    slug: "maps-in-go",
    title: "Maps in Go: Hash Tables, Random Order, and Memory Tradeoffs",
    content: [
      {
        type: "text",
        value: `### Why This Lesson Exists

Maps are Go’s primary key–value data structure.
They are powerful, fast, and dangerous when misunderstood.

Most real-world bugs involving maps come from:
- Assuming iteration order
- Concurrent access
- Excessive memory usage`
      },

      {
        type: "text",
        value: `### Mental Model: What a Map Really Is

A Go map is:
- A **hash table**
- Stored on the heap
- Optimized for fast lookups

A map is **not**:
- Ordered
- Thread-safe
- Predictable in iteration`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

func main() {
    scores := map[string]int{
        "Alice": 90,
        "Bob":   85,
        "Carol": 95,
    }

    fmt.Println(scores)
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### Iteration Order Is Random (By Design)

Go deliberately randomizes map iteration order to:
- Prevent developers from depending on it
- Expose hidden bugs early

If your program depends on order, a map is the wrong tool.`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

func main() {
    m := map[string]int{"a": 1, "b": 2, "c": 3}

    for k, v := range m {
        fmt.Println(k, v)
    }
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### Zero Values and Safe Access

Accessing a missing key does **not** panic.
Instead, Go returns the zero value of the value type.`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

func main() {
    m := map[string]int{}
    fmt.Println(m["missing"]) // prints 0

    v, ok := m["missing"]
    fmt.Println(v, ok)
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### Maps and Memory

Maps:
- Allocate memory dynamically
- Grow as entries increase
- Never shrink automatically

Large maps can:
- Consume significant heap memory
- Increase GC pressure`
      },

      {
        type: "code",
        language: "go",
        value: `// Map allocation hint
//
// make(map[string]int, 1000)
// Providing an initial size reduces reallocation`,
        runnable: false
      },

      {
        type: "text",
        value: `### Maps and Concurrency (Critical Warning)

Maps are **not safe for concurrent writes**.
Simultaneous reads and writes can cause a runtime panic.`
      },

      {
        type: "code",
        language: "go",
        value: `// ❌ This will panic if accessed concurrently
//
// var shared = map[string]int{}
//
// Use sync.Map or protect with mutex`,
        runnable: false
      },

      {
        type: "text",
        value: `### Correct Patterns for Concurrent Access

- Use **mutex** to protect maps
- Use **sync.Map** for read-heavy workloads
- Avoid global maps in services`
      },

      {
        type: "text",
        value: `### Failure Scenarios & Anti-Patterns

❌ Assuming deterministic iteration  
❌ Concurrent writes without protection  
❌ Using maps for ordered data  
❌ Letting maps grow unbounded  

These issues cause subtle, production-only failures.`
      },

      {
        type: "text",
        value: `### Real-World Mapping (Cybercode Context)

- **C3 Cloud**: Resource registries and lookups
- **DigitalFort**: Signature and rule matching
- **Microservices**: Caches and in-memory indexes`
      },

      {
        type: "text",
        value: `### Applied Lab (Systems-Level)

1. Create a map with initial capacity
2. Insert and delete keys
3. Iterate multiple times and observe order changes
4. Explain why Go enforces randomness`
      },

      {
        type: "text",
        value: `### Reflection Questions

1. Why does Go randomize map iteration order?
2. Why are maps always heap-allocated?
3. When should maps be avoided entirely?`
      },

      {
        type: "text",
        value: `### Advancement Hook

Next lesson introduces **interfaces**, where maps, structs, and methods combine to enable abstraction without inheritance.`
      }
    ]
  },
  {
    slug: "go-interfaces",
    title: "Interfaces in Go: Structural Typing, Decoupling, and Cost",
    content: [
      {
        type: "text",
        value: `### Why This Lesson Exists

Interfaces are the backbone of large Go systems.
They enable:
- Decoupling
- Testability
- Plugin-style architectures

But misuse of interfaces leads to:
- Indirection overhead
- Loss of clarity
- Debugging nightmares

This lesson teaches **when and why** interfaces should exist — not just how to write them.`
      },

      {
        type: "text",
        value: `### Mental Model: What an Interface Really Is

An interface in Go is:
- A **set of method signatures**
- A contract of behavior
- Implemented **implicitly**

An interface is **not**:
- A class
- A base type
- An inheritance mechanism`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

type Speaker interface {
    Speak() string
}

type Human struct{}

func (h Human) Speak() string {
    return "Hello from Human"
}

type Robot struct{}

func (r Robot) Speak() string {
    return "Beep from Robot"
}

func main() {
    var s Speaker

    s = Human{}
    fmt.Println(s.Speak())

    s = Robot{}
    fmt.Println(s.Speak())
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### Structural Typing (The Key Difference)

In Go:
- Types do **not declare** they implement an interface
- If methods match → implementation is automatic

This enables:
- Loose coupling
- Cleaner dependencies
- Fewer rigid hierarchies`
      },

      {
        type: "text",
        value: `### Interface Values: Two Things Inside

An interface value contains:
1. **Concrete type information**
2. **Concrete value**

This is why interfaces:
- Are slightly slower than direct calls
- Require understanding for performance-sensitive code`
      },

      {
        type: "code",
        language: "go",
        value: `// Conceptual interface representation
//
// interfaceValue {
//     typeInfo *rtype
//     data     unsafe.Pointer
// }`,
        runnable: false
      },

      {
        type: "text",
        value: `### Nil Interfaces vs Nil Values (Classic Trap)

An interface can be:
- Non-nil interface
- Holding a nil concrete value

This leads to subtle bugs if misunderstood.`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

type Service interface {
    Start()
}

type App struct{}

func (a *App) Start() {}

func main() {
    var svc Service
    var app *App = nil

    svc = app
    fmt.Println(svc == nil) // false
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### Performance Considerations

Interface calls involve:
- Indirection
- Dynamic dispatch

In most systems, this cost is negligible.
In hot paths, it matters.

Rule:
- Use interfaces at **boundaries**
- Avoid them in **tight loops** unless necessary`
      },

      {
        type: "text",
        value: `### Designing Good Interfaces (Go Philosophy)

- Keep interfaces **small**
- Prefer single-method interfaces
- Define interfaces **where they are used**, not where implemented

Example: \`io.Reader\`, \`http.Handler\``
      },

      {
        type: "text",
        value: `### Failure Scenarios & Anti-Patterns

❌ Fat interfaces with many methods  
❌ Interfaces everywhere “just in case”  
❌ Returning interfaces when concrete types are fine  
❌ Using interfaces to simulate inheritance  

These destroy clarity and performance.`
      },

      {
        type: "text",
        value: `### Real-World Mapping (Cybercode Context)

- **C3 Cloud**: Abstracting storage, compute, and network drivers
- **DigitalFort**: Pluggable detection engines
- **Testing**: Mocking dependencies cleanly`
      },

      {
        type: "text",
        value: `### Applied Lab (Systems-Level)

1. Define a small interface \`Logger\`
2. Implement it using:
   - Console logger
   - File logger (conceptual)
3. Use the interface in a function without knowing implementation`
      },

      {
        type: "text",
        value: `### Reflection Questions

1. Why does Go prefer implicit interface implementation?
2. When do interfaces hurt performance?
3. Why should interfaces be defined at usage points?`
      },

      {
        type: "text",
        value: `### Advancement Hook

Next lesson explores **control flow**, where interfaces interact with branching, loops, and explicit decision-making in systems code.`
      }
    ]
  },
  {
    slug: "go-control-flow",
    title: "Control Flow in Go: Explicit Branching, Predictability, and Safety",
    content: [
      {
        type: "text",
        value: `### Why This Lesson Exists

Production systems fail when execution paths are unclear.
Hidden control flow leads to:
- Missed edge cases
- Unhandled errors
- Unpredictable behavior

Go enforces **explicit control flow** to make execution paths obvious, reviewable, and testable.`
      },

      {
        type: "text",
        value: `### Mental Model: Control Flow as a Decision Graph

Every program is a decision graph.
In Go:
- All branches are explicit
- No implicit truthiness
- No hidden fallthroughs (unless requested)

This design favors **clarity over cleverness**.`
      },

      {
        type: "text",
        value: `### if / else: Explicit Conditions Only

Go does not allow implicit boolean conversion.
Conditions must evaluate to \`bool\`.`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

func main() {
    status := 200

    if status == 200 {
        fmt.Println("OK")
    } else {
        fmt.Println("Not OK")
    }
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### Short Statements in if

Go allows a short initialization statement scoped to the if block.
This reduces variable leakage and improves readability.`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

func main() {
    if value := 10; value > 5 {
        fmt.Println("Value is greater than 5")
    }
    // value is not accessible here
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### switch: Safer Multi-Branch Logic

Go’s switch:
- Does not fall through by default
- Can match multiple cases
- Can operate on expressions or conditions`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

func main() {
    day := "Saturday"

    switch day {
    case "Monday":
        fmt.Println("Start of week")
    case "Saturday", "Sunday":
        fmt.Println("Weekend")
    default:
        fmt.Println("Midweek")
    }
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### fallthrough (Use With Caution)

\`fallthrough\` explicitly forces execution into the next case.
Its use should be rare and intentional.`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

func main() {
    x := 1

    switch x {
    case 1:
        fmt.Println("One")
        fallthrough
    case 2:
        fmt.Println("Two")
    }
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### for: The Only Loop in Go

Go has a single looping construct.
It can represent:
- Traditional loops
- While-style loops
- Infinite loops`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

func main() {
    for i := 0; i < 3; i++ {
        fmt.Println(i)
    }
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### Infinite Loops and Controlled Exit

Infinite loops are common in:
- Servers
- Workers
- Event processors

They must always have a clear exit or blocking condition.`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

func main() {
    count := 0

    for {
        if count == 3 {
            break
        }
        fmt.Println("Running")
        count++
    }
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### break and continue

- \`break\` exits the loop
- \`continue\` skips to the next iteration

Used carefully, they simplify logic.
Overuse reduces readability.`
      },

      {
        type: "text",
        value: `### Failure Scenarios & Anti-Patterns

❌ Deeply nested if/else chains  
❌ Overusing fallthrough  
❌ Infinite loops without exit conditions  
❌ Encoding business logic in switch order  

These reduce clarity and increase bug risk.`
      },

      {
        type: "text",
        value: `### Real-World Mapping (Cybercode Context)

- **C3 Cloud**: Request routing and state machines
- **DigitalFort**: Rule engines and decision pipelines
- **Microservices**: Explicit error and retry logic`
      },

      {
        type: "text",
        value: `### Applied Lab (Systems-Level)

1. Write a loop that simulates a retry mechanism
2. Stop after a maximum number of attempts
3. Use clear conditions and explicit exits`
      },

      {
        type: "text",
        value: `### Reflection Questions

1. Why does Go avoid implicit truthiness?
2. Why is switch safer than chained if/else?
3. When are infinite loops appropriate?`
      },

      {
        type: "text",
        value: `### Advancement Hook

Next lesson focuses on **error handling**, where control flow meets failure management and system reliability.`
      }
    ]
  },
  {
    slug: "handling-errors-in-go",
    title: "Error Handling in Go: Explicit Failure Paths and System Reliability",
    content: [
      {
        type: "text",
        value: `### Why This Lesson Exists

In real systems:
- Networks fail
- Disks fail
- APIs fail
- Assumptions fail

Go treats errors as **expected values**, not exceptional events.
This forces engineers to **design for failure**, not react to it.`
      },

      {
        type: "text",
        value: `### Mental Model: Errors Are Data

In Go:
- Errors are ordinary values
- They travel through return paths
- They must be handled explicitly

There are no hidden jumps, stack unwinding, or magic recovery.`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import (
    "errors"
    "fmt"
)

func readConfig() (string, error) {
    return "", errors.New("config file missing")
}

func main() {
    cfg, err := readConfig()
    if err != nil {
        fmt.Println("Startup failed:", err)
        return
    }
    fmt.Println("Config loaded:", cfg)
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### Why Go Avoids Exceptions

Exceptions:
- Hide control flow
- Skip intermediate logic
- Make systems harder to reason about

Go prefers:
- Linear execution
- Visible failure paths
- Predictable cleanup`
      },

      {
        type: "text",
        value: `### The Idiomatic Error Pattern

The canonical Go pattern is:

\`\`\`go
result, err := operation()
if err != nil {
    // handle or return
}
\`\`\`

This repetition is **intentional**, not accidental.`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import (
    "fmt"
    "strconv"
)

func main() {
    num, err := strconv.Atoi("123a")
    if err != nil {
        fmt.Println("Conversion failed:", err)
        return
    }
    fmt.Println("Number:", num)
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### Error Wrapping and Context

Errors without context are useless in production.
Go allows errors to be wrapped to preserve cause and add meaning.`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import (
    "fmt"
    "fmt"
)

func loadUser() error {
    return fmt.Errorf("loadUser failed: %w", ErrNotFound)
}

var ErrNotFound = fmt.Errorf("user not found")

func main() {
    err := loadUser()
    fmt.Println(err)
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### Sentinel Errors vs Typed Errors

Two common patterns:
- **Sentinel errors**: shared variables for comparison
- **Typed errors**: custom error types with fields

Choosing correctly affects API stability and extensibility.`
      },

      {
        type: "code",
        language: "go",
        value: `// Typed error example
//
// type PermissionError struct {
//     User string
// }
//
// func (e *PermissionError) Error() string {
//     return "permission denied for " + e.User
// }`,
        runnable: false
      },

      {
        type: "text",
        value: `### Failure Domains and Boundaries

Good systems:
- Handle errors locally when possible
- Escalate errors across boundaries
- Never ignore errors silently

Error handling defines **system reliability**.`
      },

      {
        type: "text",
        value: `### Failure Scenarios & Anti-Patterns

❌ Ignoring returned errors  
❌ Logging and continuing blindly  
❌ Using panic for expected failures  
❌ Losing original error context  

These practices cause outages and data corruption.`
      },

      {
        type: "text",
        value: `### Real-World Mapping (Cybercode Context)

- **C3 Cloud**: Infrastructure provisioning failures
- **DigitalFort**: Detection pipeline robustness
- **Microservices**: Graceful degradation and retries`
      },

      {
        type: "text",
        value: `### Applied Lab (Systems-Level)

1. Write a function that reads a configuration value
2. Return meaningful errors at each failure point
3. Add context without losing the original cause`
      },

      {
        type: "text",
        value: `### Reflection Questions

1. Why are errors values in Go?
2. When is panic acceptable?
3. How does explicit error handling improve reliability?`
      },

      {
        type: "text",
        value: `### Advancement Hook

Next lesson goes **deeper into failure handling** with panic, recover, and controlled crash behavior.`
      }
    ]
  },
  {
    slug: "error-handling-advanced",
    title: "Advanced Error Handling in Go: Panic, Recover, and Fail-Fast Systems",
    content: [
      {
        type: "text",
        value: `### Why This Lesson Exists

Not all failures are equal.

Some failures:
- Are expected and recoverable
- Should be handled and returned as errors

Other failures:
- Indicate corrupted state
- Break core assumptions
- Make continued execution dangerous

Go separates these two worlds using **errors** and **panic**.`
      },

      {
        type: "text",
        value: `### Mental Model: Error vs Panic

- **error** → expected failure, part of normal control flow  
- **panic** → programmer or system invariant violation  

If your program can continue safely, use errors.  
If it cannot, fail fast.`
      },

      {
        type: "text",
        value: `### panic: Immediate Program Disruption

Calling \`panic\`:
- Stops normal execution
- Unwinds the call stack
- Runs deferred functions
- Terminates the program (unless recovered)`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

func criticalConfig() {
    panic("missing critical configuration")
}

func main() {
    fmt.Println("Starting system")
    criticalConfig()
    fmt.Println("This line will not execute")
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### When Is panic Acceptable?

Use panic only when:
- Program invariants are broken
- Continuing would corrupt data
- Recovery is impossible or unsafe

Examples:
- Nil pointer where logic guarantees non-nil
- Impossible switch cases
- Corrupted in-memory state`
      },

      {
        type: "text",
        value: `### defer and Stack Unwinding

Before a program exits due to panic:
- All deferred calls execute (LIFO order)
- Resources can be released
- Logs can be flushed

This is why defer is critical in systems code.`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

func main() {
    defer fmt.Println("cleanup complete")
    panic("fatal error")
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### recover: Controlled Interception

\`recover\` allows a program to:
- Intercept a panic
- Restore control
- Decide whether to continue or shut down

Recover only works inside deferred functions.`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

func safeExecute() {
    defer func() {
        if r := recover(); r != nil {
            fmt.Println("Recovered from panic:", r)
        }
    }()
    panic("unexpected failure")
}

func main() {
    safeExecute()
    fmt.Println("System continues safely")
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### The Danger of Overusing recover

Recover is powerful — and dangerous.

❌ Recovering everywhere hides real bugs  
❌ Continuing with corrupted state  
❌ Turning panics into silent failures  

Recover should exist only at **well-defined system boundaries**.`
      },

      {
        type: "text",
        value: `### Fail-Fast Philosophy (Production Reality)

In large systems:
- Crashing early is safer than running wrong
- Supervisors restart failed services
- Logs + metrics capture failure context

This is known as **crash-only design**.`
      },

      {
        type: "text",
        value: `### Where Panic/Recover Live in Real Systems

- HTTP middleware (protect server from handler panic)
- Goroutine boundaries
- Worker pools
- Entry points of services

Never hide panic deep inside business logic.`
      },

      {
        type: "code",
        language: "go",
        value: `// Example: HTTP server boundary (conceptual)
//
// defer func() {
//     if r := recover(); r != nil {
//         log.Error("handler panic:", r)
//         http.Error(w, "internal error", 500)
//     }
// }()`,
        runnable: false
      },

      {
        type: "text",
        value: `### Failure Scenarios & Anti-Patterns

❌ Using panic for validation errors  
❌ Recovering without logging  
❌ Swallowing panics and continuing  
❌ Mixing panic and error randomly  

These create systems that fail silently and unpredictably.`
      },

      {
        type: "text",
        value: `### Real-World Mapping (Cybercode Context)

- **C3 Cloud**: Controller processes fail fast and restart
- **DigitalFort**: Corrupted detection pipelines must stop immediately
- **Microservices**: Panics surface bugs early during development`
      },

      {
        type: "text",
        value: `### Applied Lab (Systems-Level)

1. Write a function that panics on invalid state
2. Add a deferred recover at a boundary function
3. Log the failure and decide whether to continue or exit`
      },

      {
        type: "text",
        value: `### Reflection Questions

1. Why is panic not just “another error”?
2. Where should recover be placed in a system?
3. Why is fail-fast safer than silent recovery?`
      },

      {
        type: "text",
        value: `### Advancement Hook

Next lesson moves into **concurrency**, where failure handling becomes harder and race conditions enter the system.`
      }
    ]
  },
  {
    slug: "concurrency-with-goroutines",
    title: "Concurrency with Goroutines: Go Runtime, Scheduling, and Scale",
    content: [
      {
        type: "text",
        value: `### Why This Lesson Exists

Modern systems are concurrent by default:
- Web servers handle thousands of requests
- Cloud services run background workers
- Security pipelines process events in parallel

Go was designed **from the ground up** for concurrency.
Goroutines are not threads — they are a runtime abstraction that enables massive scale.`
      },

      {
        type: "text",
        value: `### Mental Model: Concurrency vs Parallelism

- **Concurrency**: Structuring a program to handle multiple tasks
- **Parallelism**: Executing tasks simultaneously on multiple cores

Go focuses on **concurrency first** and lets the runtime decide when and how to run things in parallel.`
      },

      {
        type: "text",
        value: `### What Is a Goroutine?

A goroutine is:
- A lightweight unit of execution
- Managed by the Go runtime
- Much cheaper than an OS thread

Thousands of goroutines can run on a handful of threads.`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import (
    "fmt"
    "time"
)

func say(msg string) {
    for i := 0; i < 3; i++ {
        time.Sleep(300 * time.Millisecond)
        fmt.Println(msg)
    }
}

func main() {
    go say("Hello")
    say("World")
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### What Just Happened?

- \`go say("Hello")\` starts a goroutine
- \`say("World")\` runs in the main goroutine
- Both execute concurrently
- Program exits when \`main()\` finishes

This is **intentional** and critical to understand.`
      },

      {
        type: "text",
        value: `### Go Runtime Scheduling (High-Level)

Go uses an **M:N scheduler**:
- Many goroutines (G)
- Mapped onto OS threads (M)
- Managed by logical processors (P)

You do NOT manage threads.
The runtime does.`
      },

      {
        type: "code",
        language: "go",
        value: `// Conceptual scheduler model
//
// G (goroutine) -> P (processor) -> M (OS thread)
//
// The runtime schedules G onto available P,
// which execute on M.`,
        runnable: false
      },

      {
        type: "text",
        value: `### Why Goroutines Are Cheap

Compared to OS threads:
- Small initial stack (grows dynamically)
- Fast creation and teardown
- Cooperative scheduling points

This enables Go servers to handle massive concurrency efficiently.`
      },

      {
        type: "text",
        value: `### Blocking and Sleeping

When a goroutine blocks (sleep, I/O):
- The runtime parks it
- Frees the OS thread
- Schedules another goroutine

This is key to scalability.`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import (
    "fmt"
    "time"
)

func main() {
    go func() {
        time.Sleep(1 * time.Second)
        fmt.Println("Async task done")
    }()

    fmt.Println("Main continues")
    time.Sleep(2 * time.Second)
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### Common Beginner Trap

Launching a goroutine does NOT mean:
- It will complete
- It will run immediately
- It will survive program exit

Lifecycle control is the programmer’s responsibility.`
      },

      {
        type: "text",
        value: `### Goroutines in Real Systems

Goroutines power:
- HTTP request handlers
- Background workers
- Event processors
- Streaming pipelines

But without coordination, they lead to:
- Race conditions
- Leaks
- Unbounded resource usage`
      },

      {
        type: "text",
        value: `### Failure Scenarios & Anti-Patterns

❌ Launching goroutines without lifecycle control  
❌ Assuming order of execution  
❌ Spawning unbounded goroutines  
❌ Ignoring synchronization  

Concurrency bugs often appear only under load.`
      },

      {
        type: "text",
        value: `### Real-World Mapping (Cybercode Context)

- **C3 Cloud**: Controllers manage thousands of concurrent tasks
- **DigitalFort**: Event ingestion pipelines are goroutine-based
- **Microservices**: Each request typically runs in its own goroutine`
      },

      {
        type: "text",
        value: `### Applied Lab (Systems-Level)

1. Launch multiple goroutines printing different messages
2. Observe non-deterministic ordering
3. Explain why ordering cannot be guaranteed`
      },

      {
        type: "text",
        value: `### Reflection Questions

1. Why are goroutines cheaper than threads?
2. Why does the program exit even if goroutines are running?
3. Why is concurrency harder than sequential code?`
      },

      {
        type: "text",
        value: `### Advancement Hook

Next lesson introduces **channels**, Go’s primary tool for coordinating goroutines safely and predictably.`
      }
    ]
  },
  {
    slug: "goroutines-and-channels",
    title: "Channels in Go: Synchronization, Communication, and Correctness",
    content: [
      {
        type: "text",
        value: `### Why This Lesson Exists

Goroutines give you concurrency.
Channels give you **control**.

Without channels:
- Goroutines race
- State becomes corrupted
- Bugs appear only under load

Channels are Go’s answer to **safe coordination** between concurrent execution units.`
      },

      {
        type: "text",
        value: `### Go’s Concurrency Philosophy

Go follows a simple but strict rule:

> **Do not communicate by sharing memory;  
> share memory by communicating.**

Channels are the mechanism that enforces this philosophy.`
      },

      {
        type: "text",
        value: `### Mental Model: What a Channel Is

A channel is:
- A **typed communication pipe**
- A synchronization point
- A queue with blocking semantics

A channel is **not**:
- A data store
- A replacement for databases
- A performance shortcut`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

func worker(ch chan string) {
    ch <- "task completed"
}

func main() {
    ch := make(chan string)
    go worker(ch)

    msg := <-ch
    fmt.Println(msg)
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### What Just Happened?

- \`make(chan string)\` creates an **unbuffered channel**
- Sending (\`ch <-\`) blocks until received
- Receiving (\`<-ch\`) blocks until sent

This guarantees **synchronization without locks**.`
      },

      {
        type: "text",
        value: `### Unbuffered Channels: Strict Synchronization

Unbuffered channels:
- Enforce hand-off semantics
- Are ideal for signaling and coordination
- Prevent uncontrolled concurrency`
      },

      {
        type: "text",
        value: `### Buffered Channels: Controlled Queues

Buffered channels introduce capacity.
They allow limited decoupling between sender and receiver.`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

func main() {
    ch := make(chan int, 2)

    ch <- 1
    ch <- 2

    fmt.Println(<-ch)
    fmt.Println(<-ch)
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### When to Use Buffered Channels

Buffered channels are appropriate when:
- Producers and consumers operate at different speeds
- Small bursts are acceptable
- Backpressure is still required

They are **not unlimited queues**.`
      },

      {
        type: "text",
        value: `### Deadlocks: The Cost of Incorrect Design

Channels will **deadlock** when:
- Everyone is waiting
- No goroutine can make progress

Deadlocks are correctness failures, not runtime quirks.`
      },

      {
        type: "code",
        language: "go",
        value: `// ❌ Deadlock example
//
// func main() {
//     ch := make(chan int)
//     ch <- 1 // blocks forever
// }`,
        runnable: false
      },

      {
        type: "text",
        value: `### Directional Channels (Advanced Safety)

Go allows channels to be restricted:
- Send-only
- Receive-only

This prevents misuse at compile time.`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "fmt"

func sender(ch chan<- int) {
    ch <- 42
}

func receiver(ch <-chan int) {
    fmt.Println(<-ch)
}

func main() {
    ch := make(chan int)
    go sender(ch)
    receiver(ch)
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### select: Coordinating Multiple Channels

\`select\` allows a goroutine to:
- Wait on multiple channel operations
- Implement timeouts
- Avoid blocking indefinitely`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import (
    "fmt"
    "time"
)

func main() {
    ch := make(chan string)

    select {
    case msg := <-ch:
        fmt.Println("Received:", msg)
    case <-time.After(1 * time.Second):
        fmt.Println("Timeout")
    }
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### Channels vs Mutexes (Design Choice)

- Channels → coordination & workflows
- Mutexes → shared state protection

Good systems use **both**, intentionally.`
      },

      {
        type: "text",
        value: `### Failure Scenarios & Anti-Patterns

❌ Using channels as general storage  
❌ Ignoring channel closure semantics  
❌ Unbounded buffered channels  
❌ Mixing channels and shared state blindly  

Concurrency bugs are expensive and hard to reproduce.`
      },

      {
        type: "text",
        value: `### Real-World Mapping (Cybercode Context)

- **C3 Cloud**: Task queues and controller signaling
- **DigitalFort**: Event ingestion and alert pipelines
- **Microservices**: Worker pools and async processing`
      },

      {
        type: "text",
        value: `### Applied Lab (Systems-Level)

1. Build a worker that processes jobs from a channel
2. Add buffering and observe behavior
3. Introduce a timeout using \`select\`
4. Explain how deadlocks are avoided`
      },

      {
        type: "text",
        value: `### Reflection Questions

1. Why are channels safer than shared memory?
2. When should buffered channels be avoided?
3. Why is deadlock a design error, not a runtime issue?`
      },

      {
        type: "text",
        value: `### Advancement Hook

Next lesson focuses on **synchronization primitives** like WaitGroups and Mutexes, used when channels are not the right tool.`
      }
    ]
  },
  {
    slug: "sync-and-concurrency-tools",
    title: "Synchronization in Go: WaitGroups, Mutexes, and Race Conditions",
    content: [
      {
        type: "text",
        value: `### Why This Lesson Exists

Concurrency without synchronization leads to:
- Race conditions
- Corrupted state
- Nondeterministic bugs

Channels are powerful, but they are **not always the right tool**.
Go provides explicit synchronization primitives for shared state.`
      },

      {
        type: "text",
        value: `### Mental Model: Coordination vs Protection

- **Channels** → coordinate workflow
- **WaitGroups** → wait for completion
- **Mutexes** → protect shared memory

Professional Go systems use all three — deliberately.`
      },

      {
        type: "text",
        value: `### WaitGroup: Waiting for Goroutines

A WaitGroup allows one goroutine to:
- Launch many goroutines
- Wait until all of them finish

It does NOT:
- Share data
- Protect memory`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import (
    "fmt"
    "sync"
)

func worker(id int, wg *sync.WaitGroup) {
    defer wg.Done()
    fmt.Println("Worker", id, "done")
}

func main() {
    var wg sync.WaitGroup

    for i := 1; i <= 3; i++ {
        wg.Add(1)
        go worker(i, &wg)
    }

    wg.Wait()
    fmt.Println("All workers completed")
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### Common WaitGroup Mistakes

❌ Forgetting to call \`Done()\`  
❌ Calling \`Add()\` inside goroutine  
❌ Reusing WaitGroup incorrectly  

These cause deadlocks or panics.`
      },

      {
        type: "text",
        value: `### Mutex: Protecting Shared State

A Mutex ensures:
- Only one goroutine accesses critical section
- Shared data remains consistent`
      },

      {
        type: "code",
        language: "go",
        value: `package main

import (
    "fmt"
    "sync"
)

func main() {
    var (
        count int
        mu    sync.Mutex
        wg    sync.WaitGroup
    )

    for i := 0; i < 5; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            mu.Lock()
            count++
            mu.Unlock()
        }()
    }

    wg.Wait()
    fmt.Println("Final count:", count)
}`,
        runnable: true
      },

      {
        type: "text",
        value: `### What Mutex Really Does

A mutex:
- Serializes access
- Blocks other goroutines
- Can become a performance bottleneck

Incorrect usage leads to:
- Deadlocks
- Starvation
- Reduced throughput`
      },

      {
        type: "text",
        value: `### Race Conditions (Critical Concept)

A race condition occurs when:
- Multiple goroutines access shared data
- At least one writes
- Without synchronization

Go provides tools to detect races early.`
      },

      {
        type: "code",
        language: "go",
        value: `// Run with:
// go run -race main.go
//
// The race detector finds concurrent memory access bugs`,
        runnable: false
      },

      {
        type: "text",
        value: `### Choosing the Right Tool

| Scenario | Tool |
|--------|------|
| Task completion | WaitGroup |
| Shared counter | Mutex |
| Workflow pipeline | Channel |
| Read-heavy map | sync.Map |

Wrong choice = fragile system.`
      },

      {
        type: "text",
        value: `### Failure Scenarios & Anti-Patterns

❌ Overusing mutexes everywhere  
❌ Forgetting to unlock  
❌ Nested locks  
❌ Mixing channels and mutexes without design  

These cause deadlocks and performance collapse.`
      },

      {
        type: "text",
        value: `### Real-World Mapping (Cybercode Context)

- **C3 Cloud**: Controller state protection
- **DigitalFort**: Shared alert counters
- **Microservices**: Safe in-memory caches`
      },

      {
        type: "text",
        value: `### Applied Lab (Systems-Level)

1. Create a shared counter
2. Increment it concurrently without mutex (observe issue)
3. Fix it using mutex
4. Verify correctness`
      },

      {
        type: "text",
        value: `### Reflection Questions

1. Why doesn’t WaitGroup protect data?
2. When does a mutex become a bottleneck?
3. Why is race detection essential?`
      },

      {
        type: "text",
        value: `### Advancement Hook

Next lesson focuses on **performance measurement**, where we learn to prove concurrency decisions using benchmarks.`
      }
    ]
  },
  {
    slug: "benchmarking-and-performance-testing",
    title: "Benchmarking in Go: Measuring Performance, Not Guessing",
    content: [
      {
        type: "text",
        value: `### Why This Lesson Exists

Most performance discussions are based on assumptions.
In production systems, assumptions cause:
- Latency spikes
- Resource exhaustion
- Unexpected outages

Go provides **first-class benchmarking tools** so performance decisions can be **measured, not debated**.`
      },

      {
        type: "text",
        value: `### Mental Model: Performance Is a Hypothesis

Every performance claim is a hypothesis:
- “Pointers are faster”
- “This function is optimized”
- “Concurrency improved throughput”

Benchmarks exist to **prove or disprove** these claims.`
      },

      {
        type: "text",
        value: `### The testing Package (Dual Purpose)

The \`testing\` package supports:
- Unit tests
- Benchmarks
- Fuzz tests

Benchmarks focus on **speed, allocations, and scalability**.`
      },

      {
        type: "code",
        language: "go",
        value: `package main

func Add(a, b int) int {
    return a + b
}`,
        runnable: false
      },

      {
        type: "code",
        language: "go",
        value: `package main

import "testing"

func BenchmarkAdd(b *testing.B) {
    for i := 0; i < b.N; i++ {
        Add(2, 3)
    }
}`,
        runnable: false
      },

      {
        type: "text",
        value: `### How Benchmarks Work

- \`b.N\` is dynamically adjusted
- The loop runs until timing stabilizes
- Results are averaged

This removes noise from short execution times.`
      },

      {
        type: "text",
        value: `### Running Benchmarks

Benchmarks are run using:

\`\`\`
go test -bench .
\`\`\`

This outputs:
- ns/op (time per operation)
- allocs/op
- bytes/op`
      },

      {
        type: "text",
        value: `### Measuring Allocations (Critical)

Allocations cause:
- Heap growth
- GC overhead
- Latency spikes

Benchmarks can expose hidden allocations.`
      },

      {
        type: "code",
        language: "go",
        value: `func BenchmarkAlloc(b *testing.B) {
    for i := 0; i < b.N; i++ {
        _ = make([]int, 100)
    }
}`,
        runnable: false
      },

      {
        type: "text",
        value: `### Comparing Implementations

Benchmarks are most powerful when comparing alternatives.

Examples:
- Value vs pointer receivers
- Slice preallocation vs dynamic append
- Mutex vs channel coordination`
      },

      {
        type: "text",
        value: `### Benchmarking Concurrency

Concurrency benchmarks must:
- Avoid false sharing
- Control goroutine count
- Measure throughput, not just latency

Naive benchmarks lie.`
      },

      {
        type: "code",
        language: "go",
        value: `// Example: parallel benchmark
//
// func BenchmarkParallel(b *testing.B) {
//     b.RunParallel(func(pb *testing.PB) {
//         for pb.Next() {
//             Add(1, 2)
//         }
//     })
// }`,
        runnable: false
      },

      {
        type: "text",
        value: `### Common Benchmarking Mistakes

❌ Benchmarking with logging enabled  
❌ Measuring I/O instead of logic  
❌ Comparing results across different machines  
❌ Ignoring allocation metrics  

These invalidate results.`
      },

      {
        type: "text",
        value: `### Interpreting Results Correctly

- Faster is not always better
- Readability and safety matter
- Optimize only hot paths
- Measure before and after changes`
      },

      {
        type: "text",
        value: `### Real-World Mapping (Cybercode Context)

- **C3 Cloud**: Scheduler and controller performance
- **DigitalFort**: High-volume event processing
- **Microservices**: Request handling latency and throughput`
      },

      {
        type: "text",
        value: `### Applied Lab (Systems-Level)

1. Benchmark a function using value receivers
2. Benchmark the same function using pointer receivers
3. Compare time and allocations
4. Justify which is better and why`
      },

      {
        type: "text",
        value: `### Reflection Questions

1. Why is guessing performance dangerous?
2. Why are allocations as important as speed?
3. When should performance optimization stop?`
      },

      {
        type: "text",
        value: `### Advancement Hook

Next lessons move into **real-world Go systems**:
- Web servers
- Databases
- REST APIs
- Deployment

From here, everything becomes applied engineering.`
      }
    ]
  },
  {
  slug: "file-handling-in-go",
  title: "File Handling in Go: OS Interaction, Files, and Streams",
  content: [
    {
      type: "text",
      value: `### Why This Lesson Exists

Real systems must interact with the operating system.
This includes:
- Reading configuration files
- Writing logs
- Persisting intermediate data
- Processing large files

Go provides **explicit, low-level control** over file I/O through standard libraries.`
    },

    {
      type: "text",
      value: `### Mental Model: Files Are OS Resources

A file is not just data.
It is:
- An OS-managed resource
- Accessed via file descriptors
- Limited and must be closed explicitly

Incorrect file handling causes:
- Resource leaks
- Data corruption
- System instability`
    },

    {
      type: "text",
      value: `### Creating and Writing to Files

The \`os\` package is the primary entry point for file operations.`
    },

    {
      type: "code",
      language: "go",
      value: `package main

import (
    "fmt"
    "os"
)

func main() {
    file, err := os.Create("example.txt")
    if err != nil {
        fmt.Println("Error creating file:", err)
        return
    }
    defer file.Close()

    file.WriteString("Hello from Cybercode\\n")
}`,
      runnable: true
    },

    {
      type: "text",
      value: `### Why defer file.Close() Matters

- Files consume OS file descriptors
- Descriptors are finite
- \`defer\` guarantees cleanup even on early return or panic`
    },

    {
      type: "text",
      value: `### Reading Files into Memory

For small and medium files, Go provides a simple API.`
    },

    {
      type: "code",
      language: "go",
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
    fmt.Println(string(data))
}`,
      runnable: true
    },

    {
      type: "text",
      value: `### Streaming Large Files

Loading large files entirely into memory is dangerous.
For large files, use buffered streaming.`
    },

    {
      type: "code",
      language: "go",
      value: `// Conceptual example for large files
//
// file, _ := os.Open("big.log")
// defer file.Close()
//
// scanner := bufio.NewScanner(file)
// for scanner.Scan() {
//     fmt.Println(scanner.Text())
// }`,
      runnable: false
    },

    {
      type: "text",
      value: `### File Permissions and Modes

File creation requires permissions:
- Read (r)
- Write (w)
- Execute (x)

Example mode: 0644 → rw-r--r--`
    },

    {
      type: "text",
      value: `### Common Failure Scenarios

❌ Forgetting to close files  
❌ Ignoring write errors  
❌ Reading large files into memory  
❌ Assuming file paths always exist  

File handling bugs often appear only in production.`
    },

    {
      type: "text",
      value: `### Real-World Mapping (Cybercode Context)

- **EduLabs**: Course exports, logs
- **C3 Cloud**: Configuration and state files
- **DigitalFort**: Event logs and forensic artifacts`
    },

    {
      type: "text",
      value: `### Applied Lab

1. Create a file and write multiple lines
2. Read it back using streaming
3. Handle missing-file errors explicitly`
    },

    {
      type: "text",
      value: `### Reflection Questions

1. Why must files be closed explicitly?
2. When should streaming be preferred over ReadFile?
3. How do file permissions impact security?`
    },

    {
      type: "text",
      value: `### Advancement Hook

Next lesson focuses on **JSON handling**, where file I/O meets structured data serialization.`
    }
  ]
},
{
  slug: "json-handling-in-go",
  title: "JSON Handling in Go: Serialization, Deserialization, and Data Contracts",
  content: [
    {
      type: "text",
      value: `### Why This Lesson Exists

JSON is the most common data interchange format in modern systems.
It is used for:
- Configuration files
- REST APIs
- Inter-service communication
- Event payloads

In Go, JSON handling is **explicit and type-safe**, enforcing correctness at compile time.`
    },

    {
      type: "text",
      value: `### Mental Model: JSON as a Data Contract

JSON is not just text.
It represents a **contract** between systems.

If the contract breaks:
- APIs fail
- Data becomes invalid
- Systems become unreliable

Go enforces this contract using structs and explicit field mapping.`
    },

    {
      type: "text",
      value: `### Encoding JSON (Struct → JSON)

The \`encoding/json\` package converts Go structs into JSON using reflection and field tags.`
    },

    {
      type: "code",
      language: "go",
      value: `package main

import (
    "encoding/json"
    "fmt"
)

type Student struct {
    Name  string \`json:"name"\`
    Age   int    \`json:"age"\`
    Email string \`json:"email"\`
}

func main() {
    s := Student{
        Name:  "Asha",
        Age:   21,
        Email: "asha@example.com",
    }

    data, err := json.Marshal(s)
    if err != nil {
        fmt.Println("JSON encode error:", err)
        return
    }

    fmt.Println(string(data))
}`,
      runnable: true
    },

    {
      type: "text",
      value: `### JSON Tags and Field Visibility

Rules:
- Only **exported fields** (capitalized) are encoded
- Tags control key names and behavior
- Missing tags use field names by default`
    },

    {
      type: "text",
      value: `### Common Tag Options

- \`json:"name"\` → rename field
- \`json:"age,omitempty"\` → omit if zero value
- \`json:"-"\` → exclude field entirely`
    },

    {
      type: "text",
      value: `### Decoding JSON (JSON → Struct)

Decoding validates incoming data against struct definitions.`
    },

    {
      type: "code",
      language: "go",
      value: `package main

import (
    "encoding/json"
    "fmt"
)

type User struct {
    Username string \`json:"username"\`
    Active   bool   \`json:"active"\`
}

func main() {
    input := \`{"username":"cybercode","active":true}\`

    var u User
    err := json.Unmarshal([]byte(input), &u)
    if err != nil {
        fmt.Println("JSON decode error:", err)
        return
    }

    fmt.Println(u.Username, u.Active)
}`,
      runnable: true
    },

    {
      type: "text",
      value: `### Partial and Unknown Fields

- Extra JSON fields are ignored by default
- Missing fields take zero values
- This allows backward-compatible APIs`
    },

    {
      type: "text",
      value: `### Handling Dynamic JSON

When structure is unknown, use \`map[string]interface{}\`.

This sacrifices type safety and should be avoided unless necessary.`
    },

    {
      type: "code",
      language: "go",
      value: `// Dynamic JSON example
//
// var data map[string]interface{}
// json.Unmarshal(inputBytes, &data)`,
      runnable: false
    },

    {
      type: "text",
      value: `### JSON and File I/O (Combined Use Case)

JSON is often read from or written to files for configuration and state storage.`
    },

    {
      type: "code",
      language: "go",
      value: `// Example workflow:
// 1. Read JSON file
// 2. Unmarshal into struct
// 3. Use strongly typed data`,
      runnable: false
    },

    {
      type: "text",
      value: `### Failure Scenarios & Anti-Patterns

❌ Using map[string]interface{} everywhere  
❌ Ignoring Unmarshal errors  
❌ Depending on implicit field names  
❌ Breaking JSON contracts silently  

These lead to fragile APIs and runtime bugs.`
    },

    {
      type: "text",
      value: `### Real-World Mapping (Cybercode Context)

- **EduLabs**: Course metadata and progress
- **C3 Cloud**: Configuration and API payloads
- **DigitalFort**: Event data and alerts`
    },

    {
      type: "text",
      value: `### Applied Lab

1. Define a struct for application configuration
2. Encode it to JSON and save to a file
3. Read it back and decode into the struct
4. Validate fields explicitly`
    },

    {
      type: "text",
      value: `### Reflection Questions

1. Why does Go require exported fields for JSON?
2. Why is type safety critical for JSON APIs?
3. When is dynamic JSON unavoidable?`
    },

    {
      type: "text",
      value: `### Phase Completion Note

This completes **PHASE 4 — I/O & Serialization**.
Next phase introduces **modules, web servers, and persistence**, where JSON becomes the backbone of APIs.`
    }
  ]
},
{
  slug: "go-packages-and-modules",
  title: "Go Packages and Modules: Code Organization, Dependency Control, and Build Integrity",
  content: [
    {
      type: "text",
      value: `### Why This Lesson Exists

As systems grow, unstructured code becomes unmaintainable.
Go enforces structure through:
- **Packages** for logical grouping
- **Modules** for dependency management and versioning

This lesson establishes the foundation for building **large, production-grade Go systems**.`
    },

    {
      type: "text",
      value: `### Mental Model: Packages vs Modules

- **Package**: A directory of Go files with the same \`package\` name
- **Module**: A versioned collection of packages with a \`go.mod\` file

Packages organize code.
Modules organize projects.`
    },

    {
      type: "text",
      value: `### Packages in Go

Rules:
- Every Go file starts with a \`package\` declaration
- Files in the same directory must share the same package name
- Package names should be short and meaningful`
    },

    {
      type: "code",
      language: "go",
      value: `package mathutils

func Add(a, b int) int {
    return a + b
}`,
      runnable: false
    },

    {
      type: "text",
      value: `### Importing Packages

Packages are imported using their module path plus directory name.`
    },

    {
      type: "code",
      language: "go",
      value: `package main

import (
    "fmt"
    "myproject/mathutils"
)

func main() {
    fmt.Println(mathutils.Add(2, 3))
}`,
      runnable: false
    },

    {
      type: "text",
      value: `### Export Rules (Critical)

Go uses capitalization for visibility:
- Capitalized identifiers are **exported**
- Lowercase identifiers are **package-private**

There are no access modifiers like public/private.`
    },

    {
      type: "text",
      value: `### What Is a Go Module?

A Go module:
- Defines the module path
- Locks dependency versions
- Enables reproducible builds

Every modern Go project should use modules.`
    },

    {
      type: "code",
      language: "bash",
      value: `go mod init github.com/username/myproject`,
      runnable: false
    },

    {
      type: "text",
      value: `### The go.mod File

\`go.mod\` records:
- Module name
- Go version
- Required dependencies

This file is **authoritative** for builds.`
    },

    {
      type: "text",
      value: `### Dependency Resolution

- \`go get\` adds or upgrades dependencies
- \`go mod tidy\` removes unused dependencies
- \`go.sum\` verifies dependency integrity`
    },

    {
      type: "text",
      value: `### Import Paths and Versioning

Example:
\`github.com/gorilla/mux\`

Major version changes require path changes (v2, v3, etc.), preventing silent breaking changes.`
    },

    {
      type: "text",
      value: `### Internal Packages (Encapsulation)

The \`internal/\` directory restricts access to packages:
- Only code within the parent module can import them
- Enforces architectural boundaries`
    },

    {
      type: "text",
      value: `### Common Anti-Patterns

❌ Dumping all code into \`main\`  
❌ Circular package dependencies  
❌ Copy-pasting code instead of packaging  
❌ Ignoring \`go mod tidy\`  

These destroy long-term maintainability.`
    },

    {
      type: "text",
      value: `### Real-World Mapping (Cybercode Context)

- **EduLabs**: Course, user, progress packages
- **C3 Cloud**: Scheduler, compute, network packages
- **DigitalFort**: Detection, correlation, response packages`
    },

    {
      type: "text",
      value: `### Applied Lab

1. Initialize a module
2. Create two packages (e.g., \`utils\`, \`services\`)
3. Export only necessary functions
4. Import and use them from \`main\``
    },

    {
      type: "text",
      value: `### Reflection Questions

1. Why does Go avoid access modifiers?
2. Why is module versioning strict?
3. How do packages enforce architecture?`
    },

    {
      type: "text",
      value: `### Advancement Hook

Next lesson introduces **Go web servers**, where packages and modules become essential for clean API architecture.`
    }
  ]
},
{
  slug: "go-web-server",
  title: "Go Web Server: net/http Fundamentals, Handlers, and Concurrency Model",
  content: [
    {
      type: "text",
      value: `### Why This Lesson Exists

Web servers are the backbone of modern applications.
In Go, building a web server does not require heavy frameworks.
The standard library provides a **fast, concurrent, and production-proven HTTP server** through \`net/http\`.`
    },

    {
      type: "text",
      value: `### Mental Model: How Go Handles HTTP Requests

Key facts:
- Each incoming HTTP request is handled in its **own goroutine**
- You do not manage threads explicitly
- Concurrency is automatic and scalable

This design allows Go servers to handle thousands of concurrent connections efficiently.`
    },

    {
      type: "text",
      value: `### The Handler Concept

At the core of Go's HTTP server is the handler abstraction.

A handler is any type that implements:
\`ServeHTTP(http.ResponseWriter, *http.Request)\`

Functions can also act as handlers using \`http.HandleFunc\`.`
    },

    {
      type: "code",
      language: "go",
      value: `package main

import (
    "fmt"
    "net/http"
)

func homeHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintln(w, "Welcome to Cybercode Go Web Server")
}

func main() {
    http.HandleFunc("/", homeHandler)
    http.ListenAndServe(":8080", nil)
}`,
      runnable: true
    },

    {
      type: "text",
      value: `### What Happens Internally?

1. TCP connection is accepted
2. HTTP request is parsed
3. A goroutine is spawned
4. The handler function is executed
5. Response is written back to the client

All of this is managed internally by the Go runtime and \`net/http\`.`
    },

    {
      type: "text",
      value: `### http.ResponseWriter

\`http.ResponseWriter\` is used to:
- Set HTTP headers
- Write status codes
- Write response bodies

Important rule:
Headers must be set **before** writing the response body.`
    },

    {
      type: "code",
      language: "go",
      value: `func statusHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "text/plain")
    w.WriteHeader(http.StatusOK)
    w.Write([]byte("Service is running"))
}`,
      runnable: false
    },

    {
      type: "text",
      value: `### The http.Request Object

The \`*http.Request\` contains:
- URL path and query parameters
- HTTP method (GET, POST, etc.)
- Headers
- Body
- Context for cancellation and deadlines

Understanding this structure is essential for building APIs.`
    },

    {
      type: "text",
      value: `### Basic Routing

The default HTTP multiplexer routes requests based on URL paths.
Complex routing logic can be built without external frameworks.`
    },

    {
      type: "code",
      language: "go",
      value: `func apiHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodGet {
        http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
        return
    }
    fmt.Fprintln(w, "API response")
}`,
      runnable: false
    },

    {
      type: "text",
      value: `### Concurrency and Safety

Because each request runs concurrently:
- Shared variables must be protected
- Use mutexes or channels for shared state
- Avoid long blocking operations in handlers

Concurrency bugs often appear only under load.`
    },

    {
      type: "text",
      value: `### Common Production Mistakes

❌ Using global mutable state without synchronization  
❌ Blocking on I/O inside handlers  
❌ No request timeouts  
❌ Ignoring errors from \`ListenAndServe\`  

These issues reduce reliability and scalability.`
    },

    {
      type: "text",
      value: `### Real-World Mapping (Cybercode Context)

- **EduLabs**: Course APIs, user dashboards
- **C3 Cloud**: Control-plane endpoints
- **DigitalFort**: Event ingestion and alert APIs`
    },

    {
      type: "text",
      value: `### Applied Lab

1. Create a web server with two endpoints: \`/\` and \`/health\`
2. Return different responses based on request method
3. Run concurrent requests and observe behavior`
    },

    {
      type: "text",
      value: `### Reflection Questions

1. Why does Go not require async/await for HTTP?
2. Why must handlers be concurrency-safe?
3. How does Go scale web servers naturally?`
    },

    {
      type: "text",
      value: `### Advancement Hook

Next lesson introduces **database interaction**, where web handlers connect to persistent storage safely and efficiently.`
    }
  ]
},
{
  slug: "working-with-databases",
  title: "Working with Databases in Go: database/sql, Connection Pools, and Safe Access",
  content: [
    {
      type: "text",
      value: `### Why This Lesson Exists

Persistent data is central to real applications.
In Go, database access is designed to be:
- Explicit
- Efficient
- Safe under concurrency

The \`database/sql\` package provides a **standard abstraction layer** over SQL databases such as PostgreSQL, MySQL, and SQLite.`
    },

    {
      type: "text",
      value: `### Mental Model: database/sql Is a Pool, Not a Connection

A common misconception:
- \`sql.DB\` is NOT a single database connection

Reality:
- \`sql.DB\` manages a **pool of connections**
- It handles opening, closing, and reusing connections automatically
- It is safe for concurrent use`
    },

    {
      type: "text",
      value: `### Choosing a Driver

\`database/sql\` works with database-specific drivers.
Examples:
- PostgreSQL → \`github.com/lib/pq\` or \`github.com/jackc/pgx/v5/stdlib\`
- MySQL → \`github.com/go-sql-driver/mysql\`
- SQLite → \`github.com/mattn/go-sqlite3\`

Drivers register themselves via blank imports.`
    },

    {
      type: "code",
      language: "go",
      value: `package main

import (
    "database/sql"
    "fmt"
    _ "github.com/mattn/go-sqlite3"
)

func main() {
    db, err := sql.Open("sqlite3", "example.db")
    if err != nil {
        fmt.Println("Open error:", err)
        return
    }
    defer db.Close()

    fmt.Println("Database initialized")
}`,
      runnable: false
    },

    {
      type: "text",
      value: `### Opening vs Pinging

- \`sql.Open()\` does NOT verify the connection
- \`db.Ping()\` confirms the database is reachable

Always ping in production startup.`
    },

    {
      type: "code",
      language: "go",
      value: `if err := db.Ping(); err != nil {
    fmt.Println("Database not reachable:", err)
    return
}`,
      runnable: false
    },

    {
      type: "text",
      value: `### Executing Statements

Use \`Exec\` for statements that do not return rows:
- CREATE
- INSERT
- UPDATE
- DELETE`
    },

    {
      type: "code",
      language: "go",
      value: `_, err := db.Exec(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)"
)
if err != nil {
    fmt.Println("Table creation failed:", err)
}`,
      runnable: false
    },

    {
      type: "text",
      value: `### Querying Data

Use \`Query\` or \`QueryRow\` to fetch data.
Always close rows to avoid leaks.`
    },

    {
      type: "code",
      language: "go",
      value: `rows, err := db.Query("SELECT id, name FROM users")
if err != nil {
    return
}
defer rows.Close()

for rows.Next() {
    var id int
    var name string
    rows.Scan(&id, &name)
}`,
      runnable: false
    },

    {
      type: "text",
      value: `### Prepared Statements

Prepared statements:
- Improve performance
- Prevent SQL injection
- Are reusable

Use them for repeated queries.`
    },

    {
      type: "code",
      language: "go",
      value: `stmt, _ := db.Prepare("INSERT INTO users(name) VALUES(?)")
defer stmt.Close()

stmt.Exec("Cybercode")`,
      runnable: false
    },

    {
      type: "text",
      value: `### Connection Pool Tuning

Critical settings:
- \`SetMaxOpenConns\`
- \`SetMaxIdleConns\`
- \`SetConnMaxLifetime\`

Poor tuning causes slowdowns and outages.`
    },

    {
      type: "text",
      value: `### Concurrency and Safety

- \`sql.DB\` is concurrency-safe
- Transactions are NOT shared across goroutines
- Each request should use its own transaction context`
    },

    {
      type: "text",
      value: `### Common Failure Scenarios

❌ Not closing rows  
❌ Ignoring scan errors  
❌ Creating a new DB per request  
❌ Hardcoding credentials  

These issues surface under load.`
    },

    {
      type: "text",
      value: `### Real-World Mapping (Cybercode Context)

- **EduLabs**: Users, courses, progress
- **C3 Cloud**: Resource metadata
- **DigitalFort**: Events and incidents`
    },

    {
      type: "text",
      value: `### Applied Lab

1. Create a database table
2. Insert sample records
3. Query and print results
4. Add proper error handling`
    },

    {
      type: "text",
      value: `### Reflection Questions

1. Why is \`sql.DB\` a pool and not a connection?
2. Why must rows always be closed?
3. How do prepared statements improve security?`
    },

    {
      type: "text",
      value: `### Advancement Hook

Next lesson introduces **ORM usage with GORM**, which builds on top of \`database/sql\` while trading control for productivity.`
    }
  ]
},
{
  slug: "using-gorm-with-go",
  title: "Using GORM in Go: ORM Fundamentals, Trade-offs, and Production Patterns",
  content: [
    {
      type: "text",
      value: `### Why This Lesson Exists

While \`database/sql\` gives maximum control, it also requires significant boilerplate.
ORMs like **GORM** trade some control for:
- Faster development
- Cleaner data models
- Reduced repetitive SQL

This lesson teaches **when and how** to use GORM responsibly in production systems.`
    },

    {
      type: "text",
      value: `### Mental Model: ORM Is an Abstraction Layer

GORM:
- Sits on top of \`database/sql\`
- Generates SQL for you
- Maps Go structs to database tables

Important: ORMs do NOT replace understanding SQL.
They automate it.`
    },

    {
      type: "text",
      value: `### Installing GORM

GORM is modular: core + driver.
Always choose the driver explicitly.`
    },

    {
      type: "code",
      language: "bash",
      value: `go get -u gorm.io/gorm
go get -u gorm.io/driver/sqlite`,
      runnable: false
    },

    {
      type: "text",
      value: `### Defining Models

Models are plain Go structs.
GORM uses reflection and struct tags to map them to tables.`
    },

    {
      type: "code",
      language: "go",
      value: `package main

import (
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"
)

type Student struct {
    ID   uint
    Name string
    Age  int
}

func main() {
    db, err := gorm.Open(sqlite.Open("students.db"), &gorm.Config{})
    if err != nil {
        panic("failed to connect database")
    }

    db.AutoMigrate(&Student{})
}`,
      runnable: false
    },

    {
      type: "text",
      value: `### Auto Migration

\`AutoMigrate\`:
- Creates tables if missing
- Adds new columns
- Does NOT delete or rename columns

Safe for development, cautious use in production.`
    },

    {
      type: "text",
      value: `### Creating Records

GORM uses expressive methods for CRUD operations.`
    },

    {
      type: "code",
      language: "go",
      value: `db.Create(&Student{Name: "Asha", Age: 21})`,
      runnable: false
    },

    {
      type: "text",
      value: `### Querying Records

Queries are chainable and readable.`
    },

    {
      type: "code",
      language: "go",
      value: `var students []Student
db.Find(&students)

var one Student
db.First(&one, 1)`,
      runnable: false
    },

    {
      type: "text",
      value: `### Updating Records`
    },

    {
      type: "code",
      language: "go",
      value: `db.Model(&Student{}).Where("id = ?", 1).Update("age", 22)`,
      runnable: false
    },

    {
      type: "text",
      value: `### Deleting Records`
    },

    {
      type: "code",
      language: "go",
      value: `db.Delete(&Student{}, 1)`,
      runnable: false
    },

    {
      type: "text",
      value: `### Transactions in GORM

Transactions protect data integrity.
They must be explicit.`
    },

    {
      type: "code",
      language: "go",
      value: `err := db.Transaction(func(tx *gorm.DB) error {
    if err := tx.Create(&Student{Name: "Bob", Age: 25}).Error; err != nil {
        return err
    }
    return nil
})`,
      runnable: false
    },

    {
      type: "text",
      value: `### Performance & Control Trade-offs

Pros:
- Faster development
- Cleaner code

Cons:
- Hidden SQL
- Harder query optimization
- Possible N+1 query problems

Critical paths should still be profiled.`
    },

    {
      type: "text",
      value: `### Common Anti-Patterns

❌ Using ORM without understanding SQL  
❌ Auto-migrating blindly in production  
❌ Ignoring generated queries  
❌ Using ORM for complex analytics  

ORMs are tools, not magic.`
    },

    {
      type: "text",
      value: `### Real-World Mapping (Cybercode Context)

- **EduLabs**: User profiles, enrollments
- **C3 Cloud**: Resource metadata
- **DigitalFort**: Incident records and alerts`
    },

    {
      type: "text",
      value: `### Applied Lab

1. Define a model
2. Auto-migrate schema
3. Perform full CRUD operations
4. Wrap write operations in transactions`
    },

    {
      type: "text",
      value: `### Reflection Questions

1. When should raw SQL be preferred over ORM?
2. Why is AutoMigrate risky in production?
3. How do ORMs affect performance debugging?`
    },

    {
      type: "text",
      value: `### Advancement Hook

Next lesson introduces **REST API construction**, connecting web handlers with database logic cleanly and safely.`
    }
  ]
},
{
  slug: "rest-api-with-go",
  title: "Building REST APIs in Go: Design, JSON, Routing, and Clean Architecture",
  content: [
    {
      type: "text",
      value: `### Why This Lesson Exists

REST APIs are the backbone of modern platforms.
They connect:
- Frontend applications
- Mobile apps
- Microservices
- External integrations

In Go, REST APIs are built by **composing small, explicit primitives** — not by relying on heavy frameworks.`
    },

    {
      type: "text",
      value: `### Mental Model: REST Is About Resources

REST focuses on **resources**, not actions.

Examples:
- /users
- /courses
- /projects

HTTP methods describe actions:
- GET → Read
- POST → Create
- PUT / PATCH → Update
- DELETE → Remove`
    },

    {
      type: "text",
      value: `### Basic REST Handler Structure

A REST handler typically:
1. Validates HTTP method
2. Parses input (JSON / URL params)
3. Executes business logic
4. Returns JSON response with status code`
    },

    {
      type: "code",
      language: "go",
      value: `package main

import (
    "encoding/json"
    "net/http"
)

type Course struct {
    ID    int    \`json:"id"\`
    Title string \`json:"title"\`
}

func getCourses(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodGet {
        http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
        return
    }

    courses := []Course{
        {ID: 1, Title: "Golang Fundamentals"},
        {ID: 2, Title: "Microservices with Go"},
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(courses)
}

func main() {
    http.HandleFunc("/courses", getCourses)
    http.ListenAndServe(":8080", nil)
}`,
      runnable: true
    },

    {
      type: "text",
      value: `### Status Codes Matter

Correct status codes communicate intent:
- 200 OK
- 201 Created
- 400 Bad Request
- 404 Not Found
- 500 Internal Server Error

APIs that misuse status codes are hard to debug and integrate.`
    },

    {
      type: "text",
      value: `### Handling POST Requests (Create Resource)

POST requests typically:
- Read JSON body
- Validate fields
- Store data
- Return created resource`
    },

    {
      type: "code",
      language: "go",
      value: `func createCourse(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
        return
    }

    var course Course
    err := json.NewDecoder(r.Body).Decode(&course)
    if err != nil {
        http.Error(w, "Invalid JSON", http.StatusBadRequest)
        return
    }

    course.ID = 3 // simulated DB insert

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(course)
}`,
      runnable: false
    },

    {
      type: "text",
      value: `### Routing and Separation of Concerns

As APIs grow:
- Handlers must be separated by resource
- Business logic must not live inside handlers
- Database access should be abstracted

Clean separation prevents monolithic handlers.`
    },

    {
      type: "text",
      value: `### JSON Error Responses

APIs should return structured errors, not plain text.`
    },

    {
      type: "code",
      language: "go",
      value: `type APIError struct {
    Error string \`json:"error"\`
}

func writeError(w http.ResponseWriter, msg string, code int) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(code)
    json.NewEncoder(w).Encode(APIError{Error: msg})
}`,
      runnable: false
    },

    {
      type: "text",
      value: `### Context and Timeouts

Every HTTP request carries a context.
Use it to:
- Handle cancellation
- Enforce timeouts
- Stop DB queries when clients disconnect`
    },

    {
      type: "text",
      value: `### Common REST API Mistakes

❌ Business logic inside handlers  
❌ No input validation  
❌ Returning inconsistent JSON  
❌ Ignoring request context  
❌ Mixing HTTP and DB concerns  

These lead to fragile APIs.`
    },

    {
      type: "text",
      value: `### Real-World Mapping (Cybercode Context)

- **EduLabs**: Courses, enrollments, progress APIs
- **C3 Cloud**: Resource provisioning APIs
- **DigitalFort**: Event ingestion and alert APIs`
    },

    {
      type: "text",
      value: `### Applied Lab

1. Create REST endpoints for a resource (GET, POST)
2. Return proper JSON responses
3. Use correct HTTP status codes
4. Separate handler and logic layers`
    },

    {
      type: "text",
      value: `### Reflection Questions

1. Why is REST resource-oriented?
2. Why must handlers stay thin?
3. How do status codes affect API usability?`
    },

    {
      type: "text",
      value: `### Phase Completion Note

This completes **PHASE 5 — Modules, Web & Persistence**.
Next phase focuses on **quality, testing, deployment, and production readiness**.`
    }
  ]
},
{
  slug: "unit-testing-in-go",
  title: "Unit Testing in Go: testing Package, Test Design, and Reliability",
  content: [
    {
      type: "text",
      value: `### Why This Lesson Exists

As systems grow, untested code becomes fragile.
Unit testing ensures:
- Correctness of logic
- Confidence during refactoring
- Early detection of bugs

Go treats testing as a **first-class citizen**, built directly into the language toolchain.`
    },

    {
      type: "text",
      value: `### Mental Model: Tests as Executable Specifications

A test:
- Describes expected behavior
- Documents how code should work
- Fails loudly when assumptions break

Well-written tests act as living documentation.`
    },

    {
      type: "text",
      value: `### The testing Package

Go provides the \`testing\` package for writing tests.
Key characteristics:
- No external libraries required
- Simple conventions
- Fast execution`
    },

    {
      type: "text",
      value: `### Writing Your First Test

Rules:
- Test files end with \`_test.go\`
- Test functions start with \`Test\`
- Each test receives \`*testing.T\``
    },

    {
      type: "code",
      language: "go",
      value: `package mathutils

func Add(a, b int) int {
    return a + b
}`,
      runnable: false
    },

    {
      type: "code",
      language: "go",
      value: `package mathutils

import "testing"

func TestAdd(t *testing.T) {
    result := Add(2, 3)
    expected := 5

    if result != expected {
        t.Errorf("expected %d, got %d", expected, result)
    }
}`,
      runnable: false
    },

    {
      type: "text",
      value: `### Running Tests

Tests are executed using:

\`\`\`
go test
\`\`\`

Go automatically discovers and runs all test files in the package.`
    },

    {
      type: "text",
      value: `### Table-Driven Tests (Professional Pattern)

Table-driven tests allow testing multiple cases cleanly and consistently.`
    },

    {
      type: "code",
      language: "go",
      value: `func TestAdd_TableDriven(t *testing.T) {
    tests := []struct {
        name     string
        a, b     int
        expected int
    }{
        {"both positive", 2, 3, 5},
        {"with zero", 0, 5, 5},
        {"both negative", -2, -3, -5},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            if result := Add(tt.a, tt.b); result != tt.expected {
                t.Errorf("expected %d, got %d", tt.expected, result)
            }
        })
    }
}`,
      runnable: false
    },

    {
      type: "text",
      value: `### Test Failures and Debugging

- \`t.Errorf\` reports an error and continues
- \`t.Fatalf\` reports an error and stops the test immediately

Use failures to pinpoint incorrect assumptions.`
    },

    {
      type: "text",
      value: `### What Should Be Unit Tested?

✅ Business logic  
✅ Data transformations  
✅ Edge cases  

❌ External systems (DB, network)  
❌ Framework internals  

Unit tests should be fast and deterministic.`
    },

    {
      type: "text",
      value: `### Testing Web and Database Code

For now:
- Keep handlers thin
- Test logic separately from HTTP and DB
- Integration tests come later

This separation enables reliable unit tests.`
    },

    {
      type: "text",
      value: `### Common Testing Anti-Patterns

❌ No tests at all  
❌ Tests dependent on execution order  
❌ Hardcoded environment dependencies  
❌ Overly complex test setup  

Bad tests are worse than no tests.`
    },

    {
      type: "text",
      value: `### Real-World Mapping (Cybercode Context)

- **EduLabs**: Course logic validation
- **C3 Cloud**: Resource calculation correctness
- **DigitalFort**: Detection rule accuracy`
    },

    {
      type: "text",
      value: `### Applied Lab

1. Write tests for a utility function
2. Add table-driven test cases
3. Intentionally break logic and observe test failures
4. Fix the implementation and rerun tests`
    },

    {
      type: "text",
      value: `### Reflection Questions

1. Why are table-driven tests preferred?
2. Why should unit tests avoid external dependencies?
3. How do tests support refactoring?`
    },

    {
      type: "text",
      value: `### Advancement Hook

Next lesson focuses on **deployment and best practices**, covering how tested Go applications are built, configured, and shipped to production.`
    }
  ]
},
{
  slug: "go-deployment-and-best-practices",
  title: "Go Deployment & Best Practices: Build, Configure, Secure, and Operate",
  content: [
    {
      type: "text",
      value: `### Why This Lesson Exists

Writing correct code is only half the job.
Production systems must be:
- Buildable
- Configurable
- Observable
- Secure
- Maintainable

Go’s tooling is designed to support **simple, reliable deployment pipelines** with minimal runtime dependencies.`
    },

    {
      type: "text",
      value: `### Mental Model: Build Once, Run Anywhere

Go compiles to a **single native binary**.
This binary:
- Contains the runtime
- Has no external dependencies
- Starts fast
- Is easy to deploy

This is a major operational advantage of Go.`
    },

    {
      type: "text",
      value: `### Building a Production Binary

The basic build command:

\`\`\`
go build -o app
\`\`\`

For production:
- Use explicit output names
- Build in clean environments
- Avoid building on the target server`
    },

    {
      type: "text",
      value: `### Cross-Compilation

Go supports cross-compilation using environment variables:

\`\`\`
GOOS=linux GOARCH=amd64 go build -o app
\`\`\`

This allows building Linux binaries from macOS or Windows.`
    },

    {
      type: "text",
      value: `### Environment-Based Configuration

Never hardcode configuration values.
Use environment variables for:
- Database URLs
- API keys
- Ports
- Feature flags`
    },

    {
      type: "code",
      language: "go",
      value: `package main

import (
    "fmt"
    "os"
)

func main() {
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }
    fmt.Println("Starting on port", port)
}`,
      runnable: false
    },

    {
      type: "text",
      value: `### Logging Best Practices

Logs are your primary production debugging tool.

Guidelines:
- Log errors with context
- Avoid logging sensitive data
- Use structured logs for machines, readable logs for humans`
    },

    {
      type: "text",
      value: `### Graceful Shutdown

Production servers must shut down cleanly.
Graceful shutdown ensures:
- In-flight requests complete
- Database connections close properly
- Data is not corrupted`
    },

    {
      type: "text",
      value: `### Dependency Management Hygiene

- Commit \`go.mod\` and \`go.sum\`
- Run \`go mod tidy\` regularly
- Avoid vendoring unless required

Reproducible builds depend on clean dependencies.`
    },

    {
      type: "text",
      value: `### Security Fundamentals

Baseline security practices:
- Do not run as root
- Validate all inputs
- Keep dependencies updated
- Use TLS in production
- Store secrets securely

Security is a process, not a checkbox.`
    },

    {
      type: "text",
      value: `### Operational Readiness Checklist

Before deployment:
- All tests passing
- Configuration externalized
- Health endpoints available
- Logs and metrics reviewed
- Failure scenarios considered`
    },

    {
      type: "text",
      value: `### Common Deployment Mistakes

❌ Hardcoded secrets  
❌ No health checks  
❌ No logging strategy  
❌ No rollback plan  

Most outages are operational, not code-related.`
    },

    {
      type: "text",
      value: `### Real-World Mapping (Cybercode Context)

- **EduLabs**: API services deployed as binaries
- **C3 Cloud**: Control-plane services with strict uptime
- **DigitalFort**: Security services requiring safe shutdowns`
    },

    {
      type: "text",
      value: `### Applied Lab

1. Build a Go binary for Linux
2. Run it using environment-based configuration
3. Add basic logging
4. Simulate shutdown and ensure cleanup`
    },

    {
      type: "text",
      value: `### Reflection Questions

1. Why is Go’s single-binary model operationally powerful?
2. Why should configuration never be hardcoded?
3. What makes a service production-ready?`
    },

    {
      type: "text",
      value: `### Advancement Hook

The final lesson brings everything together in a **capstone microservice project**, applying all concepts from foundations to deployment.`
    }
  ]
},
{
  slug: "final-project-golang-microservice",
  title: "Capstone Project: Designing, Building, and Deploying a Production-Ready Go Microservice",
  content: [
    {
      type: "text",
      value: `### Why This Capstone Exists

This project consolidates everything you’ve learned:
- Go fundamentals
- Concurrency
- File & JSON I/O
- Modules and packages
- Web servers and REST APIs
- Database access and ORM
- Testing and deployment

The goal is not just to build code, but to **think like a backend systems engineer**.`
    },

    {
      type: "text",
      value: `### Project Overview

You will build a **User Management Microservice** with the following characteristics:
- RESTful API
- JSON-based communication
- Persistent storage
- Clean architecture
- Test coverage
- Production-ready configuration`
    },

    {
      type: "text",
      value: `### Functional Requirements

The service must support:
- Create a user
- List all users
- Fetch a user by ID
- Update a user
- Delete a user

All operations must follow REST conventions and return proper HTTP status codes.`
    },

    {
      type: "text",
      value: `### Technical Stack (Locked)

- Language: Go
- HTTP: net/http
- Data format: JSON
- Database: SQLite or PostgreSQL
- ORM: GORM
- Testing: testing package
- Configuration: Environment variables`
    },

    {
      type: "text",
      value: `### Suggested Project Structure

\`\`\`
/cmd/server
/internal
  /handlers
  /services
  /models
  /repository
/config
/go.mod
\`\`\`

This structure enforces separation of concerns and scalability.`
    },

    {
      type: "text",
      value: `### API Endpoints (Example)

- POST   /users
- GET    /users
- GET    /users/{id}
- PUT    /users/{id}
- DELETE /users/{id}

Endpoints must:
- Validate input
- Handle errors gracefully
- Return consistent JSON responses`
    },

    {
      type: "text",
      value: `### Data Model Example

A User entity may include:
- ID
- Name
- Email
- CreatedAt

Ensure proper JSON tags and database mappings.`
    },

    {
      type: "text",
      value: `### Error Handling Strategy

- Validate request data early
- Return structured JSON errors
- Avoid leaking internal error details
- Log errors with sufficient context`
    },

    {
      type: "text",
      value: `### Concurrency & Safety

- Handlers run concurrently
- Database access must be safe
- Avoid global mutable state
- Use context for request-scoped operations`
    },

    {
      type: "text",
      value: `### Testing Expectations

At minimum:
- Unit tests for service logic
- Table-driven tests
- Tests must not depend on live databases

Testing is mandatory, not optional.`
    },

    {
      type: "text",
      value: `### Deployment Requirements

- Build a single binary
- Use environment variables for configuration
- Provide a health endpoint
- Ensure graceful shutdown behavior`
    },

    {
      type: "text",
      value: `### Evaluation Criteria

Your project will be evaluated on:
- Code structure and clarity
- Correct use of Go idioms
- Error handling and safety
- Test coverage and quality
- Deployment readiness`
    },

    {
      type: "text",
      value: `### Stretch Goals (Optional)

- Add pagination
- Add request logging middleware
- Add authentication stub
- Containerize with Docker`
    },

    {
      type: "text",
      value: `### Real-World Mapping (Cybercode Context)

This microservice mirrors:
- **EduLabs** backend services
- **C3 Cloud** control-plane components
- **DigitalFort** event and incident APIs`
    },

    {
      type: "text",
      value: `### Final Reflection

If you can build, test, and deploy this service confidently,
you are no longer “learning Go” —  
you are **engineering with Go**.`
    }
  ]
},
];
export default golangLessons;
