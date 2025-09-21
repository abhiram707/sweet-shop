import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { validateRegister, validateLogin } from '../validators/auth.js';

const router = Router();

router.post('/register', validateRegister, AuthController.register);
router.post('/login', validateLogin, AuthController.login);

export default router;