# Haztrak Infrastructure as Code (IaC)

This directory contains the project configs and code for provisioning resources and deploying the project

## Directory Contents

Contributions to the IaC should follow the general directory structure below:

```
.
├── haztrak          # Helm chart for the project
│   ├── charts
│   │   ├── rest-api # Helm chart for the HTTP REST API
│   │   └── worker   # Helm chart for the Celery Async worker
│   └── templates
└── terrafrom        # Terraform configs for provisioning resources
    ├── dev          # Terraform configs for the dev environment
    ├── modules      # Resuable Terraform modules
    ├── org          # Global Terraform configs for the organization
    └── prod         # Terraform configs for the prod environment

```
