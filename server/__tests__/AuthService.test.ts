import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from '../services/AuthService';
import bcrypt from 'bcryptjs';

// Mock bcryptjs
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn()
  }
}));

// Mock Supabase
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();
const mockInsert = vi.fn();

vi.mock('../config/database', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: mockSelect.mockReturnValue({
        eq: mockEq.mockReturnValue({
          single: mockSingle
        })
      }),
      insert: mockInsert.mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn()
        })
      })
    }))
  }
}));

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        role: 'customer',
        created_at: new Date().toISOString()
      };

      // Mock user doesn't exist
      mockSingle.mockResolvedValueOnce({
        data: null,
        error: null
      });

      // Mock bcrypt hash
      (bcrypt.hash as any) = vi.fn().mockResolvedValueOnce('hashedPassword');

      // Mock successful user creation
      const mockInsertSingle = vi.fn().mockResolvedValueOnce({
        data: mockUser,
        error: null
      });
      
      mockInsert.mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          single: mockInsertSingle
        })
      });

      const result = await AuthService.register({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(result.user).toEqual(mockUser);
      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe('string');
    });

    it('should throw error if user already exists', async () => {
      // Mock user exists
      mockSingle.mockResolvedValueOnce({
        data: { id: '1' },
        error: null
      });

      await expect(
        AuthService.register({
          email: 'existing@example.com',
          password: 'password123'
        })
      ).rejects.toThrow('User already exists with this email');
    });
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: '$2a$10$hashedPassword',
        role: 'customer',
        created_at: new Date().toISOString()
      };

      // Mock user found
      mockSingle.mockResolvedValueOnce({
        data: mockUser,
        error: null
      });

      // Mock bcrypt compare
      (bcrypt.compare as any) = vi.fn().mockResolvedValueOnce(true);

      const result = await AuthService.login({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(result.user.email).toBe('test@example.com');
      expect(result.user).not.toHaveProperty('password');
      expect(result.token).toBeDefined();
    });

    it('should throw error with invalid credentials', async () => {
      // Mock user not found
      mockSingle.mockResolvedValueOnce({
        data: null,
        error: { message: 'User not found' }
      });

      await expect(
        AuthService.login({
          email: 'nonexistent@example.com',
          password: 'wrongpassword'
        })
      ).rejects.toThrow('Invalid credentials');
    });
  });
});