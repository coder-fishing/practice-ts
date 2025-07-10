import { Dropdown } from "./dropdown";

export interface CategoryDropdownProps {
  value: string;
}

export const CategoryDropdown = ({ value }: CategoryDropdownProps): string => {
  return `
    <div class="form-section">
      <span>Category</span>
      <div class="form-section__field">
        <div class="form-section__field--name">Product Category</div> 
      </div>
      ${Dropdown({
        id: "dropdown",
        value: value || 'None',
        btn: "ButtonTop",
        cont: "ContentTop",
        options: [
          // Categories will be loaded dynamically from the API
        ],
        placeholder: "Select Category"
      })}
    </div>
  `;
};
