import { APIRepository } from "./Domains/APIRepository";
import { LocalTodoRepository } from "./Domains/LocalTodoRepository";
import type { TodoDisplayTypeRepository, TodoRepository } from "./TodoRepository";

export const getRepository = () : TodoRepository & TodoDisplayTypeRepository => {
  return import.meta.env.VITE_REPO_TYPE === "api" ? new APIRepository() : new LocalTodoRepository();
}