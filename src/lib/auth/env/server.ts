import { createEnv } from "@t3-oss/env-core"
import * as z from "zod"

/**
 * server.ts
 *
 * Server-side environment variables configuration.
 *
 * This file:
 * - Centralizes all sensitive environment variables (database, secrets, OAuth)
 * - Validates their presence and format at startup
 * - Prevents any secret from leaking into the client bundle
 *
 * !!! ABSOLUTE RULE !!! :
 * This file must NEVER be imported in code that runs on the client
 * (React components, hooks, browser utilities).
 *
 * Runtime context:
 * - Node.js only
 * - Access via `process.env`
 *
 * Typical use cases:
 * - Database connection (Drizzle)
 * - Authentication (Better Auth secrets, OAuth providers)
 * - Server-generated URLs (callbacks, redirects)
 *
 * Why this file exists:
 * - TanStack Start shares code between client and server
 * - Without explicit separation, secrets can leak into the client bundle
 * - `createEnv` + `zod` provide safety, validation, and early failure
 */


export const env = createEnv({
    server: {
        DATABASE_URL: z.url(),
        VITE_BASE_URL: z.url().default("http://localhost:3000"),
        BETTER_AUTH_SECRET: z.string().min(1),

        // OAuth2 providers, optional, update as needed
        GITHUB_CLIENT_ID: z.string().optional(),
        GITHUB_CLIENT_SECRET: z.string().optional(),
    },
    runtimeEnv: process.env,
})