locals {
  env_name     = var.environment == "prod" ? var.name : "${var.name}-${var.environment}"
  name         = var.regional ? local.env_name : "${local.env_name}-zonal"
  cluster_type = "simple-autopilot-public"
}


module "gke" {
  source                          = "terraform-google-modules/kubernetes-engine/google"
  description                     = var.description
  project_id                      = var.project
  name                            = local.name
  regional                        = false
  region                          = var.region
  zones                           = var.zones
  network                         = var.network
  service_account                 = "create"
  service_account_name            = "${var.project}-tf-sa"
  subnetwork                      = var.subnet_name
  ip_range_pods                   = var.pod_ip_range_name
  ip_range_services               = var.service_ip_range_name
  release_channel                 = "REGULAR"
  enable_vertical_pod_autoscaling = false
  horizontal_pod_autoscaling      = false
}
