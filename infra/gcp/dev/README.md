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
3. Enable the Google APIs that will allow us to manage our infrastructure with terraform.
   - `gcloud config set project <project_id>`
   - `gcloud services enable iamcredentials.googleapis.com cloudresourcemanager.googleapis.com storage.googleapis.com`
4. Create a [service account for terraform](https://cloud.google.com/iam/docs/service-accounts-create)
   - `gcloud iam service-accounts create <sa_name> --display-name "Terraform Service Account"`
   - The account will need the following permissions
   ```shell
   gcloud projects add-iam-policy-binding <project_id> \
   --member="serviceAccount:<sa_name>@<project_id>.iam.gserviceaccount.com" \
   --role=roles/storage.objectAdmin \
   --role=roles/serviceusage.serviceUsageAdmin \
   --role=roles/iam.serviceAccountAdmin \
   --role=roles/iam.serviceAccountUser \
   --role=roles/resourcemanager.projectIamAdmin \
   --role=roles/compute.viewer \
   --role=roles/compute.securityAdmin \
   --role=roles/container.clusterAdmin \
   --role=roles/cloudsql.admin \
   --role=roles/container.developer
   ```
   - You can check that all the roles were successfully added to our service account with the following command:
   ```shell
   gcloud projects get-iam-policy $PROJECT_ID --flatten="bindings[].members" --format='table(bindings.role)' --filter="bindings.members:<service_account>"
   ```
   While this is a lot of permissions, and manually applying them is not ideal, it is necessary for terraform to be able to manage all the resources we need to get this project up and running.
5. [Create a GCP bucket](https://cloud.google.com/storage/docs/creating-buckets#storage-create-bucket-cli) to hold Terraform remote state
   - `gcloud storage buckets create gc://<bucket_name> --project <project_id>`

### Terraform Initialization and Apply

1. Modify the location of the remote state bucket in `backend.tf` to match the id of the bucket you created in the previous step.
2. Initialize terraform
   - `terraform init`
3. Create a `terraform.tfvars` file with the following contents:
   - `project_id = "<project_id>"`
4. Apply terraform
   - `terraform apply`
