import {router} from '~/router/Router.js';

let totalNotifications = 0;

const subMenu = (
  subMenuName: string,
  notification: number,
  link: string
): HTMLElement => {
  const div = document.createElement('div');
  div.className = 'subMenu';
  div.setAttribute('data-link', link);

  const name = document.createElement('p');
  name.className = 'subMenu__name';
  name.textContent = subMenuName;
  div.appendChild(name);

  div.addEventListener('click', () => {
    router.navigate(link);
  });

  if (notification > 0) {
    totalNotifications += notification;

    const notiWrapper = document.createElement('span');
    notiWrapper.className = 'subMenu__notification';
    notiWrapper.setAttribute('notification', notification.toString());

    const notiNumber = document.createElement('span');
    notiNumber.className = 'subMenu__notification--number';
    notiNumber.textContent = notification.toString();

    notiWrapper.appendChild(notiNumber);
    div.appendChild(notiWrapper);
    
  }

  return div;
};

const getTotalNotifications = (): number => totalNotifications;

export { subMenu, getTotalNotifications };
