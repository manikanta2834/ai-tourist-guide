import { logger } from '../utils/logger';

// Helper for delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface RealTimeData {
    weather: {
        condition: 'Sunny' | 'Rainy' | 'Cloudy' | 'Stormy';
        temperature: number;
    };
    crowdDensity: 'Low' | 'Medium' | 'High';
}

export class RealTimeService {
    // Simulate fetching real-time data
    // In a real app, this would call external APIs (OpenWeatherMap, Google Places, etc.)
    async getRealTimeData(locationId: string): Promise<RealTimeData> {
        try {
            // Simulate network latency
            await delay(50);

            const conditions: ('Sunny' | 'Rainy' | 'Cloudy' | 'Stormy')[] = ['Sunny', 'Cloudy', 'Rainy'];
            const densities: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];

            // Deterministic "random" based on ID for consistency during demo
            const hash = locationId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

            const weatherCondition = conditions[hash % conditions.length];
            const crowdDensity = densities[(hash + 1) % densities.length];
            const temperature = 25 + (hash % 10); // 25-35 degrees

            return {
                weather: {
                    condition: weatherCondition,
                    temperature,
                },
                crowdDensity,
            };
        } catch (error) {
            logger.error('Error fetching real-time data:', error);
            // Default fallback
            return {
                weather: { condition: 'Sunny', temperature: 30 },
                crowdDensity: 'Medium',
            };
        }
    }

    // Calculate a score modifier based on real-time data
    async getRealTimeScoreModifier(locationId: string, isOutdoor: boolean): Promise<number> {
        const data = await this.getRealTimeData(locationId);
        let score = 1.0;

        // Weather impact
        if (isOutdoor) {
            if (data.weather.condition === 'Rainy' || data.weather.condition === 'Stormy') {
                score *= 0.4; // Heavy penalty for bad weather
            } else if (data.weather.condition === 'Sunny') {
                score *= 1.2; // Boost for good weather
            }
        }

        // Crowd impact (prefer lower density)
        if (data.crowdDensity === 'High') {
            score *= 0.8;
        } else if (data.crowdDensity === 'Low') {
            score *= 1.1;
        }

        return score;
    }
}

export const realTimeService = new RealTimeService();
