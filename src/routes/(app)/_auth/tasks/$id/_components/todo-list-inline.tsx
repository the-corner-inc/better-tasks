import { TodoModel } from "@/routes/(app)/_auth/tasks/-feature/tasks.dm.ts";
import { startTransition, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { reorderTodos } from "@/routes/(app)/_auth/tasks/-feature/todos.service.ts";
import { Button } from "@/components/ui/button.tsx";
import { PlusIcon, ListTodoIcon } from "lucide-react";
import { TodoItem } from "@/routes/(app)/_auth/tasks/$id/_components/todo-item.tsx";
import { TodoAddForm } from "@/routes/(app)/_auth/tasks/$id/_components/todo-add-form.tsx";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty.tsx";

/**
 * Todo List Inline Component
 *
 * Features:
 * - Add todo form
 * - Drag & drop reorder
 * - Stats (x/y completed)
 * - Empty state
 */

type Props = {
    taskId: string;
    todos: TodoModel[];
};

export function TodoListInline({ taskId, todos: initialTodos }: Props) {
    const router = useRouter();
    const [todos, setTodos] = useState(initialTodos);
    const [isAdding, setIsAdding] = useState(false);

    const reorderTodosFn = useServerFn(reorderTodos);

    // DnD sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Stats
    const completedCount = todos.filter((t) => t.isCompleted).length;
    const totalCount = todos.length;

    // Handlers
    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = todos.findIndex((t) => t.id === active.id);
            const newIndex = todos.findIndex((t) => t.id === over.id);

            const newTodos = arrayMove(todos, oldIndex, newIndex);
            setTodos(newTodos);

            // Save new order to server
            startTransition(async () => {
                await reorderTodosFn({
                    data: {
                        taskId,
                        todoIds: newTodos.map((t) => t.id),
                    },
                });
                router.invalidate();
            });
        }
    }

    function handleTodoUpdate(updatedTodo: TodoModel) {
        setTodos(todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)));
    }

    function handleTodoDelete(todoId: string) {
        setTodos(todos.filter((t) => t.id !== todoId));
    }

    function handleTodoCreated(newTodo: TodoModel) {
        setTodos([...todos, newTodo]);
        setIsAdding(false);
    }

    // Render
    return (
        <div className="space-y-4">
            {/* Stats */}
            <div className="text-sm text-muted-foreground">
                {totalCount > 0 ? (
                    <span>
                        {completedCount}/{totalCount} completed
                    </span>
                ) : (
                    <span>No todos yet</span>
                )}
            </div>

            {/* Add Todo Form / Button */}
            {isAdding ? (
                <TodoAddForm
                    taskId={taskId}
                    onCancel={() => setIsAdding(false)}
                    onCreated={handleTodoCreated}
                />
            ) : (
                <Button
                    onClick={() => setIsAdding(true)}
                    variant="outline"
                    size="sm"
                >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Todo
                </Button>
            )}

            {/* Todos List with DnD */}
            {todos.length > 0 && (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={todos.map((t) => t.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-2">
                            {todos.map((todo) => (
                                <TodoItem
                                    key={todo.id}
                                    todo={todo}
                                    onUpdate={handleTodoUpdate}
                                    onDelete={handleTodoDelete}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            {/* Empty state */}
            {todos.length === 0 && !isAdding && (
                <TodoEmptyState onAddClick={() => setIsAdding(true)} />
            )}
        </div>
    );
}

function TodoEmptyState({ onAddClick }: { onAddClick: () => void }) {
    return (
        <Empty className="border border-dashed">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <ListTodoIcon />
                </EmptyMedia>
                <EmptyTitle>No Todos</EmptyTitle>
                <EmptyDescription>
                    Add todos to track your progress
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button onClick={onAddClick}>
                    <PlusIcon className="h-4 w-4 mr-2" /> Add Todo
                </Button>
            </EmptyContent>
        </Empty>
    );
}
