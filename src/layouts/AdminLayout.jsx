import { Outlet, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiExternalLink, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import AdminSidebar from '../components/Sidebar';
import ThemeLangToggles from '../components/admin/ThemeLangToggles';
import SiteLogo from '../components/Logo.jsx';
import useAuth from '../hooks/useAuth';

export default function AdminLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const { admin, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);

  useEffect(() => {
    if (window.innerWidth < 1024) setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(true);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#f0eeea] dark:bg-[#070707] text-bosco-gray dark:text-gray-200">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/45 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        />
      )}

      <AdminSidebar isOpen={sidebarOpen} onNavigate={() => window.innerWidth < 1024 && setSidebarOpen(false)} />

      <div className={`flex flex-col min-h-screen transition-[padding] duration-300 ${sidebarOpen ? 'lg:ps-[272px]' : 'lg:ps-0'}`}>
        <header className="sticky top-0 z-20 h-14 sm:h-16 bg-white/92 dark:bg-[#0f0f0f]/92 backdrop-blur-xl border-b border-gray-200/80 dark:border-white/10 flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-6 shadow-[0_8px_24px_-20px_rgba(15,23,42,0.45)]">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen((open) => !open)}
              className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center hover:text-[#C63637] hover:bg-[#C63637]/10 transition-colors"
            >
              <span className="lg:hidden">{sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}</span>
              <span className="hidden lg:inline"><FiMenu size={20} /></span>
            </button>
            <SiteLogo className="lg:hidden shrink-0" />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeLangToggles />
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#C63637] px-3 py-2 rounded-xl hover:bg-[#C63637]/5 transition-colors"
            >
              <FiExternalLink /> {t('admin.viewSite')}
            </Link>
            <div className="hidden md:block text-end pe-1">
              <p className="text-sm font-semibold leading-tight">{admin?.name || 'Admin'}</p>
              <p className="text-[11px] text-gray-500 truncate max-w-[160px]">{admin?.email}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C63637] to-[#8f2425] text-white flex items-center justify-center font-bold shadow-md shadow-[#C63637]/25">
              {(admin?.name || 'A').charAt(0)}
            </div>
            <button
              onClick={logout}
              className="h-10 px-3 rounded-xl text-sm font-semibold text-gray-500 hover:text-[#C63637] hover:bg-red-50 dark:hover:bg-white/5 inline-flex items-center gap-2 transition-colors"
            >
              <FiLogOut />
              <span className="hidden sm:inline">{t('admin.logout')}</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-3 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
