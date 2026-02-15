import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUserPreferences {
  categories: string[];
  languages: string[];
  accessibility: string[];
  travelStyle: 'religious' | 'historical' | 'industrial' | 'mixed';
  budgetRange: 'low' | 'medium' | 'high';
  visitDuration: 'short' | 'medium' | 'long';
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin' | 'business';
  preferences: IUserPreferences;
  favorites: mongoose.Types.ObjectId[];
  visitedLocations: mongoose.Types.ObjectId[];
  notificationSettings: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacyControls: {
    shareLocation: boolean;
    shareActivity: boolean;
    publicProfile: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: String,
    role: {
      type: String,
      enum: ['user', 'admin', 'business'],
      default: 'user',
    },
    preferences: {
      categories: [{ type: String }],
      languages: [{ type: String, default: ['en', 'ta'] }],
      accessibility: [{ type: String }],
      travelStyle: {
        type: String,
        enum: ['religious', 'historical', 'industrial', 'mixed'],
        default: 'mixed',
      },
      budgetRange: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
      },
      visitDuration: {
        type: String,
        enum: ['short', 'medium', 'long'],
        default: 'medium',
      },
    },
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Location' }],
    visitedLocations: [{ type: Schema.Types.ObjectId, ref: 'Location' }],
    notificationSettings: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },
    privacyControls: {
      shareLocation: { type: Boolean, default: false },
      shareActivity: { type: Boolean, default: false },
      publicProfile: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
