import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiBox, FiLayers, FiMessageSquare, FiPackage, FiPlus, FiStar } from 'react-icons/fi';
import { inquiryService } from '../../services/inquiryService';
import { productService } from '../../services/productService';
import { mediaUrl, formatPrice } from '../../utils/media';

export default function Dashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);

  const cards = [
    { key: 'categories', label: t('admin.stats.categories'), icon: FiLayers, to: '/admin/categories' },
    { key: 'subcategories', label: t('admin.stats.subcategories'), icon: FiPackage, to: '/admin/subcategories' },
    { key: 'products', label: t('admin.stats.products'), icon: FiBox, to: '/admin/products' },
    { key: 'featured', label: t('admin.stats.featured'), icon: FiStar, to: '/admin/products' },
    { key: 'inquiries', label: t('admin.stats.inquiries'), icon: FiMessageSquare, to: '/admin/inquiries' },
  ];

  useEffect(() => {
    inquiryService.stats().then(setStats).catch(() => setStats(null));
    productService.list({ admin: 1 }).then((items) => setProducts(items.slice(0, 6))).catch(() => setProducts([]));
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="text-start">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C63637]">{t('admin.overview')}</p>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mt-1 text-start">{t('admin.controlRoom')}</h1>
          <p className="text-gray-500 mt-2 max-w-xl text-start">{t('admin.controlHint')}</p>
        </div>
        <Link to="/admin/products/new" className="admin-primary justify-center">
          <FiPlus /> {t('admin.addProduct')}
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.key}
              to={card.to}
              className="admin-card hover:border-[#C63637]/40 hover:-translate-y-0.5 transition-all p-4 sm:p-5"
            >
              <Icon className="text-[#C63637] mb-3" size={20} />
              <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">{stats?.[card.key] ?? '—'}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">{card.label}</p>
            </Link>
          );
        })}
      </div>

      <section className="admin-card">
        <div className="flex items-center justify-between mb-6 gap-3">
          <h2 className="text-lg sm:text-xl font-bold">{t('admin.latestItems')}</h2>
          <Link to="/admin/products" className="text-sm font-semibold text-[#C63637]">
            {t('admin.manageAll')}
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/admin/products/${product.id}`}
              className="flex gap-4 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <img src={mediaUrl(product.image)} alt={product.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-gray-100" />
              <div className="min-w-0">
                <p className="font-bold truncate">{product.name}</p>
                <p className="text-sm text-gray-500">{product.category?.name}</p>
                <p className="text-sm text-[#C63637] mt-1">{formatPrice(product)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
