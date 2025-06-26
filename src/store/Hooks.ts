import { useContext } from "react";
import TodoDisplayContext, { type TodoListDisplayType } from "./TodoContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRepository } from "./Repository/RepositoryManager";

export const useDisplayContext = () => {
  const context = useContext(TodoDisplayContext);
  if (!context) {
    throw new Error("useTodos must be used within a TodosProvider");
  }
  return context;
};

// API Hooks
const repo = getRepository();

export function useTodos(displayType: TodoListDisplayType) {
  return useQuery({
    queryKey: ["todos", displayType],
    queryFn: () => repo.getTodos(displayType),
  });
}

export function useAddTodo(displayType: TodoListDisplayType) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (task: string) => repo.addTodo(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", displayType] });
    },
  });
}

export function useRemoveTodo(
  displayType: TodoListDisplayType,
  options: { onSuccess?: (...args: unknown[]) => void } = {}
) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (id: string) => repo.removeTodo(id),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["todos", displayType] });
      if (typeof options.onSuccess === "function") {
        options.onSuccess(...args);
      }
    },
  });
}

export function useToggleTodo(displayType: TodoListDisplayType) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      repo.toggleTodo(id, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", displayType] });
    },
  });
}
