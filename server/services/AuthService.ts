import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbHelpers } from '../config/database.js';
import { AuthRequest, RegisterRequest, User } from '../types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthService {
  static async register(userData: RegisterRequest): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const { email, password, role = 'customer' } = userData;

    try {
      // Check if user already exists
      const existingUser = dbHelpers.findUserByEmail.get(email) as any;
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = dbHelpers.createUser.get(email, hashedPassword, role) as any;
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
      const user = dbHelpers.findUserByEmail.get(email) as any;
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