import { DEFAULT_DISPLAY_TYPE } from "@/lib/utils";
import { createContext, type Dispatch, type SetStateAction } from "react";

export type TodoItem = {
    id: string;
    task: string;
    completed: boolean;
    createdAt: Date;
}

export type TodoListDisplayType = 'active' | 'completed' | 'all';

export type TodoListDisplayContextType = {
    displayType: TodoListDisplayType;
    setDisplayType: Dispatch<SetStateAction<TodoListDisplayType>>;
};

const TodoListDisplayContext = createContext<TodoListDisplayContextType>(DEFAULT_DISPLAY_TYPE);

export default TodoListDisplayContext;
