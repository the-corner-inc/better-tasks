import { env } from "@/lib/env/server.ts"
import { createServerOnlyFn } from "@tanstack/react-start"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema.ts"

/**
 * Database Instance
 *
 * Creates a Drizzle ORM instance connected to PostgreSQL.
 * Includes all schemas (auth + app) for type-safe queries.
 *
 * Make a server function to ensure it will not get executed in the client (client side safe).
 * uses "server env." variables.
 */

/** TODO : UPDATE INFORMATION FORM NEXT.JS HERE
 * Database Connection setup using Drizzle ORM
 *
 * This file :
 * - Creates the Drizzle ORM instance "drizzle()"
 *      - Connects to PostgreSQL via the DATABASE_URL .env variable
 *      - Imports all schemas for the relational query builder
 * - Is exports the as {db} elsewhere
 */

const client = postgres(env.DATABASE_URL)

const getDatabase = createServerOnlyFn(() =>
  drizzle({
    client,
    schema,
    casing: "snake_case",
  }),
)

export const db = getDatabase()

// Old way, not safe for client side
// export const db = drizzle(process.env.DATABASE_URL!, { schema })
