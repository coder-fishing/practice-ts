import type { productFormProps } from "~/types";
import { FormSection } from "./formSection";
import { MediaUpload } from "./mediaUpload";
import { PricingSection } from "./pricingSection";
import { InventorySection } from "./inventorySection";
import { CategoryDropdown } from "./categoryDropdown";
import { StatusDropdown } from "./statusDropdown";
import { PRODUCT_FORM_FIELDS } from "~/constant";
import { renderField } from "~/utils/formUtils";

export const productForm = ({productData, mode}: productFormProps ):string => {
    return ( 
    `<div class="product-form">
        <div class="product-form__body-left">
            ${FormSection({
                title: "General Information",
                className: "form-section--general",
                children: `
                    ${renderField(PRODUCT_FORM_FIELDS.GENERAL.PRODUCT_NAME, productData.name)}
                    ${renderField(PRODUCT_FORM_FIELDS.GENERAL.DESCRIPTION, productData.description)}
                `
            })}
            
            ${FormSection({
                title: "Media",
                className: "form-section--media",
                children: MediaUpload({
                    images: productData.ImageSrc,
                    mode: mode
                })
            })}
            
            ${FormSection({
                title: "Pricing",
                className: "form-section--pricing",
                children: PricingSection({ productData })
            })}
            
            ${FormSection({
                title: "Inventory",
                className: "form-section--inventory",
                children: InventorySection({ productData })
            })}
        </div>
        
        <div class="product-form__body-right">
            ${CategoryDropdown({ value: productData.category })}
            ${StatusDropdown({ value: productData.status, className: productData.status?.toLowerCase().replace(' ', '-') || 'draft' })}
        </div>
    </div>`
     )

}