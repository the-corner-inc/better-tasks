import {queryOptions} from "@tanstack/react-query";
import {$getUser, $getUsers} from "@/lib/auth/auth.server.functions.ts";

// TODO :UNDERSTAND THIS FILE BETTER
export const authQueryOptions = () =>
    queryOptions({
        queryKey: ["user"],
        queryFn: ({ signal }) => $getUser({ signal }),
    })


export const userQueryOptions = () =>
    queryOptions({
        queryKey: ["users"],
        queryFn: ({ signal }) => $getUsers({ signal }),
    })


export type AuthQueryResult = Awaited<ReturnType<typeof $getUser>>
export type UsersQueryResult = Awaited<ReturnType<typeof $getUsers>>