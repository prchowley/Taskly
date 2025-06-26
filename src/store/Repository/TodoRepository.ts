import type { TodoDisplayType, TodoItem } from "../TodoContext";

export interface TodoRepository {
    getTodos(displayType: TodoDisplayType): Promise<TodoItem[]>;
    addTodo(task: string): Promise<TodoItem>;
    removeTodo(id: string): Promise<void>;
    toggleTodo(id: string, completed: boolean): Promise<TodoItem | undefined>;
}

export interface TodoDisplayTypeRepository {
    changeDisplayType(type: TodoDisplayType): Promise<TodoDisplayType>;
    getDisplayType(): Promise<TodoDisplayType>;
}