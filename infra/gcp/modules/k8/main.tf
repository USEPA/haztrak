locals {
  name = var.environment == "prod" ? var.name : "${var.name}-${var.environment}"
}

resource "google_compute_subnetwork" "gke_subnet" {
  name          = "test-subnetwork"
  ip_cidr_range = var.subnet_cidr
  region        = var.region
  network       = var.network
  secondary_ip_range {
    range_name    = "tf-test-secondary-range-update1"
    ip_cidr_range = var.subnet_cidr
  }
}
#
#module "gke" {
#  source                     = "terraform-google-modules/kubernetes-engine/google"
#  project_id                 = var.project
#  name                       = local.name
#  region                     = var.region
#  zones                      = var.zones
#  network                    = var.network
#  subnetwork                 = var.subnetwork
#  ip_range_pods              = google_compute_subnetwork.gke_subnet.ip_cidr_range
#  ip_range_services          = "us-central1-01-gke-01-services"
#  http_load_balancing        = false
#  network_policy             = false
#  horizontal_pod_autoscaling = true
#  filestore_csi_driver       = false
#
#  node_pools = [
#    {
#      name               = "default-node-pool"
#      machine_type       = "e2-medium"
#      node_locations     = "us-central1-b,us-central1-c"
#      min_count          = 1
#      max_count          = 100
#      local_ssd_count    = 0
#      spot               = false
#      disk_size_gb       = 100
#      disk_type          = "pd-standard"
#      image_type         = "COS_CONTAINERD"
#      enable_gcfs        = false
#      enable_gvnic       = false
#      logging_variant    = "DEFAULT"
#      auto_repair        = true
#      auto_upgrade       = true
#      service_account    = "project-service-account@<PROJECT ID>.iam.gserviceaccount.com"
#      preemptible        = false
#      initial_node_count = 80
#    },
#  ]
#
#  node_pools_oauth_scopes = {
#    all = [
#      "https://www.googleapis.com/auth/logging.write",
#      "https://www.googleapis.com/auth/monitoring",
#    ]
#  }
#
#  node_pools_labels = {
#    all = {}
#
#    default-node-pool = {
#      default-node-pool = true
#    }
#  }
#
#  node_pools_metadata = {
#    all = {}
#
#    default-node-pool = {
#      node-pool-metadata-custom-value = "my-node-pool"
#    }
#  }
#
#  node_pools_taints = {
#    all = []
#
#    default-node-pool = [
#      {
#        key    = "default-node-pool"
#        value  = true
#        effect = "PREFER_NO_SCHEDULE"
#      },
#    ]
#  }
#
#  node_pools_tags = {
#    all = []
#
#    default-node-pool = [
#      "default-node-pool",
#    ]
#  }
#}
