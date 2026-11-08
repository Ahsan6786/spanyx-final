'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ShowcaseCategoryDetail } from '@/data/whatWeCreateData';

interface LiquidGlassCategoryNavProps {
  categories: ShowcaseCategoryDetail[];
  currentSlug: string;
}

export default function LiquidGlassCategoryNav({
  categories,
  currentSlug,
}: LiquidGlassCategoryNavProps) {
  const router = useRouter();
  const trackRef = useRef<HTMLElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const refrRef = useRef<HTMLDivElement>(null);
  const cloneRef = useRef<HTMLDivElement>(null);
  const feMapRef = useRef<SVGFEImageElement>(null);
  const feDispRef = useRef<SVGFEDisplacementMapElement>(null);

  const initialActiveIndex = Math.max(
    0,
    categories.findIndex((c) => c.slug === currentSlug)
  );

  useEffect(() => {
    const track = trackRef.current;
    const lens = lensRef.current;
    const refr = refrRef.current;
    const clone = cloneRef.current;
    const fe = feMapRef.current;
    const fd = feDispRef.current;
    if (!track || !lens || !refr || !clone || !fe || !fd) return;

    const items = Array.from(track.querySelectorAll('a')) as HTMLAnchorElement[];
    if (!items.length) return;

    const M = 30; // refraction margin around lens (px)
    const PRESS = 0.3; // lens growth factor on press
    let W = 0;
    let H = 0;
    let Y = 0;
    let active = initialActiveIndex;
    let down = false;
    let moved = false;
    let startX = 0;
    let rafId = 0;
    let lastScaleStr = '';

    // Magnified clone of the bar for inside the lens
    clone.innerHTML = '';
    const copy = track.cloneNode(true) as HTMLElement;
    copy.removeAttribute('id');
    copy.querySelectorAll('a').forEach((a) => {
      a.removeAttribute('href');
      a.tabIndex = -1;
    });
    clone.appendChild(copy);

    const cItems = Array.from(copy.querySelectorAll('a'));
    const setSel = (on: boolean) =>
      cItems.forEach((a, i) => a.classList.toggle('sel', on && i === active));

    function buildMap() {
      if (!fe || W <= 0 || H <= 0) return;
      const w = W + 2 * M;
      const h = H + 2 * M;
      const r = Math.min(W, H) * 0.48;
      const bezel = Math.min(W, H) * 0.27;
      const A = 0;
      const cv = document.createElement('canvas');
      cv.width = w;
      cv.height = h;
      const cx = cv.getContext('2d');
      if (!cx) return;
      const img = cx.createImageData(w, h);
      const d = img.data;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const px = x + 0.5 - w / 2;
          const py = y + 0.5 - h / 2;
          const qx = Math.abs(px) - (W / 2 - r);
          const qy = Math.abs(py) - (H / 2 - r);
          const ox = Math.max(qx, 0);
          const oy = Math.max(qy, 0);
          const depth = -(Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - r);
          let dx = 0;
          let dy = 0;
          if (depth > 0) {
            const e = Math.min(depth / bezel, 1);
            const k = e * e * (3 - 2 * e);
            const rim = Math.pow(1 - e, 2);
            let nx: number;
            let ny: number;
            if (ox > 0 || oy > 0) {
              const l = Math.hypot(ox, oy) || 1;
              nx = (ox / l) * Math.sign(px);
              ny = (oy / l) * Math.sign(py);
            } else if (qx > qy) {
              nx = Math.sign(px);
              ny = 0;
            } else {
              nx = 0;
              ny = Math.sign(py);
            }
            dx = Math.max(-1, Math.min(1, nx * rim - (px / (W / 2)) * A * k));
            dy = Math.max(-1, Math.min(1, ny * rim - (py / (H / 2)) * A * k));
          }
          const idx = (y * w + x) * 4;
          d[idx] = 128 + dx * 127;
          d[idx + 1] = 128 + dy * 127;
          d[idx + 2] = 128;
          d[idx + 3] = 255;
        }
      }
      cx.putImageData(img, 0, 0);
      const url = cv.toDataURL();
      fe.setAttribute('href', url);
      fe.setAttributeNS('http://www.w3.org/1999/xlink', 'href', url);
      fe.setAttribute('width', String(w));
      fe.setAttribute('height', String(h));
    }

    // Spring physics
    const st = { x: 0, v: 0, tx: 0, p: 0, pv: 0, tp: 0, s: 0 };
    const STRETCH = 0.38;
    const KX = 190;
    const CX = 20;
    const KP = 230;
    const CP = 14;
    let running = false;
    let last = 0;

    function render() {
      if (!track || !lens || !clone || !fd) return;
      const speed = st.s;
      const S = 1 + PRESS * st.p;
      const sx = S * (1 + STRETCH * speed);
      const sy = S * (1 - 0.1 * speed);
      const pad = items[0].offsetLeft;
      const hw = (W * sx) / 2;
      const cx = Math.max(
        pad + hw,
        Math.min(track.offsetWidth - pad - hw, st.x + W / 2)
      );
      const x = cx - W / 2;
      lens.style.transform = `translate3d(${x}px,${Y}px,0) scale(${sx},${sy})`;
      const kx = S / sx;
      const ky = S / sy;
      const ccx = x + W / 2;
      const ccy = Y + H / 2;
      clone.style.transform = `translate3d(${M + W / 2 - kx * ccx}px,${M + H / 2 - ky * ccy}px,0) scale(${kx},${ky})`;
      lens.style.setProperty('--p', Math.max(0, Math.min(1, st.p)).toFixed(3));
      const nextScaleStr = (
        8 +
        50 * Math.max(0, Math.min(1.1, Math.max(st.p, st.s)))
      ).toFixed(0);
      if (nextScaleStr !== lastScaleStr) {
        lastScaleStr = nextScaleStr;
        fd.setAttribute('scale', nextScaleStr);
      }
    }

    function measure() {
      if (!track || !lens || !refr) return;
      W = items[0].offsetWidth;
      H = items[0].offsetHeight;
      Y = items[0].offsetTop;
      copy.style.width = track.offsetWidth + 'px';
      copy.style.height = track.offsetHeight + 'px';
      lens.style.width = W + 'px';
      lens.style.height = H + 'px';
      lens.style.borderRadius = Math.min(W, H) * 0.48 + 'px';
      refr.style.inset = -M + 'px';
      buildMap();
      st.tx = st.x = items[active].offsetLeft;
      render();
    }

    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 0.033);
      last = now;
      const n = Math.max(1, Math.ceil(dt * 240));
      const h = dt / n;
      for (let i = 0; i < n; i++) {
        st.v += (-(down ? 700 : KX) * (st.x - st.tx) - (down ? 45 : CX) * st.v) * h;
        st.x += st.v * h;
        st.pv += (-KP * (st.p - st.tp) - CP * st.pv) * h;
        st.p += st.pv * h;
      }
      st.s += (Math.min(Math.abs(st.v) / 1200, 1) - st.s) * Math.min(1, dt * 14);
      render();
      if (
        st.s < 0.01 &&
        Math.abs(st.x - st.tx) < 0.05 &&
        Math.abs(st.v) < 0.5 &&
        Math.abs(st.p - st.tp) < 0.002 &&
        Math.abs(st.pv) < 0.02
      ) {
        st.x = st.tx;
        st.p = st.tp;
        st.v = st.pv = st.s = 0;
        render();
        running = false;
        if (!down) setSel(true);
      } else {
        rafId = requestAnimationFrame(frame);
      }
    }

    function kick() {
      setSel(false);
      if (!running) {
        running = true;
        last = performance.now();
        rafId = requestAnimationFrame(frame);
      }
    }

    items.forEach((a) => {
      a.draggable = false;
    });
    const onDragStart = (e: Event) => e.preventDefault();
    track.addEventListener('dragstart', onDragStart);

    const minX = () => items[0].offsetLeft;
    const maxX = () => items[items.length - 1].offsetLeft;
    const clampX = (x: number) => Math.max(minX(), Math.min(maxX(), x));
    const nearest = (x: number) =>
      items.reduce(
        (b, a, i) =>
          Math.abs(a.offsetLeft - x) < Math.abs(items[b].offsetLeft - x) ? i : b,
        0
      );
    const localX = (e: PointerEvent) =>
      e.clientX - track.getBoundingClientRect().left - W / 2;

    function go(i: number, navigate: boolean) {
      active = i;
      st.tx = items[i].offsetLeft;
      items.forEach((a, n) =>
        n === i
          ? a.setAttribute('aria-current', 'page')
          : a.removeAttribute('aria-current')
      );
      kick();

      if (navigate && categories[i].slug !== currentSlug) {
        router.push(`/what-we-create/${categories[i].slug}`);
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      down = true;
      moved = false;
      startX = e.clientX;
      track.setPointerCapture(e.pointerId);
      st.tp = 1;
      st.tx = clampX(localX(e));
      kick();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!down) return;
      if (Math.abs(e.clientX - startX) > 4) moved = true;
      st.tx = clampX(localX(e));
      kick();
    };

    const release = (e: PointerEvent) => {
      if (!down) return;
      down = false;
      st.tp = 0;
      const targetIdx = moved
        ? nearest(st.x + st.v * 0.12)
        : nearest(clampX(localX(e)));
      go(targetIdx, true);
    };

    track.addEventListener('pointerdown', onPointerDown);
    track.addEventListener('pointermove', onPointerMove);
    track.addEventListener('pointerup', release);
    track.addEventListener('pointercancel', release);

    const clickHandlers = items.map((a, i) => {
      const fn = (e: MouseEvent) => {
        e.preventDefault();
        go(i, true);
      };
      a.addEventListener('click', fn);
      return fn;
    });

    const ro = new ResizeObserver(measure);
    ro.observe(track);
    if (document.fonts?.ready) {
      document.fonts.ready.then(measure);
    }
    go(initialActiveIndex, false);
    measure();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      track.removeEventListener('dragstart', onDragStart);
      track.removeEventListener('pointerdown', onPointerDown);
      track.removeEventListener('pointermove', onPointerMove);
      track.removeEventListener('pointerup', release);
      track.removeEventListener('pointercancel', release);
      items.forEach((a, i) => {
        a.removeEventListener('click', clickHandlers[i]);
      });
    };
  }, [categories, currentSlug, initialActiveIndex, router]);

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'erp-solutions':
        return (
          <svg viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
        );
      case 'business-websites':
        return (
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        );
      case 'scroll-driven-animations':
        return (
          <svg viewBox="0 0 24 24">
            <rect x="7" y="2" width="10" height="20" rx="5" />
            <path d="M12 6v4" />
          </svg>
        );
      case 'brand-portfolio-websites':
        return (
          <svg viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      case 'web-applications':
        return (
          <svg viewBox="0 0 24 24">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        );
      case 'trading-fintech-platforms':
        return (
          <svg viewBox="0 0 24 24">
            <path d="M3 3v18h18" />
            <path d="M18 9l-5 5-4-4-3 3" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" />
          </svg>
        );
    }
  };

  return (
    <div className="lg-cat-wrapper">
      <svg
        width="0"
        height="0"
        style={{ position: 'absolute' }}
        aria-hidden="true"
      >
        <filter
          id="lgRefrCat"
          x="0"
          y="0"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feImage
            ref={feMapRef}
            id="lgMapCat"
            x="0"
            y="0"
            width="100"
            height="100"
            result="m"
          />
          <feDisplacementMap
            ref={feDispRef}
            id="lgDispCat"
            in="SourceGraphic"
            in2="m"
            scale="58"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <div className="lg-cat">
        <div className="lg-in lg-cat-in" data-theme="light">
          <nav
            className="track lg-cat-track"
            ref={trackRef}
            aria-label="What We Create service categories"
          >
            {categories.map((cat, idx) => {
              const isActive = cat.slug === currentSlug;
              return (
                <a
                  key={cat.slug}
                  href={`/what-we-create/${cat.slug}`}
                  className={`lg-cat-link ${isActive ? 'is-current' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {getCategoryIcon(cat.slug)}
                  <span className="lg-cat-text">{cat.title}</span>
                </a>
              );
            })}
          </nav>
          <div className="lens" ref={lensRef} aria-hidden="true">
            <div className="refr lg-cat-refr" ref={refrRef}>
              <div className="clone" ref={cloneRef}></div>
            </div>
            <i className="gloss"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

