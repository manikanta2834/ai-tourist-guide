import { Matrix } from 'ml-matrix';
import natural from 'natural';
import { Location, ILocation } from '../models/Location';
import { User, IUser } from '../models/User';
import { Review } from '../models/Review';
import { logger } from '../utils/logger';

const TfIdf = natural.TfIdf;

interface RecommendationScore {
  location: ILocation;
  score: number;
  reasons: string[];
}

interface RecommendationWeights {
  explicit: number;
  implicit: number;
  temporal: number;
  realTime: number;
}

export class RecommendationService {
  private weights: RecommendationWeights = {
    explicit: 0.40,
    implicit: 0.30,
    temporal: 0.20,
    realTime: 0.10,
  };

  // Collaborative Filtering using Matrix Factorization
  async collaborativeFiltering(userId: string, limit: number = 10): Promise<RecommendationScore[]> {
    try {
      const allUsers = await User.find({}).select('_id');
      const allLocations = await Location.find({ isActive: true });
      const allReviews = await Review.find({ isActive: true });

      const userIndexMap = new Map(allUsers.map((u, i) => [u._id.toString(), i]));
      const locationIndexMap = new Map(allLocations.map((l, i) => [l._id.toString(), i]));

      const matrix = new Matrix(allUsers.length, allLocations.length);
      matrix.fill(0);

      allReviews.forEach((review) => {
        const userIdx = userIndexMap.get(review.user.toString());
        const locIdx = locationIndexMap.get(review.location.toString());
        if (userIdx !== undefined && locIdx !== undefined) {
          matrix.set(userIdx, locIdx, review.rating);
        }
      });

      const userIdx = userIndexMap.get(userId);
      if (userIdx === undefined) return [];

      // Simplified similarity calculation using cosine similarity
      const similarities: { index: number; score: number }[] = [];
      const targetRow = matrix.getRow(userIdx);

      for (let i = 0; i < allUsers.length; i++) {
        if (i !== userIdx) {
          const row = matrix.getRow(i);
          const similarity = this.cosineSimilarity(targetRow, row);
          similarities.push({ index: i, score: similarity });
        }
      }

      similarities.sort((a, b) => b.score - a.score);
      const topSimilarUsers = similarities.slice(0, 5);

      const scores = new Map<string, number>();
      const counts = new Map<string, number>();

      topSimilarUsers.forEach(({ index, score }) => {
        const row = matrix.getRow(index);
        row.forEach((rating, locIdx) => {
          if (rating > 0) {
            const locationId = allLocations[locIdx]._id.toString();
            scores.set(locationId, (scores.get(locationId) || 0) + rating * score);
            counts.set(locationId, (counts.get(locationId) || 0) + score);
          }
        });
      });

      const recommendations: RecommendationScore[] = [];
      scores.forEach((score, locationId) => {
        const location = allLocations.find((l) => l._id.toString() === locationId);
        if (location) {
          const avgScore = score / (counts.get(locationId) || 1);
          recommendations.push({
            location,
            score: avgScore * this.weights.implicit,
            reasons: ['Visitors like you enjoyed this'],
          });
        }
      });

      return recommendations.sort((a, b) => b.score - a.score).slice(0, limit);
    } catch (error) {
      logger.error('Collaborative filtering error:', error);
      return [];
    }
  }

  // Content-Based Filtering using TF-IDF
  async contentBasedFiltering(user: IUser, limit: number = 10): Promise<RecommendationScore[]> {
    try {
      const tfidf = new TfIdf();
      const locations = await Location.find({ isActive: true });

      locations.forEach((loc) => {
        const text = `${loc.name} ${loc.description} ${loc.tags.join(' ')} ${loc.category} ${loc.subcategory || ''}`;
        tfidf.addDocument(text.toLowerCase());
      });

      const userProfile = this.buildUserProfile(user, tfidf);
      const recommendations: RecommendationScore[] = [];

      locations.forEach((loc, index) => {
        const text = `${loc.name} ${loc.description} ${loc.tags.join(' ')}`;
        const locVector = this.getDocumentVector(tfidf, index);
        const similarity = this.cosineSimilarity(userProfile, locVector);

        if (similarity > 0.1) {
          recommendations.push({
            location: loc,
            score: similarity * this.weights.explicit,
            reasons: [`Matches your interest in ${loc.category}`],
          });
        }
      });

      return recommendations.sort((a, b) => b.score - a.score).slice(0, limit);
    } catch (error) {
      logger.error('Content-based filtering error:', error);
      return [];
    }
  }

  // Constraint-Based Recommendations
  async constraintBased(
    user: IUser,
    constraints: {
      timeBudget?: number;
      maxDistance?: number;
      categories?: string[];
      priceRange?: string;
      accessibility?: string[];
      currentLocation?: [number, number];
    },
    limit: number = 10
  ): Promise<RecommendationScore[]> {
    try {
      let query: any = { isActive: true };

      if (constraints.categories?.length) {
        query.category = { $in: constraints.categories };
      }

      if (constraints.priceRange) {
        query.priceRange = constraints.priceRange;
      }

      if (constraints.accessibility?.length) {
        constraints.accessibility.forEach((acc) => {
          query[`accessibility.${acc}`] = true;
        });
      }

      const locations = await Location.find(query);
      const recommendations: RecommendationScore[] = [];

      for (const loc of locations) {
        let score = 0;
        const reasons: string[] = [];

        // Distance constraint
        if (constraints.currentLocation && constraints.maxDistance) {
          const distance = this.calculateDistance(
            constraints.currentLocation,
            loc.location.coordinates
          );
          if (distance > constraints.maxDistance) continue;
          score += (1 - distance / constraints.maxDistance) * 0.3;
          reasons.push(`${Math.round(distance)}km away`);
        }

        // Time budget constraint
        if (constraints.timeBudget) {
          if (loc.visitDuration <= constraints.timeBudget) {
            score += 0.3;
            reasons.push(`Fits in ${loc.visitDuration} mins`);
          }
        }

        // User preference alignment
        if (user.preferences.categories.includes(loc.category)) {
          score += 0.4;
          reasons.push(`Matches your preferences`);
        }

        // Temporal context
        const temporalScore = await this.getTemporalScore(loc);
        score += temporalScore * this.weights.temporal;

        if (score > 0.3) {
          recommendations.push({
            location: loc,
            score: score * this.weights.explicit,
            reasons,
          });
        }
      }

      return recommendations.sort((a, b) => b.score - a.score).slice(0, limit);
    } catch (error) {
      logger.error('Constraint-based filtering error:', error);
      return [];
    }
  }

  // Hybrid Recommendation combining all methods
  async getHybridRecommendations(
    userId: string,
    options: {
      lat?: number;
      lng?: number;
      timeBudget?: number;
      limit?: number;
    } = {}
  ): Promise<RecommendationScore[]> {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      const limit = options.limit || 10;

      // Get recommendations from all methods
      const [collab, content, constraints] = await Promise.all([
        this.collaborativeFiltering(userId, limit),
        this.contentBasedFiltering(user, limit),
        this.constraintBased(user, {
          timeBudget: options.timeBudget,
          currentLocation: options.lat && options.lng ? [options.lng, options.lat] : undefined,
          maxDistance: 50,
          categories: user.preferences.categories,
        }, limit),
      ]);

      // Merge and deduplicate
      const merged = new Map<string, RecommendationScore>();

      const addToMerged = (recs: RecommendationScore[], weight: number) => {
        recs.forEach((rec) => {
          const id = rec.location._id.toString();
          if (merged.has(id)) {
            const existing = merged.get(id)!;
            existing.score += rec.score * weight;
            existing.reasons = [...new Set([...existing.reasons, ...rec.reasons])].slice(0, 3);
          } else {
            merged.set(id, { ...rec, score: rec.score * weight });
          }
        });
      };

      addToMerged(collab, 0.3);
      addToMerged(content, 0.4);
      addToMerged(constraints, 0.3);

      // Add real-time context
      for (const [id, rec] of merged) {
        const realTimeScore = await this.getRealTimeScore(rec.location);
        rec.score += realTimeScore * this.weights.realTime;
        if (realTimeScore > 0.5) {
          rec.reasons.push('Currently open and accessible');
        }
      }

      return Array.from(merged.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    } catch (error) {
      logger.error('Hybrid recommendation error:', error);
      return [];
    }
  }

  // Helper methods
  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
  }

  private buildUserProfile(user: IUser, tfidf: any): number[] {
    const terms = new Set<string>();
    tfidf.documents.forEach((doc: any) => {
      Object.keys(doc).forEach((term) => terms.add(term));
    });

    const profile: number[] = [];
    terms.forEach((term) => {
      let score = 0;
      if (user.preferences.categories.some((c) => term.toLowerCase().includes(c.toLowerCase()))) {
        score = 1;
      }
      profile.push(score);
    });

    return profile;
  }

  private getDocumentVector(tfidf: any, docIndex: number): number[] {
    const vector: number[] = [];
    const terms = Object.keys(tfidf.documents[docIndex] || {});
    terms.forEach((term) => {
      vector.push(tfidf.documents[docIndex][term] || 0);
    });
    return vector.length > 0 ? vector : [0];
  }

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

  private async getTemporalScore(location: ILocation): Promise<number> {
    const now = new Date();
    const hour = now.getHours();

    // Check if currently open
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const day = dayNames[now.getDay()] as keyof ILocation['operatingHours'];
    const hours = location.operatingHours[day];

    if (hours?.closed) return 0;

    const openHour = hours?.open ? parseInt(hours.open.split(':')[0]) : 6;
    const closeHour = hours?.close ? parseInt(hours.close.split(':')[0]) : 20;

    if (hour >= openHour && hour <= closeHour) {
      return 1.0;
    }

    return 0.5;
  }

  private async getRealTimeScore(location: ILocation): Promise<number> {
    let score = 0;

    // Check if currently open
    const temporalScore = await this.getTemporalScore(location);
    score += temporalScore * 0.5;

    // Check weather (simplified)
    score += 0.3;

    // Check crowd density (simplified)
    score += 0.2;

    return Math.min(score, 1.0);
  }
}

export const recommendationService = new RecommendationService();
