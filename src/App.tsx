/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

import Home from './pages/Home';
import TourDetails from './pages/TourDetails';
import TourSearch from './pages/TourSearch';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import OAuth2Callback from './pages/OAuth2Callback';
import MainLayout from './layouts/MainLayout';
import UserLayout from './layouts/UserLayout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import MyBookings from './pages/MyBookings';
import NotFound from './pages/NotFound';
import AboutUs from './pages/AboutUs';
import Journal from './pages/Journal';
import Deals from './pages/Deals';
import OrderDetails from './pages/OrderDetails';
import ManageTours from './pages/ManageTours';
import Success from './pages/Success';
import ManageCustomers from './pages/ManageCustomers';
import ManageOrders from './pages/ManageOrders';
import AddTour from './pages/AddTour';
import ManageDeals from './pages/ManageDeals';
import BlogPost from './pages/BlogPost';
import BookingDetails from './pages/BookingDetails';
import DealEditor from './pages/DealEditor';
import CustomerDetails from './pages/CustomerDetails';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UserProfilePage from './pages/UserProfile';
import AdminSettings from './pages/AdminSettings';
import ManageBlogs from './pages/ManageBlogs';
import BlogEditor from './pages/BlogEditor';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<TourSearch />} />
          <Route path="/tour/:id" element={<TourDetails />} />
          <Route path="/success" element={<Success />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/oauth2/callback" element={<OAuth2Callback />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/journal/:slug" element={<BlogPost />} />
          <Route path="/deals" element={<Deals />} />

          {/* Protected: checkout requires auth */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<Checkout />} />
          </Route>

          {/* Protected: user portal */}
          <Route element={<ProtectedRoute />}>
            <Route element={<UserLayout />}>
              <Route path="/account" element={<Navigate to="/my-bookings" replace />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/my-bookings/:id" element={<BookingDetails />} />
              <Route path="/my-profile" element={<UserProfilePage />} />
            </Route>
          </Route>

          {/* Admin-only */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="tours" element={<ManageTours />} />
              <Route path="tours/new" element={<AddTour />} />
              <Route path="tours/edit/:id" element={<AddTour />} />
              <Route path="destinations" element={<ManageTours />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="customers" element={<ManageCustomers />} />
              <Route path="customers/:id" element={<CustomerDetails />} />
              <Route path="orders" element={<ManageOrders />} />
              <Route path="orders/:id" element={<OrderDetails />} />
              <Route path="deals" element={<ManageDeals />} />
              <Route path="deals/new" element={<DealEditor />} />
              <Route path="deals/edit/:id" element={<DealEditor />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="blogs" element={<ManageBlogs />} />
              <Route path="blogs/new" element={<BlogEditor />} />
              <Route path="blogs/edit/:id" element={<BlogEditor />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
