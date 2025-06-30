import { FB_ID_TOKEN } from "@/lib/utils";
import { APIRepository } from "./Domains/APIRepository";
import { LocalTodoRepository } from "./Domains/LocalTodoRepository";
import type { TodoDisplayTypeRepository, TodoRepository } from "./TodoRepository";

export const getRepository = () : TodoRepository & TodoDisplayTypeRepository => {
  const idToken = localStorage.getItem(FB_ID_TOKEN);
  if (idToken) { return new APIRepository() }
  return import.meta.env.VITE_REPO_TYPE === "api" ? new APIRepository() : new LocalTodoRepository();
}