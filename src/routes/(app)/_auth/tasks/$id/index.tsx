import {createFileRoute, Link} from '@tanstack/react-router'
import {Button} from "@/components/ui/button.tsx";
import {ArrowLeftIcon} from "lucide-react";
import {TodoListInline} from "@/routes/(app)/_auth/tasks/$id/-components/todo-list-inline.tsx";
import {taskDetailQueryOptions} from "@/routes/(app)/_auth/tasks/-feature/tasks.queries.ts";
import {useSuspenseQuery} from "@tanstack/react-query";


// ===================================================================
// ROUTE
// ===================================================================
export const Route = createFileRoute('/(app)/_auth/tasks/$id/')({
  component: RouteComponent,
  loader: async ({ context, params }) => {

    // no return - the data are stored into the cache
    await context.queryClient.ensureQueryData(taskDetailQueryOptions( params.id ))
  }
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
      <div className="min-h-screen container space-y-6">

          {/* Back link */}
          <Button variant="ghost" size="sm" asChild>
              <Link to="/tasks">
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Back to Tasks
              </Link>
          </Button>

          {/* Task Header */}
          <div>
              <h1 className="text-3xl font-bold">{task.title}</h1>
              <p className="text-sm text-muted-foreground">
                  Last updated: {new Date(task.updatedAt).toLocaleString()}
              </p>
          </div>

          {/* Todos CRUD Inline */}
          <div className="max-w-2xl">
              <TodoListInline
                  taskId={task.id}
                  todos={task.todos} />
          </div>
      </div>
  )
}
