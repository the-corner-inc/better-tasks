import type { auth } from "@/lib/auth/auth.ts"
import { env } from "@/lib/env/client.ts"
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

/**
 * Auth - Client Instance (React)
 *
 * "auth-client" is the auth API used in the client UI, and "auth" is the instance used on the server.
 *
 * Responsibilities:
 * - Expose a client-side auth API (hooks & client actions)
 * - Propagate additional user fields configured on the server (auth.ts)
 *
 * Usage:
 * - Client UI:
 *   - authClient.useSession()     // Hook for session state
 *   - authClient.signIn.email()   // Email sign-in
 *   - authClient.signIn.social()  // OAuth sign-in
 *   - authClient.signUp.email()   // Email sign-up
 *   - authClient.signOut()        // Sign out
 *   - authClient.getSession()     // Get current session
 *
 * Constraints:
 * - Client-only (no : next/headers, secrets, server config).
 *      The pages that have "use client" use it
 * - The source of truth for additional fields remains in "auth.ts"
 */

const authClient = createAuthClient({
  // Todo: Still true ?
  //  No need to pass the URL of the authentication API endpoint, because the Client & Server are on the same URL
  // Base URL - uses same origin in production
  baseURL: env.VITE_BASE_URL || "http://localhost:3000",

  plugins: [
    // https://www.better-auth.com/docs/concepts/typescript#inferring-additional-fields-on-client
    // Add the fields defined in the "auth.ts" schema to the client instance
    // This allows TypeScript to recognize the additional user fields in the client API, and propagate them through the application.
    inferAdditionalFields<typeof auth>(),

    // Tables // Todo: more info here
    adminClient(),
  ],
})

export default authClient
