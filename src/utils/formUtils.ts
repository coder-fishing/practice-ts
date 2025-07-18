import { InputFieldProduct } from "~/view/components/form/inputFiledProduct";

/**
 * Utility function to render input field with data
 * @param fieldConfig - Field configuration from constant
 * @param value - Value from product data
 * @returns Rendered input field HTML
 */
export const renderField = (fieldConfig: any, value: any = ''): string => {
  return InputFieldProduct({
    ...fieldConfig,
    value: value || ''
  });
};

/**
 * Utility function to render multiple fields
 * @param fields - Array of field configurations with values
 * @returns Rendered fields HTML
 */
export const renderFields = (fields: Array<{ config: any; value: any }>): string => {
  return fields.map(({ config, value }) => renderField(config, value)).join('');
};