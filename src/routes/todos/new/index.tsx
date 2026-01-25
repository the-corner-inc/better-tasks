import {createFileRoute, Link} from '@tanstack/react-router'
import {Button} from "src/components/ui/button.tsx"
import {ArrowLeftIcon} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {TodoForm} from "src/components/todo-form.tsx"

export const Route = createFileRoute('/todos/new/')({
  component: RouteComponent,
})

function RouteComponent() {
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
            <CardTitle>Add a new Todo</CardTitle>
            <CardDescription>Create a new task to add to your todo list</CardDescription>
          </CardHeader>

          <CardContent>
            <TodoForm/>
          </CardContent>
        </Card>
      </div>
  )
}
