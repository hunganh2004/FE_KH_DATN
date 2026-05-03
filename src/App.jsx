import { Routes, Route } from 'react-router-dom'
import ScrollToTop from '@/components/ScrollToTop'
import MainLayout from '@/components/layout/MainLayout'
import HomePage from '@/pages/Home/HomePage'
import CategoryPage from '@/pages/Category/CategoryPage'
import ProductDetailPage from '@/pages/Product/ProductDetailPage'
import CartPage from '@/pages/Cart/CartPage'
import CheckoutPage from '@/pages/Checkout/CheckoutPage'
import OrderResultPage from '@/pages/Order/OrderResultPage'
import OrderDetailPage from '@/pages/Order/OrderDetailPage'
import AccountPage from '@/pages/Account/AccountPage'
import OrderHistoryPage from '@/pages/Account/OrderHistoryPage'
import AddressBookPage from '@/pages/Account/AddressBookPage'
import WishlistPage from '@/pages/Account/WishlistPage'
import ChangePasswordPage from '@/pages/Account/ChangePasswordPage'
import NotificationsPage from '@/pages/Account/NotificationsPage'
import LoginPage from '@/pages/Auth/LoginPage'
import RegisterPage from '@/pages/Auth/RegisterPage'
import SearchPage from '@/pages/Search/SearchPage'
import WriteReviewPage from '@/pages/Order/WriteReviewPage'
import ForgotPasswordPage from '@/pages/Auth/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/Auth/ResetPasswordPage'
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      {/* Auth - no layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Main layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order/result" element={<OrderResultPage />} />
        <Route path="/order/:id" element={<OrderDetailPage />} />
        <Route path="/order/:orderId/review/:productId" element={<WriteReviewPage />} />

        {/* Account */}
        <Route path="/account" element={<AccountPage />} />
        <Route path="/account/orders" element={<OrderHistoryPage />} />
        <Route path="/account/addresses" element={<AddressBookPage />} />
        <Route path="/account/wishlist" element={<WishlistPage />} />
        <Route path="/account/password" element={<ChangePasswordPage />} />
        <Route path="/account/notifications" element={<NotificationsPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
    </>
  )
}
