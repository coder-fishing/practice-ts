export type ProductImages = {
  firstImg?: string | null;
  secondImg?: string | null;
  thirdImg?: string  | null;
};

export type Product = {
  id: number | string;
  name: string;
  sku: string;
  category: string;
  categoryID: string;
  price: number;
  status: string;
  added: string;
  description: string;
  ImageSrc: ProductImages;
  discountType?: string;
  discount_value?: number;
  taxClass?: string;
  vat_amount?: number;
  barcode: string;
  quantity: number;
  variants?: string;
  stock: number;
  lastModified?: string; // For optimistic concurrency control
};
