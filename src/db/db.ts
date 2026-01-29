import {createServerOnlyFn} from "@tanstack/react-start";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres"
import * as schema from './schema.ts'
import { env } from "@/lib/auth/env/server.ts"

/**
 * Make a server function to ensure it will not get executed in the client
 *
 * uses server env. variables.
 */

const client = postgres(env.DATABASE_URL)

const getDatabase = createServerOnlyFn( () =>
    drizzle({
        client,
        schema,
        casing: "snake_case"
    })
)

export const db = getDatabase()

// Old way, not safe for client side
//export const db = drizzle(process.env.DATABASE_URL!, { schema })
