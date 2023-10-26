locals {
  # database tiers follow legacy sets of "db-custom-<VCPUs>-<RAM in MB>"
  database_tier  = var.environment == "prod" ? "db-custom-1-3840" : "db-f1-micro"
  disk_size      = var.environment == "prod" ? 10 : 10 # in GB, 10 GB is the minimum
  availability   = var.environment == "prod" ? "ZONAL" : "ZONAL"
  instance_name  = var.environment == "prod" ? "${replace(var.name, "_", "-")}-postgres" : "${replace(var.name, "_", "-")}-postgres-dev"
  ip_range_name  = "${replace(var.name, "_", "-")}-ip-range"
  backup_enabled = var.environment == "prod" ? true : false
}


resource "google_sql_database_instance" "default" {
  database_version = "POSTGRES_15"
  name             = var.name
  project          = var.project
  region           = var.region
  lifecycle {
    ignore_changes = [settings.0.activation_policy]
  }

  settings {
    activation_policy = "ALWAYS"
    availability_type = local.availability

    backup_configuration {
      backup_retention_settings {
        retained_backups = 3
        retention_unit   = "COUNT"
      }

      enabled                        = local.backup_enabled
      #      location                       = "us"
      point_in_time_recovery_enabled = local.backup_enabled
      start_time                     = "12:00"
      transaction_log_retention_days = 3
    }

    disk_autoresize       = true
    disk_autoresize_limit = 0
    disk_size             = 10
    disk_type             = "PD_SSD"

    ip_configuration {
      ipv4_enabled = true
    }
    pricing_plan = "PER_USE"
    tier         = local.database_tier
  }
}

# The database that will be deployed in the database instance
resource "google_sql_database" "postgres" {
  name     = var.name
  instance = google_sql_database_instance.default.name
}
