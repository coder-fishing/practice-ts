import { MENUITEMS } from "~/constant";
import { navigationItem } from "~/view/components/navigationItem";
import { navigationItemDropDown } from "~/view/components/navigationItemDropDown";
import { subMenu, getTotalNotifications } from "../components/submenu";
// Import NavigationController for dropdown management
import navigationController from "~/controllers/NavigationController";

import {
    logo, dashboard, dashboardHover, shop, shopHover, down, downHover, check, checkHover,
    folder, folderHover, comment, commentHover, calendar, calendarHover,
    user, userHover
} from "~/assets/icon";

const nav = navigationController.getInstance();

const submenuItes = MENUITEMS.map(item => subMenu(item.name, item.notification, item.link));

const totalNotifications = getTotalNotifications();
const navigation = (): HTMLElement => {
    const nav = document.createElement('nav');
    nav.className = 'navigation';

    const logoContainer = document.createElement('div');
    logoContainer.className = 'navigation__container--logo';
    logoContainer.setAttribute('data-link', '/');

    const logoWrapper = document.createElement('div');
    logoWrapper.className = 'navigation__container--logo--wrapper';

    const logoImg = document.createElement('img');
    logoImg.src = logo;
    logoImg.alt = 'logo';

    const logoText = document.createElement('h1');
    logoText.className = 'navigation__container--name';
    logoText.textContent = 'Pixlab';

    logoWrapper.append(logoImg, logoText);
    logoContainer.appendChild(logoWrapper);    nav.appendChild(logoContainer);
    
    // Dashboard item
    nav.appendChild(navigationItem(dashboard, dashboardHover, 'Dashboard', '/'));
      // E-Commerce dropdown with explicit ID for submenu functionality
    const ecommerceDropdown = navigationItemDropDown(shop, shopHover, 'E-Commerce', totalNotifications, down, downHover, 'ecommerceMenu');
    nav.appendChild(ecommerceDropdown);
    
    // Create submenu container properly
    const subMenuContainer = document.createElement('div');
    subMenuContainer.id = "subMenuContainer";
    subMenuContainer.className = "subMenuContainer";
    subMenuContainer.style.display = "none";
    
    // Add each submenu item to the container
    submenuItes.forEach(item => {
        subMenuContainer.appendChild(item);
    });
    
    // Add the submenu container to navigation
    nav.appendChild(subMenuContainer);
    
    // Project item
    nav.appendChild(navigationItem(check, checkHover, 'Project', '/project'));
    nav.appendChild(navigationItemDropDown(user, userHover, 'Contact', 3 , down, downHover, '/product'));
    nav.appendChild(navigationItem(folder, folderHover, 'File Manager', '/files'));
    nav.appendChild(navigationItem(comment, commentHover, 'Chat', '/chat'));
    nav.appendChild(navigationItem(calendar, calendarHover, 'Calendar', '/calendar'));

    return nav;
}

/**
 * Sets up navigation listeners using the NavigationController by nav
 * This thin wrapper function delegates all the complex logic to the controller
 */
const setupNavigationListeners = (): void => {
    nav.setupNavigationListeners();
};

export default navigation;
export { setupNavigationListeners };