const devopsDockerKubernetes = [
    {
      slug: "intro-to-docker",
      title: "Introduction to Docker",
      content: [
        {
          type: "text",
          value:
            "Docker allows you to containerize applications for easy deployment."
        },
        {
          type: "code",
          language: "bash",
          value: `docker run hello-world`
        }
      ]
    },
    {
      slug: "kubernetes-basics",
      title: "Kubernetes Basics",
      content: [
        {
          type: "text",
          value:
            "Kubernetes automates container orchestration at scale."
        }
      ]
    }
  ];

  export default devopsDockerKubernetes;