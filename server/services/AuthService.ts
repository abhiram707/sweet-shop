import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbHelpers } from '../config/database.js';
import { AuthRequest, RegisterRequest, User } from '../types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to handle both SQLite and PostgreSQL calls
async function callDbHelper(helper: any, ...args: any[]): Promise<any> {
  // Check if it's a PostgreSQL async function
  if (typeof helper === 'function') {
    return await helper(...args);
  }
  // SQLite prepared statement
  if (helper && typeof helper.get === 'function') {
    return helper.get(...args);
  }
  if (helper && typeof helper.run === 'function') {
    return helper.run(...args);
  }
  throw new Error('Invalid database helper');
}

export class AuthService {
  static async register(userData: RegisterRequest): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const { email, password, role = 'customer' } = userData;

    try {
      // Check if user already exists
      const existingUser = await callDbHelper(dbHelpers.findUserByEmail, email);
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await callDbHelper(dbHelpers.createUser, email, hashedPassword, role);
      if (!user) {
        throw new Error('Failed to create user');
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  static async login(credentials: AuthRequest): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const { email, password } = credentials;

    try {
      // Find user
      const user = await callDbHelper(dbHelpers.findUserByEmail, email);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      const { password: _, ...userWithoutPassword } = user;
      return { user: userWithoutPassword, token };
    } catch (error) {
      throw error;
    }
  }
}