import type { TodoListDisplayType, TodoItem } from "../TodoContext";

export interface TodoRepository {
    getTodos(displayType: TodoListDisplayType): Promise<TodoItem[]>;
    addTodo(task: string): Promise<TodoItem>;
    removeTodo(id: string): Promise<void>;
    toggleTodo(id: string, completed: boolean): Promise<TodoItem | undefined>;
}

export interface TodoDisplayTypeRepository {
    changeDisplayType(type: TodoListDisplayType): Promise<TodoListDisplayType>;
    getDisplayType(): Promise<TodoListDisplayType>;
}