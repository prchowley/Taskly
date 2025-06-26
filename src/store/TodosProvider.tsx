import TodoListDisplayContext, { type TodoListDisplayType } from "./TodoContext";
import { useState } from "react";
import { DEFAULT_DISPLAY_TYPE } from "@/lib/utils";

export type TodoProviderProps = {
    children: React.ReactNode;
};

export const TodosListDisplayProvider = ({ children }: TodoProviderProps) => {
    const [displayType, setDisplayType] = useState<TodoListDisplayType>(DEFAULT_DISPLAY_TYPE);

    return (
        <TodoListDisplayContext.Provider value={{ setDisplayType, displayType }}>
            {children}
        </TodoListDisplayContext.Provider>
    );
};