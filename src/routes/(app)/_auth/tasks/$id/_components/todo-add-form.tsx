import { Input } from "@/components/ui/input.tsx";
import { FormEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { LoadingSwap } from "@/components/ui/loading-swap.tsx";
import { PlusIcon } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useRouter } from "@tanstack/react-router";
import { createTodo } from "@/routes/(app)/_auth/tasks/-feature/todos.service.ts";
import { TodoModel } from "@/routes/(app)/_auth/tasks/-feature/tasks.dm.ts";

/**
 * Todos Add Form Component
 *
 * Based on original TodoForm pattern:
 * - Inline form with input + button
 * - Error handling
 * - Loading state with LoadingSwap
 */

type Props = {
    taskId: string;
    onCancel: () => void;
    onCreated: (todo: TodoModel) => void;
};

export function TodoAddForm({ taskId, onCancel, onCreated }: Props) {
    // Hooks
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Server function
    const createTodoFn = useServerFn(createTodo);

    // Functions
    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setError(null);

        const content = inputRef.current?.value;
        if (!content?.trim()) {
            setError("Content is required");
            return;
        }

        setIsLoading(true);

        try {
            const newTodo = await createTodoFn({
                data: { taskId, content },
            });
            onCreated(newTodo);
            router.invalidate();
        } catch (error) {
            // Handle redirect responses (Tanstack pattern)
            if (error instanceof Response) throw error;
            if (typeof error === "object" && error !== null && "redirect" in error)
                throw error;

            // Real error
            console.error("Submit failed:", error);
            setError("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    // Render
    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <div className="flex gap-2">
                <Input
                    autoFocus
                    ref={inputRef}
                    placeholder="What needs to be done?"
                    className="flex-1"
                    aria-label="Todo content"
                    disabled={isLoading}
                />
                <Button type="submit" size="sm" disabled={isLoading}>
                    <LoadingSwap isLoading={isLoading} className="flex gap-2 items-center">
                        <PlusIcon className="h-4 w-4" /> Add
                    </LoadingSwap>
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
            </div>
            {error && (
                <p className="text-sm text-red-600 text-destructive">{error}</p>
            )}
        </form>
    );
}
