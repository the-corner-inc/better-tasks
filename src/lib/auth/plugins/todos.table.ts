import {BetterAuthPlugin} from "better-auth";

/**
 * Custom User Fields Plugin
 *
 * This plugin defines additional fields for the user table.
 * Better Auth CLI will auto-generate the database schema.
 *
 * 4 Field options:
 * - type:      "string" | "number" | "boolean" | "date"
 * - required:  boolean (default: false) - if required on new record
 * - unique:    boolean (default: false) - if field should be unique
 * - input:     boolean (default: true)  - if user can set this field themselves
 *   !!! Set to false for sensitive fields like "role" to prevent users from self-assigning roles !!!
 *
 * Usage:
 * 1. Import in auth.ts: plugins: [customUserFieldsPlugin()]
 * 2. Run: npx @better-auth/cli generate
 * 3. Run: npx drizzle-kit push (or your migration command)
 */

export const todosTablePlugin = () => {
    return {
        id: "todosTablePlugin",
        schema: {
            // Name of the Table in the DB
            Tasks: {
                fields: {
                    title: {type: "string", required: true},
                    userId: {type: "string", required: true},
                }
            },
            // Name of the Table in the DB
            Todos: {
                fields: {
                    taskId: {type: "string", required: true},
                    title: {type: "string", required: true},
                    isComplete: {type: "boolean",required: true},
                }
            }
        }
    } satisfies BetterAuthPlugin
}