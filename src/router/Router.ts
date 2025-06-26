export interface Route {
  path: string;
  component: () => HTMLElement | string;
  title?: string;
}

export class Router {
  private routes: Map<string, Route> = new Map();
  private currentRoute: string = '/';

  constructor() {
    // Listen for browser back/forward navigation
    window.addEventListener('popstate', () => {
      this.navigate(window.location.pathname, false);
    });
  }

  addRoute(route: Route): void {
    this.routes.set(route.path, route);
  }

  navigate(path: string, pushState: boolean = true): void {
    const route = this.routes.get(path);
    
    if (!route) {
      console.warn(`Route not found: ${path}`);
      return;
    }

    this.currentRoute = path;
    
    // Update browser URL if needed
    if (pushState) {
      window.history.pushState({}, '', path);
    }

    // Update document title
    if (route.title) {
      document.title = route.title;
    }

    // Render the component
    this.render(route.component());
  }
  private render(component: HTMLElement | string): void {
    const contentElement = document.querySelector('#content');
    if (contentElement) {
      contentElement.innerHTML = '';
      if (typeof component === 'string') {
        contentElement.innerHTML = component;
      } else {
        contentElement.appendChild(component);
      }
    }
  }

  getCurrentRoute(): string {
    return this.currentRoute;
  }

  init(): void {
    // Navigate to current URL on init
    const currentPath = window.location.pathname || '/';
    this.navigate(currentPath, false);
  }
}

// Global router instance
export const router = new Router();
