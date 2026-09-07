import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { FiMenu, FiX, FiSearch, FiMoon, FiSun, FiArrowRight } from 'react-icons/fi';

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
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/aboutus' },
    { name: 'Categories', path: '/categories' },
    { name: 'Products', path: '/products' },
    { name: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  };

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isOpen]);

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
    <div ref={navRef} className="fixed top-0 left-0 w-full z-[100] px-4 sm:px-6 pt-6 pointer-events-none">
      <div className="nav-pill pointer-events-auto max-w-6xl mx-auto bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-full px-4 py-2 sm:px-6 sm:py-3 flex items-center justify-between transition-colors duration-500">
        <Link to="/" className="nav-item flex items-center gap-2 group">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-[#4E4E4E] dark:text-white transition-colors">
              BOSCO<span className="text-[#C63637]">.</span>
            </span>
          </motion.div>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <MagneticButton key={link.name}>
                <Link
                  to={link.path}
                  className={`nav-item relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
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
            <button className="nav-item w-10 h-10 rounded-full flex items-center justify-center text-[#4E4E4E] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
              <FiSearch size={18} />
            </button>
          </MagneticButton>

          <MagneticButton>
            <button
              onClick={toggleTheme}
              className="nav-item w-10 h-10 rounded-full flex items-center justify-center text-[#4E4E4E] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              {isDarkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
          </MagneticButton>

          <MagneticButton>
            <Link
              to="/quote"
              className="nav-item group flex items-center gap-2 bg-[#C63637] text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-[0_4px_15px_rgba(198,54,55,0.3)] hover:shadow-[0_8px_25px_rgba(198,54,55,0.5)] hover:bg-red-700 ml-2"
            >
              Get Quote
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </MagneticButton>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setIsOpen(true)}
          className="nav-item lg:hidden w-10 h-10 flex items-center justify-center text-[#4E4E4E] dark:text-white bg-gray-100 dark:bg-white/10 rounded-full"
        >
          <FiMenu size={20} />
        </button>
      </div>

      {/* FULL-SCREEN MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[200] bg-white/80 dark:bg-black/80 backdrop-blur-3xl flex flex-col pointer-events-auto"
          >
            <div className="flex justify-between items-center p-6 sm:p-8">
              <span className="text-2xl font-black text-[#4E4E4E] dark:text-white">
                BOSCO<span className="text-[#C63637]">.</span>
              </span>

              <button
                onClick={() => setIsOpen(false)}
                className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-white/10 text-[#4E4E4E] dark:text-white rounded-full"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="flex flex-col px-8 mt-4 space-y-6 flex-1 justify-center">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease: 'easeOut' }}
                >
                  <Link
                    to={link.path}
                    className="text-4xl sm:text-5xl font-black text-[#4E4E4E] dark:text-white hover:text-[#C63637] dark:hover:text-[#C63637] transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-8 pb-12 flex flex-col gap-4"
            >
              <button
                onClick={toggleTheme}
                className="w-full py-4 flex items-center justify-center gap-3 bg-gray-100 dark:bg-white/5 rounded-2xl font-bold text-[#4E4E4E] dark:text-white"
              >
                {isDarkMode ? (
                  <>
                    <FiSun /> Switch to Light
                  </>
                ) : (
                  <>
                    <FiMoon /> Switch to Dark
                  </>
                )}
              </button>

              <Link
                to="/quote"
                onClick={() => setIsOpen(false)}
                className="w-full bg-[#C63637] text-white py-4 rounded-2xl text-center font-black text-lg shadow-lg shadow-[#C63637]/30"
              >
                Request Quote
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

