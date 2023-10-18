# Loop through each GCP API, passed as a string, and enable it
resource "google_project_service" "enabled_services" {
  for_each = toset(var.services)

  project = var.project
  service = each.key
}
