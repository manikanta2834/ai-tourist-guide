import { Itinerary, IItinerary, IItineraryItem } from '../models/Itinerary';
import { Location, ILocation } from '../models/Location';
import { logger } from '../utils/logger';

interface OptimizationConstraints {
  startTime: Date;
  endTime: Date;
  maxTravelTimeBetween?: number;
  priorityLocations?: string[];
}

interface OptimizedItinerary {
  items: IItineraryItem[];
  totalDuration: number;
  totalTravelTime: number;
}

export class ItineraryService {
  // Create new itinerary
  async create(
    userId: string,
    name: string,
    date: Date,
    locationIds: string[]
  ): Promise<IItinerary> {
    try {
      const locations = await Location.find({
        _id: { $in: locationIds },
        isActive: true,
      });

      if (locations.length === 0) {
        throw new Error('No valid locations found');
      }

      const startTime = new Date(date);
      startTime.setHours(9, 0, 0, 0);

      const items: IItineraryItem[] = [];
      let currentTime = new Date(startTime);

      locations.forEach((loc, index) => {
        const endTime = new Date(currentTime.getTime() + loc.visitDuration * 60000);

        items.push({
          location: loc._id,
          order: index + 1,
          startTime: new Date(currentTime),
          endTime,
          duration: loc.visitDuration,
        });

        currentTime = new Date(endTime.getTime() + 15 * 60000); // 15 min travel buffer
      });

      const itinerary = new Itinerary({
        user: userId,
        name,
        date,
        items,
        totalDuration: items.reduce((sum, item) => sum + item.duration, 0),
        categories: [...new Set(locations.map((l) => l.category))],
        status: 'draft',
      });

      return await itinerary.save();
    } catch (error) {
      logger.error('Create itinerary error:', error);
      throw error;
    }
  }

  // Optimize itinerary using constraint satisfaction
  async optimize(
    itineraryId: string,
    constraints: OptimizationConstraints
  ): Promise<OptimizedItinerary> {
    try {
      const itinerary = await Itinerary.findById(itineraryId).populate('items.location');
      if (!itinerary) {
        throw new Error('Itinerary not found');
      }

      const items = itinerary.items as unknown as (IItineraryItem & { location: ILocation })[];
      const availableTime =
        (constraints.endTime.getTime() - constraints.startTime.getTime()) / 60000;

      // Sort by priority if specified
      if (constraints.priorityLocations?.length) {
        items.sort((a, b) => {
          const aPriority = constraints.priorityLocations!.indexOf(a.location._id.toString());
          const bPriority = constraints.priorityLocations!.indexOf(b.location._id.toString());
          return (aPriority === -1 ? 999 : aPriority) - (bPriority === -1 ? 999 : bPriority);
        });
      }

      // Greedy algorithm for itinerary optimization
      const optimizedItems: IItineraryItem[] = [];
      let currentTime = new Date(constraints.startTime);
      let currentLocation: [number, number] | null = null;
      let totalTravelTime = 0;

      for (const item of items) {
        const location = item.location;
        const visitDuration = location.visitDuration;

        // Calculate travel time from previous location
        let travelTime = 0;
        if (currentLocation) {
          travelTime = this.estimateTravelTime(currentLocation, location.location.coordinates);
          totalTravelTime += travelTime;
        }

        const itemEndTime = new Date(currentTime.getTime() + visitDuration * 60000);

        // Check if within time constraints
        if (itemEndTime <= constraints.endTime) {
          optimizedItems.push({
            location: location._id,
            order: optimizedItems.length + 1,
            startTime: new Date(currentTime.getTime() + travelTime * 60000),
            endTime: itemEndTime,
            duration: visitDuration,
            notes: travelTime > 0 ? `${travelTime} min travel` : undefined,
          });

          currentLocation = location.location.coordinates;
          currentTime = new Date(itemEndTime.getTime() + travelTime * 60000);
        }
      }

      // Update itinerary with optimized order
      await Itinerary.findByIdAndUpdate(itineraryId, {
        items: optimizedItems,
        totalDuration: optimizedItems.reduce((sum, item) => sum + item.duration, 0),
        isOptimized: true,
      });

      return {
        items: optimizedItems,
        totalDuration: optimizedItems.reduce((sum, item) => sum + item.duration, 0),
        totalTravelTime,
      };
    } catch (error) {
      logger.error('Optimize itinerary error:', error);
      throw error;
    }
  }

  // Get user's itineraries
  async getUserItineraries(userId: string): Promise<IItinerary[]> {
    try {
      return await Itinerary.find({ user: userId })
        .sort({ date: -1 })
        .populate('items.location', 'name category images visitDuration');
    } catch (error) {
      logger.error('Get user itineraries error:', error);
      throw error;
    }
  }

  // Get itinerary by ID
  async getById(itineraryId: string): Promise<IItinerary | null> {
    try {
      return await Itinerary.findById(itineraryId).populate({
        path: 'items.location',
        select: 'name description category images rating address location visitDuration priceRange',
      });
    } catch (error) {
      logger.error('Get itinerary by ID error:', error);
      throw error;
    }
  }

  // Update itinerary
  async update(
    itineraryId: string,
    updates: Partial<IItinerary>
  ): Promise<IItinerary | null> {
    try {
      return await Itinerary.findByIdAndUpdate(itineraryId, updates, { new: true });
    } catch (error) {
      logger.error('Update itinerary error:', error);
      throw error;
    }
  }

  // Delete itinerary
  async delete(itineraryId: string): Promise<void> {
    try {
      await Itinerary.findByIdAndDelete(itineraryId);
    } catch (error) {
      logger.error('Delete itinerary error:', error);
      throw error;
    }
  }

  // Generate share code
  async generateShareCode(itineraryId: string): Promise<string> {
    try {
      const shareCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      await Itinerary.findByIdAndUpdate(itineraryId, { shareCode });
      return shareCode;
    } catch (error) {
      logger.error('Generate share code error:', error);
      throw error;
    }
  }

  // Get itinerary by share code
  async getByShareCode(shareCode: string): Promise<IItinerary | null> {
    try {
      return await Itinerary.findOne({ shareCode }).populate({
        path: 'items.location',
        select: 'name description category images rating address location',
      });
    } catch (error) {
      logger.error('Get by share code error:', error);
      throw error;
    }
  }

  // Helper method to estimate travel time
  private estimateTravelTime(
    from: [number, number],
    to: [number, number]
  ): number {
    const distance = this.calculateDistance(from, to);
    // Assume average speed of 30 km/h in urban/temple areas
    return Math.round((distance / 30) * 60) + 5; // Add 5 min buffer
  }

  // Calculate distance between two points using Haversine formula
  private calculateDistance(point1: [number, number], point2: [number, number]): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(point2[1] - point1[1]);
    const dLon = this.toRadians(point2[0] - point1[0]);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(point1[1])) *
        Math.cos(this.toRadians(point2[1])) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

export const itineraryService = new ItineraryService();
