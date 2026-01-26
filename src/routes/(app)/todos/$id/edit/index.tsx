import {createFileRoute, Link, notFound} from '@tanstack/react-router'
import {Button} from "@/components/ui/button.tsx";
import {ArrowLeftIcon} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {TodoForm} from "@/features/todos/ui/todo-form.tsx";
import {createServerFn} from "@tanstack/react-start";
import {db} from "@/drizzle/db.ts";
import {eq} from "drizzle-orm";
import {todosTable} from "@/drizzle/schema.ts";

const loaderFn = createServerFn ({method: "GET"})
    .inputValidator((data: { id:string }) => data) // Hardcoding this particular type and no real error Validation is done
    //Server Action
    .handler( async ({data}) => {
      const todo = await db.query.todosTable.findFirst({
        where: eq(todosTable.id, data.id)
      })

      if(todo == null)
        throw notFound()

      return todo
    })


export const Route = createFileRoute('/todos/$id/edit/')({
  component: RouteComponent,
  // params is the "id" in the URL
  loader: async ({ params }) => loaderFn({ data: params})
})


function RouteComponent() {

  const todo = Route.useLoaderData()

  return (
      <div className="container space-y-2">
        {/* HEADER */}
        <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
        >
          <Link to="/">
            <ArrowLeftIcon /> Todo List
          </Link>
        </Button>

        {/* CONTENT */}
        <Card>
          <CardHeader>
            <CardTitle>Edit Todo - {todo.title}</CardTitle>
            <CardDescription>Update the details of your todo item</CardDescription>
          </CardHeader>

          <CardContent>
            <TodoForm todo={todo} />
          </CardContent>
        </Card>
      </div>
  )
}

