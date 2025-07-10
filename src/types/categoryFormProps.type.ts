import type { Category } from "./category.type"

export type categoryFormProps = {
    categoryData: Category;
    mode: "add" | "edit";
    onSubmit?: (data: Category) => void;
}