const terrformIac = [
    {
      slug: "terraform-overview",
      title: "Terraform Overview",
      content: [
        {
          type: "text",
          value:
            "Terraform is an IaC tool to provision and manage cloud resources declaratively."
        }
      ]
    },
    {
      slug: "writing-terraform-config",
      title: "Writing Terraform Configuration",
      content: [
        {
          type: "text",
          value:
            "Terraform configs are written in HashiCorp Configuration Language (HCL)."
        },
        {
          type: "code",
          language: "hcl",
          value: `resource "aws_instance" "example" {
  ami           = "ami-123456"
  instance_type = "t2.micro"
}`
        }
      ]
    }
  ];

  export default terrformIac;