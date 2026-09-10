import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { useTranslation } from 'react-i18next';
import { FiMenu, FiX, FiSearch, FiArrowRight, FiArrowUpRight } from 'react-icons/fi';
import ThemeLangToggles from './admin/ThemeLangToggles';
import Logo from './Logo';
import { onAppScroll } from '../utils/scrollTop';

// Magnetic hover wrapper for premium feel.
function MagneticButton({ children, className = '' }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.15, y: middleY * 0.15 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 180, damping: 14, mass: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function UserNavbar() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);
  const menuOpen = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/aboutus' },
    { name: t('nav.categories'), path: '/categories' },
    { name: t('nav.products'), path: '/products' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    menuOpen.current = isOpen;
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isOpen]);

  useEffect(() => {
    const pill = () => navRef.current?.querySelector('.nav-pill');
    let lastY = 0;
    let hidden = false;

    const show = () => {
      const el = pill();
      if (!el) return;
      hidden = false;
      gsap.to(el, { y: 0, autoAlpha: 1, duration: 0.35, ease: 'power3.out', overwrite: true });
    };

    const hide = () => {
      const el = pill();
      if (!el || hidden) return;
      hidden = true;
      gsap.to(el, { y: -130, autoAlpha: 0, duration: 0.35, ease: 'power3.inOut', overwrite: true });
    };

    const onScroll = (y) => {
      if (menuOpen.current || y < 70) {
        if (hidden) show();
        lastY = y;
        return;
      }
      if (y > lastY + 8) hide();
      else if (y < lastY - 8) show();
      lastY = y;
    };

    show();
    return onAppScroll(onScroll);
  }, [location.pathname]);

  // Elite GSAP Entrance Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        '.nav-pill',
        { y: -100, scale: 0.8, opacity: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'elastic.out(1, 0.5)',
          delay: 0.2,
        }
      );

      tl.fromTo(
        '.nav-item',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' },
        '-=0.6'
      );
    }, navRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={navRef} className="fixed top-0 inset-x-0 w-full z-[100] px-3 sm:px-6 pt-3 sm:pt-4 pointer-events-none">
      <div className="nav-pill pointer-events-auto max-w-6xl mx-auto bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-full px-3 py-1.5 sm:px-6 sm:py-3 flex items-center justify-between transition-colors duration-500">
        <motion.div className="nav-item" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Logo />
        </motion.div>

        {/* DESKTOP LINKS */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <MagneticButton key={link.name}>
                <Link
                  to={link.path}
                  className={`nav-item relative px-5 py-2 rounded-full text-md font-semibold transition-all duration-300 ${
                    isActive
                      ? 'text-white bg-[#C63637] shadow-lg shadow-[#C63637]/30'
                      : 'text-[#4E4E4E] dark:text-gray-300 hover:text-[#C63637] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              </MagneticButton>
            );
          })}
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="hidden lg:flex items-center gap-3">
          <MagneticButton>
            <button
              onClick={() => navigate('/products')}
              className="nav-item w-10 h-10 rounded-full flex items-center justify-center text-[#4E4E4E] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <FiSearch size={18} />
            </button>
          </MagneticButton>

          <ThemeLangToggles />

          <MagneticButton>
            <Link
              to="/quote"
              className="btn-pump nav-item group flex items-center gap-2 bg-[#C63637] text-white px-6 py-2.5 rounded-full text-sm font-bold ms-2"
            >
              {t('nav.quote')}
              <FiArrowRight className="group-hover:translate-x-1 rtl:rotate-180 transition-transform" />
            </Link>
          </MagneticButton>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setIsOpen(true)}
          className="nav-item lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-[#4E4E4E] dark:text-white bg-gray-100 dark:bg-white/10 rounded-full"
        >
          <FiMenu size={20} />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-[200] pointer-events-auto bg-[#070707]/55 dark:bg-black/70 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          >
            <motion.aside
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-3 top-3 bottom-3 sm:inset-x-6 sm:top-6 sm:bottom-6 rounded-[28px] bg-white dark:bg-[#0d0d0d] border border-black/5 dark:border-white/10 shadow-[0_30px_80px_-24px_rgba(0,0,0,0.45)] flex flex-col overflow-hidden"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100 dark:border-white/10">
                <Logo />
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-white/10 text-[#4E4E4E] dark:text-white rounded-full"
                  aria-label={t('nav.closeMenu')}
                >
                  <FiX size={20} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
                {navLinks.map((link, i) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: document.documentElement.dir === 'rtl' ? 16 : -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 + i * 0.05, duration: 0.35, ease: 'easeOut' }}
                    >
                      <Link
                        to={link.path}
                        className={`flex items-center justify-between rounded-2xl px-4 py-3.5 transition-colors ${
                          isActive
                            ? 'bg-[#C63637] text-white shadow-[0_10px_24px_rgba(198,54,55,0.28)]'
                            : 'bg-gray-50 dark:bg-white/5 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className={`text-[11px] font-black tracking-[0.18em] ${isActive ? 'text-white/70' : 'text-[#C63637]'}`}>
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="text-lg font-black">{link.name}</span>
                        </span>
                        <FiArrowUpRight />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="px-4 pb-5 pt-3 border-t border-gray-100 dark:border-white/10 space-y-3">
                <div className="flex justify-center">
                  <ThemeLangToggles />
                </div>
                <Link
                  to="/quote"
                  onClick={() => setIsOpen(false)}
                  className="btn-pump w-full inline-flex items-center justify-center gap-2 bg-[#C63637] text-white py-3.5 rounded-2xl font-black"
                >
                  {t('nav.quote')}
                  <FiArrowRight />
                </Link>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

