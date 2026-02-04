import {createServerFn} from "@tanstack/react-start";
import {db} from "@/lib/db/db.ts";
import {and, asc, desc, eq} from "drizzle-orm";
import {task as taskTable, todo as todoTable} from "@/lib/db/schema.ts"
import {
    createTaskSchema,
    deleteTaskSchema,
    taskIdSchema,
    TaskModel,
    updateTaskSchema
} from "@/routes/(app)/_auth/tasks/-feature/tasks.dm.ts";
import {$getCurrentUserId} from "@/lib/auth/auth.functions.ts";

/**
 * Server Functions
 *
 * Architecture :
 * - It's a mix of server actions (API), business rules(BLL), and DB acces (DAL).
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


// ========================================================
// LOADERS (GET)
// ========================================================
/**
 * Returns the list of all tasks (with todos).
 */
export const getTasksList = createServerFn({ method: "GET" })
    .handler(async () => {
        const userId = await $getCurrentUserId();

        const tasks = await db.query.task.findMany({
            where: eq(taskTable.userId , userId),
            orderBy: [desc(taskTable.updatedAt), desc(taskTable.createdAt)],
            with: {
                todos: {
                    orderBy: [asc(todoTable.sortPosition)],
                },
            },
        })



        return tasks;
    })

export const getTaskById = createServerFn({ method: "GET" })
    .inputValidator(taskIdSchema)
    .handler(async ({ data }) => {

        const userId = await $getCurrentUserId();

        const taskResult = await db.query.task.findFirst({
            where: (and
                (eq(taskTable.id, data.taskId)),
                    (eq(taskTable.userId, userId))
            )
        })

        if (!taskResult){
            // Could be 404 or forbidden. Keep simple.
            throw new Error("Task not found")
        }

        return {task: taskResult}
    })

/**
 * returns a single task with its todos
 */
export const getTaskByIdWithTodos = createServerFn({ method: "GET" })
    .inputValidator(taskIdSchema)
    .handler(async ({ data }) => {
        const userId = await $getCurrentUserId();

        const taskResult = await db.query.task.findFirst({
            where: and(
                eq(taskTable.id, data.taskId),
                eq(taskTable.userId, userId),
            ),
            with: {
                // "todos" doit être le nom de ta relation côté Drizzle
                todos: {
                    orderBy: [desc(todoTable.updatedAt), desc(todoTable.createdAt)],
                },
            },
        });

        if (!taskResult) {
            throw new Error("Task not found");
        }

        return { task: taskResult };
    });

// ========================================================
// MUTATIONS (POST)
// ========================================================

export const createTask = createServerFn({ method: "POST" })
    .inputValidator(createTaskSchema)
    .handler(async ({ data }) => {
        const userId = await $getCurrentUserId();

        const now = new Date();

        // satisfies TaskModel: TypeScript makes sure that EVERY field is present
        const taskToInsert = {
            id: crypto.randomUUID(),
            userId: userId,
            title: data.title,
            createdAt: now,
            updatedAt: now,
        } satisfies TaskModel

        const [newTask] = await db
            .insert(taskTable)
            .values(taskToInsert)
            .returning();

        return newTask;
    });


export const updateTask = createServerFn({ method: "POST" })
    .inputValidator(updateTaskSchema)
    .handler(async ({ data }) => {
        const userId = await $getCurrentUserId();

        // Verify ownership
        const existingTask = await db.query.task.findFirst({
            where: and(
                eq(taskTable.id, data.taskId),
                eq(taskTable.userId, userId)
            ),
        });

        if (!existingTask) {
            throw new Error("Task not found or access denied");
        }

        const now = new Date();

        const fieldsToUpdate = {
            title: data.title,
            updatedAt: now,
        } satisfies Partial<TaskModel>

        const [updatedTask] = await db
            .update(taskTable)
            .set(fieldsToUpdate)
            .where(eq(taskTable.id, data.taskId))
            .returning();

        return updatedTask;
    });

export const deleteTask = createServerFn({ method: "POST" })
    .inputValidator(deleteTaskSchema)
    .handler(async ({ data }) => {
        const userId = await $getCurrentUserId();

        // Verify ownership
        const existingTask = await db.query.task.findFirst({
            where: and(
                eq(taskTable.id, data.taskId),
                eq(taskTable.userId, userId)
            ),
        });

        if (!existingTask) {
            throw new Error("Task not found or access denied");
        }

        // Todos will be deleted via cascade
        await db.delete(taskTable).where(eq(taskTable.id, data.taskId));

        return { success: true };
    });