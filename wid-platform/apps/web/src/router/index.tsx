import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import AssetVaultPage from '../pages/AssetVaultPage';
import InheritanceRulesPage from '../pages/InheritanceRulesPage';
import AccountPage from '../pages/AccountPage';
import AuditPage from '../pages/AuditPage'; 
import LandingPage from '../pages/LandingPage';
import { ProtectedRoute } from './ProtectedRoute';
import AppLayout from '../layouts/AppLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'assets',
        element: <AssetVaultPage />,
      },
      {
        path: 'inheritance',
        element: <InheritanceRulesPage />,
      },
      {
        path: 'account',
        element: <AccountPage />,
      },
      {
        path: 'audit',
        element: <AuditPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);