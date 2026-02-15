import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { logger } from '../utils/logger';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: string;
}

interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  private readonly JWT_SECRET: string;
  private readonly JWT_REFRESH_SECRET: string;
  private readonly JWT_EXPIRES_IN: string;

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'default-secret';
    this.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
  }

  // Register new user
  async register(data: RegisterData): Promise<{ user: IUser; tokens: AuthTokens }> {
    try {
      const existingUser = await User.findOne({ email: data.email.toLowerCase() });
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      const user = new User({
        email: data.email.toLowerCase(),
        password: data.password,
        name: data.name,
        role: data.role || 'user',
      });

      await user.save();

      const tokens = this.generateTokens(user);

      logger.info(`New user registered: ${user.email}`);

      return { user, tokens };
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  // Login user
  async login(data: LoginData): Promise<{ user: IUser; tokens: AuthTokens }> {
    try {
      const user = await User.findOne({ email: data.email.toLowerCase() });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isPasswordValid = await user.comparePassword(data.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      const tokens = this.generateTokens(user);

      logger.info(`User logged in: ${user.email}`);

      return { user, tokens };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  // Refresh access token
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = jwt.verify(refreshToken, this.JWT_REFRESH_SECRET) as TokenPayload;
      const user = await User.findById(payload.userId);

      if (!user) {
        throw new Error('User not found');
      }

      return this.generateTokens(user);
    } catch (error) {
      logger.error('Token refresh error:', error);
      throw new Error('Invalid refresh token');
    }
  }

  // Get current user
  async getCurrentUser(userId: string): Promise<IUser | null> {
    try {
      return await User.findById(userId).populate('favorites visitedLocations', 'name images');
    } catch (error) {
      logger.error('Get current user error:', error);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(
    userId: string,
    updates: Partial<IUser>
  ): Promise<IUser | null> {
    try {
      const allowedUpdates = ['name', 'preferences', 'notificationSettings', 'privacyControls'];
      const filteredUpdates: any = {};

      Object.keys(updates).forEach((key) => {
        if (allowedUpdates.includes(key)) {
          filteredUpdates[key] = (updates as any)[key];
        }
      });

      return await User.findByIdAndUpdate(userId, filteredUpdates, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      logger.error('Update profile error:', error);
      throw error;
    }
  }

  // Add to favorites
  async addFavorite(userId: string, locationId: string): Promise<IUser | null> {
    try {
      return await User.findByIdAndUpdate(
        userId,
        { $addToSet: { favorites: locationId } },
        { new: true }
      ).populate('favorites', 'name images category');
    } catch (error) {
      logger.error('Add favorite error:', error);
      throw error;
    }
  }

  // Remove from favorites
  async removeFavorite(userId: string, locationId: string): Promise<IUser | null> {
    try {
      return await User.findByIdAndUpdate(
        userId,
        { $pull: { favorites: locationId } },
        { new: true }
      ).populate('favorites', 'name images category');
    } catch (error) {
      logger.error('Remove favorite error:', error);
      throw error;
    }
  }

  // Mark location as visited
  async markVisited(userId: string, locationId: string): Promise<IUser | null> {
    try {
      return await User.findByIdAndUpdate(
        userId,
        { $addToSet: { visitedLocations: locationId } },
        { new: true }
      ).populate('visitedLocations', 'name images category');
    } catch (error) {
      logger.error('Mark visited error:', error);
      throw error;
    }
  }

  // Generate JWT tokens
  private generateTokens(user: IUser): AuthTokens {
    const payload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    });

    const refreshToken = jwt.sign(payload, this.JWT_REFRESH_SECRET, {
      expiresIn: '30d',
    });

    // Parse expires in to get seconds
    const expiresInMatch = this.JWT_EXPIRES_IN.match(/(\d+)/);
    const expiresIn = expiresInMatch
      ? parseInt(expiresInMatch[1]) * (this.JWT_EXPIRES_IN.includes('d') ? 86400 : 3600)
      : 604800;

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }
}

export const authService = new AuthService();
