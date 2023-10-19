module "gcp_apis" {
  source = "../modules/gcp-apis"

  project = var.project
  services = [
    "compute.googleapis.com",
    "container.googleapis.com"
  ]
}

module "vpc" {
  source     = "../modules/network"
  project    = var.project
  region     = var.region
  depends_on = [module.gcp_apis]
}

module "k8" {
  source       = "../modules/k8"
  name         = "haztrak-gke"
  network      = module.vpc.network
  project      = var.project
  subnet_cidr  = "10.0.0.0/16"
  pod_cidr     = "10.1.0.0/24"
  service_cidr = "10.2.0.0/24"
  depends_on   = [module.gcp_apis, module.vpc]
}
