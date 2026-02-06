import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import authClient from "@/lib/auth/auth-client.ts"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button.tsx"
import { LoadingSwap } from "@/components/ui/loading-swap.tsx"
import { PasswordInput } from "@/components/password-input.tsx"

/**
 * Sign Up Tab Component
 *
 * Handles email/password registration using Better Auth.
 * Uses TanStack Query's useMutation for async state management.
 */
export function SignUpTab() {
  const navigate = useNavigate()

  // Form State
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Form validation state
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
  }>({})

  // Mutation for sign up
  const signUpMutation = useMutation({
    mutationFn: async () => {
      return await authClient.signUp.email(
        { name, email, password, callbackURL: "/" },
        {
          onError: (error) => {
            toast.error(error.error.message || "Failed to sign up.")
          },
          onSuccess: () => {
            toast.success("Sign up successful.")
            navigate({ to: "/" })
          },
        },
      )
    },
  })

  const isLoading = signUpMutation.isPending

  // Validate Inputs
  function validate(): boolean {
    const newErrors: { name?: string; email?: string; password?: string } = {}

    if (!name) {
      newErrors.name = "Name is required"
    } else if (name.length < 2) {
      newErrors.name = "Name must be at least 3 characters"
    }

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
    return Object.keys(newErrors).length === 0 // TODO : verify what this does
  }

  // Handle Form submission
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (validate()) {
      signUpMutation.mutate()
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="signup-name">Name</Label>
        <Input
          id="signup-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Robert Strong"
          disabled={isLoading}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-destructive text-sm">{errors.name}</p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          disabled={isLoading}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-destructive text-sm">{errors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <PasswordInput
          id="signup-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          disabled={isLoading}
          aria-invalid={!!errors.password}
        />
        {errors.password && (
          <p className="text-destructive text-sm">{errors.password}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={isLoading} className="w-full">
        <LoadingSwap isLoading={isLoading} className="">
          Sign Up
        </LoadingSwap>
      </Button>
    </form>
  )
}
