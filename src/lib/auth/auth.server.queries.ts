import {queryOptions} from "@tanstack/react-query";
import {$getUser, $getUsers} from "@/lib/auth/auth.server.functions.ts";

// TODO :UNDERSTAND THIS FILE BETTER
// React Query pour le Caching Client
// Réduit les appels serveur avec du caching intelligent :

export const authQueryOptions = () =>
    queryOptions({
        queryKey: ["user"],
        queryFn: ({ signal }) => $getUser({ signal }),
        staleTime: 1000 * 60 * 1, // 1 minute
    })


export const userQueryOptions = () =>
    queryOptions({
        queryKey: ["users"],
        queryFn: ({ signal }) => $getUsers({ signal }),
        staleTime: 1000 * 60 * 1, // 1 minute
    })


export type AuthQueryResult = Awaited<ReturnType<typeof $getUser>>
export type UsersQueryResult = Awaited<ReturnType<typeof $getUsers>>