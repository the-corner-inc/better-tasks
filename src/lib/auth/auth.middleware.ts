import { auth } from "@/lib/auth/auth.ts"
import { createMiddleware } from "@tanstack/react-start"
import {
  getRequest,
  setResponseHeader,
  setResponseStatus,
} from "@tanstack/react-start/server"

/**
 * Middleware
 *
 * TanStack middleware for protecting server functions and routes.
 * https://tanstack.com/start/latest/docs/framework/react/guide/middleware
 *
 * Types of middleware :
 * - Request middleware : used to customize a behavior of any server request
 * - Server function : used to customize the behavior of server function specifically
 *
 * Used for :
 * - Authentication: Verify a user's identity before executing a server function.
 * - Authorization: Check if a user has the necessary permissions to execute a server function.
 * - Logging: Log requests, responses, and errors.
 * - CSP: Configure Content Security Policy and other security measures.
 * - Observability: Collect metrics, traces, and logs.
 * - Provide Context: Attach data to the request object for use in other middleware or server functions.
 * - Error Handling: Handle errors in a consistent way.
 *
 * Usage in routes:
 * export const Route = createFileRoute('/dashboard')({
 *   server: {
 *     middleware: [authMiddleware],
 *   },
 * })
 *
 *
 * Usage in server functions:
 * const $protectedFn = createServerFn({ method: 'GET' })
 *    .middleware([authMiddleware])
 *    .handler(({ context }) => {
 *      // context.user is available and typed
 *    })
 *
 */

// ================================================================
// Middleware Authentication - Session & Cookies
// ================================================================

/**
 * Middleware to enforce authentication
 * - Validates session on every request
 * - Forwards cookie headers for session refresh
 * - Adds user to context for downstream handlers
 * - Returns 401 if not authenticated
 */
export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: getRequest().headers,
    query: {
      // Ensure session is fresh
      // https://www.better-auth.com/docs/concepts/session-management#session-caching
      disableCookieCache: true,
    },
    returnHeaders: true,
  })

  // Forward any Set-Cookie headers to the client, e.g. for session/cache refresh
  const cookies = session.headers.getSetCookie()
  if (cookies.length) {
    setResponseHeader("Set-Cookie", cookies)
  }

  // Return 401 if not authenticated
  if (!session.response?.user) {
    setResponseStatus(401)
    throw new Error("Unauthorized")
  }

  // Pass user to the next handler via context
  return next({ context: { user: session.response.user } })
})
