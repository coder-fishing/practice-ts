import type { Product } from "./product.type";

export type productFormProps = {
    productData: Product;
    mode: "add" | "edit";
    onSubmit: (data: Product) => void;
    onDelete?: (id: string) => void; 
    onCancel?: () => void;
};