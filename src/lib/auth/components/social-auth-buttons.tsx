import { Button } from "@/components/ui/button"
import { LoadingSwap } from "@/components/ui/loading-swap"
import authClient from "@/lib/auth/auth-client"
import type { SupportedOAuthProvider } from "@/lib/auth/o-auth-providers"
import {
  SUPPORTED_OAUTH_PROVIDERS,
  SUPPORTED_OAUTH_PROVIDER_DETAILS,
} from "@/lib/auth/o-auth-providers"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

/**
 * Social Auth Buttons Component
 *
 * Renders OAuth provider buttons (GitHub, Google, etc.)
 * using Better Auth's social sign-in functionality.
 */
export function SocialAuthButtons() {
  return (
    <div className="grid w-full grid-cols-2 gap-3">
      {SUPPORTED_OAUTH_PROVIDERS.map((provider) => (
        <SocialButton key={provider} provider={provider} />
      ))}
    </div>
  )
}

/**
 * Individual Social Button Component
 * Handles the OAuth flow for a single provider.
 */
function SocialButton({ provider }: { provider: SupportedOAuthProvider }) {
  const Icon = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].Icon
  const name = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider]

  const mutation = useMutation({
    mutationFn: async () => {
      return await authClient.signIn.social(
        {
          provider,
          callbackURL: "/",
        },
        {
          onError: (error) => {
            toast.error(error.error.message || `Failed to sign in with ${name}`)
          },
        },
      )
    },
  })

  const isLoading = mutation.isPending || mutation.isSuccess

  return (
    <Button
      variant="outline"
      type="button"
      disabled={isLoading}
      onClick={() => mutation.mutate()}
      className="w-full"
    >
      <LoadingSwap isLoading={isLoading} className="">
        <span className="flex items-center gap-2">
          <Icon />
          {SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].name}
        </span>
      </LoadingSwap>
    </Button>
  )
}
