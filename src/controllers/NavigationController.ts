/**
 * NavigationController - Handles all navigation interactions and logic
 * Separates the UI rendering from event handling and business logic
 */

export class NavigationController {
  private static instance: NavigationController;

  // Singleton pattern to ensure only one controller instance
  public static getInstance(): NavigationController {
    if (!NavigationController.instance) {
      NavigationController.instance = new NavigationController();
    }
    return NavigationController.instance;
  }

  /**
   * Sets up all event listeners for navigation items
   */
  public setupNavigationListeners(): void {
    console.log("Setting up navigation listeners");
    
    // Use setTimeout to ensure DOM is fully rendered
    setTimeout(() => {
      this.setupDropdownListeners();
      this.setupGlobalClickListener();
    }, 100);
  }

  /**
   * Sets up dropdown functionality for navigation items with submenus
   */
  private setupDropdownListeners(): void {
    const ecommerceMenu = document.getElementById("ecommerceMenu");
    const subMenuContainer = document.getElementById("subMenuContainer");
    
    console.log("Navigation elements:", { 
      ecommerceMenu: ecommerceMenu, 
      subMenuContainer: subMenuContainer,
      submenuItems: subMenuContainer?.children.length
    });
    
    if (!ecommerceMenu || !subMenuContainer) {
      console.error("Navigation elements not found");
      return;
    }
    
    const icons = ecommerceMenu.querySelectorAll(".navigation-item__down--hover");
    const iconnormals = ecommerceMenu.querySelectorAll(".navigation-item__down");
    const mainIcon = ecommerceMenu.querySelector("img");
    
    console.log("Icons found:", { 
      hoverIcons: icons.length, 
      normalIcons: iconnormals.length,
      mainIcon: mainIcon
    });
    
    if (icons.length === 0 || iconnormals.length === 0) {
      console.error("Icons not found in ecommerceMenu");
      return;
    }
    
    const iconnormal = iconnormals[0] as HTMLElement;
    const icon = icons[0] as HTMLElement;

    // Toggle menu when clicked
    ecommerceMenu.addEventListener("click", (event) => {
      event.stopPropagation();
      const isActive = ecommerceMenu.classList.toggle("active");
      
      subMenuContainer.style.display = isActive ? "block" : "none";
      console.log("Toggled submenu:", isActive ? "shown" : "hidden");
      
      // Reset icon states
      this.updateIconStates(ecommerceMenu, icon, iconnormal, mainIcon, isActive);
    });
  }
  
  /**
   * Updates icon states based on active status
   */
  private updateIconStates(
    menuItem: HTMLElement, 
    hoverIcon: HTMLElement, 
    normalIcon: HTMLElement,
    mainIcon: HTMLElement | null,
    isActive: boolean
  ): void {
    if (isActive) {
      // Active state
      hoverIcon.style.transform = "rotate(180deg)";
      hoverIcon.style.opacity = "1";
      normalIcon.style.display = "none";
      if (mainIcon && mainIcon instanceof HTMLImageElement) {
        // Set main icon to hover state if it has data-hover attribute
        const hoverSrc = mainIcon.getAttribute('data-hover');
        if (hoverSrc) mainIcon.src = hoverSrc;
      }
    } else {
      // Inactive state
      hoverIcon.style.transform = "rotate(0deg)";
      hoverIcon.style.opacity = "0";
      normalIcon.style.display = "block";
      if (mainIcon && mainIcon instanceof HTMLImageElement) {
        // Reset main icon to normal state
        const normalSrc = mainIcon.getAttribute('data-normal');
        if (normalSrc) mainIcon.src = normalSrc;
      }
    }
  }
  /**
   * Sets up global document click handler to close dropdown when clicking elsewhere
   */
  private setupGlobalClickListener(): void {
    document.addEventListener("click", (event) => {
      const ecommerceMenu = document.getElementById("ecommerceMenu");
      const subMenuContainer = document.getElementById("subMenuContainer");
      
      if (!ecommerceMenu || !subMenuContainer) return;
      
      const hoverIcon = ecommerceMenu.querySelector(".navigation-item__down--hover") as HTMLElement;
      const normalIcon = ecommerceMenu.querySelector(".navigation-item__down") as HTMLElement;
      const mainIcon = ecommerceMenu.querySelector("img");
      
      // Check if click is outside both menu and submenu
      if (ecommerceMenu && !ecommerceMenu.contains(event.target as Node) && 
          subMenuContainer && !subMenuContainer.contains(event.target as Node)) {
        
        // Remove active state and reset all icons
        ecommerceMenu.classList.remove("active");
        subMenuContainer.style.display = "none";
        
        if (hoverIcon && normalIcon) {
          this.updateIconStates(ecommerceMenu, hoverIcon, normalIcon, mainIcon, false);
        }   
       }
    });
  }
}

// Export a default instance for easy import
export default NavigationController;
