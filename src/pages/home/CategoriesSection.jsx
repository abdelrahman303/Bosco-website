// import React, { useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { FiBox, FiSettings, FiDroplet, FiLayers } from 'react-icons/fi';

// gsap.registerPlugin(ScrollTrigger);

// const categories = [
//   { id: 1, title: 'Packaging Machines', desc: 'Vacuum & Wrapping solutions', icon: <FiBox />, colSpan: 'col-span-1 md:col-span-2' },
//   { id: 2, title: 'Filling Machines', desc: 'Liquid & Powder automated lines', icon: <FiDroplet />, colSpan: 'col-span-1' },
//   { id: 3, title: 'Raw Materials', desc: 'Chemicals & Food grade inputs', icon: <FiLayers />, colSpan: 'col-span-1' },
//   { id: 4, title: 'Spare Parts', desc: 'Motors, Sensors & Maintenance', icon: <FiSettings />, colSpan: 'col-span-1 md:col-span-2' },
// ];

// export default function CategoriesSection() {
//   const sectionRef = useRef(null);

//   useEffect(() => {
//     let ctx = gsap.context(() => {
//       gsap.fromTo(".cat-card", 
//         { y: 50, opacity: 0 },
//         { 
//           y: 0, 
//           opacity: 1, 
//           duration: 0.8, 
//           stagger: 0.15, 
//           ease: "power3.out",
//           scrollTrigger: {
//             trigger: sectionRef.current,
//             start: "top 75%",
//           }
//         }
//       );
//     }, sectionRef);
//     return () => ctx.revert();
//   }, []);

//   return (
//     <section ref={sectionRef} className="py-24 bg-white dark:bg-bosco-dark transition-colors relative z-10">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
//         <div className="flex flex-col md:flex-row justify-between items-end mb-12">
//           <div>
//             <h2 className="text-sm font-bold text-bosco-red uppercase tracking-wider mb-2">Our Core Domains</h2>
//             <h3 className="text-3xl md:text-5xl font-black text-bosco-gray dark:text-white">Industrial Categories</h3>
//           </div>
//           <Link to="/categories" className="text-bosco-red font-semibold hover:underline mt-4 md:mt-0">
//             View All Categories &rarr;
//           </Link>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {categories.map((cat) => (
//             <div key={cat.id} className={`cat-card group relative overflow-hidden rounded-2xl bg-gray-50 dark:bg-bosco-card border border-gray-100 dark:border-gray-800 p-8 hover:border-bosco-red/50 transition-colors ${cat.colSpan}`}>
//               {/* Background Glow */}
//               <div className="absolute -inset-4 bg-gradient-to-br from-bosco-red/0 to-bosco-red/0 group-hover:from-bosco-red/5 group-hover:to-transparent transition-all duration-500 z-0 pointer-events-none"></div>
              
//               <div className="relative z-10">
//                 <div className="w-14 h-14 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-700 flex items-center justify-center text-2xl text-bosco-red mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
//                   {cat.icon}
//                 </div>
//                 <h4 className="text-2xl font-bold text-bosco-gray dark:text-gray-100 mb-2">{cat.title}</h4>
//                 <p className="text-gray-500 dark:text-gray-400 font-medium mb-6">{cat.desc}</p>
//                 <Link to={`/categories/${cat.id}`} className="inline-block text-sm font-bold text-bosco-gray dark:text-white group-hover:text-bosco-red transition-colors">
//                   Explore Solutions &rarr;
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }


import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiBox, FiSettings, FiDroplet, FiLayers, FiArrowUpRight } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { 
    id: 1, 
    title: 'Packaging Machines', 
    desc: 'High-speed vacuum, wrapping, and sealing solutions for massive throughput.', 
    icon: <FiBox />, 
    colSpan: 'col-span-1 md:col-span-2 md:row-span-2',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1000&auto=format&fit=crop'
  },
  { 
    id: 2, 
    title: 'Filling Lines', 
    desc: 'Precision liquid and powder automated filling systems.', 
    icon: <FiDroplet />, 
    colSpan: 'col-span-1',
    image: 'https://images.unsplash.com/photo-1513828646241-13783a48e7ba?q=80&w=1000&auto=format&fit=crop'
  },
  { 
    id: 3, 
    title: 'Raw Materials', 
    desc: 'Premium chemicals and food-grade inputs.', 
    icon: <FiLayers />, 
    colSpan: 'col-span-1',
    image: 'https://images.unsplash.com/photo-1611078608889-183424d852a3?q=80&w=1000&auto=format&fit=crop'
  },
  { 
    id: 4, 
    title: 'Spare Parts', 
    desc: 'Motors, sensors, and vital maintenance components.', 
    icon: <FiSettings />, 
    colSpan: 'col-span-1 md:col-span-2',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1000&auto=format&fit=crop'
  },
];

export default function CategoriesSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  const addToCardsRef = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 40 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          }
        }
      );

      gsap.fromTo(cardsRef.current, 
        { 
          clipPath: 'inset(10% 10% 10% 10% round 24px)', 
          scale: 0.95, 
          opacity: 0,
          y: 50
        },
        { 
          clipPath: 'inset(0% 0% 0% 0% round 24px)', 
          scale: 1, 
          opacity: 1, 
          y: 0,
          duration: 1.2, 
          stagger: 0.15, 
          ease: "expo.out",
          scrollTrigger: {
            trigger: ".bento-grid",
            start: "top 75%",
          }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-gray-50 dark:bg-[#050505] transition-colors duration-500 relative z-10 overflow-hidden">
      
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-[#C63637]/10 dark:bg-[#C63637]/5 blur-[100px] dark:blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 relative z-10">
        
        {/* Header Section */}
        <div ref={headerRef} className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 shadow-sm mb-6 transition-colors duration-500">
              <span className="w-2 h-2 rounded-full bg-[#C63637] animate-pulse"></span>
              <span className="text-gray-600 dark:text-gray-300 text-xs font-bold tracking-[0.2em] uppercase">Core Domains</span>
            </div>
            <h3 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter transition-colors duration-500">
              Industrial <span className="text-transparent [-webkit-text-stroke:1.5px_#111] dark:[-webkit-text-stroke:1.5px_white]">Solutions</span>
            </h3>
          </div>
          <Link to="/categories" className="group flex items-center gap-2 text-gray-900 dark:text-white font-bold uppercase tracking-widest text-sm pb-2 border-b border-gray-900/20 dark:border-white/20 hover:border-gray-900 dark:hover:border-white transition-colors duration-500">
            View All Machinery
            <FiArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="bento-grid grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              to={`/categories/${cat.id}`}
              ref={addToCardsRef} 
              className={`cat-card group relative overflow-hidden rounded-[24px] bg-[#0F0F0F] lg:bg-white dark:lg:bg-[#0F0F0F] border border-white/10 lg:border-gray-200 dark:lg:border-white/5 hover:border-[#C63637]/50 lg:hover:border-[#C63637]/50 shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-500 flex flex-col justify-end p-8 ${cat.colSpan}`}
            >
              {/* Background Image Reveal */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Light/Dark Base Layer: Hidden on mobile, visible on desktop until hovered */}
                <div className="absolute inset-0 bg-white dark:bg-[#0F0F0F] z-10 opacity-0 lg:opacity-100 lg:group-hover:opacity-0 transition-opacity duration-700"></div>
                
                {/* Image: Visible on mobile, faded on desktop until hovered */}
                <img 
                  src={cat.image} 
                  alt={cat.title} 
                  className="w-full h-full object-cover opacity-80 lg:opacity-10 dark:lg:opacity-40 lg:group-hover:opacity-80 scale-100 lg:group-hover:scale-110 transition-all duration-1000 ease-out"
                />
                
                {/* Gradient Overlay: Always active on mobile for text contrast, appears on hover for desktop */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-20 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-30 flex flex-col h-full justify-between">
                
                {/* Top Section: Icon & Arrow */}
                <div className="flex justify-between items-start">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 lg:bg-gray-50 dark:lg:bg-white/10 backdrop-blur-md border border-white/20 lg:border-gray-100 dark:lg:border-white/10 flex items-center justify-center text-2xl text-white lg:text-gray-700 dark:lg:text-white lg:group-hover:bg-[#C63637] lg:group-hover:border-[#C63637] lg:group-hover:text-white transition-all duration-500 shadow-sm lg:group-hover:shadow-lg lg:group-hover:scale-110">
                    {cat.icon}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 lg:bg-gray-50 dark:lg:bg-white/5 border border-white/20 lg:border-gray-100 dark:lg:border-white/10 flex items-center justify-center text-white lg:text-gray-700 dark:lg:text-white lg:group-hover:text-white opacity-100 translate-y-0 translate-x-0 lg:opacity-0 lg:-translate-y-4 lg:translate-x-4 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 lg:group-hover:translate-x-0 transition-all duration-500">
                    <FiArrowUpRight size={20} />
                  </div>
                </div>

                {/* Bottom Section: Text */}
                <div className="transform translate-y-0 lg:translate-y-4 lg:group-hover:translate-y-0 transition-transform duration-500">
                  <h4 className="text-2xl md:text-3xl font-black text-white lg:text-gray-900 dark:lg:text-white lg:group-hover:text-white mb-2 tracking-tight transition-colors duration-500">
                    {cat.title}
                  </h4>
                  <p className="text-gray-300 lg:text-gray-500 dark:lg:text-gray-400 font-medium text-sm md:text-base line-clamp-2 max-w-sm lg:group-hover:text-gray-300 transition-colors duration-500">
                    {cat.desc}
                  </p>
                </div>

              </div>

              {/* Glowing Hover Border Effect */}
              <div className="absolute inset-0 border-2 border-transparent lg:group-hover:border-[#C63637]/30 rounded-[24px] z-40 pointer-events-none transition-colors duration-700"></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}