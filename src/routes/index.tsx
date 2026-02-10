import { authQueryOptions } from "@/lib/auth/auth.queries"
import { LoginForm } from "@/lib/auth/components/login-form.tsx"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, redirect } from "@tanstack/react-router"

/**
 * Home Page
 *
 * Shows different content based on authentication state:
 * - Not logged in: Login form with Sign In / Sign Up tabs
 * - Logged in: Dashboard with todos stats and quick actions
 */

export const Route = createFileRoute("/")({
  component: HomePage,
  loader: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(authQueryOptions())

    if (user) {
      throw redirect({ to: "/tasks" })
    }
  },
})

function HomePage() {
  const { data: user } = useSuspenseQuery(authQueryOptions())

  if (!user) {
    return <LoginForm variant="page" />
  }

  return <div>Public home / login</div>
}
