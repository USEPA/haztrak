output "instance" {
  value = google_sql_database_instance.primary.name
}

output "private_ip" {
  value = google_compute_global_address.private_ip_range[0].address
}
