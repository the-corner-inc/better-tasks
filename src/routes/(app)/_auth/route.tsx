import { Button } from "@/components/ui/button.tsx"
import authClient from "@/lib/auth/auth-client.ts"
import { authQueryOptions } from "@/lib/auth/auth.queries.ts"
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
  useRouter,
} from "@tanstack/react-router"
import { HomeIcon, ListTodoIcon, LogOutIcon, UserIcon } from "lucide-react"

/**
 * Protected Layout Route for (_auth)
 *
 * This layout:
 * - Checks authentication in beforeLoad (server-side), BEFORE the route renders
 * - Redirects if not authenticated
 * - Provides a header with user info and sign out
 *
 * All routes under (_auth)/ are protected by this layout.
 */

export const Route = createFileRoute("/(app)/_auth")({
  component: AppLayout,
  beforeLoad: async ({ context, location }) => {
    // ensureQueryData: Returns cached data OR fetches if not cached
    const user = await context.queryClient.ensureQueryData({
      ...authQueryOptions(),
      revalidateIfStale: true,
    })

    if (!user) {
      throw redirect({
        to: "/auth/login",
        search: { redirect: location.pathname },
      })
    }

    // make it available in child routes via context
    return { user }
  },
})

function AppLayout() {

  const { data: user } = useSuspenseQuery(authQueryOptions())

  const router = useRouter()
  const queryClient = useQueryClient()

  const handleSignOut = async () => {
    await authClient.signOut()
    queryClient.setQueryData(authQueryOptions().queryKey, null)
    router.invalidate()
    router.navigate({ to: "/" })
  }

  return (
    <div className="min-h-screen">
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          {/* Left: Logo / Navigation */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <HomeIcon className="h-5 w-5" />
              <span>Better Tasks</span>
            </Link>

            <nav className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/tasks">
                  <ListTodoIcon className="h-5 w-5" />
                  <span>My Tasks</span>
                </Link>
              </Button>
            </nav>
          </div>

          {/* Right: User info + Sign out */}
          <div className="flex items-center gap-4">
            {user && (
              <>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <UserIcon className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>

                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container py-8">
        <Outlet />
      </main>
    </div>
  )
}
