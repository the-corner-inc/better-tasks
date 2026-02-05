import {
  HeadContent,
  Scripts,
  createRootRouteWithContext, Outlet,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import appCss from '../styles.css?url'
import type { QueryClient } from '@tanstack/react-query'
import {authQueryOptions, AuthQueryResult} from "@/lib/auth/auth.queries.ts";
import {Toaster} from "sonner";
import {ReactQueryDevtoolsPanel} from "@tanstack/react-query-devtools";

/**
 * Root Route
 *
 * The root layout for the entire application.
 * Handles:
 * - Global head content (meta, styles)
 * - Auth prefetching for optimal UX
 * - DevTools in development
 * - Toast notifications
 */

interface MyRouterContext {
  queryClient: QueryClient,
  user: AuthQueryResult
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: ({ context }) => {
    // Prefetch auth data for optimal UX
    // We use React Query for client-side caching to reduce client-to-server calls,  see /src/router.tsx
    // Better Auth's cookieCache also reduces server-to-db calls, /src/lib/auth/auth.ts
    context.queryClient.prefetchQuery( authQueryOptions() )

    // Note: typically we don't need the user immediately in landing pages,
    // so we're only prefetching here and not awaiting.
    // for protected routes with loader data, see /_auth/route.tsx
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8',},
      { name: 'viewport', content: 'width=device-width, initial-scale=1',},
      { title: 'Better Tasks', },
      { name: "description", content: "Task management website"}
    ],
    links: [
      { rel: 'stylesheet', href: appCss,},
      { rel: "icon", href: "https://assets.the-corner.io/logos/the_corner-icon-filled.webp"}
    ],
  }),

  component: RootComponent,
})

function RootComponent() {
  return (
      <RootDocument>
        <Outlet />
      </RootDocument>
  )
}

function RootDocument({ children }: { readonly children: React.ReactNode }) {
  return (
      // suppress since we're updating the "dark" class in ThemeProvider //Todo: remove classname Dark below
      <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background antialiased">

        {children}

        {/* Toast notifications */}
        <Toaster richColors position="top-right" />

        {/* DevTools - only in development */}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: "TanStack Query",
              render: <ReactQueryDevtoolsPanel />,
            },
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
