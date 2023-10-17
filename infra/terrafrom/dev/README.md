# Terraform configs for an example GCP Development Environment

This directory is an example set of terraform configs that allow us to provision the necessary resources for an example GCP deployment. It is not intended to be used as-is, but rather as an example. Setting up terraform configs for an entire GCP organization is outside the scope of this project.

## Prerequisites

1. [Terraform](https://www.terraform.io/downloads.html) installed
   - See [GitHub Actions](/.github/workflows) workflow file for list of supported terraform versions
2. An account on Google Cloud (GCP) with the necessary IAM permissions for your project.
   - ToDo: list necessary Permissions

## Setup

1. Create the project
   - This could be bootstrapped from a separate terraform module/directory or manually created in the GCP console.
2. Create the remote state bucket
   - This could be bootstrapped from a separate terraform module/directory or manually created in the GCP console.
3. Create a service account for terraform
   - The account will need the following permissions
     - Storage List
4.
