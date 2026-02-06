import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { SignInTab } from "@/lib/auth/components/sign-in-tab.tsx"
import { SignUpTab } from "@/lib/auth/components/sign-up-tab.tsx"
import { SocialAuthButtons } from "@/lib/auth/components/social-auth-buttons.tsx"

/**
 * LoginForm - Reusable Authentication Component
 *
 * A complete login/signup form with:
 * - Sign In / Sign Up tabs
 * - Social OAuth buttons (GitHub, Google)
 *
 * Usage:
 * // Full page centered
 * <LoginForm variant="page" />
 *
 * // Embedded in another component
 * <LoginForm variant="embedded" />
 *
 * // Default tab selection
 * <LoginForm defaultTab="signup" />
 *
 */

type LoginFormProps = {
  /** "page" = full page centered, "embedded" = fits in parent container */
  variant?: "page" | "embedded"

  /** Default tab to show */
  defaultTab?: "signin" | "signup"

  /** Class name for custom styling */
  className?: string
}

export function LoginForm({
  variant = "embedded",
  defaultTab = "signin",
  className = "",
}: LoginFormProps) {
  const wrapperClass =
    variant === "page"
      ? "flex min-h-screen items-center justify-center px-4 py-12"
      : className

  return (
    <div className={wrapperClass}>
      <Tabs defaultValue={defaultTab} className="w-full max-w-md">
        {/* ======================================================
                TABS NAVIGATION
                ====================================================== */}
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        {/* ======================================================
                TAB: Sign In
                ====================================================== */}
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
                <span className="bg-card text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 text-xs">
                  OR
                </span>
              </div>
            </div>

            {/* ======================================================
                        O AUTH
                        ====================================================== */}
            <CardFooter>
              <SocialAuthButtons />
            </CardFooter>
          </Card>
        </TabsContent>

        {/* ======================================================
                TAB: Sign Up
                ====================================================== */}
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
                <span className="bg-card text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 text-xs">
                  OR
                </span>
              </div>
            </div>

            {/* ======================================================
                        O AUTH
                        ====================================================== */}
            <CardFooter>
              <SocialAuthButtons />
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
