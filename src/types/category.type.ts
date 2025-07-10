export type Category = {
  id?: string;
  stock: number;
  sold?: number;
  createdAt?: string;
  create_at?: number; // Legacy support
  name: string;
  description: string;
  image?: string;
  avatar?: string; // Alternative image field
  categoryID?: string;
  status?: string;
};
    