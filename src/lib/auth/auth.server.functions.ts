import {createServerFn} from "@tanstack/react-start";
import {auth} from "@/lib/auth/auth.ts";
import {getRequest, setResponseHeader} from "@tanstack/start-server-core";
import {AuthQueryResult} from "@/lib/auth/auth.server.queries.ts";

// TODO :UNDERSTAND THIS FILE BETTER
export const $getUser = createServerFn({ method: "GET" })
    .handler(async () => {
        const session = await auth.api.getSession({
            headers: getRequest().headers,
            returnHeaders: true
        })

        // Important : Forward any Set-Cookie headers to the client, e.g. for session/cache refresh
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

        return response.users as AuthQueryResult[]
    })


