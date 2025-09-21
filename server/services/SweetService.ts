import { dbHelpers } from '../config/database.js';
import type { Sweet, CreateSweetRequest, UpdateSweetRequest, SearchQuery, PurchaseRequest, RestockRequest } from '../types/index.js';

export class SweetService {
  static async createSweet(sweetData: CreateSweetRequest): Promise<Sweet> {
    try {
      const sweet = dbHelpers.createSweet.get(
        sweetData.name, 
        sweetData.category, 
        sweetData.price, 
        sweetData.quantity, 
        sweetData.description || null, 
        sweetData.image_url || null
      ) as Sweet;
      
      if (!sweet) {
        throw new Error('Failed to create sweet');
      }
      
      return sweet;
    } catch (error) {
      throw new Error('Failed to create sweet: ' + (error as Error).message);
    }
  }

  static async getAllSweets(): Promise<Sweet[]> {
    try {
      const sweets = dbHelpers.getAllSweets.all() as Sweet[];
      return sweets || [];
    } catch (error) {
      throw new Error('Failed to fetch sweets: ' + (error as Error).message);
    }
  }

  static async getSweetById(id: string): Promise<Sweet> {
    try {
      const sweet = dbHelpers.getSweetById.get(id) as Sweet;
      if (!sweet) {
        throw new Error('Sweet not found');
      }
      return sweet;
    } catch (error) {
      throw new Error('Sweet not found');
    }
  }

  static async updateSweet(id: string, updateData: UpdateSweetRequest): Promise<Sweet> {
    try {
      const sweet = dbHelpers.updateSweet.get(
        updateData.name,
        updateData.category,
        updateData.price,
        updateData.quantity,
        updateData.description || null,
        updateData.image_url || null,
        id
      ) as Sweet;

      if (!sweet) {
        throw new Error('Failed to update sweet: Sweet not found');
      }

      return sweet;
    } catch (error) {
      throw new Error('Failed to update sweet: ' + (error as Error).message);
    }
  }

  static async deleteSweet(id: string): Promise<void> {
    try {
      const result = dbHelpers.deleteSweet.run(id);
      if (result.changes === 0) {
        throw new Error('Sweet not found');
      }
    } catch (error) {
      throw new Error('Failed to delete sweet: ' + (error as Error).message);
    }
  }

  static async searchSweets(query: SearchQuery): Promise<Sweet[]> {
    try {
      const sweets = dbHelpers.searchSweets(query) as Sweet[];
      return sweets || [];
    } catch (error) {
      throw new Error('Failed to search sweets: ' + (error as Error).message);
    }
  }

  static async purchaseSweet(id: string, purchaseData: PurchaseRequest): Promise<Sweet> {
    try {
      const sweet = await this.getSweetById(id);
      
      if (sweet.quantity < purchaseData.quantity) {
        throw new Error('Insufficient quantity in stock');
      }

      const newQuantity = sweet.quantity - purchaseData.quantity;
      const updatedSweet = dbHelpers.updateSweetQuantity.get(newQuantity, id) as Sweet;
      
      if (!updatedSweet) {
        throw new Error('Failed to update sweet quantity');
      }
      
      return updatedSweet;
    } catch (error) {
      throw error;
    }
  }

  static async restockSweet(id: string, restockData: RestockRequest): Promise<Sweet> {
    try {
      const sweet = await this.getSweetById(id);
      const newQuantity = sweet.quantity + restockData.quantity;
      const updatedSweet = dbHelpers.updateSweetQuantity.get(newQuantity, id) as Sweet;
      
      if (!updatedSweet) {
        throw new Error('Failed to restock sweet');
      }
      
      return updatedSweet;
    } catch (error) {
      throw error;
    }
  }
}