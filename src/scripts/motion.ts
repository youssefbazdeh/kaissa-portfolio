import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

/**
 * All motion lives here. Markup opts in with data attributes:
 *   data-reveal-lines  children `.line > span` slide up one after another
 *   data-reveal-words  text is split into words that rise in on scroll
 *   data-script        script accent blurs into focus
 *   data-fade          fades and lifts in when it enters the viewport
 *   data-drift="1|-1"  drifts sideways with scroll (repeat-word bands)
 *   video[data-autoplay] plays only while visible
 * With prefers-reduced-motion, everything shows immediately and nothing moves.
 */
export function initMotion() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  autoplayVideos();
  if (reduce) return;

  gsap.registerPlugin(ScrollTrigger);

  // Smooth scroll, synced with ScrollTrigger.
  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  // Anchor links scroll smoothly too.
  document.querySelectorAll<HTMLAnchorElement>('a[href*="#"]').forEach((a) => {
    const url = new URL(a.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    a.addEventListener('click', (e) => {
      const target = document.querySelector(url.hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -60 });
    });
  });

  // Headlines: lines slide up from a mask.
  document.querySelectorAll('[data-reveal-lines]').forEach((el, idx) => {
    const lines = el.querySelectorAll('.line > span');
    const above = el.getBoundingClientRect().top < window.innerHeight;
    gsap.from(lines, {
      yPercent: 110,
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.09,
      delay: above && idx === 0 ? 0.15 : 0,
      scrollTrigger: above ? undefined : { trigger: el, start: 'top 85%' },
    });
  });

  // Statements: word by word.
  document.querySelectorAll<HTMLElement>('[data-reveal-words]').forEach((el) => {
    const words = (el.textContent ?? '').trim().split(/\s+/);
    el.innerHTML = words
      .map((w) => `<span class="line" style="display:inline-block"><span style="display:inline-block">${w}</span></span>`)
      .join(' ');
    gsap.from(el.querySelectorAll('.line > span'), {
      yPercent: 110,
      duration: 0.9,
      ease: 'expo.out',
      stagger: 0.05,
      scrollTrigger: { trigger: el, start: 'top 80%' },
    });
  });

  // Script accents: blur into focus, then float gently.
  document.querySelectorAll<HTMLElement>('[data-script]').forEach((el) => {
    const above = el.getBoundingClientRect().top < window.innerHeight;
    gsap.fromTo(
      el,
      { opacity: 0, filter: 'blur(18px)', scale: 1.08 },
      {
        opacity: 1,
        filter: 'blur(0.6px)',
        scale: 1,
        duration: 1.8,
        ease: 'power3.out',
        delay: above ? 0.7 : 0,
        scrollTrigger: above ? undefined : { trigger: el, start: 'top 85%' },
      },
    );
    gsap.to(el, { y: -12, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  });

  // Fade + lift, batched so grids cascade.
  gsap.set('[data-fade]', { opacity: 0 });
  ScrollTrigger.batch('[data-fade]', {
    start: 'top 88%',
    once: true,
    onEnter: (els) =>
      gsap.fromTo(els, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08 }),
  });

  // Repeat-word bands drift in opposite directions while scrolling.
  document.querySelectorAll<HTMLElement>('[data-drift]').forEach((row) => {
    const dir = Number(row.dataset.drift);
    gsap.fromTo(
      row,
      { xPercent: dir > 0 ? -18 : -2 },
      {
        xPercent: dir > 0 ? -2 : -18,
        ease: 'none',
        scrollTrigger: { trigger: row.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });

  // Refresh positions once fonts are in (big display type changes layout).
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

function autoplayVideos() {
  const videos = document.querySelectorAll<HTMLVideoElement>('video[data-autoplay]');
  if (!videos.length) return;
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      }),
    { threshold: 0.25 },
  );
  videos.forEach((v) => io.observe(v));
}
