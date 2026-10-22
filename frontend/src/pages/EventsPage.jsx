import React, { useState, useEffect } from 'react';
import { eventAPI, ticketAPI } from '../services/api';
import EventCard from '../components/EventCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch events on component mount with timeout
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');

      // Set a timeout to avoid hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 5000)
      );

      const fetchPromise = eventAPI.getAll();
      const response = await Promise.race([fetchPromise, timeoutPromise]);

      if (response.success) {
        setEvents(response.events);
      } else {
        setError(response.message || 'Failed to load events');
      }
    } catch (err) {
      console.error('Event fetch error:', err);
      setError(err.message || 'Failed to load events. Please try again.');
      // Set demo events on error
      setEvents([
        {
          _id: '507f1f77bcf86cd799439020',
          title: 'Tech Conference 2026',
          category: 'Technology',
          date: '2026-11-21T10:30:00.000Z',
          venue: 'Grand Convention Center, Mumbai',
          ticketsAvailable: 100,
        },
        {
          _id: '507f1f77bcf86cd799439021',
          title: 'Web Development Workshop',
          category: 'Workshop',
          date: '2026-11-06T10:30:00.000Z',
          venue: 'CSPIT Campus, Charusat, Anand',
          ticketsAvailable: 50,
        },
        {
          _id: '507f1f77bcf86cd799439022',
          title: 'AI & Machine Learning Summit',
          category: 'Seminar',
          date: '2026-12-06T10:30:00.000Z',
          venue: 'Taj Convention Center, Bangalore',
          ticketsAvailable: 150,
        },
        {
          _id: '507f1f77bcf86cd799439023',
          title: 'JavaScript Bootcamp',
          category: 'Training',
          date: '2026-11-11T10:30:00.000Z',
          venue: 'Tech Hub, Ahmedabad',
          ticketsAvailable: 75,
        },
        {
          _id: '507f1f77bcf86cd799439024',
          title: 'Full Stack Development Expo',
          category: 'Expo',
          date: '2026-12-21T10:30:00.000Z',
          venue: 'Convention Hall, Delhi',
          ticketsAvailable: 200,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering - does not trigger new API request
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBookClick = (eventId) => {
    setSelectedEventId(eventId);
    setQuantity(1);
    setBookingError('');
    setBookingSuccess('');
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');

    // Validation
    if (!Number.isInteger(quantity) || quantity <= 0) {
      setBookingError('Quantity must be a positive integer');
      return;
    }

    const event = events.find((e) => e._id === selectedEventId);
    if (quantity > event.ticketsAvailable) {
      setBookingError(
        `Only ${event.ticketsAvailable} tickets available for this event`
      );
      return;
    }

    setBookingLoading(true);

    try {
      const response = await ticketAPI.create(selectedEventId, quantity);

      if (response.success) {
        setBookingSuccess(
          `Successfully booked ${quantity} ticket(s) for ${event.title}!`
        );

        // Update event availability
        const updatedEvents = events.map((e) =>
          e._id === selectedEventId
            ? { ...e, ticketsAvailable: e.ticketsAvailable - quantity }
            : e
        );
        setEvents(updatedEvents);

        // Reset form
        setSelectedEventId(null);
        setQuantity(1);
      } else {
        setBookingError(response.message || 'Booking failed');
      }
    } catch (err) {
      setBookingError(err.message || 'Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const selectedEvent = events.find((e) => e._id === selectedEventId);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="page events-page">
      <div className="events-container">
        <h1>Available Events</h1>

        {error && (
          <ErrorMessage message={error} onDismiss={() => setError('')} />
        )}

        {bookingSuccess && (
          <div className="success-message">
            <span className="success-icon">✓</span>
            <span>{bookingSuccess}</span>
            <button
              className="error-dismiss"
              onClick={() => setBookingSuccess('')}
            >
              ✕
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search events by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Booking Form */}
        {selectedEventId && selectedEvent && (
          <div className="booking-form-container">
            <div className="booking-form">
              <h2>Book Tickets</h2>
              <p>
                <strong>Event:</strong> {selectedEvent.title}
              </p>

              {bookingError && (
                <ErrorMessage
                  message={bookingError}
                  onDismiss={() => setBookingError('')}
                />
              )}

              <form onSubmit={handleBookingSubmit}>
                <div className="form-group">
                  <label htmlFor="quantity">Number of Tickets</label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max={selectedEvent.ticketsAvailable}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    disabled={bookingLoading}
                  />
                  <small>
                    Maximum available: {selectedEvent.ticketsAvailable}
                  </small>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? 'Processing...' : 'Confirm Booking'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedEventId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="events-grid">
            {filteredEvents.map((event) => (
              <EventCard
                key={event._id}
                id={event._id}
                title={event.title}
                category={event.category}
                date={event.date}
                venue={event.venue}
                ticketsAvailable={event.ticketsAvailable}
                onBook={handleBookClick}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>
              {searchQuery
                ? 'No events match your search'
                : 'No events available'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
