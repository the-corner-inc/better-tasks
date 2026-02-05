import { createEnv } from "@t3-oss/env-core"
import * as z from "zod"

/**
 * client.ts
 *
 * Client-side (browser) environment variables configuration.
 *
 * This file:
 * - Exposes only public environment variables
 * - Ensures only variables prefixed with `VITE_` are accessible
 * - Provides type-safe access to `import.meta.env`
 *
 * !!! SECURITY RULE !!!
 * No secrets must ever appear in this file.
 * Everything defined here is visible in the browser.
 *
 * Runtime context:
 * - Browser only
 * - Access via `import.meta.env` (Vite)
 *
 * Why the `VITE_` prefix:
 * - Vite only exposes environment variables with this prefix
 * - This acts as an intentional security boundary
 *
 * Typical use cases:
 * - Public URLs
 * - UI configuration
 * - Non-sensitive feature flags
 *
 * Why this file exists:
 * - Clear separation between client and server environments
 * - Avoid direct usage of `import.meta.env` across the app
 * - Provide validation and strong typing on the client
 */


export const env = createEnv({
    clientPrefix: "VITE_",
    client: {
        VITE_BASE_URL: z.url().default("http://localhost:3000"),
    },
    runtimeEnv: import.meta.env,
})