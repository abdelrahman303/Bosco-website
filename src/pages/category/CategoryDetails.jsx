import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { FiArrowRight, FiLayers } from 'react-icons/fi';
import { categoryService } from '../../services/categoryService';
import { mediaUrl } from '../../utils/media';
import { localized } from '../../utils/localize';

export default function CategoryDetails() {
  const { t, i18n } = useTranslation();
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    categoryService
      .get(slug)
      .then(setCategory)
      .catch((err) => setError(err.message));
  }, [slug]);

  const categoryName = localized(category, 'name', i18n.language);
  const categoryDescription = localized(category, 'description', i18n.language);
  const subs = category?.subcategories || [];

  if (error) {
    return <div className="pt-40 pb-24 text-center text-red-500">{error}</div>;
  }

  if (!category) {
    return <div className="pt-40 pb-24 text-center text-gray-500">{t('site.categoryDetails.loading')}</div>;
  }

  return (
    <div className="bg-[var(--bg)] min-h-screen">
      <Helmet>
        <title>{categoryName} | Bosco International Trade</title>
      </Helmet>

      <section className="relative min-h-[48vh] flex items-end">
        <img src={mediaUrl(category.image)} alt={categoryName} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/25" />
        <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 pb-10 sm:pb-16 pt-28 sm:pt-36 w-full">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-white/70 mb-5">
            <Link to="/categories" className="hover:text-white">
              {t('site.common.categories')}
            </Link>
            <span>/</span>
            <span className="text-white font-semibold">{categoryName}</span>
          </nav>
          <p className="text-[#C63637] text-xs font-bold uppercase tracking-[0.25em] mb-3">
            {t('site.common.category')}
          </p>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white tracking-tight">{categoryName}</h1>
          <p className="text-gray-300 text-lg max-w-2xl mt-4">{categoryDescription}</p>
          <p className="text-white/70 text-sm mt-4 font-semibold">
            {t('site.categoryDetails.subCount', { count: subs.length })}
          </p>
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#C63637]">
              {t('site.categoryDetails.subsKicker')}
            </p>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mt-2">
              {t('site.categoryDetails.subsTitle')}
            </h2>
            <p className="text-gray-500 mt-2 max-w-xl">{t('site.categoryDetails.subsLead')}</p>
          </div>
        </div>

        {subs.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-gray-300 dark:border-white/10 py-16 text-center">
            <FiLayers className="mx-auto text-3xl text-gray-400 mb-3" />
            <p className="text-xl font-black">{t('site.categoryDetails.emptySubs')}</p>
            <p className="text-gray-500 mt-2">{t('site.categoryDetails.emptyHint')}</p>
            <div className="mt-4">
              <Link to="/admin/login" className="text-[#C63637] font-bold">
                {t('site.categoryDetails.goAdmin')}
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
            {subs.map((sub) => {
              const subName = localized(sub, 'name', i18n.language);
              const subDescription = localized(sub, 'description', i18n.language);
              return (
                <Link
                  key={sub.id}
                  to={`/categories/${category.slug}/${sub.slug}`}
                  className="group rounded-[28px] overflow-hidden bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className="relative h-48 bg-[#111]">
                    <img
                      src={mediaUrl(sub.image)}
                      alt={subName}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <span className="absolute bottom-3 start-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
                      {t('site.common.subcategory')}
                    </span>
                  </div>
                  <div className="p-5 sm:p-6 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-xl font-black text-gray-900 dark:text-white">{subName}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{subDescription}</p>
                      {typeof sub.product_count === 'number' && (
                        <p className="text-xs font-bold text-gray-400 mt-3">
                          {t('site.categoryDetails.productCount', { count: sub.product_count })}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 w-10 h-10 rounded-full bg-[#C63637]/10 text-[#C63637] flex items-center justify-center group-hover:bg-[#C63637] group-hover:text-white transition-colors">
                      <FiArrowRight className="rtl:rotate-180" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
