import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { Booking } from '../models/Booking';

const router = Router();

router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user!._id })
      .populate('location', 'name images address')
      .sort({ date: -1 });
    res.json({ bookings });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const booking = new Booking({
      ...req.body,
      user: req.user!._id,
    });
    await booking.save();
    res.status(201).json({ booking });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, user: req.user!._id },
      { status },
      { new: true }
    );
    res.json({ booking });
  } catch (error) {
    next(error);
  }
});

export default router;
