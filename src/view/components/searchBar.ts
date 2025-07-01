import { search }   from "~/assets/icon";
export const searchBar = (placeHolder: string): HTMLElement => {
    const wrapper = document.createElement('div');
    wrapper.className = 'search-bar';

    const icon = document.createElement('img');
    icon.src = search;
    icon.className = 'search-bar-icon';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'search-bar_input'
    input.placeholder = placeHolder

    wrapper.appendChild(icon)
    wrapper.appendChild(input)

    return wrapper

}