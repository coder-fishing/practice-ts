import { caretDown, downHover } from "~/assets/icon";
export const createHeaderCell = (title: string, hasSort = false) => `
    <th class="product-table-header">
        <div class="product-table-header__wrapper${hasSort ? " two" : ""}">
            <p class="product-table-header__name">${title}</p>
            ${
              hasSort
                ? `<img src="${caretDown}" alt="arrow Down" class="product-title__icon" />`
                : ""
            }
        </div>
    </th>
`;

export const createSortableHeaderCell = (
  title: string,
  field: string,
  currentSortField: string,
  currentSortOrder: "asc" | "desc",
  hasSort = true
) => {
  const isActive = currentSortField === field;
  const sortClass = isActive ? `sort-${currentSortOrder}` : "";

  return `
    <th class="product-table-header">
        <div class="product-table-header__wrapper${hasSort ? " two" : ""} sortable-header" data-field="${field}">
            <p class="product-table-header__name">${title}</p>
            ${hasSort ? `
               <img
                    src="${isActive && currentSortOrder === 'asc' ? downHover : caretDown}"
                    alt="Sort ${title}"
                    class="product-title__icon sort-icon ${sortClass}"
                    style="transform: ${isActive && currentSortOrder === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)'}"
                />
            ` : ""}
        </div>
    </th>
  `;
};