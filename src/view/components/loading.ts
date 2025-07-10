export interface LoadingProps {
    message?: string;
    isOverlay?: boolean;
  }
  
  export function Loading({ 
    message = "Loading...", 
    isOverlay = false 
  }: LoadingProps): HTMLElement {
    const loadingContainer = document.createElement('div');
    
    if (isOverlay) {
      loadingContainer.className = 'loading-overlay';
      loadingContainer.innerHTML = `
        <div class="loading-backdrop"></div>
        <div class="loading-content">
          <div class="loading-spinner">
            <div class="spinner"></div>
          </div>
          <div class="loading-message">${message}</div>
        </div>
      `;
    } else {
      loadingContainer.className = 'loading-inline';
      loadingContainer.innerHTML = `
        <div class="loading-spinner">
          <div class="spinner"></div>
        </div>
        <div class="loading-message">${message}</div>
      `;
    }
    
    return loadingContainer;
  }
  
  // Helper function to show overlay loading
  export function showOverlayLoading(message?: string): HTMLElement {
    const existingOverlay = document.querySelector('.loading-overlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }
    
    const loading = Loading({ message, isOverlay: true });
    document.body.appendChild(loading);
    
    return loading;
  }
  
  // Helper function to hide overlay loading
  export function hideOverlayLoading(): void {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
      overlay.remove();
    }
  }
  