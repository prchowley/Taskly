import type { TodoListDisplayType } from "@/store/TodoContext";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const STORAGE_KEY = "todos";
export const DEFAULT_DISPLAY_TYPE: TodoListDisplayType = "all";
export const STORAGE_KEY_DISPLAY_TYPE = "todoDisplayType";