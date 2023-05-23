# Deployment

<div style='background-color: rgba(255,165,0,0.49); border-radius: 10px; padding: 1rem;'>
    <img src="../assets/images/156px-Warning.svg" alt="Warning" style="vertical-align: middle; width: 50px; height: 50px;">
    <span style="font-size: 24px; font-weight: bold; vertical-align: middle; margin-left: 10px;" >Warning</span>
    <p>
        This document includes guidance on hosting Haztrak using various cloud service providers.
        The United States Environmental Protection Agency (EPA) does not endorse any cloud service provider
        mentioned in this documentation. EPA is not responsible for any costs incurred by a third party
        that chooses to host Haztrak.
    </p>
</div>

If you're looking to contribute to the Haztrak project,
see our [documentation setting up a local development environment section](../development/local-development.md).

## Overview

Where applicable, the Haztrak project embraces a number of _doctrines_<sup>1</sup> that are important to understand:

- The [12 Factor App](https://12factor.net/)
  - A methodology for building modern, scalable, maintainable software-as-a-service applications
- [DevOps](https://www.google.com/search?q=devops)
  - An approach that combines software development (Dev) and IT operations (Ops),
    emphasizing collaboration and automation to deliver software faster and more reliably.
  - Haztrak embraces the following DevOps practices:
    - [Infrastructure as Code](<https://www.google.com/search?q=infrastructure+as+code+(iac)>)
    - [Continuous Integration & Delivery](https://www.google.com/search?q=continuous+integration+and+continuous+delivery)
    - [Continuous Monitoring](https://www.google.com/search?q=continuous+monitoring)
    - The [GitOps](https://www.gitops.tech/) operational framework

### Tools Employed

<p style="color: orange;">
    Section Coming soon.
</p>

#### Infrastructure as Code (IaC)

<p style="color: orange;">
    Section Coming soon.
</p>

#### Continuous Deployment

<p style="color: orange;">
    Section Coming soon.
</p>

## Example local k8 Deployment

**Don't bother following this yet.** This is a work in progress meant to document the steps.

As an example, you can deploy Haztrak to a local Minikube cluster.
[Minikube](https://minikube.sigs.k8s.io/docs/start/) is a lightweight tool for creating a Kubernetes
cluster on your local machine.

### Prerequisites

Before proceeding, ensure the following prerequisites are installed:

- [Docker](https://docs.docker.com/get-docker/)
- [Minikube](https://minikube.sigs.k8s.io/docs/start/)
- [Helm](https://helm.sh/docs/intro/install/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

### Steps

To deploy Haztrak locally to a Minikube cluster, follow these steps:

1. Start Minikube: Open a terminal and start the Minikube cluster using the following command:
   This may take a few minutes, depending on your system.

   ```shell
   minikube start
   ```

2. Clone the Haztrak repository to you local machine and cd into the project root:

   ```shell
   git clone https://github.com/USEPA/haztrak.git
   cd haztrak
   ```

3. configure your minikube environment to use the docker daemon running on your local machine:

   ```shell
   eval $(minikube docker-env)
   ```

4. Build the docker images for the Haztrak services:

   ```shell
   docker build -t haztrak-server --target production ./server
   ```

5. Deploy Haztrak: Run the following Helm command to deploy Haztrak:

   ```shell
   helm install haztrak ./haztrak-charts
   ```

   This installs the Haztrak charts and creates the necessary Kubernetes resources in your minikube cluster.

6. Access Haztrak with `minikube service` command:

   ```shell
   minikube service haztrak
   ```

This will open a browser to IP address created by the haztrak k8 service for your viewing pleasure.

<br>
<hr>

<sup>1</sup> This is a not 100% accurate since Haztrak will never be deployed, by the EPA, to a true production
environment. Declaring that we embrace GitOps and continuous monitoring is a little like armchair quarterbacking.
The Haztrak project implements these practices in our development process where we can.
