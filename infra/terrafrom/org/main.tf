terraform {
  backend "gcs" {
    # Use the cloud setup host project to store the state
    bucket = "haztrak-epa-cs-bucket-a129ed3bccf04a1abf8760"
    prefix = "terraform/state"
  }
}

# production environment project
#module "haztrak-dev" {
#  source  = "terraform-google-modules/project-factory/google"
#  version = "~> 14.2"
#
#  name                 = "haztrak-dev-epa-2023"
#  project_id           = "haztrak-dev-epa-2023"
#  folder_id            = module.haztrak_folder
#  svpc_host_project_id = module.dpgraham-vpc-host-prod.project_id
#  shared_vpc_subnets   = [
#    google_compute_subnetwork.subnet_prod_east1.id,
#    google_compute_subnetwork.subnet_prod_central1.id
#  ]
#
#  billing_account = var.billing_account
#}


module "haztrak_folder" {
  source  = "terraform-google-modules/folders/google"
  version = "~> 3.2"

  parent = "organizations/${var.org_id}"
  names  = [
    "haztrak",
  ]
}

#module "haztrak_environments" {
#  source  = "terraform-google-modules/folders/google"
#  version = "~> 3.2"
#
#  parent = "organizations/${var.org_id}/${module.haztrak_folder}"
#  names  = [
#    "haztrak",
#  ]
#}
