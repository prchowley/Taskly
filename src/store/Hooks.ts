import { type TodoListDisplayType } from "./TodoListDisplayType";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRepository } from "./Repository/RepositoryManager";

const repo = () => getRepository();

export function useTodos(displayType: TodoListDisplayType) {
  return useQuery({
    queryKey: ["todos", displayType],
    queryFn: () => repo().getTodos(displayType),
  });
}

export function useAddTodo(displayType: TodoListDisplayType) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (task: string) => repo().addTodo(task),
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
    mutationFn: (id: string) => repo().removeTodo(id),
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
      repo().toggleTodo(id, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", displayType] });
    },
  });
}

export function useGetDisplayType() {
  return useQuery({
    queryKey: ["displayType"],
    queryFn: () => repo().getDisplayType(),
  });
}

export function useSetDisplayType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (displayType: TodoListDisplayType) => repo().changeDisplayType(displayType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["displayType"] });
    },
  });
}
