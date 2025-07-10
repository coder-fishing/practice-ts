import axios from 'axios';
import type { Product } from "../types/product.type";

// Interface for paginated response
export interface PaginatedResponse<T> {
  items: Product[];
  data: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default class BaseService {
  protected baseUrl: string = "https://67c09c48b9d02a9f224a690e.mockapi.io/api";

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  protected async get<T>(url: string): Promise<T> {
    const respone = await axios.get<T>(`${this.baseUrl}${url}`);
    if (respone.status !== 200) {
      throw new Error(`Error fetching data from ${url}: ${respone.statusText}`);
    }
    return respone.data;
  }

  protected async post<T>(url: string, data: any): Promise<T> {
    const response = await axios.post<T>(`${this.baseUrl}${url}`, data);
    if (response.status !== 200 && response.status !== 201) {
      throw new Error(`Error posting data to ${url}: ${response.statusText}`);
    }
    return response.data;
  }

  protected async put<T>(url: string, data: any): Promise<T> {
    const response = await axios.put<T>(`${this.baseUrl}${url}`, data);
    if (response.status !== 200 && response.status !== 204) {
      throw new Error(`Error putting data to ${url}: ${response.statusText}`);
    }
    return response.data;
  }

  protected async delete<T>(url: string): Promise<T> {
    const response = await axios.delete<T>(`${this.baseUrl}${url}`);
    if (response.status !== 200) {
      throw new Error(
        `Error deleting data from ${url}: ${response.statusText}`
      );
    }
    return response.data;
  }

  async getAll<T>(): Promise<T[]> {
    return this.get<T[]>("/");
  }

  async getById<T>(id: string): Promise<T> {
    return this.get<T>(`/${id}`);
  }

  async create<T>(data: any): Promise<T> {
    return this.post<T>("/", data);
  }

  async update<T>(id: string, data: any): Promise<T> {
    return this.put<T>(`/${id}`, data);
  }

  async deleteById<T>(id: string): Promise<T> {
    return this.delete<T>(`/${id}`);
  }

  // Generic pagination method
  async getPaginated<T>(page: number = 1, limit: number = 10, sort?: string, order?:string): Promise<PaginatedResponse<T>> {
    try {
      const url = `?page=${page}&limit=${limit}&sortBy=${sort || ''}&order=${order || ''}`;
      
      const paginatedData = await this.get<T[]>(url);
      
      const allData = await this.getAll<T>();
      const totalItems = allData.length;
      const totalPages = Math.ceil(totalItems / limit);
      return {
        items: paginatedData as any, // Adjust type as needed
        data: paginatedData,
        totalItems,
        currentPage: page,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      };
    } catch (error) {
      console.error('Error fetching paginated data:', error);
      throw error;
    }
  }

  /** 
   * Search method
   **/

  async search<T>(query:string, page: number, limit: number ): Promise<PaginatedResponse<T>> {
    try {
      const url = `?search=${encodeURIComponent(query)}`;
      
      const paginatedData = await this.get<T[]>(url);
      
      const allData = await this.getAll<T>();
      const totalItems = allData.length;
      const totalPages = Math.ceil(totalItems / limit);
      return {
        items: paginatedData as any, // Adjust type as needed
        data: paginatedData,
        totalItems,
        currentPage: page,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      };
    }
    catch (error) {
      console.error('Error searching data:', error);
      throw error;
    }
  }
}