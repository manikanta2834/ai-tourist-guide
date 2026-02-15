import mongoose, { Document, Schema } from 'mongoose';

export interface ILocation extends Document {
  name: string;
  nameTranslations: Record<string, string>;
  description: string;
  descriptionTranslations: Record<string, string>;
  category: 'temple' | 'monument' | 'museum' | 'industrial' | 'nature' | 'cultural' | 'food' | 'shopping';
  subcategory: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  operatingHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  accessibility: {
    wheelchairAccessible: boolean;
    parkingAvailable: boolean;
    publicTransport: boolean;
    restRooms: boolean;
    guidedTours: boolean;
  };
  images: string[];
  rating: number;
  reviewCount: number;
  visitDuration: number;
  priceRange: 'free' | 'low' | 'medium' | 'high';
  entryFee?: number;
  tags: string[];
  rituals?: {
    name: string;
    time: string;
    description: string;
  }[];
  history?: string;
  architecture?: string;
  significance?: string;
  bestTimeToVisit?: string;
  tips?: string[];
  nearbyAttractions?: mongoose.Types.ObjectId[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema = new Schema<ILocation>(
  {
    name: { type: String, required: true },
    nameTranslations: { type: Map, of: String },
    description: { type: String, required: true },
    descriptionTranslations: { type: Map, of: String },
    category: {
      type: String,
      enum: ['temple', 'monument', 'museum', 'industrial', 'nature', 'cultural', 'food', 'shopping'],
      required: true,
    },
    subcategory: String,
    location: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, default: 'Sriperumbudur' },
      state: { type: String, default: 'Tamil Nadu' },
      pincode: { type: String, required: true },
      country: { type: String, default: 'India' },
    },
    contact: {
      phone: String,
      email: String,
      website: String,
    },
    operatingHours: {
      monday: { open: String, close: String, closed: { type: Boolean, default: false } },
      tuesday: { open: String, close: String, closed: { type: Boolean, default: false } },
      wednesday: { open: String, close: String, closed: { type: Boolean, default: false } },
      thursday: { open: String, close: String, closed: { type: Boolean, default: false } },
      friday: { open: String, close: String, closed: { type: Boolean, default: false } },
      saturday: { open: String, close: String, closed: { type: Boolean, default: false } },
      sunday: { open: String, close: String, closed: { type: Boolean, default: false } },
    },
    accessibility: {
      wheelchairAccessible: { type: Boolean, default: false },
      parkingAvailable: { type: Boolean, default: true },
      publicTransport: { type: Boolean, default: false },
      restRooms: { type: Boolean, default: true },
      guidedTours: { type: Boolean, default: false },
    },
    images: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    visitDuration: { type: Number, default: 60 },
    priceRange: { type: String, enum: ['free', 'low', 'medium', 'high'], default: 'free' },
    entryFee: Number,
    tags: [{ type: String }],
    rituals: [{
      name: String,
      time: String,
      description: String,
    }],
    history: String,
    architecture: String,
    significance: String,
    bestTimeToVisit: String,
    tips: [{ type: String }],
    nearbyAttractions: [{ type: Schema.Types.ObjectId, ref: 'Location' }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

LocationSchema.index({ location: '2dsphere' });
LocationSchema.index({ category: 1, rating: -1 });
LocationSchema.index({ tags: 1 });

export const Location = mongoose.model<ILocation>('Location', LocationSchema);
