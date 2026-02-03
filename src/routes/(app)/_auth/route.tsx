

/**
 * Protected Layout Route for (_auth)
 *
 * This layout:
 * 1. Checks authentication in beforeLoad (server-side)
 * 2. Redirects to /auth/login if not authenticated
 * 3. Provides a header with user info and sign out
 * 4. Renders child routes via <Outlet />
 *
 * All routes under (app)/ are protected by this layout.
 */

