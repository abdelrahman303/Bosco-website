import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useTheme from './hooks/useTheme';
import useLanguage from './hooks/useLanguage';

gsap.registerPlugin(ScrollTrigger);

import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoutes from './components/ProtectedRoutes';
import { scrollToTop } from './utils/scrollTop';

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-bosco-red border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Home = lazy(() => import('./pages/home/Home'));
const AboutUs = lazy(() => import('./pages/aboutus/aboutUs'));
const Categories = lazy(() => import('./pages/category/Categories'));
const CategoryDetails = lazy(() => import('./pages/category/CategoryDetails'));
const SubcategoryDetails = lazy(() => import('./pages/category/SubcategoryDetails'));
const Products = lazy(() => import('./pages/products/Products'));
const ProductDetails = lazy(() => import('./pages/products/ProductDetails'));
const Contact = lazy(() => import('./pages/contactus/Contact'));
const NotFound = lazy(() => import('./components/NotFound'));
const AdminLogin = lazy(() => import('./pages/auth/Login'));
const AdminDashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const CategoriesManagement = lazy(() => import('./pages/dashboard/CategoriesManagement'));
const CategoryForm = lazy(() => import('./pages/dashboard/CategoryForm'));
const SubcategoriesManagement = lazy(() => import('./pages/dashboard/SubcategoriesManagement'));
const SubcategoryForm = lazy(() => import('./pages/dashboard/SubcategoryForm'));
const ProductsManagement = lazy(() => import('./pages/dashboard/ProductsManagement'));
const ProductForm = lazy(() => import('./pages/dashboard/ProductForm'));
const QuotesManagement = lazy(() => import('./pages/dashboard/QuotesManagement'));
const EmailServices = lazy(() => import('./pages/dashboard/EmailServices'));
const EmailHistory = lazy(() => import('./pages/dashboard/EmailHistory'));

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    scrollToTop(true);
  }, [pathname, search]);

  useEffect(() => {
    const onClick = (event) => {
      const link = event.target.closest('a[href]');
      if (!link || link.target === '_blank' || event.metaKey || event.ctrlKey || event.shiftKey) return;

      const url = new URL(link.href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      if (url.hash) return;

      requestAnimationFrame(() => scrollToTop(true));
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
}

export default function App() {
  const { isDark } = useTheme();
  const { isAr } = useLanguage();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    window.__boscoLenis = lenis;

    return () => {
      gsap.ticker.remove(tick);
      if (window.__boscoLenis === lenis) window.__boscoLenis = null;
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <ScrollToTop />

      <Toaster
        position={isAr ? 'top-left' : 'top-right'}
        toastOptions={{
          duration: 4000,
          style: {
            background: isDark ? '#1E1E1E' : '#ffffff',
            color: isDark ? '#fff' : '#111',
            border: isDark ? '1px solid #333' : '1px solid #e5e7eb',
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
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="aboutus" element={<AboutUs />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="categories" element={<Categories />} />
            <Route path="categories/:slug/:subSlug" element={<SubcategoryDetails />} />
            <Route path="categories/:slug" element={<CategoryDetails />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:slug" element={<ProductDetails />} />
            <Route path="contact" element={<Contact />} />
            <Route path="quote" element={<Contact />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route element={<ProtectedRoutes />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="categories" element={<CategoriesManagement />} />
              <Route path="categories/new" element={<CategoryForm />} />
              <Route path="categories/:id" element={<CategoryForm />} />
              <Route path="subcategories" element={<SubcategoriesManagement />} />
              <Route path="subcategories/new" element={<SubcategoryForm />} />
              <Route path="subcategories/:id" element={<SubcategoryForm />} />
              <Route path="products" element={<ProductsManagement />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/:id" element={<ProductForm />} />
              <Route path="quotes" element={<QuotesManagement />} />
              <Route path="inquiries" element={<QuotesManagement />} />
              <Route path="email" element={<EmailServices />} />
              <Route path="email/history" element={<EmailHistory />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
