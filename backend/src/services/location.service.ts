import { Location, ILocation } from '../models/Location';
import { logger } from '../utils/logger';

interface NearbyQuery {
  lat: number;
  lng: number;
  radius?: number;
  category?: string;
  limit?: number;
}

interface SearchFilters {
  category?: string;
  subcategory?: string;
  priceRange?: string;
  accessibility?: string[];
  rating?: number;
  tags?: string[];
}

export class LocationService {
  // Get nearby locations using geospatial query
  async getNearby(query: NearbyQuery): Promise<ILocation[]> {
    try {
      const { lat, lng, radius = 10, category, limit = 20 } = query;

      const filter: any = {
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat],
            },
            $maxDistance: radius * 1000, // Convert km to meters
          },
        },
        isActive: true,
      };

      if (category) {
        filter.category = category;
      }

      return await Location.find(filter).limit(limit).populate('nearbyAttractions', 'name category');
    } catch (error) {
      logger.error('Get nearby locations error:', error);
      throw error;
    }
  }

  // Get location by ID with full details
  async getById(id: string): Promise<ILocation | null> {
    try {
      return await Location.findById(id)
        .populate('nearbyAttractions', 'name location category rating images');
    } catch (error) {
      logger.error('Get location by ID error:', error);
      throw error;
    }
  }

  // Search locations with filters
  async search(
    query: string,
    filters: SearchFilters = {},
    options: { skip?: number; limit?: number } = {}
  ): Promise<{ locations: ILocation[]; total: number }> {
    try {
      const searchQuery: any = { isActive: true };

      // Text search
      if (query) {
        searchQuery.$or = [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } },
        ];
      }

      // Apply filters
      if (filters.category) searchQuery.category = filters.category;
      if (filters.subcategory) searchQuery.subcategory = filters.subcategory;
      if (filters.priceRange) searchQuery.priceRange = filters.priceRange;
      if (filters.rating) searchQuery.rating = { $gte: filters.rating };
      if (filters.tags?.length) searchQuery.tags = { $in: filters.tags };

      if (filters.accessibility?.length) {
        filters.accessibility.forEach((acc) => {
          searchQuery[`accessibility.${acc}`] = true;
        });
      }

      const skip = options.skip || 0;
      const limit = options.limit || 20;

      const [locations, total] = await Promise.all([
        Location.find(searchQuery).skip(skip).limit(limit).sort({ rating: -1 }),
        Location.countDocuments(searchQuery),
      ]);

      return { locations, total };
    } catch (error) {
      logger.error('Search locations error:', error);
      throw error;
    }
  }

  // Get locations by category
  async getByCategory(category: string, limit: number = 20): Promise<ILocation[]> {
    try {
      return await Location.find({ category, isActive: true })
        .sort({ rating: -1 })
        .limit(limit);
    } catch (error) {
      logger.error('Get by category error:', error);
      throw error;
    }
  }

  // Get popular locations
  async getPopular(limit: number = 10): Promise<ILocation[]> {
    try {
      return await Location.find({ isActive: true })
        .sort({ reviewCount: -1, rating: -1 })
        .limit(limit);
    } catch (error) {
      logger.error('Get popular locations error:', error);
      throw error;
    }
  }

  // Get featured locations for homepage
  async getFeatured(): Promise<ILocation[]> {
    try {
      return await Location.find({ isActive: true, rating: { $gte: 4.0 } })
        .sort({ rating: -1, reviewCount: -1 })
        .limit(6);
    } catch (error) {
      logger.error('Get featured locations error:', error);
      throw error;
    }
  }

  // Create new location (admin/business only)
  async create(locationData: Partial<ILocation>): Promise<ILocation> {
    try {
      const location = new Location(locationData);
      return await location.save();
    } catch (error) {
      logger.error('Create location error:', error);
      throw error;
    }
  }

  // Update location
  async update(id: string, updateData: Partial<ILocation>): Promise<ILocation | null> {
    try {
      return await Location.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    } catch (error) {
      logger.error('Update location error:', error);
      throw error;
    }
  }

  // Delete location (soft delete)
  async delete(id: string): Promise<ILocation | null> {
    try {
      return await Location.findByIdAndUpdate(id, { isActive: false }, { new: true });
    } catch (error) {
      logger.error('Delete location error:', error);
      throw error;
    }
  }

  // Get location statistics
  async getStats(): Promise<{
    total: number;
    byCategory: Record<string, number>;
    avgRating: number;
  }> {
    try {
      const stats = await Location.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            avgRating: { $avg: '$rating' },
            categories: { $push: '$category' },
          },
        },
      ]);

      const byCategory: Record<string, number> = {};
      const categoryStats = await Location.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]);

      categoryStats.forEach((stat) => {
        byCategory[stat._id] = stat.count;
      });

      return {
        total: stats[0]?.total || 0,
        byCategory,
        avgRating: stats[0]?.avgRating || 0,
      };
    } catch (error) {
      logger.error('Get location stats error:', error);
      throw error;
    }
  }
}

export const locationService = new LocationService();
