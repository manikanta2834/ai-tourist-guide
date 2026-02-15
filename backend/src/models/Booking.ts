import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  location: mongoose.Types.ObjectId;
  date: Date;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    totalAmount: { type: Number, required: true, min: 0 },
    notes: String,
  },
  { timestamps: true }
);

BookingSchema.index({ user: 1 });
BookingSchema.index({ location: 1 });
BookingSchema.index({ date: 1 });

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
