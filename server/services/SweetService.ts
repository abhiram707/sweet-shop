import { dbHelpers } from '../config/database.js';
import type { Sweet, CreateSweetRequest, UpdateSweetRequest, SearchQuery, PurchaseRequest, RestockRequest } from '../types/index.js';

// Helper function to handle both SQLite and PostgreSQL calls
async function callDbHelper(helper: any, ...args: any[]): Promise<any> {
  // Check if it's a PostgreSQL async function
  if (typeof helper === 'function') {
    return await helper(...args);
  }
  // SQLite prepared statement with .get()
  if (helper && typeof helper.get === 'function') {
    return helper.get(...args);
  }
  // SQLite prepared statement with .all()
  if (helper && typeof helper.all === 'function') {
    return helper.all(...args);
  }
  // SQLite prepared statement with .run()
  if (helper && typeof helper.run === 'function') {
    return helper.run(...args);
  }
  throw new Error('Invalid database helper');
}

export class SweetService {
  static async createSweet(sweetData: CreateSweetRequest): Promise<Sweet> {
    try {
      const sweet = await callDbHelper(
        dbHelpers.createSweet,
        sweetData.name, 
        sweetData.category, 
        sweetData.price, 
        sweetData.quantity, 
        sweetData.description || null, 
        sweetData.image_url || null
      );
      
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
      const sweets = await callDbHelper(dbHelpers.getAllSweets);
      return sweets || [];
    } catch (error) {
      throw new Error('Failed to fetch sweets: ' + (error as Error).message);
    }
  }

  static async getSweetById(id: string): Promise<Sweet> {
    try {
      const sweet = await callDbHelper(dbHelpers.getSweetById, id);
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
      const sweet = await callDbHelper(
        dbHelpers.updateSweet,
        id,
        updateData.name,
        updateData.category,
        updateData.price,
        updateData.quantity,
        updateData.description || null,
        updateData.image_url || null
      );

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
      const result = await callDbHelper(dbHelpers.deleteSweet, id);
      // For PostgreSQL, result is void, for SQLite check changes
      if (result && result.changes === 0) {
        throw new Error('Sweet not found');
      }
    } catch (error) {
      throw new Error('Failed to delete sweet: ' + (error as Error).message);
    }
  }

  static async searchSweets(query: SearchQuery): Promise<Sweet[]> {
    try {
      const sweets = await callDbHelper(dbHelpers.searchSweets, query);
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
      const updatedSweet = await callDbHelper(dbHelpers.updateSweetQuantity, id, newQuantity);
      
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
      const updatedSweet = await callDbHelper(dbHelpers.updateSweetQuantity, id, newQuantity);
      
      if (!updatedSweet) {
        throw new Error('Failed to restock sweet');
      }
      
      return updatedSweet;
    } catch (error) {
      throw error;
    }
  }
}