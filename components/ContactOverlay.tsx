'use client';

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

export interface ContactOverlayHandle {
  openFrom: (btn: HTMLElement) => void;
}

const AVAILABLE_SERVICES = [
  'Website Development',
  'Web Application Development',
  'Mobile App Development',
  'UI/UX Design',
  'AI & Machine Learning',
  'SaaS Development',
  'Cloud & DevOps',
  'Digital Transformation',
  'Custom Software Development',
  'Other',
];

const ContactOverlay = forwardRef<ContactOverlayHandle>(
  function ContactOverlay(_, ref) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const originRef = useRef<HTMLElement | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [mounted, setMounted] = useState(false);

    // Form state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
      setMounted(true);
    }, []);

    // Compute GPU clip-path inset matching the clicked button's exact screen coordinates
    const getButtonClipPath = (r?: DOMRect | null) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      if (!r || (r.width === 0 && r.height === 0)) {
        return `inset(50% 50% 50% 50% round 0px)`;
      }

      const top = Math.max(0, Math.min(vh, Math.round(r.top)));
      const left = Math.max(0, Math.min(vw, Math.round(r.left)));
      const right = Math.max(0, Math.min(vw, Math.round(vw - r.right)));
      const bottom = Math.max(0, Math.min(vh, Math.round(vh - r.bottom)));
      const radius = Math.min(24, Math.max(0, Math.round(r.height / 2)));

      return `inset(${top}px ${right}px ${bottom}px ${left}px round ${radius}px)`;
    };

    const close = useCallback(() => {
      const overlay = overlayRef.current;
      const origin = originRef.current;
      if (!overlay || !origin) return;

      overlay.classList.remove('show');
      const r = origin.getBoundingClientRect();
      overlay.classList.remove('full');
      overlay.style.clipPath = getButtonClipPath(r);
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('contact-open');
      const btn = origin;
      timerRef.current = setTimeout(() => {
        overlay.classList.remove('open');
        btn.style.visibility = '';
        originRef.current = null;
      }, 620);
    }, []);

    const openFrom = useCallback((btn: HTMLElement) => {
      const overlay = overlayRef.current;
      if (!overlay) return;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (originRef.current && originRef.current !== btn) {
        originRef.current.style.visibility = '';
      }
      originRef.current = btn;

      const r = btn.getBoundingClientRect();
      const startClip = getButtonClipPath(r);

      overlay.style.transition = 'none';
      overlay.classList.remove('full', 'show');
      overlay.style.clipPath = startClip;
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      void overlay.offsetWidth;

      overlay.style.transition = '';
      document.body.classList.add('contact-open');
      btn.style.visibility = 'hidden';

      requestAnimationFrame(() => {
        // Full screen expansion with completely opened square corners
        overlay.style.clipPath = 'inset(0px 0px 0px 0px round 0px)';
        overlay.classList.add('full');
        overlay.classList.add('show');
      });

      setTimeout(() => {
        const firstInput = formRef.current?.querySelector('input');
        firstInput?.focus({ preventScroll: true });
      }, 650);
    }, []);

    useImperativeHandle(ref, () => ({ openFrom }), [openFrom]);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          close();
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }, [close]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = formRef.current;
      if (!form) return;

      setErrorMessage('');
      let hasError = false;

      // Validate required inputs
      form
        .querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('[required]')
        .forEach((f) => {
          const bad =
            !f.value.trim() ||
            (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
          f.classList.toggle('invalid', bad);
          if (bad) hasError = true;
        });

      if (hasError) {
        setErrorMessage('Please fill in all required fields.');
        return;
      }

      setIsSubmitting(true);

      const formData = new FormData(form);
      const name = formData.get('name') as string;
      const email = formData.get('email') as string;
      const phone = formData.get('phone') as string;
      const service = formData.get('service') as string;
      const budget = formData.get('budget') as string;
      const message = formData.get('message') as string;

      const visitorId = typeof window !== 'undefined' ? localStorage.getItem('spx_vid') : null;
      const sessionId = typeof window !== 'undefined' ? localStorage.getItem('spx_sid') : null;

      try {
        const res = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            phone,
            interested_service: service,
            budget,
            message,
            visitor_id: visitorId,
            session_id: sessionId,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setSubmitSuccess(true);
          form.reset();
          setTimeout(() => {
            setSubmitSuccess(false);
            close();
          }, 1800);
        } else {
          setErrorMessage(data.error || 'Submission failed. Please try again.');
        }
      } catch (err) {
        console.error('Lead submission network error:', err);
        setErrorMessage('Network connection error. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    };

    if (!mounted) return null;

    return createPortal(
      <div
        className="contact-overlay"
        id="contactOverlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contactTitle"
        aria-hidden="true"
        ref={overlayRef}
      >
        <button
          className="contact-close"
          id="contactClose"
          aria-label="Close contact form"
          onClick={close}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M3 3L15 15M15 3L3 15"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="contact-inner">
          {/* Left Column: Heading, Description & Concise Value Statement */}
          <div className="contact-left">
            <h2 id="contactTitle">Let’s Build Something Together</h2>
            <p className="contact-quote" style={{ fontSize: 15, lineHeight: 1.55, marginBottom: 22, color: 'rgba(255, 255, 255, 0.88)', fontWeight: 400 }}>
              Tell us about your project, and let’s explore how Spanyx can bring your ideas to life.
            </p>

            <ul className="contact-points">
              <li>
                <span className="pt-icon">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8.5L6.5 12L13 4.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <p>
                  Rapid concept-to-deployment engineering with precision architecture and design.
                </p>
              </li>
              <li>
                <span className="pt-icon">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8.8 1.5L3 9h4.2l-.8 5.5L13 7H8.8l0-5.5z"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <p>
                  High-performance web apps, AI systems, cloud infrastructure, and custom software.
                </p>
              </li>
            </ul>

            <div className="contact-divider" style={{ margin: '22px 0' }}></div>
            <p className="contact-brand" style={{ marginTop: 0 }}>
              Spanyx &middot; Building smarter solutions
            </p>
          </div>

          {/* Right Column: Clean, Compact, Laptop-Responsive Form */}
          <form
            className="contact-form"
            id="contactForm"
            noValidate
            ref={formRef}
            onSubmit={handleSubmit}
          >
            {/* Row 1: Full Name * & Work Email * */}
            <div className="row contact-form-row">
              <label className="half">
                FULL NAME *
                <input type="text" name="name" required autoComplete="name" placeholder="John Doe" />
              </label>

              <label className="half">
                WORK EMAIL *
                <input type="email" name="email" required autoComplete="email" placeholder="john@company.com" />
              </label>
            </div>

            {/* Row 2: Phone Number & Project Budget (Starting from $3,000) */}
            <div className="row contact-form-row">
              <label className="half">
                PHONE NUMBER
                <input type="tel" name="phone" autoComplete="tel" placeholder="+1 (555) 000-0000" />
              </label>

              <label className="half">
                PROJECT BUDGET
                <select name="budget" defaultValue="$3,000 - $5,000">
                  <option value="$3,000 - $5,000">$3,000 - $5,000</option>
                  <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                  <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                  <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                  <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                  <option value="$100,000+">$100,000+</option>
                  <option value="Flexible / Open">Flexible / Open</option>
                </select>
              </label>
            </div>

            {/* Services Interested In * (Dropdown) */}
            <label>
              SERVICES INTERESTED IN *
              <select name="service" required defaultValue="">
                <option value="" disabled>Select a service of interest...</option>
                {AVAILABLE_SERVICES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>

            {/* Project Details */}
            <label>
              PROJECT DETAILS / ANYTHING ELSE?
              <textarea
                name="message"
                rows={3}
                placeholder="Share your goals, timeline, technical requirements, or any specific challenges..."
              />
            </label>

            {errorMessage && (
              <p className="contact-error-msg">{errorMessage}</p>
            )}

            <button type="submit" className="contact-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending Inquiry...' : 'Send Project Inquiry'}
            </button>

            {submitSuccess && (
              <p className="contact-thanks" id="contactThanks">
                ✓ Thanks! We&apos;ve received your project inquiry and will be in touch shortly.
              </p>
            )}
          </form>
        </div>
      </div>,
      document.body
    );
  }
);

export default ContactOverlay;
