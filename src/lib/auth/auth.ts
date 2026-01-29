import { betterAuth } from 'better-auth'
import {tanstackStartCookies} from "better-auth/tanstack-start";
import {createServerOnlyFn} from "@tanstack/react-start";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import {db} from "@/lib/db/db.ts";
import * as schema from "@/lib/db/schema.ts"
import { env } from "@/lib/env/server.ts"
import {admin} from "better-auth/plugins";



/** TODO: UPDATE FORM NEXTJS DOCS
 * Auth - Server configuration
 *
 * Is the source of truth for all auth configuration.
 *
 * Responsibilities:
 * - Configure Better Auth
 * - Declare authentication providers
 * - Define the session/user model exposed to the app
 * - Binds Better Auth to the Drizzle ORM
 *
 * Usage:
 * - Imported only on the server side
 * - Used by :
 *      - Server Components & Actions
 *      - Route handlers
 *
 * Constraints:
 * - Server-only
 * - Can access secrets and environments variables
 * - Acts as the single source of truth for Auth behaviors
 */


const getAuthConfig = createServerOnlyFn( () =>
  betterAuth({

    // Base URL for auth callbacks
    baseURL: env.VITE_BASE_URL,

    // Authentication Methods
    emailAndPassword: {
      enabled: true,
    },

    // OAuth Social Providers
    // https://www.better-auth.com/docs/concepts/oauth
    socialProviders: {
      github: {
        clientId: env.GITHUB_CLIENT_ID! as string,
        clientSecret: env.GITHUB_CLIENT_SECRET! as string,
      },
        google: {
            clientId: env.GOOGLE_CLIENT_ID! as string,
            clientSecret: env.GOOGLE_CLIENT_SECRET! as string,
        }
    },

    // Database configuration with Drizzle adapter
    database: drizzleAdapter( db, {provider: "pg", schema} ),

    // Session configuration with cookie caching. Reduces the calls to the DB
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60,   // 5 minutes cache for session cookies for the user
      },
    },

      // Disable telemetry for privacy
      telemetry: {
      enabled: false,
    },

    // User configuration
    user: {
      // https://www.better-auth.com/docs/concepts/users-accounts#delete-user
      deleteUser: {
        enabled: true,
      },

      // Additional user fields (extend as needed)
      // https://www.better-auth.com/docs/concepts/typescript#additional-fields
      additionalFields: {

      },
    },

    // Plugins - IMPORTANT: tanstackStartCookies MUST be last!
    // https://www.better-auth.com/docs/integrations/tanstack#usage-tips
    plugins: [
        // Table
        admin(), //Todo : Get more infos on this and why it allows me to do "auth.api.listUsers"

        // Core
        tanstackStartCookies(),
    ],

    // Experimental features
    experimental: {
        // Enable Drizzle joins for better query performance
        // https://www.better-auth.com/docs/adapters/drizzle#joins-experimental
        joins: true,
      },
  })
)

export const auth = getAuthConfig()