// ============================================================
// SPANYX HERO SECTION INTERACTIVITY & PARALLAX
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const heroCard = document.getElementById('heroCard');
  const longMockupWrap = document.getElementById('longMockupWrap');
  const shortMockupWrap = document.getElementById('shortMockupWrap');

  // Parallax tilt on mouse movement across desktop hero section
  if (heroCard && window.matchMedia('(min-width: 1024px)').matches) {
    heroCard.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xPercent = (x / rect.width - 0.5) * 2; // -1 to 1
      const yPercent = (y / rect.height - 0.5) * 2; // -1 to 1

      // Subtle parallax movement on the mockups
      if (longMockupWrap) {
        longMockupWrap.style.transform = `translate3d(${xPercent * 8}px, ${yPercent * 6}px, 0)`;
      }
      if (shortMockupWrap) {
        shortMockupWrap.style.transform = `translate3d(${xPercent * 4}px, ${yPercent * 3}px, 0)`;
      }
    });

    heroCard.addEventListener('mouseleave', () => {
      if (longMockupWrap) {
        longMockupWrap.style.transform = 'translate3d(0, 0, 0)';
        longMockupWrap.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      }
      if (shortMockupWrap) {
        shortMockupWrap.style.transform = 'translate3d(0, 0, 0)';
        shortMockupWrap.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      }
    });

    heroCard.addEventListener('mouseenter', () => {
      if (longMockupWrap) {
        longMockupWrap.style.transition = 'transform 0.1s ease-out';
      }
      if (shortMockupWrap) {
        shortMockupWrap.style.transition = 'transform 0.1s ease-out';
      }
    });
  }

  // Smooth scroll for anchor buttons
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    if (anchor.closest('#track')) return;
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
});

// ===== Liquid Glass Navbar (from liquid-glass-navbar-v2.html) =====
(() => {
  const $ = (id) => document.getElementById(id);
  const track = $('track'), lens = $('lens'), refr = $('refr'), clone = $('clone'), fe = $('lgMap'), fd = $('lgDisp');
  if (!track || !lens || !refr || !clone || !fe || !fd) return;
  const items = [...track.querySelectorAll('a')];
  const M = 30;                       // refraction margin around the lens (px)
  const PRESS = 0.3;                  // how much the lens grows while pressed
  let W, H, Y, active = 0, down = false, moved = false, startX = 0, lock = false, lockT;

  /* magnified copy of the bar that lives inside the lens */
  const copy = track.cloneNode(true);
  copy.removeAttribute('id');
  copy.querySelectorAll('a').forEach((a) => { a.removeAttribute('href'); a.tabIndex = -1; });
  clone.appendChild(copy);

  /* displacement map: glass bends the image only near the rim, like a convex lens */
  function buildMap() {
    const w = W + 2 * M, h = H + 2 * M, r = Math.min(W, H) * .48, bezel = Math.min(W, H) * .27, A = 0;
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    const cx = cv.getContext('2d'), img = cx.createImageData(w, h), d = img.data;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const px = x + .5 - w / 2, py = y + .5 - h / 2;
      const qx = Math.abs(px) - (W / 2 - r), qy = Math.abs(py) - (H / 2 - r);
      const ox = Math.max(qx, 0), oy = Math.max(qy, 0);
      const depth = -(Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - r);
      let dx = 0, dy = 0;
      if (depth > 0) {
        const e = Math.min(depth / bezel, 1), k = e * e * (3 - 2 * e);   // 0 at rim → 1 inside
        const rim = Math.pow(1 - e, 2);
        let nx, ny;
        if (ox > 0 || oy > 0) { const l = Math.hypot(ox, oy) || 1; nx = ox / l * Math.sign(px); ny = oy / l * Math.sign(py); }
        else if (qx > qy) { nx = Math.sign(px); ny = 0; } else { nx = 0; ny = Math.sign(py); }
        dx = Math.max(-1, Math.min(1, nx * rim - px / (W / 2) * A * k));
        dy = Math.max(-1, Math.min(1, ny * rim - py / (H / 2) * A * k));
      }
      const i = (y * w + x) * 4;
      d[i] = 128 + dx * 127; d[i + 1] = 128 + dy * 127; d[i + 2] = 128; d[i + 3] = 255;
    }
    cx.putImageData(img, 0, 0);
    const url = cv.toDataURL();
    fe.setAttribute('href', url); fe.setAttributeNS('http://www.w3.org/1999/xlink', 'href', url);
    fe.setAttribute('width', w); fe.setAttribute('height', h);
  }

  function measure() {
    W = items[0].offsetWidth; H = items[0].offsetHeight; Y = items[0].offsetTop;
    copy.style.width = track.offsetWidth + 'px'; copy.style.height = track.offsetHeight + 'px';
    lens.style.width = W + 'px'; lens.style.height = H + 'px'; lens.style.borderRadius = Math.min(W, H) * .48 + 'px';
    refr.style.inset = -M + 'px';
    buildMap();
    st.tx = st.x = items[active].offsetLeft; render();
  }

  /* ---------------- spring physics ---------------- */
  const st = { x: 0, v: 0, tx: 0, p: 0, pv: 0, tp: 0, s: 0 };
  const STRETCH = 0.38;               // horizontal stretch at full speed (raise for a longer lens)
  const KX = 190, CX = 20;            // position spring (under-damped → overshoot)
  const KP = 230, CP = 14;            // press spring (bouncy grow / release)
  let running = false, last = 0, lastScaleStr = '', scrollRafId = 0;

  function smoothScrollToTarget(targetEl) {
    cancelAnimationFrame(scrollRafId);
    const startY = window.scrollY;
    const rect = targetEl.getBoundingClientRect();
    const destY = Math.max(0, Math.round(rect.top + startY + 2));
    const diff = destY - startY;
    if (Math.abs(diff) < 2) return;
    const duration = Math.min(820, Math.max(420, Math.abs(diff) * 0.22));
    const startTime = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - startTime) / duration);
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      window.scrollTo(0, Math.round(startY + diff * ease));
      if (t < 1) scrollRafId = requestAnimationFrame(step);
    };
    scrollRafId = requestAnimationFrame(step);
  }

  function render() {
    const speed = st.s;                                            // smoothed speed 0..1 → stretch
    const S = 1 + PRESS * st.p, sx = S * (1 + STRETCH * speed), sy = S * (1 - .1 * speed);
    const pad = items[0].offsetLeft, hw = W * sx / 2;               // keep the lens inside the bar
    const cx = Math.max(pad + hw, Math.min(track.offsetWidth - pad - hw, st.x + W / 2));
    const x = cx - W / 2;
    lens.style.transform = `translate3d(${x}px,${Y}px,0) scale(${sx},${sy})`;
    const kx = S / sx, ky = S / sy, ccx = x + W / 2, ccy = Y + H / 2;   // counter-scale: content never stretches
    clone.style.transform = `translate3d(${M + W / 2 - kx * ccx}px,${M + H / 2 - ky * ccy}px,0) scale(${kx},${ky})`;
    lens.style.setProperty('--p', Math.max(0, Math.min(1, st.p)).toFixed(3));
    const nextScaleStr = (8 + 50 * Math.max(0, Math.min(1.1, Math.max(st.p, st.s)))).toFixed(0);
    if (nextScaleStr !== lastScaleStr) {
      lastScaleStr = nextScaleStr;
      fd.setAttribute('scale', nextScaleStr);
    }
  }
  function frame(now) {
    const dt = Math.min((now - last) / 1000, .033); last = now;
    const n = Math.max(1, Math.ceil(dt * 240)), h = dt / n;
    for (let i = 0; i < n; i++) {
      st.v += (-(down ? 700 : KX) * (st.x - st.tx) - (down ? 45 : CX) * st.v) * h; st.x += st.v * h;
      st.pv += (-KP * (st.p - st.tp) - CP * st.pv) * h; st.p += st.pv * h;
    }
    st.s += (Math.min(Math.abs(st.v) / 1200, 1) - st.s) * Math.min(1, dt * 14);
    render();
    if (st.s < .01 && Math.abs(st.x - st.tx) < .05 && Math.abs(st.v) < .5 && Math.abs(st.p - st.tp) < .002 && Math.abs(st.pv) < .02) {
      st.x = st.tx; st.p = st.tp; st.v = st.pv = st.s = 0; render(); running = false; if (!down) setSel(true);
    } else requestAnimationFrame(frame);
  }
  function kick() { setSel(false); if (!running) { running = true; last = performance.now(); requestAnimationFrame(frame); } }

  /* ---------------- interaction ---------------- */
  items.forEach((a) => { a.draggable = false; });
  track.addEventListener('dragstart', (e) => e.preventDefault());
  const cItems = [...copy.querySelectorAll('a')];
  const setSel = (on) => cItems.forEach((a, i) => a.classList.toggle('sel', on && i === active));
  const minX = () => items[0].offsetLeft, maxX = () => items[items.length - 1].offsetLeft;
  const clampX = (x) => Math.max(minX(), Math.min(maxX(), x));
  const nearest = (x) => items.reduce((b, a, i) => Math.abs(a.offsetLeft - x) < Math.abs(items[b].offsetLeft - x) ? i : b, 0);
  const localX = (e) => e.clientX - track.getBoundingClientRect().left - W / 2;

  function go(i, user) {
    active = i; st.tx = items[i].offsetLeft;
    items.forEach((a, n) => n === i ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
    if (user) {
      lock = true;
      const hash = items[i].hash;
      const target =
        (hash ? document.querySelector(hash) : null) ||
        (hash === '#about' ? document.querySelector('#what-we-do') : null) ||
        (hash === '#services' || hash === '#technology' || hash === '#products'
          ? document.querySelector('#get-started')
          : null);
      if (target) smoothScrollToTarget(target);
      clearTimeout(lockT); lockT = setTimeout(() => lock = false, 900);
    }
    kick();
  }

  track.addEventListener('pointerdown', (e) => {
    down = true; moved = false; startX = e.clientX; track.setPointerCapture(e.pointerId);
    st.tp = 1; st.tx = clampX(localX(e)); kick();
  });
  track.addEventListener('pointermove', (e) => {
    if (!down) return;
    if (Math.abs(e.clientX - startX) > 4) moved = true;
    st.tx = clampX(localX(e)); kick();
  });
  const release = (e) => {
    if (!down) return; down = false; st.tp = 0;
    const targetIdx = moved ? nearest(st.x + st.v * .12) : nearest(clampX(localX(e)));
    go(targetIdx, true);
  };
  track.addEventListener('pointerup', release);
  track.addEventListener('pointercancel', release);
  items.forEach((a, i) => a.addEventListener('click', (e) => { e.preventDefault(); if (e.detail === 0) go(i, true); }));
  items.forEach((a, i) => a.addEventListener('focus', () => { if (!down) go(i, false); }));

  /* scroll spy */
  const io = new IntersectionObserver((es) => {
    if (lock || down) return;
    es.forEach((en) => { if (en.isIntersecting) { const n = items.findIndex((a) => a.hash === '#' + en.target.id); if (n > -1 && n !== active) go(n, false); } });
  }, { rootMargin: '-45% 0px -45% 0px' });
  items.forEach((a) => { const s = a.hash ? document.querySelector(a.hash) : null; s && io.observe(s); });

  new ResizeObserver(measure).observe(track);
  document.fonts?.ready.then(measure);
  go(0, false); measure();
})();

// ===== Contact overlay: expands from the clicked button to a full-screen black page =====
(() => {
  const overlay = document.getElementById('contactOverlay');
  if (!overlay) return;
  const form = document.getElementById('contactForm');
  const thanks = document.getElementById('contactThanks');
  let origin = null, timer;

  const getButtonClipPath = (r) => {
    const pad = 10;
    const fullW = window.innerWidth - pad * 2;
    const fullH = window.innerHeight - pad * 2;
    const top = Math.max(0, Math.round(r.top - pad));
    const left = Math.max(0, Math.round(r.left - pad));
    const right = Math.max(0, Math.round(fullW - (r.right - pad)));
    const bottom = Math.max(0, Math.round(fullH - (r.bottom - pad)));
    const radius = Math.min(22, Math.round(r.height / 2));
    return `inset(${top}px ${right}px ${bottom}px ${left}px round ${radius}px)`;
  };

  const openFrom = (btn) => {
    clearTimeout(timer);
    if (origin && origin !== btn) origin.style.visibility = '';
    origin = btn;
    const r = btn.getBoundingClientRect();
    overlay.style.transition = 'none';
    overlay.classList.remove('full', 'show');
    overlay.style.clipPath = getButtonClipPath(r);
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    void overlay.offsetWidth;                       // commit start state
    overlay.style.transition = '';
    document.body.classList.add('contact-open');
    btn.style.visibility = 'hidden';
    requestAnimationFrame(() => {
      overlay.style.clipPath = 'inset(0px 0px 0px 0px round 22px)';
      overlay.classList.add('full');
      overlay.classList.add('show');
    });
    setTimeout(() => form.querySelector('input').focus({ preventScroll: true }), 650);
  };

  const close = () => {
    if (!origin) return;
    overlay.classList.remove('show');
    const r = origin.getBoundingClientRect();
    overlay.classList.remove('full');
    overlay.style.clipPath = getButtonClipPath(r);
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('contact-open');
    const btn = origin;
    timer = setTimeout(() => {
      overlay.classList.remove('open');
      btn.style.visibility = '';
      origin = null;
    }, 580);
  };

  document.querySelectorAll('#btnContact, #navContactBtn, #showcaseStartProjectBtn, .js-contact-trigger').forEach((b) =>
    b.addEventListener('click', (e) => { e.preventDefault(); e.stopImmediatePropagation(); openFrom(b); }, true));
  document.getElementById('contactClose').addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('[required]').forEach((f) => {
      const bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle('invalid', bad); if (bad) ok = false;
    });
    if (!ok) return;
    thanks.hidden = false; form.reset();
    setTimeout(() => { thanks.hidden = true; close(); }, 1600);
  });
})();

// ============================================================
// STORYTELLING & STACKED SHOWCASE (GSAP SCROLLTRIGGER)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  // 1. Storytelling Section — Starfield & Full-screen black centered gradient text transitions
  const storySection = document.getElementById('what-we-do');
  const storyPinStage = document.getElementById('storyPinStage');
  const starCanvas = document.getElementById('storyStarfieldCanvas');
  const firstText = document.getElementById('storyFirstText');
  const secondText = document.getElementById('storySecondText');

  if (starCanvas && storyPinStage) {
    const ctx = starCanvas.getContext('2d');
    if (ctx) {
      let width = 0, height = 0, dpr = 1, rafId = 0, isVisible = true;
      let microStars = [], crossStars = [];
      let seed = 4219;
      const rand = () => {
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        return seed / 4294967296;
      };

      const buildStars = (w, h) => {
        seed = 4219;
        const count = Math.min(360, Math.max(150, Math.floor((w * h) / 4500)));
        microStars = [];
        for (let i = 0; i < count; i++) {
          const isBright = rand() < 0.06;
          microStars.push({
            x: rand() * w,
            y: rand() * h,
            r: isBright ? 0.75 + rand() * 0.28 : 0.28 + rand() * 0.44,
            baseAlpha: isBright ? 0.42 + rand() * 0.28 : 0.12 + rand() * 0.36,
            amp: isBright ? 0.14 + rand() * 0.18 : 0.07 + rand() * 0.2,
            speed: 0.00045 + rand() * 0.0015,
            phase: rand() * Math.PI * 2,
            tint: rand() > 0.35 ? '255, 255, 255' : '212, 222, 238',
          });
        }
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
        const rect = storyPinStage.getBoundingClientRect();
        width = Math.max(1, Math.floor(rect.width));
        height = Math.max(1, Math.floor(rect.height));
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        starCanvas.width = width * dpr;
        starCanvas.height = height * dpr;
        starCanvas.style.width = `${width}px`;
        starCanvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        buildStars(width, height);
      };

      const drawFrame = (time) => {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < microStars.length; i++) {
          const s = microStars[i];
          const alpha = Math.max(0.03, Math.min(0.95, s.baseAlpha + Math.sin(time * s.speed + s.phase) * s.amp));
          ctx.fillStyle = `rgba(${s.tint}, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
        for (let i = 0; i < crossStars.length; i++) {
          const cs = crossStars[i];
          const pulse = Math.sin(time * cs.speed + cs.phase);
          const alpha = Math.max(0.18, Math.min(1, cs.baseAlpha + pulse * cs.amp));
          const arm = cs.armLength * (0.88 + 0.12 * pulse);
          const haloRadius = cs.coreRadius * 5.2;
          const halo = ctx.createRadialGradient(cs.x, cs.y, 0, cs.x, cs.y, haloRadius);
          halo.addColorStop(0, `rgba(255, 255, 255, ${(alpha * 0.42).toFixed(3)})`);
          halo.addColorStop(0.45, `rgba(210, 225, 250, ${(alpha * 0.12).toFixed(3)})`);
          halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(cs.x, cs.y, haloRadius, 0, Math.PI * 2);
          ctx.fill();

          const hGrad = ctx.createLinearGradient(cs.x - arm, cs.y, cs.x + arm, cs.y);
          hGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          hGrad.addColorStop(0.38, `rgba(255, 255, 255, ${(alpha * 0.22).toFixed(3)})`);
          hGrad.addColorStop(0.5, `rgba(255, 255, 255, ${(alpha * 0.85).toFixed(3)})`);
          hGrad.addColorStop(0.62, `rgba(255, 255, 255, ${(alpha * 0.22).toFixed(3)})`);
          hGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = hGrad;
          ctx.fillRect(cs.x - arm, cs.y - 0.55, arm * 2, 1.1);

          const vGrad = ctx.createLinearGradient(cs.x, cs.y - arm, cs.x, cs.y + arm);
          vGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          vGrad.addColorStop(0.38, `rgba(255, 255, 255, ${(alpha * 0.22).toFixed(3)})`);
          vGrad.addColorStop(0.5, `rgba(255, 255, 255, ${(alpha * 0.85).toFixed(3)})`);
          vGrad.addColorStop(0.62, `rgba(255, 255, 255, ${(alpha * 0.22).toFixed(3)})`);
          vGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = vGrad;
          ctx.fillRect(cs.x - 0.55, cs.y - arm, 1.1, arm * 2);

          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, alpha * 1.1).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(cs.x, cs.y, cs.coreRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      };

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const tick = (time) => {
        if (isVisible) drawFrame(time);
        if (!reducedMotion) rafId = requestAnimationFrame(tick);
      };

      resize();
      drawFrame(0);
      if (!reducedMotion) rafId = requestAnimationFrame(tick);

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((e) => { isVisible = e.isIntersecting; });
      }, { threshold: 0.01 });
      observer.observe(storyPinStage);
      window.addEventListener('resize', resize);
    }
  }

  if (storySection && storyPinStage && firstText && secondText) {
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

    const storyTl = gsap.timeline({
      scrollTrigger: {
        trigger: storySection,
        pin: storyPinStage,
        start: 'top top',
        end: () => `+=${window.innerHeight * 1.8}`,
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    });

    storyTl
      .to({}, { duration: 0.25 })
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
  }

  // 2. Stacked Showcase — What We Create
  const showcaseData = [
    {
      number: '01',
      slug: 'erp-solutions',
      title: 'ERP Solutions',
      subtitle: 'Enterprise resource planning & operational intelligence',
      image: 'erp.jpeg',
    },
    {
      number: '02',
      slug: 'business-websites',
      title: 'Business Websites',
      subtitle: 'High-conversion digital presence for modern enterprises',
      image: 'websites.jpeg',
    },
    {
      number: '03',
      slug: 'scroll-driven-animations',
      title: 'Scroll-Driven Animations',
      subtitle: "Plot twist — you're literally experiencing one right now",
      image: 'scroll1.png',
    },
    {
      number: '04',
      slug: 'brand-portfolio-websites',
      title: 'Brand & Portfolio Websites',
      subtitle: 'Bespoke visual storytelling & luxury brand experiences',
      image: 'brand.jpeg',
    },
    {
      number: '05',
      slug: 'web-applications',
      title: 'Web Applications',
      subtitle: 'Scalable full-stack SaaS platforms & cloud products',
      image: 'WEBAPPS.jpeg',
    },
    {
      number: '06',
      slug: 'trading-fintech-platforms',
      title: 'Trading & FinTech Platforms',
      subtitle: 'Real-time trading terminals, market insights & fintech systems',
      image: 'trading.png',
    },
  ];

  const showcaseSection = document.getElementById('get-started');
  const pinWrap = document.getElementById('showcasePinWrap');
  const cards = Array.from(document.querySelectorAll('.showcase-card'));
  const dims = cards.map((c) => c.querySelector('.showcase-card-dim'));
  const catBtns = Array.from(document.querySelectorAll('.showcase-cat-btn'));
  const counterText = document.getElementById('showcaseCounterText');
  const captionNum = document.getElementById('showcaseCaptionNum');
  const captionTitle = document.getElementById('showcaseCaptionTitle');
  const captionSub = document.getElementById('showcaseCaptionSub');
  const discoverBtn = document.getElementById('showcaseDiscoverBtn');
  const discoverMobileBtn = document.getElementById('showcaseDiscoverMobileBtn');

  if (showcaseSection && pinWrap && cards.length > 0) {
    const total = cards.length;
    let currentIdx = 0;

    const updateActiveUI = (idx) => {
      if (idx === currentIdx) return;
      currentIdx = idx;
      const item = showcaseData[idx];

      if (counterText) counterText.textContent = `${item.number} / 06`;
      if (captionNum) captionNum.textContent = `(${item.number})`;
      if (captionTitle) captionTitle.textContent = item.title;
      if (captionSub) captionSub.textContent = item.subtitle;
      if (discoverBtn) {
        discoverBtn.setAttribute('href', `/what-we-create/${item.slug}`);
        discoverBtn.setAttribute('aria-label', `Discover more about ${item.title}`);
      }
      if (discoverMobileBtn) {
        discoverMobileBtn.setAttribute('href', `/what-we-create/${item.slug}`);
      }
      catBtns.forEach((btn, i) => {
        btn.classList.toggle('is-active', i === idx);
      });
    };

    cards.forEach((card, idx) => {
      gsap.set(card, {
        zIndex: idx + 1,
        yPercent: idx === 0 ? 0 : 112,
        y: 0,
        scale: 1,
        transformOrigin: 'center top',
      });
    });

    dims.forEach((d) => {
      if (d) gsap.set(d, { opacity: 0 });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: showcaseSection,
        pin: pinWrap,
        start: 'top top',
        end: () => `+=${window.innerHeight * (total - 0.35)}`,
        scrub: 0.65,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const rawStep = self.progress * (total - 0.65);
          const nextIdx = Math.min(total - 1, Math.max(0, Math.round(rawStep)));
          updateActiveUI(nextIdx);
        },
      },
    });

    for (let i = 1; i < total; i++) {
      const stepLabel = `card-${i}`;
      tl.addLabel(stepLabel, i - 1);

      tl.to(
        cards[i],
        {
          yPercent: 0,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power2.inOut',
        },
        stepLabel
      );

      for (let j = 0; j < i; j++) {
        const depth = i - j;
        const yOffset = -19 * depth;
        const scaleVal = 1 - 0.044 * depth;
        const dimVal = Math.min(0.58, depth * 0.13);

        tl.to(
          cards[j],
          {
            y: yOffset,
            scale: scaleVal,
            duration: 1,
            ease: 'power2.inOut',
          },
          stepLabel
        );

        if (dims[j]) {
          tl.to(
            dims[j],
            {
              opacity: dimVal,
              duration: 1,
              ease: 'power2.inOut',
            },
            stepLabel
          );
        }
      }
    }

    tl.to({}, { duration: 0.35 });

    const scrollToCard = (targetIdx) => {
      const st = tl.scrollTrigger;
      if (!st) return;
      const totalDuration = total - 1 + 0.35;
      const progress = targetIdx === 0 ? 0 : targetIdx / totalDuration;
      const targetScroll = st.start + (st.end - st.start) * progress;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    };

    catBtns.forEach((btn, idx) => {
      btn.addEventListener('click', () => scrollToCard(idx));
    });
  }
});
