import { createFileRoute } from '@tanstack/react-router'
import {authQueryOptions} from "@/lib/auth/auth.queries.ts";
import {getTasksList} from "@/routes/(app)/_auth/tasks/-feature/tasks.service.ts";
import {useSuspenseQuery} from "@tanstack/react-query";
import {TaskList} from "@/routes/(app)/_auth/tasks/-feature/components/task-list.tsx";


// ===================================================================
// ROUTE
// ===================================================================
export const Route = createFileRoute('/(app)/_auth/tasks/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    // user is guaranteed by (_auth) beforeLoad, but keeping this pattern good
    await context.queryClient.ensureQueryData(authQueryOptions());

    // fetch tasks with todos
    return await getTasksList()
  }
})


// ===================================================================
// SHOWS THE TASKS
// ===================================================================
function RouteComponent() {

  const { data: user } = useSuspenseQuery(authQueryOptions())
  const tasks  = Route.useLoaderData()

  return (
    <div className="min-h-screen container space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          My Tasks
        </h1>
        <p className="text-muted-foreground">
          Logged in as {user?.name || user?.email}
        </p>
      </div>

      <TaskList tasks={tasks} />

    </div>
  )
}
