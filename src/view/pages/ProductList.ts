import { BUTTON_GROUPS } from '~/constant';
import { BREADCRUMBS } from '~/constant';
import { TAG_FILTERS } from '~/constant';
import { ProductTable } from '~/view/components/table/productTable';
import ProductController from '~/controllers/ProductController';
import { BaseListPage } from '~/view/components/BaseListPage';
import type { Product } from '~/types/product.type';
// import { TestSearchController } from '~/controllers/TestSearchController';

const productController = ProductController.getInstance();
// Remove immediate call - will be called after render
let currentFilter = TAG_FILTERS.PRODUCT[0];


export const ProducList = async (): Promise<HTMLElement> => {
  const baseListPage = new BaseListPage<Product>({
    controller: productController,
    breadcrumbConfig: BREADCRUMBS.PRODUCT_LIST,
    buttonConfig: BUTTON_GROUPS.LIST.PRODUCT,
    tableRenderer: ProductTable,
    tagFilter: {
      filters: TAG_FILTERS.PRODUCT,
      currentFilter: currentFilter
    },
    className: 'product-list',
    title: 'Product',
    pageSize: 6
  });

  const renderedPage = await baseListPage.render();
  
  // Setup search after DOM is rendered
  setTimeout(() => {
    productController.initializeSearch();
  }, 0); 

  return renderedPage;
};
