import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const HomePage = lazy(() => import('../pages/home/page'));
const ProductsPage = lazy(() => import('../pages/products/page'));
const ProductDetailPage = lazy(() => import('../pages/products/[id]/page'));
const CartPage = lazy(() => import('../pages/cart/page'));
const CheckoutPage = lazy(() => import('../pages/checkout/page'));
const CheckoutVerifyPage = lazy(() => import('../pages/checkout/verify/page'));
const OrderSuccessPage = lazy(() => import('../pages/order-success/page'));
const BuyerOrdersPage = lazy(() => import('../pages/buyer-orders/page'));
const WishlistPage = lazy(() => import('../pages/wishlist/page'));
const ComparePage = lazy(() => import('../pages/compare/page'));
const SellPage = lazy(() => import('../pages/sell/page'));
const SellerDashboardPage = lazy(() => import('../pages/seller-dashboard/page'));
const SellerAddProductPage = lazy(() => import('../pages/seller-dashboard/add-product/page'));
const SellerOrdersPage = lazy(() => import('../pages/seller-dashboard/orders/page'));
const SellerAnalyticsPage = lazy(() => import('../pages/seller-dashboard/analytics/page'));
const SellerPayoutsPage = lazy(() => import('../pages/seller-dashboard/payouts/page'));
const SellerTrustPage = lazy(() => import('../pages/seller-dashboard/trust/page'));
const SellerSponsoredPlacementsPage = lazy(() => import('../pages/seller-dashboard/marketing/sponsored-placements/page'));
const AdminSellerApprovalPage = lazy(() => import('../pages/admin/seller-approval/page'));
const AdminOpsPage = lazy(() => import('../pages/admin/ops/page'));
const AdminTrustPage = lazy(() => import('../pages/admin/trust/page'));
const AdminSponsoredPlacementsPage = lazy(() => import('../pages/admin/sponsored-placements/page'));
const AdminAPIPartnersPage = lazy(() => import('../pages/admin/api-partners/page'));
const AdminControlTowerPage = lazy(() => import('../pages/admin/control-tower/page'));
const AdminSubscriptionsPage = lazy(() => import('../pages/admin/subscriptions/page'));
const AdminImpactInclusionPage = lazy(() => import('../pages/admin/impact-inclusion/page'));
const AdminBulkActionsPage = lazy(() => import('../pages/admin/bulk-actions/page'));
const AdminBrandingPage = lazy(() => import('../pages/admin/branding/page'));
const AdminPaymentSettingsPage = lazy(() => import('../pages/admin/payment-settings/page'));
const AdminShippingSettingsPage = lazy(() => import('../pages/admin/shipping-settings/page'));
const AdminFlashSalesPage = lazy(() => import('../pages/admin/flash-sales/page'));
const AdminActivityLogsPage = lazy(() => import('../pages/admin/activity-logs/page'));
const AdminExceptionsPage = lazy(() => import('../pages/admin/exceptions/page'));
const AdminMicroFulfillmentPage = lazy(() => import('../pages/admin/micro-fulfillment/page'));
const DiscoverPage = lazy(() => import('../pages/discover/page'));
const PersonalizedFeedPage = lazy(() => import('../pages/discover/personalized/page'));
const SellerStorefrontPage = lazy(() => import('../pages/store/[handle]/page'));
const OrderTrackingPage = lazy(() => import('../pages/orders/[orderId]/tracking/page'));
const SocialPage = lazy(() => import('../pages/social/page'));
const ServicesPage = lazy(() => import('../pages/services/page'));
const ServiceDetailPage = lazy(() => import('../pages/services/[id]/page'));
const SubscriptionsPage = lazy(() => import('../pages/subscriptions/page'));
const ManageSubscriptionPage = lazy(() => import('../pages/subscriptions/manage/page'));
const MyAccountPage = lazy(() => import('../pages/account/page'));
const AccountSettingsPage = lazy(() => import('../pages/account/settings/page'));
const NotificationSettingsPage = lazy(() => import('../pages/account/settings/notifications/page'));
const AccountNotificationsPage = lazy(() => import('../pages/account/notifications/page'));
const PartnerRegisterPage = lazy(() => import('../pages/partner/register/page'));
const PartnerDocsPage = lazy(() => import('../pages/partner/docs/page'));
const LoyaltyPage = lazy(() => import('../pages/loyalty/page'));
const ReferralPage = lazy(() => import('../pages/referral/page'));
const SavedSearchesPage = lazy(() => import('../pages/saved-searches/page'));
const AboutPage = lazy(() => import('../pages/about/page'));
const HowItWorksPage = lazy(() => import('../pages/how-it-works/page'));
const CategoriesPage = lazy(() => import('../pages/categories/page'));
const SupportPage = lazy(() => import('../pages/support/page'));
const SellerGuidePage = lazy(() => import('../pages/seller-guide/page'));
const FeesPricingPage = lazy(() => import('../pages/fees-pricing/page'));
const PrivacyPolicyPage = lazy(() => import('../pages/privacy-policy/page'));
const TermsOfServicePage = lazy(() => import('../pages/terms-of-service/page'));
const SellersPage = lazy(() => import('../pages/sellers/page'));
const FeesPage = lazy(() => import('../pages/fees/page'));
const SellerProtectionPage = lazy(() => import('../pages/seller-protection/page'));
const AnalyticsPage = lazy(() => import('../pages/analytics/page'));
const TestPaymentPage = lazy(() => import('../pages/test-payment/page'));
const NotFoundPage = lazy(() => import('../pages/NotFound'));
const LoginPage = lazy(() => import('../pages/login/page'));
const SignupPage = lazy(() => import('../pages/signup/page'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/products',
    element: <ProductsPage />,
  },
  {
    path: '/products/:id',
    element: <ProductDetailPage />,
  },
  {
    path: '/cart',
    element: <CartPage />,
  },
  {
    path: '/checkout',
    element: <CheckoutPage />,
  },
  {
    path: '/checkout/verify',
    element: <CheckoutVerifyPage />,
  },
  {
    path: '/order-success',
    element: <OrderSuccessPage />,
  },
  {
    path: '/buyer-orders',
    element: <BuyerOrdersPage />,
  },
  {
    path: '/wishlist',
    element: <WishlistPage />,
  },
  {
    path: '/compare',
    element: <ComparePage />,
  },
  {
    path: '/sell',
    element: <SellPage />,
  },
  {
    path: '/seller-dashboard',
    element: <SellerDashboardPage />,
  },
  {
    path: '/seller-dashboard/add-product',
    element: <SellerAddProductPage />,
  },
  {
    path: '/seller-dashboard/orders',
    element: <SellerOrdersPage />,
  },
  {
    path: '/seller-dashboard/analytics',
    element: <SellerAnalyticsPage />,
  },
  {
    path: '/seller-dashboard/payouts',
    element: <SellerPayoutsPage />,
  },
  {
    path: '/seller-dashboard/trust',
    element: <SellerTrustPage />,
  },
  {
    path: '/seller-dashboard/marketing/sponsored-placements',
    element: <SellerSponsoredPlacementsPage />,
  },
  {
    path: '/admin/seller-approval',
    element: <AdminSellerApprovalPage />,
  },
  {
    path: '/admin/ops',
    element: <AdminOpsPage />,
  },
  {
    path: '/admin/trust',
    element: <AdminTrustPage />,
  },
  {
    path: '/admin/sponsored-placements',
    element: <AdminSponsoredPlacementsPage />,
  },
  {
    path: '/admin/api-partners',
    element: <AdminAPIPartnersPage />,
  },
  {
    path: '/admin/control-tower',
    element: <AdminControlTowerPage />,
  },
  {
    path: '/admin/subscriptions',
    element: <AdminSubscriptionsPage />,
  },
  {
    path: '/admin/impact-inclusion',
    element: <AdminImpactInclusionPage />,
  },
  {
    path: '/admin/bulk-actions',
    element: <AdminBulkActionsPage />,
  },
  {
    path: '/admin/branding',
    element: <AdminBrandingPage />,
  },
  {
    path: '/admin/payment-settings',
    element: <AdminPaymentSettingsPage />,
  },
  {
    path: '/admin/shipping-settings',
    element: <AdminShippingSettingsPage />,
  },
  {
    path: '/discover',
    element: <DiscoverPage />,
  },
  {
    path: '/discover/personalized',
    element: <PersonalizedFeedPage />,
  },
  {
    path: '/store/:handle',
    element: <SellerStorefrontPage />,
  },
  {
    path: '/orders/:orderId/tracking',
    element: <OrderTrackingPage />,
  },
  {
    path: '/social',
    element: <SocialPage />,
  },
  {
    path: '/services',
    element: <ServicesPage />,
  },
  {
    path: '/services/:id',
    element: <ServiceDetailPage />,
  },
  {
    path: '/subscriptions',
    element: <SubscriptionsPage />,
  },
  {
    path: '/subscriptions/manage',
    element: <ManageSubscriptionPage />,
  },
  {
    path: '/account',
    element: <MyAccountPage />,
  },
  {
    path: '/account/settings',
    element: <AccountSettingsPage />,
  },
  {
    path: '/account/settings/notifications',
    element: <NotificationSettingsPage />,
  },
  {
    path: '/account/notifications',
    element: <AccountNotificationsPage />,
  },
  {
    path: '/partner/register',
    element: <PartnerRegisterPage />,
  },
  {
    path: '/partner/docs',
    element: <PartnerDocsPage />,
  },
  {
    path: '/loyalty',
    element: <LoyaltyPage />,
  },
  {
    path: '/referral',
    element: <ReferralPage />,
  },
  {
    path: '/saved-searches',
    element: <SavedSearchesPage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/how-it-works',
    element: <HowItWorksPage />,
  },
  {
    path: '/categories',
    element: <CategoriesPage />,
  },
  {
    path: '/support',
    element: <SupportPage />,
  },
  {
    path: '/seller-guide',
    element: <SellerGuidePage />,
  },
  {
    path: '/sellers',
    element: <SellersPage />,
  },
  {
    path: '/fees-pricing',
    element: <FeesPricingPage />,
  },
  {
    path: '/fees',
    element: <FeesPage />,
  },
  {
    path: '/seller-protection',
    element: <SellerProtectionPage />,
  },
  {
    path: '/analytics',
    element: <AnalyticsPage />,
  },
  {
    path: '/privacy-policy',
    element: <PrivacyPolicyPage />,
  },
  {
    path: '/privacy',
    element: <PrivacyPolicyPage />,
  },
  {
    path: '/terms-of-service',
    element: <TermsOfServicePage />,
  },
  {
    path: '/terms',
    element: <TermsOfServicePage />,
  },
  {
    path: '/admin/flash-sales',
    element: <AdminFlashSalesPage />,
  },
  {
    path: '/admin/activity-logs',
    element: <AdminActivityLogsPage />,
  },
  {
    path: '/admin/exceptions',
    element: <AdminExceptionsPage />,
  },
  {
    path: '/admin/micro-fulfillment',
    element: <AdminMicroFulfillmentPage />,
  },
  {
    path: '/test-payment',
    element: <TestPaymentPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export default routes;
