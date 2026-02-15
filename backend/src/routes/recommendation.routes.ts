import { Router } from 'express';
import { recommendationController } from '../controllers/recommendation.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All recommendation routes require authentication
router.use(authenticate);

router.get('/', recommendationController.getRecommendations);
router.get('/collaborative', recommendationController.getCollaborative);
router.get('/content-based', recommendationController.getContentBased);

export default router;
