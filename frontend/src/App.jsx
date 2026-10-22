import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Loading from './components/Loading';

// Pages
import LoginPage from './pages/LoginPage';
import EventsPage from './pages/EventsPage';
import MyTicketsPage from './pages/MyTicketsPage';

// Lazy load OrganizerPanel
const OrganizerPanel = React.lazy(() => import('./pages/OrganizerPanel'));

function AppRoutes() {
  const { token } = useAuth();

  return (
    <Routes>
      {/* Login route - accessible to everyone */}
      <Route
        path="/"
        element={
          token ? <Navigate to="/events" replace /> : <LoginPage />
        }
      />

      {/* Protected routes - require authentication */}
      <Route
        path="/events"
        element={<ProtectedRoute component={EventsPage} />}
      />
      <Route
        path="/my-tickets"
        element={<ProtectedRoute component={MyTicketsPage} />}
      />

      {/* Organizer route - requires organizer role */}
      <Route
        path="/organizer"
        element={
          <ProtectedRoute
            component={() => (
              <Suspense fallback={<Loading />}>
                <OrganizerPanel />
              </Suspense>
            )}
            requiredRole="organizer"
          />
        }
      />

      {/* Catch-all - redirect to login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <AppRoutes />
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
