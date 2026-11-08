'use client';

import React, { useState } from 'react';

const SERVICES = [
  'Website Development',
  'Web Application',
  'Mobile App Development',
  'ERP & Management System',
  'UI/UX Design',
  'Custom Software',
  'Other',
];

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const service = String(formData.get('service') || '').trim();
    const message = String(formData.get('message') || '').trim();

    if (!name || !email) {
      setErrorMessage('Please enter your name and email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Collect visitor analytics IDs if present
      let visitorId: string | null = null;
      let sessionId: string | null = null;
      try {
        const vCookie = document.cookie
          .split('; ')
          .find((r) => r.startsWith('spx_vid='));
        if (vCookie) visitorId = vCookie.split('=')[1];
        const sCookie = document.cookie
          .split('; ')
          .find((r) => r.startsWith('spx_sid='));
        if (sCookie) sessionId = sCookie.split('=')[1];
      } catch {}

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          interested_service: service,
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
        }, 5000);
      } else {
        setErrorMessage(data.error || 'Failed to send. Please try again.');
      }
    } catch {
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="spx-contact-section" id="contact" aria-labelledby="contact-heading">
      <div className="spx-contact-container">
        {/* Centered Big Bold Section Heading */}
        <div className="landing-section-header spx-contact-header">
          <h2 id="contact-heading" className="landing-section-title">
            Contact Us
          </h2>
          <p className="landing-section-lead">
            Have a project in mind? Send us a message and we will get back to you within 24 hours.
          </p>
        </div>

        {/* Contact Layout: Form Card + Quick Info */}
        <div className="spx-contact-card">
          <div className="spx-contact-card-grid">
            {/* Left Info Column */}
            <div className="spx-contact-info-col">
              <h3 className="spx-contact-info-title">Let’s talk about your project</h3>
              <p className="spx-contact-info-sub">
                Whether you need a new website, a custom web app, or an enterprise management system, we are here to help.
              </p>

              <div className="spx-contact-details-list">
                <div className="spx-contact-detail-item">
                  <div className="spx-contact-detail-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div>
                    <span className="spx-contact-detail-label">Email Us</span>
                    <a href="mailto:contact@spanyx.in" className="spx-contact-detail-val">
                      contact@spanyx.in
                    </a>
                  </div>
                </div>

                <div className="spx-contact-detail-item">
                  <div className="spx-contact-detail-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <span className="spx-contact-detail-label">Response Time</span>
                    <span className="spx-contact-detail-val">Within 24 hours</span>
                  </div>
                </div>

                <div className="spx-contact-detail-item">
                  <div className="spx-contact-detail-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </div>
                  <div>
                    <span className="spx-contact-detail-label">Availability</span>
                    <span className="spx-contact-detail-val">Remote &amp; Worldwide</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="spx-contact-form-col">
              <form className="spx-contact-form" onSubmit={handleSubmit} noValidate>
                <div className="spx-contact-form-row">
                  <div className="spx-contact-field">
                    <label htmlFor="contact-name">Your Name *</label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      required
                      autoComplete="name"
                      placeholder="e.g. Rahul Sharma"
                    />
                  </div>

                  <div className="spx-contact-field">
                    <label htmlFor="contact-email">Email Address *</label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      placeholder="rahul@company.com"
                    />
                  </div>
                </div>

                <div className="spx-contact-form-row">
                  <div className="spx-contact-field">
                    <label htmlFor="contact-phone">Phone Number</label>
                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div className="spx-contact-field">
                    <label htmlFor="contact-service">Service Interested In</label>
                    <select id="contact-service" name="service" defaultValue="">
                      <option value="" disabled>
                        Select a service...
                      </option>
                      {SERVICES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="spx-contact-field">
                  <label htmlFor="contact-message">How can we help? *</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={4}
                    placeholder="Tell us about what you want to build, your goals, or your timeline..."
                  />
                </div>

                {errorMessage && (
                  <div className="spx-contact-error" role="alert">
                    {errorMessage}
                  </div>
                )}

                {submitSuccess && (
                  <div className="spx-contact-success" role="status">
                    ✓ Thank you! We received your message and will get back to you shortly.
                  </div>
                )}

                <button
                  type="submit"
                  className="spx-contact-submit-btn"
                  disabled={isSubmitting}
                >
                  <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 12L12 4M12 4H5.5M12 4V10.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

