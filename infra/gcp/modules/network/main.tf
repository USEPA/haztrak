locals {
  vpc_name             = var.environment == "production" ? "${var.project}-vpc-prod" : "${var.project}-vpc-dev"
  database_subnet_name = var.environment == "production" ? "${var.project}-database-subnet-prod" : "${var.project}-database-subnet-dev"
}

module "vpc" {
  source                  = "terraform-google-modules/network/google"
  version                 = "~> 7.1"
  project_id              = var.project
  network_name            = local.vpc_name
  routing_mode            = "GLOBAL"
  auto_create_subnetworks = false
  subnets                 = var.subnets
}
