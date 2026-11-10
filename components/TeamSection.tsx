'use client';

import React from 'react';

export interface TeamMember {
  name: string;
  image?: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Shiv Sutar',
    image: '/team/shiv-sutar.webp',
  },
  {
    name: 'Poonam Bhosale',
    image: '/team/poonam-bhosale.webp',
  },
  {
    name: 'Ahsan Imam Khan',
    image: '/team/ahsan-imam-khan.webp',
  },
];

interface TeamSectionProps {
  id?: string;
  className?: string;
  title?: string;
  subtitle?: string;
}

export default function TeamSection({
  id = 'team',
  className = '',
  title = 'The Minds Behind SPANYX',
  subtitle = 'The engineers, designers, and strategists crafting dependable digital experiences.',
}: TeamSectionProps) {
  return (
    <section className={`about-team-section ${className}`} id={id} aria-labelledby={`${id}-title`}>
      <div className="about-team-container">
        {/* Section Header */}
        <div className="landing-section-header about-team-header">
          <h2 id={`${id}-title`} className="landing-section-title about-team-title">
            {title}
          </h2>
          {subtitle && (
            <p className="landing-section-lead about-team-subtitle">
              {subtitle}
            </p>
          )}
        </div>

        {/* 3-Column Team Grid */}
        <div className="about-team-grid" role="list" aria-label="Team members">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.name} className="about-team-card" role="listitem">
              {/* Member Portrait */}
              <div className="about-team-photo-wrap">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="about-team-photo-img"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="about-team-photo-placeholder"
                    aria-label={`Photograph placeholder for ${member.name}`}
                  >
                    <div className="about-team-avatar-inner">
                      <div className="about-team-avatar-icon">
                        <svg
                          width="54"
                          height="54"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Member Name */}
              <div className="about-team-info">
                <h3 className="about-team-name">{member.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
