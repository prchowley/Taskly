import { useAddTodo, useGetDisplayType, useRemoveTodo, useSetDisplayType, useTodos, useToggleTodo } from '@/store/Hooks'
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
import { DEFAULT_DISPLAY_TYPE, FB_ID_TOKEN } from '@/lib/utils';
import type { TodoItem } from '@/store/Models/TodoItem';
import { useMediaQuery } from 'react-responsive';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from '@/lib/firebase';


export default function Todos() {
    const { data } = useGetDisplayType();
    const { mutate: setDisplayType } = useSetDisplayType()
    const displayType = data || DEFAULT_DISPLAY_TYPE;
    const { mutateAsync: removeTodo, isPending: isDeleting } = useRemoveTodo(displayType, {
        onSuccess: () => setOpenDeleteDialog(null)
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
        return !error && todos.length === 0 && !isTodoPending ? (
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
                    onKeyDown={e => { // To make the item accessible
                        if (e.key === "Enter" || e.key === " ") {
                            setOpenDeleteDialog(todo.id);
                        }
                    }}
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
            <div
                className="flex flex-col flex-1 cursor-pointer group"
                onClick={() => toggleTodo.mutate({ id: todo.id, completed: !todo.completed })}
                tabIndex={0}
                role="button"
                aria-pressed={todo.completed}
                onKeyDown={e => { // To make the item accessible
                    if (e.key === "Enter" || e.key === " ") {
                        toggleTodo.mutate({ id: todo.id, completed: !todo.completed });
                    }
                }}
            >
                {/* Top: checkbox + task */}
                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={todo.completed}
                        onClick={e => e.stopPropagation()} // Prevent click bubbling
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
            <div className="mb-2 p-2 rounded bg-red-100 text-red-700 border border-red-200 text-center mt-2">
                {error instanceof Error ? error.message : "An error occurred while loading your todos."}
            </div>
        )
    }

    const isMobile = useMediaQuery({ maxWidth: 767 });

    const loadingSkeleton = () => {
        const containerClass = isMobile ? "flex-1 mt-2" : "flex-1 overflow-y-auto mt-2"

        return isTodoPending ? (
            <div className={containerClass}>
                {[...Array(3)].map((_, i) => todoItemSkeleton(i))}
            </div>
        ) : (
            <div className={containerClass}>
                {todos.map(todoItem)}
            </div>
        )
    }

    const syncButton = () => (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button
                    className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors duration-200"
                    disabled={singinIn}
                >
                    {singinIn ? 'Signin in...' : syncing ? 'Syncing' : `Sync`}
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white transition-all duration-1000 ease-out data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
                <AlertDialogHeader>
                    <AlertDialogTitle>To sync, you need to sign-in?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        className='hover:bg-gray-200 cursor-pointer'
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className='bg-black hover:bg-red-700 transition-colors duration-100 cursor-pointer text-white'
                        onClick={ async () => {
                            await handleGoogleSignIn();
                            await handleSync();
                        }}
                    >
                        {singinIn ? (
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
                                Signin & Syncing...
                            </span>
                        ) : (
                            <>
                                Sign-in with
                                <svg width="28" height="28" viewBox="0 0 48 48" aria-hidden="true">
                                    <g>
                                        <circle cx="24" cy="24" r="20" fill="none" />
                                        <path fill="white" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.3-5.7 7-11.3 7-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6-6C34.1 5.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.3-3.5z" />
                                    </g>
                                </svg>
                            </>

                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );


    const [singinIn, setSigninIn] = useState(false);
    const handleGoogleSignIn = async () => {
        setSigninIn(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            if (user) {
                const idToken = await user.getIdToken();
                localStorage.setItem(FB_ID_TOKEN, idToken);
            }
        } catch (error) {
            alert(`Google sign-in failed with error: ${error}`);
        } finally {
            setSigninIn(false);
        }
    };

    const [syncing, setSyncing] = useState<boolean>(false);
    const addTodo = useAddTodo(displayType || DEFAULT_DISPLAY_TYPE);
    const handleSync = async () => {
        setSyncing(true);
        try {
            todos.forEach(async element => await addTodo.mutateAsync(element.task));
        } catch {
            alert(`Syncing failed with error: ${error}`);
        } finally {
            setSyncing(false);
        }
    };

    const idToken = localStorage.getItem(FB_ID_TOKEN);

    return (
        <div className={`m-4 w-full max-w-3xl mx-auto bg-white border border-black-200 rounded-md p-4 flex flex-col ${!isMobile ? "h-[60vh]" : ""}`}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Tasks</h2>
                {!idToken && syncButton()}
            </div>

            {toggleGroup()}

            {errorSection()}

            {noTodosMessage()}

            {loadingSkeleton()}

        </div>
    )
}
