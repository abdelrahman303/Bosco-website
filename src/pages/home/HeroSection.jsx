import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { FiArrowRight, FiBox, FiCpu, FiZap, FiTrendingUp, FiShield } from "react-icons/fi";

const slideMeta = [
  {
    img: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=800&auto=format&fit=crop",
    stat: "500+",
    icon: FiBox
  },
  {
    img: "https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?q=80&w=800&auto=format&fit=crop",
    stat: "10K+",
    icon: FiTrendingUp
  },
  {
    img: "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?q=80&w=800&auto=format&fit=crop",
    stat: "99.9%",
    icon: FiCpu
  },
  {
    img: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=800&auto=format&fit=crop",
    stat: "45%",
    icon: FiShield
  },
  {
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop",
    stat: "120+",
    icon: FiZap
  }
];

const HeroSection = () => {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const texts = t('site.hero.slides', { returnObjects: true }) || [];
  const slides = slideMeta.map((meta, index) => ({ ...meta, ...(texts[index] || {}) }));
  const container = useRef(null);
  const leftContent = useRef([]);
  const floatWrappers = useRef([]);
  const slideTextRef = useRef(null);
  const slideFeaturesRef = useRef(null);
  const slideMetaRef = useRef(null);
  const slideStatsRef = useRef(null);
  const slideOverlayRef = useRef(null);
  const logoRefs = useRef([]);
  const currentRef = useRef(0);
  const fadingRef = useRef(false);

  const fadeTargets = () =>
    [slideTextRef.current, slideFeaturesRef.current, slideMetaRef.current, slideStatsRef.current, slideOverlayRef.current].filter(Boolean);

  const goToSlide = (index) => {
    const next = ((index % slides.length) + slides.length) % slides.length;
    if (next === currentRef.current || fadingRef.current) return;
    fadingRef.current = true;
    gsap.to(fadeTargets(), {
      opacity: 0,
      duration: 0.4,
      ease: "power2.inOut",
      overwrite: true,
      onComplete: () => setCurrent(next),
    });
  };

  useEffect(() => {
    currentRef.current = current;
    gsap.fromTo(
      fadeTargets(),
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        overwrite: true,
        onComplete: () => {
          fadingRef.current = false;
        },
      }
    );
  }, [current]);

  useEffect(() => {
    const timer = setInterval(() => {
      goToSlide(currentRef.current + 1);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Initial Entrance & Continuous Floating
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(leftContent.current, { y: 40, opacity: 0, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.2 });
      
      gsap.from(floatWrappers.current, {
        x: 100, opacity: 0, scale: 0.8, duration: 1.2, stagger: 0.2, ease: "back.out(1.2)", delay: 0.4,
        onComplete: () => {
          floatWrappers.current.forEach((wrapper, index) => {
            gsap.to(wrapper, { y: index % 2 === 0 ? "-=15" : "+=15", duration: 3 + index, yoyo: true, repeat: -1, ease: "sine.inOut" });
          });
        },
      });

      logoRefs.current.forEach((logo, index) => {
        gsap.fromTo(logo, { opacity: 0, y: 20 }, { opacity: 0.5, y: 0, duration: 0.8, delay: 0.8 + index * 0.1, ease: "power2.out" });
      });
    }, container);

    return () => ctx.revert();
  }, []);

  // --- 3D CORNER MOVEMENT LOGIC (NO INWARD SCALE) ---
  const handleCardHover = (e) => {
    gsap.to(e.currentTarget, {
      scale: 1, 
      z: 0, 
      boxShadow: "0 30px 60px -15px rgba(0,0,0,0.7)", 
      borderColor: "rgba(198,54,55,0.7)",
      duration: 0.4,
      ease: "power3.out",
      transformPerspective: 1000,
    });

    const imgs = e.currentTarget.querySelectorAll("img");
    if (imgs.length) gsap.to(imgs, { scale: 1.1, duration: 0.5, ease: "power2.out" });
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    gsap.to(e.currentTarget, {
      rotationX: -y * 12,
      rotationY: x * 12,
      x: x * 8,
      y: y * 8,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  const handleCardLeave = (e) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      z: 0,
      x: 0,
      y: 0,
      rotationX: 0,
      rotationY: 0,
      boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
      borderColor: "rgba(31,41,55,1)",
      duration: 0.8,
      ease: "elastic.out(1, 0.6)",
    });

    const imgs = e.currentTarget.querySelectorAll("img");
    if (imgs.length) gsap.to(imgs, { scale: 1, duration: 0.7, ease: "power3.out" });
  };

  // --- REFS SETUP ---
  const addToLeftRef = (el) => {
    if (el && !leftContent.current.includes(el)) leftContent.current.push(el);
  };
  const addToFloatWrappers = (el) => {
    if (el && !floatWrappers.current.includes(el)) floatWrappers.current.push(el);
  };
  const addToLogoRefs = (el) => {
    if (el && !logoRefs.current.includes(el)) logoRefs.current.push(el);
  };

  const handleDotClick = (index) => {
    goToSlide(index);
  };

  const SlideIcon = slides[current].icon;

  return (
    <section ref={container} className="relative min-h-[100svh] bg-[#0a0a0a] text-white flex items-center justify-center overflow-hidden font-sans pt-24 pb-12 sm:pt-32 sm:pb-20">
      <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-[#C63637]/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-56 h-56 sm:w-80 sm:h-80 bg-[#C63637]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center z-10">
        
        {/* LEFT COLUMN */}
        <div className="flex flex-col space-y-4 sm:space-y-6 lg:pr-8">
          <div ref={addToLeftRef} className="flex items-center space-x-2 text-sm font-medium text-gray-400 mb-2">
            <span className="flex text-[#C63637]">★★★★★</span>
            <span>{t('site.hero.badge')}</span>
          </div>

          <div ref={slideTextRef} className="min-h-0 sm:min-h-[220px]">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-medium leading-[1.05] tracking-[-0.03em] mb-3 sm:mb-4">
              {slides[current].title1} <br />
              {slides[current].title2} <span className="text-[#C63637]">&</span> <br />
              {slides[current].title3}
            </h1>
            <p className="text-gray-400 text-sm sm:text-xl max-w-lg leading-relaxed">
              {slides[current].desc}
            </p>
          </div>

          <div ref={(el) => { addToLeftRef(el); slideFeaturesRef.current = el; }} className="grid grid-cols-3 gap-3 mt-4">
            {(slides[current].features || []).map((feature, index) => (
              <div key={index} className="bg-[#111111] border border-gray-800 rounded-xl p-2 sm:p-3 text-center hover:border-[#C63637] transition-colors duration-300">
                <div className="text-[#C63637] text-[10px] sm:text-xs font-semibold">{feature}</div>
              </div>
            ))}
          </div>

          <div ref={addToLeftRef} className="flex space-x-3 pt-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => handleDotClick(i)} className={`dot-indicator h-1.5 rounded-full transition-all duration-300 ${current === i ? "w-8 bg-[#C63637]" : "w-3 bg-gray-700 hover:bg-gray-500"}`} />
            ))}
          </div>

          <div ref={addToLeftRef} className="flex flex-wrap items-center gap-4 mt-6">
            <Link to="/products" className="btn-pump group flex items-center justify-between bg-[#C63637] text-white rounded-full py-2 px-6 pr-2">
              <span className="mr-6 font-semibold text-sm">{t('site.hero.explore')}</span>
              <div className="bg-black/20 text-white rounded-full p-2">
                <FiArrowRight size={18} />
              </div>
            </Link>
            <Link to="/contact" className="px-6 py-3 rounded-full text-sm font-semibold text-white hover:text-[#C63637] transition-colors">
              {t('site.hero.learnMore')}
            </Link>
          </div>

          <div ref={addToLeftRef} className="mt-8 pt-8 border-t border-gray-800/50">
            <p className="text-xs text-gray-500 font-semibold mb-6 tracking-widest uppercase">{t('site.hero.trusted')}</p>
            <div className="flex flex-wrap items-center gap-8 lg:gap-12 opacity-50 grayscale">
              {["Bosco", "Industries", "Global"].map((name, i) => (
                <div key={i} ref={addToLogoRefs} className="text-white font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                  <FiCpu size={18} /> {name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - FLOATING & SLIDING CARDS */}
        <div className="relative h-[420px] sm:h-[520px] lg:h-[650px] w-full flex items-center justify-center mt-2 lg:mt-0 [perspective:1000px]">
          
          {/* Card 1: Main Portrait */}
          <div ref={addToFloatWrappers} className="absolute z-20 left-0 lg:left-4 top-6 sm:top-12 w-[78%] max-w-[300px] lg:w-[340px]">
            <div 
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
              onMouseMove={handleMouseMove}
              className="bg-[#1a1a1a] rounded-[2rem] p-1 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-gray-800 cursor-pointer transition-colors"
            >
              <div className="relative rounded-[1.8rem] overflow-hidden bg-black aspect-[4/5]">
                {slides.map((slide, i) => (
                  <img
                    key={slide.img}
                    src={slide.img}
                    alt={i === current ? "Automated factory machinery" : ""}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                      i === current ? "opacity-90" : "opacity-0"
                    }`}
                  />
                ))}
                <div ref={slideOverlayRef} className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-4 left-4 bg-[#C63637] p-2.5 rounded-full text-white shadow-lg">
                    {SlideIcon && <SlideIcon size={18} />}
                  </div>
                  <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-3">
                    <div className="bg-white text-black font-semibold px-4 py-2 rounded-xl flex items-center shadow-lg text-sm">
                      <span className="bg-[#C63637] text-white rounded-full p-0.5 mr-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                      </span>
                      {slides[current].badge}
                    </div>
                    <div className="bg-black/70 backdrop-blur-md text-white text-xs px-4 py-1.5 rounded-full flex items-center border border-white/10">
                      <span className="text-[#C63637] mr-2">●</span> {t('site.hero.live')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Features List (Shifted further right so it's fully visible) */}
          <div ref={addToFloatWrappers} className="absolute z-10 right-0 sm:right-[-20px] lg:-right-16 top-24 sm:top-32 w-[58%] max-w-[280px] lg:w-[320px] hidden sm:block">
            <div 
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
              onMouseMove={handleMouseMove}
              className="bg-[#f8f9fa] text-black rounded-[2rem] p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-transparent cursor-pointer"
            >
              <div ref={slideMetaRef}>
              <h3 className="text-2xl font-bold mb-6 tracking-tight">
                {slides[current].title1}<br /> 
                <span className="text-[#C63637]">{slides[current].title2}</span>
              </h3>
              <ul className="space-y-4">
                {(slides[current].features || []).map((item, i) => (
                  <li key={i} className="flex items-center text-sm font-semibold text-gray-800">
                    <div className="bg-[#C63637] text-white rounded-full p-1 mr-3 flex-shrink-0">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              </div>
            </div>
          </div>

          {/* Card 3: Dynamic Stats */}
          <div ref={addToFloatWrappers} className="absolute z-30 right-2 sm:right-10 lg:right-16 bottom-2 sm:bottom-8 w-[160px] sm:w-[240px] lg:w-[260px]">
            <div 
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
              onMouseMove={handleMouseMove}
              className="bg-[#111111] text-white border border-gray-800 rounded-[1.25rem] sm:rounded-[1.5rem] p-4 sm:p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] cursor-pointer"
            >
              <div ref={slideStatsRef}>
              <h4 className="text-2xl sm:text-4xl font-bold text-white mb-2">
                {slides[current].stat}
              </h4>
              <p className="text-gray-400 text-sm font-medium leading-snug">
                {slides[current].statLabel}
              </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;