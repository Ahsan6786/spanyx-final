'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface DynamicIslandNavProps {
  onOpenContact?: (buttonEl: HTMLElement) => void;
}

const DEFAULT_NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Team', href: '/about#team' },
  { label: 'Services', href: '/what-we-create' },
  { label: 'Industries', href: '/industries' },
  { label: 'Career', href: '/careers' },
  { label: 'Blog', href: '/blog' },
];

const WHAT_WE_CREATE_NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'ERP', href: '/what-we-create/erp-solutions' },
  { label: 'Fintech', href: '/what-we-create/trading-fintech-platforms' },
  { label: 'AI Agents', href: '/what-we-create/ai-agents' },
  { label: 'Web Apps', href: '/what-we-create/web-applications' },
  { label: 'Websites', href: '/what-we-create/business-websites' },
  { label: 'Animations', href: '/what-we-create/scroll-driven-animations' },
  { label: 'Portfolios', href: '/what-we-create/brand-portfolio-websites' },
];

export default function DynamicIslandNav({ onOpenContact }: DynamicIslandNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const islandRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const refrRef = useRef<HTMLDivElement>(null);
  const cloneRef = useRef<HTMLDivElement>(null);
  const feMapRef = useRef<SVGFEImageElement>(null);
  const feDispRef = useRef<SVGFEDisplacementMapElement>(null);

  // Check if current page is within what-we-create/
  const isWhatWeCreate = Boolean(pathname?.startsWith('/what-we-create'));
  const isLandingPage = pathname === '/';
  const navItems = isWhatWeCreate ? WHAT_WE_CREATE_NAV_ITEMS : DEFAULT_NAV_ITEMS;

  // Initial load welcome animation state for landing page
  const [isWelcome, setIsWelcome] = React.useState(false);

  useEffect(() => {
    if (!isLandingPage) return;

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const startTimer = setTimeout(() => {
      setIsWelcome(true);
    }, 200);

    const endTimer = setTimeout(() => {
      setIsWelcome(false);
    }, 2700);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(endTimer);
    };
  }, [isLandingPage]);

  // Determine contextual wording for collapsed menu button face
  let collapsedLabel = 'Menu';
  if (isWhatWeCreate) {
    const matched = WHAT_WE_CREATE_NAV_ITEMS.find(
      (item) => item.href !== '/' && pathname?.startsWith(item.href)
    );
    if (matched) {
      collapsedLabel = matched.label;
    } else {
      collapsedLabel = 'Services';
    }
  }

  const handleContactClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onOpenContact) {
      onOpenContact(e.currentTarget);
    } else {
      const footerContact = document.getElementById('contact');
      if (footerContact) {
        footerContact.scrollIntoView({ behavior: 'smooth' });
      } else {
        router.push('/#contact');
      }
    }
  };

  useEffect(() => {
    const island = islandRef.current;
    const track = trackRef.current;
    const lens = lensRef.current;
    const refr = refrRef.current;
    const clone = cloneRef.current;
    const fe = feMapRef.current;
    const fd = feDispRef.current;

    if (!island || !track || !lens || !refr || !clone || !fe || !fd) return;

    const items = Array.from(track.querySelectorAll<HTMLAnchorElement>('a'));
    if (!items.length) return;

    const M = 30; // refraction margin around lens (px)
    let W = 0;
    let H = 0;
    let Y = 0;

    // Determine initial active index matching current pathname
    const activeFromPath = navItems.findIndex((item) => {
      if (item.href === '/') return pathname === '/';
      return pathname?.startsWith(item.href);
    });
    let active = activeFromPath >= 0 ? activeFromPath : (isWhatWeCreate ? 1 : 0);
    let lastBuiltW = 0;
    let lastBuiltH = 0;
    let rafId = 0;

    /* magnified copy of the bar that lives inside the lens */
    clone.innerHTML = '';
    const copy = track.cloneNode(true) as HTMLElement;
    copy.removeAttribute('id');
    const cItems = Array.from(copy.querySelectorAll<HTMLAnchorElement>('a'));
    cItems.forEach((a) => {
      a.removeAttribute('href');
      a.tabIndex = -1;
    });
    clone.appendChild(copy);

    const setSel = (on: boolean) => {
      cItems.forEach((a, i) => a.classList.toggle('sel', on && i === active));
    };

    /* displacement map: glass bends the image only near the rim, like a convex lens */
    function buildMap() {
      if (!W || !H || !fe || !fd) return;
      if (W === lastBuiltW && H === lastBuiltH) return;
      lastBuiltW = W;
      lastBuiltH = H;

      const w = Math.round(W + 2 * M);
      const h = Math.round(H + 2 * M);
      const r = Math.min(W, H) * 0.48;
      const bezel = Math.min(W, H) * 0.27;

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
            dx = Math.max(-1, Math.min(1, nx * rim));
            dy = Math.max(-1, Math.min(1, ny * rim));
          }
          const i = (y * w + x) * 4;
          d[i] = Math.round(128 + dx * 127);
          d[i + 1] = Math.round(128 + dy * 127);
          d[i + 2] = 128;
          d[i + 3] = 255;
        }
      }
      cx.putImageData(img, 0, 0);
      const url = cv.toDataURL();
      fe.setAttribute('href', url);
      fe.setAttributeNS('http://www.w3.org/1999/xlink', 'href', url);
      fe.setAttribute('width', String(w));
      fe.setAttribute('height', String(h));
    }

    /* Spring physics state: STABLE, smooth, no drag jitter */
    const st = { x: 0, v: 0, tx: 0, s: 0 };
    const STRETCH = 0.28;
    const KX = 220;
    const CX = 24;
    let running = false;
    let last = 0;

    function render() {
      if (!track || !lens || !clone || !fd) return;
      const speed = st.s;
      const sx = 1 + STRETCH * speed;
      const sy = 1 - 0.08 * speed;
      const pad = items[0].offsetLeft;
      const hw = (W * sx) / 2;
      const cx = Math.max(pad + hw, Math.min(track.offsetWidth - pad - hw, st.x + W / 2));
      const x = cx - W / 2;

      lens.style.transform = `translate3d(${x}px,${Y}px,0) scale(${sx},${sy})`;
      const kx = 1 / sx;
      const ky = 1 / sy;
      const ccx = x + W / 2;
      const ccy = Y + H / 2;
      clone.style.transform = `translate3d(${M + W / 2 - kx * ccx}px,${M + H / 2 - ky * ccy}px,0) scale(${kx},${ky})`;
      fd.setAttribute(
        'scale',
        (8 + 36 * Math.max(0, Math.min(1, st.s))).toFixed(1)
      );
    }

    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 0.033);
      last = now;
      const n = Math.max(1, Math.ceil(dt * 240));
      const h = dt / n;
      for (let i = 0; i < n; i++) {
        st.v += (-KX * (st.x - st.tx) - CX * st.v) * h;
        st.x += st.v * h;
      }
      st.s += (Math.min(Math.abs(st.v) / 1200, 1) - st.s) * Math.min(1, dt * 14);
      render();

      if (
        st.s < 0.01 &&
        Math.abs(st.x - st.tx) < 0.05 &&
        Math.abs(st.v) < 0.5
      ) {
        st.x = st.tx;
        st.v = st.s = 0;
        render();
        running = false;
        setSel(true);
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

    function measure() {
      if (!items[0] || !track || !copy || !lens || !refr) return;
      const measuredW = items[0].offsetWidth;
      const measuredH = items[0].offsetHeight;
      if (!measuredW || !measuredH) return;

      W = measuredW;
      H = measuredH;
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

    function selectItem(i: number, shouldTriggerNav = false) {
      active = i;
      st.tx = items[i].offsetLeft;
      items.forEach((a, n) => {
        if (n === i) {
          a.setAttribute('aria-current', 'page');
        } else {
          a.removeAttribute('aria-current');
        }
      });
      kick();

      if (shouldTriggerNav) {
        island?.classList.remove('open');
        const item = navItems[i];
        if (item.href === '/' && pathname === '/') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          router.push(item.href);
        }
      }
    }

    // Pure click handler: stable, exact, no drag interference
    const clickHandlers = items.map((a, i) => (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      selectItem(i, true);
    });

    items.forEach((a, i) => {
      a.draggable = false;
      a.addEventListener('click', clickHandlers[i]);
    });

    // Tap/Click to toggle open on island face, close on click outside
    const handleIslandClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest('.track, .cta')) {
        island.classList.toggle('open');
      }
    };

    const handleDocClick = (e: MouseEvent) => {
      if (!island.contains(e.target as Node)) {
        island.classList.remove('open');
      }
    };

    island.addEventListener('click', handleIslandClick);
    document.addEventListener('click', handleDocClick);

    /* ResizeObserver to re-measure on dimension changes */
    const ro = new ResizeObserver(() => {
      measure();
    });
    ro.observe(track);
    if (document.fonts?.ready) {
      document.fonts.ready.then(measure);
    }

    measure();
    selectItem(active, false);

    return () => {
      cancelAnimationFrame(rafId);
      items.forEach((a, i) => {
        a.removeEventListener('click', clickHandlers[i]);
      });
      island.removeEventListener('click', handleIslandClick);
      document.removeEventListener('click', handleDocClick);
      ro.disconnect();
    };
  }, [router, pathname, navItems, isWhatWeCreate]);

  return (
    <>
      {/* SVG Optical Displacement Filter for Real-time Glass Refraction */}
      <svg
        width="0"
        height="0"
        style={{ position: 'absolute' }}
        aria-hidden="true"
      >
        <filter
          id="islandLgRefr"
          x="0"
          y="0"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feImage
            ref={feMapRef}
            id="islandLgMap"
            x="0"
            y="0"
            width="100"
            height="100"
            result="m"
          />
          <feDisplacementMap
            ref={feDispRef}
            id="islandLgDisp"
            in="SourceGraphic"
            in2="m"
            scale="58"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      {/* Dynamic Island Navigation Bar */}
      <div
        className={`island-nav-wrap ${isWhatWeCreate ? 'is-services' : ''}`}
        style={{
          '--ew': isWhatWeCreate
            ? 'min(792px, calc(100vw - 24px))'
            : 'min(716px, calc(100vw - 24px))',
          '--iw': '74px',
        } as React.CSSProperties}
      >
        <div
          className={`island ${isWelcome ? 'is-welcome' : ''}`}
          id="island"
          ref={islandRef}
          onMouseEnter={() => {
            if (isWelcome) setIsWelcome(false);
          }}
        >
          <div className="face" aria-hidden="true">
            <span className={`label ${isWelcome ? 'is-welcome-hidden' : ''}`}>
              {collapsedLabel}
            </span>
            {isLandingPage && (
              <span className={`welcome-label ${isWelcome ? 'is-welcome-visible' : ''}`}>
                WELCOME TO SPANYX
              </span>
            )}
          </div>
          <div className="content">
            <div className="stage">
              <nav
                className="track"
                id="track"
                aria-label={isWhatWeCreate ? 'Services Navigation' : 'Main Navigation'}
              >
                {navItems.map((item) => (
                  <a key={item.label} href={item.href}>
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="lens" id="lens" ref={lensRef} aria-hidden="true">
                <div className="refr" id="refr" ref={refrRef}>
                  <div className="clone" id="clone" ref={cloneRef}></div>
                </div>
                <i className="gloss"></i>
              </div>
            </div>
            <button
              className="cta"
              type="button"
              onClick={handleContactClick}
              title="Open Contact Dialog"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
