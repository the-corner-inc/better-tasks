import { todo as TodoTable } from "@/lib/db/schema.ts"
import { createSelectSchema } from "drizzle-zod"
import { z } from "zod"

/**
 * Types & validation Schemas
 */

// ================================================================
// BASE ZOD SCHEMAS (from Drizzle - single source of truth)
// ================================================================
export const todoSchema = createSelectSchema(TodoTable)

// ================================================================
// MODELS TYPES for internal use - Full database rows
// ================================================================

export type TodoModel = z.infer<typeof todoSchema>

// ====================== PROPERTIES ======================
const todoId = z.string().uuid()
const taskId = z.string().min(1, "taskId required")
const content = z
  .string()
  .min(1, "Title required")
  .max(255, "Title too long")
  .transform((val) => val.trim())
const isCompleted = z.boolean()

// ====================== INPUT SCHEMAS ======================
export const todoIdSchema = z.object({
  todoId: todoId,
})

export const listTodosByTaskIdSchema = z.object({
  taskId: taskId,
})

export const createTodoSchema = z.object({
  taskId: taskId,
  content: content,
})

export const updateTodoContentSchema = z.object({
  todoId: todoId,
  content: content,
})

export const toggleTodoSchema = z.object({
  todoId: todoId,
  isCompleted: isCompleted,
})

export const reorderTodoSchema = z.object({
  taskId: taskId,
  todoIds: z.array(todoId).min(1, "At least one todo required"),
})
