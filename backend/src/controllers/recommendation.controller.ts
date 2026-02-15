import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { recommendationService } from '../services/recommendation.service';
import { AuthRequest } from '../middleware/auth';

const recommendationsSchema = z.object({
  lat: z.string().optional().transform((val) => (val ? parseFloat(val) : undefined)),
  lng: z.string().optional().transform((val) => (val ? parseFloat(val) : undefined)),
  timeBudget: z.string().optional().transform((val) => (val ? parseInt(val) : undefined)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val) : 10)),
});

export const recommendationController = {
  // Get personalized recommendations
  async getRecommendations(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = recommendationsSchema.parse(req.query);
      const userId = req.user!._id.toString();

      const recommendations = await recommendationService.getHybridRecommendations(userId, {
        lat: query.lat,
        lng: query.lng,
        timeBudget: query.timeBudget,
        limit: query.limit,
      });

      res.json({
        status: 'success',
        results: recommendations.length,
        data: { recommendations },
      });
    } catch (error) {
      next(error);
    }
  },

  // Get "visitors like you enjoyed" (collaborative filtering)
  async getCollaborative(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const userId = req.user!._id.toString();

      const recommendations = await recommendationService.collaborativeFiltering(userId, limit);

      res.json({
        status: 'success',
        results: recommendations.length,
        data: { recommendations },
      });
    } catch (error) {
      next(error);
    }
  },

  // Get content-based recommendations
  async getContentBased(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const user = req.user!;

      const recommendations = await recommendationService.contentBasedFiltering(user, limit);

      res.json({
        status: 'success',
        results: recommendations.length,
        data: { recommendations },
      });
    } catch (error) {
      next(error);
    }
  },
};
