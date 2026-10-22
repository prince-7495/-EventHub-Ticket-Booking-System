import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Attendee from '../models/Attendee.js';
import Event from '../models/Event.js';
import Ticket from '../models/Ticket.js';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventhub';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await Attendee.deleteMany({});
    await Event.deleteMany({});
    await Ticket.deleteMany({});
    console.log('Cleared existing data');

    // Create demo attendees
    const attendee1 = await Attendee.create({
      name: 'John Doe',
      email: 'john@eventhub.com',
      phone: '9876543210',
      role: 'attendee',
    });

    const organizer = await Attendee.create({
      name: 'Demo Organizer',
      email: 'demo@eventhub.com',
      phone: '9123456789',
      role: 'organizer',
    });

    console.log('✓ Created demo attendees');

    // Create sample events
    const now = new Date();
    const futureEvents = [
      {
        title: 'Tech Conference 2026',
        category: 'Technology',
        date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        venue: 'Grand Convention Center, Mumbai',
        ticketsAvailable: 100,
      },
      {
        title: 'Web Development Workshop',
        category: 'Workshop',
        date: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        venue: 'CSPIT Campus, Charusat, Anand',
        ticketsAvailable: 50,
      },
      {
        title: 'AI & Machine Learning Summit',
        category: 'Seminar',
        date: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        venue: 'Taj Convention Center, Bangalore',
        ticketsAvailable: 150,
      },
      {
        title: 'JavaScript Bootcamp',
        category: 'Training',
        date: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
        venue: 'Tech Hub, Ahmedabad',
        ticketsAvailable: 75,
      },
      {
        title: 'Full Stack Development Expo',
        category: 'Expo',
        date: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        venue: 'Convention Hall, Delhi',
        ticketsAvailable: 200,
      },
    ];

    const events = await Event.insertMany(futureEvents);
    console.log(`✓ Created ${events.length} sample events`);

    // Create a sample ticket
    const ticket = await Ticket.create({
      attendeeId: attendee1._id,
      eventId: events[0]._id,
      quantity: 2,
      status: 'booked',
    });

    // Decrement tickets for booked event
    events[0].ticketsAvailable -= 2;
    await events[0].save();

    console.log('✓ Created sample ticket');

    console.log('\n=== Seeding Complete ===');
    console.log('\nDemo Credentials:');
    console.log('- Attendee Email: john@eventhub.com');
    console.log('- Organizer Email: demo@eventhub.com');
    console.log('\nNote: No passwords required in development mode');
    console.log(`\nDatabase: ${process.env.MONGO_URI}`);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

const main = async () => {
  await connectDB();
  await seedData();
  await mongoose.connection.close();
  console.log('\nDisconnected from MongoDB');
};

main();
