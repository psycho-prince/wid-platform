import { createBrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import AssetVaultPage from '../pages/AssetVaultPage';
import InheritanceRulesPage from '../pages/InheritanceRulesPage';
import AccountPage from '../pages/AccountPage';
import AuditPage from '../pages/AuditPage'; // Import AuditPage
import { ProtectedRoute } from './ProtectedRoute';
import AppLayout from '../layouts/AppLayout';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
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
        path: 'audit', // Add audit route
        element: <AuditPage />,
      },
    ],
  },
]);