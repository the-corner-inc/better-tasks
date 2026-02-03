import {createFileRoute, Link} from '@tanstack/react-router'
import {authQueryOptions} from "@/lib/auth/auth.queries.ts";
import {createServerFn} from "@tanstack/react-start";
import {db} from "@/lib/db/db.ts";
import {useSuspenseQuery} from "@tanstack/react-query";
import {Badge} from "@/components/ui/badge.tsx";
import {Button} from "@/components/ui/button.tsx";
import {PlusIcon} from "lucide-react";
import {LocalCountButton} from "@/routes/(app)/_auth/todos/-feature/components/local-count-button.tsx";
import {TodoTable} from "@/routes/(app)/_auth/todos/-feature/components/todo-table.tsx";

export const Route = createFileRoute('/(app)/_auth/todos/')({
  component: RouteComponent,
  loader: async ({context}) => {
    // Prefetch auth data
    const user = await context.queryClient.ensureQueryData(authQueryOptions())

    // If user is logged in, also fetch todos stats
    let stats =  user
        ? await serverLoader()
        : {todosData: [], stats: { total: 0, completed: 0} }

    return stats
  }
})


// ===================================================================
// TODOS LOGGED IN SECTION (authenticated)
// ===================================================================
function RouteComponent() {

  const {data: user} = useSuspenseQuery(authQueryOptions())
  const {stats, todosData} = Route.useLoaderData()

  const pending = stats.total - stats.completed
  const completedCount = stats.completed
  const totalCount = stats.total


  return (
      <div className="min-h-screen container space-y-8">
        <div className="flex justify-between items-center gap-4">
          {/* HEADER SECTION */}
          {/* Title of page and count of todos done */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Logged in as {user?.name || user?.email}
              </h1>
              <p className="text-muted-foreground">
                Here are your todo stats:
              </p>
            </div>

            {
                totalCount > 0 && (
                    <Badge variant="outline">
                      {completedCount} of {totalCount} completed. {pending} Todos remaining.
                    </Badge>
                )
            }
          </div>

          {/* Buttons section  to add a todo */}
          <div className="flex gap-2">
            {/* CLIENT ONLY CODE - STORE IN STORAGE */}
            <LocalCountButton/>

            {/* Add Todo */}
            <Button size="sm" asChild>
              <Link to={"/todos/new"}>
                <PlusIcon /> Add Todo
              </Link>
            </Button>
          </div>
        </div>

        {/* BODY SECTION */}
        {/* Table of todos */}
        <TodoTable todos={todosData}/>
      </div>
  )
}


// ===================================================================
// SERVER FUNCTION
// ===================================================================
// Equivalent of Server Actions (NextJS). Main difference, now in Tanstack it works not only to POST data, but to GET data too.
// It will make a server action so the client can GET / POST the last datas.
// When it need to get the data, it makes a fetch request using GET method, and runs the code (db query) from the handler into the server.
// So it tells to the Browser :
//  - A) We are on the client -> Make a fetch request
//  - B) we are on the server -> Call the code (db query), with no changes at all.
const serverLoader = createServerFn({method: 'GET' })
    .handler(async () => {
      const todosData = await db.query.todosTable.findMany()

      const completed = todosData.filter( (t) => t.isCompleted ).length

      return {
        todosData,
        stats: {
          total: todosData.length,
          completed: completed,
        }
      }
    })