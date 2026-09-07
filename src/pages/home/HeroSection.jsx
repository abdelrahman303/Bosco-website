// import React, { useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { FiArrowRight, FiBox, FiCpu } from 'react-icons/fi';

// gsap.registerPlugin(ScrollTrigger);

// export default function HeroSection() {
//   const sectionRef = useRef(null);
//   const textWrapperRefs = useRef([]);
//   const desktopImgRef = useRef(null);
//   const mobileImgRef = useRef(null);
//   const marqueeRef = useRef(null);
//   const uiRefs = useRef([]);

//   // Ref collectors
//   const addToTextRefs = (el) => {
//     if (el && !textWrapperRefs.current.includes(el)) textWrapperRefs.current.push(el);
//   };
//   const addToUIRefs = (el) => {
//     if (el && !uiRefs.current.includes(el)) uiRefs.current.push(el);
//   };

//   useEffect(() => {
//     let ctx = gsap.context(() => {
//       const tl = gsap.timeline();

//       // 1. Image Reveals (Handling both Mobile & Desktop independently for perfect physics)
//       tl.fromTo(mobileImgRef.current,
//         { clipPath: 'inset(0% 0% 100% 0%)', scale: 1.15 },
//         { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.5, ease: "expo.inOut" }
//       );
      
//       tl.fromTo(desktopImgRef.current,
//         { clipPath: 'inset(0% 0% 0% 100%)', scale: 1.15 },
//         { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.5, ease: "expo.inOut" },
//         "<" // Sync with mobile animation
//       );

//       // 2. Staggered Text Reveal
//       tl.fromTo(textWrapperRefs.current,
//         { y: 100, opacity: 0, skewY: 4 },
//         { y: 0, opacity: 1, skewY: 0, duration: 1, stagger: 0.12, ease: "power4.out" },
//         "-=0.9"
//       );

//       // 3. Fade in UI Elements (Badges, Buttons, Descriptions)
//       tl.fromTo(uiRefs.current,
//         { y: 20, opacity: 0 },
//         { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" },
//         "-=0.6"
//       );

//       // 4. Infinite Marquee Animation
//       gsap.to(marqueeRef.current, {
//         xPercent: -50,
//         repeat: -1,
//         duration: 25,
//         ease: "linear"
//       });

//       // 5. Scroll Parallax Effect
//       gsap.to([desktopImgRef.current, mobileImgRef.current], {
//         y: "20%",
//         scrollTrigger: {
//           trigger: sectionRef.current,
//           start: "top top",
//           end: "bottom top",
//           scrub: true,
//         }
//       });
//     }, sectionRef);

//     return () => ctx.revert();
//   }, []);

//   return (
//     <section ref={sectionRef} className="relative w-full min-h-screen bg-gray-50 dark:bg-[#080808] overflow-hidden flex flex-col justify-center transition-colors duration-500 pb-20 lg:pb-0">
      
//       {/* =========================================
//           MOBILE: CINEMATIC FADING BACKGROUND
//           Visible only on screens < 1024px
//       ========================================== */}
//       <div className="absolute top-0 left-0 w-full h-[65vh] lg:hidden z-0 pointer-events-none">
//         <div 
//           ref={mobileImgRef} 
//           className="w-full h-full overflow-hidden [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)] dark:[mask-image:linear-gradient(to_bottom,black_30%,transparent_100%)]"
//         >
//           <img 
//             src="https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=2070&auto=format&fit=crop" 
//             alt="Automated Factory Machinery" 
//             className="w-full h-full object-cover opacity-90 dark:opacity-60"
//           />
//         </div>
//       </div>

//       {/* Grid Background Systems (Behind everything) */}
//       <div className="absolute inset-0 z-0 pointer-events-none">
//         <div className="absolute top-[-5%] left-[-10%] w-[60vw] h-[60vw] bg-[#C63637]/15 dark:bg-[#C63637]/10 blur-[120px] dark:blur-[150px] rounded-full transition-all duration-500"></div>
//         <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] dark:hidden"></div>
//         <div className="absolute inset-0 hidden dark:block bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]"></div>
//       </div>

//       <div className="max-w-[1600px] w-full mx-auto px-6 lg:px-12 xl:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 pt-[22vh] lg:pt-[100px]">
        
//         {/* =========================================
//             LEFT COLUMN: TYPOGRAPHY & ACTIONS
//         ========================================== */}
//         <div className="lg:col-span-7 flex flex-col justify-center relative z-20">
          
//           <div ref={addToUIRefs} className="mb-6 inline-flex w-max items-center gap-3 px-4 py-2 rounded-full bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-lg transition-colors duration-500">
//             <span className="w-2 h-2 rounded-full bg-[#C63637] animate-pulse"></span>
//             <span className="text-gray-800 dark:text-gray-300 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">
//               Bosco International Trade
//             </span>
//           </div>

//           <div className="flex flex-col font-black uppercase leading-[0.88] tracking-tighter text-gray-900 dark:text-white mb-6 transition-colors duration-500">
//             <div className="overflow-hidden pb-2">
//               <h1 ref={addToTextRefs} className="text-[14vw] sm:text-[10vw] lg:text-[6vw]">
//                 Next-Gen
//               </h1>
//             </div>
//             <div className="overflow-hidden pb-2">
//               <h1 ref={addToTextRefs} className="text-[14vw] sm:text-[10vw] lg:text-[6vw]">
//                 Packaging <span className="text-[#C63637]">&</span>
//               </h1>
//             </div>
//             <div className="overflow-hidden pb-2">
//               <h1 ref={addToTextRefs} className="text-[14vw] sm:text-[10vw] lg:text-[6vw] text-transparent [-webkit-text-stroke:1.5px_#111] dark:[-webkit-text-stroke:2px_white] transition-all duration-500">
//                 Filling Lines
//               </h1>
//             </div>
//           </div>

//           <p ref={addToUIRefs} className="max-w-xl text-gray-700 dark:text-gray-400 text-base sm:text-lg lg:text-xl font-medium dark:font-light mb-8 lg:mb-10 leading-relaxed transition-colors duration-500">
//             Elevating factory operations with state-of-the-art machinery, automated systems, and premium raw materials across the Middle East.
//           </p>

//           <div ref={addToUIRefs} className="flex flex-wrap items-center gap-4 lg:gap-6">
//             <Link to="/products" className="group relative px-6 sm:px-8 py-3.5 sm:py-4 bg-[#C63637] text-white font-bold uppercase tracking-widest text-xs sm:text-sm rounded-full overflow-hidden transition-all shadow-[0_8px_30px_rgba(198,54,55,0.3)] hover:shadow-[0_8px_40px_rgba(198,54,55,0.5)]">
//               <span className="relative z-10 flex items-center gap-2 sm:gap-3">
//                 Explore Machinery
//                 <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
//               </span>
//               <div className="absolute inset-0 h-full w-full bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
//             </Link>
            
//             <Link to="/contact" className="px-6 sm:px-8 py-3.5 sm:py-4 bg-white/50 dark:bg-transparent backdrop-blur-md border border-gray-900/20 dark:border-white/20 text-gray-900 dark:text-white font-bold uppercase tracking-widest text-xs sm:text-sm rounded-full hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300">
//               Request Quote
//             </Link>
//           </div>

//           {/* Mobile Only: Inline Glass UI Metrics */}
//           <div ref={addToUIRefs} className="flex lg:hidden items-center gap-4 mt-10">
//             <div className="flex items-center gap-3 bg-white/60 dark:bg-[#121212]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 px-4 py-2.5 rounded-2xl shadow-sm">
//               <FiBox className="text-[#C63637]" size={18} />
//               <div className="flex flex-col">
//                 <span className="text-gray-900 dark:text-white font-black text-sm">100%</span>
//                 <span className="text-gray-600 dark:text-gray-400 text-[9px] uppercase tracking-widest font-bold">Automated</span>
//               </div>
//             </div>
//             <div className="flex items-center gap-3 bg-white/60 dark:bg-[#121212]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 px-4 py-2.5 rounded-2xl shadow-sm">
//               <FiCpu className="text-[#C63637]" size={18} />
//               <div className="flex flex-col">
//                 <span className="text-gray-900 dark:text-white font-black text-sm">Premium</span>
//                 <span className="text-gray-600 dark:text-gray-400 text-[9px] uppercase tracking-widest font-bold">Materials</span>
//               </div>
//             </div>
//           </div>

//         </div>

//         {/* =========================================
//             RIGHT COLUMN: DESKTOP GEOMETRIC IMAGE
//             Hidden entirely on screens < 1024px
//         ========================================== */}
//         <div className="lg:col-span-5 relative hidden lg:block h-[600px] w-full z-20">
//           <div className="absolute inset-0 rounded-[2rem] overflow-hidden border border-gray-200 dark:border-white/10 shadow-2xl transition-colors duration-500">
//             <img 
//               ref={desktopImgRef}
//               src="https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=2070&auto=format&fit=crop" 
//               alt="Automated Factory Machinery" 
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute inset-0 bg-gradient-to-tr from-white/40 dark:from-[#080808]/80 via-transparent to-transparent transition-colors duration-500"></div>
//           </div>
          
//           {/* Desktop Floating Glass UI Element */}
//           <div ref={addToUIRefs} className="absolute -bottom-8 -left-12 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-6 transition-colors duration-500">
//             <div className="flex flex-col gap-1 border-r border-gray-200 dark:border-white/10 pr-6 transition-colors duration-500">
//               <FiBox className="text-[#C63637] mb-2" size={24} />
//               <span className="text-gray-900 dark:text-white font-black text-2xl transition-colors duration-500">100%</span>
//               <span className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-widest font-bold transition-colors duration-500">Automated</span>
//             </div>
//             <div className="flex flex-col gap-1">
//               <FiCpu className="text-[#C63637] mb-2" size={24} />
//               <span className="text-gray-900 dark:text-white font-black text-2xl transition-colors duration-500">Premium</span>
//               <span className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-widest font-bold transition-colors duration-500">Raw Materials</span>
//             </div>
//           </div>
//         </div>

//       </div>

//       {/* =========================================
//           BOTTOM INFINITE MARQUEE
//       ========================================== */}
//       {/* <div className="absolute bottom-0 w-full overflow-hidden bg-[#C63637] py-2.5 sm:py-3 border-t border-red-800/50 z-30 shadow-[0_-10px_30px_rgba(198,54,55,0.2)]">
//         <div ref={marqueeRef} className="flex whitespace-nowrap w-[200%]">
//           {[...Array(2)].map((_, i) => (
//             <div key={i} className="flex items-center gap-6 sm:gap-8 w-1/2 justify-around text-white font-bold uppercase tracking-[0.2em] text-[10px] sm:text-sm">
//               <span>Packaging Machines</span>
//               <span className="w-1.5 h-1.5 bg-white/50 rounded-full"></span>
//               <span>Filling Lines</span>
//               <span className="w-1.5 h-1.5 bg-white/50 rounded-full"></span>
//               <span>Raw Materials</span>
//               <span className="w-1.5 h-1.5 bg-white/50 rounded-full"></span>
//               <span>Spare Parts</span>
//               <span className="w-1.5 h-1.5 bg-white/50 rounded-full"></span>
//               <span>Industrial Automation</span>
//               <span className="w-1.5 h-1.5 bg-white/50 rounded-full"></span>
//             </div>
//           ))}
//         </div>
//       </div> */}

//     </section>
//   );
// }



import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { FiArrowRight, FiBox, FiCpu } from 'react-icons/fi';

export default function HeroSection() {
  const containerRef = useRef(null);
  const bgImageRef = useRef(null);
  const textRefs = useRef([]);
  const uiRefs = useRef([]);
  const headerRef = useRef(null);

  const addToTextRefs = (el) => {
    if (el && !textRefs.current.includes(el)) textRefs.current.push(el);
  };
  const addToUIRefs = (el) => {
    if (el && !uiRefs.current.includes(el)) uiRefs.current.push(el);
  };

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 1. Initial setups
      gsap.set(headerRef.current, { y: -30, opacity: 0 });
      gsap.set(textRefs.current, { y: "120%" }); // Push down for the reveal
      gsap.set(uiRefs.current, { y: 30, opacity: 0 });

      // 2. Slow, cinematic scale-in of the full background image
      tl.fromTo(
        bgImageRef.current,
        { scale: 1.15 },
        { scale: 1, duration: 2.5, ease: "power3.out" },
        0
      );

      // 3. Header drops in
      tl.to(
        headerRef.current,
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
        0.5
      );

      // 4. Staggered text reveal (bottom-up mask effect)
      tl.to(
        textRefs.current,
        { y: "0%", duration: 1.2, stagger: 0.15, ease: "expo.out" },
        0.6
      );

      // 5. Fade and slide in the buttons, logos, and the glass box
      tl.to(
        uiRefs.current,
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power2.out" },
        1.2
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    // Outer wrapper provides the "frame" effect around the full image
    <section ref={containerRef} className="w-full min-h-screen bg-white dark:bg-[#0a0a0a] p-4 lg:p-6 font-sans">
      
      {/* Main Inner Container (Rounded edges, holds the background) */}
      <div className="relative w-full h-[calc(100vh-2rem)] lg:h-[calc(100vh-3rem)] rounded-[2rem] overflow-hidden bg-black shadow-2xl">
        
        {/* Full-width scaling background image */}
        <img 
          ref={bgImageRef}
          src="https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=2070&auto=format&fit=crop" 
          alt="Automated Factory Machinery" 
          className="absolute inset-0 w-full h-full object-cover origin-center"
        />
        
        {/* Gradient Overlay to ensure text pops */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/20 pointer-events-none"></div>

        {/* Header */}
        <header ref={headerRef} className="absolute top-0 left-0 w-full z-40 flex items-center justify-between px-8 lg:px-16 py-8">
          <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-white">
            <FiBox className="text-[#C63637]" /> BOSCO
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-200">
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/technology" className="hover:text-white transition-colors">Technology</Link>
            <Link to="/solutions" className="hover:text-white transition-colors">Solutions</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
          </nav>
          <Link to="/contact" className="bg-[#C63637] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-red-800 transition-colors flex items-center gap-2 shadow-lg shadow-red-900/30">
            Get Started Now <FiArrowRight />
          </Link>
        </header>

        {/* Content Grid */}
        <div className="relative z-10 w-full h-full flex flex-col justify-end lg:grid lg:grid-cols-12 gap-8 px-8 lg:px-16 pb-16 lg:pb-24 pt-32">
          
          {/* LEFT SIDE: Typography and Actions */}
          <div className="lg:col-span-8 xl:col-span-7 flex flex-col justify-end">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-medium leading-[1.05] tracking-[-0.03em] text-white mb-6">
              <div className="overflow-hidden pb-2">
                <div ref={addToTextRefs}>Next-Gen</div>
              </div>
              <div className="overflow-hidden pb-2">
                <div ref={addToTextRefs}>Packaging <span className="text-[#C63637]">&</span></div>
              </div>
              <div className="overflow-hidden pb-2">
                <div ref={addToTextRefs}>Filling Lines</div>
              </div>
            </h1>

            <div className="overflow-hidden mb-10">
              <p ref={addToTextRefs} className="max-w-xl text-gray-300 text-lg sm:text-xl leading-relaxed">
                Explore how Bosco International Trade is transforming factory operations with cutting-edge machinery, premium raw materials, and automated solutions.
              </p>
            </div>

            <div ref={addToUIRefs} className="flex flex-wrap items-center gap-4 mb-16 lg:mb-20">
              <Link to="/products" className="group flex items-center gap-3 pl-6 pr-2 py-2 bg-[#C63637] text-white rounded-full text-sm font-semibold hover:bg-red-800 transition-all shadow-[0_8px_30px_rgba(198,54,55,0.4)]">
                Explore Our Solutions
                <span className="bg-white/20 p-2 rounded-full group-hover:bg-white/30 transition-colors">
                  <FiArrowRight />
                </span>
              </Link>
              
              <Link to="/contact" className="group flex items-center gap-3 px-6 py-3 border border-white/30 rounded-full text-sm font-semibold text-white hover:bg-white hover:text-black transition-all">
                Learn More
              </Link>
            </div>

            {/* Partner Logos */}
            <div ref={addToUIRefs} className="flex flex-wrap items-center gap-8 lg:gap-12 opacity-70">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-white font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                  <FiCpu size={18} /> LOGOIPSUM
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: The Glass Box */}
          <div className="lg:col-span-4 xl:col-span-5 flex flex-col lg:items-end justify-end mt-8 lg:mt-0">
            <div 
              ref={addToUIRefs} 
              className="bg-white/10 backdrop-blur-md border border-white/20 p-8 lg:p-10 rounded-3xl w-full max-w-sm shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
            >
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full mb-6">
                <span className="w-2 h-2 rounded-full bg-[#C63637]"></span>
                <span className="text-white text-xs font-semibold tracking-wide">Smart Systems</span>
              </div>
              
              <h3 className="text-5xl lg:text-6xl font-light text-white mb-4">500+</h3>
              <p className="text-gray-300 text-base leading-relaxed">
                Factories transformed with higher yields and premium automated production lines across the region.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}