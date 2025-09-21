import { Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { SweetService } from '../services/SweetService.js';

export class SweetController {
  static async createSweet(req: AuthenticatedRequest, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const sweet = await SweetService.createSweet(req.body);
      res.status(201).json({ message: 'Sweet created successfully', sweet });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async getAllSweets(req: AuthenticatedRequest, res: Response) {
    try {
      const sweets = await SweetService.getAllSweets();
      res.json({ sweets });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async updateSweet(req: AuthenticatedRequest, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const sweet = await SweetService.updateSweet(req.params.id, req.body);
      res.json({ message: 'Sweet updated successfully', sweet });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async deleteSweet(req: AuthenticatedRequest, res: Response) {
    try {
      await SweetService.deleteSweet(req.params.id);
      res.json({ message: 'Sweet deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async searchSweets(req: AuthenticatedRequest, res: Response) {
    try {
      const query = {
        name: req.query.name as string,
        category: req.query.category as string,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      };

      const sweets = await SweetService.searchSweets(query);
      res.json({ sweets });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async purchaseSweet(req: AuthenticatedRequest, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const sweet = await SweetService.purchaseSweet(req.params.id, req.body);
      res.json({ message: 'Purchase successful', sweet });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async restockSweet(req: AuthenticatedRequest, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const sweet = await SweetService.restockSweet(req.params.id, req.body);
      res.json({ message: 'Restock successful', sweet });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}