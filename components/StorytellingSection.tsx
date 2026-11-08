'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface MicroStar {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  amp: number;
  speed: number;
  phase: number;
  tint: string;
}

interface CrossStar {
  x: number;
  y: number;
  armLength: number;
  coreRadius: number;
  baseAlpha: number;
  amp: number;
  speed: number;
  phase: number;
}

export default function StorytellingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const firstTextRef = useRef<HTMLHeadingElement>(null);
  const secondTextRef = useRef<HTMLHeadingElement>(null);

  // Subtle animated starfield background with small, fine stars
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = pinRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;
    let isVisible = true;
    let microStars: MicroStar[] = [];
    let crossStars: CrossStar[] = [];

    let seed = 4219;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    const buildStars = (w: number, h: number) => {
      seed = 4219;
      const area = w * h;
      const count = Math.min(360, Math.max(150, Math.floor(area / 4500)));

      microStars = [];
      for (let i = 0; i < count; i++) {
        const isBrighterDot = rand() < 0.06;
        // Very small pinpoint stars: 0.28px - 0.72px, brighter dots max ~0.95px
        const r = isBrighterDot
          ? 0.75 + rand() * 0.28
          : 0.28 + rand() * 0.44;
        const baseAlpha = isBrighterDot
          ? 0.42 + rand() * 0.28
          : 0.12 + rand() * 0.36;
        const amp = isBrighterDot
          ? 0.14 + rand() * 0.18
          : 0.07 + rand() * 0.2;
        const speed = 0.00045 + rand() * 0.0015;
        const phase = rand() * Math.PI * 2;
        const tint = rand() > 0.35 ? '255, 255, 255' : '212, 222, 238';

        microStars.push({
          x: rand() * w,
          y: rand() * h,
          r,
          baseAlpha,
          amp,
          speed,
          phase,
          tint,
        });
      }

      // Small, delicate four-point twinkling stars (no large stars)
      const crossPositions = [
        { rx: 0.195, ry: 0.32, arm: 14, core: 0.85 },
        { rx: 0.618, ry: 0.345, arm: 12, core: 0.75 },
        { rx: 0.745, ry: 0.535, arm: 17, core: 0.95 },
        { rx: 0.878, ry: 0.46, arm: 12, core: 0.75 },
        { rx: 0.18, ry: 0.81, arm: 15, core: 0.85 },
        { rx: 0.525, ry: 0.7, arm: 11, core: 0.7 },
        { rx: 0.445, ry: 0.8, arm: 10, core: 0.65 },
      ];

      crossStars = crossPositions.map((pos) => ({
        x: pos.rx * w,
        y: pos.ry * h,
        armLength: pos.arm * (w < 768 ? 0.75 : 1),
        coreRadius: pos.core,
        baseAlpha: 0.42 + rand() * 0.22,
        amp: 0.2 + rand() * 0.16,
        speed: 0.00055 + rand() * 0.001,
        phase: rand() * Math.PI * 2,
      }));
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStars(width, height);
    };

    const drawFrame = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw tiny scattered background dust stars
      for (let i = 0; i < microStars.length; i++) {
        const s = microStars[i];
        const alpha = Math.max(
          0.03,
          Math.min(
            0.88,
            s.baseAlpha + Math.sin(time * s.speed + s.phase) * s.amp
          )
        );
        ctx.fillStyle = `rgba(${s.tint}, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Draw small, subtle four-point cross-flare stars
      for (let i = 0; i < crossStars.length; i++) {
        const cs = crossStars[i];
        const pulse = Math.sin(time * cs.speed + cs.phase);
        const alpha = Math.max(
          0.14,
          Math.min(0.85, cs.baseAlpha + pulse * cs.amp)
        );
        const arm = cs.armLength * (0.88 + 0.12 * pulse);

        const haloRadius = cs.coreRadius * 3.2;
        const halo = ctx.createRadialGradient(
          cs.x,
          cs.y,
          0,
          cs.x,
          cs.y,
          haloRadius
        );
        halo.addColorStop(
          0,
          `rgba(255, 255, 255, ${(alpha * 0.32).toFixed(3)})`
        );
        halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(cs.x, cs.y, haloRadius, 0, Math.PI * 2);
        ctx.fill();

        const hGrad = ctx.createLinearGradient(
          cs.x - arm,
          cs.y,
          cs.x + arm,
          cs.y
        );
        hGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        hGrad.addColorStop(
          0.5,
          `rgba(255, 255, 255, ${(alpha * 0.65).toFixed(3)})`
        );
        hGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = hGrad;
        ctx.fillRect(cs.x - arm, cs.y - 0.4, arm * 2, 0.8);

        const vGrad = ctx.createLinearGradient(
          cs.x,
          cs.y - arm,
          cs.x,
          cs.y + arm
        );
        vGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        vGrad.addColorStop(
          0.5,
          `rgba(255, 255, 255, ${(alpha * 0.65).toFixed(3)})`
        );
        vGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = vGrad;
        ctx.fillRect(cs.x - 0.4, cs.y - arm, 0.8, arm * 2);

        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.95, alpha).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(cs.x, cs.y, cs.coreRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let running = false;

    const startLoop = () => {
      if (!running && !reducedMotion && isVisible) {
        running = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    const stopLoop = () => {
      running = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const tick = (time: number) => {
      if (!running || !isVisible) {
        running = false;
        return;
      }
      drawFrame(time);
      rafId = requestAnimationFrame(tick);
    };

    resize();
    drawFrame(0);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            startLoop();
          } else {
            stopLoop();
          }
        });
      },
      { threshold: 0.01 }
    );
    observer.observe(container);

    window.addEventListener('resize', resize);
    return () => {
      stopLoop();
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Scroll-controlled text transition on the pinned black stage
  useEffect(() => {
    const section = sectionRef.current;
    const pinEl = pinRef.current;
    const firstText = firstTextRef.current;
    const secondText = secondTextRef.current;

    if (!section || !pinEl || !firstText || !secondText) return;

    const ctx = gsap.context(() => {
      gsap.set(firstText, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
      });

      gsap.set(secondText, {
        opacity: 0,
        y: 32,
        scale: 0.95,
        filter: 'blur(8px)',
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: pinEl,
          start: 'top top',
          end: () => `+=${window.innerHeight * 1.8}`,
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      tl.to({}, { duration: 0.25 })
        .to(firstText, {
          opacity: 0,
          y: -28,
          scale: 0.96,
          filter: 'blur(8px)',
          duration: 0.55,
          ease: 'power2.inOut',
        })
        .to(
          secondText,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.65,
            ease: 'power3.out',
          },
          '-=0.1'
        )
        .to({}, { duration: 0.45 });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="story-section"
      id="what-we-do"
      ref={sectionRef}
      aria-label="What SpanyX Does"
    >
      <div className="story-pin-stage" ref={pinRef}>
        <canvas
          ref={canvasRef}
          className="story-starfield-canvas"
          aria-hidden="true"
        />
        <div className="story-center-wrap">
          <h2 className="story-hero-text is-first" ref={firstTextRef}>
            WHAT DOES SPANYX DO?
          </h2>

          <h2
            className="story-hero-text is-second"
            ref={secondTextRef}
            style={{ opacity: 0 }}
          >
            WE CREATE SOFTWARE SOLUTIONS
            <br />
            IN A LEAGUE OF THEIR OWN.
          </h2>
        </div>
      </div>
    </section>
  );
}
