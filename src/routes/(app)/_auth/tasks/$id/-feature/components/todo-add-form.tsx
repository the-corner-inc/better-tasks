import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { LoadingSwap } from "@/components/ui/loading-swap.tsx"
import { createTodo } from "@/routes/(app)/_auth/tasks/$id/-feature/todos.service.ts"
import type { TodoModel } from "@/routes/(app)/_auth/tasks/-feature/tasks.dm.ts"
import { tasksKey } from "@/routes/(app)/_auth/tasks/-feature/tasks.queries.ts"
import { useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { PlusIcon } from "lucide-react"
import type { FormEvent } from "react"
import { useRef, useState } from "react"

/**
 * Todos Add Form Component
 *
 * Based on original TodoForm pattern:
 * - Inline form with input + button
 * - Error handling
 * - Loading state with LoadingSwap
 */

type Props = {
  taskId: string
  onCancel: () => void
  onCreated: (todo: TodoModel) => void
}

export function TodoAddForm({ taskId, onCancel, onCreated }: Props) {
  // Cache manipulation
  const queryClient = useQueryClient()

  // Hooks
  const inputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Server function
  const createTodoFn = useServerFn(createTodo)

  // Functions
  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    const content = inputRef.current?.value
    if (!content?.trim()) {
      setError("Content is required")
      return
    }

    setIsLoading(true)

    try {
      const newTodo = await createTodoFn({
        data: { taskId, content },
      })
      onCreated(newTodo)
      // Invalidate Cache
      await queryClient.invalidateQueries({ queryKey: [tasksKey] })
    } catch (err) {
      // Handle redirect responses (Tanstack pattern)
      if (err instanceof Response) throw err
      if (typeof err === "object" && err !== null && "redirect" in err) throw err

      // Real error
      console.error("Submit failed:", err)
      setError("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  // Render
  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <Input
          autoFocus
          ref={inputRef}
          placeholder="What needs to be done?"
          className="flex-1"
          aria-label="Todo content"
          disabled={isLoading}
        />
        <Button type="submit" size="sm" disabled={isLoading}>
          <LoadingSwap isLoading={isLoading} className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" /> Add
          </LoadingSwap>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
      {error && <p className="text-destructive text-sm text-red-600">{error}</p>}
    </form>
  )
}
