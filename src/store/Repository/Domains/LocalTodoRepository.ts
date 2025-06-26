import type { TodoListDisplayType } from "@/store/TodoListDisplayType";
import type { TodoRepository } from "../TodoRepository";
import { STORAGE_KEY } from "@/lib/utils";
import { BaseDisplayTypeRepository } from "./BaseDisplayTypeRepository";
import type { TodoItem } from "@/store/Models/TodoItem";

export class LocalTodoRepository extends BaseDisplayTypeRepository implements TodoRepository {

    async getTodos(displayType: TodoListDisplayType = 'all'): Promise<TodoItem[]> {
        const data = localStorage.getItem(STORAGE_KEY);
        const todos = data ? JSON.parse(data) : [];
        switch (displayType) {
            case 'active':
                return todos.filter((todo: TodoItem) => !todo.completed);
            case 'completed':
                return todos.filter((todo: TodoItem) => todo.completed);
            case 'all':
            default:
                return todos;
        }
    }
    
    async addTodo(task: string): Promise<TodoItem> {
        const todos = await this.getTodos();
        const newTodo: TodoItem = {
            id: Date.now().toString(),
            task,
            completed: false,
            createdAt: new Date(),
        };
        const updated = [...todos, newTodo];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return newTodo;
    }

    async removeTodo(id: string): Promise<void> {
        const todos = await this.getTodos();
        const updated = todos.filter((todo: TodoItem) => todo.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }

    async toggleTodo(id: string, completed: boolean): Promise<TodoItem | undefined> {
        const todos = await this.getTodos();
        const updated = todos.map((todo: TodoItem) =>
            todo.id === id ? { ...todo, completed } : todo
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated.find((todo: TodoItem) => todo.id === id);
    }
}