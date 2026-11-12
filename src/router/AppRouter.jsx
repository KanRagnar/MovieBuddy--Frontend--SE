import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { BottomNav } from '../components/BottomNav.jsx';
import { LoginPage } from '../pages/LoginPage.jsx';
import { HomePage } from '../pages/HomePage.jsx';
import { TitleDetailsPage } from '../pages/TitleDetailsPage.jsx';
import { SwipePage } from '../pages/SwipePage.jsx';
import { ProfilePage } from '../pages/ProfilePage.jsx';
import { MessagesPage } from '../pages/MessagesPage.jsx';

const ProtectedLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="app-shell">
      {children}
      <BottomNav />
    </div>
  );
};

export const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/"
          element={
            <ProtectedLayout>
              <HomePage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/title/:titleId"
          element={
            <ProtectedLayout>
              <TitleDetailsPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/swipe"
          element={
            <ProtectedLayout>
              <SwipePage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedLayout>
              <ProfilePage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedLayout>
              <MessagesPage />
            </ProtectedLayout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
