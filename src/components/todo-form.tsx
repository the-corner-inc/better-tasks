import {Input} from "@/components/ui/input.tsx";
import {FormEvent, useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {LoadingSwap} from "@/components/ui/loading-swap.tsx";
import {PlusIcon} from "lucide-react";
import {createServerFn, useServerFn} from "@tanstack/react-start";
import {z} from "zod";
import {db} from "@/db";
import {todosTable} from "@/db/schema.ts";
import {redirect} from "@tanstack/react-router";
import { eq } from "drizzle-orm";

// Server Actions
const addTodo = createServerFn({method: "POST"})
    .inputValidator( z.object({ title: z.string().min(1) }))
    // Server Handler
    .handler(async ({ data }) => {
    await db.insert(todosTable).values({
        title: data.title,
        isCompleted: false
    })

    throw redirect({to: "/"})
});

const updateTodo = createServerFn({method: "POST"})
    .inputValidator( z.object({
        id: z.string().min(1),
        title: z.string().min(1)
    }))
    // Server Handler
    .handler(async ({ data }) => {
        await db.update(todosTable).set(data)
            .where(eq(todosTable.id, data.id))

        throw redirect({to: "/"})
    });

export function TodoForm({ todo}: {todo?: {
    title: string;
    id: string;
    }}) {

    const nameRef = useRef<HTMLInputElement> (null)
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // To call the function inside the client, we need to wrap the function with serverFunction Hook
    const addTodoFn = useServerFn(addTodo)
    const updateTodoFn = useServerFn(updateTodo)

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()

        const title = nameRef.current?.value
        if(!title)
            return

        setIsLoading(true);

        if(todo == null)
            await addTodoFn({data: { title }})
        else
            await updateTodoFn ({data: {title, id: todo.id}})

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
                defaultValue={todo?.title}
            />
            <Button type="submit" disabled={isLoading}>
                <LoadingSwap isLoading={isLoading} className="flex gap-2 items-center"  >
                    {
                        todo == null ? (
                            <>
                                <PlusIcon/> Add
                            </>
                        ) : (
                            "Update"
                        )
                    }
                </LoadingSwap>
            </Button>
        </form>
    )
}