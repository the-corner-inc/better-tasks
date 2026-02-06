import { queryOptions } from "@tanstack/react-query"
import {
  getTaskByIdWithTodos,
  getTasksList,
} from "@/routes/(app)/_auth/tasks/-feature/tasks.service.ts"

/**
 * Query Options - (React Query Cache)
 *
 * React Query options for tasks data fetching.
 * Provides client-side caching to reduce server calls.
 *
 * FLOW:
 * 1. Route loader calls: context.queryClient.ensureQueryData(tasksQueryOptions())
 * 2. React Query checks cache:
 *    - If fresh data exists → returns from cache (no server call)
 *    - If stale → returns cache + refetches in background
 *    - If no data → calls queryFn (server function)
 * 3. Component uses: useSuspenseQuery(tasksQueryOptions())
 *    - Gets data from cache (already loaded by loader)
 *
 * CACHE INVALIDATION:
 * After mutations (create/update/delete), invalidate with:
 *   queryClient.invalidateQueries({ queryKey: ["tasks"] })
 */

// ==================================================================
// CACHE KEY ID's
// ==================================================================
export const tasksKey = "tasks"

// ==================================================================
// QUERY OPTIONS
// ==================================================================
/** Query options for the list of all tasks (with todos). */
export const tasksListQueryOptions = () =>
  queryOptions({
    queryKey: [tasksKey],
    queryFn: ({ signal }) => getTasksList({ signal }),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })

/** Query option for a single task with its todos */
export const taskDetailQueryOptions = (taskId: string) =>
  queryOptions({
    queryKey: [tasksKey, taskId],
    queryFn: ({ signal }) => getTaskByIdWithTodos({ data: { taskId }, signal }),
    staleTime: 1000 * 60 * 2, // 2 minutes

    // Don't fetch if taskId is empty
    enabled: !!taskId,
  })

// ==================================================================
// TYPE EXPORTS
// ==================================================================
// Useful for typing components that receive query results

export type TasksListQueryResult = Awaited<ReturnType<typeof getTasksList>>
export type TasksDetailsQueryResult = Awaited<
  ReturnType<typeof getTaskByIdWithTodos>
>
