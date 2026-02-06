import { Link } from "@tanstack/react-router"
import { CheckIcon, EditIcon, Trash2Icon, XIcon } from "lucide-react"
import { useState } from "react"
import { useServerFn } from "@tanstack/react-start"
import { useQueryClient } from "@tanstack/react-query"
import type { FormEvent} from "react";
import type { TaskTodoModel } from "@/routes/(app)/_auth/tasks/-feature/tasks.dm.ts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { ActionButton } from "@/components/ui/action-button.tsx"
import {
  deleteTask,
  updateTask,
} from "@/routes/(app)/_auth/tasks/-feature/tasks.service.ts"
import {
  TodosPreview,
  TodosStats,
} from "@/routes/(app)/_auth/tasks/-feature/components/todos-preview.tsx"
import { tasksKey } from "@/routes/(app)/_auth/tasks/-feature/tasks.queries.ts"

/**
 * Task Card Component
 *
 * Displays a single task with:
 * - Title (editable inline)
 * - Completion stats
 * - Todos preview (max 4)
 * - Edit/Delete actions
 * - Link to task detail
 */

export function TaskCard({ task }: { task: TaskTodoModel }) {
  // Manipulates the cache
  const queryClient = useQueryClient()

  // Hooks
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [isLoading, setIsLoading] = useState(false)

  // Server Functions
  const updateTaskFn = useServerFn(updateTask)
  const deleteTaskFn = useServerFn(deleteTask)

  async function handleUpdateTitle(event: FormEvent) {
    event.preventDefault()
    if (!editTitle.trim()) return

    setIsLoading(true)
    try {
      await updateTaskFn({ data: { taskId: task.id, title: editTitle } })
      setIsEditing(false)

      // Invalidate the cache for "tasks"
      await queryClient.invalidateQueries({ queryKey: [tasksKey] })
    } catch (err) {
      console.error("Update failed:", err)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete() {
    await deleteTaskFn({ data: { taskId: task.id } })
    // Invalidate the cache
    await queryClient.invalidateQueries({ queryKey: [tasksKey] })
  }

  function handleCancelEdit() {
    setIsEditing(false)
    setEditTitle(task.title)
  }

  return (
    <Card className="hover:bg-muted/30 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          {isEditing ? (
            <form onSubmit={handleUpdateTitle} className="flex flex-1 gap-2">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                autoFocus
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" size="icon-sm" disabled={isLoading}>
                <CheckIcon className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={handleCancelEdit}
                disabled={isLoading}
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </form>
          ) : (
            <>
              <Link to="/tasks/$id" params={{ id: task.id }} className="flex-1">
                <CardTitle className="text-base hover:underline">
                  {task.title}
                </CardTitle>
              </Link>
              <div className="flex items-center gap-1" data-actions>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsEditing(true)
                  }}
                >
                  <EditIcon className="h-4 w-4" />
                </Button>
                <ActionButton
                  action={handleDelete}
                  variant="ghost"
                  size="icon-sm"
                  requireAreYouSure
                  areYouSureDescription="This will delete the task and all its todos."
                >
                  <Trash2Icon className="h-4 w-4" />
                </ActionButton>
              </div>
            </>
          )}
        </div>
        <CardDescription>
          <TodosStats todos={task.todos} />
        </CardDescription>
      </CardHeader>

      {/* Todos Preview */}
      {task.todos && task.todos.length > 0 && (
        <CardContent className="pt-0">
          <TodosPreview taskId={task.id} todos={task.todos} />
        </CardContent>
      )}

      {/* View All Link */}
      <CardContent className="pt-0 pb-3">
        <Link
          to="/tasks/$id"
          params={{ id: task.id }}
          className="text-muted-foreground hover:text-primary text-sm"
        >
          Open task →
        </Link>
      </CardContent>
    </Card>
  )
}
