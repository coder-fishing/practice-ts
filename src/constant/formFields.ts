// Product Form Field Configurations
export const PRODUCT_FORM_FIELDS = {
    GENERAL: {
      PRODUCT_NAME: {
        label: "Product Name",
        name: "productName",
        placeholder: "Type product name here...",
        required: true
      },
      DESCRIPTION: {
        label: "Product Description", 
        name: "description",
        placeholder: "Type product description here...",
        textarea: true,
        required: true
      }
    },
    
    PRICING: {
      PRICE: {
        label: "Price",
        name: "price", 
        placeholder: "Type product price here...",
        type: "number",
        required: true
      },
      DISCOUNT_TYPE: {
        label: "Discount Type",
        name: "discountType",
        options: [
          { value: "percentage", label: "Percentage" },
          { value: "fixed", label: "Fixed Amount" },
          { value: "discount_type_86", label: "Discount Type 86" }
        ]
      },
      DISCOUNT_VALUE: {
        label: "Discount Value",
        name: "discountValue",
        placeholder: "Type discount value here...",
        type: "number", 
        required: true
      },
      TAX_CLASS: {
        label: "Tax Class",
        name: "tax_class",
        options: [
          { value: "tax-free", label: "Tax Free" },
          { value: "vat", label: "VAT" },
          { value: "tax_class_86", label: "Tax Class 86" }
        ]
      },
      VAT_AMOUNT: {
        label: "VAT Amount",
        name: "vatAmount", 
        placeholder: "Type VAT amount here...",
        type: "number",
        required: true
      }
    },
    
    INVENTORY: {
      SKU: {
        label: "SKU",
        name: "sku",
        placeholder: "Type SKU here...",
        required: true
      },
      BARCODE: {
        label: "Barcode",
        name: "barcode", 
        placeholder: "Type barcode here...",
        required: true
      },
      QUANTITY: {
        label: "Quantity",
        name: "quantity",
        placeholder: "Type quantity here...",
        type: "number",
        required: true
      }
    }
  } as const;
  