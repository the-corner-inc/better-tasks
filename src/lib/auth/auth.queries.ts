import {queryOptions} from "@tanstack/react-query";
import {$getSession, $getUser, $getUsers} from "@/lib/auth/auth.functions.ts";

// Todo : How it it used exactly ?
/**
 * Auth - Query Options
 *
 * React Query options for auth data fetching.
 * Provides client-side caching to reduce server calls.
 *
 * Usage:
 * - In routes: context.queryClient.prefetchQuery(authQueryOptions())
 * - In components: useSuspenseQuery(authQueryOptions())
 *
 * Benefits:
 * - Automatic caching and deduplication
 * - Background refetching
 * - Optimistic updates support
 */

// ====================== QUERY OPTIONS ======================


/**
 * Query options for the current user
 * Most commonly used - returns user data or null
 */
export const authQueryOptions = () =>
    queryOptions({
        // UNIQUE ID IN THE CACHE
        queryKey: ["user"],
        // QUERY MADE TO THE SERVER IF THE DATA IS STALE OR NOT IN CACHE
        queryFn: ({ signal }) => $getUser({ signal }),
        staleTime: 1000 * 60 * 1, // cache for 1 minute to reduce server calls
    })

/**
 * Query options for the users
 * Most commonly used - returns users data or null
 */
export const usersQueryOptions = () =>
    queryOptions({
        queryKey: ["users"],
        queryFn: ({ signal }) => $getUsers({ signal }),
        staleTime: 1000 * 60 * 1, // cache for 1 minute to reduce server calls
    })

/**
 * Query options for the full session
 * Use when you need session metadata alongside user data
 */
export const sessionQueryOptions = () =>
    queryOptions({
        queryKey: ["session"], // NOM DE L'OBJET TANSTACK DANS LE CACHE
        // QUERY SERA STOCKE DANS LE QUERY-KEY
        queryFn: ({ signal }) => $getSession({ signal }),
        staleTime: 1000 * 60 * 1, // cache for 1 minute to reduce server calls
    })


// ====================== QUERY OPTIONS ======================
// Type exports for use in components and routes
export type AuthQueryResult = Awaited<ReturnType<typeof $getUser>>
export type UsersQueryResult = Awaited<ReturnType<typeof $getUsers>>
export type SessionQueryResult = Awaited<ReturnType<typeof $getSession>>