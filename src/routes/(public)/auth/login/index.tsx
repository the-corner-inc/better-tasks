import { authQueryOptions } from "@/lib/auth/auth.queries.ts"
import { LoginForm } from "@/lib/auth/components/login-form.tsx"
import { createFileRoute, redirect } from "@tanstack/react-router"

/**
 * Login Page Route
 *
 * Features:
 * - Tabs for Sign In / Sign Up
 * - Social OAuth buttons (GitHub, Google)
 * - Route guard: redirects to "/" if already authenticated
 */

export const Route = createFileRoute("/(public)/auth/login/")({
  beforeLoad: async ({ context }) => {
    // - ensureQueryData : verify if "authQueryOptions" is in cache. Yes, then returns the data, otherwise fetches it.
    const user = await context.queryClient.ensureQueryData({
      ...authQueryOptions(),
      revalidateIfStale: true,
    })

    if (user) throw redirect({ to: "/" })
  },

  component: RouteComponent,
})

function RouteComponent() {
  return <LoginForm variant="page" />
}
