import type { BreadcrumbItem } from '~/types';
export const breadCrumbs = (items: BreadcrumbItem[], iconSrc: string) => {
    return `
        <div class="product-title-left__breadcrumb">
            ${items.map((item, index) => `
                ${item.link 
                    ? `<a href="${item.link}"><p class="product-title-left__breadcrumb--${item.active ? 'active' : 'normal'}">${item.label}</p></a>`
                    : `<p class="product-title-left__breadcrumb--${item.active ? 'active' : 'normal'}">${item.label}</p>`
                }
                ${index < items.length - 1 
                    ? `<figure><img src="${iconSrc}" alt="arrow right" class="product-title__icon" /></figure>` 
                    : ''
                }
            `).join('')}
        </div>
    `
}