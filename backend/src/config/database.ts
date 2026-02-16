import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { logger } from '../utils/logger';

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  try {
    let mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-tourist-guide';

    // Use in-memory MongoDB for development if LOCAL_MONGO_MEMORY=true or no URI provided
    if (process.env.LOCAL_MONGO_MEMORY === 'true' || mongoUri === 'mongodb://localhost:27017/ai-tourist-guide') {
      logger.info('Starting in-memory MongoDB...');
      mongoMemoryServer = await MongoMemoryServer.create();
      mongoUri = mongoMemoryServer.getUri();
      logger.info(`In-memory MongoDB started at ${mongoUri}`);
    }

    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(mongoUri, options);

    logger.info('MongoDB connected successfully');

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    throw error;
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
    logger.info('In-memory MongoDB stopped');
  }
  logger.info('MongoDB disconnected');
};
