import { task as TaskTable, todo as TodoTable } from "@/lib/db/schema.ts"
import { createSelectSchema } from "drizzle-zod"
import { z } from "zod"

/**
 * Types & validation Schemas
 */

// ===============================================================================
// BASE ZOD SCHEMAS (from Drizzle - single source of truth)
// ===============================================================================
const taskSchema = createSelectSchema(TaskTable)
const todoSchema = createSelectSchema(TodoTable)

// Composition : Task with its related Todos
export const taskTodosSchema = taskSchema.extend({
  todos: z.array(todoSchema),
})

// ===============================================================================
// MODELS TYPES for internal use - Full database rows
// ===============================================================================
// Used :
//  - in service as a verification for creation: satisfies xxxModel
//  - in return type of functions : function getTask(): TaskModel
//  - in props of components : function taskCard({ task }: { task: TaskModel })
// ===============================================================================
export type TaskModel = z.infer<typeof taskSchema>
export type TodoModel = z.infer<typeof todoSchema>
export type TaskTodoModel = z.infer<typeof taskTodosSchema>

// ===============================================================================
// INPUT SCHEMAS
// ===============================================================================
// Used :
//  - To validate inputs from client -> to server
//  - In : .inputValidator(createXxxSchema)
//  - In client side
// ====================== PROPERTIES =============================================
const id = z.string().min(1, "taskId required")
const title = z
  .string()
  .min(1, "title required")
  .max(255, "Title too long")
  .transform((val) => val.trim())

// ====================== INPUT SCHEMAS ==========================================
export const taskIdSchema = z.object({
  taskId: id,
})

export const createTaskSchema = z.object({
  title: title,
})

export const updateTaskSchema = z.object({
  taskId: id,
  title: title,
})

export const deleteTaskSchema = z.object({
  taskId: id,
})
