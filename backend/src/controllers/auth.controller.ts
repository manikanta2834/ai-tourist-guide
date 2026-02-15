import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authService } from '../services/auth.service';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const authController = {
  // Register
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = registerSchema.parse(req.body);
      const { user, tokens } = await authService.register(validatedData);

      res.status(201).json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            preferences: user.preferences,
          },
          tokens,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Login
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { user, tokens } = await authService.login(validatedData);

      res.json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            preferences: user.preferences,
            favorites: user.favorites,
          },
          tokens,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Refresh token
  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw new AppError('Refresh token required', 400);
      }

      const tokens = await authService.refreshToken(refreshToken);

      res.json({
        status: 'success',
        data: { tokens },
      });
    } catch (error) {
      next(error);
    }
  },

  // Get current user
  async me(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await authService.getCurrentUser(req.user!._id.toString());

      res.json({
        status: 'success',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  },

  // Update profile
  async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await authService.updateProfile(req.user!._id.toString(), req.body);

      res.json({
        status: 'success',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  },

  // Add favorite
  async addFavorite(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { locationId } = req.params;
      const user = await authService.addFavorite(req.user!._id.toString(), locationId);

      res.json({
        status: 'success',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  },

  // Remove favorite
  async removeFavorite(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { locationId } = req.params;
      const user = await authService.removeFavorite(req.user!._id.toString(), locationId);

      res.json({
        status: 'success',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  },

  // Mark visited
  async markVisited(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { locationId } = req.params;
      const user = await authService.markVisited(req.user!._id.toString(), locationId);

      res.json({
        status: 'success',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  },
};
