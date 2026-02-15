import { Router } from 'express';
import { itineraryController } from '../controllers/itinerary.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public route for shared itineraries
router.get('/share/:code', itineraryController.getByShareCode);

// Protected routes
router.use(authenticate);

router.post('/', itineraryController.create);
router.get('/', itineraryController.getUserItineraries);
router.get('/:id', itineraryController.getById);
router.post('/:id/optimize', itineraryController.optimize);
router.post('/:id/share', itineraryController.generateShareCode);
router.delete('/:id', itineraryController.delete);

export default router;
