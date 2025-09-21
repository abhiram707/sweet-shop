import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthService } from '../services/AuthService.js';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const result = await AuthService.register(req.body);
      res.status(201).json({
        message: 'User registered successfully',
        user: result.user,
        token: result.token
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const result = await AuthService.login(req.body);
      res.json({
        message: 'Login successful',
        user: result.user,
        token: result.token
      });
    } catch (error) {
      res.status(401).json({ error: (error as Error).message });
    }
  }
}