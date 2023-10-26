locals {
  subnet_base_name           = "${var.vpc_name}-subnet"
  k8_subnet_pod_ip_range     = "${local.subnet_base_name}-pods"
  k8_subnet_service_ip_range = "${local.subnet_base_name}-services"
}

module "gcp_apis" {
  source   = "../modules/gcp-apis"
  project  = var.project
  services = [
    "compute.googleapis.com",
    "container.googleapis.com",
    "sqladmin.googleapis.com"
  ]
}

module "vpc" {
  source     = "../modules/network"
  vpc_name   = var.vpc_name
  project    = var.project
  region     = var.region
  depends_on = [module.gcp_apis]
  subnets    = [
    {
      subnet_name   = local.subnet_base_name
      subnet_ip     = "10.0.0.0/16"
      subnet_region = var.region
    }
  ]
  secondary_ranges = {
    (local.subnet_base_name) = [
      {
        range_name    = local.k8_subnet_pod_ip_range
        ip_cidr_range = "10.1.0.0/24"
      },
      {
        range_name    = local.k8_subnet_service_ip_range
        ip_cidr_range = "10.2.0.0/24"
      }
    ]
  }
}

#module "k8" {
#  source                = "../modules/k8"
#  name                  = "haztrak-gke"
#  network               = module.vpc.network
#  project               = var.project
#  region                = var.region
#  zones                 = [var.zone]
#  subnet_name           = local.subnet_base_name
#  pod_ip_range_name     = local.k8_subnet_pod_ip_range
#  service_ip_range_name = local.k8_subnet_service_ip_range
#  depends_on            = [module.gcp_apis, module.vpc]
#}


module "sql" {
  source      = "../modules/sql"
  environment = var.environment
  project     = var.project
  vpc         = module.vpc.network
  depends_on  = [module.vpc, module.gcp_apis]
}
