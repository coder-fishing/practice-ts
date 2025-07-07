import {
  eye,
  trash,
  pencil,
  checkbox,
  checkicon,
  noAvt,
} from "~/assets/icon";
import { formatters } from "~/utils/formatters";
import type { Product } from "~/types/product.type.ts";

function renderCell(content: string, className = ""): string {
  return `<td${className ? ` class="${className}"` : ""}>${content}</td>`;
}

export function ProductRow({ product }: { product: Product }): string {
  const statusClass = (product.status || "").replace(/\s+/g, "-").toLowerCase();

  return `
    <tr class="product-table__row" data-id="${product.id}">
      ${renderCell(
        `
        <div class="product-table__name">
          <div class="product-table__name__checkbox">
            <img src="${checkbox}" alt="checkbox" class="product-table__name__checkbox--box"/>
            <img src="${checkicon}" alt="check" class="product-table__name__checkbox--check"/>
          </div>
          <div class="product-table__container">
            <figure class="product-table__container--image">
              <img src="${
                product.ImageSrc?.firstImg || noAvt
              }" alt="product image"/>
            </figure>
            <div class="product-table__container--decs">
              <p class="product-table__container--decs--name" title="${
                product.name
              }">${formatters.formatName(product.name)}</p>
              <p class="product-table__container--decs--variants">${
                product.variants || ""
              }</p>
            </div>
          </div>
        </div>
      `,
        "product-table__item"
      )}
      ${renderCell(
        `<div class="product-table__item--sku" title="${
          product.sku
        }">${formatters.formatSKU(product.sku)}</div>`,
        "product-table__item"
      )}
      ${renderCell(
        `<div class="product-table__item--categories" title="${
          product.category || "undefined"
        }">${product.category || "undefined"}</div>`,
        "product-table__item"
      )}
      ${renderCell(
        `<div class="product-table__item--stock">${formatters.formatStock(
          product.quantity
        )}</div>`,
        "product-table__item"
      )}
      ${renderCell(
        `<div class="product-table__item--price">${formatters.formatPrice(
          product.price
        )}</div>`,
        "product-table__item"
      )}
      ${renderCell(
        `
        <div class="product-table__item--status">
          <div class="product-table__item--status-${statusClass}">
            <p class="product-table__item--status-${statusClass}-text">${
          product.status || "Unknown"
        }</p>
          </div>
        </div>
      `,
        "product-table__item"
      )}
      ${renderCell(
        `<div class="product-table__item--added">${formatters.formatDate(
          product.added
        )}</div>`,
        "product-table__item"
      )}
      ${renderCell(
        `
        <div class="product-table__item--buttons">
          <span class="product-table__edit" data-id="${product.id}"><img src="${pencil}" alt="pencil"/></span>
          <span class="product-table__view"><img src="${eye}" alt="eye"/></span>
          <span class="product-table__delete" data-id="${product.id}"><img src="${trash}" alt="trash"/></span>
        </div>
      `,
        "product-table__item"
      )}
    </tr>
  `;
}
