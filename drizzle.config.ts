import { env } from "@/lib/env/server.ts"
import type { Config } from "drizzle-kit"

export default {
  out: "./drizzle",
  schema: "./src/lib/db/schema.ts",
  dialect: "postgresql",
  breakpoints: true,
  verbose: true,
  strict: true,
  casing: "snake_case",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config
