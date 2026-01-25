import {Input} from "@/components/ui/input.tsx";
import {FormEvent, useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {LoadingSwap} from "@/components/loading-swap.tsx";
import {PlusIcon} from "lucide-react";
import {createServerFn, useServerFn} from "@tanstack/react-start";
import {z} from "zod";
import {db} from "@/db";
import {todos} from "@/db/schema.ts";
import {redirect} from "@tanstack/react-router";

// Server Action
const addTodo = createServerFn({method: "POST"})
    .inputValidator( z.object({ title: z.string().min(1) }))
    // Server Handler
    .handler(async ({ data }) => {
    await db.insert(todos).values({
        title: data.title,
        isCompleted: false
    })

    throw redirect({to: "/"})
});

export function TodoForm() {

    const nameRef = useRef<HTMLInputElement> (null)
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // To call the function inside the client, we need to wrap the function with serverFunction Hook
    const addTodoFn = useServerFn(addTodo)


    async function handleSubmit(event: FormEvent) {
        event.preventDefault()

        const title = nameRef.current?.value
        if(!title)
            return

        setIsLoading(true);
        await addTodoFn({data: { title }})
        setIsLoading(false);
    }

    return (
        <form
            onSubmit={handleSubmit} className="flex gap-2">
            <Input
                autoFocus
                ref={nameRef}
                placeholder="Enter your todo..."
                className="flex-1"
                aria-label="Name"
            />
            <Button type="submit" disabled={isLoading}>
                <LoadingSwap isLoading={isLoading} className="flex gap-2 items-center"  >
                    <PlusIcon/> Add
                </LoadingSwap>
            </Button>
        </form>
    )
}