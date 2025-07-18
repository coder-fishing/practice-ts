import { BUTTON_GROUPS } from '~/constant';
import { BREADCRUMBS } from '~/constant';
import { CategoryTable } from '~/view/components/table/categoryTable';
import CategoryController from '~/controllers/CategoryController';
import { BaseListPage } from '~/view/components/BaseListPage';
import type { Category } from '~/types/category.type';
const categoryController = CategoryController.getInstance();

export const CategoryList = async (): Promise<HTMLElement> => {
  const baseListPage = new BaseListPage<Category>({
    controller: categoryController,
    breadcrumbConfig: BREADCRUMBS.CATEGORY_LIST,
    buttonConfig: BUTTON_GROUPS.LIST.CATEGORY,
    tableRenderer: CategoryTable,
    className: 'product-list',
    title: 'Category',
    pageSize: 3
  });

  const container = await baseListPage.render();
  
  // Initialize URL routing and search functionality after DOM is rendered
  setTimeout(() => {
    categoryController.initializeURLRouting();
    // categoryController.initializeSearch();
    categoryController.initializeController();
  }, 100);

  return container;
};
