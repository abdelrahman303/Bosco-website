import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowUpRight } from 'react-icons/fi';
import SafeImage from '../../components/SafeImage';
import { categoryService } from '../../services/categoryService';
import { CategoryIcon, bentoSpan } from '../../utils/icons';
import { localized } from '../../utils/localize';

gsap.registerPlugin(ScrollTrigger);

export default function CategoriesSection() {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    categoryService.list().then(setCategories).catch(() => setCategories([]));
  }, []);

  useLayoutEffect(() => {
    if (!categories.length || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.domains-head > *',
        { y: 40 },
        {
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
        }
      );

      const cards = gsap.utils.toArray('.cat-card');
      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { y: 90, rotateX: 14, scale: 0.94 },
          {
            y: 0,
            rotateX: 0,
            scale: 1,
            duration: 1.05,
            delay: index * 0.08,
            ease: 'expo.out',
            scrollTrigger: { trigger: card, start: 'top 88%', once: true },
          }
        );

        const media = card.querySelector('.cat-media');
        if (media) {
          gsap.fromTo(
            media,
            { yPercent: -10, scale: 1.12 },
            {
              yPercent: 10,
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.1,
              },
            }
          );
        }
      });

      gsap.to('.domains-ticker-track', {
        xPercent: -50,
        duration: 28,
        repeat: -1,
        ease: 'none',
      });
    }, sectionRef);

    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(refresh);
      ctx.revert();
    };
  }, [categories]);

  const tickerFallback = t('site.domains.ticker', { returnObjects: true });
  const ticker = categories.length
    ? [...categories, ...categories].map((cat) => localized(cat, 'name', i18n.language))
    : Array.isArray(tickerFallback) ? tickerFallback : [];

  return (
    <section
      ref={sectionRef}
      className="relative z-10 py-10 sm:py-20 lg:py-32 bg-[#f4f1ea] dark:bg-[#080808] overflow-hidden [perspective:1200px]"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 end-0 w-[42vw] h-[42vw] bg-[#C63637]/12 blur-[130px] rounded-full" />
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="domains-head flex flex-col md:flex-row justify-between items-center md:items-end mb-6 sm:mb-10 gap-3 sm:gap-6 text-center md:text-start">
          <div className="max-w-2xl w-full md:w-auto flex flex-col items-center md:items-start">
            <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 shadow-sm mb-3 sm:mb-6">
              <span className="w-2 h-2 rounded-full bg-[#C63637] animate-pulse" />
              <span className="text-gray-600 dark:text-gray-300 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">
                {t('site.domains.kicker')}
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter">
              {t('site.domains.title')} <span className="text-[#C63637]">{t('site.domains.titleAccent')}</span>
            </h2>
          </div>
          <Link
            to="/categories"
            className="btn-pump group inline-flex items-center gap-2 bg-[#C63637] text-white px-4 py-2 rounded-full font-bold uppercase tracking-widest text-[11px] sm:text-sm hover:bg-red-700"
          >
            {t('site.domains.viewAll')}
            <FiArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>
      </div>

      <div className="relative mb-6 sm:mb-12 overflow-hidden border-y border-black/5 dark:border-white/10 py-2 sm:py-3">
        <div className="domains-ticker-track flex w-max gap-6 sm:gap-10 whitespace-nowrap mx-auto">
          {ticker.map((name, index) => (
            <span key={`${name}-${index}`} className="text-[11px] sm:text-sm font-black uppercase tracking-[0.22em] sm:tracking-[0.28em] text-gray-400">
              {name} <span className="text-[#C63637] mx-2 sm:mx-4">●</span>
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="bento-grid grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 auto-rows-[158px] sm:auto-rows-[240px] md:auto-rows-[300px]">
          {categories.map((cat, index) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.slug}`}
              className={`cat-card group relative overflow-hidden rounded-[16px] sm:rounded-[28px] bg-[#111] border border-white/10 hover:border-[#C63637]/60 shadow-lg hover:shadow-[0_24px_60px_-28px_rgba(198,54,55,0.45)] transition-colors duration-500 flex flex-col justify-end p-3 sm:p-7 ${bentoSpan(index, categories.length)}`}
            >
              <div className="absolute inset-0 overflow-hidden">
                <SafeImage
                  src={cat.image}
                  alt={localized(cat, 'name', i18n.language)}
                  width={1100}
                  className="cat-media w-full h-full object-cover opacity-70 group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/15" />
              </div>

              <div className="relative z-10 flex flex-col h-full justify-between text-white">
                <div className="flex justify-between items-start">
                  <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-base sm:text-2xl group-hover:bg-[#C63637] group-hover:border-[#C63637] transition-colors">
                    <span className="sm:hidden"><CategoryIcon name={cat.icon} size={15} /></span>
                    <span className="hidden sm:inline"><CategoryIcon name={cat.icon} /></span>
                  </div>
                  <span className="text-white/30 font-black text-lg sm:text-3xl leading-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <div>
                  <div className="flex items-end justify-between gap-2 sm:gap-3">
                    <h3 className="text-sm sm:text-2xl md:text-3xl font-black tracking-tight leading-tight line-clamp-2">{localized(cat, 'name', i18n.language)}</h3>
                    <span className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-[#C63637] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <FiArrowUpRight size={14} className="rtl:rotate-180" />
                    </span>
                  </div>
                  <p className="hidden sm:block text-white/75 text-sm mt-2 line-clamp-2 max-w-md">{localized(cat, 'description', i18n.language)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
