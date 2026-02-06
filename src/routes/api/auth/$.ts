import { auth } from "@/lib/auth/auth.ts"
import { createFileRoute } from "@tanstack/react-router"

/**
 * Auth API route - Catch-all Handler (Better Auth)
 *
 * Route:
 * - "/api/auth/*"
 * - Every request under "/api/auth/*" is handled here
 * - The $ in the filename catches all sub-routes.
 *
 * Responsibilities:
 * - Act as the HTTP bridge between the browser and Better Auth
 * - Forward auth-related requests to the "auth" server instance
 * - Handle:
 *      - Sign in / up / out
 *      - OAuth callbacks
 *      - Session retrieval
 *
 */

// ======================================================
// HTTP handlers
// ======================================================
export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => auth.handler(request),
      POST: ({ request }) => auth.handler(request),
    },
  },
})
