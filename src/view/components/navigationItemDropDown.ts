import { router } from "~/router/Router";

export const navigationItemDropDown = (
  icon: string,
  iconHover: string,
  name: string,
  number: number,
  icondown: string,
  icondownHover: string,
  id: string
): HTMLElement => {  
  const item = document.createElement("div");
  item.className = "navigation-item";
  item.id = id;  

  // Icon
  const img = document.createElement("img");
  img.src = icon;
  img.alt = name;
  // Add data attributes to track normal and hover states
  img.setAttribute('data-normal', icon);
  img.setAttribute('data-hover', iconHover);
  item.appendChild(img);

  // Label
  const span = document.createElement("span");
  span.className = 'navigation-item__word';
  span.textContent = name;
  item.appendChild(span);

  // Notification badge
  const notification = document.createElement("span");
  notification.className = "navigation-item__notification";

  const notificationNumber = document.createElement("span");
  notificationNumber.className = "navigation-item__notification--number";
  notificationNumber.textContent = number.toString();

  notification.appendChild(notificationNumber);
  item.appendChild(notification);
  // Create a wrapper for dropdown icons
  const dropdownWrapper = document.createElement("div");
  dropdownWrapper.className = "navigation-item__down-wrapper";
  
  // Normal dropdown icon 
  const dropdownIcon = document.createElement("img");
  dropdownIcon.src = icondown;
  dropdownIcon.alt = "dropdown";
  dropdownIcon.className = "navigation-item__down";
  dropdownWrapper.appendChild(dropdownIcon);
  
  // Hover dropdown icon (showing when active or hover)
  const dropdownIconHover = document.createElement("img");
  dropdownIconHover.src = icondownHover;
  dropdownIconHover.alt = "dropdown hover";
  dropdownIconHover.className = "navigation-item__down--hover";
  dropdownIconHover.style.opacity = "0";
  dropdownWrapper.appendChild(dropdownIconHover);
  
  item.appendChild(dropdownWrapper);
  
  // Hover effects - only for non-dropdown items or when not managed by NavigationController
  item.addEventListener("mouseenter", () => {
    // Only apply hover if not actively managed by dropdown controller
    if (!item.classList.contains("dropdown-managed")) {
      img.src = iconHover;
      dropdownIconHover.style.opacity = "1";
    }
  });
  
  item.addEventListener("mouseleave", () => {
    // Only reset hover if not actively managed by dropdown controller and not active
    if (!item.classList.contains("active") && !item.classList.contains("dropdown-managed")) {
      img.src = icon;
      dropdownIconHover.style.opacity = "0";
    }
  });

  // Click handler for navigation (if not a dropdown item)
  if (id !== "ecommerceMenu") {
    item.addEventListener("click", () => {
      router.navigate(id);
    });
  } else {
    // Mark this as dropdown-managed to prevent hover conflicts
    item.classList.add("dropdown-managed");
  }

  return item;
};
