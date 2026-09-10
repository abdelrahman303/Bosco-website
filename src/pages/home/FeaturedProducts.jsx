import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowUpRight } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

const stackMeta = [
  { id: '01', stat: '12,000', href: '/products', image: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=1600&auto=format&fit=crop' },
  { id: '02', stat: '250+', href: '/products', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop' },
  { id: '03', stat: '99.9%', href: '/categories', image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=1600&auto=format&fit=crop' },
  { id: '04', stat: '24/7', href: '/contact', image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1600&auto=format&fit=crop' },
];

export default function SolutionsSection() {
  const { t } = useTranslation();
  const copy = t('site.layers.items', { returnObjects: true }) || [];
  const stackCards = stackMeta.map((item, index) => ({ ...item, ...(copy[index] || {}) }));
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.bosco-stack-head > *',
        { y: 40 },
        {
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
            once: true,
          },
        }
      );

      // Sticky scrub stacks are heavy on mobile GPUs — keep static cards there.
      if (isMobile || reduceMotion) return;

      const cards = gsap.utils.toArray('.bosco-stack-card');
      cards.forEach((card, index) => {
        const inner = card.querySelector('.bosco-stack-inner');
        const dim = card.querySelector('.bosco-stack-dim');
        const next = cards[index + 1];
        if (!inner || !next) return;

        const scrub = {
          trigger: next,
          start: 'top bottom',
          end: 'top 18%',
          scrub: 0.6,
        };

        gsap.to(inner, {
          scale: 0.9,
          y: 20,
          ease: 'none',
          scrollTrigger: scrub,
        });

        if (dim) {
          gsap.to(dim, {
            opacity: 0.42,
            ease: 'none',
            scrollTrigger: { ...scrub },
          });
        }
      });
    }, sectionRef);

    const refresh = () => ScrollTrigger.refresh();
    const id = requestAnimationFrame(refresh);
    window.addEventListener('load', refresh);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('load', refresh);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 bg-[#f4f1ea] dark:bg-[#111111] py-16 sm:py-24 lg:py-32"
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="bosco-stack-head max-w-3xl mb-10 sm:mb-14 lg:mb-20">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#C63637] mb-4">
            {t('site.layers.kicker')}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white">
            {t('site.layers.title')}
          </h2>
          <p className="mt-5 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            {t('site.layers.subtitle')}
          </p>
        </div>

        <div className="relative pb-8">
          {stackCards.map((card, index) => (
            <article
              key={card.id}
              className="bosco-stack-card relative mb-6 last:mb-0 md:sticky md:top-24"
              style={{ zIndex: index + 1 }}
            >
              <div className={`bosco-stack-inner relative h-[min(72vh,700px)] min-h-[420px] sm:min-h-[480px] rounded-[1.6rem] sm:rounded-[2rem] lg:rounded-[2.6rem] overflow-hidden border border-white/10 shadow-[0_24px_50px_-28px_rgba(0,0,0,0.4)] origin-center bg-[#2a2a2a] md:will-change-transform`}>
                <img
                  src={card.image.replace(/w=\d+/, 'w=1100')}
                  alt={card.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <div className="bosco-stack-dim pointer-events-none absolute inset-0 bg-black opacity-0" />

                <div className="relative z-10 h-full flex flex-col justify-between p-5 sm:p-10 lg:p-14">
                  <div className="flex items-center justify-between gap-4">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold uppercase tracking-[0.22em] text-white">
                      {card.kicker}
                    </span>
                    <span className="text-5xl sm:text-7xl font-black text-white/15 leading-none">
                      {card.id}
                    </span>
                  </div>

                  <div className="grid lg:grid-cols-12 gap-8 items-end">
                    <div className="lg:col-span-8 max-w-3xl">
                      <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.08]">
                        {card.title}
                      </h3>
                      <p className="mt-5 text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl">
                        {card.body}
                      </p>
                      <Link
                        to={card.href}
                        className="mt-8 inline-flex items-center gap-2 bg-[#C63637] text-white px-6 py-3 rounded-full text-sm font-bold shadow-[0_10px_30px_rgba(198,54,55,0.35)] hover:bg-red-700 transition-colors"
                      >
                        {card.cta} <FiArrowUpRight />
                      </Link>
                    </div>

                    <div className="lg:col-span-4 lg:justify-self-end w-full max-w-[280px] rounded-3xl bg-black/35 backdrop-blur-xl border border-white/15 p-6">
                      <p className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                        {card.stat}
                      </p>
                      <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-gray-300">
                        {card.statLabel}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
