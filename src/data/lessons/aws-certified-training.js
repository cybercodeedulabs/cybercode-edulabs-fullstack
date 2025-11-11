// src/data/courses/aws-certified-training.js
// Cybercode EduLabs — AWS Certified Training (Career-focused, full course)
// Images referenced below should be placed under: /public/lessonimages/aws/

const awsCertifiedTraining = [
  {
    slug: "aws-overview",
    title: "AWS Overview — Global Infrastructure and Use Cases",
    content: [
      {
        type: "text",
        value:
          "Amazon Web Services (AWS) is the world’s leading cloud platform offering on-demand compute, storage, networking, database and application services. This lesson explains the global footprint and why it matters for production systems."
      },
      {
        type: "image",
        value: "/lessonimages/aws/aws-global-infrastructure.png",
        alt: "AWS Global Infrastructure — Regions, AZs, and Edge Locations"
      },
      {
        type: "text",
        value:
          "Key concepts:\n- Regions: independent geographic areas (e.g., ap-south-1 = Mumbai)\n- Availability Zones (AZs): isolated datacenters inside a region\n- Edge Locations & Local Zones: for CDN and low-latency compute\n\nDesign principle: choose regions/AZs for fault isolation and latency balance."
      },
      {
        type: "image",
        value: "/lessonimages/aws/aws-region-az-diagram.png",
        alt: "Region and Availability Zone concept"
      },
      {
        type: "text",
        value:
          "Real-world example (fintech app): static frontend on S3+CloudFront, backend API on EC2/EKS, RDS for transactional DB, monitoring with CloudWatch. This mix delivers reliability and compliance."
      },
      {
        type: "image",
        value: "/lessonimages/aws/aws-3-tier-architecture.png",
        alt: "3-tier application architecture on AWS"
      },
      {
        type: "text",
        value:
          "Exercise: Identify the nearest AWS region to your city and list three design implications (latency, cost, compliance). Create a small architecture sketch named `cybercode-aws-architecture.png`."
      }
    ]
  },

  {
    slug: "setting-up-aws-account",
    title: "Setting Up AWS Account & Secure Access (CLI + Console)",
    content: [
      {
        type: "text",
        value:
          "This lesson covers account creation best practices, IAM fundamentals, and configuring the AWS CLI for secure automation."
      },
      {
        type: "text",
        value:
          "Steps (high level):\n1. Create AWS account (root user) — complete billing setup\n2. Enable MFA on root user\n3. Create an IAM Admin user and avoid using root for daily tasks\n4. Configure AWS CLI locally with `aws configure`"
      },
      {
        type: "code",
        language: "bash",
        value: `# Configure AWS CLI
aws configure
# Provide Access Key ID, Secret Access Key, default region (e.g. ap-south-1) and output format (json)`,
        runnable: false
      },
      {
        type: "text",
        value:
          "Security best practices:\n- Use IAM roles for services (avoid long-lived keys),\n- Use least-privilege policies,\n- Enable AWS CloudTrail for account auditing."
      },
      {
        type: "text",
        value:
          "Exercise: Create an IAM user (Admin), generate programmatic keys, configure CLI, then run `aws sts get-caller-identity` to confirm identity."
      }
    ]
  },

  {
    slug: "ec2-basics",
    title: "EC2 Basics — Instances, AMIs, Security Groups",
    content: [
      {
        type: "text",
        value:
          "EC2 provides virtual machines (instances). Learn instance types, AMIs, EBS volumes, key pairs, security groups and basic lifecycle (launch, stop, terminate)."
      },
      {
        type: "text",
        value:
          "Important concepts:\n- AMI: image for booting instances\n- Instance types: CPU/memory profiles\n- EBS: attached block storage\n- Security Groups: stateful virtual firewall"
      },
      {
        type: "code",
        language: "bash",
        value: `# Example: Launch an instance (CLI simplified)
aws ec2 run-instances \\
  --image-id ami-0abcdef1234567890 \\
  --count 1 \\
  --instance-type t3.micro \\
  --key-name mykeypair \\
  --security-group-ids sg-0abc1234`,
        runnable: false
      },
      {
        type: "text",
        value:
          "Hands-on exercise: Launch a t3.micro instance in console, connect with SSH using the key pair, install Nginx, and verify the web server."
      },
      {
        type: "text",
        value:
          "Operational notes: use tags for cost allocation, create AMIs for consistent deployments, and use termination protection for critical nodes."
      }
    ]
  },

  {
    slug: "s3-and-storage",
    title: "S3 and Storage Services — Design & Patterns",
    content: [
      {
        type: "text",
        value:
          "S3 is the primary object store in AWS. This lesson covers bucket lifecycle, versioning, storage classes, encryption and common patterns (static hosting, backups)."
      },
      {
        type: "code",
        language: "bash",
        value: `# Create a bucket and copy a file (CLI)
aws s3 mb s3://my-cybercode-bucket
aws s3 cp ./site/index.html s3://my-cybercode-bucket/`,
        runnable: false
      },
      {
        type: "text",
        value:
          "Storage classes: STANDARD, STANDARD_IA, ONEZONE_IA, GLACIER, INTELLIGENT_TIERING. Use lifecycle rules to transition objects to cheaper classes automatically."
      },
      {
        type: "text",
        value:
          "Exercise: Create a versioned S3 bucket, upload two versions of a file, then restore an older version via console."
      }
    ]
  },

  {
    slug: "vpc-and-networking",
    title: "VPC & Networking — Design, Subnets, NAT, Route Tables",
    content: [
      {
        type: "text",
        value:
          "VPC is the foundation of networking on AWS. This lesson explains VPC layout, subnets (public/private), NAT gateway, route tables, internet gateway, security groups and NACLs."
      },
      {
        type: "image",
        value: "/lessonimages/aws/aws-vpc-diagram.png",
        alt: "VPC network architecture"
      },
      {
        type: "text",
        value:
          "Design guideline: place web servers in public subnets, application servers in private subnets with outbound internet via NAT, and databases in private subnets with no public access."
      },
      {
        type: "text",
        value:
          "Exercise: Create a VPC with one public and one private subnet. Launch a bastion host in public subnet and an application EC2 in private subnet; SSH to app via bastion."
      }
    ]
  },

  {
    slug: "iam-and-security-best-practices",
    title: "IAM & Security Best Practices",
    content: [
      {
        type: "text",
        value:
          "IAM controls identity and access. This lesson covers users, groups, roles, policies, and practical examples of role-based access for EC2 and Lambda."
      },
      {
        type: "text",
        value:
          "Key practices:\n- Adopt least privilege\n- Use IAM roles for service access\n- Rotate credentials and enable MFA\n- Use AWS Organizations for multi-account structure"
      },
      {
        type: "text",
        value:
          "Exercise: Create an IAM role for EC2 that allows read-only access to S3 and attach it to an instance. Verify access from the instance without embedding credentials."
      }
    ]
  },

  {
    slug: "load-balancing-auto-scaling",
    title: "Load Balancing & Auto Scaling — HA & Elasticity",
    content: [
      {
        type: "text",
        value:
          "This lesson covers Elastic Load Balancer (Application/Network), target groups, health checks and Auto Scaling Groups (ASG) to ensure applications scale and remain available."
      },
      {
        type: "text",
        value:
          "Practical notes: use health checks to remove unhealthy instances, use ASG scaling policies (CPU, custom metrics), and distribute across AZs for fault tolerance."
      },
      {
        type: "text",
        value:
          "Exercise: Deploy a simple web app behind an Application Load Balancer, configure an ASG with min=1, desired=2, max=4 and simulate load to observe scaling behavior."
      }
    ]
  },

  {
    slug: "databases-on-aws",
    title: "Databases on AWS — RDS, Aurora & DynamoDB",
    content: [
      {
        type: "text",
        value:
          "AWS offers managed relational (RDS/Aurora) and NoSQL (DynamoDB) services. This lesson explains when to use each, backup & restore, read replicas and basic performance tuning."
      },
      {
        type: "text",
        value:
          "Exercise: Launch an RDS MySQL instance with automated backups enabled. Create a read replica and test failover scenarios."
      },
      {
        type: "text",
        value:
          "Design guidance: use Aurora for high throughput OLTP, DynamoDB for serverless NoSQL access patterns, and RDS for traditional relational workloads."
      }
    ]
  },

  {
    slug: "serverless-and-lambda",
    title: "Serverless on AWS — Lambda, API Gateway & Event-Driven Patterns",
    content: [
      {
        type: "text",
        value:
          "Serverless removes server management. This lesson covers Lambda basics, packaging, API Gateway integration, environment variables, and cold-start considerations."
      },
      {
        type: "code",
        language: "python",
        value: `def lambda_handler(event, context):
    return {
        "statusCode": 200,
        "body": "Hello from Lambda"
    }`,
        runnable: false
      },
      {
        type: "text",
        value:
          "Exercise: Create a Lambda that receives HTTP requests via API Gateway and writes a record to DynamoDB."
      }
    ]
  },

  {
    slug: "monitoring-logging-and-troubleshooting",
    title: "Monitoring & Logging — CloudWatch, CloudTrail & X-Ray",
    content: [
      {
        type: "text",
        value:
          "Observability is essential. Use CloudWatch for metrics & alarms, CloudTrail for audit logs, and X-Ray for distributed tracing of requests across microservices."
      },
      {
        type: "text",
        value:
          "Exercise: Create a CloudWatch dashboard showing EC2 CPU, RDS connections, and set an alarm to notify via SNS when CPU > 80% for 5 minutes."
      }
    ]
  },

  {
    slug: "infra-as-code-terraform-on-aws",
    title: "Infrastructure as Code — Terraform on AWS (Intro)",
    content: [
      {
        type: "text",
        value:
          "Automate AWS provisioning with Terraform: write modular, reusable infrastructure code, manage state, and apply changes safely."
      },
      {
        type: "code",
        language: "bash",
        value: `# Example flow
terraform init
terraform plan
terraform apply`,
        runnable: false
      },
      {
        type: "text",
        value:
          "Exercise: Create a Terraform module to provision an S3 bucket and an IAM role; destroy it after validation."
      }
    ]
  },

  {
    slug: "security-hardening-and-cost-optimization",
    title: "Security Hardening & Cost Optimization",
    content: [
      {
        type: "text",
        value:
          "Practical controls for production: enable GuardDuty, AWS Config rules, use KMS for encryption, apply resource tagging for cost tracking and Rightsize instances to reduce spend."
      },
      {
        type: "text",
        value:
          "Exercise: Use the Trusted Advisor or Cost Explorer to find the top 3 cost saving opportunities in a sample account."
      }
    ]
  },

  {
    slug: "certification-prep-and-interview-questions",
    title: "Certification Preparation & Interview Readiness",
    content: [
      {
        type: "text",
        value:
          "Focus areas for Solutions Architect Associate exam and real interviews: high availability, storage patterns, networking, security, and migration strategies."
      },
      {
        type: "text",
        value:
          "Mock interview topics:\n- Design a fault-tolerant web app across AZs\n- How would you migrate an on-premise DB to RDS with minimal downtime?\n- Explain IAM role vs user vs policy"
      },
      {
        type: "text",
        value:
          "Exercise: Attempt 20 scenario-based mock questions and review AWS whitepapers for architecture best practices."
      }
    ]
  },

  {
    slug: "capstone-project",
    title: "Capstone Project — Deploy a Full 3-Tier Application on AWS",
    content: [
      {
        type: "text",
        value:
          "Objective: Build and document a production-like, highly available web application using AWS services covered in the course."
      },
      {
        type: "text",
        value:
          "Deliverables:\n- Architecture diagram and region selection\n- Terraform scripts for provisioning\n- Web tier behind ALB + ASG across 2 AZs\n- RDS for relational store with backups\n- Static assets on S3 + CloudFront\n- Monitoring & alerting with CloudWatch"
      },
      {
        type: "text",
        value:
          "Assessment criteria: correct use of AZs, security posture (IAM/NACL/sg), automation (IaC), cost estimate, and recovery plan."
      }
    ]
  }
];

export default awsCertifiedTraining;
