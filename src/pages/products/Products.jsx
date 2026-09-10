import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiSearch, FiX } from 'react-icons/fi';
import ProductCard from '../../components/cards/ProductCard';
import SafeImage from '../../components/SafeImage';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { categoryService } from '../../services/categoryService';
import { productService } from '../../services/productService';
import { CategoryIcon } from '../../utils/icons';
import { localized } from '../../utils/localize';

gsap.registerPlugin(ScrollTrigger);

export default function Products() {
  const { t, i18n } = useTranslation();
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(params.get('q') || '');

  const q = params.get('q') || '';

  const pageRef = useRef(null);
  const catsRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    categoryService
      .list()
      .then((cats) => setCategories(cats || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    productService
      .list({ q: q || undefined })
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [q]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search === q) return;
      const next = new URLSearchParams(params);
      if (search) next.set('q', search);
      else next.delete('q');
      setParams(next);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, q]);

  const grouped = useMemo(() => {
    const groups = [];
    const seen = new Map();
    products.forEach((product) => {
      const key = product.category?.id || 'other';
      if (!seen.has(key)) {
        const entry = { id: key, category: product.category, items: [] };
        seen.set(key, entry);
        groups.push(entry);
      }
      seen.get(key).items.push(product);
    });
    return groups;
  }, [products]);

  const clearSearch = () => {
    setSearch('');
    setParams(new URLSearchParams());
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.catalog-hero > *',
        { y: 28, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out', overwrite: true }
      );
    }, pageRef);
    return () => ctx.revert();
  }, []);

  useScrollReveal(catsRef, '.catalog-cat', [categories.length]);
  useScrollReveal(gridRef, '.catalog-product, .catalog-group-head', [products, loading, q]);

  return (
    <div ref={pageRef} className="bg-[var(--bg)] min-h-screen pb-16 sm:pb-24">
      <Helmet>
        <title>{t('site.productsPage.titleDoc')} | Bosco</title>
      </Helmet>

      <section className="relative overflow-hidden pt-24 sm:pt-32 pb-12 sm:pb-16 lg:pb-20">
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        <div className="absolute -top-24 start-1/4 w-[420px] h-[420px] bg-[#C63637]/20 blur-[130px] rounded-full pointer-events-none" />

        <div className="catalog-hero relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#C63637] mb-4">{t('site.productsPage.kicker')}</p>
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white max-w-4xl leading-[0.95]">
            {t('site.productsPage.title')}
          </h1>
          <p className="text-gray-300 text-lg mt-5 max-w-2xl">{t('site.productsPage.lead')}</p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/15 rounded-full px-5 w-full max-w-xl">
              <FiSearch className="text-gray-400 shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('site.productsPage.search')}
                className="w-full bg-transparent py-3.5 outline-none text-white placeholder:text-gray-500"
              />
              {search && (
                <button type="button" onClick={() => setSearch('')} className="text-gray-400 hover:text-white">
                  <FiX />
                </button>
              )}
            </div>
            <p className="text-sm font-semibold text-white">
              {loading ? t('site.productsPage.loading') : t('site.productsPage.results', { count: products.length })}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 -mt-6 relative z-20">
        <section className="rounded-[22px] sm:rounded-[32px] bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 p-4 sm:p-7 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.35)]">
          <div className="text-start mb-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#C63637]">{t('site.productsPage.categories')}</p>
            <h2 className="text-2xl font-black tracking-tight mt-1">{t('site.productsPage.pickFamily')}</h2>
            <p className="text-sm text-gray-500 mt-2">{t('site.productsPage.browseHint')}</p>
          </div>

          <div ref={catsRef} className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/categories/${cat.slug}`}
                className="catalog-cat relative overflow-hidden rounded-[20px] sm:rounded-[24px] min-h-[140px] sm:min-h-[168px] text-start p-3 sm:p-4 border border-white/10 bg-[#111] transition-transform duration-300 hover:-translate-y-1 hover:border-[#C63637]/50"
              >
                <SafeImage src={cat.image} alt="" width={640} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/35" />
                <div className="relative z-10 h-full flex flex-col justify-between text-white">
                  <span className="w-10 h-10 rounded-2xl bg-black/40 backdrop-blur flex items-center justify-center">
                    <CategoryIcon name={cat.icon} size={18} />
                  </span>
                  <div>
                    <p className="font-black text-lg leading-tight drop-shadow">{localized(cat, 'name', i18n.language)}</p>
                    <p className="text-xs text-white/80 mt-1">
                      {t('site.productsPage.catMeta', {
                        products: cat.product_count || 0,
                        subs: cat.subcategory_count || 0,
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section ref={gridRef} className="mt-8 sm:mt-14">
          <div className="text-start mb-5 sm:mb-8">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-[#C63637]">
              {t('site.productsPage.equipment')}
            </p>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight mt-1">
              {q ? t('site.productsPage.searchResults') : t('site.productsPage.allLive')}
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-[210px] sm:h-[420px] rounded-[18px] sm:rounded-[28px] bg-gray-200 dark:bg-[#1a1a1a] animate-pulse"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-gray-300 dark:border-white/10 py-20 text-center">
              <p className="text-xl font-black">{t('site.productsPage.empty')}</p>
              <p className="text-gray-500 mt-2">{t('site.productsPage.emptyHint')}</p>
              <button type="button" onClick={clearSearch} className="mt-6 admin-primary">
                {t('site.productsPage.reset')}
              </button>
            </div>
          ) : q ? (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="space-y-8 sm:space-y-16">
              {grouped.map((group) => (
                <div key={group.id}>
                  <div className="catalog-group-head flex items-end justify-between gap-4 mb-4 sm:mb-6">
                    <div className="text-start">
                      <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-[#C63637]">
                        {t('site.common.category')}
                      </p>
                      <h3 className="text-lg sm:text-2xl md:text-3xl font-black">
                        {group.category?.name || t('site.productsPage.allCatalog')}
                      </h3>
                    </div>
                    {group.category?.slug && (
                      <Link to={`/categories/${group.category.slug}`} className="text-sm font-bold text-[#C63637]">
                        {t('site.productsPage.viewFamily')}
                      </Link>
                    )}
                  </div>
                  <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                    {group.items.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
