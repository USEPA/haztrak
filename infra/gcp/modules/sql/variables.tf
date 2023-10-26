variable "region" {
  description = "The GCP region the database will be hosted in"
  type        = string
  default     = "us-east1"
}

variable "project" {
  description = "The project id to deploy to"
  type        = string
}

variable "name" {
  description = "The name of the database to create"
  type        = string
  default     = "dpgraham"
}

variable "environment" {
  description = "The environment to deploy to"
  type        = string
  validation {
    condition     = contains(["dev", "prod"], var.environment)
    error_message = "Environment must be one of [devel, prod]"
  }
}

variable "vpc" {
  description = "The ID of vpc the database is deployed to"
  type        = string
}
