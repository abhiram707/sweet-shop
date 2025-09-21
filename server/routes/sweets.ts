import { Router } from 'express';
import { SweetController } from '../controllers/SweetController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { 
  validateCreateSweet, 
  validateUpdateSweet, 
  validatePurchase, 
  validateRestock 
} from '../validators/sweet.js';

const router = Router();

// Protected routes - require authentication
router.use(authenticateToken);

router.post('/', requireAdmin, validateCreateSweet, SweetController.createSweet);
router.get('/', SweetController.getAllSweets);
router.get('/search', SweetController.searchSweets);
router.put('/:id', requireAdmin, validateUpdateSweet, SweetController.updateSweet);
router.delete('/:id', requireAdmin, SweetController.deleteSweet);
router.post('/:id/purchase', validatePurchase, SweetController.purchaseSweet);
router.post('/:id/restock', requireAdmin, validateRestock, SweetController.restockSweet);

export default router;