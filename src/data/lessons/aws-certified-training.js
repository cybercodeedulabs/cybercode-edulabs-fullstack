// src/data/courses/aws-certified-training.js

const awsCertifiedTraining = [
  {
    slug: "aws-overview",
    title: "AWS Overview",
    content: [
      {
        type: "text",
        value: `Amazon Web Services (AWS) is the world’s leading cloud platform providing on-demand infrastructure, storage, networking, machine learning, and database services. It allows organizations to innovate faster and scale globally.`
      },
      {
        type: "image",
        value: "/lessonimages/aws/aws-global-infrastructure.png",
        alt: "AWS Global Infrastructure Map"
      },
      {
        type: "text",
        value: `🧭 **Key AWS Global Concepts:**
- **Region** – Geographical area (e.g., Mumbai, N. Virginia)
- **Availability Zone (AZ)** – Independent data centers within a region
- **Edge Locations** – Used for CDN caching via CloudFront

AWS offers over 200 services grouped into compute, storage, database, networking, AI/ML, and analytics.`
      },
      {
        type: "text",
        value: `✅ **Exercise:** Identify 3 AWS services relevant to your career goal (e.g., EC2 for DevOps, SageMaker for AI).`
      }
    ]
  },
  {
    slug: "setting-up-aws-account",
    title: "Setting Up AWS Account",
    content: [
      {
        type: "text",
        value: `To start using AWS, you need an account and a user with IAM permissions for secure access.`
      },
      {
        type: "text",
        value: `### 🧩 Steps:
1. Visit [aws.amazon.com](https://aws.amazon.com)
2. Create a new account using email and card verification
3. Log in as **Root User**, then create an **IAM Admin User**
4. Install and configure AWS CLI:
   \`\`\`bash
   aws configure
   \`\`\`
5. Enter Access Key, Secret, Region, and Output format`
      },
      {
        type: "text",
        value: `✅ **Exercise:** Verify CLI setup by running:
\`\`\`bash
aws s3 ls
\`\`\`
If it lists buckets (or none), you’re connected successfully.`
      }
    ]
  },
  {
    slug: "ec2-basics",
    title: "EC2 Basics",
    content: [
      {
        type: "text",
        value: `Amazon EC2 (Elastic Compute Cloud) provides scalable virtual servers in the cloud. You can choose instance types, configure networking, and control cost through on-demand or spot pricing.`
      },
      {
        type: "code",
        language: "bash",
        value: `# Launch an EC2 instance (CLI)
aws ec2 run-instances \\
  --image-id ami-12345678 \\
  --instance-type t2.micro \\
  --key-name mykeypair`,
        runnable: false
      },
      {
        type: "text",
        value: `🧠 **Concepts to Remember:**
- **AMI (Amazon Machine Image):** Template for your instance
- **Instance Type:** Hardware config (CPU, RAM)
- **Security Group:** Virtual firewall rules
- **Elastic IP:** Static public IP mapping

✅ **Exercise:** Launch a t2.micro instance in AWS console and SSH into it using your key pair.`
      }
    ]
  },
  {
    slug: "s3-and-storage",
    title: "S3 and Storage Services",
    content: [
      {
        type: "text",
        value: `Amazon S3 is an object storage service built for high scalability and durability.`
      },
      {
        type: "code",
        language: "bash",
        value: `aws s3 mb s3://my-cybercode-bucket
aws s3 cp file.txt s3://my-cybercode-bucket/`,
        runnable: false
      },
      {
        type: "text",
        value: `📦 **S3 Storage Classes:**
- Standard (frequent access)
- Infrequent Access (IA)
- Glacier (archival)
- Intelligent-Tiering (auto optimization)

✅ **Exercise:** Create a versioned S3 bucket and enable lifecycle rules for automatic archival.`
      }
    ]
  },
  {
    slug: "networking-with-vpc",
    title: "Networking with VPC",
    content: [
      {
        type: "text",
        value: `A Virtual Private Cloud (VPC) is your isolated network within AWS. It allows full control of IP addressing, subnets, and routing.`
      },
      {
        type: "image",
        value: "/lessonimages/aws/vpc-diagram.png",
        alt: "AWS VPC Architecture"
      },
      {
        type: "text",
        value: `### Key Components:
- Subnets (Public/Private)
- Route Tables
- Internet Gateway
- NAT Gateway
- Security Groups and NACLs

✅ **Exercise:** Create a custom VPC with one public and one private subnet using the VPC Wizard.`
      }
    ]
  },
  {
    slug: "iam-security",
    title: "IAM and Security Best Practices",
    content: [
      {
        type: "text",
        value: `AWS Identity and Access Management (IAM) controls access to AWS resources securely.`
      },
      {
        type: "text",
        value: `### 🧠 Core Concepts:
- Users, Groups, Roles, and Policies
- Managed vs Inline Policies
- Principle of Least Privilege
- MFA and Password Rotation

✅ **Exercise:** Create a role named “EC2AdminRole” and attach the AmazonEC2FullAccess policy.`
      }
    ]
  },
  {
    slug: "load-balancing-and-scaling",
    title: "Load Balancing & Auto Scaling",
    content: [
      {
        type: "text",
        value: `AWS Elastic Load Balancer (ELB) distributes traffic across EC2 instances, and Auto Scaling ensures elasticity under variable load.`
      },
      {
        type: "code",
        language: "bash",
        value: `# Example Auto Scaling setup (CLI)
aws autoscaling create-auto-scaling-group \\
  --auto-scaling-group-name webapp-scaling \\
  --min-size 1 --max-size 3 --desired-capacity 2`,
        runnable: false
      },
      {
        type: "text",
        value: `✅ **Exercise:** Deploy a web app with an Application Load Balancer and configure an Auto Scaling group to handle traffic.`
      }
    ]
  },
  {
    slug: "aws-databases",
    title: "Databases on AWS",
    content: [
      {
        type: "text",
        value: `AWS offers multiple managed database services including RDS (relational), DynamoDB (NoSQL), and Aurora (serverless).`
      },
      {
        type: "text",
        value: `✅ **Exercise:** Launch an RDS instance using MySQL engine and connect using AWS Console Query Editor.`
      }
    ]
  },
  {
    slug: "serverless-on-aws",
    title: "Serverless on AWS (Lambda & API Gateway)",
    content: [
      {
        type: "text",
        value: `AWS Lambda allows you to run code without provisioning servers. Combined with API Gateway, it enables fully serverless APIs.`
      },
      {
        type: "code",
        language: "python",
        value: `def lambda_handler(event, context):
    return {"statusCode": 200, "body": "Hello from AWS Lambda!"}`,
        runnable: false
      },
      {
        type: "text",
        value: `✅ **Exercise:** Create a Lambda function that returns JSON and deploy it using API Gateway.`
      }
    ]
  },
  {
    slug: "monitoring-and-logging",
    title: "Monitoring and Logging with CloudWatch",
    content: [
      {
        type: "text",
        value: `AWS CloudWatch monitors your resources in real-time with metrics, dashboards, and alerts.`
      },
      {
        type: "text",
        value: `✅ **Exercise:** Create a CloudWatch alarm for an EC2 instance when CPU exceeds 80%.`
      }
    ]
  },
  {
    slug: "aws-certification-prep",
    title: "Certification Preparation & Exam Tips",
    content: [
      {
        type: "text",
        value: `This module focuses on preparing you for the AWS Certified Solutions Architect – Associate exam.`
      },
      {
        type: "text",
        value: `📘 **Exam Domains:**
1. Design Resilient Architectures
2. Design High-Performing Architectures
3. Design Secure Applications
4. Design Cost-Optimized Architectures`
      },
      {
        type: "text",
        value: `✅ **Pro Tip:** Practice hands-on labs more than theory. AWS exams emphasize scenario-based understanding.`
      }
    ]
  },
  {
    slug: "capstone-project",
    title: "Capstone Project: Deploy a Scalable Web App on AWS",
    content: [
      {
        type: "text",
        value: `🧠 **Objective:** Combine all your AWS knowledge to deploy a 3-tier web application.`
      },
      {
        type: "text",
        value: `### 🏗️ **Requirements:**
- EC2 Web Tier (Load Balanced)
- RDS Database Tier
- S3 for Static Assets
- CloudWatch Monitoring
- IAM Roles for Access Control`
      },
      {
        type: "text",
        value: `✅ **Deliverable:** A running demo app with architecture diagram and cost estimation.`
      }
    ]
  }
];

export default awsCertifiedTraining;
