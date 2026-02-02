/**
 * Feature - Public API
 *
 * Control what is served from the feature to the rest of the app
 */
// TODO : DOES IT IMPORT EVERYTHING OR JUST WHAT I NEED ???

// ====================== TYPES =================================
export type {TodoModel} from "@/routes/(app)/todos/-todos.d.ts"

// ====================== SERVER FUNCTIONS ======================
export {
    listTodos,
    getTodoById,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo
} from "@/routes/(app)/todos/-todos.service.ts"


// ====================== UI COMPONENTS =========================
export {TodoForm} from "@/routes/(app)/todos/-components/todo-form.tsx"
export {TodoTable} from "@/routes/(app)/todos/-components/todo-table.tsx"
export {LocalCountButton} from "@/routes/(app)/todos/-components/local-count-button.tsx" // Client code only - Data in Storage


