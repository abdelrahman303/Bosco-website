import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FiArrowDown,
  FiArrowRight,
  FiArrowUpRight,
  FiAward,
  FiGlobe,
  FiShield,
  FiTarget,
  FiTrendingUp,
  FiUsers,
} from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

const STAT_META = [
  { value: 20, suffix: '+' },
  { value: 850, suffix: '+' },
  { value: 15, suffix: '' },
  { value: 1250, suffix: '+' },
];
const PILLAR_ICONS = [<FiTarget />, <FiShield />, <FiGlobe />];

function formatStat(value, suffix) {
  const formatted = new Intl.NumberFormat('en-US').format(Math.round(value));
  return `${formatted}${suffix}`;
}

export default function AboutUs() {
  const { t } = useTranslation();
  const statLabels = t('site.about.stats', { returnObjects: true }) || [];
  const stats = STAT_META.map((item, index) => ({
    ...item,
    label: Array.isArray(statLabels) ? statLabels[index] : '',
  }));
  const pillarCopy = t('site.about.pillars', { returnObjects: true }) || [];
  const pillars = (Array.isArray(pillarCopy) ? pillarCopy : []).map((item, index) => ({
    ...item,
    icon: PILLAR_ICONS[index],
  }));
  const timelineRaw = t('site.about.timeline', { returnObjects: true });
  const timeline = Array.isArray(timelineRaw) ? timelineRaw : [];
  const missionPoints = t('site.about.missionPoints', { returnObjects: true }) || [];

  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const heroBgRef = useRef(null);
  const heroMistRef = useRef(null);
  const heroGhostRef = useRef(null);
  const heroBadgeRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubRef = useRef(null);
  const heroMetaRef = useRef(null);
  const statsRef = useRef(null);
  const storyRef = useRef(null);
  const storyImgRef = useRef(null);
  const timelineRef = useRef(null);
  const lineRef = useRef(null);
  const missionRef = useRef(null);
  const ctaRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(
          [
            heroBgRef.current,
            heroMistRef.current,
            heroGhostRef.current,
            heroBadgeRef.current,
            heroTitleRef.current,
            heroSubRef.current,
            heroMetaRef.current,
            '.about-reveal',
            '.about-card',
            '.about-stat',
            '.about-mission-item',
          ],
          { clearProps: 'all', autoAlpha: 1, y: 0, x: 0, scale: 1 }
        );
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
        intro
          .fromTo(heroBgRef.current, { scale: 1.22, yPercent: 6 }, { scale: 1.04, yPercent: 0, duration: 2, ease: 'expo.out' })
          .fromTo(heroMistRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2 }, '-=1.5')
          .fromTo(heroGhostRef.current, { y: 80, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1 }, '-=1.1')
          .fromTo(heroBadgeRef.current, { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7 }, '-=0.8')
          .fromTo(heroTitleRef.current, { y: 56, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9 }, '-=0.55')
          .fromTo(heroSubRef.current, { y: 32, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.75 }, '-=0.5')
          .fromTo(heroMetaRef.current, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.65 }, '-=0.4');

        gsap.to(heroBgRef.current, {
          yPercent: 16,
          scale: 1.12,
          ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1.1 },
        });
        gsap.to(heroMistRef.current, {
          yPercent: -8,
          autoAlpha: 0.45,
          ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
        });
        gsap.to(heroGhostRef.current, {
          yPercent: -40,
          ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
        });
        gsap.to([heroBadgeRef.current, heroTitleRef.current], {
          yPercent: -22,
          ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
        });
        gsap.to(heroMetaRef.current, {
          yPercent: -10,
          autoAlpha: 0,
          ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
        });

        ScrollTrigger.batch('.about-reveal', {
          start: 'top 86%',
          once: true,
          onEnter: (els) => {
            gsap.fromTo(
              els,
              { y: 36 },
              { y: 0, duration: 0.85, stagger: 0.08, ease: 'power3.out', overwrite: 'auto' }
            );
          },
        });

        ScrollTrigger.batch('.about-card', {
          start: 'top 88%',
          once: true,
          onEnter: (els) => {
            gsap.fromTo(
              els,
              { y: 42, rotate: 1.2 },
              { y: 0, rotate: 0, duration: 0.85, stagger: 0.08, ease: 'power3.out', overwrite: 'auto' }
            );
          },
        });

        const statNodes = gsap.utils.toArray('.about-stat-value');
        statNodes.forEach((el, index) => {
          const meta = STAT_META[index];
          if (!meta) return;
          const counter = { val: 0 };
          gsap.to(counter, {
            val: meta.value,
            duration: 1.6,
            ease: 'power2.out',
            scrollTrigger: { trigger: statsRef.current, start: 'top 80%', once: true },
            onUpdate: () => {
              el.textContent = formatStat(counter.val, meta.suffix);
            },
          });
        });

        if (storyImgRef.current && storyRef.current) {
          gsap.fromTo(
            storyImgRef.current,
            { scale: 1.16, yPercent: -6 },
            {
              scale: 1,
              yPercent: 6,
              ease: 'none',
              scrollTrigger: { trigger: storyRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
            }
          );
          gsap.fromTo(
            '.about-story-frame',
            { clipPath: 'inset(12% 10% 12% 10% round 28px)' },
            {
              clipPath: 'inset(0% 0% 0% 0% round 28px)',
              ease: 'none',
              scrollTrigger: { trigger: storyRef.current, start: 'top 88%', end: 'top 42%', scrub: 0.85 },
            }
          );
        }

        if (lineRef.current && timelineRef.current) {
          gsap.fromTo(
            lineRef.current,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: timelineRef.current,
                start: 'top 75%',
                end: 'bottom 55%',
                scrub: 0.7,
              },
            }
          );
        }

        gsap.fromTo(
          '.about-mission-item',
          { x: 24 },
          {
            x: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: missionRef.current, start: 'top 78%', once: true },
          }
        );

        gsap.fromTo(
          ctaRef.current,
          { y: 40, scale: 0.98 },
          {
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: ctaRef.current, start: 'top 86%', once: true },
          }
        );
      });
    }, pageRef);

    const refresh = () => ScrollTrigger.refresh();
    const id = requestAnimationFrame(refresh);
    window.addEventListener('load', refresh);
    window.addEventListener('resize', refresh);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('load', refresh);
      window.removeEventListener('resize', refresh);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={pageRef}
      className="relative w-full overflow-x-hidden bg-gray-50 text-gray-900 transition-colors duration-500 dark:bg-[#080808] dark:text-white"
    >
      <section
        ref={heroRef}
        className="relative h-[100svh] min-h-[520px] w-full overflow-hidden bg-[#050505]"
      >
        <div className="absolute inset-0 overflow-hidden">
          <img
            ref={heroBgRef}
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=90&w=2400&auto=format&fit=crop"
            alt=""
            className="absolute left-0 top-[-12%] h-[125%] w-full object-cover will-change-transform"
          />
        </div>

        <div
          ref={heroMistRef}
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/80"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
        <div className="pointer-events-none absolute -left-24 top-1/4 h-56 w-56 sm:h-72 sm:w-72 rounded-full bg-[#C63637]/25 blur-[120px]" />

        <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-4 pb-10 pt-24 sm:px-6 sm:pb-16 sm:pt-28 md:px-12 lg:px-16 lg:pb-24">
          <p
            ref={heroGhostRef}
            className="pointer-events-none absolute end-3 top-[18%] select-none text-[20vw] font-black uppercase leading-none tracking-[-0.08em] text-white/[0.07] md:end-10 md:top-[18%] md:text-[14vw] lg:text-[11vw]"
          >
            BOSCO
          </p>

          <div
            ref={heroBadgeRef}
            className="about-hero-badge mb-4 sm:mb-6 inline-flex w-max max-w-full items-center gap-2 sm:gap-3 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2 backdrop-blur-md"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#C63637]" />
            <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/85 sm:text-xs sm:tracking-[0.28em]">
              {t('site.about.badge')}
            </span>
          </div>

          <div ref={heroTitleRef} className="max-w-5xl">
            <h1 className="font-black uppercase leading-[0.9] tracking-tighter text-white">
              <span className="block text-[2rem] xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl">
                {t('site.about.h1a')}
              </span>
              <span className="mt-1 block text-[2rem] text-transparent xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl [-webkit-text-stroke:1.5px_rgba(255,255,255,0.95)] sm:[-webkit-text-stroke:2px_white]">
                {t('site.about.h1b')}
              </span>
            </h1>
          </div>

          <div ref={heroSubRef} className="mt-4 sm:mt-6 max-w-2xl">
            <p className="text-sm leading-relaxed text-white/75 sm:text-lg md:text-xl">
              {t('site.about.hero')}
            </p>
          </div>

          <div
            ref={heroMetaRef}
            className="mt-7 sm:mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <Link
              to="/contact"
              className="inline-flex w-max items-center gap-3 rounded-full bg-[#C63637] px-5 py-2.5 sm:px-6 sm:py-3 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white transition-transform duration-300 hover:scale-[1.03]"
            >
              {t('site.about.partner')}
              <FiArrowRight />
            </Link>

            <div className="flex items-center gap-3 text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-white/55">
              <span>{t('site.about.scroll')}</span>
              <FiArrowDown className="animate-bounce text-[#C63637]" />
            </div>
          </div>
        </div>
      </section>

      <section ref={statsRef} className="relative border-y border-gray-200 bg-white py-10 sm:py-14 dark:border-white/10 dark:bg-[#0c0c0c]">
        <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-5 sm:gap-8 px-4 sm:px-6 md:grid-cols-4 md:px-12 lg:px-16">
          {stats.map((item) => (
            <div key={item.label} className="about-stat text-center md:text-start">
              <p className="about-stat-value text-2xl sm:text-3xl font-black tracking-tight text-[#C63637] md:text-4xl">
                {formatStat(item.value, item.suffix)}
              </p>
              <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section ref={storyRef} className="relative py-14 sm:py-20 lg:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]" />

        <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-8 sm:gap-14 px-4 sm:px-6 md:px-12 lg:grid-cols-12 lg:gap-20 lg:px-16">
          <div className="about-reveal lg:col-span-5">
            <p className="mb-3 sm:mb-5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.35em] text-[#C63637]">
              {t('site.about.story')}
            </p>
            <h2 className="text-3xl sm:text-4xl font-black leading-[0.95] tracking-tight md:text-5xl lg:text-6xl">
              {t('site.about.storyTitle')}
              <span className="block text-[#C63637]">{t('site.about.storyAccent')}</span>
            </h2>
            <p className="mt-5 sm:mt-8 text-base sm:text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              {t('site.about.story1')}
            </p>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-gray-500">
              {t('site.about.story2')}
            </p>
          </div>

          <div className="about-reveal relative lg:col-span-7">
            <div className="absolute -end-4 -top-4 hidden h-full w-full border border-[#C63637]/25 lg:block" />
            <div className="about-story-frame relative overflow-hidden rounded-[22px] sm:rounded-[28px] border border-gray-200 shadow-2xl dark:border-white/10">
              <img
                ref={storyImgRef}
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1800&auto=format&fit=crop"
                alt=""
                className="h-[260px] w-full object-cover will-change-transform sm:h-[420px] md:h-[520px]"
              />
              <div className="absolute bottom-0 start-0 flex items-center gap-2 sm:gap-3 bg-[#C63637] px-4 py-3 sm:px-6 sm:py-4 text-white">
                <FiTrendingUp size={18} />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]">
                  {t('site.about.growth')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-white py-14 sm:py-20 dark:bg-[#0c0c0c] lg:py-32">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 md:px-12 lg:px-16">
          <div className="about-reveal mb-8 sm:mb-14 max-w-3xl">
            <p className="mb-3 sm:mb-5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.35em] text-[#C63637]">
              {t('site.about.stand')}
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight md:text-5xl lg:text-6xl">
              {t('site.about.engineered')}
              <span className="block text-transparent [-webkit-text-stroke:1.5px_#111] dark:[-webkit-text-stroke:1.5px_white]">
                {t('site.about.impact')}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
            {pillars.map((item) => (
              <article
                key={item.title}
                className="about-card group rounded-[20px] sm:rounded-[24px] border border-gray-200 bg-gray-50 p-5 sm:p-8 transition-all duration-500 hover:-translate-y-2 hover:border-[#C63637]/40 dark:border-white/10 dark:bg-[#111111]"
              >
                <div className="mb-4 sm:mb-6 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border border-gray-200 bg-white text-xl sm:text-2xl text-[#C63637] transition-colors duration-500 group-hover:bg-[#C63637] group-hover:text-white dark:border-white/10 dark:bg-white/5">
                  {item.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">{item.title}</h3>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-400">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section ref={timelineRef} className="relative overflow-hidden py-14 sm:py-20 lg:py-32">
        <div className="absolute inset-0 bg-[#C63637]/5 dark:bg-[#C63637]/10" />
        <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 md:px-12 lg:px-16">
          <div className="about-reveal mb-8 sm:mb-14 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 sm:mb-5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.35em] text-[#C63637]">
                {t('site.about.journey')}
              </p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight md:text-5xl">
                {t('site.about.decades')}
                <span className="block">{t('site.about.progress')}</span>
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base text-gray-600 dark:text-gray-400">
              {t('site.about.journeyLead')}
            </p>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute start-4 top-0 hidden h-full w-px bg-gray-200 dark:bg-white/10 md:block lg:start-1/2">
              <div
                ref={lineRef}
                className="h-full w-full origin-top scale-y-0 bg-[#C63637]"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
              {timeline.map((item) => (
                <article
                  key={item.year}
                  className="about-card rounded-[20px] sm:rounded-[24px] border border-gray-200 bg-white/80 p-5 sm:p-7 backdrop-blur-sm dark:border-white/10 dark:bg-[#111111]/80"
                >
                  <p className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-[#C63637]">
                    {item.year}
                  </p>
                  <h3 className="mt-2 sm:mt-3 text-xl sm:text-2xl font-black tracking-tight">{item.title}</h3>
                  <p className="mt-2 sm:mt-3 text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-400">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section ref={missionRef} className="relative overflow-hidden bg-[#101010] py-14 sm:py-20 text-white lg:py-32">
        <img
          src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2000&auto=format&fit=crop"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 md:px-12 lg:px-16">
          <div className="about-reveal grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <p className="mb-3 sm:mb-5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.35em] text-[#C63637]">
                {t('site.about.mission')}
              </p>
              <h2 className="text-3xl sm:text-4xl font-black leading-[0.92] tracking-tight md:text-6xl lg:text-7xl">
                {t('site.about.power')}
                <span className="block text-transparent [-webkit-text-stroke:1.5px_white] sm:[-webkit-text-stroke:2px_white]">
                  {t('site.about.progressWord')}
                </span>
              </h2>
              <p className="mt-5 sm:mt-8 max-w-2xl text-base sm:text-lg leading-relaxed text-gray-300 md:text-xl">
                {t('site.about.missionBody')}
              </p>
            </div>

            <div className="about-reveal lg:col-span-5">
              <div className="rounded-[22px] sm:rounded-[28px] border border-white/10 bg-white/5 p-5 sm:p-8 backdrop-blur-md">
                <div className="mb-4 sm:mb-6 flex items-center gap-3">
                  <FiUsers className="text-xl sm:text-2xl text-[#C63637]" />
                  <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em]">
                    {t('site.about.clientFirst')}
                  </p>
                </div>
                <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-300">
                  {(Array.isArray(missionPoints) ? missionPoints : []).map((point) => (
                    <li key={point} className="about-mission-item flex items-start gap-3">
                      <FiAward className="mt-1 shrink-0 text-[#C63637]" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#C63637] py-14 sm:py-20 lg:py-32">
        <div className="pointer-events-none absolute -end-24 -top-24 h-56 w-56 sm:h-72 sm:w-72 rounded-full border border-white/20" />
        <div className="pointer-events-none absolute -bottom-32 -start-20 h-64 w-64 sm:h-80 sm:w-80 rounded-full border border-white/10" />

        <div ref={ctaRef} className="relative mx-auto max-w-[1600px] px-4 sm:px-6 md:px-12 lg:px-16">
          <p className="mb-4 sm:mb-6 text-[10px] sm:text-xs font-bold uppercase tracking-[0.35em] text-white/70">
            {t('site.about.build')}
          </p>
          <h2 className="max-w-4xl text-3xl sm:text-4xl font-black leading-[0.9] tracking-tight text-white md:text-6xl lg:text-7xl">
            {t('site.about.next')}
            <span className="block text-transparent [-webkit-text-stroke:1.5px_white] sm:[-webkit-text-stroke:2px_white]">
              {t('site.about.starts')}
            </span>
          </h2>
          <div className="mt-7 sm:mt-10 flex flex-col gap-5 md:flex-row md:items-center">
            <p className="max-w-xl text-sm sm:text-lg text-white/85">
              {t('site.about.ctaBody')}
            </p>
            <Link
              to="/contact"
              className="inline-flex w-max items-center gap-3 bg-white px-6 py-3.5 sm:px-7 sm:py-4 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-black transition-all duration-300 hover:gap-5"
            >
              {t('site.about.contact')}
              <FiArrowUpRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
