variable "services" {
  description = "List of Google Cloud API names to enable."
  type        = list(string)
  validation {
    #    condition = length([
    #      for service in var.services : service if can(regex("[a-z.]*", service)) == true
    #    ])
    condition     = can([for s in var.services : regex("^[a-zA-Z.]*googleapis.com$", s)])
    error_message = "Service names must follow the format: 'serviceusage.googleapis.com'"
  }
}

variable "project" {
  description = "The Google Cloud project ID to enable services in."
  type        = string
  validation {
    error_message = "GCP project length must be greater than zero"
    condition     = length(var.project) > 0
  }
}
