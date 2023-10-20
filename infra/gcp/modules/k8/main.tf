locals {
  env_name = var.environment == "prod" ? var.name : "${var.name}-${var.environment}"
  name     = var.regional ? local.env_name : "${local.env_name}-zonal"
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
  source                     = "terraform-google-modules/kubernetes-engine/google"
  project_id                 = var.project
  name                       = local.name
  regional                   = var.regional
  region                     = var.region
  zones                      = var.zones
  network                    = var.network
  subnetwork                 = google_compute_subnetwork.gke_subnet.name
  ip_range_pods              = google_compute_subnetwork.gke_subnet.secondary_ip_range[0].range_name
  ip_range_services          = google_compute_subnetwork.gke_subnet.secondary_ip_range[1].range_name
  http_load_balancing        = false
  network_policy             = false
  horizontal_pod_autoscaling = true
  filestore_csi_driver       = false
  service_account_name       = "${var.project}-tf-sa"

  #  node_pools = [
  #    {
  #      name               = "default-node-pool"
  #      machine_type       = "e2-micro"
  #      #      node_locations     = "us-central1-b,us-central1-c"
  #      min_count          = 1
  #      max_count          = 10
  #      local_ssd_count    = 0
  #      spot               = false
  #      disk_size_gb       = 10
  #      disk_type          = "pd-standard"
  #      image_type         = "COS_CONTAINERD"
  #      enable_gcfs        = false
  #      enable_gvnic       = false
  #      logging_variant    = "DEFAULT"
  #      auto_repair        = true
  #      auto_upgrade       = true
  #      preemptible        = false
  #      initial_node_count = 1
  #    },
  #  ]
  #
  #    node_pools_oauth_scopes = {
  #      all = [
  #        "https://www.googleapis.com/auth/logging.write",
  #        "https://www.googleapis.com/auth/monitoring",
  #      ]
  #    }

  /*node_pools_labels = {
    all = {}

    default-node-pool = {
      default-node-pool = true
    }
  }

  node_pools_metadata = {
    all = {}

    default-node-pool = {
      node-pool-metadata-custom-value = "my-node-pool"
    }
  }

  node_pools_taints = {
    all = []

    default-node-pool = [
      {
        key    = "default-node-pool"
        value  = true
        effect = "PREFER_NO_SCHEDULE"
      },
    ]
  }

  node_pools_tags = {
    all = []

    default-node-pool = [
      "default-node-pool",
    ]
  }*/
  depends_on = [google_compute_subnetwork.gke_subnet]
}
