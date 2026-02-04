import { TodoModel } from "@/routes/(app)/_auth/tasks/-feature/tasks.dm.ts";
import { startTransition, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
    deleteTodo,
    toggleTodo,
    updateTodoContent,
} from "@/routes/(app)/_auth/tasks/-feature/todos.service.ts";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { ActionButton } from "@/components/ui/action-button.tsx";
import { CheckIcon, EditIcon, GripVerticalIcon, Trash2Icon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/**
 * Todos Item Component (Sortable)
 *
 * Based on original TodoTableRow pattern:
 * - Optimistic UI state (isCompleted)
 * - Toggle on click
 * - Edit inline
 * - Delete with ActionButton
 */

type Props = {
    todo: TodoModel;
    onUpdate: (todo: TodoModel) => void;
    onDelete: (todoId: string) => void;
};

export function TodoItem({ todo, onUpdate, onDelete }: Props) {
    // Hooks
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(todo.content);
    const [isCompleted, setIsCompleted] = useState(todo.isCompleted);
    const [isLoading, setIsLoading] = useState(false);

    // Server Functions
    const toggleFn = useServerFn(toggleTodo);
    const updateFn = useServerFn(updateTodoContent);
    const deleteFn = useServerFn(deleteTodo);

    // DnD Sortable
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: todo.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    // Functions
    function handleToggle() {
        const next = !isCompleted;
        setIsCompleted(next);
        onUpdate({ ...todo, isCompleted: next });

        startTransition(async () => {
            await toggleFn({ data: { todoId: todo.id, isCompleted: next } });
            router.invalidate();
        });
    }

    function handleRowClick(event: React.MouseEvent) {
        // If we click on actions (edit, delete, drag), don't toggle
        if ((event.target as HTMLElement).closest("[data-actions]")) return;
        if ((event.target as HTMLElement).closest("[data-drag-handle]")) return;
        if (isEditing) return;

        handleToggle();
    }

    async function handleUpdateContent(event: React.FormEvent) {
        event.preventDefault();
        if (!editContent.trim()) return;

        setIsLoading(true);
        try {
            const updated = await updateFn({
                data: { todoId: todo.id, content: editContent },
            });
            onUpdate(updated);
            setIsEditing(false);
            router.invalidate();
        } catch (error) {
            console.error("Update failed:", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete() {
        await deleteFn({ data: { todoId: todo.id } });
        onDelete(todo.id);
        router.invalidate();
    }

    function handleCancelEdit() {
        setIsEditing(false);
        setEditContent(todo.content);
    }

    // Render
    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={handleRowClick}
            className={cn(
                "flex items-center gap-2 p-2 rounded-lg border bg-card cursor-pointer",
                isDragging && "opacity-50 shadow-lg"
            )}
        >
            {/* Drag Handle */}
            <button
                data-drag-handle
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
            >
                <GripVerticalIcon className="h-4 w-4" />
            </button>

            {/* Checkbox */}
            <Checkbox
                checked={isCompleted}
                onCheckedChange={handleToggle}
                disabled={isEditing}
            />

            {/* Content / Edit Form */}
            {isEditing ? (
                <form
                    onSubmit={handleUpdateContent}
                    className="flex-1 flex gap-2"
                    data-actions
                >
                    <Input
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        autoFocus
                        disabled={isLoading}
                        className="flex-1 h-8"
                    />
                    <Button type="submit" size="icon-sm" disabled={isLoading}>
                        <CheckIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={handleCancelEdit}
                        disabled={isLoading}
                    >
                        <XIcon className="h-4 w-4" />
                    </Button>
                </form>
            ) : (
                <>
                    <span
                        className={cn(
                            "flex-1",
                            isCompleted && "line-through text-muted-foreground"
                        )}
                    >
                        {todo.content}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-1" data-actions>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setIsEditing(true)}
                        >
                            <EditIcon className="h-4 w-4" />
                        </Button>
                        <ActionButton
                            action={handleDelete}
                            variant="ghost"
                            size="icon-sm"
                        >
                            <Trash2Icon className="h-4 w-4" />
                        </ActionButton>
                    </div>
                </>
            )}
        </div>
    );
}
