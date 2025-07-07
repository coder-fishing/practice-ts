import { CategoryHeader } from "./categoryHeader";
import { CategoryRow } from "./categoryRow";
import type { Category } from "~/types/category.type";

export function CategoryTable(
  categories: Category[], 
  sortField: string = '', 
  sortOrder: 'asc' | 'desc' = 'asc'
): string {
  return `
        <table class="product-table">
            ${CategoryHeader(sortField, sortOrder)}
            <tbody>
                ${categories.map((category) => CategoryRow({ category })).join("")}
            </tbody>
        </table>
    `;
}
