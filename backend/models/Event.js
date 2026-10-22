import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
    },
    category: {
      type: String,
      default: 'General',
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    venue: {
      type: String,
      required: [true, 'Event venue is required'],
    },
    ticketsAvailable: {
      type: Number,
      required: [true, 'Available tickets is required'],
      min: [0, 'Available tickets cannot be negative'],
      default: 100,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Event', eventSchema);
