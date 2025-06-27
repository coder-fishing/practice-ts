import { MENUITEMS } from "~/constant";
import { navigationItem } from "~/view/components/navigationItem";
import { navigationItemDropDown } from "~/view/components/navigationItemDropDown";
import { subMenu, getTotalNotifications } from "../components/submenu";
import navigationController from "~/controllers/NavigationController";

import {
  logo, dashboard, dashboardHover, shop, shopHover, down, downHover, check, checkHover,
  folder, folderHover, comment, commentHover, calendar, calendarHover,
  user, userHover
} from "~/assets/icon";

// Get singleton controller instance
const nav = navigationController.getInstance();

// Generate submenu items
const submenuItems = MENUITEMS.map(item =>
  subMenu(item.name, item.notification, item.link)
);

// Total notification count for E-Commerce
const totalNotifications = getTotalNotifications();

// Main navigation rendering function
const navigation = (): HTMLElement => {
  const navElement = document.createElement("nav");
  navElement.className = "navigation";

  // Logo section
  const logoContainer = document.createElement("div");
  logoContainer.className = "navigation__container--logo";
  logoContainer.setAttribute("data-link", "/");

  const logoWrapper = document.createElement("div");
  logoWrapper.className = "navigation__container--logo--wrapper";

  const logoImg = document.createElement("img");
  logoImg.src = logo;
  logoImg.alt = "logo";

  const logoText = document.createElement("h1");
  logoText.className = "navigation__container--name";
  logoText.textContent = "Pixlab";

  logoWrapper.append(logoImg, logoText);
  logoContainer.appendChild(logoWrapper);
  navElement.appendChild(logoContainer);

  // Main navigation items
  navElement.appendChild(navigationItem(dashboard, dashboardHover, "Dashboard", "/"));

  // E-Commerce dropdown with submenu
  const ecommerceDropdown = navigationItemDropDown(
    shop,
    shopHover,
    "E-Commerce",
    totalNotifications,
    down,
    downHover,
    "ecommerceMenu"
  );
  navElement.appendChild(ecommerceDropdown);

  const subMenuContainer = document.createElement("div");
  subMenuContainer.id = "subMenuContainer";
  subMenuContainer.className = "subMenuContainer";
  subMenuContainer.style.display = "none";

  submenuItems.forEach(item => {
    subMenuContainer.appendChild(item);
  });

  navElement.appendChild(subMenuContainer);

  // Remaining navigation items
  navElement.appendChild(navigationItem(check, checkHover, "Project", "/project"));
  navElement.appendChild(
    navigationItemDropDown(user, userHover, "Contact", 3, down, downHover, "/product")
  );
  navElement.appendChild(navigationItem(folder, folderHover, "File Manager", "/files"));
  navElement.appendChild(navigationItem(comment, commentHover, "Chat", "/chat"));
  navElement.appendChild(navigationItem(calendar, calendarHover, "Calendar", "/calendar"));

  return navElement;
};

/**
 * Sets up navigation listeners using the NavigationController
 * This thin wrapper delegates setup to the controller instance.
 */
const setupNavigationListeners = (): void => {
  nav.setupNavigationListeners();
};

export default navigation;
export { setupNavigationListeners };
