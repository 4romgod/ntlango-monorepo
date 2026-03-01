output "terraform_workspace" {
  description = "The active Terraform workspace."
  value       = terraform.workspace
}

output "root_name" {
  description = "Confirms this root loaded correctly."
  value       = local.root_name
}
