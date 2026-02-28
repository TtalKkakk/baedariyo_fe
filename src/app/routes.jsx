import { createBrowserRouter } from 'react-router-dom';

import RootLayout from './layouts/RootLayout';
import UserLayout from './layouts/UserLayout';
import RiderLayout from './layouts/RiderLayout';

import HomePage from '../pages/user/HomePage';
import SearchPage from '../pages/user/SearchPage';
import StoreDetailPage from '../pages/user/StoreDetailPage';
import MenuDetailPage from '../pages/user/MenuDetailPage';
import CartPage from '../pages/user/CartPage';
import CheckoutPage from '../pages/user/CheckoutPage';
import OrderListPage from '../pages/user/OrderListPage';
import OrderDetailPage from '../pages/user/OrderDetailPage';
import OrderTrackingPage from '../pages/user/OrderTrackingPage';
import LoginPage from '../pages/user/LoginPage';
import SignupPage from '../pages/user/SignupPage';
import AddressRegisterPage from '../pages/user/AddressRegisterPage';
import MyPage from '../pages/user/MyPage';
import ProfilePage from '../pages/user/ProfilePage';
import AddressPage from '../pages/user/AddressPage';
import PaymentPage from '../pages/user/PaymentPage';
import MyReviewsPage from '../pages/user/MyReviewsPage';
import CouponsPage from '../pages/user/CouponsPage';
import TermsPage from '../pages/user/TermsPage';
import SupportPage from '../pages/user/SupportPage';
import InquiryPage from '../pages/user/InquiryPage';
import NotificationsPage from '../pages/user/NotificationsPage';
import CategoryPage from '../pages/user/CategoryPage';
import StoreReviewsPage from '../pages/user/StoreReviewsPage';
import StoreInfoPage from '../pages/user/StoreInfoPage';
import SecurityPage from '../pages/user/SecurityPage';
import NotificationSettingsPage from '../pages/user/NotificationSettingsPage';
import WithdrawPage from '../pages/user/WithdrawPage';
import ReviewDetailPage from '../pages/user/ReviewDetailPage';
import NotFoundPage from '../pages/NotFoundPage';

import RiderLoginPage from '../pages/rider/RiderLoginPage';
import RiderSignupPage from '../pages/rider/RiderSignupPage';
import RiderTrainingPage from '../pages/rider/RiderTrainingPage';
import RiderModePage from '../pages/rider/RiderModePage';
import RiderHomePage from '../pages/rider/RiderHomePage';
import RiderDeliveryPage from '../pages/rider/RiderDeliveryPage';
import RiderPickupPage from '../pages/rider/RiderPickupPage';
import RiderCompletePage from '../pages/rider/RiderCompletePage';
import RiderVerifyPage from '../pages/rider/RiderVerifyPage';
import RiderHistoryPage from '../pages/rider/RiderHistoryPage';
import RiderEarningsPage from '../pages/rider/RiderEarningsPage';
import RiderSettingsPage from '../pages/rider/RiderSettingsPage';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // 검색
      { path: '/search', element: <SearchPage /> },

      // 로그인/회원가입
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
      { path: '/address/register', element: <AddressRegisterPage /> },

      // 배달원 로그인/회원가입/교육
      { path: '/rider/login', element: <RiderLoginPage /> },
      { path: '/rider/signup', element: <RiderSignupPage /> },
      { path: '/rider/training', element: <RiderTrainingPage /> },
      { path: '/rider/mode', element: <RiderModePage /> },

      // 유저 페이지
      {
        element: <UserLayout />,
        children: [
          // 홈
          { path: '/', element: <HomePage /> },
          { path: '/category/:categoryId', element: <CategoryPage /> },

          // 가게/메뉴
          { path: '/stores/:storeId', element: <StoreDetailPage /> },
          {
            path: '/stores/:storeId/menu/:menuId',
            element: <MenuDetailPage />,
          },
          {
            path: '/stores/:storeId/reviews',
            element: <StoreReviewsPage />,
          },
          { path: '/stores/:storeId/info', element: <StoreInfoPage /> },
          { path: '/reviews/:reviewId', element: <ReviewDetailPage /> },

          // 장바구니/주문
          { path: '/cart', element: <CartPage /> },
          { path: '/checkout', element: <CheckoutPage /> },

          // 주문내역
          { path: '/orders', element: <OrderListPage /> },
          { path: '/orders/:orderId', element: <OrderDetailPage /> },
          { path: '/orders/:orderId/tracking', element: <OrderTrackingPage /> },

          // 마이페이지
          { path: '/mypage', element: <MyPage /> },
          { path: '/mypage/profile', element: <ProfilePage /> },
          { path: '/mypage/addresses', element: <AddressPage /> },
          { path: '/mypage/payment', element: <PaymentPage /> },
          { path: '/mypage/reviews', element: <MyReviewsPage /> },
          { path: '/mypage/coupons', element: <CouponsPage /> },
          { path: '/mypage/terms', element: <TermsPage /> },
          { path: '/mypage/support', element: <SupportPage /> },
          { path: '/mypage/inquiries', element: <InquiryPage /> },
          { path: '/mypage/security', element: <SecurityPage /> },
          {
            path: '/mypage/notification-settings',
            element: <NotificationSettingsPage />,
          },
          { path: '/mypage/withdraw', element: <WithdrawPage /> },
          { path: '/notifications', element: <NotificationsPage /> },
        ],
      },

      // 배달원 페이지
      {
        element: <RiderLayout />,
        children: [
          { path: '/rider', element: <RiderHomePage /> },
          { path: '/rider/delivery/:orderId', element: <RiderDeliveryPage /> },
          {
            path: '/rider/delivery/:orderId/pickup',
            element: <RiderPickupPage />,
          },
          {
            path: '/rider/delivery/:orderId/complete',
            element: <RiderCompletePage />,
          },
          {
            path: '/rider/delivery/:orderId/verify',
            element: <RiderVerifyPage />,
          },
          { path: '/rider/history', element: <RiderHistoryPage /> },
          { path: '/rider/earnings', element: <RiderEarningsPage /> },
          { path: '/rider/settings', element: <RiderSettingsPage /> },
        ],
      },

      // 404
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default router;
