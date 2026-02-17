import { createEnv } from "@t3-oss/env-core"
import * as z from "zod"

/**
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
 */

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_BASE_URL: z.url().default("http://localhost:3000"),
  },
  runtimeEnv: import.meta.env,
})
