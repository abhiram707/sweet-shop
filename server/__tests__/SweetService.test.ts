import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SweetService } from '../services/SweetService';

// Mock Supabase
const createMockChain = () => {
  const chain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
    order: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis()
  };
  return chain;
};

const mockSupabaseChain = createMockChain();

vi.mock('../config/database', () => ({
  supabase: {
    from: vi.fn(() => mockSupabaseChain)
  }
}));

describe('SweetService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the chain methods
    Object.values(mockSupabaseChain).forEach(mock => {
      if (typeof mock === 'function') {
        mock.mockReturnThis();
      }
    });
  });

  describe('createSweet', () => {
    it('should successfully create a new sweet', async () => {
      const mockSweet = {
        id: '1',
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.50,
        quantity: 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      mockSupabaseChain.single.mockResolvedValueOnce({
        data: mockSweet,
        error: null
      });

      const result = await SweetService.createSweet({
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.50,
        quantity: 100
      });

      expect(result).toEqual(mockSweet);
    });

    it('should throw error on database failure', async () => {
      mockSupabaseChain.single.mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' }
      });

      await expect(
        SweetService.createSweet({
          name: 'Test Sweet',
          category: 'Test',
          price: 1.00,
          quantity: 10
        })
      ).rejects.toThrow('Failed to create sweet');
    });
  });

  describe('purchaseSweet', () => {
    it('should successfully purchase sweet when quantity available', async () => {
      const mockSweet = {
        id: '1',
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.50,
        quantity: 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const updatedSweet = { ...mockSweet, quantity: 95 };

      // Mock get sweet by id (first call)
      mockSupabaseChain.single
        .mockResolvedValueOnce({
          data: mockSweet,
          error: null
        })
        // Mock update sweet (second call)
        .mockResolvedValueOnce({
          data: updatedSweet,
          error: null
        });

      const result = await SweetService.purchaseSweet('1', { quantity: 5 });

      expect(result.quantity).toBe(95);
    });

    it('should throw error when insufficient quantity', async () => {
      const mockSweet = {
        id: '1',
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.50,
        quantity: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      mockSupabaseChain.single.mockResolvedValueOnce({
        data: mockSweet,
        error: null
      });

      await expect(
        SweetService.purchaseSweet('1', { quantity: 5 })
      ).rejects.toThrow('Insufficient quantity in stock');
    });
  });
});