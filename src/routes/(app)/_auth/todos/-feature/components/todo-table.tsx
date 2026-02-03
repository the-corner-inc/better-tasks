import {TodoModel} from "@/routes/(app)/_auth/todos/-feature/todos"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty.tsx";
import {EditIcon, ListTodoIcon, PlusIcon, Trash2Icon} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Link, useRouter} from "@tanstack/react-router";
import {useServerFn} from "@tanstack/react-start";
import {deleteTodo, toggleTodo} from "@/routes/(app)/_auth/todos/-feature/todos.service.ts";
import {startTransition, useState} from "react";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {cn} from "@/lib/utils.ts";
import {ActionButton} from "@/components/ui/action-button.tsx";

/**
 *  Todos table Component
 */

export function TodoTable( {todos}: {todos: TodoModel[]} ) {

    // If there is no Todos
    if(todos.length === 0) {
        return <TodoEmptyState/>
    }

    // Show all Todos
    return (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                    <TableHead className="w-0"></TableHead>

                    <TableHead>Task</TableHead>

                    <TableHead>Created On</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {
                    todos.map(todo => (
                        <TodoTableRow key={todo.id} todo={todo}/>
                    ))
                }
            </TableBody>
        </Table>
    )
}


/**
 * gère l’optimistic UI state (isCurrentCompleted)
 * SetIsCompleted met le UI à jour AVANT que le serveur n'apelle toggleFn()
 * déclenche onToggle et onDelete
 *
 * garde le Link vers l’edit
 */
function TodoTableRow ({todo}: {todo: TodoModel}) {

    // Hooks
    const router = useRouter()
    const [isCompleted, setisCompleted] = useState(todo.isCompleted)

    // Server Functions
    const toggleFn = useServerFn(toggleTodo)
    const removeFn = useServerFn(deleteTodo)

    // Functions
    function handlerowClick(event: React.MouseEvent) {

        // If we click on actions in the row, like "edit" or "delete", we don't toggle the checkbox
        if((event.target as HTMLElement).closest("[data-actions]"))
            return

        const next = !isCompleted
        setisCompleted(next)
        startTransition(async () => {
            // Transition to make sure it delays the update of our state for this ones
            await toggleFn ({ data: { id: todo.id , isCompleted: next} })
            router.invalidate()
        })
    }

    async function handleDelete() {
        const result = await removeFn({ data: {id: todo.id} })
        router.invalidate()
        return result
    }

    // Render
    return (
        <TableRow onClick={handlerowClick}
                  className="cursor-pointer" >
            <TableCell>
                <Checkbox checked={isCompleted}/>
            </TableCell>

            <TableCell className={cn("font-medium", isCompleted && "text-muted-foreground line-through")}>
                {todo.title}
            </TableCell>

            <TableCell className="text-sm text-muted-foreground" >
                {formatDate(todo.createdAt)}
            </TableCell>

            <TableCell data-actions>
                <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost"
                            size="icon-sm"
                            asChild
                    >
                        <Link to="/todos/$id/edit"
                              params={{ id: todo.id }}
                        >
                            <EditIcon />
                        </Link>
                    </Button>

                    <ActionButton action={handleDelete}
                                  variant="destructive"
                                  size="icon-sm"
                    >
                        <Trash2Icon/>
                    </ActionButton>
                </div>
            </TableCell>

        </TableRow>
    )

}

function TodoEmptyState() {
    return (
        <Empty className="border border-dashed">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <ListTodoIcon/>
                </EmptyMedia>

                <EmptyTitle>No Todos</EmptyTitle>

                <EmptyDescription>
                    Try Adding a new todo
                </EmptyDescription>
            </EmptyHeader>


            <EmptyContent>
                <Button asChild>
                    <Link to={"/todos/new"}>
                        <PlusIcon /> Add Todo
                    </Link>
                </Button>
            </EmptyContent>
        </Empty>
    )
}

function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("fr-FR", { dateStyle: "short" }).format(date);
}