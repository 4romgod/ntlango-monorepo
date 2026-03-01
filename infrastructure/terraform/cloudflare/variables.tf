variable "cloudflare_api_token" {
  description = "Optional Cloudflare API token. Prefer CLOUDFLARE_API_TOKEN in the environment."
  type        = string
  sensitive   = true
  default     = ""
}

variable "cloudflare_zone_id" {
  description = "The Cloudflare zone ID to manage."
  type        = string
  default     = ""
}

variable "cloudflare_zone_name" {
  description = "The DNS zone name, for example gatherle.com."
  type        = string
  default     = ""
}
