import type {Config} from 'drizzle-kit'
import {env} from "@/lib/auth/env/server.ts"
//import {config} from 'dotenv'

// Todo : DOCUMENT THIS FILE
//config({ path: ['.env.local', '.env'] })

export default {
  out: './src/drizzle',
  schema: './src/lib/db/schema.ts',
  dialect: 'postgresql',
  breakpoints: true,
  verbose: true,
  strict: true,
  casing: "snake_case",
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
} satisfies Config
