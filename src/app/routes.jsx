import { createBrowserRouter } from 'react-router-dom';

import RootLayout from './layouts/RootLayout';
import UserLayout from './layouts/UserLayout';
import RiderLayout from './layouts/RiderLayout';
import PrivateRoute from './PrivateRoute';

import HomePage from '../pages/user/HomePage';
import SearchPage from '../pages/user/SearchPage';
import SearchResultPage from '../pages/user/SearchResultPage';
import StoreDetailPage from '../pages/user/StoreDetailPage';
import MenuDetailPage from '../pages/user/MenuDetailPage';
import CartPage from '../pages/user/CartPage';
import CheckoutPage from '../pages/user/CheckoutPage';
import OrderCompletePage from '../pages/user/OrderCompletePage';
import OrderListPage from '../pages/user/OrderListPage';
import OrderDetailPage from '../pages/user/OrderDetailPage';
import OrderTrackingPage from '../pages/user/OrderTrackingPage';
import LoginPage from '../pages/user/LoginPage';
import SignupRolePage from '../pages/user/SignupRolePage';
import UserSignupPage from '../pages/user/UserSignupPage';
import AddressRegisterPage from '../pages/user/AddressRegisterPage';
import AddressSearchPage from '../pages/user/AddressSearchPage';
import AddressSettingPage from '../pages/user/AddressSettingPage';
import LocationConfirmPage from '../pages/user/LocationConfirmPage';
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
import StoreCreatePage from '../pages/user/StoreCreatePage';
import SecurityPage from '../pages/user/SecurityPage';
import NotificationSettingsPage from '../pages/user/NotificationSettingsPage';
import WithdrawPage from '../pages/user/WithdrawPage';
import ReviewDetailPage from '../pages/user/ReviewDetailPage';
import WriteReviewPage from '../pages/user/WriteReviewPage';
import PaymentMethodsPage from '../pages/user/PaymentMethodsPage';
import PaymentMethodRegisterPage from '../pages/user/PaymentMethodRegisterPage';
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

const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [
        // 검색
        { path: '/search', element: <SearchPage /> },
        { path: '/search/result', element: <SearchResultPage /> },

        // 리뷰 작성 (헤더/내비 없음)
        {
          path: '/reviews/write',
          element: (
            <PrivateRoute>
              <WriteReviewPage />
            </PrivateRoute>
          ),
        },

        // 로그인/회원가입
        { path: '/login', element: <LoginPage /> },
        { path: '/signup', element: <SignupRolePage /> },
        { path: '/signup/user', element: <UserSignupPage /> },
        { path: '/signup/rider', element: <RiderSignupPage /> },
        { path: '/address/register', element: <AddressRegisterPage /> },
        { path: '/address/location', element: <LocationConfirmPage /> },

        // 배달원 로그인
        { path: '/rider/login', element: <RiderLoginPage /> },
        {
          path: '/rider/training',
          element: (
            <PrivateRoute redirectTo="/rider/login">
              <RiderTrainingPage />
            </PrivateRoute>
          ),
        },
        {
          path: '/rider/mode',
          element: (
            <PrivateRoute redirectTo="/rider/login">
              <RiderModePage />
            </PrivateRoute>
          ),
        },

        // 유저 페이지
        {
          element: <UserLayout />,
          children: [
            // 홈
            { path: '/', element: <HomePage /> },
            { path: '/category/:categoryId', element: <CategoryPage /> },

            // 주소
            { path: '/address/search', element: <AddressSearchPage /> },
            { path: '/address/setting', element: <AddressSettingPage /> },

            // 가게/메뉴
            { path: '/stores/create', element: <StoreCreatePage /> },
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
            {
              path: '/cart',
              element: (
                <PrivateRoute>
                  <CartPage />
                </PrivateRoute>
              ),
            },
            {
              path: '/checkout',
              element: (
                <PrivateRoute>
                  <CheckoutPage />
                </PrivateRoute>
              ),
            },
            {
              path: '/order-complete',
              element: (
                <PrivateRoute>
                  <OrderCompletePage />
                </PrivateRoute>
              ),
            },

            // 주문내역
            {
              path: '/orders',
              element: (
                <PrivateRoute>
                  <OrderListPage />
                </PrivateRoute>
              ),
            },
            {
              path: '/orders/:orderId',
              element: (
                <PrivateRoute>
                  <OrderDetailPage />
                </PrivateRoute>
              ),
            },
            {
              path: '/orders/:orderId/tracking',
              element: (
                <PrivateRoute>
                  <OrderTrackingPage />
                </PrivateRoute>
              ),
            },

            // 마이페이지
            {
              path: '/mypage',
              element: (
                <PrivateRoute>
                  <MyPage />
                </PrivateRoute>
              ),
            },
            {
              path: '/mypage/profile',
              element: (
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              ),
            },
            {
              path: '/mypage/addresses',
              element: (
                <PrivateRoute>
                  <AddressPage />
                </PrivateRoute>
              ),
            },
            {
              path: '/mypage/payment',
              element: (
                <PrivateRoute>
                  <PaymentPage />
                </PrivateRoute>
              ),
            },
            {
              path: '/mypage/payment-methods',
              element: (
                <PrivateRoute>
                  <PaymentMethodsPage />
                </PrivateRoute>
              ),
            },
            {
              path: '/mypage/payment-methods/register',
              element: (
                <PrivateRoute>
                  <PaymentMethodRegisterPage />
                </PrivateRoute>
              ),
            },
            {
              path: '/mypage/reviews',
              element: (
                <PrivateRoute>
                  <MyReviewsPage />
                </PrivateRoute>
              ),
            },
            {
              path: '/mypage/coupons',
              element: (
                <PrivateRoute>
                  <CouponsPage />
                </PrivateRoute>
              ),
            },
            {
              path: '/mypage/terms',
              element: (
                <PrivateRoute>
                  <TermsPage />
                </PrivateRoute>
              ),
            },
            {
              path: '/mypage/support',
              element: (
                <PrivateRoute>
                  <SupportPage />
                </PrivateRoute>
              ),
            },
            {
              path: '/mypage/inquiries',
              element: (
                <PrivateRoute>
                  <InquiryPage />
                </PrivateRoute>
              ),
            },
            {
              path: '/mypage/security',
              element: (
                <PrivateRoute>
                  <SecurityPage />
                </PrivateRoute>
              ),
            },
            {
              path: '/mypage/notification-settings',
              element: (
                <PrivateRoute>
                  <NotificationSettingsPage />
                </PrivateRoute>
              ),
            },
            {
              path: '/mypage/withdraw',
              element: (
                <PrivateRoute>
                  <WithdrawPage />
                </PrivateRoute>
              ),
            },
            {
              path: '/notifications',
              element: (
                <PrivateRoute>
                  <NotificationsPage />
                </PrivateRoute>
              ),
            },
          ],
        },

        // 배달원 페이지
        {
          element: <RiderLayout />,
          children: [
            {
              path: '/rider',
              element: (
                <PrivateRoute redirectTo="/rider/login">
                  <RiderHomePage />
                </PrivateRoute>
              ),
            },
            {
              path: '/rider/delivery/:orderId',
              element: (
                <PrivateRoute redirectTo="/rider/login">
                  <RiderDeliveryPage />
                </PrivateRoute>
              ),
            },
            {
              path: '/rider/delivery/:orderId/pickup',
              element: (
                <PrivateRoute redirectTo="/rider/login">
                  <RiderPickupPage />
                </PrivateRoute>
              ),
            },
            {
              path: '/rider/delivery/:orderId/complete',
              element: (
                <PrivateRoute redirectTo="/rider/login">
                  <RiderCompletePage />
                </PrivateRoute>
              ),
            },
            {
              path: '/rider/delivery/:orderId/verify',
              element: (
                <PrivateRoute redirectTo="/rider/login">
                  <RiderVerifyPage />
                </PrivateRoute>
              ),
            },
            {
              path: '/rider/history',
              element: (
                <PrivateRoute redirectTo="/rider/login">
                  <RiderHistoryPage />
                </PrivateRoute>
              ),
            },
            {
              path: '/rider/earnings',
              element: (
                <PrivateRoute redirectTo="/rider/login">
                  <RiderEarningsPage />
                </PrivateRoute>
              ),
            },
            {
              path: '/rider/settings',
              element: (
                <PrivateRoute redirectTo="/rider/login">
                  <RiderSettingsPage />
                </PrivateRoute>
              ),
            },
          ],
        },

        // 404
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ],
  {
    basename: '/baedaliyo_fe',
  }
);

export default router;
