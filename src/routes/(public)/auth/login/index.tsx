import {createFileRoute, redirect} from '@tanstack/react-router'
import {authQueryOptions} from "@/lib/auth/auth.barrel.ts";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {SignUpTab} from "@/lib/auth/components/sign-up-tab.tsx";
import {SignInTab} from "@/lib/auth/components/sign-in-tab.tsx";
import {SocialAuthButtons} from "@/lib/auth/components/social-auth-buttons.tsx";


/**
 * Login Page Route
 *
 * Features:
 * - Tabs for Sign In / Sign Up
 * - Social OAuth buttons (GitHub, Google)
 * - Route guard: redirects to "/" if already authenticated    //todo:use route guard to do that or middleware
 */

export const Route = createFileRoute('/(public)/auth/login/')({
  // Route guard - redirect if already authenticated
  beforeLoad: async ({context}) => {

    // - ensureQueryData : verify if "authQueryOptions" is in cache. Yes, then returns the data, otherwise fetches it.
    // - revalidateIfStale: true -> refetch the data if stale
    const user = await context.queryClient.ensureQueryData({
          ...authQueryOptions(),
          revalidateIfStale: true,
    })


    if(user)
      throw redirect({ to: "/"})
  },

  component: RouteComponent,
})

function RouteComponent() {
  return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <Tabs defaultValue="signin" className="w-full max-w-md">

          {/* ====================================================
            PAGE: Shows Tabs to sign in/up
            ==================================================== */}
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* ====================================================
            TAB: Sign In
            ==================================================== */}
          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
              </CardHeader>

              <CardContent>
                <SignInTab />
              </CardContent>

              <div className="px-6">
                <div className="relative my-4">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                  OR
                </span>
                </div>
              </div>

              <CardFooter>
                <SocialAuthButtons />
              </CardFooter>
            </Card>
          </TabsContent>

          {/* ====================================================
            TAB: Sign Up
            ==================================================== */}
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
              </CardHeader>

              <CardContent>
                <SignUpTab />
              </CardContent>

              <div className="px-6">
                <div className="relative my-4">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                  OR
                </span>
                </div>
              </div>

              <CardFooter>
                <SocialAuthButtons />
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  )

}
