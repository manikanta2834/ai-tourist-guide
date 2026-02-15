import { Router } from 'express';
import { locationController } from '../controllers/location.controller';
import { optionalAuth } from '../middleware/auth';

const router = Router();

// Public routes with optional auth
router.get('/nearby', optionalAuth, locationController.getNearby);
router.get('/search', optionalAuth, locationController.search);
router.get('/popular', optionalAuth, locationController.getPopular);
router.get('/featured', optionalAuth, locationController.getFeatured);
router.get('/stats', locationController.getStats);
router.get('/category/:category', optionalAuth, locationController.getByCategory);
router.get('/:id', optionalAuth, locationController.getById);

export default router;
