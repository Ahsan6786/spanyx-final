'use client';

import React, { useEffect, useRef } from 'react';

interface TabItem {
  id: 'privacy' | 'terms';
  title: string;
}

const TABS: TabItem[] = [
  { id: 'privacy', title: 'Privacy Policy' },
  { id: 'terms', title: 'Terms & Conditions' },
];

interface LiquidGlassLegalTabsProps {
  activeTab: 'privacy' | 'terms';
  onSelectTab: (tab: 'privacy' | 'terms') => void;
}

export default function LiquidGlassLegalTabs({
  activeTab,
  onSelectTab,
}: LiquidGlassLegalTabsProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const refrRef = useRef<HTMLDivElement>(null);
  const cloneRef = useRef<HTMLDivElement>(null);

  const activeIndex = activeTab === 'privacy' ? 0 : 1;
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  const onSelectTabRef = useRef(onSelectTab);
  onSelectTabRef.current = onSelectTab;

  // External controller ref to trigger glide on prop changes
  const slideToTabRef = useRef<((idx: number) => void) | null>(null);

  useEffect(() => {
    if (slideToTabRef.current) {
      slideToTabRef.current(activeIndex);
    }
  }, [activeIndex]);

  useEffect(() => {
    const trackEl = trackRef.current;
    const lensEl = lensRef.current;
    const refrEl = refrRef.current;
    const cloneEl = cloneRef.current;
    const feEl = document.getElementById('lgLegalMap') as SVGElement | null;
    const fdEl = document.getElementById('lgLegalDisp') as SVGElement | null;

    if (!trackEl || !lensEl || !refrEl || !cloneEl || !feEl || !fdEl) return;

    const track = trackEl;
    const lens = lensEl;
    const refr = refrEl;
    const clone = cloneEl;
    const fe = feEl;
    const fd = fdEl;

    const items = Array.from(track.querySelectorAll<HTMLButtonElement>('.lg-tab-btn'));
    if (items.length < 2) return;

    // Clone track inside the lens for magnified refraction
    clone.innerHTML = '';
    const copy = track.cloneNode(true) as HTMLDivElement;
    copy.removeAttribute('id');
    copy.querySelectorAll<HTMLButtonElement>('.lg-tab-btn').forEach((btn) => {
      btn.tabIndex = -1;
      btn.setAttribute('aria-hidden', 'true');
    });
    clone.appendChild(copy);

    const cItems = Array.from(copy.querySelectorAll<HTMLButtonElement>('.lg-tab-btn'));

    const M = 28; // refraction margin around lens (px)
    const PRESS = 0.28; // growth when pressed
    const STRETCH = 0.32; // stretch at speed
    const KX = 220, CX = 24; // position spring
    const KP = 260, CP = 18; // press spring

    let W = 0, H = 0, Y = 0;
    let trackLeft = 0;
    let down = false;
    let moved = false;
    let startX = 0;
    let running = false;
    let last = 0;

    const st = {
      x: 0,
      v: 0,
      tx: 0,
      p: 0,
      pv: 0,
      tp: 0,
      s: 0,
    };

    function setSel(on: boolean) {
      cItems.forEach((btn, i) => {
        btn.classList.toggle('is-sel', on && i === activeIndexRef.current);
      });
      items.forEach((btn, i) => {
        btn.classList.toggle('is-active', i === activeIndexRef.current);
      });
    }

    function buildMap() {
      if (W <= 0 || H <= 0) return;
      const w = W + 2 * M;
      const h = H + 2 * M;
      const r = Math.min(W, H) * 0.48;
      const bezel = Math.min(W, H) * 0.28;
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
          let dx = 0, dy = 0;

          if (depth > 0) {
            const e = Math.min(depth / bezel, 1);
            const k = e * e * (3 - 2 * e);
            const rim = Math.pow(1 - e, 2);
            let nx = 0, ny = 0;
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

          const i = (y * w + x) * 4;
          d[i] = 128 + dx * 127;
          d[i + 1] = 128 + dy * 127;
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

    function render() {
      const speed = st.s;
      const S = 1 + PRESS * st.p;
      const sx = S * (1 + STRETCH * speed);
      const sy = S * (1 - 0.1 * speed);
      const pad = items[0].offsetLeft;
      const hw = (W * sx) / 2;
      const cx = Math.max(pad + hw, Math.min(track.offsetWidth - pad - hw, st.x + W / 2));
      const x = cx - W / 2;

      lens.style.transform = `translate3d(${x}px,${Y}px,0) scale(${sx},${sy})`;
      const kx = S / sx;
      const ky = S / sy;
      const ccx = x + W / 2;
      const ccy = Y + H / 2;

      clone.style.transform = `translate3d(${M + W / 2 - kx * ccx}px,${M + H / 2 - ky * ccy}px,0) scale(${kx},${ky})`;
      lens.style.setProperty('--p', Math.max(0, Math.min(1, st.p)).toFixed(3));
      fd.setAttribute(
        'scale',
        (8 + 50 * Math.max(0, Math.min(1.1, Math.max(st.p, st.s)))).toFixed(1)
      );
    }

    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 0.033);
      last = now;
      const n = Math.max(1, Math.ceil(dt * 240));
      const h = dt / n;

      for (let i = 0; i < n; i++) {
        st.v += (-(down ? 1100 : KX) * (st.x - st.tx) - (down ? 50 : CX) * st.v) * h;
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
        st.v = 0;
        st.pv = 0;
        st.s = 0;
        render();
        running = false;
        if (!down) setSel(true);
      } else {
        requestAnimationFrame(frame);
      }
    }

    function kick() {
      setSel(false);
      if (!running) {
        running = true;
        last = performance.now();
        requestAnimationFrame(frame);
      }
    }

    const minX = () => items[0].offsetLeft;
    const maxX = () => items[items.length - 1].offsetLeft;
    const clampX = (x: number) => Math.max(minX(), Math.min(maxX(), x));

    function measure() {
      if (!items[0]) return;
      W = items[0].offsetWidth;
      H = items[0].offsetHeight;
      Y = items[0].offsetTop;

      trackLeft = track.getBoundingClientRect().left;

      copy.style.width = track.offsetWidth + 'px';
      copy.style.height = track.offsetHeight + 'px';

      lens.style.width = W + 'px';
      lens.style.height = H + 'px';
      lens.style.borderRadius = Math.min(W, H) * 0.48 + 'px';
      refr.style.inset = -M + 'px';

      buildMap();
      const curr = items[activeIndexRef.current] || items[0];
      st.tx = st.x = curr.offsetLeft;
      render();
      setSel(true);
    }

    slideToTabRef.current = (idx: number) => {
      if (!items[idx]) return;
      st.tx = items[idx].offsetLeft;
      kick();
    };

    // Pointer event handlers for draggable liquid glass interaction
    const handlePointerDown = (e: PointerEvent) => {
      // Prevent default to disable native browser gestures / text selection
      e.preventDefault();
      down = true;
      moved = false;
      startX = e.clientX;
      track.classList.add('is-dragging');

      try {
        track.setPointerCapture(e.pointerId);
      } catch {}

      trackLeft = track.getBoundingClientRect().left;
      st.tp = 1;
      st.tx = clampX(e.clientX - trackLeft - W / 2);
      kick();
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = Math.abs(e.clientX - startX);
      if (dx > 4) moved = true;

      st.tx = clampX(e.clientX - trackLeft - W / 2);
      kick();
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!down) return;
      down = false;
      st.tp = 0;
      track.classList.remove('is-dragging');

      try {
        track.releasePointerCapture(e.pointerId);
      } catch {}

      let targetIdx = 0;
      if (moved) {
        // Snapping based on where the drag was released (midpoint between tab 0 and tab 1)
        const midX = (items[0].offsetLeft + items[1].offsetLeft) / 2;
        const currentCenter = st.x + st.v * 0.15;
        targetIdx = currentCenter > midX ? 1 : 0;
      } else {
        // Direct click/tap on left or right half
        const clickX = e.clientX - trackLeft;
        const midX = (items[0].offsetLeft + items[1].offsetLeft) / 2 + W / 2;
        targetIdx = clickX > midX ? 1 : 0;
      }

      st.tx = items[targetIdx].offsetLeft;
      kick();

      const selectedTab = TABS[targetIdx].id;
      if (onSelectTabRef.current) {
        onSelectTabRef.current(selectedTab);
      }
    };

    const handlePointerCancel = () => {
      if (!down) return;
      down = false;
      st.tp = 0;
      track.classList.remove('is-dragging');
      st.tx = items[activeIndexRef.current].offsetLeft;
      kick();
    };

    track.addEventListener('pointerdown', handlePointerDown);
    track.addEventListener('pointermove', handlePointerMove);
    track.addEventListener('pointerup', handlePointerUp);
    track.addEventListener('pointercancel', handlePointerCancel);
    track.addEventListener('dragstart', (e) => e.preventDefault());

    const ro = new ResizeObserver(measure);
    ro.observe(track);
    measure();

    return () => {
      ro.disconnect();
      track.removeEventListener('pointerdown', handlePointerDown);
      track.removeEventListener('pointermove', handlePointerMove);
      track.removeEventListener('pointerup', handlePointerUp);
      track.removeEventListener('pointercancel', handlePointerCancel);
      slideToTabRef.current = null;
    };
  }, []);

  return (
    <>
      {/* SVG Displacement Filter for Liquid Lens */}
      <svg
        width="0"
        height="0"
        style={{ position: 'absolute', pointerEvents: 'none', opacity: 0 }}
        aria-hidden="true"
      >
        <filter
          id="lgLegalRefr"
          x="0"
          y="0"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feImage id="lgLegalMap" x="0" y="0" width="100" height="100" result="m" />
          <feDisplacementMap
            id="lgLegalDisp"
            in="SourceGraphic"
            in2="m"
            scale="58"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      {/* Liquid Glass Legal Tabs Container */}
      <div className="lg-legal-wrapper" role="tablist" aria-label="Legal document tabs">
        <div className="lg-in" data-theme="light">
          <nav
            className="track"
            ref={trackRef}
            aria-label="Legal documents"
          >
            {TABS.map((tab, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`lg-tab-btn ${isActive ? 'is-active' : ''}`}
                  role="tab"
                  aria-selected={isActive}
                >
                  <span>{tab.title}</span>
                </button>
              );
            })}
          </nav>

          {/* Liquid Glass Lens */}
          <div className="lens" ref={lensRef} aria-hidden="true">
            <div className="refr" ref={refrRef}>
              <div className="clone" ref={cloneRef} />
            </div>
            <i className="gloss" />
          </div>
        </div>
      </div>
    </>
  );
}
