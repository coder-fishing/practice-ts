import { router } from './router/Router.js';
import { Layout } from './view/layout/index.js';
import { ProducList } from './view/pages/ProductList.js';
import { CategoryList } from './view/pages/CategoryList.js';
import { setupNavigationListeners } from './view/layout/navigation.js';
import { AddCategory } from './view/pages/AddCategory.js';
import { AddProduct } from './view/pages/AddProduct.js';
import { EditCategory } from './view/pages/EditCategory.js';
import { EditProduct } from './view/pages/EditProduct.js';
import CategoryController from './controllers/CategoryController';
import { ProductController } from './controllers/ProductController';

export function App() {
  const appElement = document.querySelector<HTMLDivElement>('#app');
  if (!appElement) return;

  // Clear old content
  appElement.innerHTML = '';
  appElement.className = 'app';

  // Render layout
  const layout = Layout();
  appElement.appendChild(layout);
  // Setup navigation event listeners after DOM is fully rendered
  setTimeout(() => {
    setupNavigationListeners();

  }, 100);
  // Setup router
  router.addRoute({
    path: '/',
    component: () => ProducList(),
    title: 'Trang chủ - TypeScript App',
  });
  router.addRoute({
    path: "/product",
    component: () => ProducList(),
    title: "Về chúng tôi - TypeScript App",
  });

  router.addRoute({
    path: '/products',
    component: () => ProducList(),
    title: 'Danh sách sản phẩm - TypeScript App'
  });

  router.addRoute({
    path: '/category',
    component: () => CategoryList(),
    title: 'Danh sách danh mục - TypeScript App'
  });

  router.addRoute({
    path: '/addcategory',
    component: () => AddCategory(),
    title: 'Thêm danh mục - TypeScript App'
  });

  router.addRoute({
    path: '/addproduct',
    component: () => AddProduct(),
    title: 'Thêm sản phẩm - TypeScript App'
  });

  router.addRoute({
    path: '/editcategory/:id',
    component: (params) => EditCategory(params),
    title: 'Chỉnh sửa danh mục - TypeScript App'
  });

  router.addRoute({
    path: '/editproduct/:id',
    component: (params) => EditProduct(params),
    title: 'Chỉnh sửa sản phẩm - TypeScript App'
  });

  // Initialize router
  router.init();

  // Initialize controllers
  const categoryController = CategoryController.getInstance();
  categoryController.initializeController();

  // Initialize ProductController and setup table event listeners
  const productController = ProductController.getInstance();
  productController.setupTableEventListeners();

  return { router };
}


