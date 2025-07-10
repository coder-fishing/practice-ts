import type { Category } from "~/types/category.type";
import { eye, trash, pencil, checkbox, checkicon, noAvt } from "~/assets/icon";
import { formatters } from "~/utils/formatters";

function renderCell(content: string, className = ""): string {
  return `<td${className ? ` class="${className}"` : ""}>${content}</td>`;
}

export const CategoryRow = ({ category }: { category: Category }): string => {
  return `
        <tr class="product-table__row" data-id="${category.categoryID}">
             ${renderCell(
               `
        <div class="product-table__name">
          <div class="product-table__name__checkbox">
            <img src="${checkbox}" alt="checkbox" class="product-table__name__checkbox--box"/>
            <img src="${checkicon}" alt="check" class="product-table__name__checkbox--check"/>
          </div>
          <div class="product-table__container">
            <figure class="product-table__container--image">
              <img src="${category.image || noAvt}" alt="category image"/>
            </figure>
            <div class="product-table__container--decs">
              <p class="product-table__container--decs--name" title="${
                category.name
              }">${formatters.formatName(category.name)}</p>
              <p class="product-table__container--decs--variants">${
                formatters.formatDescription(category.description) || ""
              }</p>
            </div>
          </div>
        </div>
      `,
               "product-table__item"
             )}
                ${renderCell(
                  `<div class="product-table__item--sold">${
                    category.sold || 0
                  }</div>`,
                  "product-table__item"
                )}
                ${renderCell(
                  `<div class="product-table__item--stock">${
                    category.stock || 0
                  }</div>`,
                  "product-table__item"
                )}
                ${renderCell(
                  `<div class="product-table__item--added">${formatters.formatDate(
                    category.create_at ? new Date(category.create_at) : category.createdAt
                  )}</div>`,
                  "product-table__item"
                )}
                ${renderCell(
                  `<div class="product-table__item--action">
                    <div class="product-table__item--action--edit" data-id="${category.categoryID}">
                      <img src="${pencil}" alt="edit" class="edit-icon" />
                    </div>
                    <img src="${eye}" alt="view" class="product-table__item--action--view"/>
                    <img src="${trash}" alt="delete" class="product-table__item--action--delete" data-id="${category.categoryID}"/>
                </div>`,
                  "product-table__item"
                )}
        </tr>
    `;
};
