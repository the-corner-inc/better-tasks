import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent } from "@/components/ui/card.tsx"
import { Input } from "@/components/ui/input.tsx"
import { LoadingSwap } from "@/components/ui/loading-swap.tsx"
import { tasksKey } from "@/routes/(app)/_auth/tasks/-feature/tasks.queries.ts"
import { createTask } from "@/routes/(app)/_auth/tasks/-feature/tasks.service.ts"
import { useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { PlusIcon } from "lucide-react"
import type { FormEvent } from "react"
import { useRef, useState } from "react"

/**
 * Task Create Form Component
 *
 * Inline form to create a new task.
 * Based on TodoForm pattern.
 */

type Props = {
  onCancel: () => void
  onCreated?: () => void
}

export function TaskCreateForm({ onCancel, onCreated }: Props) {
  // Cache manipulate
  const queryClient = useQueryClient()

  // Hooks
  const inputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Server function
  const createTaskFn = useServerFn(createTask)

  // Functions
  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    const title = inputRef.current?.value
    if (!title?.trim()) {
      setError("Title is required")
      return
    }

    setIsLoading(true)

    try {
      await createTaskFn({ data: { title } })
      onCreated?.()
      // Invalidate the cache
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
    <Card>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            ref={inputRef}
            autoFocus
            placeholder="Task title..."
            disabled={isLoading}
            aria-label="Task title"
          />
          {error && <p className="text-destructive text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading} size="sm">
              <LoadingSwap isLoading={isLoading} className="flex items-center gap-2">
                <PlusIcon className="h-4 w-4" /> Create
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
        </form>
      </CardContent>
    </Card>
  )
}
