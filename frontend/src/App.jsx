import React from 'react';
import { createBrowserRouter, RouterProvider, useLocation } from 'react-router-dom';
import './styles/globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import BookingConfirmation from './pages/BookingConfirmation';
import ContactUs from './pages/ContactUs';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/admin/Dashboard.jsx';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';

const Layout = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <div className="App admin-page">
        <ScrollToTop />
        {children}
      </div>
    );
  }

  return (
    <div className="App">
      <ScrollToTop />
      <Navbar />
      <div className="content-wrapper" style={{ paddingTop: isHome ? '0' : '64px' }}>
        {children}
      </div>
      <Footer />
    </div>
  );
};

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <AuthProvider>
          <Layout>
            <Home />
          </Layout>
        </AuthProvider>
      ),
    },
    {
      path: "/properties",
      element: (
        <AuthProvider>
          <Layout>
            <Properties />
          </Layout>
        </AuthProvider>
      ),
    },

    {
      path: "/properties/:type",
      element: (
        <AuthProvider>
          <Layout>
            <Properties />
          </Layout>
        </AuthProvider>
      ),
    },
    {
      path: "/property/:id",
      element: (
        <AuthProvider>
          <Layout>
            <PropertyDetail />
          </Layout>
        </AuthProvider>
      ),
    },
    {
      path: "/checkout",
      element: (
        <AuthProvider>
          <Layout>
            <Checkout />
          </Layout>
        </AuthProvider>
      ),
    },
    {
      path: "/:propertyId/:bookingId/booking-confirmation",
      element: (
        <AuthProvider>
          <Layout>
            <BookingConfirmation />
          </Layout>
        </AuthProvider>
      ),
    },
    {
      path: "/contact",
      element: (
        <AuthProvider>
          <Layout>
            <ContactUs />
          </Layout>
        </AuthProvider>
      ),
    },
    {
      path: "/login",
      element: (
        <AuthProvider>
          <Layout>
            <Login />
          </Layout>
        </AuthProvider>
      ),
    },
    {
      path: "/register",
      element: (
        <AuthProvider>
          <Layout>
            <Register />
          </Layout>
        </AuthProvider>
      ),
    },
    {
      path: "/admin/*",
      element: (
        <AuthProvider>
          <Layout>
            <AdminDashboard />
          </Layout>
        </AuthProvider>
      ),
    },
    {
      path: "*",
      element: (
        <AuthProvider>
          <Layout>
            <NotFound />
          </Layout>
        </AuthProvider>
      ),
    },
  ], {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  });

  return <RouterProvider router={router} />;
}

export default App;
