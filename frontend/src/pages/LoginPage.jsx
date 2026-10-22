import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import ErrorMessage from '../components/ErrorMessage';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.login(email);

      if (response.success) {
        login(response.attendee, response.token);
        navigate('/events');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page login-page">
      <div className="login-container">
        <div className="login-card">
          <h1>Welcome to EventHub</h1>
          <p className="login-subtitle">
            Sign in to book tickets for amazing events
          </p>

          {error && (
            <ErrorMessage
              message={error}
              onDismiss={() => setError('')}
            />
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="login-info">
            <h3>Demo Credentials</h3>
            <p>
              <strong>Attendee:</strong> john@eventhub.com
            </p>
            <p>
              <strong>Organizer:</strong> demo@eventhub.com
            </p>
            <small>No password required in development mode</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
