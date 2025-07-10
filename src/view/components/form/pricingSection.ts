import { PRODUCT_FORM_FIELDS } from "~/constant";
import { renderField } from "~/utils/formUtils";

export interface PricingSectionProps {
  productData: any;
}

export const PricingSection = ({ productData }: PricingSectionProps): string => {
  return `
    ${renderField(PRODUCT_FORM_FIELDS.PRICING.PRICE, productData.price)}
    <div class="form-section__split">       
      ${renderField(PRODUCT_FORM_FIELDS.PRICING.DISCOUNT_TYPE, productData.discount_type)}
      ${renderField(PRODUCT_FORM_FIELDS.PRICING.DISCOUNT_VALUE, productData.discount_value)}
    </div>
    <div class="form-section__split">
      ${renderField(PRODUCT_FORM_FIELDS.PRICING.TAX_CLASS, productData.tax_class)}
      ${renderField(PRODUCT_FORM_FIELDS.PRICING.VAT_AMOUNT, productData.vat_amount)}
    </div>
  `;
};
