import {auth} from "@/lib/auth/auth.ts";
import {getRequest} from "@tanstack/start-server-core";
import {createServerFn} from "@tanstack/react-start";
import {db} from "@/lib/db/db.ts";
import {and, desc, eq} from "drizzle-orm";
import {task as taskTable} from "@/lib/db/schema.ts"
import {taskIdSchema} from "@/routes/(app)/_auth/tasks/-feature/tasks.dm.ts";

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
        headers: getRequest().headers
    })

    const userId = session?.user?.id

    if(!userId)
        throw new Error("Not authenticated");

    return userId
}


// ====================== LOADERS =========================
export const listTasks = createServerFn({ method: "GET" })
    .handler(async () => {
        const userId = await requireUserId();

        const tasks = await db.query.task.findMany({
            where: eq(taskTable.userId , userId),
            orderBy: [desc(taskTable.updatedAt), desc(taskTable.createdAt)]
        })

        return tasks;
    })


// ====================== MUTATIONS ======================
export const getTaskById = createServerFn({ method: "GET" })
.inputValidator(taskIdSchema)
.handler(async ({ data }) => {

    const userId = await requireUserId();

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