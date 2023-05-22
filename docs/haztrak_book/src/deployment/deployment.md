# Deployment

This document provides guidance on deploying the Haztrak web application to various environments.

If you're looking to setup a development environment,
See our [setting up a local development environment section](../development/local-development.md).

## Local Deployment with Minikube

As an example, you can deploy Haztrak to a local Minikube cluster.
[Minikube](https://minikube.sigs.k8s.io/docs/start/) is a lightweight tool for local
development and testing of Kubernetes applications by creating a local single-node k8 cluster.

### Guide Prerequisites

Before proceeding with the deployment, ensure the following prerequisites are installed:

- `Docker`
- `Minikube`
- `Helm`
- `kubectl`

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

3. Customize the Helm values: Open the `haztrak-charts/values.yaml` file and adjust the
   configuration values to meet your requirements if different than currently stored values.

4. Deploy Haztrak: Run the following Helm command to deploy Haztrak:

   ```shell
   helm install haztrak ./haztrak-charts
   ```

   This installs the Haztrak charts and creates the necessary Kubernetes resources in your minikube cluster.

5. Use the kubectl CLI to get details on the deployment:

   ```shell
   kubectl get pods
   kubectl get services
   ```

6. Access Haztrak with `minikube service` command:

```shell
minikube service haztrak
```

This will open a browser to IP address created by the haztrak k8 service for your viewing pleasure.
