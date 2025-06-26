
import { App } from './app';
import '~/stylesheet/main.scss';

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Khởi tạo ứng dụng
  const app = App();

  // Export app instance để có thể tương tác từ console (dev only)
  (window as any).app = app;
});

