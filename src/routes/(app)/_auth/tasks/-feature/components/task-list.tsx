import { useState } from "react"
import { PlusIcon } from "lucide-react"
import type { TaskTodoModel } from "@/routes/(app)/_auth/tasks/-feature/tasks.dm.ts"
import { Button } from "@/components/ui/button.tsx"
import { TaskCreateForm } from "@/routes/(app)/_auth/tasks/-feature/components/task-create-form.tsx"
import { TaskCard } from "@/routes/(app)/_auth/tasks/-feature/components/task-card.tsx"

/**
 * Task List Component
 *
 * Displays all tasks with:
 * - Create task button/form
 * - List of TaskCards
 * - Empty state
 */

export function TaskList({ tasks }: { tasks: Array<TaskTodoModel> }) {
  const [isCreating, setIsCreating] = useState(false)

  return (
    <div className="space-y-4">
      {/* Create Task Button / Form */}
      {isCreating ? (
        <TaskCreateForm
          onCancel={() => setIsCreating(false)}
          onCreated={() => setIsCreating(false)}
        />
      ) : (
        <Button onClick={() => setIsCreating(true)} variant="outline">
          <PlusIcon className="mr-2 h-4 w-4" />
          New Task
        </Button>
      )}

      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center text-sm">
          You don't have any task yet. Create one to get started!
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  )
}
