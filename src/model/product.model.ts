export interface ProductImages {
    firstImg: string;
    secondImg: string;
    thirdImg: string;
}

export interface ProductProps {
    id: number;
    name: string;
    sku: string;
    category: string;
    category_ID: string;
    price: number;
    status: string;
    added: string;
    description: string;
    ImageSrc: ProductImages;
    discountType: string;
    discountValue: number;
    taxClass: string;
    vatAmount: number;
    barcode: string;
    quantity: number;
}

export class Product {
    public id!: number;
    public name!: string;
    public sku!: string;
    public category!: string;
    public category_ID!: string;
    public price!: number;
    public status!: string;
    public added!: string;
    public description!: string;
    public ImageSrc!: ProductImages;
    public discountType!: string;
    public discountValue!: number;
    public taxClass!: string;
    public vatAmount!: number;
    public barcode!: string;
    public quantity!: number;

    constructor(props: ProductProps) {
        Object.assign(this, props);
    }
}