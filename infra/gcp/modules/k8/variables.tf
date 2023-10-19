variable "project" {
  description = "The Google Cloud project ID to enable services in."
  type        = string
  validation {
    error_message = "GCP project length must be greater than zero"
    condition     = length(var.project) > 0
  }
}

variable "name" {
  description = "The name of the GKE cluster."
  type        = string
}

variable "environment" {
  description = "The environment to deploy to"
  type        = string
  default     = "dev"
  validation {
    condition     = contains(["dev", "prod"], var.environment)
    error_message = "Environment must be one of [dev, prod]"
  }
}

variable "region" {
  description = "The region to deploy to"
  default     = "us-east1"
  type        = string
  validation {
    condition     = can(regex("^[a-z]{2,}-[a-z]*[1-9]{1}$", var.region))
    error_message = "Invalid GCP region format. See 'gcloud compute regions list' for available options"
  }
}

variable "zones" {
  type        = list(string)
  description = "the zones to use for the GKE deployment."
  default     = []
}

variable "description" {
  type        = string
  description = "The description of the cluster"
  default     = "Haztrak GKE Cluster"
}

variable "network" {
  type        = string
  description = "The VPC network to host the cluster in (required)"
}

variable "subnetwork" {
  type        = string
  description = "The subnetwork to host the cluster in (required)"
}

variable "subnet_cidr" {
  type        = string
  description = "The CIDR range of the subnet to host the cluster in (required)"
}
