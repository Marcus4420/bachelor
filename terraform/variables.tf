variable "aws_region" {
  type    = string
  default = "eu-central-1"
}

variable "project_name" {
  type    = string
  default = "eid-service"
}

variable "db_username" {
  type    = string
  default = "eid_user"
}

variable "db_password" {
  type      = string
  sensitive = true
}
