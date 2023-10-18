terraform {
  backend "gcs" {
    bucket = "haztrak-terraform-remote-state-epa-test-123"
    prefix = "terraform/dev"
  }
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.78.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}
