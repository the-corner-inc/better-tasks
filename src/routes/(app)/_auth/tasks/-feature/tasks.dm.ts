import {z} from "zod";
import {createSelectSchema} from "drizzle-zod";
import {task as TaskTable,todo as TodoTable} from "@/lib/db/schema.ts";

/**
 * Types & validation Schemas
 */

// ================================================================
// BASE ZOD SCHEMAS (from Drizzle - single source of truth)
// ================================================================
// Schemas are generated with Zod based on the row of the DB
// this avoids to re-type all fields and only do composition
// ================================================================
const taskSchema = createSelectSchema(TaskTable)
const todoSchema = createSelectSchema(TodoTable);

// Composition
const taskTodosSchema = taskSchema.extend({
    todos: z.array(todoSchema)
})

// ================================================================
// MODELS TYPES for internal use - Full database rows
// ================================================================
export type TaskModel = z.infer<typeof taskSchema>
export type TodoModel = z.infer<typeof todoSchema>;

export type TaskTodoModel = z.infer<typeof taskTodosSchema>


// ====================== PROPERTIES ======================
const id = z.string().min(1, "taskId required")
const title = z.string().min(1, "title required").max(255, "Title too long")

// ====================== INPUT SCHEMAS ======================
export const taskIdSchema = z.object({
    taskId: id
})

export const createTaskSchema = z.object({
    title: title
})

export const updateTaskSchema = z.object({
    taskId: id,
    title: title
})

export const deleteTaskSchema = z.object({
    taskId: id,
})

