import mongoose, { Document, Schema } from 'mongoose';

export interface IItineraryItem {
  location: mongoose.Types.ObjectId;
  order: number;
  startTime: Date;
  endTime: Date;
  duration: number;
  notes?: string;
}

export interface IItinerary extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  date: Date;
  items: IItineraryItem[];
  totalDuration: number;
  categories: string[];
  isOptimized: boolean;
  isPublic: boolean;
  status: 'draft' | 'planned' | 'in_progress' | 'completed';
  shareCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ItinerarySchema = new Schema<IItinerary>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    date: { type: Date, required: true },
    items: [{
      location: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
      order: { type: Number, required: true },
      startTime: { type: Date, required: true },
      endTime: { type: Date, required: true },
      duration: { type: Number, required: true },
      notes: String,
    }],
    totalDuration: { type: Number, default: 0 },
    categories: [{ type: String }],
    isOptimized: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['draft', 'planned', 'in_progress', 'completed'],
      default: 'draft',
    },
    shareCode: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

ItinerarySchema.index({ user: 1 });
ItinerarySchema.index({ date: 1 });

export const Itinerary = mongoose.model<IItinerary>('Itinerary', ItinerarySchema);
