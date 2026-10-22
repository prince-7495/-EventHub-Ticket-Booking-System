import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [attendee, setAttendee] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedAttendee = localStorage.getItem('attendee');

    if (storedToken && storedAttendee) {
      try {
        const attendeeData = JSON.parse(storedAttendee);
        setToken(storedToken);
        setAttendee(attendeeData);
        setRole(attendeeData.role);
      } catch (error) {
        console.error('Error loading auth state:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('attendee');
      }
    }

    setLoading(false);
  }, []);

  const login = (attendeeData, authToken) => {
    setAttendee(attendeeData);
    setToken(authToken);
    setRole(attendeeData.role);

    // Persist to localStorage
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('attendee', JSON.stringify(attendeeData));
  };

  const logout = () => {
    setAttendee(null);
    setToken(null);
    setRole(null);

    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('attendee');
  };

  return (
    <AuthContext.Provider
      value={{
        attendee,
        token,
        role,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
