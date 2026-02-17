/**
 * Sign In Tab Component
 *
 * Handles email/password sign-in using Better Auth.
 * Uses TanStack Query's useMutation for async state management.
 */ import { PasswordInput } from "@/components/password-input.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { LoadingSwap } from "@/components/ui/loading-swap.tsx"
import authClient from "@/lib/auth/auth-client.ts"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { toast } from "sonner"

export function SignInTab() {
  const navigate = useNavigate()

  // Form State
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Form Validation state
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  // Mutation for sign in
  const signInMutation = useMutation({
    mutationFn: async () => {
      return await authClient.signIn.email(
        { email, password, callbackURL: "/" },
        {
          onError: (error) => {
            toast.error(error.error.message || "Failed to sign in")
          },
          onSuccess: () => {
            toast.success("Sign In successful!")
            navigate({ to: "/" })
          },
        },
      )
    },
  })

  // Validate Inputs
  function validate(): boolean {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email address"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length <= 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (validate()) {
      signInMutation.mutate()
    }
  }

  const isLoading = signInMutation.isPending

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="signin-email">Email</Label>
        <Input
          id="signin-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          disabled={isLoading}
          aria-invalid={!!errors.email}
        />
        {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="signin-password">Password</Label>
        <PasswordInput
          id="signin-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          disabled={isLoading}
          aria-invalid={!!errors.password}
        />
        {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={isLoading} className="w-full">
        <LoadingSwap isLoading={isLoading} className="">
          Sign In
        </LoadingSwap>
      </Button>
    </form>
  )
}
