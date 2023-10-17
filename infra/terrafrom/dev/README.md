# Terraform configs for an example GCP Development Environment

This directory is an example set of terraform configs that allow us to provision the necessary resources for an example GCP deployment. It is not intended to be used as-is, but rather as an example. Setting up terraform configs for an entire GCP organization is outside the scope of this project.

## Prerequisites

1. [Terraform](https://www.terraform.io/downloads.html) installed
   - See [GitHub Actions](/.github/workflows) workflow file for list of supported terraform versions
2. An account on Google Cloud (GCP) with the necessary IAM permissions for your project.
   - ToDo: list necessary Permissions

## Setup

### Manual or pre-configured resources

While haztrak encourages users store all infrastructure as code that can be checked into VCS,
for purposes of this demonstration, a pre-configured project and access is necessary.

1. Create the project
   - This could be bootstrapped from a separate terraform module/directory or manually created in the GCP console.
2. Ensure your account has sufficient permissions
   - `roles/iam.serviceAccountCreater`
3. Enable the IAM credentials API
   - `gcloud config set project <project_id>`
   - `gcloud services enable iamcredentials.googleapis.com`
4. Create a [service account for terraform](https://cloud.google.com/iam/docs/service-accounts-create)
   - `gcloud iam service-accounts create <sa_name> --display-name "Terraform Service Account"`
   - The account will need the following permissions
     - `roles/storage.objectAdmin`
   - `gcloud projects add-iam-policy-binding <project_id> -dev-test-123 --member="serviceAccount:<sa_name>@haztrak-epa-dev-test-123.iam.gserviceaccount.com" --role=roles/storage.objectAdmin`
5. [Create a GCP bucket](https://cloud.google.com/storage/docs/creating-buckets#storage-create-bucket-cli) to hold Terraform remote state
   - `gcloud storage buckets create gc://<bucket_name> --project <project_id>`

### Terraform Initialization and Apply

1. Initialize terraform
   - `terraform init`
2. Apply terraform
   - `terraform apply`
