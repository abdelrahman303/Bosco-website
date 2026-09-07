import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Lenis from '@studio-freight/lenis';

// Layouts
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// Fallback Loader
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-bosco-red border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Lazy Loaded Public Pages
const Home = lazy(() => import('./pages/home/Home'));
const AboutUs = lazy(() => import('./pages/aboutus/aboutUs'));
// const About = lazy(() => import('./pages/about/About'));
// const Contact = lazy(() => import('./pages/contact/Contact'));
// const Categories = lazy(() => import('./pages/Categories'));
// const Subcategories = lazy(() => import('./pages/Subcategories'));
// const Products = lazy(() => import('./pages/Products'));
// const ProductDetails = lazy(() => import('./pages/ProductDetails'));
// const SearchResults = lazy(() => import('./pages/SearchResults'));
// const Wishlist = lazy(() => import('./pages/Wishlist'));
// const Cart = lazy(() => import('./pages/Cart'));
// const RequestQuote = lazy(() => import('./pages/RequestQuote'));
// const Blog = lazy(() => import('./pages/Blog'));
// const Services = lazy(() => import('./pages/Services'));
// const Projects = lazy(() => import('./pages/Projects'));
// const Certifications = lazy(() => import('./pages/Certifications'));
// const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
// const TermsConditions = lazy(() => import('./pages/TermsConditions'));
// const FAQ = lazy(() => import('./pages/FAQ'));
const NotFound = lazy(() => import('./components/NotFound'));

// Lazy Loaded Admin Pages
// const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
// const AdminProducts = lazy(() => import('./pages/admin/Products'));
// const AdminQuotes = lazy(() => import('./pages/admin/Quotes'));
// const AdminCustomers = lazy(() => import('./pages/admin/Customers'));
// const AdminSettings = lazy(() => import('./pages/admin/Settings'));

// Helper component to scroll to top on page navigation
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  // Initialize Lenis Smooth Scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <ScrollToTop />
      
      {/* Toast Notification Container */}
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1E1E1E',
            color: '#fff',
            border: '1px solid #333',
          },
          success: {
            iconTheme: {
              primary: '#C63637',
              secondary: '#fff',
            },
          },
        }}
      />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public / Client Facing Routes */}
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="aboutus" element={<AboutUs />} />
            {/* <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="categories" element={<Categories />} />
            <Route path="categories/:categoryId" element={<Subcategories />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:id" element={<ProductDetails />} />
            <Route path="search" element={<SearchResults />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="cart" element={<Cart />} />
            <Route path="quote" element={<RequestQuote />} />
            <Route path="blog" element={<Blog />} />
            <Route path="services" element={<Services />} />
            <Route path="projects" element={<Projects />} />
            <Route path="certifications" element={<Certifications />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<TermsConditions />} />
            <Route path="faq" element={<FAQ />} /> */}
          </Route>

          {/* Admin Backoffice Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            {/* <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="quotes" element={<AdminQuotes />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="settings" element={<AdminSettings />} /> */}
          </Route>

          {/* 404 Catch-All Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}