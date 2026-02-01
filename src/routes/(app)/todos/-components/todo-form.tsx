import {Input} from "@/components/ui/input.tsx";
import {FormEvent, useRef, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {LoadingSwap} from "@/components/ui/loading-swap.tsx";
import {PlusIcon} from "lucide-react";
import {useServerFn} from "@tanstack/react-start";
import {createTodo, TodoModel, updateTodo} from "@/routes/(app)/todos/todos.barrel.ts";
import {useRouter} from "@tanstack/react-router";

/**
 *  Todos Form Component
 *
 *  Handles :
 *  - create mode
 *  - edit mode
 */

type Props = {
    todo?: Pick<TodoModel, "id" | "title">
}

export function TodoForm({ todo}: Props) {

    // Hooks
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement> (null)
    const [isLoading, setIsLoading]             = useState<boolean>(false);
    const [error, setError]                     = useState<string | null>(null);

    // To call the server function inside the client, we need to wrap the function with serverFunction Hook
    const createTodoFn     = useServerFn(createTodo)
    const updateTodoFn  = useServerFn(updateTodo)

    // Variables
    const isEditMode =  todo != null   // Bool check, if todos exits we update, otherwise we create

    // Functions
    async function handleSubmit(event: FormEvent) {
        event.preventDefault()
        setError(null)

        const title = inputRef.current?.value
        if(!title?.trim()) {
            setError("Title is required")
            return
        }

        setIsLoading(true);

        try {
            if(isEditMode)
                await updateTodoFn({ data: {id: todo?.id , title: title } })
            else
                await createTodoFn({data: { title }})

            //throw redirect({ to: "/" }) //Todo : Check this aproach from tutorial if still valuable
            router.navigate({ to: "/" })
        }
        catch (error) {
            // Todo: Make a error Handler that makes & explain this. Maybe not use this anymore if I use router.navigate() instead of throw
            //1) Tanstack uses "throw redirect()", but it's not an error, so continue to throw it
            if(error instanceof Response)
                throw error
            //2) Same here other possible format of redirect, and not an error
            if(typeof error === "object" && error !== null && "redirect" in error)
                throw error

            //3) Real error here
            console.error("Submit failed: ", error)
            setError("Something went wrong");
        }
        finally {
            setIsLoading(false);
        }
    }

    // Render
    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4">
            <div className="flex gap-2">
                <Input
                    autoFocus
                    ref={inputRef}
                    placeholder="Enter your todo..."
                    className="flex-1"
                    aria-label="Title"
                    defaultValue={todo?.title}
                />
                <Button type="submit" disabled={isLoading}>
                    <LoadingSwap isLoading={isLoading} className="flex gap-2 items-center"  >
                        {
                            isEditMode
                                ? "Update"
                                :   <>
                                    <PlusIcon/> Add
                                </>
                        }
                    </LoadingSwap>
                </Button>
            </div>
            {error &&
                <p className="text-sm text-red-600 text-destructive">
                    {error}
                </p>
            }
        </form>
    )
}