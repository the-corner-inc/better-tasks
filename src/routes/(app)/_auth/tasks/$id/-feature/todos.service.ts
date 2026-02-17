import { $getCurrentUserId } from "@/lib/auth/auth.functions.ts"
import { db } from "@/lib/db/db.ts"
import { task as taskTable, todo as todoTable } from "@/lib/db/schema.ts"
import type { TodoModel } from "@/routes/(app)/_auth/tasks/$id/-feature/todos.d.ts"
import {
  createTodoSchema,
  reorderTodoSchema,
  todoIdSchema,
  toggleTodoSchema,
  updateTodoContentSchema,
} from "@/routes/(app)/_auth/tasks/$id/-feature/todos.d.ts"
import { createServerFn } from "@tanstack/react-start"
import { and, eq, max } from "drizzle-orm"

/**
 * Server Functions
 *
 * Architecture :
 * - It's a mix of server actions (API), business rules(BLL), and DB access (DAL).
 * - Uses TanStack Start's fullstack features
 *
 * Loaders (GET):
 *  - Can be cached and pre-fetched via React Query
 *  - Called by route loaders during page load
 *  - Read-only operations
 *
 * Mutations (POST):
 *  - Never cached.
 *  - For the user actions (onClick, onSubmit).
 *  - Modify data and trigger UI updates
 *
 *
 * Satisfies Pattern:
 *  - Used when creating objects to insert in DB
 *  - TypeScript verifies ALL required fields are present
 *  - Catches missing fields at compile time, not runtime
 *
 *  In/Out put :
 *   - inputValidator() : Validate what enters from client to server. --> INPUT
 *   - handler() : is the server handler. Returns what gets out of th server. --> Output
 *   - Input has to be validated, because the client could send malicious code or a bug. Validator verify that it's safe data.
 */

// ========================================================
// HELPER
// ========================================================
/**
 * Verify user owns the task
 * */
async function verifyTaskOwnership(taskId: string, userId: string) {
  const task = await db.query.task.findFirst({
    where: and(eq(taskTable.id, taskId), eq(taskTable.userId, userId)),
  })

  if (!task) {
    throw new Error("Task not found or access denied")
  }

  return task
}

/**
 * Verify user owns the todos (via task)
 * */
async function verifyTodoOwnership(todoId: string, userId: string) {
  const todo = await db.query.todo.findFirst({
    where: eq(todoTable.id, todoId),
    with: { task: true }, // gets the TASK associated with this todos, but TODOS contains TASK
  })

  if (!todo || todo.task.userId !== userId) {
    throw new Error("Todo not found or access denied")
  }

  return todo
}

/** Update task's updatedAt timestamp */
async function touchTask(taskId: string) {
  await db
    .update(taskTable)
    .set({ updatedAt: new Date() })
    .where(eq(taskTable.id, taskId))
}

// ========================================================
// LOADERS (GET)
// ========================================================
// NOTE: Todos don't have their own queries file because they are always
// loaded via their parent Task (getTaskByIdWithTodos, getTasksList).
// This file contains only mutations.
// ========================================================

// ========================================================
// MUTATIONS (POST)
// ========================================================
export const createTodo = createServerFn({ method: "POST" })
  .inputValidator(createTodoSchema)
  .handler(async ({ data }) => {
    const userId = await $getCurrentUserId()

    // Verify ownership
    await verifyTaskOwnership(data.taskId, userId)

    // Get max sortPosition for this task
    const maxResult = await db
      .select({ maxPos: max(todoTable.sortPosition) })
      .from(todoTable)
      .where(eq(todoTable.taskId, data.taskId))

    const nextPosition = (maxResult[0]?.maxPos ?? -1) + 1

    const now = new Date()
    const todoToInsert = {
      id: crypto.randomUUID(),
      taskId: data.taskId,
      content: data.content.trim(),
      isCompleted: false,
      sortPosition: nextPosition,
      createdAt: now,
      updatedAt: now,
    } satisfies TodoModel

    const [newTodo] = await db.insert(todoTable).values(todoToInsert).returning()

    // Update task's updatedAt
    await touchTask(data.taskId)

    return newTodo
  })

export const updateTodoContent = createServerFn({ method: "POST" })
  .inputValidator(updateTodoContentSchema)
  .handler(async ({ data }) => {
    const userId = await $getCurrentUserId()

    // Verify ownership
    const todo = await verifyTodoOwnership(data.todoId, userId)

    const now = new Date()
    const todoToUpdate = {
      content: data.content.trim(),
      updatedAt: now,
    } satisfies Partial<TodoModel>

    const [updatedTodo] = await db
      .update(todoTable)
      .set(todoToUpdate)
      .where(eq(todoTable.id, data.todoId))
      .returning()

    // Update parent : task's updatedAt
    await touchTask(todo.taskId)

    return updatedTodo
  })

export const toggleTodo = createServerFn({ method: "POST" })
  .inputValidator(toggleTodoSchema)
  .handler(async ({ data }) => {
    const userId = await $getCurrentUserId()

    // Verify ownership
    const todo = await verifyTodoOwnership(data.todoId, userId)

    const now = new Date()
    const todoToUpdate = {
      isCompleted: data.isCompleted,
      updatedAt: now,
    } satisfies Partial<TodoModel>

    const [updatedTodo] = await db
      .update(todoTable)
      .set(todoToUpdate)
      .where(eq(todoTable.id, data.todoId))
      .returning()

    // Update task's updatedAt
    await touchTask(todo.taskId)

    return updatedTodo
  })

export const deleteTodo = createServerFn({ method: "POST" })
  .inputValidator(todoIdSchema)
  .handler(async ({ data }) => {
    const userId = await $getCurrentUserId()

    // Verify ownership
    const todo = await verifyTodoOwnership(data.todoId, userId)

    await db.delete(todoTable).where(eq(todoTable.id, data.todoId))

    // Update task's updatedAt
    await touchTask(todo.taskId)

    return { success: true }
  })

export const reorderTodos = createServerFn({ method: "POST" })
  .inputValidator(reorderTodoSchema)
  .handler(async ({ data }) => {
    const userId = await $getCurrentUserId()

    // Verify ownership
    await verifyTaskOwnership(data.taskId, userId)

    const now = new Date()

    // Update each todos sortPosition based on new order
    await Promise.all(
      data.todoIds.map((todoId, index) =>
        db
          .update(todoTable)
          .set({
            sortPosition: index,
            updatedAt: now,
          })
          .where(and(eq(todoTable.id, todoId), eq(todoTable.taskId, data.taskId))),
      ),
    )

    // Update task's updatedAt
    await touchTask(data.taskId)

    return { success: true }
  })
