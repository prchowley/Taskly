export type TodoItem = {
    id: string;
    task: string;
    completed: boolean;
    createdAt: Date;
}

export type TodoListDisplayType = 'active' | 'completed' | 'all';
