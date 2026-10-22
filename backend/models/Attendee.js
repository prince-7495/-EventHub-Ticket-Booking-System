import mongoose from 'mongoose';

const attendeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email already exists'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['attendee', 'organizer'],
      default: 'attendee',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique index on email
attendeeSchema.index({ email: 1 }, { unique: true });

export default mongoose.model('Attendee', attendeeSchema);
