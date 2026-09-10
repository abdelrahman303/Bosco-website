import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowUpRight, FiFacebook, FiLinkedin, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import Logo from './Logo';
import { COMPANY } from '../utils/company';

gsap.registerPlugin(ScrollTrigger);

const socials = [
  { href: COMPANY.linkedin, icon: FiLinkedin, label: 'LinkedIn' },
  { href: COMPANY.facebook, icon: FiFacebook, label: 'Facebook' },
];

export default function UserFooter() {
  const { t } = useTranslation();
  const footerRef = useRef(null);
  const solutions = [
    { to: '/categories', label: t('site.footer.allCats') },
    { to: '/products', label: t('site.footer.catalog') },
    { to: '/quote', label: t('site.footer.quote') },
    { to: '/contact', label: t('site.footer.talk') },
  ];
  const company = [
    { to: '/aboutus', label: t('site.footer.about') },
    { to: '/products', label: t('site.footer.featured') },
    { to: '/categories', label: t('site.footer.domains') },
    { to: '/contact', label: t('site.footer.contact') },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.footer-reveal',
        { y: 40 },
        {
          y: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 88%',
            once: true,
          },
        }
      );
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="relative overflow-hidden bg-[#070707] text-gray-300">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 start-1/4 w-[280px] sm:w-[420px] h-[280px] sm:h-[420px] bg-[#C63637]/15 blur-[140px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 pt-7 sm:pt-16 lg:pt-20">
        <div className="footer-reveal rounded-[18px] sm:rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl px-4 sm:px-10 py-5 sm:py-10 lg:py-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-8">
          <div className="max-w-2xl text-center sm:text-start">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.28em] text-[#C63637] mb-1.5 sm:mb-3">{t('site.footer.next')}</p>
            <h2 className="text-xl sm:text-5xl font-black tracking-tight text-white leading-[1.1]">
              {t('site.footer.cta')}
            </h2>
          </div>
          <Link
            to="/quote"
            className="btn-pump inline-flex items-center justify-center gap-2 bg-[#C63637] text-white px-5 py-2.5 sm:px-7 sm:py-4 rounded-full text-sm sm:text-base font-bold shrink-0"
          >
            {t('site.footer.quote')} <FiArrowUpRight />
          </Link>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-12 gap-6 sm:gap-12 py-7 sm:py-16 lg:py-20">
          <div className="footer-reveal col-span-2 xl:col-span-5 space-y-3 sm:space-y-6">
            <Logo onDark size="footer" />
            <p className="hidden sm:block text-gray-400 max-w-md leading-relaxed">
              {t('site.footer.blurb')}
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {socials.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-[#C63637] hover:border-[#C63637] transition-colors"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="footer-reveal xl:col-span-2">
            <h3 className="text-white font-black mb-3 sm:mb-5 text-[11px] sm:text-sm uppercase tracking-[0.2em]">{t('site.footer.solutions')}</h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              {solutions.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-gray-400 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-reveal xl:col-span-2">
            <h3 className="text-white font-black mb-3 sm:mb-5 text-[11px] sm:text-sm uppercase tracking-[0.2em]">{t('site.footer.company')}</h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              {company.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-gray-400 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-reveal col-span-2 xl:col-span-3 space-y-2 sm:space-y-4">
            <h3 className="text-white font-black mb-3 sm:mb-5 text-[11px] sm:text-sm uppercase tracking-[0.2em]">{t('site.footer.desk')}</h3>
            <a href={COMPANY.maps} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-gray-400 hover:text-white">
              <FiMapPin className="text-[#C63637] mt-0.5 shrink-0" /> {t('site.footer.city')}
            </a>
            <a href={`tel:${COMPANY.phoneTel}`} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-400 hover:text-white">
              <FiPhone className="text-[#C63637] shrink-0" /> {COMPANY.phoneDisplay}
            </a>
            <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-400 hover:text-white">
              <FiMail className="text-[#C63637] shrink-0" /> {COMPANY.email}
            </a>
            <a
              href={COMPANY.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-[#25D366] hover:text-white"
            >
              WhatsApp · {COMPANY.phoneDisplay}
            </a>
          </div>
        </div>

        <p className="footer-reveal pointer-events-none select-none hidden sm:block text-[18vw] leading-none font-black tracking-tighter text-white/[0.04] text-center -mb-6">
        {t('site.footer.bosco')}
        </p>

        <div className="footer-reveal border-t border-white/10 py-4 sm:py-6 flex flex-col md:flex-row justify-between items-center gap-3 text-[11px] sm:text-sm text-gray-500">
          <p className="text-center">{t('site.footer.rights', { year: new Date().getFullYear() })}</p>
          <div className="relative z-20 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            <Link to="/privacy" className="hover:text-white">{t('site.footer.privacy')}</Link>
            <Link to="/terms" className="hover:text-white">{t('site.footer.terms')}</Link>
            <Link
              to="/admin/login"
              className="relative z-30 text-[11px] font-bold text-gray-300 hover:text-white underline-offset-4 hover:underline pointer-events-auto"
            >
              {t('site.footer.admin')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
