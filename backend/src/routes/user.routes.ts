import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// User profile and preferences routes
router.get('/profile', (req, res) => {
  res.json({ user: req.user });
});

router.patch('/preferences', (req, res) => {
  // Update user preferences
  res.json({ message: 'Preferences updated' });
});

export default router;
