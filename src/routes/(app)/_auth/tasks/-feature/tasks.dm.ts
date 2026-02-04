import {z} from "zod";
import {createSelectSchema} from "drizzle-zod";
import {task as TaskTable} from "@/lib/db/schema.ts";

/**
 * Types & validation Schemas
 */


// ====================== TYPE FROM DB ======================
const taskSchema = createSelectSchema(TaskTable)
export type TaskModel = z.infer<typeof taskSchema>


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

