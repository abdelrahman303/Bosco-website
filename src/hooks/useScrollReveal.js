import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollReveal(containerRef, selector, deps = []) {
  useLayoutEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray(selector, root);
      if (!items.length) return;

      gsap.set(items, { autoAlpha: 1, clearProps: 'opacity,visibility,filter' });

      ScrollTrigger.batch(items, {
        start: 'top 92%',
        once: true,
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { y: 64, scale: 0.96 },
            {
              y: 0,
              scale: 1,
              autoAlpha: 1,
              duration: 0.9,
              ease: 'power3.out',
              stagger: 0.1,
              overwrite: true,
              onComplete: () => gsap.set(batch, { autoAlpha: 1, clearProps: 'transform' }),
            }
          );
        },
      });
    }, root);

    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refresh);
      ctx.revert();
    };
  }, deps);
}
