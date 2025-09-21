import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { dbHelpers } from '../config/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

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
  throw new Error('Invalid database helper');
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Verify user still exists in database
    const user = await callDbHelper(dbHelpers.findUserById, decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};