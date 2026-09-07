// import React, { useEffect, useRef } from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Autoplay } from 'swiper/modules';
// import { Link } from 'react-router-dom';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { FiArrowRight, FiChevronLeft, FiChevronRight, FiSettings } from 'react-icons/fi';

// import 'swiper/css';
// import 'swiper/css/navigation';

// gsap.registerPlugin(ScrollTrigger);

// const baseProducts = [
//   { id: 1, name: 'Automated Liquid Filler Pro', category: 'Filling Lines', specs: '12,000 bph / 0.1% Error Margin', image: 'https://images.unsplash.com/photo-1513828646241-13783a48e7ba?q=80&w=1200&auto=format&fit=crop' },
//   { id: 2, name: 'Vacuum Sealer X-1000', category: 'Packaging Machines', specs: 'Industrial Grade / Continuous Seal', image: 'https://images.unsplash.com/photo-1580983554972-2438848d5eb2?q=80&w=1200&auto=format&fit=crop' },
//   { id: 3, name: 'Rotary Labeling System', category: 'Production Lines', specs: 'High-Speed / Multi-format', image: 'https://images.unsplash.com/photo-1611078608889-183424d852a3?q=80&w=1200&auto=format&fit=crop' },
//   { id: 4, name: 'Conveyor Belt Master', category: 'Spare Parts', specs: 'Heavy Duty / Variable Speed', image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1200&auto=format&fit=crop' },
//   { id: 5, name: 'Powder Dosing Unit', category: 'Filling Lines', specs: 'Volumetric / Dust-free', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop' },
// ];

// // Duplicate products array to ensure Swiper loop has enough slides
// const products = [...baseProducts, ...baseProducts];

// export default function FeaturedProducts() {
//   const sectionRef = useRef(null);
//   const headerRef = useRef(null);

//   useEffect(() => {
//     let ctx = gsap.context(() => {
//       if (headerRef.current) {
//         gsap.fromTo(headerRef.current.children, 
//           { y: 60, opacity: 0 },
//           { 
//             y: 0, 
//             opacity: 1, 
//             duration: 1.2, 
//             stagger: 0.2, 
//             ease: "expo.out",
//             scrollTrigger: { 
//               trigger: sectionRef.current, 
//               start: "top 80%" 
//             } 
//           }
//         );
//       }
//     }, sectionRef);
//     return () => ctx.revert();
//   }, []);

//   return (
//     <section ref={sectionRef} className="pt-32 pb-24 bg-white dark:bg-[#080808] transition-colors duration-500 overflow-hidden relative">

//       {/* Background Accent Glow */}
//       <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-[#C63637]/5 blur-[120px] rounded-[100%] pointer-events-none"></div>

//       <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 relative z-10">

//         {/* Header Area */}
//         <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
//           <div ref={headerRef} className="max-w-2xl">
//             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 shadow-sm mb-4">
//               <FiSettings className="text-[#C63637] animate-spin" />
//               <span className="text-gray-700 dark:text-gray-300 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">Featured Equipment</span>
//             </div>
//             <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight">
//               State-of-the-Art <br />
//               <span className="text-transparent [-webkit-text-stroke:1.5px_#111] dark:[-webkit-text-stroke:1.5px_white]">Machinery</span>
//             </h3>
//           </div>

//           {/* Custom Navigation Buttons */}
//           <div className="hidden md:flex items-center gap-3">
//             <button className="custom-prev w-14 h-14 rounded-full flex items-center justify-center bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white hover:bg-[#C63637] hover:border-[#C63637] hover:text-white transition-all duration-300 shadow-sm group cursor-pointer z-20">
//               <FiChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
//             </button>
//             <button className="custom-next w-14 h-14 rounded-full flex items-center justify-center bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white hover:bg-[#C63637] hover:border-[#C63637] hover:text-white transition-all duration-300 shadow-sm group cursor-pointer z-20">
//               <FiChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Swiper Carousel Container */}
//       <div className="w-full pb-16 relative">
//         <Swiper
//           modules={[Navigation, Autoplay]}
//           grabCursor={true}
//           centeredSlides={true}
//           slidesPerView={1.1}
//           spaceBetween={20}
//           loop={true}
//           autoplay={{ 
//             delay: 4000, 
//             disableOnInteraction: false,
//             pauseOnMouseEnter: true 
//           }}
//           navigation={{
//             nextEl: '.custom-next',
//             prevEl: '.custom-prev',
//           }}
//           breakpoints={{
//             640: { slidesPerView: 1.5, spaceBetween: 30 },
//             1024: { slidesPerView: 2.5, spaceBetween: 40 },
//             1440: { slidesPerView: 3.2, spaceBetween: 50 },
//           }}
//           className="featured-swiper !overflow-visible select-none"
//         >
//           {products.map((product, index) => (
//             <SwiperSlide key={`${product.id}-${index}`} className="transition-all duration-700">
//               {({ isActive }) => (
//                 <div 
//                   className={`relative w-full h-[450px] md:h-[550px] lg:h-[650px] rounded-[2rem] overflow-hidden group transition-all duration-700 ease-out bg-gray-900 ${
//                     isActive ? 'scale-100 opacity-100 shadow-2xl ring-2 ring-[#C63637]/30' : 'scale-90 opacity-60'
//                   }`}
//                 >
//                   <img 
//                     src={product.image} 
//                     alt={product.name} 
//                     loading="lazy"
//                     className="absolute inset-0 w-full h-full object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-1000 ease-out pointer-events-none"
//                   />

//                   <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-500 pointer-events-none"></div>

//                   <div className="absolute top-6 left-6 z-20 pointer-events-none">
//                     <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
//                       {product.category}
//                     </div>
//                   </div>

//                   <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end z-20">
//                     <div className="transform translate-y-4 md:translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
//                       <h4 className="text-2xl md:text-4xl font-black text-white mb-2 tracking-tight drop-shadow-lg">
//                         {product.name}
//                       </h4>
//                       <p className="text-gray-300 font-medium text-sm md:text-base mb-6 opacity-90 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
//                         {product.specs}
//                       </p>
//                       <div className="flex items-center gap-4 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
//                         <Link 
//                           to={`/products/${product.id}`} 
//                           className="flex items-center justify-center w-12 h-12 rounded-full bg-[#C63637] text-white hover:scale-110 transition-transform shadow-[0_0_20px_rgba(198,54,55,0.4)]"
//                         >
//                           <FiArrowRight size={20} />
//                         </Link>
//                         <span className="text-white font-bold uppercase tracking-widest text-xs">View Specifications</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#C63637]/50 rounded-[2rem] transition-colors duration-500 pointer-events-none z-30"></div>
//                 </div>
//               )}
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>

//       {/* Mobile Navigation Buttons */}
//       <div className="flex md:hidden items-center justify-center gap-4 mt-4">
//         <button className="custom-prev w-12 h-12 rounded-full flex items-center justify-center bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white shadow-sm cursor-pointer z-20">
//           <FiChevronLeft size={20} />
//         </button>
//         <button className="custom-next w-12 h-12 rounded-full flex items-center justify-center bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white shadow-sm cursor-pointer z-20">
//           <FiChevronRight size={20} />
//         </button>
//       </div>

//     </section>
//   );
// }























import React, {
  useState,
  useLayoutEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  FiBox,
  FiSettings,
  FiCheckCircle,
  FiCpu,
  FiTrendingUp,
} from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

const solutionsData = [
  {
    id: "01",
    title: "Automated Liquid Filling Solutions",
    description:
      "Smart liquid filling systems help maximize production speed while maintaining strict volume accuracy and minimizing waste during the factory process.",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
    stat: "12M+",
    statDesc:
      "Bottles processed daily using our automated filling lines.",
    icon: <FiSettings size={24} />,
  },
  {
    id: "02",
    title: "High-Speed Packaging Machinery",
    description:
      "Advanced packaging units utilize AI-driven sensors to optimize packing routes, ensuring flawless sealing and boxing with zero manual intervention.",
    image:
      "https://images.unsplash.com/photo-1513828646241-13783a48e7ba?q=80&w=2070&auto=format&fit=crop",
    stat: "250+",
    statDesc:
      "Factories upgraded with our next-gen packaging systems.",
    icon: <FiBox size={24} />,
  },
  {
    id: "03",
    title: "Premium Raw Materials (APIs)",
    description:
      "Pharmaceutical-grade active ingredients sourced globally, ensuring compliance with strict GMP and ISO standards.",
    image:
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=2070&auto=format&fit=crop",
    stat: "99.9%",
    statDesc:
      "Purity level guaranteed across all pharmaceutical batches.",
    icon: <FiCheckCircle size={24} />,
  },
  {
    id: "04",
    title: "AI in Quality Control",
    description:
      "Optical inspection systems that predict patterns and detect microscopic defects before products reach the final manufacturing stage.",
    image:
      "https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=2070&auto=format&fit=crop",
    stat: "100%",
    statDesc:
      "Automated defect detection rate in packaging lines.",
    icon: <FiCpu size={24} />,
  },
  {
    id: "05",
    title: "Reduce Operational Waste",
    description:
      "Implement highly efficient industrial systems to reduce energy consumption and material waste across production lines.",
    image:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop",
    stat: "40%",
    statDesc:
      "Average reduction in material waste and energy usage.",
    icon: <FiTrendingUp size={24} />,
  },
];


/* =========================================================
   CONTENT
========================================================= */

const SolutionsContent = forwardRef((props, ref) => {

  const [activeIndex, setActiveIndex] = useState(0);

  const imageRef = useRef(null);


  useImperativeHandle(
    ref,
    () => ({
      setIndex: (index) => {
        setActiveIndex(index);
      },
    }),
    []
  );


  const active = solutionsData[activeIndex];


  /* -------------------------------------------------------
     Animate image whenever active index changes
  ------------------------------------------------------- */

  useLayoutEffect(() => {

    if (!imageRef.current) return;

    gsap.killTweensOf(imageRef.current);

    gsap.fromTo(
      imageRef.current,
      {
        opacity: 0,
        scale: 1.08,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
      }
    );

  }, [activeIndex]);


  return (
    <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-16 w-full">

      {/* HEADER */}

      <div className="mb-10 lg:mb-14">

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">

          <span className="text-[#C63637] text-xs font-bold tracking-widest uppercase">
            03 / Our Solutions
          </span>

        </div>


        <h2 className="text-4xl md:text-5xl lg:text-[4rem] font-medium tracking-tight text-white">
          Everything Your Factory Needs.
        </h2>

      </div>


      {/* MAIN */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">


        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="lg:col-span-5 flex flex-col gap-3">

          {solutionsData.map((item, index) => {

            const isActive = activeIndex === index;

            return (
              <div
                key={item.id}
                className={`rounded-3xl overflow-hidden transition-all duration-500 ${isActive
                    ? "bg-[#181818] p-6 lg:p-7 border border-white/5 shadow-xl"
                    : "p-4 lg:p-5 opacity-50"
                  }`}
              >

                <div className="flex items-center gap-4">

                  <span
                    className={`text-lg font-medium ${isActive
                        ? "text-[#C63637]"
                        : "text-gray-600"
                      }`}
                  >
                    {item.id}.
                  </span>


                  <h3
                    className={`text-lg lg:text-xl font-medium ${isActive
                        ? "text-white"
                        : "text-gray-400"
                      }`}
                  >
                    {item.title}
                  </h3>

                </div>


                {/* DESCRIPTION */}

                <div
                  className={`grid transition-all duration-500 ${isActive
                      ? "grid-rows-[1fr] opacity-100 mt-4"
                      : "grid-rows-[0fr] opacity-0 mt-0"
                    }`}
                >

                  <div className="overflow-hidden">

                    <p className="text-gray-400 leading-relaxed pl-9 pr-4">
                      {item.description}
                    </p>

                  </div>

                </div>

              </div>
            );

          })}

        </div>


        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="lg:col-span-7">

          <div
            className="relative w-full h-[500px] lg:h-[650px] rounded-[2.5rem] overflow-hidden bg-[#111]"
          >

            {/* =================================================
                SINGLE IMAGE
                IMPORTANT: only ONE image exists
            ================================================= */}

            <img
              ref={imageRef}
              src={active.image}
              alt={active.title}
              className="absolute inset-0 w-full h-full object-cover"
              draggable="false"
            />


            {/* DARK OVERLAY */}

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent z-10 pointer-events-none" />


            {/* =================================================
                TOP LABEL
            ================================================= */}

            <div className="absolute top-6 left-6 lg:top-8 lg:left-8 z-20">

              <div className="px-4 py-2 rounded-full bg-black/30 backdrop-blur-xl border border-white/10">

                <span className="text-white/80 text-xs tracking-[0.2em] uppercase">
                  Industrial Solutions
                </span>

              </div>

            </div>


            {/* =================================================
                GLASS CARD
            ================================================= */}

            <div className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 z-20 w-[280px] lg:w-[340px]">

              <div className="bg-black/30 backdrop-blur-xl border border-white/15 rounded-[2rem] p-6 lg:p-8 shadow-2xl">


                {/* ICON */}

                <div className="flex justify-end mb-5">

                  <div className="w-12 h-12 rounded-full bg-[#C63637] flex items-center justify-center text-white shadow-[0_0_30px_rgba(198,54,55,0.35)]">

                    {active.icon}

                  </div>

                </div>


                {/* STAT */}

                <h4
                  key={activeIndex}
                  className="text-5xl lg:text-7xl font-light text-white mb-3 animate-fade-up"
                >
                  {active.stat}
                </h4>


                {/* DESCRIPTION */}

                <p
                  key={`desc-${activeIndex}`}
                  className="text-gray-300 text-sm lg:text-base leading-relaxed animate-fade-up"
                >
                  {active.statDesc}
                </p>

              </div>

            </div>


            {/* =================================================
                PROGRESS
            ================================================= */}

            <div className="absolute bottom-7 left-7 lg:left-10 z-20">

              <div className="flex items-center gap-2">

                {solutionsData.map((_, index) => (

                  <div
                    key={index}
                    className={`h-[3px] rounded-full transition-all duration-500 ${index === activeIndex
                        ? "w-10 bg-[#C63637]"
                        : "w-3 bg-white/30"
                      }`}
                  />

                ))}

              </div>

            </div>

          </div>

        </div>

      </div>


      <style>{`

        @keyframes fade-up {

          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }

        }

        .animate-fade-up {
          animation: fade-up 0.6s ease-out;
        }

      `}</style>

    </div>
  );
});


/* =========================================================
   MAIN SECTION
========================================================= */

export default function SolutionsSection() {

  const wrapperRef = useRef(null);
  const pinRef = useRef(null);
  const contentRef = useRef(null);

  const activeIndexRef = useRef(0);


  useLayoutEffect(() => {

    const ctx = gsap.context(() => {

      const trigger = ScrollTrigger.create({

        trigger: wrapperRef.current,

        pin: pinRef.current,

        start: "top top",

        end: () => `+=${window.innerHeight * 3.5}`,

        scrub: 1,

        anticipatePin: 1,

        invalidateOnRefresh: true,


        onUpdate: (self) => {

          const total = solutionsData.length;

          /*
             IMPORTANT

             Don't allow progress to jump directly
             from first to last.
          */

          const index = Math.min(
            total - 1,
            Math.floor(self.progress * total)
          );


          if (index !== activeIndexRef.current) {

            activeIndexRef.current = index;

            contentRef.current?.setIndex(index);

          }

        },

      });


      /* Refresh after layout */

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });


      return () => {
        trigger.kill();
      };

    }, wrapperRef);


    return () => {
      ctx.revert();
    };

  }, []);


  return (

    <section
      ref={wrapperRef}
      className="relative w-full bg-[#0a0a0a]"
    >

      <div
        ref={pinRef}
        className="relative min-h-screen w-full flex items-center bg-[#0a0a0a]"
      >

        <SolutionsContent ref={contentRef} />

      </div>

    </section>

  );
}