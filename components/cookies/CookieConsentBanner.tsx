'use client';

import React from 'react';

interface CookieConsentBannerProps {
  onAcceptAll: () => void;
  onRejectOptional: () => void;
  onOpenPreferences: () => void;
}

export default function CookieConsentBanner({
  onAcceptAll,
  onRejectOptional,
  onOpenPreferences,
}: CookieConsentBannerProps) {
  return (
    <div
      className="spx-cookie-sheet-backdrop"
      role="region"
      aria-label="Cookie and Privacy Consent"
    >
      <div className="spx-cookie-sheet">
        {/* Title */}
        <h2 className="spx-cookie-sheet-title">We use Cookies</h2>

        {/* Subtitle */}
        <p className="spx-cookie-sheet-desc">
          We use cookies to enhance your browsing experience. By continuing, you agree to our{' '}
          <button
            type="button"
            className="spx-cookie-sheet-link"
            onClick={onOpenPreferences}
          >
            Cookie Policy
          </button>
          .
        </p>

        {/* Realistic Bitten Cookie Illustration Matching Screenshot */}
        <div className="spx-cookie-sheet-visual" aria-hidden="true">
          <svg
            width="136"
            height="136"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="spx-cookie-sheet-svg"
          >
            <defs>
              {/* Soft directional 3D drop shadow for chocolate chips */}
              <filter id="spx-chip-shadow" x="-50%" y="-50%" width="220%" height="220%">
                <feDropShadow dx="3" dy="5" stdDeviation="3" floodColor="#000000" floodOpacity="0.48" />
              </filter>

              {/* Matte silver-grey cookie base gradient */}
              <radialGradient id="spx-cookie-gradient" cx="35%" cy="32%" r="72%">
                <stop offset="0%" stopColor="#f3f4f6" />
                <stop offset="50%" stopColor="#dcdfe3" />
                <stop offset="100%" stopColor="#b4b9c1" />
              </radialGradient>

              {/* Precise bite cutouts on the upper-right edge */}
              <mask id="spx-cookie-bites">
                <rect width="120" height="120" fill="white" />
                <circle cx="89" cy="27" r="14" fill="black" />
                <circle cx="102" cy="44" r="13" fill="black" />
                <circle cx="91" cy="60" r="10" fill="black" />
              </mask>
            </defs>

            {/* Cookie Body with Bite Mask */}
            <circle
              cx="60"
              cy="60"
              r="47"
              fill="url(#spx-cookie-gradient)"
              mask="url(#spx-cookie-bites)"
            />

            {/* 7 Distinct Chocolate Chips with 3D Drop Shadow */}
            <g filter="url(#spx-chip-shadow)" fill="#232326">
              <circle cx="46" cy="38" r="5.8" />
              <circle cx="72" cy="46" r="6.2" />
              <circle cx="34" cy="55" r="6.6" />
              <circle cx="53" cy="58" r="5.9" />
              <circle cx="42" cy="75" r="6.4" />
              <circle cx="60" cy="78" r="6.4" />
              <circle cx="76" cy="68" r="7.0" />
            </g>
          </svg>
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          className="spx-cookie-accept-pill"
          onClick={onAcceptAll}
        >
          Accept cookies
        </button>

        {/* Secondary Action Link */}
        <button
          type="button"
          className="spx-cookie-decline-link"
          onClick={onRejectOptional}
        >
          Decline cookies
        </button>
      </div>
    </div>
  );
}
