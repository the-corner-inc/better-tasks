import { GitHubIcon, GoogleIcon } from "@/lib/auth/components/o-auth-icons"
import type { ComponentProps, ElementType } from "react"

/**
 * Auth - OAuth Providers
 *
 * Responsibility:
 * - Define the list of supported providers
 * - Associate label + icon for the UI rendering
 */

export const SUPPORTED_OAUTH_PROVIDERS = ["github", "google"] as const
export type SupportedOAuthProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number]

// Provider details for UI rendering
export const SUPPORTED_OAUTH_PROVIDER_DETAILS: Record<
  SupportedOAuthProvider,
  { name: string; Icon: ElementType<ComponentProps<"svg">> }
> = {
  github: { name: "Github", Icon: GitHubIcon },
  google: { name: "Google", Icon: GoogleIcon },
}
