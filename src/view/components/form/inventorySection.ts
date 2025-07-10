import { PRODUCT_FORM_FIELDS } from "~/constant";
import { renderField } from "~/utils/formUtils";

export interface InventorySectionProps {
  productData: any;
}

export const InventorySection = ({ productData }: InventorySectionProps): string => {
  return `
    <div class="field_container">
      ${renderField(PRODUCT_FORM_FIELDS.INVENTORY.SKU, productData.sku)}
      ${renderField(PRODUCT_FORM_FIELDS.INVENTORY.BARCODE, productData.barcode)}
      ${renderField(PRODUCT_FORM_FIELDS.INVENTORY.QUANTITY, productData.quantity)}
    </div>
  `;
};
