# Terraform configs for an example GCP Development Environment

This directory is an example set of terraform configs that allow us to provision the necessary resources for an example GCP deployment. It is not intended to be used as-is, but rather as an example. Setting up terraform configs for an entire GCP organization is outside the scope of this project.

## Prerequisites

1. [Terraform](https://www.terraform.io/downloads.html) installed
   - See [GitHub Actions](/.github/workflows) workflow file for list of supported terraform versions
2. An account on Google Cloud (GCP) with access to a project and sufficient permissions.
   - ToDo: list necessary Permissions
3. A service account with sufficient permissions to create resources in the project.
