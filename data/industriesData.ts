export interface IndustryCapability {
  title: string;
  description: string;
}

export interface IndustryApproachStep {
  title: string;
  description: string;
}

export interface GrowthSolutionCard {
  title: string;
  items: string[];
}

export interface IndustryFaq {
  question: string;
  answer: string;
}

export interface IndustryDetail {
  id: string;
  slug: string;
  name: string;
  iconSrc: string;
  subtitle: string;
  image: string;
  heroHeadline: string;
  heroIntro: string;
  keyHighlights: string[];
  aboutHeadline: string;
  aboutLead: string;
  aboutBody: string[];
  capabilitiesIntro: string;
  capabilities: IndustryCapability[];
  approachIntro: string;
  approach: IndustryApproachStep[];
  growthSolutions?: GrowthSolutionCard[];
  faqs?: IndustryFaq[];
  ctaHeadline: string;
  ctaSubtext: string;
}

export const INDUSTRIES_DATA: IndustryDetail[] = [
  {
    "id": "real-estate",
    "slug": "real-estate",
    "name": "Real Estate",
    "iconSrc": "/industries/real-estate.svg",
    "subtitle": "High-performance property portals, broker workflows, and automated lease systems",
    "image": "/industries/real-estate.png",
    "heroHeadline": "Modern software architectures engineered for modern real estate portfolios.",
    "heroIntro": "We engineer custom real estate platforms that streamline property discovery, agent commissions, and lease operations. From MLS integrations to tenant self-service portals, our systems give developers, brokerages, and property managers total visibility.",
    "keyHighlights": [
      "Real-time MLS & IDX property synchronization",
      "Automated tenant lease & documentation pipelines",
      "Broker commissions & transaction tracking",
      "High-speed interactive property search & map filters"
    ],
    "aboutHeadline": "Eliminate fragmented spreadsheets and sluggish legacy property management systems.",
    "aboutLead": "Commercial brokerages and multi-property managers often lose time wrangling fragmented listings, missed lease expiries, and delayed commission payouts across disconnected tools.",
    "aboutBody": [
      "At SPANYX, we build end-to-end real estate software tailored to how your firm closes deals and manages units. We build unified dashboards where property managers track maintenance tickets, digital lease signings, payment histories, and vacancy rates in real time.",
      "Our platforms support role-based permissions for brokers, buyers, tenants, and property accountants—ensuring smooth transactions, instant lead routing, and dependable compliance."
    ],
    "capabilitiesIntro": "Engineered capabilities to automate property discovery and portfolio management.",
    "capabilities": [
      {
        "title": "Centralized Property & Unit Inventory",
        "description": "Track residential and commercial listings, unit availability, floor plans, and pricing updates in real-time across multiple web channels."
      },
      {
        "title": "Broker CRM & Lead Routing",
        "description": "Automatically capture leads from portals, assign inquiries to brokers based on territory or price band, and track pipeline velocity."
      },
      {
        "title": "Digital Leases & Document Vault",
        "description": "Generate compliant lease agreements, collect e-signatures, and store tenant KYC documentation securely in encrypted cloud storage."
      },
      {
        "title": "Tenant & Owner Self-Service Portals",
        "description": "Give tenants an intuitive portal to pay rent, submit maintenance tickets, and track lease renewals, while owners view monthly payout statements."
      },
      {
        "title": "Financial & Commission Tracking",
        "description": "Automate agent commission splits, track security deposits, manage escrow workflows, and export clean financial summaries for accounting."
      },
      {
        "title": "Map-Driven Search & Virtual Tours",
        "description": "Deliver blazing-fast spatial search, polygonal map filtering, neighborhood analytics, and immersive virtual tour embeds for prospective buyers."
      }
    ],
    "approachIntro": "Domain-specific operational workflow from listing ingestion to lease settlement.",
    "approach": [
      {
        "title": "01 Listing Ingestion & MLS Normalization",
        "description": "Connect MLS/IDX data streams and direct builder feeds into a unified schema, deduplicating listings, standardizing unit parameters, and syncing geospatial metadata."
      },
      {
        "title": "02 Intelligent Broker Lead Routing & Virtual Tours",
        "description": "Capture prospective buyer and tenant inquiries through high-speed polygonal map searches, scoring buyer intent and routing high-value leads to localized brokers instantly."
      },
      {
        "title": "03 Digital Lease Drafting & KYC Document Vault",
        "description": "Generate jurisdiction-compliant lease contracts automatically, enforce tenant identity verification, and collect legally binding e-signatures with cryptographic audit trails."
      },
      {
        "title": "04 Escrow Settlements, Commission Splits & Automated Rent Ledger",
        "description": "Automate recurring rent collections through integrated payment gateways, calculate broker split commissions, and disburse owner payouts with automated accounting reconciliation."
      }
    ],
    "growthSolutions": [
      {
        "title": "PropTech Strategy",
        "items": [
          "Comprehensive Real Estate Technology Audit",
          "MLS & IDX Syndication Architecture",
          "Broker Commission & Split Modeling",
          "Tenant Lifecycle & Retention Blueprint",
          "Local Real Estate SEO Roadmap",
          "Multi-Branch Agency Governance"
        ]
      },
      {
        "title": "Engineering & Portals",
        "items": [
          "High-Speed Headless Property Search",
          "Interactive GIS & Polygonal Map Filters",
          "Automated Digital Lease Generation",
          "Role-Based Broker & Tenant Dashboards",
          "REST & GraphQL Property Feed APIs",
          "Cloud-Native Scalable Infrastructure"
        ]
      },
      {
        "title": "Design & Experience",
        "items": [
          "Luxury Architectural Brand Identity",
          "High-Conversion Listing Detail Layouts",
          "Interactive Floor Plan & 3D Tour Embeds",
          "Mobile-First Tenant & Owner UX",
          "Visual Unit Availability Matrices",
          "Dark-Mode Luxury Showcase Themes"
        ]
      },
      {
        "title": "Acquisition & Lead Gen",
        "items": [
          "Geo-Targeted Local Property SEO",
          "High-Intent Buyer Ad Campaign Funnels",
          "Dynamic Retargeting on Viewed Units",
          "Automated SMS & WhatsApp Lead Alerts",
          "Email Nurture Sequences for Investors",
          "Broker Authority Thought Leadership"
        ]
      },
      {
        "title": "Telemetry & Analytics",
        "items": [
          "Unit View Duration & Engagement Metrics",
          "Broker Response Time Telemetry",
          "Price Elasticity & Demand Analytics",
          "Tenant Rent Default Risk Scoring",
          "Neighborhood Velocity Heatmaps",
          "End-to-End Deal Conversion Funnels"
        ]
      },
      {
        "title": "Compliance & Security",
        "items": [
          "KYC & AML Verification for High-Value Sales",
          "Encrypted Lease Document Vaults",
          "Role-Based Broker Access Controls",
          "Audit Trails for Contract Amendments",
          "PCI-DSS Compliant Deposit Escrow",
          "Automated RERA / Local Regulatory Compliance"
        ]
      },
      {
        "title": "Operations & Workflow",
        "items": [
          "Automated Maintenance Ticket Dispatch",
          "Vendor Work Order Management",
          "Recurring Direct-Debit Rent Collections",
          "Automated Broker Commission Payouts",
          "Inspection & Key Handover Checklists",
          "Owner Monthly Disbursal Statements"
        ]
      },
      {
        "title": "Scale & Portfolio Monetization",
        "items": [
          "Multi-City Agency Expansion Architecture",
          "Featured Listing Monetization Tiers",
          "Integrated Tenant Insurance Add-ons",
          "Mortgage Broker Affiliate Integrations",
          "Commercial CAM Reconciliation Engine",
          "Syndicated Investor Portfolio Reporting"
        ]
      }
    ],
    "faqs": [
      {
        "question": "How do you integrate with regional MLS feeds and third-party real estate portals?",
        "answer": "We engineer custom normalization pipelines supporting RETS, RESO Web API, and proprietary JSON/XML broker feeds. Our synchronization engine continuously updates availability, pricing changes, and photo galleries without degrading frontend search speed."
      },
      {
        "question": "Can the platform automate agent commissions and multi-tier brokerage splits?",
        "answer": "Yes. We build custom calculation engines supporting flexible split tiers, desk fees, franchise deductions, and milestone disbursements, with instant PDF voucher generation and accounting exports."
      },
      {
        "question": "Is digital lease signing legally binding within our jurisdiction?",
        "answer": "We integrate enterprise-grade e-signature workflows (DocuSign, HelloSign, or custom cryptographic signature engines) with full IP, timestamp, and audit trail logging compliant with e-Sign acts and local property regulations."
      },
      {
        "question": "How does your platform handle high traffic during new development launches?",
        "answer": "Our headless architectures decouple user search from transactional databases using Redis edge caching, Elasticsearch/Algolia indexing, and serverless compute, easily handling tens of thousands of concurrent unit lookups."
      },
      {
        "question": "Can owners and investors access dedicated financial statements?",
        "answer": "We provide dedicated owner portals where landlords view real-time occupancy rates, monthly rental yields, maintenance expense deductions, and download automated tax-ready statements."
      }
    ],
    "ctaHeadline": "Ready to build custom software for your real estate operations?",
    "ctaSubtext": "Speak with our engineering team about your properties, workflows, and platform goals for a tailored architectural proposal."
  },
  {
    "id": "jobs-recruiters",
    "slug": "jobs-recruiters",
    "name": "Jobs & Recruiters",
    "iconSrc": "/industries/jobs-recruiters.svg",
    "subtitle": "Scalable applicant tracking systems, candidate portals, and automated recruitment pipelines",
    "image": "/industries/jobs-recruiters.png",
    "heroHeadline": "High-velocity recruitment engines engineered for modern staffing firms.",
    "heroIntro": "We design and develop custom applicant tracking systems (ATS), talent databases, and client submission portals. Enable recruitment agencies and corporate talent teams to source, screen, and place top candidates with speed and precision.",
    "keyHighlights": [
      "Automated resume parsing & semantic candidate matching",
      "Interactive Kanban recruitment pipelines & stage triggers",
      "Client candidate review & interview feedback portals",
      "Job board multi-posting & SEO-optimized career hubs"
    ],
    "aboutHeadline": "Transform chaotic recruitment inboxes into structured, automated talent pipelines.",
    "aboutLead": "Staffing firms lose valuable billable placements when candidate resumes get buried in email chains, interview feedback is delayed, and recruiter notes are scattered across personal spreadsheets.",
    "aboutBody": [
      "SPANYX engineers custom staffing and recruitment software designed around your agency workflows. We build centralized talent databases with instant full-text search, skills taxonomy tagging, and automated candidate submission decks for client hiring managers.",
      "Our recruitment platforms include automated interview scheduling, real-time candidate status alerts, and integrated placement billing—giving recruitment leadership full transparency over recruiter productivity and pipeline revenue."
    ],
    "capabilitiesIntro": "Built-in tools to accelerate candidate sourcing, evaluation, and client placement.",
    "capabilities": [
      {
        "title": "Smart Resume Parsing & Indexing",
        "description": "Extract candidate contact details, work history, skills, and certifications from PDF and Word resumes into structured searchable profiles."
      },
      {
        "title": "Kanban Applicant Pipeline",
        "description": "Visual drag-and-drop recruitment stages with configurable automated triggers for candidate emails, status updates, and recruiter notifications."
      },
      {
        "title": "Staffing Client Review Portals",
        "description": "Share anonymized candidate shortlist links with hiring managers, allowing clients to review profiles, leave ratings, and approve interview times."
      },
      {
        "title": "Automated Interview Scheduling",
        "description": "Two-way calendar sync with Google Calendar and Microsoft Outlook, enabling candidates to self-book interview slots based on recruiter availability."
      },
      {
        "title": "Custom Job Board & SEO Architecture",
        "description": "High-speed branded job board pages with structured Google Jobs schema markup, instant application forms, and one-click LinkedIn apply."
      },
      {
        "title": "Placement & Commission Analytics",
        "description": "Track key recruitment KPIs including time-to-hire, source attribution, consultant placement fees, and agency billings in real time."
      }
    ],
    "approachIntro": "Domain-specific recruitment lifecycle from talent ingestion to placement billing.",
    "approach": [
      {
        "title": "01 AI Resume Parsing & Candidate Enrichment",
        "description": "Extract work histories, skills, and education from resumes into structured JSON entities, auto-enriching candidate records with verified portfolio links and social profiles."
      },
      {
        "title": "02 Automated Interview Scheduling & Pre-Screening",
        "description": "Trigger smart screening questionnaires and calendar scheduling links, filtering unqualified applications before recruiters spend screening hours."
      },
      {
        "title": "03 Collaborative Client Submission & Feedback Portal",
        "description": "Generate branded, anonymized candidate decks for hiring managers with interactive salary breakdowns, skill matrices, and one-click interview request buttons."
      },
      {
        "title": "04 Digital Offer Approvals, Background Checks & Commission Billing",
        "description": "Manage offer letter e-signatures, trigger automated background checks, and generate recruiter placement commission vouchers upon candidate start dates."
      }
    ],
    "growthSolutions": [
      {
        "title": "Talent Acquisition Strategy",
        "items": [
          "Recruiter Workflow & Bottleneck Audit",
          "Candidate Experience Journey Mapping",
          "Niche Job Board SEO & Distribution",
          "Agency Commission & Desk Split Structuring",
          "Automated Candidate Re-engagement Blueprints",
          "Client SLA & Time-to-Fill Optimization"
        ]
      },
      {
        "title": "Custom ATS Engineering",
        "items": [
          "High-Volume Resume Parsing Engine",
          "Semantic Skills & Experience Matching",
          "Real-Time Drag-and-Drop Kanban Boards",
          "Two-Way Google & Outlook Calendar Sync",
          "Anonymized Client Submittal Portals",
          "Secure Multi-Tenant Staffing Architecture"
        ]
      },
      {
        "title": "Candidate Experience Design",
        "items": [
          "Mobile-First One-Click Application Flows",
          "Clean Branded Agency Portals",
          "Candidate Self-Service Status Portals",
          "Intuitive Salary & Skill Filter Interfaces",
          "Video Interview & Screening Experience",
          "High-Trust Client Review Decks"
        ]
      },
      {
        "title": "Recruitment Marketing",
        "items": [
          "Google for Jobs Schema Optimization",
          "Programmatic Job Ad Distribution",
          "LinkedIn Talent Outreach Automation",
          "Niche Industry Recruiter Branding",
          "Targeted Executive Search Funnels",
          "Candidate Email & SMS Drip Campaigns"
        ]
      },
      {
        "title": "Staffing Intelligence",
        "items": [
          "Time-to-Fill & Time-to-Hire Analytics",
          "Recruiter Activity & Desk Billing Metrics",
          "Candidate Source ROI Attribution",
          "Client Submittal-to-Interview Conversion",
          "Market Salary Benchmarking Telemetry",
          "Offer Acceptance Rate Diagnostics"
        ]
      },
      {
        "title": "Compliance & Verification",
        "items": [
          "GDPR & Equal Opportunity Compliance",
          "Automated Candidate Consent Management",
          "Integrated Background Check APIs",
          "Right-to-Work Document Verification",
          "Role-Based Recruiter Access Scopes",
          "Encrypted Talent Record Vaults"
        ]
      },
      {
        "title": "Recruitment Automation",
        "items": [
          "Automated Status Update Notifications",
          "AI-Generated Job Description Drafting",
          "Interview Reminder SMS Sequences",
          "Placement Invoice Auto-Generation",
          "Client Feedback Collection Prompts",
          "Contractor Timesheet Reminders"
        ]
      },
      {
        "title": "Scale & RPO Monetization",
        "items": [
          "Multi-Country Staffing Entity Setup",
          "Contingent Workforce VMS Integration",
          "Custom Recruiter Marketplace Tiers",
          "White-Label Enterprise Career Portals",
          "Executive Search Retainer Tracking",
          "Staff Augmentation Payroll Integration"
        ]
      }
    ],
    "faqs": [
      {
        "question": "Can the platform parse resumes in multiple formats and languages?",
        "answer": "Yes. Our parsing engine extracts structured metadata from PDF, DOCX, and image formats with high accuracy, standardizing titles, years of experience, and hard skills into queryable filters."
      },
      {
        "question": "Does the system integrate with Google for Jobs and job aggregators?",
        "answer": "Every job listing automatically generates structured JobPosting schema markup, instantly syndicating openings to Google for Jobs, LinkedIn, and XML aggregator feeds without manual re-entry."
      },
      {
        "question": "How do client hiring managers review shortlisted candidates?",
        "answer": "Recruiters can generate secure, password-protected or magic-link client submittal portals where hiring managers view formatted profiles, listen to audio intros, and schedule interviews directly."
      },
      {
        "question": "How do you handle candidate data privacy and GDPR compliance?",
        "answer": "We engineer automated data retention policies, candidate consent renewal prompts, and self-service \"Right to Be Forgotten\" erasure workflows compliant with GDPR and CCPA."
      },
      {
        "question": "Can the ATS track contractor hours, timesheets, and billable placements?",
        "answer": "Yes. We build modular timesheet tracking and vendor management modules that calculate agency gross margins, contractor rates, and automate client billing cycles."
      }
    ],
    "ctaHeadline": "Ready to build custom software for your recruitment agency?",
    "ctaSubtext": "Speak with our senior engineers about your staffing workflows, client requirements, and candidate scale goals for an actionable technical plan."
  },
  {
    "id": "matrimonial",
    "slug": "matrimonial",
    "name": "Matrimonial",
    "iconSrc": "/industries/matrimonial.svg",
    "subtitle": "Verified matchmaking portals, granular privacy controls, and community-centric algorithms",
    "image": "/industries/matrimonial.png",
    "heroHeadline": "High-trust matrimonial software engineered for modern matchmaking communities.",
    "heroIntro": "We engineer secure, high-trust matrimonial and matchmaking platforms. From AI-assisted partner recommendations to multi-tiered photo privacy, our software provides a dignified, private experience that fosters genuine connections.",
    "keyHighlights": [
      "Multi-factor identity verification & photo watermarking",
      "Granular profile privacy & contact request permissions",
      "Community, caste, and horoscope compatibility algorithms",
      "In-app encrypted communication & verification badges"
    ],
    "aboutHeadline": "Build matrimonial platforms where privacy, dignity, and authenticity come first.",
    "aboutLead": "Generic social apps fail matchmaking communities because they lack rigorous identity checks, privacy safeguards, and family-approved recommendation criteria.",
    "aboutBody": [
      "At SPANYX, we build specialized matchmaking systems designed for community leaders, niche matrimonial agencies, and modern relationship platforms. Our systems feature multi-tier verification (Government ID, phone, photo liveness checks) to eliminate fake profiles and fraud.",
      "We engineer granular privacy controls—allowing members to control exactly who sees their photos, contact details, and family background. With custom compatibility logic and administrative moderation tools, your platform maintains an atmosphere of safety, credibility, and cultural respect."
    ],
    "capabilitiesIntro": "Security, privacy, and compatibility features engineered for serious matchmaking.",
    "capabilities": [
      {
        "title": "Verified Profile Architecture",
        "description": "Multi-step profile onboarding with government ID verification, phone OTP authentication, and mandatory admin approval workflows."
      },
      {
        "title": "Granular Privacy & Photo Controls",
        "description": "Photo privacy settings including blur filters, photo request approvals, watermarking, and restricted contact detail visibility."
      },
      {
        "title": "Custom Compatibility Search",
        "description": "Deep multi-parameter filtering covering education, occupation, community, lifestyle preferences, and horoscope (Kundali) matching."
      },
      {
        "title": "Encrypted Messaging & Requests",
        "description": "Send personalized interests, manage accepted connections, and chat through end-to-end encrypted real-time messaging."
      },
      {
        "title": "Membership & Subscription Tiers",
        "description": "Monetize with flexible plans for contact reveals, featured profile boosts, personalized matchmaker assistance, and validity periods."
      },
      {
        "title": "Admin Moderation & Fraud Prevention",
        "description": "Centralized moderation console to review reported profiles, monitor suspicious messaging patterns, and blacklist fraudulent users."
      }
    ],
    "approachIntro": "Domain-specific matrimonial lifecycle from onboarding verification to successful union.",
    "approach": [
      {
        "title": "01 Multi-Tier Verification & Identity KYC",
        "description": "Onboard prospective members with biometric selfie liveness, government ID OCR validation, and phone verification to ensure zero fraudulent profiles."
      },
      {
        "title": "02 Algorithmic Compatibility & Preference Indexing",
        "description": "Index multi-factor preferences including family values, education, lifestyle, and astrological parameters to surface genuine, compatible candidates."
      },
      {
        "title": "03 Granular Privacy Locks & Secure Communication Relays",
        "description": "Enforce member-controlled photo unblurring, private number masking, and in-platform encrypted messaging to protect candidate dignity."
      },
      {
        "title": "04 Astrological Compatibility Engine & Matchmaker Desk",
        "description": "Integrate real-time planetary Guna Milan calculators and human matchmaker advisory consoles for personalized family introductions."
      }
    ],
    "growthSolutions": [
      {
        "title": "Trust & Privacy Strategy",
        "items": [
          "Multi-Tier Trust & Safety Architecture",
          "Community-Specific Onboarding Funnels",
          "Photo Privacy & Anti-Scraping Blueprint",
          "Tiered Subscription & Paywall Modeling",
          "Family-Assisted Member Journey Design",
          "High-Trust Brand Credibility Strategy"
        ]
      },
      {
        "title": "Matchmaking Platform Engineering",
        "items": [
          "High-Accuracy Preference Matching Engine",
          "Automated Photo Watermarking & Blurring",
          "Encrypted Real-Time Chat Infrastructure",
          "Dynamic Horoscope & Kundali Matching APIs",
          "Identity Verification & Document OCR",
          "Anti-Bot & Account Sharing Defenses"
        ]
      },
      {
        "title": "Empathetic UX & UI",
        "items": [
          "Dignified & Respectful Profile Presentation",
          "Seamless Photo Request & Grant Flows",
          "Clear Privacy Toggle Dashboards",
          "Mobile App Experience for Parents & Youth",
          "High-Touch Matchmaker Assisted View",
          "Celebratory Success Story Showcases"
        ]
      },
      {
        "title": "Community User Acquisition",
        "items": [
          "Localized Community SEO & Content",
          "High-Trust Referral & Family Word-of-Mouth",
          "Influencer Partnerships with Trust Figures",
          "Localized Vernacular Ad Campaigns",
          "Targeted Social Media Family Campaigns",
          "Festive Season Membership Promos"
        ]
      },
      {
        "title": "Safety & Telemetry",
        "items": [
          "Suspicious Interaction & Stalker Telemetry",
          "Interest-to-Acceptance Conversion Rates",
          "Verification Drop-off Point Diagnostics",
          "Member Retention & Churn Attribution",
          "Contact Reveal Usage Metrics",
          "Platform Trust Score Benchmarking"
        ]
      },
      {
        "title": "Fraud & Safety Defense",
        "items": [
          "Automated Screenshot & Screen Record Protection",
          "Suspicious Chat Pattern NLP Detection",
          "Device Fingerprinting & Multiple Account Blocks",
          "One-Click Member Reporting & Auto-Shadowban",
          "Encrypted Government ID Storage",
          "Strict Data Privacy Compliance"
        ]
      },
      {
        "title": "Operational Moderation",
        "items": [
          "Admin Live Profile Moderation Queue",
          "Automated ID Rejection with Guidance",
          "Assisted Matchmaker Task Distribution",
          "Kundali Discrepancy Resolution Tools",
          "Automated Inactive Profile Deprioritization",
          "Customer Support Ticket Desk"
        ]
      },
      {
        "title": "Monetization & VIP Plans",
        "items": [
          "Custom VIP Matchmaker Service Packages",
          "Pay-Per-Contact Reveal Credits",
          "Priority Profile Placement Boosts",
          "Horoscope Analysis Report Upsells",
          "Wedding Vendor Affiliate Integrations",
          "Family Multi-Profile Package Bundles"
        ]
      }
    ],
    "faqs": [
      {
        "question": "How do you prevent photo theft and unauthorized screenshotting?",
        "answer": "We implement dynamic invisible SVG watermarking with viewer user IDs, disable right-click inspect, apply CSS overlay protection, and enforce hardware-level DRM screen capture blocking in mobile applications."
      },
      {
        "question": "Can the platform support astrological matching (Kundali / Horoscope)?",
        "answer": "Yes. We integrate automated astronomical ephemeris APIs calculating Ashta Koota / Guna Milan scores, Dosha presence, and planetary alignments instantly from birth date, time, and coordinates."
      },
      {
        "question": "How does member verification work in practice?",
        "answer": "Members upload government ID which undergoes OCR verification against user details and automated face match against their profile photos. Verified profiles earn a distinct authenticity badge."
      },
      {
        "question": "Can parents manage profiles on behalf of their children?",
        "answer": "Yes. We build dual-access family account architectures where parents and candidates can both access the account with distinct permission scopes for chatting, viewing contacts, and shortlisting."
      },
      {
        "question": "What monetization models can be built into the platform?",
        "answer": "We support recurring monthly/annual tiers, pay-per-contact reveal bundles, profile highlight boosts, and high-ticket personalized human matchmaker assistance packages."
      }
    ],
    "ctaHeadline": "Ready to build a trusted matrimonial platform for your community?",
    "ctaSubtext": "Speak with our product engineering team about your privacy requirements, matching algorithms, and monetization model."
  },
  {
    "id": "medical-doctors",
    "slug": "medical-doctors",
    "name": "Medical & Doctors",
    "iconSrc": "/industries/medical-doctors.svg",
    "subtitle": "HIPAA-compliant telemedicine, electronic health records, and clinic appointment systems",
    "image": "/industries/medical-doctors.png",
    "heroHeadline": "Secure digital healthcare software engineered for clinics, hospitals, and doctors.",
    "heroIntro": "We engineer secure medical portals, clinic management software, and telemedicine platforms. Built with strict data privacy, HIPAA compliance awareness, and seamless appointment booking, our systems modernize patient care workflows.",
    "keyHighlights": [
      "Encrypted telemedicine video & digital prescriptions",
      "OPD appointment scheduling & queue token management",
      "Electronic Health Records (EHR) & diagnostic report vaults",
      "HIPAA & healthcare compliance security protocols"
    ],
    "aboutHeadline": "Modernize patient care with secure, compliant healthcare software.",
    "aboutLead": "Healthcare practices struggle with crowded waiting rooms, paper prescription errors, fragmented patient records, and cumbersome telehealth software.",
    "aboutBody": [
      "SPANYX develops custom healthcare platforms designed specifically for clinics, multi-specialty hospitals, and individual practitioners. Our systems integrate real-time appointment booking with automated SMS/WhatsApp reminders to reduce patient no-shows.",
      "We engineer digital prescription generators with drug database auto-suggestions, diagnostic lab integrations, and secure patient portals where individuals view their test results and visit history. Everything is protected with enterprise encryption and role-based permissions."
    ],
    "capabilitiesIntro": "Clinical and administrative tools engineered for modern healthcare providers.",
    "capabilities": [
      {
        "title": "OPD Slot & Token Management",
        "description": "Online appointment scheduling with live queue token tracking, allowing patients to arrive right when their turn is approaching."
      },
      {
        "title": "Digital Prescriptions & Notes",
        "description": "Doctor-friendly interface to quickly generate digital prescriptions with medicine dosage templates, lab test orders, and digital signatures."
      },
      {
        "title": "Patient Electronic Records",
        "description": "Structured medical history, allergies, past diagnoses, immunization records, and attached diagnostic lab scans in one secure view."
      },
      {
        "title": "Telemedicine Video Platform",
        "description": "Encrypted WebRTC high-definition video consultations with in-call prescription drafting and patient chat."
      },
      {
        "title": "Clinic Billing & Invoicing",
        "description": "Itemized medical billing, consultation fee collection, insurance claim documentation, and revenue analytics across departments."
      },
      {
        "title": "Multi-Doctor & Branch Management",
        "description": "Role-based dashboards for receptionists, nurses, doctors, and clinic owners across multiple clinic branches."
      }
    ],
    "approachIntro": "Domain-specific clinical patient journey from appointment triage to follow-up care.",
    "approach": [
      {
        "title": "01 Patient Triage & Real-Time OPD Token Allocation",
        "description": "Enable patients to schedule appointments with automated symptom pre-triage and live digital token queue tracking on their mobile devices."
      },
      {
        "title": "02 WebRTC Teleconsultation & HIPAA-Compliant Video",
        "description": "Connect practitioners and patients through secure, end-to-end encrypted video channels with simultaneous vital signs and history display."
      },
      {
        "title": "03 Unified EMR/EHR Sync & E-Prescription Dispatch",
        "description": "Generate standardized digital prescriptions with drug interaction checking, automatically dispatching digitally signed copies to the patient portal and pharmacy."
      },
      {
        "title": "04 Lab Diagnostic Integration & Automated Follow-Up Telemetry",
        "description": "Ingest laboratory pathology reports into the patient record and schedule automated recovery check-in prompts via secure messaging channels."
      }
    ],
    "growthSolutions": [
      {
        "title": "Healthcare Strategy",
        "items": [
          "Clinical Workflow & OPD Bottleneck Audit",
          "HIPAA / Health Privacy Compliance Roadmap",
          "Telemedicine Patient Adoption Strategy",
          "Clinic Branch Standardization Plan",
          "Patient Retention & Preventative Care Funnels",
          "Specialist Doctor Personal Branding"
        ]
      },
      {
        "title": "Clinical Software Engineering",
        "items": [
          "High-Definition WebRTC Telehealth Engine",
          "Fast Digital Prescription Writer with Dosage Defaults",
          "Live Queue Token & Waiting Room Displays",
          "HL7 & FHIR Standard Medical Data Sync",
          "Multi-Specialty EHR Architecture",
          "Role-Based Clinic Staff Permissions"
        ]
      },
      {
        "title": "Patient-Centric UI/UX",
        "items": [
          "Elderly-Friendly Accessible Interface",
          "Frictionless 2-Step Appointment Booking",
          "Visual Lab Report Diagnostic Graphs",
          "Multi-Language Patient Portal",
          "Quick-Action Doctor Consultation Console",
          "One-Touch Emergency Triage Access"
        ]
      },
      {
        "title": "Clinic Patient Acquisition",
        "items": [
          "Local Medical Practice SEO & Google Maps",
          "Specialist Doctor Search Campaign Funnels",
          "Health Condition Awareness Content Hubs",
          "Automated WhatsApp Appointment Confirmations",
          "Patient Review & Google Rating Sequences",
          "Preventative Health Checkup Packages"
        ]
      },
      {
        "title": "Clinical Telemetry & Analytics",
        "items": [
          "Average Consultation Duration Metrics",
          "Patient Waiting Room Time Tracking",
          "Appointment No-Show & Cancellation Diagnostics",
          "Departmental Revenue & Procedure Telemetry",
          "Prescription Drug Category Analytics",
          "Follow-up Compliance Telemetry"
        ]
      },
      {
        "title": "Security & Medical Compliance",
        "items": [
          "End-to-End Encrypted Patient Health Data",
          "HIPAA / GDPR / Local Health Act Conformance",
          "Immutable Audit Logs for Medical Record Access",
          "Two-Factor Authentication for Doctor Logins",
          "Automated Encrypted Cloud Backups",
          "Secure E-Signature for Diagnostic Reports"
        ]
      },
      {
        "title": "Clinic Operations Automation",
        "items": [
          "Automated Medicine Stock Deductions",
          "Pathology Lab Order Auto-Dispatch",
          "Insurance TPA Claim Document Packaging",
          "Daily Doctor Settlement Reports",
          "Patient Follow-Up Vaccine Reminders",
          "SMS Queue Position Updates"
        ]
      },
      {
        "title": "Hospital Scale & Networks",
        "items": [
          "Multi-Hospital Chain Centralized Database",
          "Centralized Pharmacy Inventory Hub",
          "Third-Party Diagnostic Lab APIs",
          "Corporate Healthcare Package Management",
          "Home Healthcare Nurse Dispatching Module",
          "Ambulance Fleet GPS Integration"
        ]
      }
    ],
    "faqs": [
      {
        "question": "Is the platform compliant with healthcare data regulations like HIPAA?",
        "answer": "Yes. We engineer end-to-end encryption at rest (AES-256) and in transit (TLS 1.3), enforce strict role-based access controls, and maintain immutable audit logs for every patient record accessed."
      },
      {
        "question": "Can the appointment system reduce patient no-shows?",
        "answer": "Yes. Automated multi-channel reminders (WhatsApp, SMS, Email) with 1-click confirmation or rescheduling links have demonstrated up to a 65% reduction in missed clinic appointments."
      },
      {
        "question": "Does the telemedicine platform require patients to download an app?",
        "answer": "No. Our WebRTC telemedicine operates directly in modern mobile and desktop web browsers via secure encrypted links, eliminating technical hurdles for elderly or first-time patients."
      },
      {
        "question": "Can doctors write prescriptions quickly during a busy OPD?",
        "answer": "Our prescription interface is designed for speed: doctors use custom dosage templates, drug name autocomplete, and saved diagnosis sets to issue signed e-prescriptions in under 30 seconds."
      },
      {
        "question": "Can external diagnostic labs push test results directly into patient charts?",
        "answer": "Yes. We build HL7 and REST API endpoints allowing partnered diagnostic centers and imaging labs to securely push PDF reports and structured lab values straight into patient profiles."
      }
    ],
    "ctaHeadline": "Ready to build custom healthcare software for your medical practice?",
    "ctaSubtext": "Consult with our healthcare technology specialists to plan your clinic workflows, telemedicine features, and compliance requirements."
  },
  {
    "id": "food-beverage",
    "slug": "food-beverage",
    "name": "Food & Beverage",
    "iconSrc": "/industries/food-beverage.svg",
    "subtitle": "Cloud kitchen operating systems, online ordering engines, and dynamic recipe inventory",
    "image": "/industries/food-beverage.png",
    "heroHeadline": "High-throughput restaurant and cloud kitchen software engineered for scale.",
    "heroIntro": "We engineer direct-to-consumer online ordering platforms, multi-brand cloud kitchen management systems, and smart QR menu solutions that slash third-party aggregator commissions and maximize kitchen output.",
    "keyHighlights": [
      "Zero-commission direct online ordering & payments",
      "Multi-station Kitchen Display Systems (KDS)",
      "Real-time recipe costing & ingredient inventory depletion",
      "QR code table ordering & split-bill payments"
    ],
    "aboutHeadline": "Take back customer ownership and boost kitchen operating margins.",
    "aboutLead": "Restaurants and multi-brand cloud kitchens suffer massive revenue erosion paying 25–35% aggregator commissions while lacking control over customer data and kitchen bottlenecks.",
    "aboutBody": [
      "SPANYX builds custom food and beverage technology that puts you in complete control. We engineer direct ordering storefronts with dynamic delivery radiuses, instant UPI/card checkouts, and automated rider dispatch integration.",
      "Inside the kitchen, our systems connect frontline orders to Kitchen Display Systems (KDS) with station routing (fryer, grill, packing), live inventory deductions down to the gram, and real-time food preparation analytics."
    ],
    "capabilitiesIntro": "High-speed culinary technology engineered for high-volume hospitality.",
    "capabilities": [
      {
        "title": "Direct Ordering Storefront",
        "description": "Blazing-fast branded ordering website and web app with zero aggregator commissions, dynamic menus, and instant payments."
      },
      {
        "title": "Multi-Station KDS",
        "description": "Digital kitchen display routing items to specialized preparation stations with color-coded ticket timers and order-ready alerts."
      },
      {
        "title": "Recipe & Ingredient Inventory",
        "description": "Automated inventory depletion based on dish recipes, raw material stock alerts, supplier PO management, and food waste logging."
      },
      {
        "title": "QR Code Dine-In Ordering",
        "description": "Contactless table ordering allowing guests to browse photos, place orders directly to the kitchen, and pay or split bills from their phone."
      },
      {
        "title": "Multi-Brand Kitchen Management",
        "description": "Operate multiple virtual culinary brands from a single kitchen facility with unified order aggregation and consolidated inventory."
      },
      {
        "title": "Customer Loyalty & Direct Marketing",
        "description": "Capture customer order history, automate targeted WhatsApp promos on birthdays/weekends, and run reward point programs."
      }
    ],
    "approachIntro": "Domain-specific food service lifecycle from guest order placement to kitchen fulfillment.",
    "approach": [
      {
        "title": "01 Multi-Channel Order Aggregation (POS, Dine-In, Delivery Apps)",
        "description": "Aggregate orders across direct web storefronts, QR dine-in tables, and third-party delivery apps into a single real-time transactional stream."
      },
      {
        "title": "02 Intelligent Kitchen Display System (KDS) Station Routing",
        "description": "Split incoming tickets automatically by prep station (grill, bar, fry, assembly) with live prep-time countdowns and rush-hour queue balancing."
      },
      {
        "title": "03 Live Ingredient Recipe Costing & Inventory Deductions",
        "description": "Deduct raw material quantities (flour, protein, dairy) down to the gram upon order confirmation, triggering supplier reorder thresholds automatically."
      },
      {
        "title": "04 Automated Delivery Fleet Dispatch & Customer Loyalty Accrual",
        "description": "Dispatch in-house drivers or third-party hyper-local courier APIs with live GPS tracking links, simultaneously crediting guest loyalty points."
      }
    ],
    "growthSolutions": [
      {
        "title": "Hospitality Strategy",
        "items": [
          "Direct Ordering vs Aggregator Cost Audit",
          "Cloud Kitchen Multi-Brand Unit Economics",
          "Menu Engineering & Margin Maximization",
          "Customer Lifetime Value & Retention Roadmap",
          "Hyper-Local Delivery Radius Optimization",
          "Franchise Central Kitchen Supply Chain Plan"
        ]
      },
      {
        "title": "Kitchen & Order Tech",
        "items": [
          "Sub-Second Direct Online Ordering Storefront",
          "Multi-Station Real-Time KDS Software",
          "QR Dine-In Ordering & Table Splitting",
          "Automated Hyperlocal Courier API Integration",
          "Granular Ingredient Recipe Costing Engine",
          "Unified Multi-Outlet POS Synchronizer"
        ]
      },
      {
        "title": "Mouthwatering UI/UX",
        "items": [
          "High-Resolution Visual Food Menus",
          "Frictionless 3-Tap Mobile Checkout",
          "Interactive Customization & Add-on Modals",
          "Live Animated Order Tracking Experience",
          "Kitchen Display High-Contrast Dark Interface",
          "Effortless Dine-In Bill Splitting UI"
        ]
      },
      {
        "title": "Direct Customer Acquisition",
        "items": [
          "Local Area Geo-Fenced Google & Meta Ads",
          "First-Order Direct Discount Incentives",
          "Targeted WhatsApp Friday-Evening Campaigns",
          "Automated Birthday & Anniversary Treats",
          "Influencer Food Tasting Event Campaigns",
          "Corporate Catering Lead Generation"
        ]
      },
      {
        "title": "Culinary Telemetry",
        "items": [
          "Kitchen Ticket Preparation Velocity Metrics",
          "Peak Hour Demand & Bottleneck Analytics",
          "Item Profit Margin vs Volume Matrix",
          "Delivery Rider Turnaround Telemetry",
          "Ingredient Spoilage & Food Waste Auditing",
          "Direct Customer Retention & Reorder Cohorts"
        ]
      },
      {
        "title": "Safety & Cash Security",
        "items": [
          "End-of-Day Cash Drawer Reconciliation",
          "PCI-DSS Compliant Payment Processing",
          "Staff Discount & Void Order Audit Trails",
          "Food Safety Temperature Logging Vault",
          "Role-Based Kitchen Staff Permissions",
          "Encrypted Customer Data Storage"
        ]
      },
      {
        "title": "Kitchen Automation",
        "items": [
          "Automated Purchase Orders to Suppliers",
          "Out-of-Stock Item Auto-Disabling Across Channels",
          "Automated Kitchen Acoustic Order Chimes",
          "Smart Delivery Route Optimization",
          "Daily Revenue & P&L Summary Generation",
          "Customer Feedback Auto-Collection"
        ]
      },
      {
        "title": "Scale & Franchise Network",
        "items": [
          "Franchise Royalty & Central Kitchen Billing",
          "Centralized Menu Master & Regional Overrides",
          "Third-Party Delivery Aggregator 2-Way Sync",
          "Multi-City Cloud Kitchen Hub Architecture",
          "B2B Wholesale Raw Material Distribution",
          "Brand Merchandise eCommerce Extension"
        ]
      }
    ],
    "faqs": [
      {
        "question": "How does direct ordering help eliminate aggregator commissions?",
        "answer": "By providing guests with an ultra-fast, branded web ordering experience and offering exclusive direct discounts or loyalty perks, brands migrate 40–60% of recurring orders from aggregator apps to their zero-commission platform."
      },
      {
        "question": "Can the KDS route orders to different kitchen stations?",
        "answer": "Yes. Incoming orders automatically parse items: drinks route to the bar screen, appetizers to the fryer station, and mains to the grill, synchronizing completion times for unified packing."
      },
      {
        "question": "Does the system integrate with third-party delivery courier fleets?",
        "answer": "Yes. We integrate with on-demand logistics APIs (Dunzo, Shadowfax, Borzo, DoorDash Drive) to automatically dispatch a nearby rider as soon as the kitchen marks food prep underway."
      },
      {
        "question": "How accurately does recipe inventory tracking work?",
        "answer": "Whenever an order is placed (e.g. a 12-inch pepperoni pizza), the system automatically deducts 200g dough, 80g sauce, 120g mozzarella, and 40g pepperoni from live stock, issuing alerts when thresholds are reached."
      },
      {
        "question": "Can customers split dine-in bills using QR codes?",
        "answer": "Yes. Guests at the same table can scan the table QR code, see the unified bill, select their individual dishes or split evenly, and pay using UPI, Apple Pay, or credit cards."
      }
    ],
    "ctaHeadline": "Ready to build custom food & beverage software for your brand?",
    "ctaSubtext": "Talk with our engineering team about your restaurant operations, cloud kitchen expansion, or direct ordering strategy."
  },
  {
    "id": "school-education",
    "slug": "school-education",
    "name": "School & Education",
    "iconSrc": "/industries/school-education.svg",
    "subtitle": "Campus enterprise systems, digital admissions, automated fee billing, and LMS platforms",
    "image": "/industries/school-education.png",
    "heroHeadline": "Institutional education software engineered for schools, academies, and universities.",
    "heroIntro": "We engineer comprehensive educational ERPs, student information systems (SIS), and online learning portals that streamline admissions, automated fee collections, dynamic timetabling, and parent communication.",
    "keyHighlights": [
      "Digital admissions, enrollment & document verification",
      "Automated fee scheduling, online payments & receipting",
      "Hybrid Learning Management System (LMS) & gradebooks",
      "Real-time parent mobile notifications & bus tracking"
    ],
    "aboutHeadline": "Connect administrators, educators, parents, and students on a unified campus platform.",
    "aboutLead": "Educational institutions often struggle with disconnected systems—paper admissions, overdue fee chasing, chaotic exam grading spreadsheets, and frustrated parents.",
    "aboutBody": [
      "SPANYX engineers custom education platforms that bring campus operations into one cohesive cloud environment. We automate student enrollments, generate instant fee vouchers with multi-gateway payments, and provide teachers with intuitive digital gradebooks.",
      "Our parent portals deliver peace of mind with real-time attendance alerts, examination report cards, homework tracking, and live school bus GPS telemetry—all compliant with student data privacy laws."
    ],
    "capabilitiesIntro": "Institutional capabilities engineered for schools, colleges, and training institutes.",
    "capabilities": [
      {
        "title": "Admissions & Enrollment Hub",
        "description": "Online application portal with entrance exam scheduling, document upload verification, and automated merit list generation."
      },
      {
        "title": "Automated Fee Management",
        "description": "Custom fee structures, installment tracking, automated overdue SMS reminders, instant payment gateway integration, and PDF receipting."
      },
      {
        "title": "Dynamic Timetable & Attendance",
        "description": "Algorithm-assisted faculty timetable generation preventing scheduling clashes, paired with teacher mobile attendance tracking."
      },
      {
        "title": "Learning Management System (LMS)",
        "description": "Course material repositories, video lecture streaming, digital assignment submissions, and automated plagiarism-checked grading."
      },
      {
        "title": "Parent & Student Portal",
        "description": "Dedicated mobile app and web dashboard for parents to view academic progress, attendance percentage, remarks, and school circulars."
      },
      {
        "title": "Examination & Report Cards",
        "description": "Custom grading schemas (CBSE, ICSE, IB, State), marks entry consoles, and one-click cryptographic report card PDF generation."
      }
    ],
    "approachIntro": "Domain-specific academic lifecycle from student admission to alumni graduation.",
    "approach": [
      {
        "title": "01 Digital Admissions, Enrollment & Document Verification",
        "description": "Process prospective student applications online, verify identity documents, conduct entrance assessments, and generate digitized enrollment records."
      },
      {
        "title": "02 Automated Fee Schedules, Reminders & Multi-Gateway Collection",
        "description": "Schedule term fee installments, trigger automated reminders to parents via WhatsApp and SMS, and reconcile bank collections in real-time."
      },
      {
        "title": "03 Hybrid LMS, Dynamic Timetables & Gradebook Administration",
        "description": "Coordinate teacher schedules without room or faculty conflicts, deliver multimedia coursework, and record examination grades in unified gradebooks."
      },
      {
        "title": "04 Real-Time Parent Mobile Communication & Transport Telemetry",
        "description": "Push daily attendance status, circulars, and live school bus GPS tracking coordinates straight to parents mobile notification trays."
      }
    ],
    "growthSolutions": [
      {
        "title": "Educational Strategy",
        "items": [
          "Campus Technology Infrastructure Audit",
          "Curriculum Digitization & LMS Roadmap",
          "Student Fee Recovery & Installment Strategy",
          "Parent Communication & Trust Blueprint",
          "Institutional Reputation & Admissions Plan",
          "Accreditation Compliance & Data Readiness"
        ]
      },
      {
        "title": "Campus Tech Engineering",
        "items": [
          "High-Throughput Admissions & Application Portal",
          "Automated Fee Billing & Reconciliation Engine",
          "Algorithmic Timetable Generation Module",
          "Custom Video & Document LMS Architecture",
          "Real-Time Student Bus GPS Tracking API",
          "Encrypted Student Information Database"
        ]
      },
      {
        "title": "Educator & Parent UI/UX",
        "items": [
          "Clean, Distraction-Free Student Learning Portal",
          "Rapid 30-Second Teacher Attendance UI",
          "Intuitive Parent Mobile App Interface",
          "Visual Exam Performance & Growth Charts",
          "Effortless 1-Click Fee Payment Flow",
          "Accessible Institutional Document Library"
        ]
      },
      {
        "title": "Admissions Marketing",
        "items": [
          "High-Intent School Admission Search Campaigns",
          "Virtual Campus Tour Video Showcases",
          "Parent Open House Webinar Funnels",
          "Alumni Achievement Story PR Releases",
          "Localized Community Education SEO",
          "Automated Inquiry Follow-up Drip Sequences"
        ]
      },
      {
        "title": "Academic Telemetry",
        "items": [
          "Student Subject Mastery & Drop-off Diagnostics",
          "Faculty Attendance & Syllabus Pace Metrics",
          "Fee Collection Velocity & Aging Reports",
          "Parent Portal Engagement & Notice Read-Rates",
          "Admissions Lead Conversion Funnel Analytics",
          "Campus Facility Utilization Telemetry"
        ]
      },
      {
        "title": "Child Safety & Data Privacy",
        "items": [
          "Strict Student Data Privacy Compliance",
          "Bus SOS Alerts & Geofencing Security",
          "Role-Based Teacher & Staff Access Scopes",
          "Secure Cryptographic Report Card Verification",
          "Biometric / RFID Campus Entry Logging",
          "Encrypted Parent Financial Records"
        ]
      },
      {
        "title": "Campus Automation",
        "items": [
          "Automated WhatsApp Attendance Absence Alerts",
          "Library Book Issue & Late Fine Calculations",
          "Staff Payroll & Leave Deductions",
          "Automated Hall Ticket & Exam Badge Generation",
          "Inventory & Uniform Reorder Reminders",
          "Government Regulatory Census Data Exports"
        ]
      },
      {
        "title": "Multi-Branch Institutional Scale",
        "items": [
          "Centralized Multi-Campus Trust Governance",
          "Cross-Branch Faculty Transfer & Allocation",
          "Consolidated Multi-School Financial Auditing",
          "Franchise School Curriculum Licensing",
          "Alumni Network & Endowment Portal",
          "Corporate Executive Training Upsells"
        ]
      }
    ],
    "faqs": [
      {
        "question": "Can the fee management system handle complex discounts and installment plans?",
        "answer": "Yes. Our fee engine supports custom sibling discounts, scholarship fee waivers, transport fee zones, and custom installment calendars with automated late fee calculation."
      },
      {
        "question": "How does live bus tracking work for parents?",
        "answer": "We integrate IoT GPS hardware or a driver smartphone app that streams vehicle telemetry to parent apps, sending automated geofence alerts when the bus is within 10 minutes of the child stop."
      },
      {
        "question": "Can teachers enter exam marks and generate report cards easily?",
        "answer": "Yes. Faculty enter scores via clean spreadsheets or mobile views. The system automatically computes grade percentiles, GPAs, and teacher remarks, generating printable cryptographic PDF report cards."
      },
      {
        "question": "Is the platform compliant with student data privacy regulations?",
        "answer": "We enforce strict data partitioning, encrypted media vaults, zero third-party behavioral tracking, and role-based permissions preventing unauthorized student personal detail exposure."
      },
      {
        "question": "Can the software scale to support multiple schools under one trust?",
        "answer": "Our architecture is inherently multi-tenant: central trustees can view aggregated financial and academic reports across all campuses while individual principals manage their local staff."
      }
    ],
    "ctaHeadline": "Ready to build custom education software for your institution?",
    "ctaSubtext": "Speak with our educational software engineers to plan your admissions portal, campus ERP, and LMS roadmap."
  },
  {
    "id": "tours-travel",
    "slug": "tours-travel",
    "name": "Tours & Travel",
    "iconSrc": "/industries/tours-travel.svg",
    "subtitle": "Dynamic itinerary builders, GDS/OTA integrations, and multi-currency booking engines",
    "image": "/industries/tours-travel.png",
    "heroHeadline": "High-converting travel platforms engineered for tour operators and agencies.",
    "heroIntro": "We engineer custom travel booking engines, dynamic itinerary creators, and global distribution system (GDS) integrations. Empower travel companies to sell packaged tours, hotels, and custom travel experiences with automated confirmations.",
    "keyHighlights": [
      "Interactive day-by-day dynamic itinerary builders",
      "Live flight, hotel & transfer GDS/API synchronization",
      "Multi-currency pricing & split payment checkouts",
      "Automated travel vouchers, visas & document vaults"
    ],
    "aboutHeadline": "Transform static travel PDFs into interactive, instant-booking vacation experiences.",
    "aboutLead": "Travel agencies lose high-margin bookings when itinerary preparation takes days, flight/hotel price quotes expire mid-negotiation, and travelers are forced to pay via clumsy manual bank transfers.",
    "aboutBody": [
      "At SPANYX, we build modern travel technology that accelerates the booking cycle. We engineer visual itinerary builders that allow travel consultants to assemble day-by-day vacation packages with live pricing in minutes.",
      "Our platforms integrate with Amadeus, Sabre, Hotelbeds, and custom local supplier inventories, allowing agencies to accept instant deposits in multiple currencies and issue automated branded travel vouchers."
    ],
    "capabilitiesIntro": "Modern travel engineering capabilities to automate bookings and travel operations.",
    "capabilities": [
      {
        "title": "Dynamic Itinerary Builder",
        "description": "Assemble day-by-day visual itineraries with interactive maps, hotel galleries, activity inclusions, and instant quote PDF exports."
      },
      {
        "title": "Multi-Supplier Inventory Engine",
        "description": "Connect GDS, OTA wholesalers, and direct contract local supplier rates with automated markup and currency conversion rules."
      },
      {
        "title": "Multi-Currency Booking & Deposits",
        "description": "Allow travelers to book packages with flexible deposit schedules (e.g., 20% down, balance 14 days before departure) in their home currency."
      },
      {
        "title": "Automated Voucher & Visa Vault",
        "description": "Auto-generate hotel vouchers, driver contact sheets, flight tickets, and visa checklist vaults accessible via mobile web."
      },
      {
        "title": "Travel CRM & Quote Pipeline",
        "description": "Track incoming trip inquiries, agent lead assignments, quote revision histories, and traveler preference profiles in one dashboard."
      },
      {
        "title": "Traveler Mobile Web Concierge",
        "description": "Provide travelers with an offline-capable mobile trip itinerary, emergency contact hotlines, flight status alerts, and local tips."
      }
    ],
    "approachIntro": "Domain-specific travel lifecycle from inquiry intake to unforgettable journey.",
    "approach": [
      {
        "title": "01 Dynamic Itinerary Builder & Multi-Supplier GDS Ingestion",
        "description": "Ingest live flight, accommodation, and transport feeds, enabling travel consultants to assemble rich, customizable day-by-day itineraries with real-time margins."
      },
      {
        "title": "02 Real-Time Room & Flight Inventory Reservation Engine",
        "description": "Lock in traveler spots through synchronized inventory holds with external supplier APIs before flight or hotel rate fluctuations occur."
      },
      {
        "title": "03 Multi-Currency Payment Splitting & Automated Voucher Generation",
        "description": "Accept global card, wire, and split deposits across currencies, instantly generating branded travel vouchers and driver contact manifests."
      },
      {
        "title": "04 Traveler Mobile Concierge, Flight Status Alerts & Post-Trip Reviews",
        "description": "Deliver an interactive digital pocket guide with real-time flight gate alerts, emergency contact relays, and post-vacation review prompts."
      }
    ],
    "growthSolutions": [
      {
        "title": "Travel Strategy",
        "items": [
          "Travel Agency Operating Margin Audit",
          "Wholesale Supplier & GDS API Strategy",
          "High-Yield Custom Itinerary Packaging",
          "Luxury vs Budget Traveler Persona Design",
          "Multi-Currency Currency Risk Hedging",
          "Corporate vs Leisure Travel Expansion"
        ]
      },
      {
        "title": "Booking & GDS Engineering",
        "items": [
          "Interactive Drag-and-Drop Itinerary Builder",
          "Amadeus, Sabre & Hotelbeds API Integration",
          "Multi-Currency Payment Gateway Engine",
          "Automated PDF Voucher & Ticket Generator",
          "Travel Agent Commission & Markup Rules",
          "Offline-First Traveler PWA Mobile App"
        ]
      },
      {
        "title": "Immersive Travel UI/UX",
        "items": [
          "High-Resolution Destination Visual Stories",
          "Interactive Day-by-Day Route Maps",
          "Transparent Price Breakdown & Add-on Modals",
          "Frictionless 2-Tap Traveler Detail Input",
          "Mobile In-Trip Day-by-Day Timeline",
          "Luxury Agent White-Label Presentation Decks"
        ]
      },
      {
        "title": "Traveler Acquisition",
        "items": [
          "High-Intent Destination & Honeymoon SEO",
          "Luxury Vacation Google Search Ad Campaigns",
          "Instagram & Meta Visual Travel Ad Funnels",
          "Automated Inquiry WhatsApp Consultation Chatbots",
          "Seasonal Early-Bird Holiday Promotions",
          "Travel Blogger Co-Marketing Partnerships"
        ]
      },
      {
        "title": "Travel Telemetry",
        "items": [
          "Quote-to-Booking Conversion Velocity",
          "Popular Destination & Seasonal Demand Trends",
          "Agent Response Time & Close Rates",
          "Supplier Margin & Commission Yield Analysis",
          "Traveler Cancellation & Refund Metrics",
          "Customer Lifetime Value & Rebooking Rates"
        ]
      },
      {
        "title": "Security & Travel Compliance",
        "items": [
          "PCI-DSS Compliant Credit Card Vaulting",
          "Traveler Passport Document Encryption",
          "Travel Insurance Policy Integration",
          "Emergency SOS Local Police/Consulate Relays",
          "GDPR Compliant Traveler Privacy Controls",
          "Supplier Contract & Liability Audit Trails"
        ]
      },
      {
        "title": "Tour Operations Automation",
        "items": [
          "Automated Supplier Room Confirmation Emails",
          "Balance Payment Reminder SMS Sequences",
          "Driver & Local Tour Guide Dispatch Manifests",
          "Flight PNR Status Change Real-Time Alerts",
          "Post-Trip Automated Review Ingestion",
          "Currency Exchange Rate Daily Updates"
        ]
      },
      {
        "title": "Scale & B2B Wholesaling",
        "items": [
          "B2B Sub-Agent Booking Portal & Credit Lines",
          "Custom White-Label Engine for Partner Agencies",
          "Group Corporate Incentive Trip Management",
          "Dynamic Yacht & Private Charter Modules",
          "Regional DMC Supplier Network Hub",
          "Affiliate Travel Creator Kickback Tracking"
        ]
      }
    ],
    "faqs": [
      {
        "question": "Can the dynamic itinerary builder generate branded PDF proposals?",
        "answer": "Yes. With one click, consultants generate publication-grade PDF proposals containing day-by-day descriptions, hotel photos, inclusions/exclusions, pricing tables, and direct booking links."
      },
      {
        "question": "How do you handle multi-currency payments and exchange rate fluctuations?",
        "answer": "Our platform syncs live forex exchange feeds, calculates safe currency buffer margins, and allows travelers to pay in USD, EUR, GBP, or INR via Stripe, PayPal, or regional gateways."
      },
      {
        "question": "Can travelers access their itinerary while traveling offline?",
        "answer": "Yes. We build Progressive Web App (PWA) client portals that cache full day-by-day itineraries, emergency contact numbers, and voucher barcodes locally on the phone without requiring roaming data."
      },
      {
        "question": "Does the software support split payments and installment deposit schedules?",
        "answer": "Yes. You can configure custom deposit rules (e.g., 25% on confirmation, 50% 30 days prior, 25% 7 days prior), with automated recurring card charges and payment reminder triggers."
      },
      {
        "question": "Can we connect direct contract hotels alongside GDS wholesaler feeds?",
        "answer": "Yes. The engine blends your proprietary direct contract hotel rates with live GDS feeds, applying your custom markup algorithms and prioritizing high-margin direct contracts."
      }
    ],
    "ctaHeadline": "Ready to build custom travel software for your agency or tour operations?",
    "ctaSubtext": "Consult with our travel technology team to plan your itinerary builder, booking engine, and supplier API integrations."
  },
  {
    "id": "b2c",
    "slug": "b2c",
    "name": "B2C Platforms & Retail",
    "iconSrc": "/industries/b2c.svg",
    "subtitle": "High-speed consumer marketplaces, omnichannel storefronts, and retention loyalty engines",
    "image": "/industries/b2c.png",
    "heroHeadline": "Direct-to-consumer software architectures engineered for extreme sales velocity.",
    "heroIntro": "We engineer ultra-fast B2C eCommerce platforms, consumer web applications, and omnichannel retail hubs. Designed for lightning-fast catalog discovery, effortless one-click checkouts, and high lifetime customer value.",
    "keyHighlights": [
      "Sub-second page load times with headless architecture",
      "Personalized product recommendations & smart search",
      "Omnichannel loyalty points & tiered VIP memberships",
      "Automated multi-carrier shipping & order tracking"
    ],
    "aboutHeadline": "Outpace sluggish template stores with bespoke high-velocity consumer software.",
    "aboutLead": "Consumer brands lose up to 50% of potential buyers due to slow page loads, clunky multi-step checkouts, and generic storefront designs that fail to build emotional brand connection.",
    "aboutBody": [
      "At SPANYX, we build custom B2C software engineered for conversion. We utilize headless modern architectures (Next.js, fast edge APIs) delivering instantaneous product browsing and frictionless 1-click checkouts.",
      "Our retail platforms integrate real-time inventory across physical stores and warehouses, automated courier fulfillment routing, and intelligent retention funnels that turn one-time shoppers into lifelong brand advocates."
    ],
    "capabilitiesIntro": "Engineered capabilities to maximize consumer conversion, speed, and repeat purchase.",
    "capabilities": [
      {
        "title": "Headless Storefront Speed",
        "description": "Instant page loads and navigation with server-side rendered catalogs, edge caching, and zero layout shift on mobile devices."
      },
      {
        "title": "Intelligent Search & Filtering",
        "description": "Instant typo-tolerant search with autocomplete, visual product badges, color swatches, and multi-facet filtering."
      },
      {
        "title": "One-Click Fast Checkout",
        "description": "Frictionless checkout supporting saved addresses, Apple Pay, Google Pay, UPI, credit cards, and Buy Now Pay Later (BNPL)."
      },
      {
        "title": "Omnichannel Stock Synchronization",
        "description": "Unified real-time stock across multiple warehouses, retail storefronts, and marketplace channels with safety stock buffers."
      },
      {
        "title": "Customer Retention & Loyalty Engine",
        "description": "Tiered reward points, referral kickbacks, automated abandoned cart recovery, and personalized post-purchase recommendations."
      },
      {
        "title": "Automated Courier & Return Desk",
        "description": "Automatic courier selection based on delivery speed and cost, branded order tracking pages, and self-service customer returns."
      }
    ],
    "approachIntro": "Domain-specific consumer retail lifecycle from product discovery to doorstep unboxing.",
    "approach": [
      {
        "title": "01 Sub-Second Storefront Experience & Semantic Product Discovery",
        "description": "Deploy headless edge-cached storefronts with instant, typo-tolerant search, personalizing the catalog for individual browsing histories."
      },
      {
        "title": "02 Dynamic Cart Promotion Engine & Instant One-Click Checkout",
        "description": "Incentivize basket size through tiered threshold free-shipping meters, cross-sell bundles, and frictionless one-click mobile checkouts."
      },
      {
        "title": "03 Multi-Carrier Shipping Orchestration & Real-Time Tracking",
        "description": "Route orders automatically to the optimal fulfillment warehouse and courier, pushing live branded tracking timelines via WhatsApp and SMS."
      },
      {
        "title": "04 Automated Post-Purchase Retention, Reviews & Loyalty Rewards",
        "description": "Trigger timed post-delivery satisfaction check-ins, reward loyalty cashback credits, and recommend complementary replenishments."
      }
    ],
    "growthSolutions": [
      {
        "title": "Consumer Brand Strategy",
        "items": [
          "D2C Unit Economics & Margin Optimization",
          "Customer Lifetime Value (LTV) Maximization Plan",
          "Omnichannel Store & Warehouse Architecture",
          "Cart Abandonment Reduction Blueprint",
          "Brand Identity & Emotional Resonance Strategy",
          "International D2C Expansion Roadmap"
        ]
      },
      {
        "title": "Storefront Engineering",
        "items": [
          "Sub-Second Headless Next.js Storefront",
          "Instant Algolia / Meilisearch Product Search",
          "Frictionless 1-Click Mobile Checkout Engine",
          "Dynamic Upsell & Cross-Sell Recommendation APIs",
          "Multi-Warehouse Inventory Routing Logic",
          "Edge-Cached CDN Asset Delivery"
        ]
      },
      {
        "title": "High-Conversion UI/UX",
        "items": [
          "Mobile-First Sticky Add-to-Cart Experience",
          "Rich Product Video & 360 Gallery Cards",
          "Interactive Size & Fit Recommendation Calculator",
          "Clean, Trust-Building Checkout Form Design",
          "Branded Live Tracking Timeline Page",
          "Delightful Unboxing & Review Submission Flow"
        ]
      },
      {
        "title": "Performance Acquisition",
        "items": [
          "High-Return Google Shopping & Meta Catalog Ads",
          "Technical eCommerce Category SEO Optimization",
          "Influencer Affiliate Whitelisting Funnels",
          "Dynamic Retargeting on Abandoned Carts",
          "Viral Social Proof & User-Generated Content Ads",
          "Localized Vernacular Ad Creatives"
        ]
      },
      {
        "title": "Consumer Telemetry",
        "items": [
          "Add-to-Cart & Checkout Step Drop-off Funnels",
          "Product Margin vs Return Rate Analytics",
          "Customer Acquisition Cost (CAC) to LTV Cohorts",
          "Courier On-Time Delivery Performance Metrics",
          "Search Query Zero-Result Diagnostics",
          "Customer Sentiment & Review Score Heatmaps"
        ]
      },
      {
        "title": "Security & Payment Trust",
        "items": [
          "PCI-DSS Level 1 Compliant Card Processing",
          "Automated Fraud & Fake COD Order Detection",
          "Customer Account Takeover Prevention",
          "Encrypted Customer PII Data Vaults",
          "Chargeback Defense Logging Architecture",
          "Strict Data Privacy & Cookie Conformance"
        ]
      },
      {
        "title": "Retail Automation",
        "items": [
          "Automated Courier Label & Waybill Printing",
          "Out-of-Stock Pre-Order Notification Queue",
          "Automated WhatsApp Delivery Out-for-Delivery Alerts",
          "Self-Service Return & Instant Wallet Refund Engine",
          "Low Stock Supplier Purchase Order Generation",
          "Dynamic Tier-Based Customer Discount Triggers"
        ]
      },
      {
        "title": "Scale & Omnichannel Expansion",
        "items": [
          "POS In-Store Barcode & Inventory Integration",
          "Multi-Country Currency & Duty Tax Engine",
          "Marketplace 2-Way Sync (Amazon, Flipkart)",
          "Subscription Box Recurring Billing Module",
          "VIP Membership Loyalty Tier Subscriptions",
          "Mobile App Native iOS & Android Synchronization"
        ]
      }
    ],
    "faqs": [
      {
        "question": "Why choose a custom headless storefront over standard Shopify or WooCommerce?",
        "answer": "Custom headless storefronts achieve sub-second page loads, eliminate monthly app subscription bloat, and allow tailored checkout flows and animations that boost conversion rates by 25–40%."
      },
      {
        "question": "Can the platform integrate with physical POS retail store systems?",
        "answer": "Yes. We build bidirectional inventory and customer synchronization APIs connecting your physical point-of-sale registers to your online store, preventing overselling and unifying loyalty points."
      },
      {
        "question": "How do you combat high Cash on Delivery (COD) Return-to-Origin (RTO) rates?",
        "answer": "We engineer automated OTP phone verification for COD orders, predictive address quality scoring, and WhatsApp order confirmation bots that dramatically slash fake orders and failed deliveries."
      },
      {
        "question": "Can customers easily return items through a self-service portal?",
        "answer": "Yes. Customers enter their order number to initiate returns, select return reasons, upload photos, and schedule courier pickups, with automated store credit or bank refund issuance upon warehouse receipt."
      },
      {
        "question": "How fast can the platform handle flash sales with high traffic spikes?",
        "answer": "By leveraging serverless edge compute, Redis inventory locking, and decoupled checkout queues, our architectures effortlessly process tens of thousands of concurrent checkouts during festive flash sales."
      }
    ],
    "ctaHeadline": "Ready to build custom B2C software for your brand or retail business?",
    "ctaSubtext": "Speak with our senior consumer engineering team about your catalog size, conversion bottlenecks, and omnichannel growth goals."
  },
  {
    "id": "b2b",
    "slug": "b2b",
    "name": "B2B Platforms & Wholesale",
    "iconSrc": "/industries/b2b.svg",
    "subtitle": "Wholesale client portals, tiered pricing engines, RFQ negotiation, and ERP integrations",
    "image": "/industries/b2b.png",
    "heroHeadline": "Enterprise wholesale and B2B ordering platforms engineered for volume commerce.",
    "heroIntro": "We engineer custom B2B eCommerce portals, distributor ordering hubs, and quotation workflows. Enable manufacturers, wholesalers, and corporate suppliers to manage tiered pricing, credit lines, and bulk orders efficiently.",
    "keyHighlights": [
      "Customer-specific tiered pricing & volume discounts",
      "Digital RFQ (Request for Quote) & negotiation pipelines",
      "Net-30/60 corporate credit limits & invoice workflows",
      "Deep two-way ERP integration (SAP, Oracle, Tally, Zoho)"
    ],
    "aboutHeadline": "Modernize complex wholesale commerce with consumer-grade speed and B2B precision.",
    "aboutLead": "Wholesalers and industrial suppliers lose orders when buyers must wait days for phone/email price quotes, decipher outdated paper catalogs, and reconcile purchase orders manually.",
    "aboutBody": [
      "SPANYX builds specialized B2B commerce platforms designed for the nuances of wholesale trade. We engineer custom client portals where approved business buyers view contract pricing, check warehouse availability, and place multi-line bulk orders in seconds.",
      "Our systems include corporate approval workflows, Net payment terms with automated credit checks, and deep integration with your existing ERP—eliminating manual order re-entry and accelerating order-to-cash cycles."
    ],
    "capabilitiesIntro": "Enterprise wholesale capabilities built for complex procurement workflows.",
    "capabilities": [
      {
        "title": "Customer-Specific Contract Pricing",
        "description": "Display unique negotiated pricing tiers, volume price breaks, and minimum order quantities (MOQ) based on authenticated buyer accounts."
      },
      {
        "title": "Interactive RFQ & Quotation Desk",
        "description": "Allow buyers to request custom quotes on bulk quantities, negotiate line items digitally, and convert approved quotes into orders with one click."
      },
      {
        "title": "Corporate Multi-User Accounts",
        "description": "Support corporate purchasing teams with hierarchical roles (requesters, branch managers, finance approvers) and custom spending limits."
      },
      {
        "title": "Credit Terms & Net Invoicing",
        "description": "Manage Net-15/30/60 credit limits, automated ledger balances, purchase order (PO) document attachments, and automated statement generation."
      },
      {
        "title": "Bulk Order & Quick Reorder Tools",
        "description": "Fast CSV order upload, SKU quick-entry pads, and instant re-order templates for recurring wholesale inventory replenishment."
      },
      {
        "title": "Bi-Directional ERP Synchronization",
        "description": "Synchronize products, live inventory, sales orders, tax rules, and customer credit data directly with SAP, Microsoft Dynamics, Tally, or Zoho."
      }
    ],
    "approachIntro": "Domain-specific wholesale procurement lifecycle from buyer onboarding to reconciled settlement.",
    "approach": [
      {
        "title": "01 Corporate Buyer Verification & Tiered Catalog Onboarding",
        "description": "Validate business tax IDs (GST/EIN), verify trade references, and assign buyers to contracted wholesale pricing tiers and catalog permissions."
      },
      {
        "title": "02 Custom RFQ (Request for Quote) & Volume Pricing Negotiation",
        "description": "Allow procurement teams to submit bulk RFQs, enabling sales engineers to offer dynamic tiered discounts and issue digitally signable quotes."
      },
      {
        "title": "03 Net-30/60 Credit Term Underwriting & Purchase Order Validation",
        "description": "Enforce company spending limits and credit boundaries, automatically validating uploaded corporate PO numbers before warehouse release."
      },
      {
        "title": "04 Automated ERP Synchronization & Milestone Invoicing",
        "description": "Push accepted wholesale orders straight to the central ERP, generating tax-compliant GST/VAT invoices and tracking milestone payment receipts."
      }
    ],
    "growthSolutions": [
      {
        "title": "Wholesale Strategy",
        "items": [
          "B2B Commerce Modernization & ROI Audit",
          "Buyer Persona & Procurement Flow Mapping",
          "Contract Pricing & Margin Tier Structuring",
          "Credit Risk Underwriting & Limit Policy Design",
          "Distributor Adoption & Digital Onboarding Plan",
          "ERP & Supply Chain Synchronization Roadmap"
        ]
      },
      {
        "title": "Enterprise Portal Engineering",
        "items": [
          "High-Performance Wholesale Client Ordering Hub",
          "Dynamic Customer-Specific Contract Pricing Engine",
          "Interactive Digital RFQ & Quote Negotiation Desk",
          "Two-Way ERP & Accounting Sync APIs",
          "Quick Bulk CSV & SKU Upload Module",
          "Multi-Tier Corporate Account Role Architecture"
        ]
      },
      {
        "title": "Procurement-Grade UI/UX",
        "items": [
          "High-Density Multi-Line Item Order Entry",
          "Instant Real-Time Stock Availability Matrix",
          "Intuitive Quote Review & 1-Click Accept Screen",
          "Corporate Credit Balance & Ledger Summary UI",
          "Mobile-Friendly Field Sales Representative Order Mode",
          "Clean Downloadable Specification Sheet Viewers"
        ]
      },
      {
        "title": "B2B Client Acquisition",
        "items": [
          "Targeted Account-Based Marketing (ABM) Campaigns",
          "High-Intent Industrial Keyword Search Campaigns",
          "LinkedIn Corporate Buyer & Procurement Outreach",
          "Trade Show Digital Brochure & Lead Capture Kiosks",
          "Distributor Incentive & Rebate Marketing",
          "Industry Specific Whitepaper Thought Leadership"
        ]
      },
      {
        "title": "Wholesale Telemetry",
        "items": [
          "Distributor Order Frequency & Reorder Velocity",
          "Quote-to-Order Conversion Rate & Margin Yield",
          "Credit Limit Utilization & Days Sales Outstanding (DSO)",
          "SKU Demand Forecasting & Stockout Telemetry",
          "Field Sales Rep Order Booking Performance",
          "Customer Account Attrition Early Warning Diagnostics"
        ]
      },
      {
        "title": "Enterprise Security & Compliance",
        "items": [
          "Strict Corporate Buyer Verification & KYC",
          "Role-Based Approval Chains for Big-Ticket POs",
          "Encrypted Contract Documents & Audit Trails",
          "Secure VPN / Dedicated API Gateway Connections",
          "GDPR & Local Enterprise Privacy Conformance",
          "Immutable Transaction Logging for Financial Audits"
        ]
      },
      {
        "title": "Procurement Automation",
        "items": [
          "Automated Net Invoice Generation & Email Dispatch",
          "Overdue Payment Warning SMS & Email Sequences",
          "Warehouse Dispatch Manifest Auto-Creation",
          "Low Stock Customer Notification Queue",
          "Scheduled Recurring Reorder Auto-Processing",
          "Contract Price Expiration Alert Reminders"
        ]
      },
      {
        "title": "Scale & Global Supply Chains",
        "items": [
          "Multi-Entity Multi-Currency Global Wholesaling",
          "Custom Customs & International Harmonized Code Rules",
          "Dropshipping Distributor Inventory Syndication",
          "White-Label Procurement Portals for Key Accounts",
          "Automated Freight & Pallet LTL Shipping Calculators",
          "Consolidated Supply Chain Warehouse Routing"
        ]
      }
    ],
    "faqs": [
      {
        "question": "How do you handle customer-specific pricing and discounts?",
        "answer": "Our platform maintains granular price books linked to customer group tags or individual enterprise accounts, displaying their exact contracted prices, volume breaks, and MOQs upon login."
      },
      {
        "question": "Can corporate clients require internal approval before an order is placed?",
        "answer": "Yes. We build corporate approval hierarchies where junior buyers compile cart orders, which automatically route to department heads or finance directors for approval before submission."
      },
      {
        "question": "How does integration with our existing ERP (SAP, Oracle, Tally) work?",
        "answer": "We engineer reliable bi-directional REST, SOAP, or message queue connectors that sync product master data, live inventory levels, customer credit balances, and push confirmed orders directly to your ERP."
      },
      {
        "question": "Can buyers upload large orders via spreadsheet or CSV?",
        "answer": "Yes. Buyers can upload Excel/CSV files containing SKUs and quantities. The system instantly validates line items, alerts on invalid codes or insufficient stock, and populates the cart in seconds."
      },
      {
        "question": "How are credit terms (Net-30/60) managed on the platform?",
        "answer": "Approved accounts have assigned credit limits and payment windows. Buyers can checkout using \"Purchase Order\", uploading their internal PO PDF, while finance teams monitor aging balances and issue statements."
      }
    ],
    "ctaHeadline": "Ready to build custom B2B software for your wholesale operations?",
    "ctaSubtext": "Speak with our enterprise commerce architects to plan your client portal, custom pricing rules, and ERP integrations."
  },
  {
    "id": "e-commerce",
    "slug": "e-commerce",
    "name": "E-Commerce",
    "iconSrc": "/industries/e-commerce.svg",
    "subtitle": "Scalable commerce architectures, high-concurrency checkout, and unified warehouse logistics",
    "image": "/industries/e-commerce.png",
    "heroHeadline": "High-performance eCommerce platforms engineered for global scale.",
    "heroIntro": "We engineer enterprise eCommerce systems, multi-vendor marketplaces, and omnichannel shopping architectures. Built for extreme concurrency, sub-second product filtering, and frictionless mobile checkouts.",
    "keyHighlights": [
      "Ultra-fast headless architectures with edge caching",
      "Dynamic inventory reservation & real-time stock holds",
      "Multi-gateway global payments with localized currencies",
      "Unified 3PL warehouse fulfillment & reverse logistics"
    ],
    "aboutHeadline": "Engineered for high traffic spikes, maximum checkout conversion, and zero downtime.",
    "aboutLead": "Growing eCommerce brands suffer crippling cart abandonment when pages lag during marketing surges, inventory oversells during flash sales, and customer checkout flows feel cumbersome.",
    "aboutBody": [
      "SPANYX engineers bespoke eCommerce platforms built on modern headless stacks. We decouple frontend user interfaces from backend commerce engines, ensuring pages load in milliseconds regardless of catalog size or traffic spikes.",
      "Our platforms feature intelligent inventory locking, predictive search, personalized dynamic bundling, and seamless integrations with regional 3PL logistics networks—giving you the infrastructure to scale from hundreds to millions of orders."
    ],
    "capabilitiesIntro": "Modern eCommerce engineering to power high-growth digital commerce.",
    "capabilities": [
      {
        "title": "Faceted Spatial & Attribute Search",
        "description": "Sub-100ms multi-attribute filtering by size, color, brand, rating, and price band with instant real-time count updates."
      },
      {
        "title": "Inventory Locking & Stock Holds",
        "description": "Prevent overselling during high-demand drops by reserving inventory during checkout with automatic expiration timers."
      },
      {
        "title": "Localized Global Checkouts",
        "description": "Support local currencies, automatic tax/duty calculations, and regional payment methods (UPI, Klarna, iDEAL, credit cards)."
      },
      {
        "title": "Dynamic Product Bundles & Upsells",
        "description": "Algorithmic recommendations, \"frequently bought together\" modules, and threshold-based free gift/shipping triggers."
      },
      {
        "title": "Multi-Warehouse & 3PL Integration",
        "description": "Intelligent order split and routing to the closest fulfillment facility, generating automated shipping manifests and tracking numbers."
      },
      {
        "title": "Automated Returns & Exchanges",
        "description": "Self-service customer return workflows with automated reverse pickup booking and instant wallet or bank refunds."
      }
    ],
    "approachIntro": "Domain-specific eCommerce lifecycle from product drop to reverse logistics.",
    "approach": [
      {
        "title": "01 Headless Catalog Sync & Real-Time Global Inventory Reservation",
        "description": "Distribute product catalogs across global edge nodes with instant search indexing, holding cart inventory in Redis to eliminate flash-sale overselling."
      },
      {
        "title": "02 Personalized Recommendation Engine & High-Conversion Checkout",
        "description": "Surface AI-curated product recommendations and dynamic bundle discounts, steering customers into a frictionless 1-click mobile checkout."
      },
      {
        "title": "03 Smart Warehouse Routing & Automated 3PL Fulfillment",
        "description": "Route orders dynamically to the closest warehouse or physical store holding stock, auto-generating shipping manifests and courier labels."
      },
      {
        "title": "04 Self-Service Returns Portal & Automated Instant Refund Processing",
        "description": "Empower buyers to request returns or size exchanges through a branded self-service hub, booking reverse courier pickups and issuing refunds on scan."
      }
    ],
    "growthSolutions": [
      {
        "title": "eCommerce Strategy",
        "items": [
          "High-Velocity Commerce Tech Stack Audit",
          "Flash-Sale Concurrency & Peak Capacity Plan",
          "Cart Abandonment & Friction Elimination Strategy",
          "Omnichannel Warehouse Logistics Optimization",
          "Average Order Value (AOV) Expansion Blueprint",
          "International Cross-Border Localization Plan"
        ]
      },
      {
        "title": "Headless Commerce Tech",
        "items": [
          "Ultra-Fast Next.js Headless Storefront",
          "Redis High-Speed Inventory Locking Engine",
          "Instant Typo-Tolerant Faceted Search",
          "Unified 3PL Logistics & Fulfillment API",
          "Dynamic Product Bundling & Discount Engine",
          "Microservice Modular Commerce Architecture"
        ]
      },
      {
        "title": "Conversion UI/UX",
        "items": [
          "Mobile-First Fluid Product Navigation",
          "Zero-Layout-Shift Visual Product Pages",
          "Sticky Checkout Bar with Live Cart Total",
          "Visual Customer Review & Photo Galleries",
          "Clear Stock Scarcity & Urgency Signals",
          "Seamless Multi-Step Form Address Validation"
        ]
      },
      {
        "title": "eCommerce Growth",
        "items": [
          "High-Return Dynamic Product Catalog Ads",
          "Category Page Programmatic SEO Architecture",
          "Automated Post-Purchase WhatsApp Reorder Flows",
          "VIP Early-Access Flash Sale SMS Campaigns",
          "Creator Affiliate Tracking & Commission Hub",
          "Exit-Intent Personalized Discount Overlays"
        ]
      },
      {
        "title": "Commerce Telemetry",
        "items": [
          "Real-Time Cart-to-Payment Conversion Funnels",
          "SKU Return Rate & Profit Contribution Matrix",
          "Peak Concurrency Server Latency Diagnostics",
          "Courier On-Time Delivery & RTO Analytics",
          "Customer Lifetime Value by Acquisition Source",
          "Product Search Zero-Result Heatmaps"
        ]
      },
      {
        "title": "Security & Payment Guard",
        "items": [
          "PCI-DSS Compliant Multi-Gateway Architecture",
          "Bot Mitigation & Scalper Purchase Prevention",
          "Automated Address Verification & RTO Scoring",
          "Encrypted Customer PII & Payment Token Storage",
          "Chargeback Defense & Audit Evidence Logging",
          "Strict Data Privacy & Cookie Conformance"
        ]
      },
      {
        "title": "Logistics Automation",
        "items": [
          "Automated Courier Selection & Air Waybill Generation",
          "Smart Multi-Package Order Splitting Rules",
          "Real-Time WhatsApp Delivery Notification Triggers",
          "Automated Reverse Pickup Booking for Returns",
          "Safety Stock Buffer Auto-Adjustment Reminders",
          "Daily Warehouse Dispatch Reconciliation"
        ]
      },
      {
        "title": "Global Scale & Marketplaces",
        "items": [
          "Multi-Store Multi-Currency Global Operations",
          "Cross-Border Duty & Tax Calculation Engine",
          "Multi-Vendor Marketplace Vendor Payout Modules",
          "Native iOS & Android App Store Synchronization",
          "Automated Product Feed Syndication (Google, Meta)",
          "Omnichannel Click-and-Collect Store Hub"
        ]
      }
    ],
    "faqs": [
      {
        "question": "How do you prevent crashes during major flash sales or product launches?",
        "answer": "We engineer cloud-native serverless architectures with Redis queuing and edge caching that decouple frontend visitors from the database, effortlessly absorbing 50,000+ simultaneous checkouts."
      },
      {
        "question": "Can the platform integrate with multiple 3PL logistics and warehouse systems?",
        "answer": "Yes. We build unified logistics middleware connecting multiple 3PL providers (Shiprocket, Delhivery, BlueDart, FedEx), automatically assigning orders based on regional speed and cost."
      },
      {
        "question": "How do dynamic bundle discounts and cart upsells work?",
        "answer": "Our recommendation engine analyzes cart items in real time, presenting complementary items with 1-click bundle discounts (e.g. \"Add matching belt for 20% off\") directly within the checkout drawer."
      },
      {
        "question": "Does the system handle international currencies and localized taxes?",
        "answer": "Yes. The platform detects visitor geolocation, displays prices in their local currency, applies accurate regional taxes (VAT, GST, sales tax), and supports local payment methods seamlessly."
      },
      {
        "question": "How does the platform handle returns and exchanges without staff overhead?",
        "answer": "Customers log into a self-service returns portal, select the items and return reasons, and receive automated return shipping labels. Once scanned at the warehouse, refunds or size exchanges trigger automatically."
      }
    ],
    "ctaHeadline": "Ready to build custom eCommerce software for high-growth digital sales?",
    "ctaSubtext": "Consult with our senior eCommerce engineers to plan your headless storefront, inventory architecture, and global fulfillment strategy."
  },
  {
    "id": "banking-finance",
    "slug": "banking-finance",
    "name": "Banking & Finance",
    "iconSrc": "/industries/banking-finance.svg",
    "subtitle": "Bank-grade FinTech platforms, digital loan origination, e-KYC, and transaction ledgers",
    "image": "/industries/banking-finance.png",
    "heroHeadline": "Bank-grade financial platforms engineered for security, scale, and compliance.",
    "heroIntro": "We engineer custom FinTech applications, digital lending systems, e-KYC verification pipelines, and wealth management dashboards. Built with military-grade encryption, immutable audit trails, and strict regulatory compliance.",
    "keyHighlights": [
      "Bank-grade PCI-DSS, SOC 2 & data encryption protocols",
      "Automated e-KYC, AML screening & identity verification",
      "Digital loan origination & algorithmic credit underwriting",
      "Immutable double-entry transaction ledgers & audit trails"
    ],
    "aboutHeadline": "Deploy trusted financial architectures engineered for modern monetary transactions.",
    "aboutLead": "Financial institutions and FinTech startups face intense scrutiny: security vulnerabilities destroy customer trust, while sluggish legacy systems cripple digital product innovation.",
    "aboutBody": [
      "SPANYX engineers custom banking and financial technology built on zero-trust security foundations. We build digital loan origination systems that pull credit scores, verify banking statements via account aggregators, and underwrite approvals in minutes.",
      "Our platforms incorporate double-entry immutable ledgers, real-time fraud monitoring, and automated regulatory reporting—ensuring complete financial accuracy and compliance with central banking regulations."
    ],
    "capabilitiesIntro": "FinTech and banking capabilities engineered for security and financial precision.",
    "capabilities": [
      {
        "title": "e-KYC & Biometric Verification",
        "description": "Automated Aadhaar/ID verification, video KYC recording, facial liveness detection, and global AML/sanctions list screening."
      },
      {
        "title": "Digital Loan Origination (LOS)",
        "description": "End-to-end loan application flow with automated bank statement analysis, GST return parsing, and instant eligibility calculations."
      },
      {
        "title": "Double-Entry Transaction Ledger",
        "description": "Mathematically balanced immutable transaction core ensuring zero reconciliation errors, debit/credit integrity, and instant balances."
      },
      {
        "title": "Automated Credit Underwriting Engine",
        "description": "Rule-based and algorithmic risk scoring combining bureau data (CIBIL/Experian), banking behavior, and alternative financial signals."
      },
      {
        "title": "Payment Gateway & NACH Mandates",
        "description": "Recurring loan EMI auto-debit through e-NACH/mandate networks, instant UPI disbursements, and multi-bank escrow integration."
      },
      {
        "title": "Regulatory Audit & Reporting Console",
        "description": "Comprehensive audit trails, automated compliance reports, suspicious activity alerts, and encrypted data archiving."
      }
    ],
    "approachIntro": "Domain-specific financial engineering lifecycle from onboarding KYC to immutable ledger settlement.",
    "approach": [
      {
        "title": "01 Frictionless e-KYC, AML Screening & Biometric Verification",
        "description": "Authenticate borrowers and account holders with biometric liveness checks, government ID OCR, and real-time AML/PEP sanctions screening."
      },
      {
        "title": "02 Real-Time Credit Scoring & Automated Underwriting Engine",
        "description": "Ingest bureau credit files and bank statement analyzer data, running algorithmic risk models to generate instant loan term offers."
      },
      {
        "title": "03 Double-Entry Immutable Ledger & High-Throughput Transaction Core",
        "description": "Execute monetary transactions with strict double-entry debits and credits, maintaining mathematical consistency and cryptographic audit logs."
      },
      {
        "title": "04 Automated Regulatory Reporting, Audit Logs & Fraud Detection",
        "description": "Monitor transactional velocity for anomalous patterns, auto-generating compliance filings and regulatory audit exports."
      }
    ],
    "growthSolutions": [
      {
        "title": "FinTech Strategy",
        "items": [
          "Regulatory Compliance & Central Bank Licensing Audit",
          "Loan Underwriting & Risk Appetite Modeling",
          "Digital Banking Customer Journey Blueprint",
          "Account Aggregator & Open Banking Strategy",
          "Cybersecurity & Zero-Trust Architecture Plan",
          "B2B Corporate Banking Product Roadmapping"
        ]
      },
      {
        "title": "FinTech Platform Tech",
        "items": [
          "High-Throughput Double-Entry Ledger Core",
          "Instant e-KYC & Video Verification Pipeline",
          "Algorithmic Credit Scoring & Bureau Connector",
          "Automated e-NACH & Mandate Collection Engine",
          "Real-Time Anti-Fraud & Anomaly Detection APIs",
          "Encrypted Hardware Security Module (HSM) Sync"
        ]
      },
      {
        "title": "High-Trust FinTech UI/UX",
        "items": [
          "Clean, Reassuring Financial Account Portals",
          "Frictionless 3-Step Loan Application Funnel",
          "Interactive EMI & Interest Amortization Calculators",
          "Visual Portfolio Allocation & Growth Charts",
          "Biometric Passkey & Two-Factor Authentication UI",
          "Transparent Statement & Fee Breakdown Screens"
        ]
      },
      {
        "title": "Borrower & User Acquisition",
        "items": [
          "High-Intent Financial Product Search Campaigns",
          "Educational Financial Literacy Content Hubs",
          "Corporate Employee Benefit Banking Partnerships",
          "Targeted Retargeting on Pre-Approved Loan Offers",
          "FinTech Thought Leadership & Security PR",
          "Referral Incentives for High-Credit Borrowers"
        ]
      },
      {
        "title": "Financial Telemetry",
        "items": [
          "Loan Disbursal Velocity & Turnaround Time (TAT)",
          "Non-Performing Asset (NPA) & Default Risk Metrics",
          "KYC Verification Drop-off Point Diagnostics",
          "Mandate Success & Payment Bounce Rate Analytics",
          "Ledger Transaction Concurrency Telemetry",
          "Customer Account Retention & Engagement Cohorts"
        ]
      },
      {
        "title": "Bank-Grade Security",
        "items": [
          "End-to-End Field-Level AES-256 Encryption",
          "PCI-DSS Level 1 & SOC 2 Type II Certification Readiness",
          "Zero-Trust Network Segmentation Architecture",
          "Automated Anomaly & Velocity Fraud Defense",
          "Immutable Cryptographic Ledger Audit Trails",
          "Role-Based Granular Administrative Scopes"
        ]
      },
      {
        "title": "Financial Operations Automation",
        "items": [
          "Automated Daily Bank Escrow Reconciliation",
          "Overdue EMI WhatsApp & Automated Voice Reminders",
          "Digital Loan Agreement E-Signature Dispatch",
          "Instant Loan Disbursement via IMPS/NEFT APIs",
          "Automated Credit Bureau (CIBIL) Monthly Reporting",
          "Suspicious Activity Alert Auto-Escalation"
        ]
      },
      {
        "title": "Institutional Scale & Neo-Banking",
        "items": [
          "White-Label Co-Branded Card & Credit Line APIs",
          "Multi-Bank Partner Core Banking Switch",
          "Corporate Treasury Multi-Signatory Modules",
          "Cross-Border Remittance & Forex Settlement Hub",
          "Micro-Investment & Fractional Gold Integrations",
          "B2B Payroll & Direct Vendor Payment Engine"
        ]
      }
    ],
    "faqs": [
      {
        "question": "How do you ensure bank-grade security and regulatory compliance?",
        "answer": "We engineer field-level AES-256 encryption, TLS 1.3 transit encryption, zero-trust network policies, comprehensive penetration test suites, and cryptographic audit logs adhering to RBI/PCI-DSS standards."
      },
      {
        "question": "Can the platform automate loan underwriting and credit decisions?",
        "answer": "Yes. Our underwriting engine connects to credit bureaus, account aggregators, and bank statement parsers to evaluate income, debt-to-income ratios, and credit history, issuing automated approvals within seconds."
      },
      {
        "question": "How does the double-entry transaction ledger prevent reconciliation errors?",
        "answer": "Every transaction is recorded as balanced debit and credit entries within atomic database transactions, preventing phantom funds, negative balances, and discrepancies between customer balances and bank accounts."
      },
      {
        "question": "Does the system support recurring payment mandates (e-NACH / UPI Autopay)?",
        "answer": "Yes. We integrate e-NACH and UPI Autopay mandate registration during onboarding, allowing platforms to automatically pull recurring loan EMIs or subscription dues on scheduled dates."
      },
      {
        "question": "How does Video KYC (V-KYC) operate within the platform?",
        "answer": "We engineer WebRTC video KYC with geolocation tagging, facial liveness verification against government IDs, and concurrent agent verification checklists with encrypted video audit archiving."
      }
    ],
    "ctaHeadline": "Ready to build custom banking or FinTech software for your financial enterprise?",
    "ctaSubtext": "Speak with our financial engineering specialists to plan your digital lending engine, transaction ledgers, and compliance roadmap."
  },
  {
    "id": "health-beauty",
    "slug": "health-beauty",
    "name": "Health & Beauty",
    "iconSrc": "/industries/health-beauty.svg",
    "subtitle": "Salon and spa appointment engines, stylist scheduling, and personalized beauty formulas",
    "image": "/industries/health-beauty.png",
    "heroHeadline": "Modern salon, spa, and beauty clinic software engineered for high client retention.",
    "heroIntro": "We engineer custom booking platforms, therapist management systems, and client consultation records for luxury salons, wellness spas, and aesthetic beauty clinics. Designed to eliminate no-shows and boost repeat visits.",
    "keyHighlights": [
      "Visual stylist & chair scheduling with no-show deposits",
      "Client beauty formula cards, skin allergies & treatment history",
      "Membership packages, gift cards & tiered loyalty perks",
      "Automated rebooking sequences via SMS & WhatsApp"
    ],
    "aboutHeadline": "Transform salon appointments into high-touch, personalized wellness experiences.",
    "aboutLead": "Salons and aesthetic clinics lose thousands in revenue each month to last-minute client no-shows, double-booked treatment rooms, and lost client hair/skin formula notes.",
    "aboutBody": [
      "SPANYX builds specialized health and beauty technology designed for premium salons, day spas, and aesthetic dermatology clinics. Our systems let clients book preferred stylists, select treatments, and pay reservation deposits online.",
      "Our platforms equip therapists with digital formula cards—recording hair dye recipes, skin treatment parameters, and before/after photos—ensuring consistent luxury service across visits and multiple salon branches."
    ],
    "capabilitiesIntro": "Engineered capabilities to streamline salon operations and maximize client lifetime value.",
    "capabilities": [
      {
        "title": "Stylist & Resource Booking Calendar",
        "description": "Real-time scheduling matrix linking therapist availability, equipment, and treatment rooms to eliminate double bookings."
      },
      {
        "title": "Client Formula & Treatment Vault",
        "description": "Record personalized hair color ratios, skin allergy history, patch test dates, and treatment notes with before/after photo logs."
      },
      {
        "title": "No-Show Protection & Deposits",
        "description": "Require partial advance deposits or saved card holds during booking with automated cancellation policy enforcement."
      },
      {
        "title": "Memberships & Package Subscriptions",
        "description": "Sell monthly beauty memberships (e.g., blowouts, facials), prepaid treatment bundles, and branded digital gift cards."
      },
      {
        "title": "Retail Product Inventory & Commission",
        "description": "Track professional backbar inventory usage, retail product stock, and compute stylist product sales commissions automatically."
      },
      {
        "title": "Automated Rebooking Reminders",
        "description": "Trigger smart WhatsApp and SMS rebooking prompts right when a client hair color or facial is due for a touch-up."
      }
    ],
    "approachIntro": "Domain-specific beauty lifecycle from client booking to glowing loyalty.",
    "approach": [
      {
        "title": "01 Omnichannel Treatment Discovery & Stylist Portfolio Showcase",
        "description": "Showcase treatment menus, before/after galleries, and stylist specialties with seamless mobile booking flows across web and social channels."
      },
      {
        "title": "02 Smart Chair & Resource Scheduling with No-Show Deposit Holds",
        "description": "Coordinate therapist schedules, specialized equipment, and private treatment suites with credit card reservation holds to eliminate empty chairs."
      },
      {
        "title": "03 Personalized Client Formula Cards, Allergies & History Vault",
        "description": "Provide stylists with instant access to past color mixes, skin patch test records, and preference notes right on their tablet before service begins."
      },
      {
        "title": "04 Automated Rebooking Sequences & VIP Membership Subscriptions",
        "description": "Trigger intelligent touch-up reminder messages at the ideal 4 to 6-week interval, incentivizing ongoing memberships and retail product replenishment."
      }
    ],
    "growthSolutions": [
      {
        "title": "Beauty Business Strategy",
        "items": [
          "Salon Chair Utilization & Revenue Audit",
          "No-Show Reduction & Deposit Policy Strategy",
          "Stylist Commission & Incentive Structuring",
          "High-Margin Treatment Package Architecture",
          "Client Rebooking Cadence Optimization",
          "Multi-Branch Brand Expansion Blueprint"
        ]
      },
      {
        "title": "Salon Tech Engineering",
        "items": [
          "High-Speed Mobile Appointment Booking Engine",
          "Dynamic Stylist & Room Scheduling Matrix",
          "Encrypted Client Treatment Formula Vault",
          "Pre-Authorized Card Deposit & Payment Integration",
          "Professional Backbar Inventory Deduction APIs",
          "Automated Multi-Channel Messaging Webhooks"
        ]
      },
      {
        "title": "Luxury Aesthetics UI/UX",
        "items": [
          "Editorial Luxury Typography & Visual Menus",
          "Frictionless 3-Step Stylist & Time Slot Picker",
          "Visual Treatment Before & After Comparison Cards",
          "Intuitive Stylist In-Service Tablet Interface",
          "Delightful Digital Gift Card Redemption Screen",
          "Clean Client Membership Wallet View"
        ]
      },
      {
        "title": "Beauty Client Acquisition",
        "items": [
          "Local Salon & Spa Google Maps SEO",
          "Instagram Visual Transformation Video Ads",
          "New Client First-Visit Promotional Funnels",
          "Automated WhatsApp Birthday Treat Campaigns",
          "Influencer Treatment Review Partnerships",
          "Corporate Wellness Package Outreach"
        ]
      },
      {
        "title": "Salon Telemetry",
        "items": [
          "Stylist Chair Occupancy & Revenue Per Hour",
          "Client Rebooking Frequency & Retention Cohorts",
          "No-Show & Last-Minute Cancellation Telemetry",
          "Retail Product Attachment Rate Analytics",
          "Treatment Profit Margin Contribution Metrics",
          "Customer Satisfaction & Google Review Scores"
        ]
      },
      {
        "title": "Client Privacy & Trust",
        "items": [
          "Encrypted Client Health & Allergy Records",
          "Strict Consent Logging for Patch Tests",
          "Confidential Treatment Photo Storage",
          "PCI-DSS Compliant Card Information Vaults",
          "Staff Non-Solicitation Data Protection Scopes",
          "GDPR Compliant Client Marketing Opt-Ins"
        ]
      },
      {
        "title": "Operations Automation",
        "items": [
          "Automated Stylist Commission Pay Slip Generation",
          "Low Product Stock Threshold Alerts",
          "Day-Before Appointment SMS Confirmation Prompts",
          "Post-Visit Thank You & Review Request Dispatch",
          "End-of-Day Cash Drawer & POS Reconciliation",
          "Treatment Room Cleaning Notification Timers"
        ]
      },
      {
        "title": "Scale & Beauty Franchising",
        "items": [
          "Multi-Branch Centralized Customer Profiles",
          "Franchise Inventory Master Distribution Hub",
          "Enterprise Loyalty Points Redeemable Anywhere",
          "Brand Retail eCommerce Extension Store",
          "Corporate Beauty Subscription Tiers",
          "Staff Training & Academy Management Module"
        ]
      }
    ],
    "faqs": [
      {
        "question": "How does the platform eliminate salon appointment no-shows?",
        "answer": "By requiring advance deposits or card holds during booking and sending automated WhatsApp/SMS reminders with 1-click confirmation, salons typically reduce no-shows by over 75%."
      },
      {
        "question": "Can stylists save customized color formulas and treatment notes?",
        "answer": "Yes. Stylists use digital formula cards on mobile or tablet to log exact gram measurements, developer strengths, processing times, and upload high-res photos for future visits."
      },
      {
        "question": "How does resource scheduling handle rooms and specialized equipment?",
        "answer": "The scheduler checks therapist availability, room vacancy, and equipment readiness simultaneously, ensuring treatments like laser therapy or hydrafacials are never double-booked."
      },
      {
        "question": "Can salons sell recurring monthly beauty memberships?",
        "answer": "Yes. Clients can subscribe to monthly recurring plans (e.g. 2 haircuts + 1 facial per month) with automated card billing and remaining credit tracking inside their client wallet."
      },
      {
        "question": "Can the software track stylist commissions on retail products?",
        "answer": "Yes. The checkout system automatically credits product sales and service revenues to the assigned stylist, calculating tiered commissions and generating transparent weekly payout reports."
      }
    ],
    "ctaHeadline": "Ready to build custom salon or spa software for your beauty business?",
    "ctaSubtext": "Speak with our product team to plan your stylist booking workflows, client formula vaults, and multi-branch management system."
  },
  {
    "id": "community-web-design",
    "slug": "community-web-design",
    "name": "Community & Non-Profit",
    "iconSrc": "/industries/community-web-design.svg",
    "subtitle": "Member management platforms, donation engines, 80G tax receipts, and event ticketing",
    "image": "/industries/community-web-design.png",
    "heroHeadline": "High-trust community and non-profit platforms engineered for civic impact.",
    "heroIntro": "We engineer custom member engagement platforms, donation management engines, and non-profit websites. Designed for verified community directories, transparent fundraising, automated tax exemption receipts, and volunteer coordination.",
    "keyHighlights": [
      "Recurring donor subscriptions & automated 80G tax receipts",
      "Verified member directories & interest-based groups",
      "Event ticketing, check-in QR codes & speaker schedules",
      "Transparent impact telemetry & donor fund utilization"
    ],
    "aboutHeadline": "Empower civic communities and non-profits with modern digital infrastructure.",
    "aboutLead": "Non-profits and community associations struggle with scattered donor lists, manual tax receipt generation, disorganized WhatsApp groups, and lost volunteer engagement.",
    "aboutBody": [
      "SPANYX builds custom community and non-profit technology that drives real social impact. We engineer intuitive donation engines supporting recurring monthly gifts, multi-currency international contributions, and instant tax exemption receipt generation.",
      "Our member portals provide safe spaces for community networking—featuring verified member directories, event registrations with QR check-in badges, and transparent public dashboards showing exactly how funds are deployed."
    ],
    "capabilitiesIntro": "Civic tools engineered for donor engagement, governance, and community growth.",
    "capabilities": [
      {
        "title": "Donation Engine & Tax Receipts",
        "description": "Accept one-time and recurring donations with instant automated 80G, 501(c)(3), or local tax exemption certificate PDF generation."
      },
      {
        "title": "Verified Member Directory",
        "description": "Searchable community directory with member profiles, chapter badges, profession filters, and privacy-shielded contact requests."
      },
      {
        "title": "Event Ticketing & QR Check-In",
        "description": "Sell tickets or register attendees for conferences, galas, and webinars with digital wallet passes and volunteer QR scanner tools."
      },
      {
        "title": "Volunteer Management & Shifts",
        "description": "Recruit, onboard, and assign volunteers to specific social initiatives, tracking volunteer hours and issuing service certificates."
      },
      {
        "title": "Transparent Impact Telemetry",
        "description": "Publicly showcase fund utilization, live campaign progress meters, beneficiary counts, and audited financial statements."
      },
      {
        "title": "Discussion Hubs & Chapters",
        "description": "Moderated community message boards, localized city chapters, and interest group spaces with role-based moderation."
      }
    ],
    "approachIntro": "Domain-specific non-profit lifecycle from civic outreach to measurable social impact.",
    "approach": [
      {
        "title": "01 Member Tier Onboarding & Verified Directory Profiling",
        "description": "Onboard community members, alumni, and donors with identity verification, chapter assignments, and privacy-controlled interest tags."
      },
      {
        "title": "02 Recurring Membership Dues & Instant 80G/Tax Receipt Generation",
        "description": "Collect recurring monthly/annual pledges seamlessly, instantly issuing compliant 80G / 501(c)(3) tax receipts with encrypted verification seals."
      },
      {
        "title": "03 Event Ticketing, RSVP Management & Speaker Agenda Coordination",
        "description": "Orchestrate community summits and charity galas with tiered ticketing, mobile QR check-in badges, and interactive session agendas."
      },
      {
        "title": "04 Moderated Discussion Hubs & Volunteer Shift Orchestration",
        "description": "Engage members in constructive civic forums while coordinating volunteer rosters and publishing transparent fund utilization metrics."
      }
    ],
    "growthSolutions": [
      {
        "title": "Non-Profit Strategy",
        "items": [
          "Donor Acquisition & Retention Economics Audit",
          "Recurring Giving & Major Donor Roadmap",
          "Community Governance & Member Rights Architecture",
          "Tax Compliance (80G/FCRA/501c3) Readiness",
          "Corporate CSR Partnership Pitch Structuring",
          "Volunteer Engagement & Leadership Pipeline"
        ]
      },
      {
        "title": "Community Tech Engineering",
        "items": [
          "High-Speed Recurring Donation Platform",
          "Automated Cryptographic Tax Receipt Generator",
          "Verified Searchable Member Directory Hub",
          "Event Registration & Volunteer QR Check-In APIs",
          "Interactive Campaign Impact Progress Meters",
          "Role-Based Community Moderation Console"
        ]
      },
      {
        "title": "Trust & Impact UI/UX",
        "items": [
          "Inspiring, Human-Centric Storytelling Layouts",
          "Frictionless 2-Tap Donation Checkout Flow",
          "Interactive Impact Data & Financial Visualizations",
          "Clean, Accessible Member Profile Directory",
          "Branded Mobile Volunteer Check-In Screen",
          "Transparent Beneficiary Photo & Video Galleries"
        ]
      },
      {
        "title": "Cause & Donor Acquisition",
        "items": [
          "Google Ad Grants Non-Profit SEO & Search Ads",
          "Social Cause Storytelling & Viral Video Funnels",
          "Corporate CSR Matching Gift Outreach",
          "Annual Gala & Charity Auction Lead Generation",
          "Automated Donor Impact Update Newsletters",
          "Community Influencer Advocacy Partnerships"
        ]
      },
      {
        "title": "Impact Telemetry",
        "items": [
          "Donor Retention Rate & Recurring Gift Churn",
          "Fundraising Campaign Velocity & Goal Progress",
          "Average Gift Size & Donor Lifetime Giving",
          "Volunteer Hours & Initiative Participation Rates",
          "Event Attendance vs Registration Drop-off",
          "Tax Receipt Download & Verification Telemetry"
        ]
      },
      {
        "title": "Governance & Fund Security",
        "items": [
          "PCI-DSS Compliant Multi-Gateway Donating",
          "FCRA & International Wire Compliance Vaults",
          "Role-Based Trustee & Volunteer Access Scopes",
          "Cryptographic Tax Receipt Signature Verification",
          "Encrypted Donor Personal Information Storage",
          "Independent Financial Audit Trail Logging"
        ]
      },
      {
        "title": "Community Automation",
        "items": [
          "Automated Annual Giving Summary Statements",
          "Lapsed Donor Re-Engagement Email Sequences",
          "Volunteer Shift Reminder WhatsApp Notifications",
          "Event Ticket QR Code Automated Dispatch",
          "New Member Welcome & Chapter Routing Bots",
          "Daily Donation Settlement & Ledger Sync"
        ]
      },
      {
        "title": "Scale & Federation Networks",
        "items": [
          "Multi-Chapter Federation Governance Architecture",
          "Centralized NGO Trust Multi-Project Accounting",
          "Corporate CSR Direct Payroll Giving Integration",
          "Global Multi-Currency Foreign Giving Support",
          "Alumni Giving & Endowment Fund Management",
          "B2B Corporate Social Responsibility Reporting"
        ]
      }
    ],
    "faqs": [
      {
        "question": "Can the donation engine automatically issue 80G or 501(c)(3) tax receipts?",
        "answer": "Yes. Immediately after a donation is processed, the system generates a digitally signed PDF receipt with serial numbers, PAN/EIN details, and QR verification codes compliant with tax authorities."
      },
      {
        "question": "Does the platform support recurring monthly donor subscriptions?",
        "answer": "Yes. Donors can select monthly recurring contributions via credit card, UPI Autopay, or direct debit, with automated monthly receipts and self-service pledge management."
      },
      {
        "question": "How do you protect member privacy in community directories?",
        "answer": "Members choose what information is public (e.g. name and city only), while phone numbers and emails can be hidden behind an in-platform contact request form to prevent spam and data scraping."
      },
      {
        "question": "Can event organizers scan tickets and check in attendees using smartphones?",
        "answer": "Yes. Volunteers and staff use a browser-based QR scanner on any smartphone to validate attendee QR codes in under a second, updating attendance records in real time."
      },
      {
        "question": "Can we showcase live project updates to show donors how their money was spent?",
        "answer": "Yes. We build transparent impact tracking dashboards where organizations post field photos, expenditure breakdowns, and beneficiary milestones linked directly to specific fundraising campaigns."
      }
    ],
    "ctaHeadline": "Ready to build custom software for your community or non-profit organization?",
    "ctaSubtext": "Consult with our team to plan your donation engine, member directory, and community engagement platform."
  },
  {
    "id": "hotels-restaurants",
    "slug": "hotels-restaurants",
    "name": "Hotels & Restaurants",
    "iconSrc": "/industries/hotels-restaurants.svg",
    "subtitle": "Zero-commission hotel booking engines, 2-way PMS/OTA channel managers, and table reservations",
    "image": "/industries/hotels-restaurants.png",
    "heroHeadline": "Hospitality software architectures engineered for boutique hotels, resorts, and dining.",
    "heroIntro": "We engineer direct booking engines, two-way OTA channel synchronization, and table reservation systems for hotels, luxury resorts, and fine dining restaurants. Designed to cut OTA commissions and elevate guest experiences.",
    "keyHighlights": [
      "Direct zero-commission room booking engine & payments",
      "Two-way PMS & OTA channel synchronization (Booking.com, Expedia)",
      "Table reservation management with dining guest preferences",
      "Contactless mobile check-in & digital room keycard integration"
    ],
    "aboutHeadline": "Reclaim direct guest relationships and maximize RevPAR across rooms and dining.",
    "aboutLead": "Hotels surrender 18–25% of room revenue to online travel agencies (OTAs) while fine dining venues struggle with empty tables from telephone no-shows and disconnected POS systems.",
    "aboutBody": [
      "SPANYX builds specialized hospitality software that drives direct bookings. We engineer high-converting hotel reservation engines that showcase room amenities, seasonal package rates, and dining experiences with zero third-party commissions.",
      "Our platforms sync two-way with major channel managers and Property Management Systems (PMS), preventing double bookings across OTAs while giving hotel managers integrated control over room rates, guest loyalty, and table reservations."
    ],
    "capabilitiesIntro": "Hospitality engineering capabilities to automate reservations and guest operations.",
    "capabilities": [
      {
        "title": "Direct Hotel Booking Engine",
        "description": "High-speed room reservation engine with live availability calendars, room comparison cards, add-on experiences, and instant multi-currency checkout."
      },
      {
        "title": "Two-Way Channel Manager Sync",
        "description": "Real-time rate and inventory synchronization with Booking.com, Expedia, Agoda, and Airbnb, eliminating double bookings."
      },
      {
        "title": "Table Reservation & Floorplan Desk",
        "description": "Visual restaurant table management, shift reservation limits, dietary preference logging, and SMS confirmation prompts."
      },
      {
        "title": "Contactless Guest Check-In",
        "description": "Mobile web check-in allowing guests to upload identity documents, sign registration cards, and receive digital room keycards."
      },
      {
        "title": "Unified Hotel POS & Folio Billing",
        "description": "Post restaurant meals, spa sessions, and room service charges directly to the guest room folio for consolidated checkout settlement."
      },
      {
        "title": "Guest Loyalty & Personalization",
        "description": "Store guest preferences (pillow type, anniversary dates, favorite wine) and automate personalized pre-arrival welcome sequences."
      }
    ],
    "approachIntro": "Domain-specific hospitality lifecycle from direct reservation to five-star review.",
    "approach": [
      {
        "title": "01 Direct Zero-Commission Booking Engine & 2-Way PMS/OTA Channel Sync",
        "description": "Capture direct guest reservations with rich room previews while continuously syncing room availability across Booking.com and Expedia."
      },
      {
        "title": "02 Contactless Digital Check-in & Mobile Keycard Integration",
        "description": "Empower arriving guests to upload travel IDs, sign digital registration cards, and access digital room keys without waiting in reception lines."
      },
      {
        "title": "03 Table Reservation, Table turnover & Unified Kitchen POS Sync",
        "description": "Manage dining room floorplans and dinner reservations, billing restaurant charges straight to the guest hotel room folio."
      },
      {
        "title": "04 Guest Stay Personalization, Loyalty Ledger & Automated Review Ingestion",
        "description": "Tailor in-stay guest experiences based on past visit preferences and trigger post-checkout review requests on TripAdvisor and Google."
      }
    ],
    "growthSolutions": [
      {
        "title": "Hospitality Strategy",
        "items": [
          "Direct vs OTA Channel Commission Audit",
          "Revenue Per Available Room (RevPAR) Strategy",
          "Seasonal Yield Management & Dynamic Pricing Plan",
          "Guest Experience & Loyalty Retention Roadmap",
          "Boutique Hotel & Resort Brand Differentiation",
          "Corporate Retreat & Event Revenue Strategy"
        ]
      },
      {
        "title": "Hospitality Tech Engineering",
        "items": [
          "High-Conversion Direct Hotel Booking Engine",
          "Bidirectional 2-Way OTA Channel Manager Sync",
          "Visual Restaurant Table & Shift Reservation Desk",
          "Contactless Mobile Web Guest Check-In Hub",
          "Centralized Guest Folio & Room Billing Sync",
          "Property Management System (PMS) Connector APIs"
        ]
      },
      {
        "title": "Luxury Guest UI/UX",
        "items": [
          "Immersive Full-Bleed Property Photography Layouts",
          "Effortless 2-Step Room & Date Selection Grid",
          "Visual Room Category & Amenity Comparison Views",
          "Interactive Restaurant Dining Floorplan Screen",
          "Mobile Digital Concierge & Room Service Portal",
          "Elegant Guest Invoice & Checkout Statement View"
        ]
      },
      {
        "title": "Direct Guest Acquisition",
        "items": [
          "High-Intent Luxury Resort Search Campaigns",
          "Google Hotel Ads Direct Booking Integration",
          "Instagram & Meta Lifestyle Travel Ad Funnels",
          "Automated Pre-Arrival WhatsApp Concierge Sequences",
          "Seasonal Early-Bird & Weekend Stay Promotions",
          "Corporate Event & Wedding Venue Lead Generation"
        ]
      },
      {
        "title": "Hospitality Telemetry",
        "items": [
          "Direct Booking Share vs OTA Dependency Metrics",
          "RevPAR & Average Daily Rate (ADR) Diagnostics",
          "Guest Table Turnover & Dining Spend Telemetry",
          "Mobile Check-In Adoption & Front Desk Queue Times",
          "Room Type Occupancy & Demand Velocity Patterns",
          "Guest Satisfaction & Online Review Score Trends"
        ]
      },
      {
        "title": "Security & Guest Privacy",
        "items": [
          "PCI-DSS Compliant Credit Card Information Vaults",
          "Encrypted Guest Passport & ID Storage",
          "Role-Based Front Desk & Housekeeping Staff Scopes",
          "Strict Regulatory Guest Register Compliance",
          "Secure Digital Keycard Cryptographic Protocols",
          "GDPR Compliant Guest Data Erasure Workflows"
        ]
      },
      {
        "title": "Hotel Operations Automation",
        "items": [
          "Automated Channel Manager Room Inventory Updates",
          "Housekeeping Room Clean Status Real-Time Alerts",
          "Day-Before Arrival Welcome WhatsApp Prompts",
          "Post-Checkout Automated TripAdvisor Review Requests",
          "Daily Revenue & Night Audit Reconciliation",
          "Lost and Found Item Digital Logging Desk"
        ]
      },
      {
        "title": "Scale & Hotel Chain Networks",
        "items": [
          "Multi-Property Central Reservation System (CRS)",
          "Consolidated Hotel Chain Loyalty Points Program",
          "Corporate Negotiated Rate & Travel Agent Modules",
          "Integrated Spa & Wellness Facility Schedulers",
          "Banquet & Wedding Hall Booking Management",
          "Regional Hotel Group Financial Auditing"
        ]
      }
    ],
    "faqs": [
      {
        "question": "How does the direct booking engine sync with OTAs like Booking.com and Expedia?",
        "answer": "We integrate with leading channel managers via certified 2-way APIs. When a room is booked on your website, availability instantly reduces across all OTAs in under 3 seconds."
      },
      {
        "question": "Can guests check in online before arriving at the property?",
        "answer": "Yes. Guests receive a link 24 hours prior to arrival, allowing them to confirm arrival times, upload photo IDs, and sign registration forms, enabling express key pickup."
      },
      {
        "question": "Does the system support dynamic pricing and seasonal rate rules?",
        "answer": "Yes. Revenue managers can configure seasonal rates, weekend premiums, minimum length-of-stay (MLOS) restrictions, and promotional coupon codes with automated rate adjustments."
      },
      {
        "question": "Can restaurant meals and spa visits be charged to guest room folios?",
        "answer": "Yes. Our point-of-sale middleware allows waitstaff and therapists to verify guest room numbers and signatures, billing charges directly to the central PMS room folio for departure settlement."
      },
      {
        "question": "How do you encourage guests to book directly instead of using OTAs?",
        "answer": "We engineer direct booking incentives into the booking engine: free breakfast add-ons, flexible cancellation, early check-in perks, and direct-only loyalty discounts that convert travelers."
      }
    ],
    "ctaHeadline": "Ready to build custom hospitality software for your hotel or restaurant?",
    "ctaSubtext": "Speak with our hospitality engineering specialists to plan your direct booking engine, channel manager sync, and guest management system."
  },
  {
    "id": "jewelry-fashion",
    "slug": "jewelry-fashion",
    "name": "Jewelry & Luxury Fashion",
    "iconSrc": "/industries/jewelry-fashion.svg",
    "subtitle": "Photorealistic 3D configurators, live gold rate sync, diamond certificates, and luxury atelier portals",
    "image": "/industries/jewelry-fashion.png",
    "heroHeadline": "Luxury jewelry and haute fashion platforms engineered for bespoke elegance.",
    "heroIntro": "We engineer photorealistic 3D jewelry configurators, live gold/diamond market rate synchronizers, and high-security luxury eCommerce platforms for fine jewelers and luxury fashion ateliers.",
    "keyHighlights": [
      "Interactive 360° 3D ring & jewelry customization configurator",
      "Live bullion gold, silver & diamond market rate pricing APIs",
      "GIA, IGI & diamond certificate verification vaults",
      "Virtual concierge video shopping & private atelier appointments"
    ],
    "aboutHeadline": "Translate fine craftsmanship into bespoke, high-trust digital luxury experiences.",
    "aboutLead": "Fine jewelry and luxury fashion houses struggle to sell high-ticket items online when static 2D photos fail to convey sparkle, metal weight, and intricate gemstone craftsmanship.",
    "aboutBody": [
      "At SPANYX, we build specialized digital luxury software that matches the prestige of your physical boutique. We engineer photorealistic 3D configurators allowing buyers to customize ring settings, metal alloys, and diamond carats in real time.",
      "Our platforms integrate live bullion price feeds to recalculate precious metal retail prices automatically, authenticate certified gemstone grading reports (GIA, IGI), and provide high-net-worth clients with private video appointment shopping."
    ],
    "capabilitiesIntro": "Luxury engineering capabilities built for high-value jewelry and fashion houses.",
    "capabilities": [
      {
        "title": "360° 3D Jewelry Configurator",
        "description": "Interactive WebGL 3D modeler allowing clients to choose diamond shapes, settings, prong styles, and metal finishes with photorealistic lighting."
      },
      {
        "title": "Live Bullion & Gemstone Pricing",
        "description": "Dynamic calculation engine recalculating jewelry prices in real time based on live market gold/platinum spot rates and diamond 4C parameters."
      },
      {
        "title": "Gemstone Certificate Verification",
        "description": "Instant GIA, IGI, and HRD certificate lookup displaying verified grading reports, cut proportions, and laser inscription records."
      },
      {
        "title": "Virtual Concierge Appointments",
        "description": "One-on-one high-definition video shopping platform with interactive product carousels for remote luxury consultations."
      },
      {
        "title": "High-Value Insured Shipping Logistics",
        "description": "Integrate specialized armored and insured logistics providers with OTP delivery verification and tamper-evident packaging tracking."
      },
      {
        "title": "Custom Ring Sizer & AR Try-On",
        "description": "Digital screen-based ring sizing guides and mobile augmented reality (AR) hand preview tools to ensure confident purchasing."
      }
    ],
    "approachIntro": "Domain-specific luxury jewelry lifecycle from 3D design customization to insured delivery.",
    "approach": [
      {
        "title": "01 360° Photorealistic 3D Viewer & Custom Ring/Jewelry Configurator",
        "description": "Render high-definition WebGL jewelry assets, allowing buyers to customize stone shapes, prong styles, and precious metals with photorealistic reflections."
      },
      {
        "title": "02 Real-Time Precious Metal & Diamond Certification Feed Sync (GIA/IGI)",
        "description": "Sync live bullion market spot rates (gold, platinum) with certified diamond inventories, dynamically updating retail pricing down to the gram."
      },
      {
        "title": "03 High-Security Insured Shipping & Certificate Vault Generation",
        "description": "Attach verifiable GIA/IGI grading certificates to customer digital vaults, coordinating specialized armored delivery with tamper-proof packaging."
      },
      {
        "title": "04 Private Virtual Styling Appointments & Bespoke Atelier Ordering",
        "description": "Host private video consultations with high-net-worth clients, reviewing custom CAD blueprints and capturing bespoke order milestones."
      }
    ],
    "growthSolutions": [
      {
        "title": "Luxury Brand Strategy",
        "items": [
          "High-Ticket Digital Luxury Conversion Audit",
          "Diamond & Precious Metal Margin Pricing Model",
          "High-Net-Worth Client Experience Blueprint",
          "Omnichannel Boutique & Digital Salon Strategy",
          "Heirloom & Custom Engagement Ring Positioning",
          "International Insured Luxury Export Roadmap"
        ]
      },
      {
        "title": "Luxury Tech Engineering",
        "items": [
          "High-Fidelity WebGL 3D Jewelry Configurator",
          "Live Gold & Bullion Market Spot Price API Sync",
          "GIA & IGI Diamond Certificate Verification Engine",
          "High-Definition Virtual Boutique Video Shopping",
          "Secure High-Value Escrow Payment Gateway Hub",
          "Augmented Reality (AR) Ring Hand Try-On Module"
        ]
      },
      {
        "title": "Haute Aesthetics UI/UX",
        "items": [
          "Museum-Grade Luxury Typography & Spacing",
          "Silky 60fps 360-Degree Gemstone Rotation",
          "Interactive Diamond 4Cs Educational Slider",
          "Clean, High-Trust Certificate Verification Modal",
          "Private VIP Atelier Appointment Booking Screen",
          "Exquisite Gift Packaging & Engraving Selection Flow"
        ]
      },
      {
        "title": "Luxury Client Acquisition",
        "items": [
          "High-Intent Engagement Ring & Fine Jewelry SEO",
          "Luxury Lifestyle & Bridal Meta Video Campaigns",
          "Google Search Campaigns on Certified Diamonds",
          "Private VIP Invitation-Only Collection Previews",
          "High-Society Influencer & Red Carpet Placements",
          "Bespoke Anniversary Concierge Direct Outreach"
        ]
      },
      {
        "title": "Luxury Telemetry",
        "items": [
          "3D Configurator Engagement & Customization Velocity",
          "Virtual Appointment-to-Sale Conversion Yield",
          "Average Order Value (AOV) & Metal Margin Metrics",
          "Cart Drop-off Points for High-Value Transactions",
          "Customer Lifetime Value & Anniversary Rebooking Cohorts",
          "Insured Delivery Transit Time & Security Telemetry"
        ]
      },
      {
        "title": "Security & Gemstone Integrity",
        "items": [
          "Strict High-Value Anti-Fraud & Identity Verification",
          "Tamper-Proof Holographic Packaging Protocols",
          "Encrypted High-Net-Worth Client Purchase Records",
          "PCI-DSS Compliant Multi-Card Split Transactions",
          "Armored Courier Logistics API Integration",
          "Immutable Digital Certificate of Authenticity Vaults"
        ]
      },
      {
        "title": "Atelier Operations Automation",
        "items": [
          "Daily Gold & Platinum Market Price Auto-Updates",
          "Custom CAD Jewelry Manufacturing Milestone Alerts",
          "Appointment Reminder WhatsApp Concierge Prompts",
          "Insured Courier Shipping Waybill Generation",
          "Annual Ring Cleaning & Inspection Reminders",
          "End-of-Day Bullion Inventory Reconciliation"
        ]
      },
      {
        "title": "Scale & Global Boutiques",
        "items": [
          "Multi-Boutique Centralized Gemstone Inventory",
          "Cross-Border Luxury Customs & Duty Calculation",
          "Bespoke Bridal Registry & Wishlist Portals",
          "Corporate High-Ticket Luxury Gifting Modules",
          "Blockchain-Backed Gemstone Provenance Passports",
          "Native iPad App for Physical Boutique Sales Staff"
        ]
      }
    ],
    "faqs": [
      {
        "question": "How does live gold and precious metal price synchronization work?",
        "answer": "Our pricing engine connects to live financial bullion feeds, automatically recalculating the retail price of rings, chains, and bangles based on net gold weight, purity (18K/22K), making charges, and diamond costs."
      },
      {
        "question": "Can clients customize their own engagement rings in 3D?",
        "answer": "Yes. Our WebGL 3D configurator lets clients choose diamond cuts, band metals (yellow, rose, white gold, platinum), side stones, and prong styles with instant photorealistic 360-degree rotation."
      },
      {
        "question": "How are certified diamond grading reports verified?",
        "answer": "Clients enter report numbers or scan QR codes to query our verification API, which displays official GIA/IGI digital certificates, clarity plots, cut grades, and laser inscription details directly on page."
      },
      {
        "question": "How do you handle high-value transaction payments securely?",
        "answer": "We engineer multi-tier fraud detection, bank wire transfer validation, and split-payment capabilities allowing clients to divide high-ticket transactions across multiple credit cards or bank accounts."
      },
      {
        "question": "Can remote clients book virtual private shopping sessions with a gemologist?",
        "answer": "Yes. Clients can schedule dedicated virtual appointments where a specialist displays jewelry via high-definition video, controls shared 3D configurator models, and generates custom checkout links."
      }
    ],
    "ctaHeadline": "Ready to build custom luxury software for your jewelry or fashion house?",
    "ctaSubtext": "Consult with our luxury engineering team to plan your 3D configurator, live bullion rate engine, and high-security commerce platform."
  },
  {
    "id": "news-blogs-publications",
    "slug": "news-blogs-publications",
    "name": "News, Blogs & Publications",
    "iconSrc": "/industries/news-blogs-publications.svg",
    "subtitle": "High-traffic publishing architectures, headless CMS, metered paywalls, and programmatic ad tech",
    "image": "/industries/news-blogs-publications.png",
    "heroHeadline": "High-throughput digital publishing platforms engineered for millions of readers.",
    "heroIntro": "We engineer ultra-fast publishing architectures, custom headless CMS solutions, and reader subscription paywalls for digital magazines, news publications, and editorial networks.",
    "keyHighlights": [
      "Sub-second page speeds with edge-rendered article caching",
      "Intelligent metered paywalls & subscription billing",
      "Editorial multi-author workflow with revision histories",
      "Core Web Vitals optimized for top Google Discover ranking"
    ],
    "aboutHeadline": "Engineered for viral traffic surges, reader subscriptions, and maximum ad yield.",
    "aboutLead": "Publishers suffer heavy revenue loss when sluggish WordPress sites crash under breaking news traffic, aggressive ad scripts destroy Core Web Vitals, and reader monetization is solely dependent on declining ad rates.",
    "aboutBody": [
      "SPANYX builds modern publishing platforms designed for editorial speed and audience monetization. We engineer headless CMS architectures that deliver sub-second article loading, instant AMP and RSS syndication, and flawless Google Discover optimization.",
      "Our platforms integrate flexible reader subscription models—including metered paywalls, premium newsletters, and member-only audio articles—allowing media publications to build predictable, recurring subscription revenue."
    ],
    "capabilitiesIntro": "Publishing engineering capabilities built for high-traffic media organizations.",
    "capabilities": [
      {
        "title": "Ultra-Fast Article Delivery",
        "description": "Edge-cached server-rendered article layouts achieving sub-second Largest Contentful Paint (LCP) and zero Cumulative Layout Shift (CLS)."
      },
      {
        "title": "Intelligent Metered Paywalls",
        "description": "Configurable paywall rules (e.g. 3 free articles per month, dynamic propensity scoring) with seamless subscription billing via Stripe or Razorpay."
      },
      {
        "title": "Collaborative Editorial CMS",
        "description": "Multi-author rich text editor with real-time collaborative editing, editorial approval stages, image compression, and revision history."
      },
      {
        "title": "Programmatic Ad & Header Bidding",
        "description": "Optimized ad slot architecture with lazy-loading header bidding (Prebid.js) that maximizes revenue per thousand impressions (RPM) without jank."
      },
      {
        "title": "Automated Newsletters & Audio Articles",
        "description": "Automated newsletter digests from published stories, AI-assisted text-to-speech audio articles, and podcast feeds."
      },
      {
        "title": "Editorial & Audience Telemetry",
        "description": "Real-time author performance dashboards tracking active reader scroll depth, reading time, viral traffic sources, and subscription conversions."
      }
    ],
    "approachIntro": "Domain-specific digital publishing lifecycle from breaking scoop to reader subscription.",
    "approach": [
      {
        "title": "01 Low-Latency Headless Content Authoring & Editorial Review Desk",
        "description": "Empower editorial teams with collaborative, block-based writing desks, automated SEO auditing, and multi-tier editor review approvals."
      },
      {
        "title": "02 Dynamic Multi-Format Publishing (AMP, RSS, Apple News, Newsletters)",
        "description": "Publish breaking stories simultaneously to edge-cached web, Google Discover, Google News, Apple News, and automated email subscriber blasts."
      },
      {
        "title": "03 Intelligent Metered Paywalls & Reader Subscription Management",
        "description": "Track reader article consumption with client and edge cookies, dynamically prompting registration or paid membership subscriptions."
      },
      {
        "title": "04 Real-Time Content Performance Analytics & High-Yield Ad Mediation",
        "description": "Monitor concurrent reader attention, scroll depth, and ad viewability in real time, auto-optimizing programmatic header bidding yields."
      }
    ],
    "growthSolutions": [
      {
        "title": "Media Strategy",
        "items": [
          "Digital Publishing Monetization & Paywall Audit",
          "Reader Revenue vs Advertising Yield Modeling",
          "Google Discover & Top Stories Traffic Strategy",
          "Editorial Desk Workflow & Speed Optimization",
          "Newsletter Audience Growth & Retention Plan",
          "Podcast & Video Multimedia Syndication Roadmap"
        ]
      },
      {
        "title": "Publishing Platform Tech",
        "items": [
          "Ultra-Fast Next.js Edge-Rendered Article Engine",
          "Custom Headless CMS with Collaborative Editing",
          "Metered & Hard Paywall Subscription System",
          "Optimized Header Bidding & Ad Mediation Layer",
          "Automated RSS, Google News & Apple News Feeds",
          "AI-Powered Text-to-Speech Audio Article Player"
        ]
      },
      {
        "title": "Reader-First UI/UX",
        "items": [
          "Typography-First Distraction-Free Reading Layout",
          "Non-Intrusive Layout-Stable Ad Placement Zones",
          "Frictionless 1-Click Social Sign-in & Paywall Gate",
          "Dark-Mode & Font Size Reader Controls",
          "Clean, Sticky Audio Article Player Bar",
          "Engaging Infinite Scroll Related Article Flow"
        ]
      },
      {
        "title": "Audience Growth & SEO",
        "items": [
          "Google News & Discover Technical SEO Architecture",
          "Automated NewsArticle Schema Markup Integration",
          "High-CTR Social Media Headline & Card Testing",
          "Subscriber Newsletter Referral Reward Programs",
          "Trending Topic & Breaking News Push Notifications",
          "Syndication Partnerships with Major Aggregators"
        ]
      },
      {
        "title": "Editorial Telemetry",
        "items": [
          "Real-Time Concurrent Readers by Active Article",
          "Article Scroll Depth & Attention Time Metrics",
          "Paywall Impression-to-Subscriber Conversion Rate",
          "Author Productivity & Viewership Yield Analytics",
          "Core Web Vitals Real-User Monitoring (RUM)",
          "Ad Viewability & Fill-Rate Telemetry by Slot"
        ]
      },
      {
        "title": "Publication Security & Speed",
        "items": [
          "Enterprise DDoS & Bot Traffic Mitigation",
          "Edge Caching with Instant Stale-While-Revalidate Purges",
          "Role-Based Journalist & Editor Access Permissions",
          "Encrypted Subscriber Billing & Payment Vaults",
          "Ad Verification & Malicious Script Sandboxing",
          "Strict Data Privacy & Reader Cookie Controls"
        ]
      },
      {
        "title": "Editorial Automation",
        "items": [
          "Automated Daily / Weekly Curated Newsletter Digests",
          "Social Media Instant Auto-Publishing on Approval",
          "Image WebP Compression & Focal Point Cropping",
          "Automated Editorial Fact-Checking Checklist Prompts",
          "Expiring Paywall Trial Re-Engagement Sequences",
          "Article Fact Sheet & Source Citation Archiving"
        ]
      },
      {
        "title": "Scale & Media Networks",
        "items": [
          "Multi-Publication Network Single Sign-On (SSO)",
          "Shared Editorial Content Syndication Network",
          "Corporate Group Subscription Licensing Portal",
          "Custom Brand Studio Sponsored Content Modules",
          "Virtual Live Event & Webinar Ticketing Hub",
          "Print Edition PDF Viewer & Digital Archive Vault"
        ]
      }
    ],
    "faqs": [
      {
        "question": "How do you optimize articles to rank in Google Discover and Top Stories?",
        "answer": "We engineer valid NewsArticle schema markup, optimize high-resolution 1200px+ lead images, enforce sub-second Core Web Vitals, and generate real-time Google News XML sitemaps."
      },
      {
        "question": "How does the metered paywall work across devices?",
        "answer": "Our paywall tracks article views using encrypted edge-cookie tokens and user account authentication, allowing publishers to offer X free articles before prompting paid membership subscriptions."
      },
      {
        "question": "Can the platform withstand sudden viral traffic spikes of millions of readers?",
        "answer": "Yes. Articles are statically generated and cached on global CDN edge nodes (Cloudflare/Fastly). Traffic spikes hit cached static HTML and images, consuming minimal origin server compute."
      },
      {
        "question": "How do you maximize ad revenue without ruining reading speed or Core Web Vitals?",
        "answer": "We implement lazy-loaded, fixed-dimension ad containers using Prebid.js header bidding. Ad slots reserve space upfront to prevent Cumulative Layout Shift (CLS) and execute asynchronously."
      },
      {
        "question": "Can readers listen to audio versions of published articles?",
        "answer": "Yes. We integrate automated neural text-to-speech pipelines that generate natural-sounding audio streams upon article publication, providing an embedded audio player for readers on the go."
      }
    ],
    "ctaHeadline": "Ready to build custom digital publishing software for your media network?",
    "ctaSubtext": "Speak with our senior media technology engineers to plan your publishing platform, metered paywall, and high-yield monetization architecture."
  }
];

export function getIndustryBySlug(slug: string): IndustryDetail | undefined {
  return INDUSTRIES_DATA.find((industry) => industry.slug === slug);
}

export function getAllIndustrySlugs(): string[] {
  return INDUSTRIES_DATA.map((industry) => industry.slug);
}

