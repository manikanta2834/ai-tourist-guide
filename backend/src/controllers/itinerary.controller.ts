import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { itineraryService } from '../services/itinerary.service';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const createItinerarySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  date: z.string().transform((val) => new Date(val)),
  locationIds: z.array(z.string()).min(1, 'At least one location required'),
});

const optimizeSchema = z.object({
  startTime: z.string().transform((val) => new Date(val)),
  endTime: z.string().transform((val) => new Date(val)),
});

export const itineraryController = {
  // Create itinerary
  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = createItinerarySchema.parse(req.body);
      const itinerary = await itineraryService.create(
        req.user!._id.toString(),
        data.name,
        data.date,
        data.locationIds
      );

      res.status(201).json({
        status: 'success',
        data: { itinerary },
      });
    } catch (error) {
      next(error);
    }
  },

  // Get user's itineraries
  async getUserItineraries(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const itineraries = await itineraryService.getUserItineraries(req.user!._id.toString());

      res.json({
        status: 'success',
        results: itineraries.length,
        data: { itineraries },
      });
    } catch (error) {
      next(error);
    }
  },

  // Get itinerary by ID
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const itinerary = await itineraryService.getById(id);

      if (!itinerary) {
        throw new AppError('Itinerary not found', 404);
      }

      res.json({
        status: 'success',
        data: { itinerary },
      });
    } catch (error) {
      next(error);
    }
  },

  // Optimize itinerary
  async optimize(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const constraints = optimizeSchema.parse(req.body);

      const optimized = await itineraryService.optimize(id, {
        startTime: constraints.startTime,
        endTime: constraints.endTime,
      });

      res.json({
        status: 'success',
        data: { optimized },
      });
    } catch (error) {
      next(error);
    }
  },

  // Generate share code
  async generateShareCode(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const shareCode = await itineraryService.generateShareCode(id);

      res.json({
        status: 'success',
        data: { shareCode },
      });
    } catch (error) {
      next(error);
    }
  },

  // Get itinerary by share code
  async getByShareCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code } = req.params;
      const itinerary = await itineraryService.getByShareCode(code);

      if (!itinerary) {
        throw new AppError('Itinerary not found', 404);
      }

      res.json({
        status: 'success',
        data: { itinerary },
      });
    } catch (error) {
      next(error);
    }
  },

  // Delete itinerary
  async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await itineraryService.delete(id);

      res.json({
        status: 'success',
        message: 'Itinerary deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
