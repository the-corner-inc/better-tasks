import { Button } from "@/components/ui/button.tsx"
import { TodoListInline } from "@/routes/(app)/_auth/tasks/$id/-feature/components/todo-list-inline.tsx"
import { taskDetailQueryOptions } from "@/routes/(app)/_auth/tasks/-feature/tasks.queries.ts"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Link, createFileRoute } from "@tanstack/react-router"
import { ArrowLeftIcon } from "lucide-react"

// ===================================================================
// ROUTE
// ===================================================================
export const Route = createFileRoute("/(app)/_auth/tasks/$id/")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    // no return - the data are stored into the cache
    await context.queryClient.ensureQueryData(taskDetailQueryOptions(params.id))
  },
})

// ===================================================================
// SHOW SPECIFIC TASK WITH INLINE TODOS
// ===================================================================
function RouteComponent() {
  // FETCH THE DATAS FROM THE CACHE
  // Recover the PARAM from the ROUTE
  const { id } = Route.useParams()

  // Recover the data from the cache with help og the param
  const { data } = useSuspenseQuery(taskDetailQueryOptions(id))

  // Extract the task object  (my service returns { task: ... })
  const task = data.task

  return (
    <div className="container min-h-screen space-y-6">
      {/* Back link */}
      <Button variant="ghost" size="sm" asChild>
        <Link to="/tasks">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Tasks
        </Link>
      </Button>

      {/* Task Header */}
      <div>
        <h1 className="text-3xl font-bold">{task.title}</h1>
        <p className="text-muted-foreground text-sm">
          Last updated: {new Date(task.updatedAt).toLocaleString()}
        </p>
      </div>

      {/* Todos CRUD Inline */}
      <div className="max-w-2xl">
        <TodoListInline taskId={task.id} todos={task.todos} />
      </div>
    </div>
  )
}
