import React from 'react';

// EventCard Component
// Displays event information with all five required props
// Props: title, category, date, venue, ticketsAvailable
// Features:
// - Shows all five fields
// - "Sold Out" badge when ticketsAvailable === 0
// - "Book" button when ticketsAvailable > 0
// - Calls onBook callback when button clicked

const EventCard = ({
  id,
  title,
  category,
  date,
  venue,
  ticketsAvailable,
  onBook,
}) => {
  const formattedDate = new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const isSoldOut = ticketsAvailable === 0;

  return (
    <div className="event-card">
      <div className="event-header">
        <h2 className="event-title">{title}</h2>
        {isSoldOut && <span className="sold-out-badge">Sold Out</span>}
      </div>

      <div className="event-details">
        <p>
          <strong>Category:</strong> {category}
        </p>
        <p>
          <strong>Date & Time:</strong> {formattedDate}
        </p>
        <p>
          <strong>Venue:</strong> {venue}
        </p>
        <p>
          <strong>Tickets Available:</strong> {ticketsAvailable}
        </p>
      </div>

      <div className="event-actions">
        {!isSoldOut && (
          <button
            className="btn btn-primary"
            onClick={() => onBook && onBook(id)}
          >
            Book
          </button>
        )}
        {isSoldOut && (
          <button className="btn btn-disabled" disabled>
            Sold Out
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
