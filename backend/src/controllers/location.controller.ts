import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { locationService } from '../services/location.service';
import { AppError } from '../middleware/errorHandler';

const nearbySchema = z.object({
  lat: z.string().transform((val) => parseFloat(val)),
  lng: z.string().transform((val) => parseFloat(val)),
  radius: z.string().optional().transform((val) => (val ? parseFloat(val) : 10)),
  category: z.string().optional(),
  limit: z.string().optional().transform((val) => (val ? parseInt(val) : 20)),
});

const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  priceRange: z.string().optional(),
  rating: z.string().optional().transform((val) => (val ? parseFloat(val) : undefined)),
  page: z.string().optional().transform((val) => (val ? parseInt(val) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val) : 20)),
});

export const locationController = {
  // Get nearby locations
  async getNearby(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = nearbySchema.parse(req.query);
      const locations = await locationService.getNearby(query);

      res.json({
        status: 'success',
        results: locations.length,
        data: { locations },
      });
    } catch (error) {
      next(error);
    }
  },

  // Get location by ID
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const location = await locationService.getById(id);

      if (!location) {
        throw new AppError('Location not found', 404);
      }

      res.json({
        status: 'success',
        data: { location },
      });
    } catch (error) {
      next(error);
    }
  },

  // Search locations
  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = searchSchema.parse(req.query);
      const skip = (query.page - 1) * query.limit;

      const { locations, total } = await locationService.search(query.q || '', {
        category: query.category,
        priceRange: query.priceRange,
        rating: query.rating,
      }, {
        skip,
        limit: query.limit,
      });

      res.json({
        status: 'success',
        results: locations.length,
        total,
        page: query.page,
        pages: Math.ceil(total / query.limit),
        data: { locations },
      });
    } catch (error) {
      next(error);
    }
  },

  // Get locations by category
  async getByCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const locations = await locationService.getByCategory(category, limit);

      res.json({
        status: 'success',
        results: locations.length,
        data: { locations },
      });
    } catch (error) {
      next(error);
    }
  },

  // Get popular locations
  async getPopular(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const locations = await locationService.getPopular(limit);

      res.json({
        status: 'success',
        results: locations.length,
        data: { locations },
      });
    } catch (error) {
      next(error);
    }
  },

  // Get featured locations
  async getFeatured(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const locations = await locationService.getFeatured();

      res.json({
        status: 'success',
        results: locations.length,
        data: { locations },
      });
    } catch (error) {
      next(error);
    }
  },

  // Get location stats
  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await locationService.getStats();

      res.json({
        status: 'success',
        data: { stats },
      });
    } catch (error) {
      next(error);
    }
  },
};
