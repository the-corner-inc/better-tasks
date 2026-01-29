import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { DefaultCatchBoundary } from "@/components/default-catch-boundary"
import { DefaultNotFound } from "@/components/default-not-found"

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import {QueryClient} from "@tanstack/react-query";

/**
 * Router Factory
 *
 * Creates the TanStack Router with:
 * - QueryClient for data fetching and caching
 * - SSR/Query integration for optimal hydration
 * - Default error handling
 */

// Create a new router instance
export function getRouter()  {

  // Configure QueryClient with sensible defaults
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,    // Don't refetch on window focus for better UX
        staleTime: 1000 * 60 * 2,       // Cache data for 2 minutes
        retry: 3,                       // Retry failed queries up to 3 times
      }
    }
  })

  // Create the router
  const router = createRouter({
    routeTree,
    context: { queryClient, user: null },
    defaultPreload: 'intent',
    // react-query will handle data fetching & caching
    // https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#passing-all-loader-events-to-an-external-cache
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: DefaultNotFound,
    scrollRestoration: true,
    defaultStructuralSharing: true,         // Enable for better performance
  })

  // Set up SSR + Query integration
  // This ensures proper hydration of query data from server to client
  setupRouterSsrQueryIntegration({
    router,
    queryClient,
    handleRedirects: true,
    wrapQueryClient: true,
  })

  return router
}

// Todo : Document this to see if usable or not
// Type declaration for router
/*declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}*/
