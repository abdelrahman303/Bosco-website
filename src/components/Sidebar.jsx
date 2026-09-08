import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiBox, FiGrid, FiLayers, FiMessageSquare, FiPackage, FiPlus } from 'react-icons/fi';
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
    { title: t('admin.inquiries'), icon: <FiMessageSquare />, path: '/admin/inquiries' },
  ];

  return (
    <aside
      className={`fixed inset-y-0 start-0 z-40 w-[260px] bg-[#111] text-white flex flex-col border-e border-white/5 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full'
      }`}
    >
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <Logo onDark />
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive =
            item.path === '/admin/products'
              ? location.pathname === '/admin/products' || /^\/admin\/products\/\d+$/.test(location.pathname)
              : item.path === '/admin/categories'
                ? location.pathname === '/admin/categories' || location.pathname.startsWith('/admin/categories/')
                : item.path === '/admin/subcategories'
                  ? location.pathname === '/admin/subcategories' || location.pathname.startsWith('/admin/subcategories/')
                  : location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                isActive
                  ? 'bg-[#C63637] text-white shadow-lg shadow-[#C63637]/25'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-semibold text-sm">{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
