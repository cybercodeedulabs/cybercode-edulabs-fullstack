const microservicesGoKubernetes = [
    {
      slug: "microservices-overview",
      title: "Microservices Overview",
      content: [
        {
          type: "text",
          value:
            "Microservices architecture splits an app into small independent services that communicate over APIs."
        }
      ]
    },
    {
      slug: "building-go-services",
      title: "Building Microservices in Go",
      content: [
        {
          type: "text",
          value:
            "Use Go to build fast, lightweight services. Example of a simple HTTP server:"
        },
        {
          type: "code",
          language: "go",
          value: `package main

import (
  "fmt"
  "log"
  "net/http"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
  fmt.Fprintln(w, "Hello from Go Microservice!")
}

func main() {
  http.HandleFunc("/", helloHandler)
  log.Fatal(http.ListenAndServe(":8080", nil))
}`,
runnable: true
        }
      ]
    },
    {
      slug: "deploying-kubernetes",
      title: "Deploying Microservices on Kubernetes",
      content: [
        {
          type: "text",
          value:
            "Use Kubernetes to deploy, scale, and manage containerized microservices."
        }
      ]
    }
  ];

  export default microservicesGoKubernetes;