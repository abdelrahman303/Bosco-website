import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Global Styles
import './index.css';

// i18n configuration (Uncomment this once you create src/i18n.js)
// import './i18n';

import App from './App.jsx';

// Initialize React Query Client for API state management
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents unnecessary API calls when switching tabs
      retry: 1,                    // Retry failed requests once
      staleTime: 5 * 60 * 1000,    // Cache data for 5 minutes
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* HelmetProvider manages document head tags (title, meta) for SEO */}
    <HelmetProvider>
      {/* QueryClientProvider manages server state and caching */}
      <QueryClientProvider client={queryClient}>
        {/* BrowserRouter enables client-side routing */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>
);