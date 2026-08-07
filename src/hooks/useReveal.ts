import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-reveals every [data-reveal] child inside the returned ref.
 * Elements with data-reveal="stagger" reveal their own children in sequence.
 */
export const useReveal = <T extends HTMLElement = HTMLDivElement>() => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        const isStagger = el.dataset.reveal === 'stagger';
        const targets = isStagger ? Array.from(el.children) : [el];
        gsap.from(targets, {
          y: 28,
          opacity: 0,
          duration: 0.85,
          ease: 'power3.out',
          stagger: isStagger ? 0.08 : 0,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });
    }, root);

    const t = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      clearTimeout(t);
      ctx.revert();
    };
  }, []);

  return ref;
};
