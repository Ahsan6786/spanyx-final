'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import DynamicIslandNav from '@/components/DynamicIslandNav';
import ContactOverlay, {
  ContactOverlayHandle,
} from '@/components/ContactOverlay';
import { CareerPostingItem } from '@/data/careersData';

interface CareerDetailPageProps {
  posting: CareerPostingItem;
}

export default function CareerDetailPage({ posting }: CareerDetailPageProps) {
  const contactOverlayRef = useRef<ContactOverlayHandle>(null);

  // Tailored Application Form State
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [collegeOrCompany, setCollegeOrCompany] = useState('');
  const [degreeOrRole, setDegreeOrRole] = useState('');
  const [yearOfStudyOrExperience, setYearOfStudyOrExperience] = useState('');
  const [graduationYearOrNotice, setGraduationYearOrNotice] = useState('');
  const [portfolioOrLinkedin, setPortfolioOrLinkedin] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [keySkillsOrArchitecture, setKeySkillsOrArchitecture] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleOpenContact = (buttonEl: HTMLElement) => {
    contactOverlayRef.current?.openFrom(buttonEl);
  };

  const isInternship = posting.posting_type === 'internship';
  const isFresher = posting.posting_type === 'fresher';
  const isFullTime = posting.posting_type === 'full_time';

  const experienceLevel = isInternship
    ? 'Student'
    : isFresher
    ? 'Fresher'
    : 'Experienced Professional';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    // Combine contextual details into current_college_or_company and cover_note
    let institutionDetail = collegeOrCompany.trim();
    if (degreeOrRole.trim()) {
      institutionDetail += ` (${degreeOrRole.trim()})`;
    }

    let combinedNote = coverNote.trim();
    if (keySkillsOrArchitecture.trim()) {
      combinedNote = `Key Strengths / Architecture: ${keySkillsOrArchitecture.trim()}\n\n${combinedNote}`.trim();
    }
    if (yearOfStudyOrExperience.trim()) {
      combinedNote = `Level/Year/Exp: ${yearOfStudyOrExperience.trim()}\n${combinedNote}`.trim();
    }

    try {
      const res = await fetch('/api/careers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          posting_id: posting.id,
          applicant_name: applicantName.trim(),
          applicant_email: applicantEmail.trim(),
          applicant_phone: applicantPhone.trim(),
          experience_level: experienceLevel,
          current_college_or_company: institutionDetail,
          graduation_year: graduationYearOrNotice.trim() || null,
          portfolio_or_linkedin: portfolioOrLinkedin.trim() || null,
          resume_url_or_text: resumeUrl.trim(),
          cover_note: combinedNote || null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(true);
        // Scroll to top of form card
        const formCard = document.getElementById('apply');
        if (formCard) {
          formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        setSubmitError(data.error || 'Failed to submit application. Please review your entries.');
      }
    } catch {
      setSubmitError('A network error occurred while submitting. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to split text by bullet lines or newlines
  const parseBulletList = (text: string | null) => {
    if (!text) return [];
    return text
      .split(/\n|•|;/)
      .map((item) => item.replace(/^[•\-\*\s]+/, '').trim())
      .filter((item) => item.length > 0);
  };

  const responsibilitiesList = parseBulletList(posting.responsibilities);
  const eligibilityList = parseBulletList(posting.eligibility);
  const skillsList = posting.required_skills
    ? posting.required_skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="career-detail-root">
      {/* 1. TOP NAVIGATION: Clean, Minimal, No Logo, Aligned Back Button, Dynamic Island */}
      <header className="careers-top-nav">
        <DynamicIslandNav onOpenContact={handleOpenContact} />
        <div className="careers-top-nav-inner">
          <Link
            href="/careers"
            className="careers-back-btn"
            title="Back to Careers & Opportunities"
            aria-label="Back to Careers & Opportunities"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M11.25 3.75L6 9L11.25 14.25"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          <div className="careers-top-nav-right">
            <button
              type="button"
              className="careers-nav-contact-btn"
              onClick={(e) => handleOpenContact(e.currentTarget)}
            >
              <span>Contact Us</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 12L12 4M12 4H5.5M12 4V10.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN BODY */}
      <main className="career-detail-container">
        {/* Role Header Banner */}
        <section className="career-detail-hero">
          <div className="career-detail-badge-row">
            <span className="career-detail-mode-badge">Remote</span>
            <span className="career-detail-type-badge">
              {isInternship
                ? 'Internship Opportunity'
                : isFresher
                ? 'Fresher Opportunity'
                : 'Full-Time Position'}
            </span>
          </div>

          <h1 className="career-detail-title">{posting.title}</h1>

          <div className="career-detail-meta-bar">
            <div className="career-meta-item">
              <span className="career-meta-label">Department</span>
              <span className="career-meta-val">{posting.department || 'Engineering'}</span>
            </div>
            <div className="career-meta-item">
              <span className="career-meta-label">Location</span>
              <span className="career-meta-val">Remote (Pan-India)</span>
            </div>
            <div className="career-meta-item">
              <span className="career-meta-label">Employment Type</span>
              <span className="career-meta-val">
                {isInternship
                  ? 'Paid Internship (Stipend + Certificate)'
                  : isFresher
                  ? 'Fresher Pathway'
                  : 'Full-Time Employment'}
              </span>
            </div>
          </div>

          <div className="career-detail-cta-row">
            <a href="#apply" className="career-hero-apply-btn">
              <span>Apply for this Role</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M8 3.5V12.5M8 12.5L3.5 8M8 12.5L12.5 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </section>

        {/* Content Layout */}
        <div className="career-detail-layout">
          {/* Left Column: Role Details */}
          <div className="career-detail-info-col">
            {/* Overview */}
            <article className="career-info-card">
              <h2 className="career-info-heading">Role Overview</h2>
              <div className="career-info-body">
                <p>{posting.description}</p>
              </div>
            </article>

            {/* Responsibilities */}
            {responsibilitiesList.length > 0 && (
              <article className="career-info-card">
                <h2 className="career-info-heading">Key Responsibilities</h2>
                <ul className="career-bullets-list">
                  {responsibilitiesList.map((item, idx) => (
                    <li key={idx}>
                      <span className="career-bullet-dot" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            )}

            {/* Eligibility & Qualifications */}
            {eligibilityList.length > 0 && (
              <article className="career-info-card">
                <h2 className="career-info-heading">Eligibility &amp; Requirements</h2>
                <ul className="career-bullets-list">
                  {eligibilityList.map((item, idx) => (
                    <li key={idx}>
                      <span className="career-bullet-dot" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            )}

            {/* Required Skills */}
            {skillsList.length > 0 && (
              <article className="career-info-card">
                <h2 className="career-info-heading">Required Technical Skills</h2>
                <div className="career-skills-tags-wrap">
                  {skillsList.map((skill, idx) => (
                    <span key={idx} className="career-tag-item">
                      {skill}
                    </span>
                  ))}
                </div>
              </article>
            )}

            {/* What Spanyx Offers */}
            <article className="career-info-card">
              <h2 className="career-info-heading">Why Work at Spanyx</h2>
              <div className="career-perks-grid">
                <div className="career-perk-item">
                  <h3 className="career-perk-title">100% Remote Culture</h3>
                  <p className="career-perk-desc">
                    Work from anywhere in India with flexible scheduling and structured sprint delivery.
                  </p>
                </div>
                <div className="career-perk-item">
                  <h3 className="career-perk-title">Production Systems</h3>
                  <p className="career-perk-desc">
                    Ship code directly to production for leading institutions, enterprise clients, and products.
                  </p>
                </div>
                <div className="career-perk-item">
                  <h3 className="career-perk-title">
                    {isInternship ? 'PPO Opportunity' : 'Rapid Merit Growth'}
                  </h3>
                  <p className="career-perk-desc">
                    {isInternship
                      ? 'Top performers receive Pre-Placement Offers (PPOs) for full-time engineering roles.'
                      : 'Clear performance trajectories, modern stack freedom, and high ownership.'}
                  </p>
                </div>
                <div className="career-perk-item">
                  <h3 className="career-perk-title">Direct Mentorship</h3>
                  <p className="career-perk-desc">
                    Collaborate closely with core architects, designers, and software leaders.
                  </p>
                </div>
              </div>
            </article>
          </div>

          {/* Right Column: Tailored Application Form */}
          <div className="career-detail-form-col">
            <div className="career-form-card" id="apply">
              {submitSuccess ? (
                <div className="career-form-success">
                  <div className="career-success-icon">✓</div>
                  <h3 className="career-success-title">Application Submitted!</h3>
                  <p className="career-success-desc">
                    Thank you for applying for <strong>{posting.title}</strong> at SPANYX. Our talent engineering team will review your application and contact you at <strong>{applicantEmail}</strong>.
                  </p>
                  <div className="career-success-actions">
                    <Link href="/careers" className="career-return-btn">
                      Explore Other Opportunities
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="career-tailored-form">
                  <div className="career-form-header">
                    <span className="career-form-eyebrow">
                      {isInternship
                        ? 'Internship Application'
                        : isFresher
                        ? 'Fresher Pathway Application'
                        : 'Full-Time Position Application'}
                    </span>
                    <h2 className="career-form-title">
                      Apply for {posting.title}
                    </h2>
                    <p className="career-form-subtitle">
                      {isInternship
                        ? 'Dedicated internship track with hands-on production engineering. All roles are Remote.'
                        : isFresher
                        ? 'Build your engineering foundation with SPANYX. High autonomy and high ownership.'
                        : 'Join the SPANYX core engineering team delivering mission-critical digital systems.'}
                    </p>
                  </div>

                  {submitError && (
                    <div className="career-form-error">
                      <span>⚠</span> {submitError}
                    </div>
                  )}

                  {/* Shared Contact Fields */}
                  <div className="career-form-row">
                    <div className="career-input-group">
                      <label className="career-label">
                        Full Name <span className="req">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        placeholder="John Doe"
                        className="career-input"
                      />
                    </div>
                  </div>

                  <div className="career-form-row-2col">
                    <div className="career-input-group">
                      <label className="career-label">
                        {isInternship ? 'College / Student Email' : 'Email Address'}{' '}
                        <span className="req">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        placeholder="name@university.edu"
                        className="career-input"
                      />
                    </div>

                    <div className="career-input-group">
                      <label className="career-label">
                        Phone Number <span className="req">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="career-input"
                      />
                    </div>
                  </div>

                  {/* Tailored Fields for Internship */}
                  {isInternship && (
                    <>
                      <div className="career-form-row-2col">
                        <div className="career-input-group">
                          <label className="career-label">
                            College / University <span className="req">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={collegeOrCompany}
                            onChange={(e) => setCollegeOrCompany(e.target.value)}
                            placeholder="e.g. MIT Pune, IIT, VIT, BITS"
                            className="career-input"
                          />
                        </div>

                        <div className="career-input-group">
                          <label className="career-label">
                            Degree &amp; Branch <span className="req">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={degreeOrRole}
                            onChange={(e) => setDegreeOrRole(e.target.value)}
                            placeholder="e.g. B.Tech Computer Science"
                            className="career-input"
                          />
                        </div>
                      </div>

                      <div className="career-form-row-2col">
                        <div className="career-input-group">
                          <label className="career-label">
                            Year of Study <span className="req">*</span>
                          </label>
                          <select
                            required
                            value={yearOfStudyOrExperience}
                            onChange={(e) => setYearOfStudyOrExperience(e.target.value)}
                            className="career-select"
                          >
                            <option value="">Select Year of Study</option>
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="Final Year">Final Year</option>
                            <option value="Recent Graduate">Recent Graduate</option>
                          </select>
                        </div>

                        <div className="career-input-group">
                          <label className="career-label">
                            Expected Graduation Year <span className="req">*</span>
                          </label>
                          <select
                            required
                            value={graduationYearOrNotice}
                            onChange={(e) => setGraduationYearOrNotice(e.target.value)}
                            className="career-select"
                          >
                            <option value="">Select Year</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                            <option value="2028">2028</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="career-input-group">
                        <label className="career-label">
                          GitHub / Portfolio URL
                        </label>
                        <input
                          type="url"
                          value={portfolioOrLinkedin}
                          onChange={(e) => setPortfolioOrLinkedin(e.target.value)}
                          placeholder="https://github.com/yourhandle or portfolio link"
                          className="career-input"
                        />
                      </div>
                    </>
                  )}

                  {/* Tailored Fields for Fresher */}
                  {isFresher && (
                    <>
                      <div className="career-form-row-2col">
                        <div className="career-input-group">
                          <label className="career-label">
                            College &amp; Degree <span className="req">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={collegeOrCompany}
                            onChange={(e) => setCollegeOrCompany(e.target.value)}
                            placeholder="e.g. Pune University (B.E. IT)"
                            className="career-input"
                          />
                        </div>

                        <div className="career-input-group">
                          <label className="career-label">
                            Earliest Joining Date <span className="req">*</span>
                          </label>
                          <select
                            required
                            value={graduationYearOrNotice}
                            onChange={(e) => setGraduationYearOrNotice(e.target.value)}
                            className="career-select"
                          >
                            <option value="">Select Availability</option>
                            <option value="Immediate">Immediate</option>
                            <option value="Within 15 Days">Within 15 Days</option>
                            <option value="Within 1 Month">Within 1 Month</option>
                            <option value="Flexible">Flexible</option>
                          </select>
                        </div>
                      </div>

                      <div className="career-input-group">
                        <label className="career-label">
                          Primary Technical Strengths <span className="req">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={keySkillsOrArchitecture}
                          onChange={(e) => setKeySkillsOrArchitecture(e.target.value)}
                          placeholder="e.g. React, Next.js, Node.js, Python, PostgreSQL"
                          className="career-input"
                        />
                      </div>

                      <div className="career-input-group">
                        <label className="career-label">
                          GitHub / Project Showcase Link <span className="req">*</span>
                        </label>
                        <input
                          type="url"
                          required
                          value={portfolioOrLinkedin}
                          onChange={(e) => setPortfolioOrLinkedin(e.target.value)}
                          placeholder="https://github.com/yourhandle or live project link"
                          className="career-input"
                        />
                      </div>
                    </>
                  )}

                  {/* Tailored Fields for Full-Time */}
                  {isFullTime && (
                    <>
                      <div className="career-form-row-2col">
                        <div className="career-input-group">
                          <label className="career-label">
                            Current Company &amp; Designation
                          </label>
                          <input
                            type="text"
                            value={collegeOrCompany}
                            onChange={(e) => setCollegeOrCompany(e.target.value)}
                            placeholder="e.g. Systems Engineer at Tech Corp"
                            className="career-input"
                          />
                        </div>

                        <div className="career-input-group">
                          <label className="career-label">
                            Total Relevant Experience <span className="req">*</span>
                          </label>
                          <select
                            required
                            value={yearOfStudyOrExperience}
                            onChange={(e) => setYearOfStudyOrExperience(e.target.value)}
                            className="career-select"
                          >
                            <option value="">Select Experience Level</option>
                            <option value="1-2 Years">1-2 Years</option>
                            <option value="2-4 Years">2-4 Years</option>
                            <option value="4-7 Years">4-7 Years</option>
                            <option value="7+ Years">7+ Years</option>
                          </select>
                        </div>
                      </div>

                      <div className="career-form-row-2col">
                        <div className="career-input-group">
                          <label className="career-label">
                            LinkedIn Profile / Portfolio <span className="req">*</span>
                          </label>
                          <input
                            type="url"
                            required
                            value={portfolioOrLinkedin}
                            onChange={(e) => setPortfolioOrLinkedin(e.target.value)}
                            placeholder="https://linkedin.com/in/username"
                            className="career-input"
                          />
                        </div>

                        <div className="career-input-group">
                          <label className="career-label">
                            Notice Period / Availability <span className="req">*</span>
                          </label>
                          <select
                            required
                            value={graduationYearOrNotice}
                            onChange={(e) => setGraduationYearOrNotice(e.target.value)}
                            className="career-select"
                          >
                            <option value="">Select Notice Period</option>
                            <option value="Immediate">Immediate</option>
                            <option value="15 Days">15 Days</option>
                            <option value="30 Days">30 Days</option>
                            <option value="60 Days">60 Days</option>
                            <option value="90 Days">90 Days</option>
                          </select>
                        </div>
                      </div>

                      <div className="career-input-group">
                        <label className="career-label">
                          Key Systems or Architecture You Have Built <span className="req">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={keySkillsOrArchitecture}
                          onChange={(e) => setKeySkillsOrArchitecture(e.target.value)}
                          placeholder="e.g. Distributed microservices, high-traffic APIs, AWS cloud infra"
                          className="career-input"
                        />
                      </div>
                    </>
                  )}

                  {/* Resume Link (All Roles) */}
                  <div className="career-input-group">
                    <label className="career-label">
                      Resume / CV Link (Google Drive / Dropbox / Public PDF) <span className="req">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={resumeUrl}
                      onChange={(e) => setResumeUrl(e.target.value)}
                      placeholder="https://drive.google.com/file/d/... or public PDF link"
                      className="career-input"
                    />
                    <span className="career-input-hint">
                      Make sure link sharing is set to &quot;Anyone with the link can view&quot;.
                    </span>
                  </div>

                  {/* Notes / Statement */}
                  <div className="career-input-group">
                    <label className="career-label">
                      {isInternship
                        ? 'Why do you want to intern at Spanyx?'
                        : isFresher
                        ? 'Tell us about a technical challenge you solved'
                        : 'Anything else you would like us to know?'}
                    </label>
                    <textarea
                      rows={3}
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                      placeholder="Brief note or highlights..."
                      className="career-textarea"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="career-form-actions">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="career-submit-btn"
                    >
                      {isSubmitting ? (
                        <span>Submitting Application...</span>
                      ) : (
                        <span>
                          {isInternship
                            ? 'Submit Internship Application'
                            : isFresher
                            ? 'Submit Fresher Application'
                            : 'Submit Full-Time Application'}
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 3. FOOTER */}
      <Footer onOpenContact={handleOpenContact} />

      {/* 4. CONTACT US OVERLAY */}
      <ContactOverlay ref={contactOverlayRef} />
    </div>
  );
}

