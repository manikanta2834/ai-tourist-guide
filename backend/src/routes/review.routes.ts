import { Router } from 'express';
import { Review } from '../models/Review';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/location/:locationId', async (req, res, next) => {
  try {
    const reviews = await Review.find({ location: req.params.locationId, isActive: true })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (error) {
    next(error);
  }
});

// Protected routes
router.use(authenticate);

router.post('/', async (req, res, next) => {
  try {
    const review = new Review({
      ...req.body,
      user: req.user!._id,
    });
    await review.save();
    res.status(201).json({ review });
  } catch (error) {
    next(error);
  }
});

export default router;
