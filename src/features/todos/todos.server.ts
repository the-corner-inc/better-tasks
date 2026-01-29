import {createServerFn} from "@tanstack/react-start";
import {db} from "@/db/db.ts";
import {createTodoSchema, todoIdSchema, toggleTodoSchema, updateTodoSchema} from "@/features/todos/todos.types.ts";
import { notFound } from "@tanstack/react-router";
import { todosTable } from "@/db/schema.ts";
import { eq } from "drizzle-orm";

/**
 * Server Functions
 *
 * Architecture :
 * - It's a mix of server actions (API), business rules(BLL), and DB acces (DAL).
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

// ====================== LOADERS =========================
export const listTodos = createServerFn({ method: "GET"})
    .handler( () =>
        db.query.todosTable.findMany({
            orderBy: (todos,
                      {desc}) => [desc(todos.createdAt)]
        })
    )

export const getTodoById = createServerFn({ method: "GET" })
    .inputValidator(todoIdSchema)
    .handler( async ({data}) => {
        const todo = await db.query.todosTable.findFirst({
            where: eq( todosTable.id , data.id )
        });

        if (!todo)
            throw notFound()

        return todo
    })


// ====================== MUTATIONS ======================
export const createTodo = createServerFn ({ method: "POST"})
    .inputValidator(createTodoSchema)
    .handler(async ({data}) => {
        const [todo] = await db
            .insert(todosTable)
            .values({
                title: data.title.trim(),
                isCompleted: false
            })
            .returning()

        return todo
    })

export const updateTodo = createServerFn({ method: "POST" })
    .inputValidator(updateTodoSchema)
    .handler(async ({data}) => {
        const [updateTodo] = await db
            .update(todosTable)
            .set({title: data.title.trim()})
            .where(eq( todosTable.id , data.id ))
            .returning()

        return updateTodo
    })

export const toggleTodo = createServerFn({ method: "POST" })
    .inputValidator(toggleTodoSchema)
    .handler(async ({data}) => {
        db
            .update(todosTable)
            .set({isCompleted: data.isCompleted})
            .where(eq( todosTable.id , data.id ))
    })

export const deleteTodo = createServerFn({ method: "POST" })
    .inputValidator(todoIdSchema)
    .handler(async ({data}) => {
        db
            .delete(todosTable)
            .where(eq( todosTable.id , data.id ))
    })
