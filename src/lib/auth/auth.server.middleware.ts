import { createMiddleware } from "@tanstack/react-start"
import {auth} from "@/lib/auth/auth.ts";
import {getRequest, setResponseHeader, setResponseStatus} from "@tanstack/start-server-core";

// TODO :UNDERSTAND THIS FILE BETTER

/**
 * Middleware
 *
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
 * - And many more! The possibilities are up to you!
 */

// ================================================================
// Middleware Authentication - Session & Cookies
// ================================================================

export const authMiddleware = createMiddleware()
    .server( async ({ next }) => {

        const session = await auth.api.getSession({
            headers: getRequest().headers,
            query: {
            // ensure session is fresh
            // https://www.better-auth.com/docs/concepts/session-management#session-caching
            disableCookieCache: true,
            },
            returnHeaders: true,
        })

        // Forward any Set-Cookie headers to the client, e.g. for session/cache refresh
        const cookies = session.headers?.getSetCookie()
        if (cookies?.length) {
            setResponseHeader("Set-Cookie", cookies)
        }

        if (!session?.response?.user) {
            setResponseStatus(401)
            throw new Error("Unauthorized")
        }

        return next({ context: { user: session.response.user } })
})


