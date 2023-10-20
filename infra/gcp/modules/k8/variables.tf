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

variable "regional" {
  description = "Whether to deploy a regional cluster (multiple zones) or zonal (single zone)"
  type        = bool
  default     = false
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
  description = "The zone to host the cluster in (required if is a zonal cluster)"
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

variable "subnet_name" {
  type        = string
  description = "The name of the subnet to host the cluster in (required)"
}

variable "pod_ip_range_name" {
  type        = string
  description = "The name of the secondary IP range the pods will be assigned to."
}

variable "service_ip_range_name" {
  type        = string
  description = "The name of the secondary IP range the services will be assigned to."
}
