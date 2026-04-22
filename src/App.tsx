/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TourDetails from './pages/TourDetails';
import TourSearch from './pages/TourSearch';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import MainLayout from './layouts/MainLayout';
import UserLayout from './layouts/UserLayout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import MyBookings from './pages/MyBookings';
import NotFound from './pages/NotFound';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Journal from './pages/Journal';
import Deals from './pages/Deals';
import OrderDetails from './pages/OrderDetails';
import ManageTours from './pages/ManageTours';
import Success from './pages/Success';
import ManageBlog from './pages/ManageBlog';
import ManageCustomers from './pages/ManageCustomers';
import ManageOrders from './pages/ManageOrders';
import AddTour from './pages/AddTour';
import EditBlogPost from './pages/EditBlogPost';
import ManageDeals from './pages/ManageDeals';
import BlogPost from './pages/BlogPost';
import CreateBlogPost from './pages/CreateBlogPost';
import UserProfile from './pages/UserProfile';
import BookingDetails from './pages/BookingDetails';
import DealEditor from './pages/DealEditor';
import CustomerDetails from './pages/CustomerDetails';
import ForgotPassword from './pages/ForgotPassword';
import Wishlist from './pages/Wishlist';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tours" element={<TourSearch />} />
        <Route path="/tour/:id" element={<TourDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/journal/:id" element={<BlogPost />} />
        <Route path="/deals" element={<Deals />} />
        
        {/* User facing portal features */}
        <Route element={<UserLayout />}>
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/my-bookings/:id" element={<BookingDetails />} />
        </Route>

        <Route path="/admin" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="tours" element={<ManageTours />} />
          <Route path="tours/new" element={<AddTour />} />
          <Route path="tours/edit/:id" element={<AddTour />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="blog" element={<ManageBlog />} />
          <Route path="blog/new" element={<CreateBlogPost />} />
          <Route path="blog/edit/:id" element={<EditBlogPost />} />
          <Route path="customers" element={<ManageCustomers />} />
          <Route path="customers/:id" element={<CustomerDetails />} />
          <Route path="orders" element={<ManageOrders />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="deals" element={<ManageDeals />} />
          <Route path="deals/new" element={<DealEditor />} />
          <Route path="deals/edit/:id" element={<DealEditor />} />
        </Route>

        {/* Catch-all route for 404 Not Found directly mapping to our 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
