import { ProductTableHeader } from "./productHeader";
import { ProductRow } from "./productRow";
import type { Product } from "~/types/product.type";

export function ProductTable(
  products: Product[], 
  sortField: string = '', 
  sortOrder: 'asc' | 'desc' = 'asc'
): string {
    console.log('Rendering Product Table with products:', products);
  return `
        <table class="product-table">
            ${ProductTableHeader(sortField, sortOrder)}
            <tbody>
                ${products.map((product) => ProductRow({ product })).join("")}
            </tbody>
        </table>
    `;
}
