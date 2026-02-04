import {todo as TodoTable} from "@/lib/db/schema.ts"
import { createSelectSchema } from "drizzle-zod";
import {z} from "zod";

/**
 * Types & validation Schemas
 */
// Todo : Pas convaincu de ces schemas
// TODO : EXPLIQUER CE TYPE
// TODO : VOIR AUTRE PROJET

// ================================================================
// BASE ZOD SCHEMAS (from Drizzle - single source of truth)
// ================================================================
// Schemas are generated with Zod based on the row of the DB
// this avoids to re-type all fields and only do composition
//
// Those Schemas are a ground-base to work with to create others schemas from it
// ================================================================
export const todoSchema = createSelectSchema(TodoTable)

// ================================================================
// MODELS TYPES for internal use - Full database rows
// ================================================================
// Inferred types
// ================================================================

export type TodoModel = z.infer<typeof todoSchema>

// ====================== PROPERTIES ======================
const todoId = z.string().uuid()
const taskId = z.string().min(1, "taskId required");
const content = z.string().min(1, "Title required").max(255, "Title too long")
const isCompleted = z.boolean()

// ====================== INPUT SCHEMAS ======================
export const todoIdSchema = z.object({
    todoId: todoId
})

export const listTodosByTaskIdSchema = z.object({
    taskId: taskId
})

export const createTodoSchema = z.object({
    taskId: taskId,
    content: content
})

export const updateTodoContentSchema = z.object({
    todoId: todoId,
    content: content
})

export const toggleTodoSchema = z.object({
    todoId: todoId,
    isCompleted: isCompleted
})

export const reorderTodoSchema = z.object({
    taskId: taskId,
    todoIds: z.array(todoId).min(1, "At least one todo required")
})
