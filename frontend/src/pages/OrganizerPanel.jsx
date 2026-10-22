import React, { useState } from 'react';

const OrganizerPanel = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    date: '',
    venue: '',
    ticketsAvailable: '',
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (
      !formData.title ||
      !formData.date ||
      !formData.venue ||
      !formData.ticketsAvailable
    ) {
      setError('All fields are required');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/events`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
          body: JSON.stringify({
            title: formData.title,
            category: formData.category || 'General',
            date: formData.date,
            venue: formData.venue,
            ticketsAvailable: parseInt(formData.ticketsAvailable),
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess(`Event "${formData.title}" created successfully!`);
        setFormData({
          title: '',
          category: '',
          date: '',
          venue: '',
          ticketsAvailable: '',
        });
      } else {
        setError(data.message || 'Failed to create event');
      }
    } catch (err) {
      setError(err.message || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page organizer-panel">
      <div className="organizer-container">
        <h1>Organizer Panel</h1>
        <p className="subtitle">Create new events for attendees to book</p>

        {success && (
          <div className="success-message">
            <span className="success-icon">✓</span>
            <span>{success}</span>
            <button
              className="error-dismiss"
              onClick={() => setSuccess('')}
            >
              ✕
            </button>
          </div>
        )}

        {error && (
          <div className="error-message">
            <span className="error-icon">✕</span>
            <span>{error}</span>
            <button className="error-dismiss" onClick={() => setError('')}>
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="organizer-form">
          <div className="form-group">
            <label htmlFor="title">Event Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Annual Tech Conference"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              id="category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Technology, Workshop, Seminar"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Event Date & Time *</label>
            <input
              id="date"
              name="date"
              type="datetime-local"
              value={formData.date}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="venue">Venue *</label>
            <input
              id="venue"
              name="venue"
              type="text"
              value={formData.venue}
              onChange={handleChange}
              placeholder="e.g., Convention Center, City, State"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="ticketsAvailable">Number of Tickets *</label>
            <input
              id="ticketsAvailable"
              name="ticketsAvailable"
              type="number"
              min="1"
              value={formData.ticketsAvailable}
              onChange={handleChange}
              placeholder="e.g., 100"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Creating Event...' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrganizerPanel;
