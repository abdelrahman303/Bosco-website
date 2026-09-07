import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaQuoteLeft } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

const reviews = [
  { id: 1, name: 'Ahmed Hassan', company: 'Nile Foods Corp', text: 'Bosco transformed our production speed. The new liquid filling line increased our output by 300%. Professional installation and excellent after-sales support.' },
  { id: 2, name: 'Sarah Mahmoud', company: 'Global Chem', text: 'The raw materials we source from Bosco are always top-tier. Their logistics team ensures we never face downtime.' },
  { id: 3, name: 'Tarek Ziad', company: 'Apex Packaging', text: 'Highly reliable vacuum machines. We tested several competitors in Egypt, but Bosco\'s build quality and UI on the machines are unmatched.' },
];

export default function Testimonials() {
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(".testimonial-card", 
        { y: 50, opacity: 0 },
        { 
          y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white dark:bg-bosco-dark transition-colors border-t border-gray-100 dark:border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-bosco-red uppercase tracking-wider mb-2">Client Success</h2>
          <h3 className="text-3xl md:text-4xl font-black text-bosco-gray dark:text-white">Partnering with Industry Leaders</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="testimonial-card relative p-8 bg-gray-50 dark:bg-bosco-card rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <FaQuoteLeft className="text-4xl text-bosco-red/20 mb-6" />
              <p className="text-gray-600 dark:text-gray-300 italic mb-8 relative z-10 line-clamp-4">
                "{review.text}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-bosco-gray dark:bg-black flex items-center justify-center text-white font-bold text-lg">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h5 className="font-bold text-bosco-gray dark:text-white">{review.name}</h5>
                  <span className="text-sm text-bosco-red font-medium">{review.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}