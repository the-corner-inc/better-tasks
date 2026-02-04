import { createFileRoute } from '@tanstack/react-router'
import {getTaskById} from "@/routes/(app)/_auth/tasks/-feature/tasks.service.ts";

// ===================================================================
// ROUTE
// ===================================================================
export const Route = createFileRoute('/(app)/_auth/tasks/$id/')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const taskResult = await getTaskById({ data: { taskId: params.id } })

    return taskResult
  }
})


// ===================================================================
// SHOW SPECIFIC TASK
// ===================================================================
function RouteComponent() {

  const {task} = Route.useLoaderData()

  return (
      <div className="min-h-screen container space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            {task.title}
          </h1>
          <p>
            TODO : Here we will display the todos inline (next step)
          </p>
        </div>

        <div className="rounded-lg border p-4 text-sm text-muted-foreground">
          TODO: Todos UI (Inline add/edit/toggle) will live here
        </div>
      </div>
  )
}
