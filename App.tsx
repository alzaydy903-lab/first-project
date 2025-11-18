
import React, { Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import CosmicBackground from './components/CosmicBackground';

// Lazy load pages for better performance
const PortfolioPage = React.lazy(() => import('./pages/PortfolioPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const AdminDashboardPage = React.lazy(() => import('./pages/AdminDashboardPage'));
const AdminDetailedPage = React.lazy(() => import('./pages/AdminDetailedPage'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center" dir="rtl">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mx-auto mb-4"></div>
      <div className="text-xl text-white">جاري تحميل الصفحة...</div>
    </div>
  </div>
);

function App() {
  return (
    <AppProvider>
      <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
        <CosmicBackground />
        <div className="relative z-10">
          <HashRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<PortfolioPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/detailed" element={<AdminDetailedPage />} />
              </Routes>
            </Suspense>
          </HashRouter>
        </div>
      </div>
    </AppProvider>
  );
}

export default App;
