import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiBox, FiGrid, FiLayers, FiMail, FiMessageSquare, FiPackage, FiPlus } from 'react-icons/fi';
import Logo from './Logo';

export default function AdminSidebar({ isOpen, onNavigate }) {
  const location = useLocation();
  const { t } = useTranslation();

  const menuItems = [
    { title: t('admin.dashboard'), icon: <FiGrid />, path: '/admin' },
    { title: t('admin.categories'), icon: <FiLayers />, path: '/admin/categories' },
    { title: t('admin.subcategories'), icon: <FiPackage />, path: '/admin/subcategories' },
    { title: t('admin.products'), icon: <FiBox />, path: '/admin/products' },
    { title: t('admin.addProduct'), icon: <FiPlus />, path: '/admin/products/new' },
    { title: t('admin.quotes.menu'), icon: <FiMessageSquare />, path: '/admin/quotes' },
    { title: t('admin.email.menu'), icon: <FiMail />, path: '/admin/email' },
  ];

  return (
    <aside
      className={`fixed inset-y-0 start-0 z-40 w-[272px] bg-[#0d0d0d] text-white flex flex-col border-e border-white/8 shadow-[12px_0_40px_-24px_rgba(0,0,0,0.65)] transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full'
      }`}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-16 start-1/2 -translate-x-1/2 w-56 h-56 rounded-full bg-[#C63637]/15 blur-[80px]" />
      </div>

      <div className="relative h-20 flex items-center px-5 border-b border-white/10">
        <Logo onDark to="/admin" size="sidebar" />
      </div>

      <nav className="relative flex-1 py-5 px-3 space-y-1.5 overflow-y-auto">
        <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
          {t('admin.menu')}
        </p>
        {menuItems.map((item) => {
          const isActive =
            item.path === '/admin/products'
              ? location.pathname === '/admin/products' || /^\/admin\/products\/\d+$/.test(location.pathname)
              : item.path === '/admin/categories'
                ? location.pathname === '/admin/categories' || location.pathname.startsWith('/admin/categories/')
                : item.path === '/admin/subcategories'
                  ? location.pathname === '/admin/subcategories' || location.pathname.startsWith('/admin/subcategories/')
                  : item.path === '/admin/quotes'
                    ? location.pathname === '/admin/quotes' || location.pathname === '/admin/inquiries'
                    : item.path === '/admin/email'
                      ? location.pathname === '/admin/email' || location.pathname.startsWith('/admin/email/')
                      : location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={`group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                isActive
                  ? 'bg-[#C63637] text-white shadow-lg shadow-[#C63637]/30'
                  : 'text-gray-400 hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              <span className={`text-lg transition-transform ${isActive ? '' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>
              <span className="font-semibold text-sm">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="relative p-4 border-t border-white/10">
        <div className="rounded-2xl bg-white/[0.04] border border-white/8 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">Bosco Admin</p>
          <p className="text-xs text-white/65 mt-1 leading-relaxed">Machinery · Materials · Quotes</p>
        </div>
      </div>
    </aside>
  );
}
