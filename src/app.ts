import { router } from './router/Router.js';
import { Layout } from './view/layout/index.js';
import { ProducList } from './view/pages/ProductList.js';
import { ContactPage } from './view/pages/ContactPage.js';
import { CategoryList } from './view/pages/CategoryList.js';
import { setupNavigationListeners } from './view/layout/navigation.js';
import { AddCategory } from './view/pages/AddCategory.js';
import { AddProduct } from './view/pages/AddProduct.js';

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
    component: ProducList,
    title: 'Trang chủ - TypeScript App',
  });
  router.addRoute({
    path: "/product",
    component: ProducList,
    title: "Về chúng tôi - TypeScript App",
  });
  router.addRoute({
    path: '/contact',
    component: ContactPage,
    title: 'Liên hệ - TypeScript App',
  });

  router.addRoute({
    path: '/category',
    component: CategoryList,
    title: 'Danh sách danh mục - TypeScript App'
  });

  router.addRoute({
    path: '/addcategory',
    component: AddCategory,
    title: 'Thêm danh mục - TypeScript App'
  });

  router.addRoute({
    path: '/addproduct',
    component: AddProduct,
    title: 'Thêm sản phẩm - TypeScript App'
  });

  // Initialize router
  router.init();

  return { router };
}


