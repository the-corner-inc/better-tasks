import {createFileRoute, Link} from '@tanstack/react-router'
import { getTaskByIdWithTodos} from "@/routes/(app)/_auth/tasks/-feature/tasks.service.ts";
import {Button} from "@/components/ui/button.tsx";
import {ArrowLeftIcon} from "lucide-react";
import {TodoListInline} from "@/routes/(app)/_auth/tasks/-feature/components/todo-list-inline.tsx";

// ===================================================================
// ROUTE
// ===================================================================
export const Route = createFileRoute('/(app)/_auth/tasks/$id/')({
  component: RouteComponent,
  loader: async ({ params }) => {
    //const taskResult = await getTaskById({ data: { taskId: params.id } })
    const taskResult = await getTaskByIdWithTodos({ data: { taskId: params.id } })


      return taskResult
  }
})


// ===================================================================
// SHOW SPECIFIC TASK WITH INLINE TODOS
// ===================================================================
function RouteComponent() {

  const {task} = Route.useLoaderData()

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
