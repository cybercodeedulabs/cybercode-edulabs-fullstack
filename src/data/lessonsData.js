import awsCertifiedTraining from './lessons/aws-certified-training';
import basicsCloudComputing from './lessons/basics-cloudcom';
import cloudSecurityDevsecOps from './lessons/cloud-security-devsecops';
import cybersecurityEssentials from './lessons/cybersecurity-essentials';
import devopsDockerKubernetes from './lessons/devops-docker-kubernetes';
import fullStackWebDev from './lessons/full-stack-web-dev';
import golangLessons from './lessons/golang';
import homeLabCloud from './lessons/home-lab-setup-cloud-practice';
import linuxEssentials from './lessons/linux-essentials';
import microservicesGoKubernetes from './lessons/microservices-go-kubernetes';
import mlWithAws from './lessons/ml-with-aws';
import networkingCCNA from './lessons/networking-ccna';
import privateCloudOpenstack from './lessons/private-cloud-openstack';
import pythonAbsoluteBeginners from './lessons/python-absolute-beginners';
import pythonJobFocused from './lessons/python-job-focused';
import terrformIac from './lessons/terraform-iac';
import versionControlGitGithub from './lessons/version-control-git-github';
const lessonsData = {
    "golang": golangLessons,
    "python-job-focused": pythonJobFocused,
    "python-absolute-beginners": pythonAbsoluteBeginners,
    "full-stack-web-dev": fullStackWebDev,
    "version-control-git-github": versionControlGitGithub,
    "microservices-go-kubernetes": microservicesGoKubernetes,
    "aws-certified-training": awsCertifiedTraining,
    "devops-docker-kubernetes": devopsDockerKubernetes,
    "private-cloud-openstack": privateCloudOpenstack,
    "terraform-iac": terrformIac,
    "ml-with-aws": mlWithAws,
    "cloud-security-devsecops": cloudSecurityDevsecOps,
    "basics-cloudcom": basicsCloudComputing,
    "linux-essentials": linuxEssentials,
    "networking-ccna": networkingCCNA,
    "cybersecurity-essentials": cybersecurityEssentials,
    "home-lab-setup-cloud-practice": homeLabCloud,
};

export default lessonsData;
