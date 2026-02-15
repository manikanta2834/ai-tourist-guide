import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  location: mongoose.Types.ObjectId;
  rating: number;
  title: string;
  content: string;
  visitDate: Date;
  visitType: 'solo' | 'couple' | 'family' | 'group';
  photos?: string[];
  helpful: number;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },
    content: { type: String, required: true },
    visitDate: { type: Date, required: true },
    visitType: {
      type: String,
      enum: ['solo', 'couple', 'family', 'group'],
      required: true,
    },
    photos: [{ type: String }],
    helpful: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ReviewSchema.index({ location: 1, rating: -1 });
ReviewSchema.index({ user: 1 });
ReviewSchema.index({ createdAt: -1 });

ReviewSchema.post('save', async function (doc) {
  const Location = mongoose.model('Location');
  const reviews = await mongoose.model('Review').find({ location: doc.location, isActive: true });
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await Location.findByIdAndUpdate(doc.location, { rating: avgRating, reviewCount: reviews.length });
});

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
