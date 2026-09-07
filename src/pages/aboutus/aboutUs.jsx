import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
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

const stats = [
  { value: '20+', label: 'Years of Experience' },
  { value: '850+', label: 'Partner Factories' },
  { value: '15', label: 'Countries Served' },
  { value: '1,250+', label: 'Machines Delivered' },
];

const pillars = [
  {
    icon: <FiTarget />,
    title: 'Precision Sourcing',
    text: 'We identify the right machinery and materials for regulated, high-volume production environments.',
  },
  {
    icon: <FiShield />,
    title: 'Trusted Supply',
    text: 'Every partnership is built on reliability, compliance, and long-term industrial performance.',
  },
  {
    icon: <FiGlobe />,
    title: 'Global Reach',
    text: 'Connecting manufacturers with international suppliers, technologies, and market opportunities.',
  },
];

const timeline = [
  {
    year: '2004',
    title: 'Founded with a clear mission',
    text: 'Bosco began as a focused trading partner for food and pharmaceutical manufacturers.',
  },
  {
    year: '2012',
    title: 'Expanded industrial ecosystem',
    text: 'Added machinery sourcing, raw material supply, and finished product distribution.',
  },
  {
    year: '2020',
    title: 'International scale',
    text: 'Built cross-border partnerships across 15 countries with dedicated project support.',
  },
  {
    year: 'Today',
    title: 'End-to-end B2B partner',
    text: 'One team supporting factories from equipment selection to ongoing supply continuity.',
  },
];

export default function AboutUs() {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const heroBgRef = useRef(null);
  const heroMistRef = useRef(null);
  const heroGhostRef = useRef(null);
  const heroBadgeRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubRef = useRef(null);
  const heroMetaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });

      intro
        .fromTo(
          heroBgRef.current,
          { scale: 1.28, yPercent: 8 },
          { scale: 1.05, yPercent: 0, duration: 2.2, ease: 'expo.out' }
        )
        .fromTo(
          heroMistRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1.4 },
          '-=1.6'
        )
        .fromTo(
          heroGhostRef.current,
          { y: 120, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2 },
          '-=1.2'
        )
        .fromTo(
          heroBadgeRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          '-=0.9'
        )
        .fromTo(
          heroTitleRef.current,
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          '-=0.65'
        )
        .fromTo(
          heroSubRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.85 },
          '-=0.55'
        )
        .fromTo(
          heroMetaRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75 },
          '-=0.45'
        );

      gsap.to(heroBgRef.current, {
        yPercent: 18,
        scale: 1.14,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

      gsap.to(heroMistRef.current, {
        yPercent: -12,
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to(heroGhostRef.current, {
        yPercent: -55,
        xPercent: 6,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to(heroBadgeRef.current, {
        yPercent: -28,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to(heroTitleRef.current, {
        yPercent: -38,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to(heroSubRef.current, {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to(heroMetaRef.current, {
        yPercent: -10,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.utils.toArray('.about-reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 56, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 82%',
            },
          }
        );
      });

      gsap.utils.toArray('.about-card').forEach((el, index) => {
        gsap.fromTo(
          el,
          { y: 70, opacity: 0, rotate: index % 2 ? -1.5 : 1.5 },
          {
            y: 0,
            opacity: 1,
            rotate: 0,
            duration: 0.95,
            delay: index * 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
            },
          }
        );
      });
    }, pageRef);

    const refresh = () => ScrollTrigger.refresh();
    refresh();
    window.addEventListener('load', refresh);

    return () => {
      window.removeEventListener('load', refresh);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={pageRef}
      className="relative w-full overflow-x-hidden bg-gray-50 text-gray-900 transition-colors duration-500 dark:bg-[#080808] dark:text-white"
    >
      {/* ── Cinematic hero ── */}
      <section
        ref={heroRef}
        className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-[#050505]"
      >
        <div className="absolute inset-0 overflow-hidden">
          <img
            ref={heroBgRef}
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=90&w=2400&auto=format&fit=crop"
            alt="Global industrial landscape"
            className="absolute left-0 top-[-12%] h-[125%] w-full object-cover will-change-transform"
          />
        </div>

        <div
          ref={heroMistRef}
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/80"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
        <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-[#C63637]/25 blur-[120px]" />

        <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-6 pb-16 pt-28 md:px-12 lg:px-16 lg:pb-24">
          <p
            ref={heroGhostRef}
            className="pointer-events-none absolute right-4 top-[22%] select-none text-[18vw] font-black uppercase leading-none tracking-[-0.08em] text-white/[0.07] md:right-10 md:top-[18%] md:text-[14vw] lg:text-[11vw]"
          >
            BOSCO
          </p>

          <div ref={heroBadgeRef} className="about-hero-badge mb-6 inline-flex w-max items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#C63637]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/85 sm:text-xs">
              About Bosco International Trade
            </span>
          </div>

          <div ref={heroTitleRef} className="max-w-5xl">
            <h1 className="font-black uppercase leading-[0.88] tracking-tighter text-white">
              <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
                Building Global
              </span>
              <span className="mt-1 block text-5xl text-transparent sm:text-6xl md:text-7xl lg:text-8xl [-webkit-text-stroke:1.5px_rgba(255,255,255,0.95)] sm:[-webkit-text-stroke:2px_white]">
                Industrial Bridges
              </span>
            </h1>
          </div>

          <div ref={heroSubRef} className="mt-6 max-w-2xl">
            <p className="text-base leading-relaxed text-white/75 sm:text-lg md:text-xl">
              We connect factories with the machinery, raw materials, and commercial
              pathways they need to grow — across food, pharmaceutical, and industrial
              supply chains.
            </p>
          </div>

          <div
            ref={heroMetaRef}
            className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <Link
              to="/contact"
              className="inline-flex w-max items-center gap-3 rounded-full bg-[#C63637] px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition-transform duration-300 hover:scale-[1.03]"
            >
              Partner With Us
              <FiArrowRight />
            </Link>

            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-white/55">
              <span>Scroll to explore</span>
              <FiArrowDown className="animate-bounce text-[#C63637]" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="relative border-y border-gray-200 bg-white py-14 dark:border-white/10 dark:bg-[#0c0c0c]">
        <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-8 px-6 md:grid-cols-4 md:px-12 lg:px-16">
          {stats.map((item) => (
            <div key={item.label} className="about-reveal text-center md:text-left">
              <p className="text-3xl font-black tracking-tight text-[#C63637] md:text-4xl">
                {item.value}
              </p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Story ── */}
      <section className="relative py-24 lg:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]" />

        <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-14 px-6 md:px-12 lg:grid-cols-12 lg:gap-20 lg:px-16">
          <div className="about-reveal lg:col-span-5">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.35em] text-[#C63637]">
              Our Story
            </p>
            <h2 className="text-4xl font-black leading-[0.95] tracking-tight md:text-5xl lg:text-6xl">
              More Than
              <span className="block text-[#C63637]">A Trading Company</span>
            </h2>
            <p className="mt-8 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              Bosco International Trade operates at the intersection of industrial
              technology and commercial execution. We help manufacturers source
              equipment, secure materials, and bring products to market with confidence.
            </p>
            <p className="mt-4 text-base leading-relaxed text-gray-500 dark:text-gray-500">
              From project planning to long-term supply partnerships, our team supports
              every stage of your production journey.
            </p>
          </div>

          <div className="about-reveal relative lg:col-span-7">
            <div className="absolute -right-4 -top-4 hidden h-full w-full border border-[#C63637]/25 lg:block" />
            <div className="relative overflow-hidden rounded-[28px] border border-gray-200 shadow-2xl dark:border-white/10">
              <img
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1800&auto=format&fit=crop"
                alt="Industrial manufacturing environment"
                className="h-[420px] w-full object-cover md:h-[520px]"
              />
              <div className="absolute bottom-0 left-0 flex items-center gap-3 bg-[#C63637] px-6 py-4 text-white">
                <FiTrendingUp size={22} />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">
                  Built for industrial growth
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pillars ── */}
      <section className="relative bg-white py-24 dark:bg-[#0c0c0c] lg:py-32">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-16">
          <div className="about-reveal mb-14 max-w-3xl">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.35em] text-[#C63637]">
              What We Stand For
            </p>
            <h2 className="text-4xl font-black tracking-tight md:text-5xl lg:text-6xl">
              Engineered for
              <span className="block text-transparent [-webkit-text-stroke:1.5px_#111] dark:[-webkit-text-stroke:1.5px_white]">
                Long-Term Impact
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {pillars.map((item) => (
              <article
                key={item.title}
                className="about-card group rounded-[24px] border border-gray-200 bg-gray-50 p-8 transition-all duration-500 hover:-translate-y-2 hover:border-[#C63637]/40 dark:border-white/10 dark:bg-[#111111]"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-white text-2xl text-[#C63637] transition-colors duration-500 group-hover:bg-[#C63637] group-hover:text-white dark:border-white/10 dark:bg-white/5">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-black tracking-tight">{item.title}</h3>
                <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-400">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-[#C63637]/5 dark:bg-[#C63637]/10" />
        <div className="relative mx-auto max-w-[1600px] px-6 md:px-12 lg:px-16">
          <div className="about-reveal mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.35em] text-[#C63637]">
                Our Journey
              </p>
              <h2 className="text-4xl font-black tracking-tight md:text-5xl">
                Two Decades of
                <span className="block">Industrial Progress</span>
              </h2>
            </div>
            <p className="max-w-md text-gray-600 dark:text-gray-400">
              A consistent focus on quality sourcing, trusted partnerships, and
              practical support for modern manufacturing teams.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {timeline.map((item) => (
              <article
                key={item.year}
                className="about-card rounded-[24px] border border-gray-200 bg-white/80 p-7 backdrop-blur-sm dark:border-white/10 dark:bg-[#111111]/80"
              >
                <p className="text-sm font-black uppercase tracking-[0.25em] text-[#C63637]">
                  {item.year}
                </p>
                <h3 className="mt-3 text-2xl font-black tracking-tight">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-400">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Leadership values ── */}
      <section className="relative overflow-hidden bg-[#101010] py-24 text-white lg:py-32">
        <img
          src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2000&auto=format&fit=crop"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative mx-auto max-w-[1600px] px-6 md:px-12 lg:px-16">
          <div className="about-reveal grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.35em] text-[#C63637]">
                Our Mission
              </p>
              <h2 className="text-4xl font-black leading-[0.92] tracking-tight md:text-6xl lg:text-7xl">
                Power
                <span className="block text-transparent [-webkit-text-stroke:2px_white]">
                  Progress.
                </span>
              </h2>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-gray-300 md:text-xl">
                We deliver reliable machinery, quality raw materials, and practical
                industrial solutions that help businesses produce more, operate better,
                and grow stronger.
              </p>
            </div>

            <div className="about-reveal lg:col-span-5">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 backdrop-blur-md">
                <div className="mb-6 flex items-center gap-3">
                  <FiUsers className="text-2xl text-[#C63637]" />
                  <p className="text-sm font-bold uppercase tracking-[0.2em]">
                    Client-first partnership
                  </p>
                </div>
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-start gap-3">
                    <FiAward className="mt-1 shrink-0 text-[#C63637]" />
                    Dedicated project consultants for every engagement
                  </li>
                  <li className="flex items-start gap-3">
                    <FiAward className="mt-1 shrink-0 text-[#C63637]" />
                    Transparent sourcing with compliance-ready documentation
                  </li>
                  <li className="flex items-start gap-3">
                    <FiAward className="mt-1 shrink-0 text-[#C63637]" />
                    Long-term support beyond initial delivery
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-[#C63637] py-24 lg:py-32">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/20" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full border border-white/10" />

        <div className="about-reveal relative mx-auto max-w-[1600px] px-6 md:px-12 lg:px-16">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.35em] text-white/70">
            Let&apos;s Build Together
          </p>
          <h2 className="max-w-4xl text-4xl font-black leading-[0.9] tracking-tight text-white md:text-6xl lg:text-7xl">
            Your Next Project
            <span className="block text-transparent [-webkit-text-stroke:2px_white]">
              Starts Here
            </span>
          </h2>
          <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-center">
            <p className="max-w-xl text-lg text-white/85">
              Discover how Bosco International Trade can support your factory, supply
              chain, and next industrial expansion.
            </p>
            <Link
              to="/contact"
              className="inline-flex w-max items-center gap-3 bg-white px-7 py-4 text-xs font-bold uppercase tracking-[0.2em] text-black transition-all duration-300 hover:gap-5"
            >
              Contact Us
              <FiArrowUpRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
