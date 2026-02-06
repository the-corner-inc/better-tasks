import { auth } from "@/lib/auth/auth.ts"
import { createFileRoute } from "@tanstack/react-router"

/**
 * TODO : UPDATE THIS INFORMATION FROM NEXT.JS
 * Auth API route - Catch-all Handler (Better Auth)
 *
 * Route:
 * - "/api/auth/*"
 * - Every request under "/api/auth/*" is handled here
 * - The $ in the filename catches all sub-routes.
 *
 * Description:
 * Mount the Better Auth handler.
 * To handle API requests, you need to set up a route handler on your server.
 * A mount handler is responsible for processing incoming requests and sending appropriate responses.
 *
 *
 * Entry points:
 * - Exports HTTP methods (GET, POST, etc...) delegated to Better Auth
 *
 * Responsibilities:
 * - Act as the HTTP bridge between the browser and Better Auth
 * - Forward auth-related requests to the "auth" server instance
 * - Handle:
 *      - Sign in / up / out
 *      - OAuth callbacks
 *      - Session retrieval
 *
 * Usage :
 * - Never called directly by application code
 * - Automatically used by:
 *      - "authClient" (so the browser)
 *      - OAuth providers redirects
 *      - Cookies-based session checks
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

// ======================================================
// ArcJet security options
// ======================================================
// We limit rate limiting to POST method only for security reasons (to prevent brute-force attacks on sign-in/sign-up).
// Todo : Implement
