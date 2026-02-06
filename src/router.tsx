import { DefaultCatchBoundary } from "@/components/default-catch-boundary"
import { DefaultNotFound } from "@/components/default-not-found"
import { QueryClient } from "@tanstack/react-query"
import { createRouter } from "@tanstack/react-router"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"
import { routeTree } from "./routeTree.gen"


/**
 * Router Factory
 *
 * Creates the TanStack Router with:
 * - QueryClient for data fetching and caching
 * - SSR/Query integration for optimal hydration
 * - Default error handling
 */

export function getRouter() {

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 2, // 2 minutes
        retry: 3,
      },
    },
  })

  const router = createRouter({
    routeTree,
    context: { queryClient, user: null },
    defaultPreload: "intent",
    // react-query will handle data fetching & caching
    // https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#passing-all-loader-events-to-an-external-cache
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: DefaultNotFound,
    scrollRestoration: true,
    defaultStructuralSharing: true, // Enable for better performance
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
