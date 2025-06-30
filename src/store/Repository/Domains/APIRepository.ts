import type { TodoRepository } from "../TodoRepository";
import axios, { type AxiosResponse } from "axios";
import type { TodoListDisplayType } from "@/store/TodoListDisplayType";
import { BaseDisplayTypeRepository } from "./BaseDisplayTypeRepository";
import type { TodoItem } from "@/store/Models/TodoItem";
import { FB_ID_TOKEN } from "@/lib/utils";

const baseUrl = "https://taskly-backend.netlify.app/api";
const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(FB_ID_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export class APIRepository extends BaseDisplayTypeRepository implements TodoRepository {
    async getTodos(displayType: TodoListDisplayType): Promise<TodoItem[]> {
        let promise: Promise<AxiosResponse<TodoItem[]>>;
        switch (displayType) {
            case 'active':
                promise = axiosInstance.get(`/todos?completed=false`);
                break;
            case 'completed':
                promise = axiosInstance.get(`/todos?completed=true`);
                break;
            case 'all':
            default:
                promise = axiosInstance.get(`/todos`);
        }
        const response = await promise;
        return response.data;
    }

    async addTodo(task: string): Promise<TodoItem> {
        const response = await axiosInstance.post("/todos", { task });
        return response.data;
    }

    async removeTodo(id: string): Promise<void> {
        await axiosInstance.delete(`/todos/${id}`);
    }

    async toggleTodo(id: string, completed: boolean): Promise<TodoItem | undefined> {
        const response = await axiosInstance.patch(`/todos/${id}`, { completed });
        return response.data;
    }
}
