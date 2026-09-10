import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FiArrowRight,
  FiArrowUpRight,
  FiBox,
  FiCheck,
  FiDroplet,
  FiLayers,
  FiSettings,
  FiShield,
} from 'react-icons/fi';
import SafeImage from '../../components/SafeImage';
import { categoryService } from '../../services/categoryService';
import { CategoryIcon } from '../../utils/icons';
import { localized } from '../../utils/localize';
import { mediaUrl } from '../../utils/media';

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  {
    id: 'machinery',
    icon: FiSettings,
    image:
      'https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=1600&auto=format&fit=crop',
    categorySlugs: ['packaging-machines', 'filling-lines', 'spare-parts'],
    fallbackHref: '/categories',
  },
  {
    id: 'materials',
    icon: FiLayers,
    image:
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=1600&auto=format&fit=crop',
    categorySlugs: ['raw-materials'],
    fallbackHref: '/categories',
  },
];

const SERVED = [
  { id: 'food', icon: FiDroplet },
  { id: 'pharma', icon: FiShield },
];

export default function IndustriesSection() {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryService.list().then(setCategories).catch(() => setCategories([]));
  }, []);

  const pillars = useMemo(
    () =>
      PILLARS.map((pillar) => {
        const copy = t(`site.industries.pillars.${pillar.id}`, { returnObjects: true }) || {};
        const linked = pillar.categorySlugs
          .map((slug) => categories.find((cat) => cat.slug === slug))
          .filter(Boolean);
        return {
          ...pillar,
          ...copy,
          categories: linked,
          features: Array.isArray(copy.features) ? copy.features : [],
        };
      }),
    [categories, t, i18n.language]
  );

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.industries-head > *',
        { y: 28, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.85,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
        }
      );

      gsap.fromTo(
        '.industry-pillar',
        { y: 56, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.95,
          stagger: 0.12,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.industry-pillars', start: 'top 84%', once: true },
        }
      );

      gsap.fromTo(
        '.industry-cat',
        { y: 18, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.6,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.industry-pillars', start: 'top 70%', once: true },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [pillars]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 py-16 sm:py-24 lg:py-28 overflow-hidden bg-[var(--bg)]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C63637]/40 to-transparent" />
        <div className="absolute -top-32 start-1/2 -translate-x-1/2 w-[70vw] h-[40vw] rounded-full bg-[#C63637]/8 blur-[120px]" />
      </div>

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="industries-head grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-10 sm:mb-14">
          <div className="lg:col-span-7 text-start">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#C63637] mb-4">
              {t('site.industries.kicker')}
            </p>
            <h2 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight text-gray-900 dark:text-white leading-[1.05]">
              {t('site.industries.title')}
            </h2>
            <p className="mt-5 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
              {t('site.industries.subtitle')}
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
            <div className="flex flex-wrap gap-2">
              {SERVED.map((item) => {
                const Icon = item.icon;
                return (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2 text-sm font-bold text-gray-800 dark:text-gray-100"
                  >
                    <Icon className="text-[#C63637]" size={15} />
                    {t(`site.industries.served.${item.id}`)}
                  </span>
                );
              })}
            </div>
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#C63637] hover:underline"
            >
              {t('site.industries.viewAllCategories')}
              <FiArrowUpRight />
            </Link>
          </div>
        </div>

        <div className="industry-pillars grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <article
                key={pillar.id}
                className="industry-pillar group relative overflow-hidden rounded-[28px] border border-gray-200 dark:border-white/10 bg-[#0e0e0e] text-white min-h-[640px] flex flex-col"
              >
                <div className="absolute inset-0">
                  <SafeImage
                    src={pillar.image}
                    alt=""
                    width={1600}
                    className="h-full w-full object-cover opacity-40 group-hover:scale-[1.04] transition-transform duration-[900ms]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/35" />
                  <div
                    className={`absolute inset-0 ${
                      index === 0
                        ? 'bg-gradient-to-br from-[#C63637]/35 via-transparent to-transparent'
                        : 'bg-gradient-to-br from-transparent via-transparent to-[#C63637]/30'
                    }`}
                  />
                </div>

                <div className="relative z-10 flex flex-col h-full p-6 sm:p-8 lg:p-9">
                  <div className="flex items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 backdrop-blur px-3 py-2">
                      <Icon className="text-white" size={18} />
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">
                        {pillar.badge}
                      </span>
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ff8f8f]">
                      {pillar.kicker}
                    </span>
                  </div>

                  <div className="mt-7 max-w-xl">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-[1.1]">
                      {pillar.title}
                    </h3>
                    <p className="mt-4 text-white/75 text-sm sm:text-base leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {pillar.features.slice(0, 6).map((feature) => (
                      <div
                        key={feature}
                        className="flex items-start gap-2.5 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm px-3.5 py-3"
                      >
                        <span className="mt-0.5 w-5 h-5 rounded-full bg-[#C63637] text-white flex items-center justify-center shrink-0">
                          <FiCheck size={11} />
                        </span>
                        <span className="text-[13px] font-semibold leading-snug text-white/90">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex-1">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/55">
                        {t('site.industries.openCategories')}
                      </p>
                      <Link
                        to={pillar.fallbackHref}
                        className="text-xs font-bold text-[#ff8f8f] hover:text-white transition-colors"
                      >
                        {t('site.industries.viewAllCategories')}
                      </Link>
                    </div>

                    {pillar.categories.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {pillar.categories.map((cat) => {
                          const name = localized(cat, 'name', i18n.language);
                          return (
                            <Link
                              key={cat.id}
                              to={`/categories/${cat.slug}`}
                              className="industry-cat group/cat relative overflow-hidden rounded-2xl border border-white/12 bg-white/5 hover:bg-white/10 hover:border-[#C63637]/50 transition-all min-h-[96px]"
                            >
                              <SafeImage
                                src={mediaUrl(cat.image)}
                                alt=""
                                width={640}
                                className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover/cat:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
                              <div className="relative z-10 h-full flex items-center justify-between gap-3 p-4">
                                <div className="min-w-0 flex items-center gap-3">
                                  <span className="w-10 h-10 rounded-xl bg-black/40 border border-white/15 flex items-center justify-center shrink-0">
                                    <CategoryIcon name={cat.icon} size={16} />
                                  </span>
                                  <div className="min-w-0">
                                    <p className="font-black text-sm sm:text-base truncate">{name}</p>
                                    <p className="text-[11px] text-white/65 mt-0.5">
                                      {t('site.categoriesPage.productsSubs', {
                                        products: cat.product_count || 0,
                                        subs: cat.subcategory_count || 0,
                                      })}
                                    </p>
                                  </div>
                                </div>
                                <FiArrowRight className="shrink-0 text-white/70 group-hover/cat:text-white rtl:rotate-180 transition-colors" />
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    ) : (
                      <Link
                        to={pillar.fallbackHref}
                        className="industry-cat flex items-center justify-between rounded-2xl border border-dashed border-white/20 px-4 py-5 text-sm font-bold hover:border-white/40 transition-colors"
                      >
                        <span className="inline-flex items-center gap-2">
                          <FiBox /> {t('site.industries.browseCatalog')}
                        </span>
                        <FiArrowRight className="rtl:rotate-180" />
                      </Link>
                    )}
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <Link
                      to={pillar.categories[0] ? `/categories/${pillar.categories[0].slug}` : pillar.fallbackHref}
                      className="btn-pump inline-flex items-center justify-center gap-2 rounded-full bg-[#C63637] px-6 py-3.5 text-sm font-bold"
                    >
                      {pillar.cta}
                      <FiArrowRight className="rtl:rotate-180" />
                    </Link>
                    <Link
                      to="/quote"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold hover:bg-white/10 transition-colors"
                    >
                      {t('site.industries.requestQuote')}
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 sm:mt-12 rounded-[28px] border border-gray-200 dark:border-white/10 bg-white dark:bg-[#121212] p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            <div className="lg:col-span-7 text-start">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#C63637] mb-3">
                {t('site.industries.owner.kicker')}
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                {t('site.industries.owner.title')}
              </h3>
              <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
                {t('site.industries.owner.body')}
              </p>
            </div>
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
              {(t('site.industries.owner.points', { returnObjects: true }) || []).map((point) => (
                <div
                  key={point}
                  className="flex items-start gap-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-3"
                >
                  <FiCheck className="text-[#C63637] mt-0.5 shrink-0" />
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
