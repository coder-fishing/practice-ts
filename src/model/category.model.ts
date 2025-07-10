export interface CategoryProps {
    sold: number;
    stock: number;
    description: string;
    image: string;
    name: string;
    createdAt: number;
    categoryID?: string; // Optional ID for the category
}

export class Category {
    public sold!: number;
    public stock!: number;
    public description!: string;
    public image!: string;
    public name!: string;
    public createdAt!: number;
    public categoryID?: string; // Optional ID for the category

  constructor(props: CategoryProps) {
    Object.assign(this, props);
  }
}