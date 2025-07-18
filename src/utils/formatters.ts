// src/utils/formatters.ts

/**
 * Format utilities for product data with type safety
 */
export const formatters = {
  /**
   * Format text with ellipsis if exceeds max length
   * @param text - Input text to format
   * @param maxLength - Maximum length before truncating
   * @returns Formatted text with ellipsis if needed
   */
  formatText: <T extends string | undefined>(
    text: T,
    maxLength: number
  ): string => {
    if (!text) return "undefined";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  },

  /**
   * Format product name
   * @param name - Product name
   * @returns Formatted product name
   */
  formatName: <T extends string | undefined>(name: T): string => {
    return formatters.formatText(name, 30);
  },

  /**
   * Format product SKU
   * @param sku - Product SKU
   * @returns Formatted SKU
   */
  formatSKU: <T extends string | undefined>(sku: T): string => {
    return formatters.formatText(sku, 10);
  },

  /**
   * Format product description
   * @param description - Product description
   * @returns Formatted description
   */
  formatDescription: <T extends string | undefined>(description: T): string => {
    return formatters.formatText(description, 100);
  },

  /**
   * Format price with locale
   * @param price - Price value
   * @param locale - Locale for formatting (default: 'vi-VN')
   * @returns Formatted price string
   */
  formatPrice: <T extends number | undefined>(
    price: T,
    locale: string = "vi-VN"
  ): string => {
    if (price === undefined || price === null || isNaN(Number(price)))
      return "undefined";
    return new Intl.NumberFormat(locale, {
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(Number(price));
  },

  /**
   * Format stock quantity with locale
   * @param stock - Stock quantity
   * @param locale - Locale for formatting (default: 'vi-VN')
   * @returns Formatted stock string
   */
  formatStock: <T extends number | undefined>(
    stock: T,
    locale: string = "vi-VN"
  ): string => {
    if (stock === undefined || stock === null || isNaN(Number(stock)))
      return "undefined";
    return new Intl.NumberFormat(locale).format(Number(stock));
  },

  /**
   * Format date with locale
   * @param dateString - Date string or Date object
   * @param locale - Locale for formatting (default: 'vi-VN')
   * @returns Formatted date string
   */
  formatDate: <T extends string | Date | undefined>(
    dateString: T,
    locale: string = "vi-VN"
  ): string => {
    if (!dateString) return "undefined";
    try {
      const date = new Date(dateString);
        
        if (isNaN(date.getTime())) return "hehe";

      return new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
        .format(date)
        .replace(",", "");
    } catch {
      return "undefined";
    }
  },

  /**
   * Format currency with symbol
   * @param amount - Amount to format
   * @param currency - Currency code (default: 'VND')
   * @param locale - Locale for formatting (default: 'vi-VN')
   * @returns Formatted currency string
   */
  formatCurrency: <T extends number | undefined>(
    amount: T,
    currency: string = "VND",
    locale: string = "vi-VN"
  ): string => {
    if (amount === undefined || amount === null || isNaN(Number(amount)))
      return "undefined";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(Number(amount));
  },
};

export default formatters;