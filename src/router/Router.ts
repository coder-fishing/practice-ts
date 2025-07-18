export interface Route {
  path: string;
  component: (params?: any) => HTMLElement | string | Promise<HTMLElement>;
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

  // Parse path parameters from route pattern
  private parseParams(pattern: string, path: string): any {
    const patternSegments = pattern.split('/');
    const pathSegments = path.split('/');
    const params: any = {};

    if (patternSegments.length !== pathSegments.length) {
      return null;
    }

    for (let i = 0; i < patternSegments.length; i++) {
      const patternSegment = patternSegments[i];
      const pathSegment = pathSegments[i];

      if (patternSegment.startsWith(':')) {
        // This is a parameter
        const paramName = patternSegment.slice(1);
        params[paramName] = pathSegment;
      } else if (patternSegment !== pathSegment) {
        // Segments don't match
        return null;
      }
    }

    return params;
  }

  // Find matching route and extract parameters
  private findRoute(path: string): { route: Route; params: any } | null {
    for (const [pattern, route] of this.routes) {
      const params = this.parseParams(pattern, path);
      if (params !== null) {
        return { route, params };
      }
    }
    return null;
  }

  async navigate(path: string, pushState: boolean = true): Promise<void> {
    const match = this.findRoute(path);
    
    if (!match) {
      console.warn(`Route not found: ${path}`);
      return;
    }

    const { route, params } = match;
    this.currentRoute = path;
    
    // Update browser URL if needed
    if (pushState) {
      window.history.pushState({}, '', path);
    }

    // Update document title
    if (route.title) {
      document.title = route.title;
    }

    // Handle async components
    try {
      const component = route.component(params);
      if (component instanceof Promise) {
        // Show loading state
        this.renderLoading();
        const resolvedComponent = await component;
        this.render(resolvedComponent);
      } else {
        this.render(component);
      }
    } catch (error) {
      console.error('Error rendering component:', error);
      this.renderError();
    }
  }

  private renderLoading(): void {
    const contentElement = document.querySelector('#main-content');
    if (contentElement) {
      contentElement.innerHTML = `
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      `;
    }
  }

  private renderError(): void {
    const contentElement = document.querySelector('#main-content');
    if (contentElement) {
      contentElement.innerHTML = `
        <div class="error-container">
          <h3>Error</h3>
          <p>Something went wrong. Please try again.</p>
        </div>
      `;
    }
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