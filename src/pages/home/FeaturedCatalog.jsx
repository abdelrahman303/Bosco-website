import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowUpRight } from 'react-icons/fi';
import ProductCard from '../../components/cards/ProductCard';
import { productService } from '../../services/productService';

export default function FeaturedCatalog() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productService.list({ featured: 1 }).then(setProducts).catch(() => setProducts([]));
  }, []);

  if (!products.length) return null;

  return (
    <section className="py-10 sm:py-20 lg:py-24 bg-white dark:bg-[#080808]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-6 mb-6 sm:mb-12">
          <div>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#C63637] mb-2 sm:mb-3">{t('site.featured.kicker')}</p>
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-tight">
              {t('site.featured.title')} <span className="text-[#C63637]">{t('site.featured.titleAccent')}</span>
            </h2>
          </div>
          <Link to="/products" className="btn-pump inline-flex items-center gap-2 bg-[#C63637] text-white px-4 py-2 rounded-full font-bold uppercase tracking-widest text-xs sm:text-sm">
            {t('site.featured.viewAll')} <FiArrowUpRight />
          </Link>
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
