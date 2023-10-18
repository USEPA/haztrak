module "gcp_apis" {
  source = "../modules/gcp-apis"

  project  = var.project
  services = [
    "compute.googleapis.com",
  ]
}

module "vpc" {
  source     = "../modules/network"
  project    = var.project
  region     = var.region
  depends_on = [module.gcp_apis]
}
