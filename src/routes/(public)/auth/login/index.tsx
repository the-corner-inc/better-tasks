import { createFileRoute, redirect } from "@tanstack/react-router"
import { authQueryOptions } from "@/lib/auth/auth.queries.ts"
import { LoginForm } from "@/lib/auth/components/login-form.tsx"

/**
 * Login Page Route
 *
 * Features:
 * - Tabs for Sign In / Sign Up
 * - Social OAuth buttons (GitHub, Google)
 * - Route guard: redirects to "/" if already authenticated    //todo:use route guard to do that or middleware
 */

export const Route = createFileRoute("/(public)/auth/login/")({
  // Route guard - redirect if already authenticated
  beforeLoad: async ({ context }) => {
    // - ensureQueryData : verify if "authQueryOptions" is in cache. Yes, then returns the data, otherwise fetches it.
    // - revalidateIfStale: true -> refetch the data if stale
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
