import type { TodoListDisplayType } from "@/store/TodoListDisplayType";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const STORAGE_KEY = "todos";
export const DEFAULT_DISPLAY_TYPE: TodoListDisplayType = "all";
export const STORAGE_KEY_DISPLAY_TYPE = "todoDisplayType";
export const FB_ID_TOKEN = "idToken";