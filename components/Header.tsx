'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import MobileFullscreenMenu from './MobileFullscreenMenu';

interface HeaderProps {
  onOpenContact: (buttonEl: HTMLElement) => void;
  alwaysOpen?: boolean;
  showBackButton?: boolean;
  showLogo?: boolean;
  backHref?: string;
}

export default function Header({
  onOpenContact,
  alwaysOpen = false,
  showBackButton = false,
  showLogo = true,
  backHref = '/',
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(alwaysOpen);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Ensure mobile menu is strictly closed on page navigation
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname]);
  const lgWrapperRef = useRef<HTMLDivElement>(null);
  const headerActionsRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const refrRef = useRef<HTMLDivElement>(null);
  const cloneRef = useRef<HTMLDivElement>(null);
  const feMapRef = useRef<SVGFEImageElement>(null);
  const feDispRef = useRef<SVGFEDisplacementMapElement>(null);

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onOpenContact(e.currentTarget);
  };

  // Smoothly trigger lens spring when menu expands
  useEffect(() => {
    if (isMenuOpen) {
      const t = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('spanyx-menu-open'));
      }, 30);
      return () => clearTimeout(t);
    }
  }, [isMenuOpen]);

  // Click outside and Escape key to close expanded menu (disabled when alwaysOpen)
  useEffect(() => {
    if (!isMenuOpen || alwaysOpen) return;
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        lgWrapperRef.current &&
        !lgWrapperRef.current.contains(target) &&
        headerActionsRef.current &&
        !headerActionsRef.current.contains(target)
      ) {
        setIsMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen, alwaysOpen]);

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

    const M = 30; // refraction margin around the lens (px)
    const PRESS = 0.3; // how much the lens grows while pressed
    const isAbout = typeof window !== 'undefined' && window.location.pathname.startsWith('/about');
    let W = 0;
    let H = 0;
    let Y = 0;
    let active = isAbout ? 1 : 0;
    let down = false;
    let startX = 0;
    let lock = false;
    let lockT: ReturnType<typeof setTimeout> | undefined;
    let rafId = 0;

    /* magnified copy of the bar that lives inside the lens */
    clone.innerHTML = '';
    const copy = track.cloneNode(true) as HTMLElement;
    copy.removeAttribute('id');
    copy.querySelectorAll('a').forEach((a) => {
      a.removeAttribute('href');
      a.tabIndex = -1;
    });
    clone.appendChild(copy);

    const cItems = Array.from(copy.querySelectorAll('a'));
    const setSel = (on: boolean) => {
      cItems.forEach((a, i) => a.classList.toggle('sel', on && i === active));
      items.forEach((a, i) => a.classList.toggle('sel', on && i === active));
    };

    let lastBuiltW = 0;
    let lastBuiltH = 0;

    /* displacement map: glass bends the image only near the rim, like a convex lens */
    function buildMap() {
      if (!fe || W <= 0 || H <= 0) return;
      if (W === lastBuiltW && H === lastBuiltH) return;
      lastBuiltW = W;
      lastBuiltH = H;
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
            const k = e * e * (3 - 2 * e); // 0 at rim → 1 inside
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

    /* ---------------- spring physics ---------------- */
    const st = { x: 0, v: 0, tx: 0, p: 0, pv: 0, tp: 0, s: 0 };
    const STRETCH = 0.38; // horizontal stretch at full speed
    const KX = 190;
    const CX = 20; // position spring (under-damped → overshoot)
    const KP = 230;
    const CP = 14; // press spring (bouncy grow / release)
    let running = false;
    let last = 0;
    let lastScaleStr = '';
    let scrollRafId = 0;

    function smoothScrollToTarget(targetEl: Element) {
      cancelAnimationFrame(scrollRafId);
      const startY = window.scrollY;
      const rect = targetEl.getBoundingClientRect();
      // Land 2px inside the section so GSAP ScrollTrigger pins cleanly without oscillating on the 0px seam
      const destY = Math.max(0, Math.round(rect.top + startY + 2));
      const diff = destY - startY;
      if (Math.abs(diff) < 2) return;

      const duration = Math.min(820, Math.max(420, Math.abs(diff) * 0.22));
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        // easeInOutCubic
        const ease =
          t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        window.scrollTo(0, Math.round(startY + diff * ease));
        if (t < 1) {
          scrollRafId = requestAnimationFrame(step);
        }
      };

      scrollRafId = requestAnimationFrame(step);
    }

    function render() {
      if (!track || !lens || !clone || !fd) return;
      const speed = st.s; // smoothed speed 0..1 → stretch
      const S = 1 + PRESS * st.p;
      const sx = S * (1 + STRETCH * speed);
      const sy = S * (1 - 0.1 * speed);
      const pad = items[0].offsetLeft;
      const hw = (W * sx) / 2; // keep the lens inside the bar
      const cx = Math.max(
        pad + hw,
        Math.min(track.offsetWidth - pad - hw, st.x + W / 2)
      );
      const x = cx - W / 2;
      lens.style.transform = `translate3d(${x}px,${Y}px,0) scale(${sx},${sy})`;
      const kx = S / sx;
      const ky = S / sy;
      const ccx = x + W / 2;
      const ccy = Y + H / 2; // counter-scale: content never stretches
      clone.style.transform = `translate3d(${M + W / 2 - kx * ccx}px,${M + H / 2 - ky * ccy}px,0) scale(${kx},${ky})`;
      lens.style.setProperty('--p', Math.max(0, Math.min(1, st.p)).toFixed(3));
      const nextScaleStr = (
        8 +
        50 * Math.max(0, Math.min(1.1, Math.max(st.p, st.s)))
      ).toFixed(1);
      if (nextScaleStr !== lastScaleStr) {
        lastScaleStr = nextScaleStr;
        fd.setAttribute('scale', nextScaleStr);
      }
    }

    function measure() {
      if (!track || !lens || !refr || !items.length) return;
      const firstItem = items[0];
      const measuredW = firstItem.offsetWidth;
      const measuredH = firstItem.offsetHeight;
      if (measuredW > 0) W = measuredW;
      if (measuredH > 0) H = measuredH;
      Y = firstItem.offsetTop;

      // Safe fallbacks to prevent 0x0 invisible lens
      if (W <= 0) W = 88;
      if (H <= 0) H = 64;

      copy.style.width = (track.offsetWidth || 560) + 'px';
      copy.style.height = (track.offsetHeight || 72) + 'px';
      lens.style.width = W + 'px';
      lens.style.height = H + 'px';
      lens.style.borderRadius = Math.min(W, H) * 0.48 + 'px';
      refr.style.inset = -M + 'px';
      buildMap();
      const targetX = items[active]?.offsetLeft || 4;
      st.tx = targetX;
      if (!running && Math.abs(st.x - targetX) > 120) {
        st.x = targetX;
      }
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

    /* ---------------- interaction ---------------- */
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

    let moved = false;

    function go(i: number, user: boolean) {
      active = i;
      st.tx = items[i].offsetLeft;
      items.forEach((a, n) =>
        n === i
          ? a.setAttribute('aria-current', 'page')
          : a.removeAttribute('aria-current')
      );
      if (user) {
        lock = true;
        const href = items[i].getAttribute('href') || '';
        if (href === '/about') {
          if (window.location.pathname.startsWith('/about')) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            // Smooth Apple page transition before navigating
            document.body.classList.add('is-page-navigating');
            setTimeout(() => {
              router.push('/about');
              setTimeout(() => {
                document.body.classList.remove('is-page-navigating');
              }, 400);
            }, 140);
          }
        } else if (href === '/') {
          if (window.location.pathname === '/' || window.location.pathname === '') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            document.body.classList.add('is-page-navigating');
            setTimeout(() => {
              router.push('/');
              setTimeout(() => {
                document.body.classList.remove('is-page-navigating');
              }, 400);
            }, 140);
          }
        } else if (href.includes('#')) {
          const hash = href.split('#')[1];
          const target =
            document.getElementById(hash) ||
            (hash === 'technology' || hash === 'what-we-do'
              ? document.getElementById('what-we-do')
              : null) ||
            (hash === 'services' || hash === 'what-we-create'
              ? document.getElementById('what-we-create')
              : null);
          if (target && (window.location.pathname === '/' || window.location.pathname === '')) {
            smoothScrollToTarget(target);
          } else {
            document.body.classList.add('is-page-navigating');
            setTimeout(() => {
              router.push('/' + (hash ? '#' + hash : ''));
              setTimeout(() => {
                document.body.classList.remove('is-page-navigating');
              }, 400);
            }, 140);
          }
        }
        clearTimeout(lockT);
        lockT = setTimeout(() => {
          lock = false;
        }, 900);
      }
      kick();
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

    const release = () => {
      if (!down) return;
      down = false;
      st.tp = 0;
      const targetIdx = nearest(st.x + st.v * 0.12);
      go(targetIdx, true);
    };

    track.addEventListener('pointerdown', onPointerDown);
    track.addEventListener('pointermove', onPointerMove);
    track.addEventListener('pointerup', release);
    track.addEventListener('pointercancel', release);

    const clickHandlers = items.map((a, i) => {
      const fn = (e: MouseEvent) => {
        e.preventDefault();
        if (e.detail === 0 || active !== i) {
          go(i, true);
        }
        if (!alwaysOpen) {
          setTimeout(() => {
            setIsMenuOpen(false);
          }, 550);
        }
      };
      a.addEventListener('click', fn);
      return fn;
    });

    const focusHandlers = items.map((a, i) => {
      const fn = () => {
        if (!down) go(i, false);
      };
      a.addEventListener('focus', fn);
      return fn;
    });

    const io = new IntersectionObserver(
      (es) => {
        if (lock || down) return;
        es.forEach((en) => {
          if (en.isIntersecting) {
            const id = en.target.id;
            let n = -1;
            if (id === 'hero') n = 0;
            else if (id === 'what-we-do') n = 2;
            else if (id === 'what-we-create') n = 3;
            if (n > -1 && n !== active) go(n, false);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    const heroEl = document.getElementById('hero');
    const techEl = document.getElementById('what-we-do');
    const servEl = document.getElementById('what-we-create');
    if (heroEl) io.observe(heroEl);
    if (techEl) io.observe(techEl);
    if (servEl) io.observe(servEl);

    const ro = new ResizeObserver(measure);
    ro.observe(track);
    if (document.fonts?.ready) {
      document.fonts.ready.then(measure);
    }
    window.addEventListener('resize', measure);

    const onMenuOpen = () => {
      measure();
      st.tx = items[active]?.offsetLeft || 4;
      st.tp = 0.25;
      kick();
      setTimeout(() => {
        st.tp = 0;
        kick();
      }, 100);
    };
    window.addEventListener('spanyx-menu-open', onMenuOpen);

    go(active, false);
    measure();

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(lockT);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('spanyx-menu-open', onMenuOpen);
      track.removeEventListener('dragstart', onDragStart);
      track.removeEventListener('pointerdown', onPointerDown);
      track.removeEventListener('pointermove', onPointerMove);
      track.removeEventListener('pointerup', release);
      track.removeEventListener('pointercancel', release);
      items.forEach((a, i) => {
        a.removeEventListener('click', clickHandlers[i]);
        a.removeEventListener('focus', focusHandlers[i]);
      });
    };
  }, []);

  return (
    <header className="site-header" id="header">
      <svg
        width="0"
        height="0"
        style={{ position: 'absolute' }}
        aria-hidden="true"
      >
        <filter
          id="lgRefr"
          x="0"
          y="0"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feImage
            ref={feMapRef}
            id="lgMap"
            x="0"
            y="0"
            width="100"
            height="100"
            result="m"
          />
          <feDisplacementMap
            ref={feDispRef}
            id="lgDisp"
            in="SourceGraphic"
            in2="m"
            scale="58"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <div className="header-inner">
        <div className={`header-brand-group ${!showLogo ? 'has-no-logo' : ''}`}>
          {showLogo && (
            <a href="/" className="brand-link" aria-label="Spanyx Homepage">
              <img
                src="/span/logo.png"
                alt="Spanyx - Building Smarter Solutions"
                className="brand-logo"
              />
            </a>
          )}
          {showBackButton && (
            <a
              href={backHref}
              className="header-back-link"
              aria-label="Back to home"
              title="Back to home"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M10 3.5L5.5 8L10 12.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          )}
        </div>

        {/* Liquid Glass Dynamic Navbar in center when expanded (Exact UI of liquid-glass-navbar-v2.html) */}
        <div
          className={`lg ${isMenuOpen ? 'is-open' : 'is-closed'}`}
          ref={lgWrapperRef}
          aria-hidden={!isMenuOpen}
        >
          <div className="lg-in" id="lgIn" data-theme="light">
            <nav
              className="track"
              id="track"
              ref={trackRef}
              aria-label="Main"
            >
              <a href="/">
                <svg viewBox="0 0 24 24">
                  <path d="M3 10.5L12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-4.5a1 1 0 0 1-1-1v-4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1H4.5A1.5 1.5 0 0 1 3 19.5v-9z" />
                </svg>
                <span>Home</span>
              </a>
              <a href="/about">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
                <span>About</span>
              </a>
              <a href="/#what-we-do">
                <svg viewBox="0 0 24 24">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <rect x="9" y="9" width="6" height="6" />
                  <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
                </svg>
                <span>Technology</span>
              </a>
              <a href="/#what-we-create">
                <svg viewBox="0 0 24 24">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                <span>Services</span>
              </a>
            </nav>

            <div className="lens" id="lens" ref={lensRef} aria-hidden="true">
              <div className="refr" id="refr" ref={refrRef}>
                <div className="clone" id="clone" ref={cloneRef}></div>
              </div>
              <i className="gloss"></i>
            </div>
          </div>
        </div>

        {/* Right Action Group: Menu Button + Contact Us */}
        <div className="header-actions" ref={headerActionsRef}>
          <button
            type="button"
            className={`header-menu-btn ${isMenuOpen || isMobileNavOpen ? 'is-active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
              if (isMobile) {
                setIsMobileNavOpen((prev) => !prev);
              } else {
                if (!alwaysOpen) {
                  setIsMenuOpen((prev) => !prev);
                }
              }
            }}
            aria-expanded={isMobileNavOpen || isMenuOpen}
            aria-label="Toggle Navigation Menu"
            title="Menu"
          >
            <span className="header-menu-dots" aria-hidden="true">
              <span></span><span></span>
              <span></span><span></span>
              <span></span><span></span>
            </span>
            <span className="header-menu-title">Menu</span>
          </button>

          <a
            href="#contact"
            className="btn-contact-nav"
            id="navContactBtn"
            onClick={handleContactClick}
          >
            <span>Contact Us</span>
            <svg
              className="arrow-icon"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M3.75 9H14.25M14.25 9L9.75 4.5M14.25 9L9.75 13.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Full-Screen Black Mobile Navigation Menu (Matching Reference UI) */}
      <MobileFullscreenMenu
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        onOpenContact={onOpenContact}
      />
    </header>
  );
}

