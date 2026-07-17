import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import PostLostPage from './pages/PostLostPage';
import PostFoundPage from './pages/PostFoundPage';
import DetailPage from './pages/DetailPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import SavedItemsPage from './pages/SavedItemsPage';
import InboxPage from './pages/InboxPage';
import ConversationPage from './pages/ConversationPage';
import MyClaimsPage from './pages/MyClaimsPage';
import AdminOverview from './pages/admin/AdminOverview';
import AdminUsersTable from './pages/admin/AdminUsersTable';
import AdminItemsTable from './pages/admin/AdminItemsTable';
import AdminActivityLog from './pages/admin/AdminActivityLog';
import AdminClaimsPage from './pages/admin/AdminClaimsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminLocationsPage from './pages/admin/AdminLocationsPage';
import './styles/global.css';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return isAdmin ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/items/:id" element={<DetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/post-lost" element={<ProtectedRoute><PostLostPage /></ProtectedRoute>} />
          <Route path="/post-found" element={<ProtectedRoute><PostFoundPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/saved" element={<ProtectedRoute><SavedItemsPage /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><InboxPage /></ProtectedRoute>} />
          <Route path="/messages/:id" element={<ProtectedRoute><ConversationPage /></ProtectedRoute>} />
          <Route path="/my-claims" element={<ProtectedRoute><MyClaimsPage /></ProtectedRoute>} />

          <Route path="/admin" element={<AdminRoute><AdminOverview /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsersTable /></AdminRoute>} />
          <Route path="/admin/items" element={<AdminRoute><AdminItemsTable /></AdminRoute>} />
          <Route path="/admin/activity-log" element={<AdminRoute><AdminActivityLog /></AdminRoute>} />
          <Route path="/admin/claims" element={<AdminRoute><AdminClaimsPage /></AdminRoute>} />
          <Route path="/admin/reports" element={<AdminRoute><AdminReportsPage /></AdminRoute>} />
          <Route path="/admin/categories" element={<AdminRoute><AdminCategoriesPage /></AdminRoute>} />
          <Route path="/admin/locations" element={<AdminRoute><AdminLocationsPage /></AdminRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
