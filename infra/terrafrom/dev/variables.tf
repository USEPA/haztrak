variable "project_id" {
  description = "The project ID to deploy to"
  type        = string

  validation {
    condition     = length(var.project_id) > 0
    error_message = "You must provide a project ID"
  }

}

variable "region" {
  description = "The default region to deploy to"
  default     = "us-east1"
  type        = string
  validation {
    condition     = regex("^[a-z]{2,}-[a-z]*[1-9]{1}$", var.region)
    error_message = "Invalid GCP region format. See 'gcloud compute regions list' for available options"
  }
}

variable "tf_state_bucket" {
  description = "The name of the GCS bucket to store Terraform state"
  type        = string

  validation {
    condition     = length(var.tf_state_bucket) > 0
    error_message = "You must provide a bucket name"
  }
}
