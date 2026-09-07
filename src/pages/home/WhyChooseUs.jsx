import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiAward, FiGlobe, FiTool, FiCheckCircle, FiArrowUpRight } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

const stats = [
    { id: 1, label: 'Machines Installed', value: 1250, suffix: '+', icon: <FiTool /> },
    { id: 2, label: 'Satisfied Factories', value: 850, suffix: '+', icon: <FiAward /> },
    { id: 3, label: 'Countries Reached', value: 15, suffix: '', icon: <FiGlobe /> },
    { id: 4, label: 'Years Experience', value: 20, suffix: '+', icon: <FiCheckCircle /> },
];

// Native High-Performance Counter Hook (No external dependencies)
function useCounter(end, duration = 2000, trigger = false) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!trigger) return;

        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out expo formula for smooth counting
            const currentCount = Math.floor(progress * end);
            
            setCount(currentCount);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                setCount(end);
            }
        };

        window.requestAnimationFrame(step);
    }, [end, duration, trigger]);

    return count;
}

// Sub-component for individual animated stat counter
function StatItem({ stat, triggerCount }) {
    const animatedCount = useCounter(stat.value, 2000, triggerCount);

    return (
        <div className="group relative overflow-hidden bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-white/5 p-8 rounded-[24px] shadow-sm hover:shadow-xl dark:shadow-none hover:border-[#C63637]/50 transition-all duration-500 flex flex-col justify-between">
            {/* Top Icon & Indicator */}
            <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-2xl text-[#C63637] group-hover:bg-[#C63637] group-hover:text-white transition-all duration-500 shadow-sm">
                    {stat.icon}
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FiArrowUpRight size={16} />
                </div>
            </div>

            {/* Counter Value */}
            <div>
                <div className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2 tracking-tight transition-colors duration-500">
                    {animatedCount.toLocaleString()}
                    <span className="text-[#C63637]">{stat.suffix}</span>
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors duration-500">
                    {stat.label}
                </div>
            </div>

            {/* Hover Border Glow */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#C63637]/30 rounded-[24px] pointer-events-none transition-colors duration-500"></div>
        </div>
    );
}

export default function WhyChooseUs() {
    const [triggerCount, setTriggerCount] = useState(false);
    const sectionRef = useRef(null);
    const headerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Trigger CountUp when section enters viewport
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top 70%",
                onEnter: () => setTriggerCount(true),
                once: true,
            });

            // Header reveal animation
            if (headerRef.current) {
                gsap.fromTo(headerRef.current,
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" }
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-28 relative overflow-hidden bg-gray-50 dark:bg-[#050505] transition-colors duration-500">
            
            {/* Background Ambient Glow */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[35vw] h-[35vw] bg-[#C63637]/10 dark:bg-[#C63637]/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                    
                    {/* Left Column: Editorial Information */}
                    <div ref={headerRef} className="lg:col-span-6 flex flex-col">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 shadow-sm mb-6 w-max transition-colors duration-500">
                            <span className="w-2 h-2 rounded-full bg-[#C63637] animate-pulse"></span>
                            <span className="text-gray-700 dark:text-gray-300 text-xs font-bold tracking-[0.2em] uppercase">The Bosco Advantage</span>
                        </div>

                        <h3 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-[1.05] tracking-tighter mb-6 transition-colors duration-500">
                            Why Industry Leaders <br />
                            <span className="text-transparent [-webkit-text-stroke:1.5px_#111] dark:[-webkit-text-stroke:1.5px_white]">Trust Our Systems</span>
                        </h3>

                        <p className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl font-medium dark:font-light mb-8 leading-relaxed transition-colors duration-500">
                            We don't just sell machines; we architect end-to-end industrial production ecosystems. From factory planning to 24/7 post-installation maintenance, Bosco ensures zero downtime.
                        </p>

                        <ul className="space-y-4 mb-8">
                            {[
                                'Premium European & Asian high-throughput components', 
                                '24/7 dedicated technical support & maintenance', 
                                'Custom-engineered production lines tailored to your floor'
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium transition-colors duration-500">
                                    <div className="w-6 h-6 rounded-full bg-[#C63637]/10 flex items-center justify-center text-[#C63637] flex-shrink-0">
                                        <FiCheckCircle size={14} />
                                    </div>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right Column: Modern Bento Metrics Grid */}
                    <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {stats.map((stat) => (
                            <StatItem key={stat.id} stat={stat} triggerCount={triggerCount} />
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}