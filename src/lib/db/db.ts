import { env } from "@/lib/env/server.ts"
import { createServerOnlyFn } from "@tanstack/react-start"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema.ts"

/**
 * Database Instance - client side safe
 *
 * Creates a Drizzle ORM instance connected to PostgreSQL.
 * Includes all schemas (auth + app) for type-safe queries.
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
