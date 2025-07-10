import { caretDown, minus, checkbox } from "~/assets/icon";
import { createSortableHeaderCell } from "~/utils/createHeaderCell";

export const ProductTableHeader = (sortField: string = '', sortOrder: 'asc' | 'desc' = 'asc'): string => {
  return `
    <thead>
      <tr>
        <th class="product-table-header">
          <div class="product-table-header__wrapper three">
            <div class="product-table-header__image">
              <div class="product-table-header__imageleft">
                <img class="product-table-header__imageleft--first" src="${checkbox}" alt="checkbox"/>
                <img class="product-table-header__imageleft--second" src="${minus}" alt="tick"/>
              </div>
              <p class="product-table-header__name translate">Product</p>
            </div>
            <img src="${caretDown}" alt="arrow Down" class="product-title__icon sortable-header" data-field="name" />
          </div>
        </th>
        ${createSortableHeaderCell("SKU", "sku", sortField, sortOrder)}
        ${createSortableHeaderCell("Category", "category", sortField, sortOrder)}
        ${createSortableHeaderCell("Stock", "stock", sortField, sortOrder, true)}
        ${createSortableHeaderCell("Price", "price", sortField, sortOrder, true)}
        ${createSortableHeaderCell("Status", "status", sortField, sortOrder, true)}
        ${createSortableHeaderCell("Added", "createdAt", sortField, sortOrder, true)}
        <th class="product-table-header">
          <div class="product-table-header__wrapper">
            <p class="product-table-header__name">Action</p>
          </div>
        </th>
      </tr>
    </thead>
  `;
}