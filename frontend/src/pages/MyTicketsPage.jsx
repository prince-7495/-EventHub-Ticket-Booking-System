import React, { useState, useEffect } from 'react';
import { ticketAPI } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelLoading, setCancelLoading] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await ticketAPI.getMyTickets();

      if (response.success) {
        setTickets(response.tickets);
      } else {
        setError(response.message || 'Failed to load tickets');
      }
    } catch (err) {
      setError(err.message || 'Failed to load tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTicket = async (ticketId) => {
    if (
      !window.confirm(
        'Are you sure you want to cancel this ticket? You will receive a refund.'
      )
    ) {
      return;
    }

    setCancelLoading(ticketId);

    try {
      const response = await ticketAPI.updateStatus(ticketId, 'cancelled');

      if (response.success) {
        setTickets(
          tickets.map((t) =>
            t._id === ticketId ? { ...t, status: 'cancelled' } : t
          )
        );
      } else {
        setError(response.message || 'Failed to cancel ticket');
      }
    } catch (err) {
      setError(err.message || 'Failed to cancel ticket. Please try again.');
    } finally {
      setCancelLoading(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'booked':
        return 'status-booked';
      case 'used':
        return 'status-used';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="page my-tickets-page">
      <div className="tickets-container">
        <h1>My Tickets</h1>

        {error && (
          <ErrorMessage message={error} onDismiss={() => setError('')} />
        )}

        {tickets.length > 0 ? (
          <div className="tickets-list">
            {tickets.map((ticket) => (
              <div key={ticket._id} className="ticket-item">
                <div className="ticket-header">
                  <h3>{ticket.eventId.title}</h3>
                  <span className={`status-badge ${getStatusBadgeClass(ticket.status)}`}>
                    {ticket.status.charAt(0).toUpperCase() +
                      ticket.status.slice(1)}
                  </span>
                </div>

                <div className="ticket-details">
                  <p>
                    <strong>Quantity:</strong> {ticket.quantity} ticket(s)
                  </p>
                  <p>
                    <strong>Date:</strong>{' '}
                    {new Date(ticket.eventId.date).toLocaleDateString(
                      'en-IN',
                      {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    )}
                  </p>
                  <p>
                    <strong>Venue:</strong> {ticket.eventId.venue}
                  </p>
                  <p>
                    <strong>Booked:</strong>{' '}
                    {new Date(ticket.bookingDate).toLocaleDateString(
                      'en-IN',
                      {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      }
                    )}
                  </p>
                </div>

                {ticket.status === 'booked' && (
                  <div className="ticket-actions">
                    <button
                      className="btn btn-danger"
                      onClick={() => handleCancelTicket(ticket._id)}
                      disabled={cancelLoading === ticket._id}
                    >
                      {cancelLoading === ticket._id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>You haven't booked any tickets yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTicketsPage;
