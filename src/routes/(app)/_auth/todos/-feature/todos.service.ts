import {createServerFn} from "@tanstack/react-start";
import {db} from "@/lib/db/db.ts";
import {createTodoSchema, todoIdSchema, toggleTodoSchema, updateTodoSchema} from "@/routes/(app)/_auth/todos/-feature/todos.dm.ts"
import { notFound } from "@tanstack/react-router";
import { todo as todoTable  } from "@/lib/db/schema.ts"
import { eq } from "drizzle-orm";

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

// ====================== LOADERS =========================
export const listTodos = createServerFn({ method: "GET"})
    .handler( () =>
        db.query.todo.findMany({
            orderBy: (todos,
                      {desc}) => [desc(todos.createdAt)]
        })
    )

export const getTodoById = createServerFn({ method: "GET" })
    .inputValidator(todoIdSchema)
    .handler( async ({data}) => {
        const todoGet = await db.query.todo.findFirst({
            where: eq( todoTable.id , data.id )
        });

        if (!todoGet)
            throw notFound()

        return todoGet
    })


// ====================== MUTATIONS ======================
export const createTodo = createServerFn ({ method: "POST"})
    .inputValidator(createTodoSchema)
    .handler(async ({data}) => {
        const [todos] = await db
            .insert(todoTable)
            .values({
                content: data.title.trim(),
                isCompleted: false
            })
            .returning()

        return todos
    })

export const updateTodo = createServerFn({ method: "POST" })
    .inputValidator(updateTodoSchema)
    .handler(async ({data}) => {
        const [updateTodo] = await db
            .update(todoTable)
            .set({content: data.title.trim()})
            .where(eq( todoTable.id , data.id ))
            .returning()

        return updateTodo
    })

export const toggleTodo = createServerFn({ method: "POST" })
    .inputValidator(toggleTodoSchema)
    .handler(async ({data}) => {
        await db
            .update(todoTable)
            .set({isCompleted: data.isCompleted})
            .where(eq( todoTable.id , data.id ))
    })

export const deleteTodo = createServerFn({ method: "POST" })
    .inputValidator(todoIdSchema)
    .handler(async ({data}) => {
        await db
            .delete(todoTable)
            .where(eq( todoTable.id , data.id ))
    })
