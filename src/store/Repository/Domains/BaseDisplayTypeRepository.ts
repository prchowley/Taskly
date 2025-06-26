import type { TodoDisplayType } from "@/store/TodoContext";
import { DEFAULT_DISPLAY_TYPE, STORAGE_KEY_DISPLAY_TYPE } from "@/lib/utils";

export class BaseDisplayTypeRepository {
    private displayType: TodoDisplayType = DEFAULT_DISPLAY_TYPE;

    async changeDisplayType(type: TodoDisplayType): Promise<TodoDisplayType> {
        localStorage.setItem(STORAGE_KEY_DISPLAY_TYPE, type);
        this.displayType = type;
        return this.displayType;
    }

    async getDisplayType(): Promise<TodoDisplayType> {
        const storedType = localStorage.getItem(STORAGE_KEY_DISPLAY_TYPE);
        if (storedType) {
            this.displayType = storedType as TodoDisplayType;
        } else {
            localStorage.setItem(STORAGE_KEY_DISPLAY_TYPE, this.displayType);
        }
        return this.displayType;
    }
}