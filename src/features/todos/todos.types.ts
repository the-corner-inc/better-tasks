import {todosTable} from "@/db/schema.ts";
import { createSelectSchema } from "drizzle-zod";
import {z} from "zod";

/**
 * Types & validation Schemas
 */
// Todo : Pas convaincu de ces schemas

// ====================== TYPE FROM DB ======================
const todoSchema = createSelectSchema(todosTable)
export type TodoModel = z.infer<typeof todoSchema>

// ====================== INPUT SCHEMAS ======================
// TODO : EXPLIQUER CE TYPE ???
// TODO : VOIR AUTRE PROJET

export const createTodoSchema = z.object({
    title: z.string().min(1, "Title required").max(255, "Title too long")
})

export const updateTodoSchema = z.object({
    id: z.string().uuid(),
    title: z.string().min(1, "Title required").max(255, "Title too long")
})

export const todoIdSchema = z.object({
    id: z.string().uuid(),
})

export const toggleTodoSchema = z.object({
    id: z.string().uuid(),
    isCompleted: z.boolean()
})
