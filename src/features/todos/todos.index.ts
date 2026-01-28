/**
 * Feature - Public API
 *
 * Control what is served from the feature to the rest of the app
 */

// ====================== TYPES =================================
export type {TodoModel} from "@/features/todos/todos.types.ts"

// ====================== SERVER FUNCTIONS ======================
export {
    listTodos,
    getTodoById,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo
} from "@/features/todos/todos.server.ts"


// ====================== UI COMPONENTS =========================
export {TodoForm} from "@/features/todos/ui/todo-form.tsx"
export {TodoTable} from "@/features/todos/ui/todo-table.tsx"
// Client code only - Data in Storage
export {LocalCountButton} from "@/features/todos/ui/local-count-button.tsx"


