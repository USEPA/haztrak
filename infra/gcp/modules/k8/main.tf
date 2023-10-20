locals {
  env_name     = var.environment == "prod" ? var.name : "${var.name}-${var.environment}"
  name         = var.regional ? local.env_name : "${local.env_name}-zonal"
  cluster_type = "simple-autopilot-public"
}


resource "google_compute_subnetwork" "gke_subnet" {
  name          = "test-subnetwork"
  ip_cidr_range = var.subnet_cidr
  region        = var.region
  network       = var.network
  # Pod secondary IP range
  secondary_ip_range {
    range_name    = "tf-test-secondary-range-update1"
    ip_cidr_range = var.pod_cidr
  }
  # Services secondary IP range
  secondary_ip_range {
    range_name    = "tf-test-secondary-range-update2"
    ip_cidr_range = var.service_cidr
  }
}

module "gke" {
  source                          = "terraform-google-modules/kubernetes-engine/google//modules/beta-autopilot-public-cluster"
  project_id                      = var.project
  name                            = "${local.cluster_type}-cluster"
  regional                        = true
  region                          = var.region
  network                         = var.network
  subnetwork                      = google_compute_subnetwork.gke_subnet.name
  ip_range_pods                   = google_compute_subnetwork.gke_subnet.secondary_ip_range[0].range_name
  ip_range_services               = google_compute_subnetwork.gke_subnet.secondary_ip_range[1].range_name
  release_channel                 = "REGULAR"
  enable_vertical_pod_autoscaling = true
  network_tags                    = [local.cluster_type]
}
