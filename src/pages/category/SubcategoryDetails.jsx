import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import ProductCard from '../../components/cards/ProductCard';
import { categoryService } from '../../services/categoryService';
import { productService } from '../../services/productService';
import { mediaUrl } from '../../utils/media';
import { localized } from '../../utils/localize';

export default function SubcategoryDetails() {
  const { t, i18n } = useTranslation();
  const { slug, subSlug } = useParams();
  const [category, setCategory] = useState(null);
  const [subcategory, setSubcategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    categoryService
      .get(slug)
      .then((data) => {
        if (cancelled) return null;
        setCategory(data);
        const match = (data.subcategories || []).find(
          (sub) => sub.slug === subSlug || String(sub.id) === String(subSlug)
        );
        if (!match) {
          throw new Error(t('site.subcategoryDetails.notFound'));
        }
        setSubcategory(match);
        return productService.list({ subcategoryId: match.id, categoryId: data.id });
      })
      .then((list) => {
        if (!cancelled && list) setProducts(list);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || t('site.subcategoryDetails.notFound'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug, subSlug, t]);

  const categoryName = localized(category, 'name', i18n.language);
  const subName = localized(subcategory, 'name', i18n.language);
  const subDescription = localized(subcategory, 'description', i18n.language);

  if (error) {
    return (
      <div className="pt-40 pb-24 text-center space-y-4">
        <p className="text-red-500">{error}</p>
        <Link to={slug ? `/categories/${slug}` : '/categories'} className="text-[#C63637] font-bold">
          {t('site.subcategoryDetails.backCategory')}
        </Link>
      </div>
    );
  }

  if (loading || !category || !subcategory) {
    return <div className="pt-40 pb-24 text-center text-gray-500">{t('site.subcategoryDetails.loading')}</div>;
  }

  return (
    <div className="bg-[var(--bg)] min-h-screen">
      <Helmet>
        <title>
          {subName} · {categoryName} | Bosco International Trade
        </title>
      </Helmet>

      <section className="relative min-h-[44vh] flex items-end">
        <img
          src={mediaUrl(subcategory.image || category.image)}
          alt={subName}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/25" />
        <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 pb-10 sm:pb-16 pt-28 sm:pt-36 w-full">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-white/70 mb-5">
            <Link to="/categories" className="hover:text-white">
              {t('site.common.categories')}
            </Link>
            <span>/</span>
            <Link to={`/categories/${category.slug}`} className="hover:text-white">
              {categoryName}
            </Link>
            <span>/</span>
            <span className="text-white font-semibold">{subName}</span>
          </nav>
          <p className="text-[#C63637] text-xs font-bold uppercase tracking-[0.25em] mb-3">
            {t('site.common.subcategory')}
          </p>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">{subName}</h1>
          <p className="text-gray-300 text-lg max-w-2xl mt-4">{subDescription}</p>
          <p className="text-white/70 text-sm mt-4 font-semibold">
            {t('site.subcategoryDetails.productCount', { count: products.length })}
          </p>
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#C63637]">
              {t('site.subcategoryDetails.productsKicker')}
            </p>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mt-2">
              {t('site.subcategoryDetails.productsTitle')}
            </h2>
            <p className="text-gray-500 mt-2 max-w-xl">{t('site.subcategoryDetails.productsLead')}</p>
          </div>
          <Link
            to={`/categories/${category.slug}`}
            className="text-sm font-bold text-[#C63637] hover:underline"
          >
            {t('site.subcategoryDetails.backCategory')}
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-gray-300 dark:border-white/10 py-16 text-center">
            <p className="text-xl font-black">{t('site.subcategoryDetails.empty')}</p>
            <p className="text-gray-500 mt-2">{t('site.categoryDetails.emptyHint')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
