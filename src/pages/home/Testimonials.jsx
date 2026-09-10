import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaQuoteLeft } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

function ReviewCard({ review, featured = false }) {
  return (
    <article
      className={`relative shrink-0 rounded-[28px] border p-7 ${
        featured
          ? 'bg-[#141414] border-[#C63637]/40 w-full'
          : 'bg-white/5 border-white/10 w-[320px] sm:w-[380px]'
      }`}
    >
      <FaQuoteLeft className="text-3xl text-[#C63637] mb-5" />
      <p className={`text-white/85 leading-relaxed ${featured ? 'text-xl sm:text-2xl font-medium' : 'text-sm'}`}>
        “{review.text}”
      </p>
      <div className="flex items-center gap-3 mt-6">
        <div className="relative">
          <span className="absolute inset-0 rounded-full bg-[#C63637]/50 animate-ping" />
          <div className="relative w-12 h-12 rounded-full bg-[#C63637] text-white font-black flex items-center justify-center">
            {review.name.charAt(0)}
          </div>
        </div>
        <div>
          <p className="font-black text-white">{review.name}</p>
          <p className="text-sm text-[#C63637] font-semibold">{review.company}</p>
          <p className="text-[11px] uppercase tracking-widest text-white/40">{review.role}</p>
        </div>
      </div>
    </article>
  );
}

export default function Testimonials() {
  const { t } = useTranslation();
  const reviewsRaw = t('site.success.reviews', { returnObjects: true });
  const reviews = (Array.isArray(reviewsRaw) ? reviewsRaw : []).map((item, index) => ({
    ...item,
    id: index + 1,
  }));
  const sectionRef = useRef(null);
  const rowA = useRef(null);
  const rowB = useRef(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.success-head > *',
        { y: 30 },
        {
          y: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
        }
      );

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isMobile = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;

      // Infinite marquees + pulsing blur glow are costly on phones.
      if (!reduceMotion && !isMobile) {
        if (rowA.current) {
          gsap.to(rowA.current, { xPercent: -50, duration: 32, repeat: -1, ease: 'none' });
        }
        if (rowB.current) {
          gsap.fromTo(rowB.current, { xPercent: -50 }, { xPercent: 0, duration: 36, repeat: -1, ease: 'none' });
        }
        gsap.to('.success-glow', {
          scale: 1.12,
          opacity: 0.85,
          duration: 2.2,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % reviews.length);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  useLayoutEffect(() => {
    gsap.fromTo(
      '.success-feature',
      { y: 18 },
      { y: 0, duration: 0.5, ease: 'power2.out', overwrite: true }
    );
  }, [active]);

  const loop = [...reviews, ...reviews];

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-14 sm:py-20 lg:py-32 bg-[#080808] text-white">
      <div className="success-glow absolute top-1/3 left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-[#C63637]/20 blur-3xl md:blur-[140px] rounded-full pointer-events-none hidden sm:block" />

      <div className="success-head relative z-10 max-w-[1100px] mx-auto px-4 text-center mb-12">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#C63637] mb-4">{t('site.success.kicker')}</p>
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight">
          {t('site.success.title')}
        </h2>
        <p className="text-gray-400 mt-4 text-lg">
          {t('site.success.subtitle')}
        </p>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 mb-14">
        <div key={reviews[active].id} className="success-feature">
          <ReviewCard review={reviews[active]} featured />
        </div>
        <div className="flex justify-center gap-2 mt-6">
          {reviews.map((review, index) => (
            <button
              key={review.id}
              type="button"
              onClick={() => setActive(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === active ? 'w-8 bg-[#C63637]' : 'w-2.5 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Show review from ${review.name}`}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 overflow-hidden mb-5 hidden md:block">
        <div ref={rowA} className="flex w-max gap-5 px-4">
          {loop.map((review, index) => (
            <ReviewCard key={`a-${review.id}-${index}`} review={review} />
          ))}
        </div>
      </div>
      <div className="relative z-10 overflow-hidden hidden md:block">
        <div ref={rowB} className="flex w-max gap-5 px-4">
          {loop.map((review, index) => (
            <ReviewCard key={`b-${review.id}-${index}`} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
