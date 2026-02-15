import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);

// Protected routes
router.get('/me', authenticate, authController.me);
router.patch('/profile', authenticate, authController.updateProfile);
router.post('/favorites/:locationId', authenticate, authController.addFavorite);
router.delete('/favorites/:locationId', authenticate, authController.removeFavorite);
router.post('/visited/:locationId', authenticate, authController.markVisited);

export default router;
