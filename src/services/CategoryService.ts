import type { Category } from "~/types/category.type";
import BaseService from "./BaseService";

export default class CategoryService extends BaseService {
  constructor() {
    super("https://67c09c48b9d02a9f224a690e.mockapi.io/api/cate");
  }

  async getAllCategories(): Promise<Category[]> {
    return this.getAll<Category>();
  }

  async getCategoryById(id: number): Promise<Category> {
    return this.getById<Category>(id.toString());
  }

  async createCategory(category: Category): Promise<Category> {
    return this.create<Category>(category);
  }

  async updateCategory(id: number, category: Category): Promise<Category> {
    return this.update<Category>(id.toString(), category);
  }

  async deleteCategory(id: number): Promise<void> {
    return this.deleteById(id.toString());
  }

  // Có thể thêm method riêng
  async getProductsByCategory(categoryId: string): Promise<Category[]> {
    return this.get<Category[]>(`/category/${categoryId}`);
  }

  // Server-side pagination method
  async getCategoriesPaginated(page: number = 1, limit: number = 10, sort?: string, order?: string){
    return this.getPaginated<Category>(page, limit, sort, order);
  }

  // Search categories
  async searchCategories(query: string, page: number = 1, limit: number = 10): Promise<Category[]> {
    const paginated = await this.search<Category>(query, page, limit);
    return (paginated.items || paginated.data || []) as Category[];
  }
}