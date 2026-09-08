import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { FiArrowUpRight } from 'react-icons/fi';
import { categoryService } from '../../services/categoryService';
import { CategoryIcon, bentoSpan } from '../../utils/icons';
import { mediaUrl } from '../../utils/media';

export default function Categories() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    categoryService.list().then(setCategories).catch((err) => setError(err.message));
  }, []);

  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-24 bg-[var(--bg)] min-h-screen">
      <Helmet>
        <title>{t('site.categoriesPage.titleDoc')} | Bosco</title>
      </Helmet>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="max-w-3xl mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#C63637] mb-3">{t('site.categoriesPage.kicker')}</p>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white">
            {t('site.categoriesPage.title')}
          </h1>
          <p className="text-gray-500 mt-4 text-lg">
            {t('site.categoriesPage.lead')}
          </p>
        </div>

        {error && <p className="text-red-500 mb-6">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 auto-rows-[220px] sm:auto-rows-[280px]">
          {categories.map((cat, index) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.slug}`}
              className={`group relative overflow-hidden rounded-[28px] bg-[#0F0F0F] border border-white/10 p-8 flex flex-col justify-end ${bentoSpan(index, categories.length)}`}
            >
              <img src={mediaUrl(cat.image)} alt={cat.name} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur text-white flex items-center justify-center mb-4">
                  <CategoryIcon name={cat.icon} />
                </div>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-black text-white">{cat.name}</h2>
                    <p className="text-gray-300 mt-2 line-clamp-2">{cat.description}</p>
                    <p className="text-white/70 text-sm mt-3">
                      {t('site.categoriesPage.productsSubs', {
                        products: cat.product_count || 0,
                        subs: cat.subcategory_count || 0,
                      })}
                    </p>
                  </div>
                  <FiArrowUpRight className="text-white text-2xl" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
