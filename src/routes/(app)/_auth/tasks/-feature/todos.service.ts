import {createServerFn} from "@tanstack/react-start";
import {db} from "@/lib/db/db.ts";
import {
    createTodoSchema,
    reorderTodoSchema,
    todoIdSchema,
    toggleTodoSchema,
    updateTodoContentSchema
} from "@/routes/(app)/_auth/tasks/-feature/todos.dm.ts"
import { todo as todoTable , task as taskTable  } from "@/lib/db/schema.ts"
import {and, asc, eq, max} from "drizzle-orm";
import {getRequest} from "@tanstack/start-server-core";
import {auth} from "@/lib/auth/auth.ts";
import {listTodosByTaskIdSchema} from "@/routes/(app)/_auth/tasks/-feature/todos.dm.ts";

/**
 * Server Functions
 *
 * Architecture :
 * - It's a mix of server actions (API), business rules(BLL), and DB acces (DAL).
 * - Uses the advantages of the tanstack fullstack features
 *
 * Loaders (GET):
 *  - Can be cached, pre-fetched.
 *  - For the route loaders. Read datas. When page is loading, called by "route loader".
 *
 * Mutations (POST):
 *  - Never cached.
 *  - For the user actions, onClick, onSubmit.
 *  Update datas in DB and change UI state.
 *
 *  In/Out put :
 *   - inputValidator() : Validate what enters from client to server. --> INPUT
 *   - handler() : is the server handler. Returns what gets out of th server. --> Output
 *   - Input has to be validated, because the client could send malicious code or a bug. Validator verify that it's safe data.
 */

// ====================== HELPER ==========================
async function requireUserId() {
    const session = await auth.api.getSession({
        headers: getRequest().headers,
    });

    const userId = session?.user?.id;

    if (!userId) throw new Error("Not authenticated");

    return userId;
}

/** Verify user owns the task */
async function verifyTaskOwnership(taskId: string, userId: string) {
    const task = await db.query.task.findFirst({
        where: and(eq(taskTable.id, taskId), eq(taskTable.userId, userId)),
    });

    if (!task) {
        throw new Error("Task not found or access denied");
    }

    return task;
}

/** Verify user owns the todos (via task) */
async function verifyTodoOwnership(todoId: string, userId: string) {
    const todo = await db.query.todo.findFirst({
        where: eq(todoTable.id, todoId),
        with: { task: true },   //gets the TASK associated with this todos, but TODOS contains TASK
    });

    if (!todo || todo.task.userId !== userId) {
        throw new Error("Todo not found or access denied");
    }

    return todo;
}

// ====================== LOADERS =========================
export const listTodosByTaskId = createServerFn({ method: "GET" })
    .inputValidator(listTodosByTaskIdSchema)
    .handler( async ({ data }) => {

        const userId = await requireUserId()

        // Verify ownership
        await verifyTaskOwnership(data.taskId, userId);

        const todos = await db.query.todo.findMany({
            where: eq(todoTable.taskId, data.taskId),
            orderBy: [asc(todoTable.sortPosition)],
        });

        return todos;
    })



// ====================== MUTATIONS ======================
export const createTodo = createServerFn({ method: "POST"})
    .inputValidator(createTodoSchema)
    .handler( async ({ data }) => {
        const userId = await requireUserId()

        // Verify ownership
        await verifyTaskOwnership(data.taskId, userId)

        // Get max sortPosition for this task
        const maxResult = await db
            .select({ maxPos: max(todoTable.sortPosition) })
            .from(todoTable)
            .where(eq(todoTable.taskId, data.taskId))

        const nextPosition = (maxResult[0]?.maxPos ?? -1) +1

        const now = new Date()
        const [newTodo] = await db
            .insert(todoTable)
            .values({
                id: crypto.randomUUID(),
                taskId: data.taskId,
                content: data.content.trim(),
                isCompleted: false,
                sortPosition: nextPosition,
                createdAt: now,
                updatedAt: now
            })
            .returning()

        // Update task's updatedAt
        await db
            .update(taskTable)
            .set({ updatedAt: now })
            .where(eq(taskTable.id , data.taskId))

        return newTodo
    })

export const updateTodoContent = createServerFn({ method: "POST" })
    .inputValidator(updateTodoContentSchema)
    .handler(async ({ data }) => {
        const userId = await requireUserId();

        // Verify ownership
        const todo = await verifyTodoOwnership(data.todoId, userId);

        const now = new Date();
        const [updatedTodo] = await db
            .update(todoTable)
            .set({
                content: data.content.trim(),
                updatedAt: now,
            })
            .where(eq(todoTable.id, data.todoId))
            .returning();

        // Update task's updatedAt
        await db
            .update(taskTable)
            .set({ updatedAt: now })
            .where(eq(taskTable.id, todo.taskId));

        return updatedTodo;
    });

export const toggleTodo = createServerFn({ method: "POST" })
    .inputValidator(toggleTodoSchema)
    .handler(async ({ data }) => {
        const userId = await requireUserId();

        // Verify ownership
        const todo = await verifyTodoOwnership(data.todoId, userId);

        const now = new Date();
        const [updatedTodo] = await db
            .update(todoTable)
            .set({
                isCompleted: data.isCompleted,
                updatedAt: now,
            })
            .where(eq(todoTable.id, data.todoId))
            .returning();

        // Update task's updatedAt
        await db
            .update(taskTable)
            .set({ updatedAt: now })
            .where(eq(taskTable.id, todo.taskId));

        return updatedTodo;
    });

export const deleteTodo = createServerFn({ method: "POST" })
    .inputValidator(todoIdSchema)
    .handler(async ({ data }) => {
        const userId = await requireUserId();

        // Verify ownership
        const todo = await verifyTodoOwnership(data.todoId, userId);

        await db.delete(todoTable).where(eq(todoTable.id, data.todoId));

        // Update task's updatedAt
        const now = new Date();
        await db
            .update(taskTable)
            .set({ updatedAt: now })
            .where(eq(taskTable.id, todo.taskId));

        return { success: true };
    });

export const reorderTodos = createServerFn({ method: "POST" })
    .inputValidator(reorderTodoSchema)
    .handler(async ({ data }) => {
        const userId = await requireUserId();

        // Verify ownership
        await verifyTaskOwnership(data.taskId, userId);

        const now = new Date();

        // Update each todos sortPosition based on new order
        await Promise.all(
            data.todoIds.map((todoId, index) =>
                db
                    .update(todoTable)
                    .set({
                        sortPosition: index,
                        updatedAt: now,
                    })
                    .where(
                        and(
                            eq(todoTable.id, todoId),
                            eq(todoTable.taskId, data.taskId)
                        )
                    )
            )
        );

        // Update task's updatedAt
        await db
            .update(taskTable)
            .set({ updatedAt: now })
            .where(eq(taskTable.id, data.taskId));

        return { success: true };
    });
