import { createBrowserRouter } from 'react-router-dom';

// Layouts
import RootLayout from './layouts/RootLayout';
import UserLayout from './layouts/UserLayout';
import RiderLayout from './layouts/RiderLayout';

// Pages - User
import HomePage from '@/pages/user/HomePage';
import OrderPage from '@/pages/user/OrderPage';

// Pages - Rider
import DashboardPage from '@/pages/rider/DashboardPage';
import DeliveryPage from '@/pages/rider/DeliveryPage';

// Pages - Common
import NotFoundPage from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // User Routes
      {
        element: <UserLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'order', element: <OrderPage /> },
        ],
      },

      // Rider Routes
      {
        path: 'rider',
        element: <RiderLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'delivery', element: <DeliveryPage /> },
        ],
      },

      // 404
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
