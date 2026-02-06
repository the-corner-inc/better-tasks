import { Checkbox } from "@/components/ui/checkbox.tsx"
import { cn } from "@/lib/utils.ts"
import type { TodoModel } from "@/routes/(app)/_auth/tasks/-feature/tasks.d.ts"
import { Link } from "@tanstack/react-router"

/**
 * Todos Preview Component
 *
 * Shows a preview of todos in task cards:
 * - Max 4 todos displayed
 * - Checkbox (read-only) + content
 * - "View all" link if more todos
 */

const MAX_PREVIEW_TODOS = 4

type Props = {
  taskId: string
  todos: Array<TodoModel>
}

export function TodosPreview({ taskId, todos }: Props) {
  const previewTodos = todos.slice(0, MAX_PREVIEW_TODOS)
  const hasMoreTodos = todos.length > MAX_PREVIEW_TODOS
  const remainingCount = todos.length - MAX_PREVIEW_TODOS

  if (todos.length === 0) {
    return null
  }

  return (
    <div className="space-y-1">
      {previewTodos.map((todo) => (
        <div key={todo.id} className="flex items-center gap-2 text-sm">
          <Checkbox checked={todo.isCompleted} disabled className="pointer-events-none" />
          <span
            className={cn(
              "truncate",
              todo.isCompleted && "text-muted-foreground line-through",
            )}
          >
            {todo.content}
          </span>
        </div>
      ))}

      {hasMoreTodos && (
        <Link
          to="/tasks/$id"
          params={{ id: taskId }}
          className="text-primary text-sm hover:underline"
        >
          + {remainingCount} more... View all
        </Link>
      )}
    </div>
  )
}

/**
 * Todos Stats Component
 *
 * Shows completion stats: "x/y completed" or "No todos yet"
 */
export function TodosStats({ todos }: { todos: Array<TodoModel> }) {
  if (todos.length === 0) {
    return <span>No todos yet</span>
  }

  const completedCount = todos.filter((t) => t.isCompleted).length
  const totalCount = todos.length

  if (totalCount === 0) {
    return <span>No todos yet</span>
  }

  return (
    <span>
      {completedCount}/{totalCount} completed
    </span>
  )
}
