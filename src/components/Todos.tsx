import { useGetDisplayType, useRemoveTodo, useSetDisplayType, useTodos, useToggleTodo } from '@/store/Hooks'
import { Checkbox } from "@/components/ui/checkbox"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { TodoListDisplayType } from '@/store/TodoListDisplayType';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from 'react';
import { DEFAULT_DISPLAY_TYPE } from '@/lib/utils';
import type { TodoItem } from '@/store/Models/TodoItem';

export default function Todos() {
    const { data } = useGetDisplayType();
    const { mutate: setDisplayType } = useSetDisplayType()
    const displayType = data || DEFAULT_DISPLAY_TYPE;
    const { mutateAsync: removeTodo, isPending: isDeleting } = useRemoveTodo(displayType, {
        onSuccess: () => {
            setOpenDeleteDialog(null);
        }
    });
    const toggleTodo = useToggleTodo(displayType);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<string | null>(null);
    const { data: todos = [], isPending: isTodoPending, error } = useTodos(displayType);

    const toggleGroup = () => {
        return (
            <ToggleGroup variant="outline" type="single" className="flex w-full" value={displayType} onValueChange={(e) => setDisplayType(e as TodoListDisplayType)}>
                {['all', 'active', 'completed'].map((type) => (
                    <ToggleGroupItem
                        key={type}
                        value={type}
                        className={`flex-1 text-center ${displayType === type ? 'bg-gray-200 text-black-900' : 'bg-white-100 text-gray-700 hover:bg-gray-200 cursor-pointer'}`}
                        aria-label={`Toggle ${type}`}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>
        )
    }

    const noTodosMessage = () => {
        return todos.length === 0 && !isTodoPending ? (
            <div className="mt-4 text-gray-500 text-center">
                {(() => {
                    switch (displayType) {
                        case 'active':
                            return "🎉 No active tasks! Take a break or add something new.";
                        case 'completed':
                            return "🏆 No completed tasks yet. Time to make your first victory!";
                        case 'all':
                        default:
                            return "📝 Nothing here yet... Start your productivity adventure!";
                    }
                })()}
            </div>
        ) : null
    }

    const deleteButtonForTodo = (todo: TodoItem) => (
        <AlertDialog
            open={openDeleteDialog === todo.id}
            key={todo.id}
        >
            <AlertDialogTrigger asChild>
                <button
                    className="border border-black-200 hover:bg-red-200 text-black-700 hover:text-red-900 rounded p-2 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 cursor-pointer"
                    aria-label="Delete todo"
                    title="Delete"
                    onClick={() => setOpenDeleteDialog(todo.id)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m2 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7h12z" />
                    </svg>
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent
                className="bg-white transition-all duration-1000 ease-out data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"

            >
                <AlertDialogHeader>
                    <AlertDialogTitle>Do you want to delete this task?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. Are you sure you want to delete the task "<b>{todo.task}</b>"?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        className='hover:bg-gray-200 cursor-pointer'
                        disabled={isDeleting}
                        onClick={() => setOpenDeleteDialog(null)}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={async () => removeTodo(todo.id)}
                        className='bg-black hover:bg-red-700 transition-colors duration-100 cursor-pointer text-white'
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="8"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M12 2a10 10 0 1 1-7.07 2.93l2.83 2.83A6 6 0 1 0 18 12h4c0-5.52-4.48-10-10-10z"
                                    />
                                </svg>
                                Deleting
                            </span>
                        ) : (
                            <>Delete</>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );

    const todoItem = (todo: TodoItem) => (
        <div
            key={todo.id}
            className="flex items-center justify-between gap-4 py-2 border-b last:border-b-0"
        >
            {/* Left: vertical stack */}
            <div className="flex flex-col flex-1">
                {/* Top: checkbox + task */}
                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo.mutate({ id: todo.id, completed: !todo.completed })}
                        className="cursor-pointer"
                    />
                    <span className={`text-base ${todo.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
                        {todo.task}
                    </span>

                </div>
                {/* Bottom: id */}
                <span className="text-xs text-gray-400 ml-6">#{todo.id}</span>
            </div>

            {/* Right: delete button */}
            {deleteButtonForTodo(todo)}

        </div>
    )

    const todoItemSkeleton = (key: number) => (
        <div
            key={key}
            className="flex items-center justify-between gap-4 py-2 border-b last:border-b-0 animate-pulse"
        >
            {/* Left: vertical stack */}
            <div className="flex flex-col flex-1">
                {/* Top: checkbox + task */}
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gray-200 rounded-[4px]" />
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                </div>
                {/* Bottom: id */}
                <div className="h-3 w-16 bg-gray-100 rounded ml-7 mt-1" />
            </div>
            {/* Right: delete button */}
            <div className="w-8 h-8 bg-red-100 rounded" />
        </div>
    );

    const errorSection = () => {
        {/* Error Section */ }
        if (error) return (
            <div className="mb-2 p-2 rounded bg-red-100 text-red-700 border border-red-200 text-center">
                {error instanceof Error ? error.message : "An error occurred while loading your todos."}
            </div>
        )
    }

    const loadingSkeleton = () => {
        return isTodoPending ? (
            <div className="flex-1 overflow-y-auto">
                {[...Array(3)].map((_, i) => todoItemSkeleton(i))}
            </div>
        ) : (
            <div className="flex-1 overflow-y-auto mt-2">
                {todos.map(todoItem)}
            </div>
        )
    }

    return (
        <div className="m-4 w-full max-w-3xl mx-auto bg-white shadow-md rounded-md p-4 flex flex-col h-[60vh]">
            <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>

            {toggleGroup()}

            {errorSection()}

            {noTodosMessage()}

            {loadingSkeleton()}

        </div>
    )
}
