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
  return `
    <div class="dropdown" id="${id}">
      <div class="dropdown-group">
        <div class="dropbtn" id="${id}${btn}" data-action="toggle-dropdown" data-target="${id}${cont}">
          ${value || placeholder}
        </div>
        <img src="${caretDown}" alt="caret-down" class="caret-down"/>
      </div>
      <div class="dropdown-content" id="${id}${cont}" style="display: none;">
        ${options.map(option => `
          <div data-value="${option.value}" data-id="${option.value}" data-action="select-option">${option.label}</div>
        `).join('')}
      </div>
    </div>
  `;
};