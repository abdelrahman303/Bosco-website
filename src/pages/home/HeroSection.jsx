import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi';
import { logoForLanguage } from '../../utils/logo';

const SLIDE_IMAGES = [
  'https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=2400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=2400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2400&auto=format&fit=crop',
];

export default function HeroSection() {
  const { t, i18n } = useTranslation();
  const [current, setCurrent] = useState(0);
  const texts = t('site.hero.slides', { returnObjects: true }) || [];
  const slides = SLIDE_IMAGES.map((img, index) => ({
    img,
    ...(texts[index] || {}),
  }));

  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const progressRef = useRef(null);
  const currentRef = useRef(0);
  const fadingRef = useRef(false);
  const logoSrc = logoForLanguage(i18n.language);

  const goToSlide = (index) => {
    const next = ((index % slides.length) + slides.length) % slides.length;
    if (next === currentRef.current || fadingRef.current) return;
    fadingRef.current = true;

    const copy = contentRef.current?.querySelectorAll('.hero-copy > *');
    gsap.to(copy || [], {
      y: 18,
      autoAlpha: 0,
      duration: 0.35,
      stagger: 0.03,
      ease: 'power2.in',
      overwrite: true,
      onComplete: () => setCurrent(next),
    });
  };

  useEffect(() => {
    currentRef.current = current;
    const copy = contentRef.current?.querySelectorAll('.hero-copy > *');
    gsap.fromTo(
      copy || [],
      { y: 28, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.7,
        stagger: 0.07,
        ease: 'power3.out',
        overwrite: true,
        onComplete: () => {
          fadingRef.current = false;
        },
      }
    );

    if (progressRef.current) {
      gsap.killTweensOf(progressRef.current);
      gsap.fromTo(
        progressRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 7, ease: 'none', transformOrigin: 'left center' }
      );
    }
  }, [current]);

  useEffect(() => {
    const timer = setInterval(() => goToSlide(currentRef.current + 1), 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-brand',
        { y: 24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out', delay: 0.15 }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const media = sectionRef.current?.querySelector('.hero-media-active');
    if (!media) return;
    gsap.fromTo(media, { scale: 1.1 }, { scale: 1, duration: 7.5, ease: 'sine.out' });
  }, [current]);

  const slide = slides[current] || {};

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden bg-[#050505] text-white"
    >
      {/* Full-bleed media plane */}
      <div className="absolute inset-0">
        {slides.map((item, index) => (
          <div
            key={item.img}
            className={`absolute inset-0 transition-opacity duration-[1100ms] ease-out ${
              index === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={item.img}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover will-change-transform ${
                index === current ? 'hero-media-active' : ''
              }`}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              decoding="async"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/78 to-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/45" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050505] to-transparent" />
        <div className="pointer-events-none absolute -top-24 start-1/4 w-[42vw] h-[42vw] rounded-full bg-[#C63637]/20 blur-[140px]" />
      </div>

      <div className="relative z-10 min-h-[100svh] flex flex-col justify-end pt-28 sm:pt-32 pb-10 sm:pb-14">
        <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-12">
          <div ref={contentRef} className="max-w-4xl">
            <div className="hero-copy space-y-5 sm:space-y-6">
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.32em] text-[#ff8f8f]">
                {t('site.hero.badge')}
              </p>

              <h1 className="text-[2.6rem] sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-[-0.04em] leading-[0.92]">
                <span className="block text-white">{slide.title1}</span>
                <span className="block text-white/95">
                  {slide.title2}{' '}
                  <span className="text-[#C63637]">{slide.title3}</span>
                </span>
              </h1>

              <p className="text-base sm:text-xl text-white/70 max-w-2xl leading-relaxed">
                {slide.desc}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                <Link
                  to="/categories"
                  className="btn-pump group inline-flex items-center justify-center gap-3 rounded-full bg-[#C63637] px-7 py-3.5 sm:py-4 text-sm sm:text-base font-bold"
                >
                  {t('site.hero.explore')}
                  <span className="inline-flex w-9 h-9 items-center justify-center rounded-full bg-black/20 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform">
                    <FiArrowRight className="rtl:rotate-180" />
                  </span>
                </Link>
                <Link
                  to="/quote"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 backdrop-blur-md px-7 py-3.5 sm:py-4 text-sm sm:text-base font-bold hover:bg-white/10 hover:border-white/40 transition-colors"
                >
                  {t('site.hero.learnMore')}
                  <FiArrowUpRight />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="flex items-center gap-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goToSlide(index)}
                  aria-label={`Slide ${index + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    index === current
                      ? 'w-10 sm:w-14 bg-[#C63637]'
                      : 'w-3 bg-white/25 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

            <div className="sm:text-end max-w-sm">
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.28em] text-white/40 mb-2">
                {t('site.hero.trusted')}
              </p>
              <p className="text-sm text-white/65 leading-relaxed">{t('site.hero.live')}</p>
            </div>
          </div>

          <div className="mt-6 h-[2px] w-full max-w-md rounded-full bg-white/10 overflow-hidden">
            <div
              ref={progressRef}
              className="h-full w-full origin-left bg-[#C63637] scale-x-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
