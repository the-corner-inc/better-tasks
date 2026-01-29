/**
 * Auth Module - Public API
 *
 * Re-exports all auth-related functionality for easy imports.
 *
 * Usage:
 * import { auth, authClient, authQueryOptions } from "@/lib/auth"
 */

// ====================== SERVER-SIDE AUTH INSTANCE =====================================
export {auth} from "@/lib/auth/auth.ts"

// ====================== CLIENT-SIDE AUTH INSTANCE =====================================
export {default as authClient} from "@/lib/auth/auth-client.ts"

// ====================== SERVER FUNCTIONS ==============================================
export {
    $getUser,
    $getUsers,
    $getSession,
    $getCurrentUserId
} from "@/lib/auth/auth.server.functions.ts"

// ====================== REACT QUERY OPTIONS ===========================================
export {
    authQueryOptions,
    usersQueryOptions,
    sessionQueryOptions,
    type AuthQueryResult,
    type UsersQueryResult,
    type SessionQueryResult
} from "@/lib/auth/auth.server.queries.ts"

// ====================== MIDDLEWARE ====================================================
export { authMiddleware } from "@/lib/auth/auth.server.middleware.ts"


// ====================== OAUTH PROVIDERS CONFIGURATION =================================
export {
    SUPPORTED_OAUTH_PROVIDER_DETAILS,
    SUPPORTED_OAUTH_PROVIDERS,
    type SupportedOAuthProvider,
} from "@/lib/auth/o-auth-providers.ts"

