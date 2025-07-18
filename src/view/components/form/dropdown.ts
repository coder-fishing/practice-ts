import { caretDown } from "~/assets/icon";

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps {
  id: string;
  label?: string;
  value: string;
  options: DropdownOption[];
  placeholder?: string;
  btn?: string;
  cont?: string;
}

export const Dropdown = ({ id, label: _label, value, options, placeholder = "Select...", btn ,cont}: DropdownProps): string => {
  // Setup event listener after DOM is ready
  setTimeout(() => {
    const button = document.getElementById(`${id}${btn}`);
    const content = document.getElementById(`${id}${cont}`);
    
    if (button && content) {
      button.addEventListener('click', (event) => {
        if (content) {
          content.style.display = content.style.display === 'none' ? 'block' : 'none';
        }
        event.stopPropagation();
        return false;
      });
    }
  }, 0);

  return `
    <div class="dropdown" id="${id}">
      <div class="dropdown-group">
        <div class="dropbtn" id="${id}${btn}">${value || placeholder}</div>
        <img src="${caretDown}" alt="caret-down" class="caret-down"/>
      </div>
      <div class="dropdown-content" id="${id}${cont}">
        ${options.map(option => `
          <div data-value="${option.value}" data-id="${option.value}">${option.label}</div>
        `).join('')}
      </div>
    </div>
  `;
};