import {createFileRoute, Outlet} from '@tanstack/react-router'

export const Route = createFileRoute('/(public)')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <main className="container py-8">
          <Outlet/>
      </main>
  )
}
