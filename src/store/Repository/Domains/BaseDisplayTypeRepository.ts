import type { TodoListDisplayType } from "@/store/TodoContext";
import { DEFAULT_DISPLAY_TYPE, STORAGE_KEY_DISPLAY_TYPE } from "@/lib/utils";

export class BaseDisplayTypeRepository {
    private displayType: TodoListDisplayType = DEFAULT_DISPLAY_TYPE;

    async changeDisplayType(type: TodoListDisplayType): Promise<TodoListDisplayType> {
        localStorage.setItem(STORAGE_KEY_DISPLAY_TYPE, type);
        this.displayType = type;
        return this.displayType;
    }

    async getDisplayType(): Promise<TodoListDisplayType> {
        const storedType = localStorage.getItem(STORAGE_KEY_DISPLAY_TYPE);
        if (storedType) {
            this.displayType = storedType as TodoListDisplayType;
        } else {
            localStorage.setItem(STORAGE_KEY_DISPLAY_TYPE, this.displayType);
        }
        return this.displayType;
    }
}