import {createFileRoute, Outlet, redirect, useRouter} from "@tanstack/react-router";
import {authQueryOptions} from "@/lib/auth/auth.queries.ts";
import {useQueryClient, useSuspenseQuery} from "@tanstack/react-query";
import authClient from "@/lib/auth/auth-client.ts";
import {ListTodoIcon, Link, UserIcon, LogOutIcon} from "lucide-react";
import {Button} from "@/components/ui/button.tsx"

/**
 * Protected Layout Route for (_auth)
 *
 * This layout:
 * 1. Checks authentication in beforeLoad (server-side)
 * 2. Redirects to /auth/login if not authenticated
 * 3. Provides a header with user info and sign out
 * 4. Renders child routes via <Outlet />
 *
 * All routes under (_auth)/ are protected by this layout.
 */

export const Route = createFileRoute("/(app)/_auth")({
    component: AppLayout,

    // ===================================================================
    // beforeLoad - Runs BEFORE the route renders (server-side capable)
    // This is where we check authentication
    // ===================================================================
    beforeLoad: async ({ context, location }) => {
        // ensureQueryData: Returns cached data OR fetches if not cached
        // revalidateIfStale: Refetch in background if data is stale
        const user = await context.queryClient.ensureQueryData({
            ...authQueryOptions(),
            revalidateIfStale: true,
        })

        // If no user -> redirect to login with return URL
        if (!user) {
            throw redirect({
                to: "/auth/login",
                search: { redirect: location.pathname },
            })
        }

        // Return user to make it available in child routes via context
        // This updates the type to non-null for child routes
        return { user }
    },
})


function AppLayout() {
    // Get user from React Query cache (already fetched in beforeLoad)
    const { data: user } = useSuspenseQuery(authQueryOptions())

    const router = useRouter()
    const queryClient = useQueryClient()

    // Handle sign out
    const handleSignOut = async () => {
        await authClient.signOut()

        // Clear the auth cache
        queryClient.setQueryData(authQueryOptions().queryKey, null)

        // Invalidate router to re-run loaders
        router.invalidate()

        // Redirect to home
        router.navigate({ to: "/" })
    }

    return (
        <div className="min-h-screen">
          {/* ================================================================
          HEADER - Navigation bar with user info
          ================================================================ */}
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center justify-between">

                    {/* Left: Logo / Navigation */}
                    <div className="flex items-center gap-4">
                        <Link to="/" className="flex items-center gap-2 font-semibold">
                            <ListTodoIcon className="h-5 w-5" />
                            <span>Better Tasks</span>
                        </Link>

                        <nav className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" asChild>
                                <Link to="/todos">My Todos</Link>
                            </Button>
                        </nav>
                    </div>

                    {/* Right: User info + Sign out */}
                    <div className="flex items-center gap-4">
                        {user && (
                            <>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
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

          {/* ================================================================
          MAIN CONTENT - Child routes are rendered here via <Outlet />
          ================================================================ */}
            <main className="container py-8">
                <Outlet />
            </main>
        </div>
    )
}
