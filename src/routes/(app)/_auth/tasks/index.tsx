import { authQueryOptions } from "@/lib/auth/auth.queries.ts"
import { TaskList } from "@/routes/(app)/_auth/tasks/-feature/components/task-list.tsx"
import { tasksListQueryOptions } from "@/routes/(app)/_auth/tasks/-feature/tasks.queries.ts"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/(app)/_auth/tasks/")({
  component: TasksListPage,
  loader: async ({ context }) => {
    // user is guaranteed by (_auth) beforeLoad, but keeping this pattern good
    await context.queryClient.ensureQueryData(authQueryOptions())

    // no return - the data are stored into the cache
    await context.queryClient.ensureQueryData(tasksListQueryOptions())
  },
})


function TasksListPage() {

  const { data: user } = useSuspenseQuery(authQueryOptions())
  const { data: tasks } = useSuspenseQuery(tasksListQueryOptions())

  return (
    <div className="container min-h-screen space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Tasks</h1>
        <p className="text-muted-foreground">Logged in as {user?.name || user?.email}</p>
      </div>

      <TaskList tasks={tasks} />
    </div>
  )
}
