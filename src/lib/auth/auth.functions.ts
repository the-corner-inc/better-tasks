import {createServerFn} from "@tanstack/react-start";
import {auth} from "@/lib/auth/auth.ts";
import {getRequest, setResponseHeader} from "@tanstack/start-server-core";
import {AuthQueryResult} from "@/lib/auth/auth.queries.ts";

// TODO :UNDERSTAND THIS FILE BETTER

/**
 * Auth - Server Functions
 *
 * Server-side functions for session management.
 * These run on the server and handle cookie forwarding properly.
 *
 * Best Practice:
 * - Use createServerFn for all auth operations that need server context
 * - Forward Set-Cookie headers to handle session refresh
 * - Use with React Query for client-side caching
 */

/**
 * Get the current authenticated user.
 * Returns the user object or null if not authenticated.
 */
export const $getUser = createServerFn({ method: "GET" })
    .handler(async () => {
        const session = await auth.api.getSession({
            headers: getRequest().headers,
            returnHeaders: true
        })

        // Important : Forward any Set-Cookie headers to the client,
        // This is critical for session/cache refresh to work properly
        const cookies = session.headers?.getSetCookie()
        if (cookies?.length) {
            setResponseHeader("Set-Cookie", cookies)
        }

        return session.response?.user || null
    })

export const $getUsers = createServerFn({ method: "GET" })
    .handler(async () => {
        const response = await auth.api.listUsers({
            headers: getRequest().headers,
            query: {
                limit: 100
            }
        })

        // Todo: Cookies forwarding here ?

        return response.users as AuthQueryResult[]
    })

/**
 * Get the current session (includes both user and session data)
 * Useful when you need session metadata (e.g., expiration, IP)
 */
export const $getSession = createServerFn({ method: "GET" })
    .handler(async () => {
        const session = await auth.api.getSession({
            headers: getRequest().headers,
            returnHeaders: true,
        })

        // Forward Set-Cookie headers
        const cookies = session.headers?.getSetCookie()
        if (cookies?.length) {
            setResponseHeader("Set-Cookie", cookies)
        }

        return session.response || null
})

/**
 * Get the current user ID (throws if not authenticated)
 * Use this when you need to ensure the user is logged in
 */
export const $getCurrentUserId = createServerFn({ method: "GET" })
    .handler(async () => {
        const session = await auth.api.getSession({
            headers: getRequest().headers,
        })

        if(!session?.user?.id) {
            throw new Error("Not authenticated")
        }

        return session.user.id
    })




