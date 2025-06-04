const versionControlGitGithub = [
    {
      slug: "intro-to-git",
      title: "Introduction to Git",
      content: [
        {
          type: "text",
          value: "Git is a distributed version control system to track code changes."
        },
        {
          type: "code",
          language: "bash",
          value: `git init
git add .
git commit -m "Initial commit"`
        }
      ]
    },
    {
      slug: "working-with-branches",
      title: "Working with Branches",
      content: [
        {
          type: "text",
          value:
            "Branches let you work on features separately without affecting the main code."
        },
        {
          type: "code",
          language: "bash",
          value: `git branch feature-xyz
git checkout feature-xyz
git commit -m "Add new feature"`
        }
      ]
    },
    {
      slug: "github-basics",
      title: "GitHub Basics",
      content: [
        {
          type: "text",
          value: "GitHub hosts your Git repositories online and enables collaboration."
        },
        {
          type: "code",
          language: "bash",
          value: `git remote add origin https://github.com/yourusername/repo.git
git push -u origin main`
        }
      ]
    }
  ];

export default versionControlGitGithub;