import { searchBar } from "./searchBar";
import { iconAndNotification } from "./iconAndNotification";
import { avatarUser } from "./avatarUser";
import { calendar, bell, noImg, envelop, divider } from "~/assets/icon";

export const Header = (): HTMLElement =>{
    const wrapper = document.createElement('div');
    wrapper.className = 'header';
    wrapper.innerHTML = `
        ${searchBar('Search').outerHTML}
        ${iconAndNotification(calendar, 6)}   
        ${iconAndNotification(bell, 8)}
        ${iconAndNotification(envelop, 9)}
        ${iconAndNotification(noImg, 0)}
        <img src="${divider}" alt="divider" class="header-divider">
        ${avatarUser()}
    `;
    return wrapper;
}