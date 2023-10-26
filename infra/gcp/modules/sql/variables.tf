variable "region" {
  description = "The GCP region the database will be hosted in"
  type        = string
}

variable "project" {
  description = "The project id to deploy to"
  type        = string
}

variable "name" {
  description = "The name of the database to create"
  type        = string
}

variable "databases" {
  description = "The names of the databases to create"
  type = list(object({
    name = string
  }))
}

variable "environment" {
  description = "The environment to deploy to"
  type        = string
  validation {
    condition     = contains(["dev", "prod"], var.environment)
    error_message = "Environment must be one of [dev, prod]"
  }
}

variable "vpc" {
  description = "The ID of vpc the database is deployed to"
  type        = string
}

variable "enable_private_ip" {
  description = "Whether to enable private IP for the sql instance to connect to the provided VPC"
  type        = bool
  default     = true
}
