export interface IndustryCapability {
  title: string;
  description: string;
}

export interface IndustryApproachStep {
  title: string;
  description: string;
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
  ctaHeadline: string;
  ctaSubtext: string;
}

export const INDUSTRIES_DATA: IndustryDetail[] = [
  {
    id: 'real-estate',
    slug: 'real-estate',
    name: 'Real Estate',
    iconSrc: '/industries/real-estate.svg',
    subtitle: 'High-performance property portals, broker workflows, and automated lease systems',
    image: '/industries/real-estate.png',
    heroHeadline: 'Modern software architectures engineered for modern real estate portfolios.',
    heroIntro:
      'We engineer custom real estate platforms that streamline property discovery, agent commissions, and lease operations. From MLS integrations to tenant self-service portals, our systems give developers, brokerages, and property managers total visibility.',
    keyHighlights: [
      'Real-time MLS & IDX property synchronization',
      'Automated tenant lease & documentation pipelines',
      'Broker commissions & transaction tracking',
      'High-speed interactive property search & map filters',
    ],
    aboutHeadline: 'Eliminate fragmented spreadsheets and sluggish legacy property management systems.',
    aboutLead:
      'Commercial brokerages and multi-property managers often lose time wrangling fragmented listings, missed lease expiries, and delayed commission payouts across disconnected tools.',
    aboutBody: [
      'At SPANYX, we build end-to-end real estate software tailored to how your firm closes deals and manages units. We build unified dashboards where property managers track maintenance tickets, digital lease signings, payment histories, and vacancy rates in real time.',
      'Our platforms support role-based permissions for brokers, buyers, tenants, and property accountants—ensuring smooth transactions, instant lead routing, and dependable compliance.',
    ],
    capabilitiesIntro: 'Engineered capabilities to automate property discovery and portfolio management.',
    capabilities: [
      {
        title: 'Centralized Property & Unit Inventory',
        description:
          'Track residential and commercial listings, unit availability, floor plans, and pricing updates in real-time across multiple web channels.',
      },
      {
        title: 'Broker CRM & Lead Routing',
        description:
          'Automatically capture leads from portals, assign inquiries to brokers based on territory or price band, and track pipeline velocity.',
      },
      {
        title: 'Digital Leases & Document Vault',
        description:
          'Generate compliant lease agreements, collect e-signatures, and store tenant KYC documentation securely in encrypted cloud storage.',
      },
      {
        title: 'Tenant & Owner Self-Service Portals',
        description:
          'Give tenants an intuitive portal to pay rent, submit maintenance tickets, and track lease renewals, while owners view monthly payout statements.',
      },
      {
        title: 'Financial & Commission Tracking',
        description:
          'Automate agent commission splits, track security deposits, manage escrow workflows, and export clean financial summaries for accounting.',
      },
      {
        title: 'Map-Driven Search & Virtual Tours',
        description:
          'Deliver blazing-fast spatial search, polygonal map filtering, neighborhood analytics, and immersive virtual tour embeds for prospective buyers.',
      },
    ],
    approachIntro: 'How our engineering team delivers scalable real estate platforms.',
    approach: [
      {
        title: '01 Discovery & Needs Assessment',
        description:
          'We evaluate your listing workflows, broker commission structures, tenant management processes, and data integrations to design an exact blueprint.',
      },
      {
        title: '02 Architecture & Technical Design',
        description:
          'We architect relational schema models, role-based access controls, MLS feed adapters, and high-performance spatial search APIs.',
      },
      {
        title: '03 Full-Stack Implementation',
        description:
          'Our senior developers engineer the client interfaces, backend microservices, real-time alerts, and automated PDF lease generation.',
      },
      {
        title: '04 Deployment, Security & Maintenance',
        description:
          'We configure secure cloud hosting with encrypted backups, run load tests, and provide continuous SLA monitoring as your portfolio expands.',
      },
    ],
    ctaHeadline: 'Ready to build custom software for your real estate operations?',
    ctaSubtext:
      'Speak with our engineering team about your properties, workflows, and platform goals for a tailored architectural proposal.',
  },
  {
    id: 'jobs-recruiters',
    slug: 'jobs-recruiters',
    name: 'Jobs & Recruiters',
    iconSrc: '/industries/jobs-recruiters.svg',
    subtitle: 'Scalable applicant tracking systems, candidate matching, and automated hiring pipelines',
    image: '/industries/jobs-recruiters.png',
    heroHeadline: 'High-speed recruiting software engineered for modern talent acquisition.',
    heroIntro:
      'We build bespoke applicant tracking systems, job boards, and automated interview scheduling tools that help staffing agencies and corporate HR teams discover, vet, and place top talent in record time.',
    keyHighlights: [
      'Automated resume parsing & skills extraction',
      'Multi-stage interview pipelines & candidate scorecards',
      'Client approval portals for staffing agencies',
      'Custom job board engines with zero latency search',
    ],
    aboutHeadline: 'Transform hiring friction into an efficient, automated competitive advantage.',
    aboutLead:
      'Recruiters lose countless hours wrestling with clunky ATS systems, messy email inboxes, and untracked candidate submissions that cause top talent to drop off.',
    aboutBody: [
      'SPANYX engineers custom recruitment software that automates the mechanical parts of hiring. From the moment a candidate submits a CV, our system extracts structured skills, checks qualifications, and queues candidates into clear Kanban-style pipelines.',
      'Staffing firms gain branded client review links where hiring managers can approve profiles, review video assessments, and submit interview feedback with one click, eliminating back-and-forth email chains.',
    ],
    capabilitiesIntro: 'Core software capabilities engineered for staffing agencies and HR leaders.',
    capabilities: [
      {
        title: 'Smart Resume Parsing & Indexing',
        description:
          'Extract structured contact details, employment history, certifications, and skills from PDFs and Word docs into instantly searchable candidate profiles.',
      },
      {
        title: 'Kanban Applicant Pipeline',
        description:
          'Drag-and-drop candidates through stages—from screening and tech assessment to background checks and final offer rollout.',
      },
      {
        title: 'Staffing Client Review Portals',
        description:
          'Share sanitized candidate submissions with corporate clients via secure, branded links for instant approval, interview scheduling, and feedback.',
      },
      {
        title: 'Automated Interview Scheduling',
        description:
          'Sync with Google Calendar and Outlook to offer candidate self-scheduling links, automated reminders, and interviewer scorecards.',
      },
      {
        title: 'Custom Job Board & SEO Architecture',
        description:
          'Publish lightning-fast job landing pages optimized for Google for Jobs schema, mobile applicants, and multi-channel social distribution.',
      },
      {
        title: 'Placement & Commission Analytics',
        description:
          'Monitor recruiter billing, time-to-hire metrics, channel conversion rates, and consultant commission calculations with clear reports.',
      },
    ],
    approachIntro: 'Our structured engineering framework for recruitment platforms.',
    approach: [
      {
        title: '01 Discovery & Needs Assessment',
        description:
          'We analyze your sourcing channels, candidate stages, client submission protocols, and internal compliance obligations.',
      },
      {
        title: '02 Architecture & Technical Design',
        description:
          'We specify resume indexing engines, granular permissions for recruiters vs clients, and secure encryption for candidate PII.',
      },
      {
        title: '03 Full-Stack Implementation',
        description:
          'We build fast recruitment dashboards, responsive candidate applications, automated notification queues, and calendar webhooks.',
      },
      {
        title: '04 Deployment, Security & Maintenance',
        description:
          'We deploy the system to isolated cloud infrastructure with automated backups, ensuring strict compliance with data privacy standards.',
      },
    ],
    ctaHeadline: 'Ready to modernize your recruitment and staffing workflow?',
    ctaSubtext:
      'Connect with our engineering specialists to discuss your applicant volume, client portal needs, and platform requirements.',
  },
  {
    id: 'matrimonial',
    slug: 'matrimonial',
    name: 'Matrimonial',
    iconSrc: '/industries/matrimonial.svg',
    subtitle: 'Secure matchmaking platforms, verified profiles, and private communication suites',
    image: '/industries/matrimonial.png',
    heroHeadline: 'High-trust matchmaking software with verified profiles and privacy controls.',
    heroIntro:
      'We engineer bespoke matrimonial platforms designed with high security, verified community criteria, and private messaging systems that help matchmaking communities connect securely and respectfully.',
    keyHighlights: [
      'Multi-tier identity verification & privacy shields',
      'Advanced community, astrology & preference filters',
      'Encrypted chat, photo locking & contact requests',
      'Subscription billing & premium membership tiers',
    ],
    aboutHeadline: 'Built for authentic connections, community trust, and absolute privacy.',
    aboutLead:
      'Matrimonial platforms demand absolute trust. Users need certainty that profiles are genuine, private photos are protected, and sensitive family data is safe.',
    aboutBody: [
      'SPANYX develops specialized matchmaking solutions equipped with privacy safeguards: photo blur controls, phone number masks, and manual or automated ID verification checks.',
      'Our algorithmic matching engines evaluate mutual criteria, cultural nuances, and family preferences to present relevant recommendations, reducing search fatigue and boosting member engagement.',
    ],
    capabilitiesIntro: 'Key engineering features for scalable matchmaking networks.',
    capabilities: [
      {
        title: 'Verified Profile Architecture',
        description:
          'Multi-step profile onboarding with government ID validation, education verification, and automated photo moderation.',
      },
      {
        title: 'Granular Privacy & Photo Controls',
        description:
          'Allow users to lock photos, grant view permissions on request, and mask personal contact info until both parties accept connection.',
      },
      {
        title: 'Custom Compatibility Search',
        description:
          'Filter by community criteria, location, profession, lifestyle, and optional astrological parameters with instantaneous indexing.',
      },
      {
        title: 'Encrypted Messaging & Requests',
        description:
          'Real-time private messaging, interest expresses, and connection approval workflows backed by secure WebSocket protocols.',
      },
      {
        title: 'Membership & Subscription Tiers',
        description:
          'Integrated recurring payments, credit packs for contact views, and automated plan expiration reminders.',
      },
      {
        title: 'Admin Moderation & Fraud Prevention',
        description:
          'Comprehensive administrative panel to flag suspicious activity, ban bad actors, and maintain community safety standards.',
      },
    ],
    approachIntro: 'Our structured engineering framework for matchmaking systems.',
    approach: [
      {
        title: '01 Discovery & Needs Assessment',
        description:
          'We map your community requirements, matchmaking workflows, privacy models, and monetization plans.',
      },
      {
        title: '02 Architecture & Technical Design',
        description:
          'We design secure databases with encrypted personal fields, fast search indexing, and real-time chat infrastructure.',
      },
      {
        title: '03 Full-Stack Implementation',
        description:
          'Our team builds responsive web apps, moderation dashboards, payment gateways, and automated email/SMS alert systems.',
      },
      {
        title: '04 Deployment, Security & Maintenance',
        description:
          'We implement enterprise SSL, data encryption at rest, anti-scraping protections, and continuous uptime monitoring.',
      },
    ],
    ctaHeadline: 'Ready to build a trusted matrimonial platform?',
    ctaSubtext: 'Discuss your community requirements and feature wishlist with our product engineering team.',
  },
  {
    id: 'medical-doctors',
    slug: 'medical-doctors',
    name: 'Medical & Doctors',
    iconSrc: '/industries/medical-doctors.svg',
    subtitle: 'Clinical appointment systems, electronic health records, and telemedicine infrastructure',
    image: '/industries/medical-doctors.png',
    heroHeadline: 'Secure clinical software engineered for doctors, clinics, and hospital networks.',
    heroIntro:
      'We engineer dependable medical platforms that connect doctors with patients through streamlined appointment scheduling, digital prescriptions, compliant health records, and secure remote consultations.',
    keyHighlights: [
      'Doctor appointment booking & OPD token queues',
      'Electronic Health Records (EHR) & digital prescriptions',
      'Telemedicine video consultations & chat',
      'Compliant health data privacy & role security',
    ],
    aboutHeadline: 'Digital infrastructure designed to let doctors focus on patient care.',
    aboutLead:
      'Clinics and multi-specialty practices struggle with manual paper files, missed appointments, and chaotic patient queues that drain staff energy and degrade patient satisfaction.',
    aboutBody: [
      'SPANYX builds clinical software that organizes every step of the patient journey: from quick online slot booking and automated WhatsApp/SMS reminders to live queue displays in waiting rooms.',
      'Doctors receive a clean, focused consultation screen to review medical history, write structured digital prescriptions in seconds, and attach diagnostic lab results securely.',
    ],
    capabilitiesIntro: 'Medical-grade digital capabilities for practices and healthcare networks.',
    capabilities: [
      {
        title: 'OPD Slot & Token Management',
        description:
          'Enable patients to book slots online while clinical staff manage live queue numbers to minimize waiting room congestion.',
      },
      {
        title: 'Digital Prescriptions & Notes',
        description:
          'Fast prescription builders with pre-saved medicine templates, dosage instructions, and one-click PDF printing or digital sharing.',
      },
      {
        title: 'Patient Electronic Records',
        description:
          'Chronological timeline of past visits, vitals, lab reports, allergies, and diagnostic scans stored in secure cloud records.',
      },
      {
        title: 'Telemedicine Video Platform',
        description:
          'High-definition browser-based video consultations with integrated chat, file sharing, and digital billing.',
      },
      {
        title: 'Clinic Billing & Invoicing',
        description:
          'Itemized billing for consultations, procedures, and tests with receipt generation and automated daily collection reports.',
      },
      {
        title: 'Multi-Doctor & Branch Management',
        description:
          'Manage doctors schedules, shift timings, room allocations, and revenue sharing across multiple clinic branches.',
      },
    ],
    approachIntro: 'How we engineer secure medical platforms.',
    approach: [
      {
        title: '01 Discovery & Needs Assessment',
        description:
          'We evaluate your clinical workflow, patient volume, doctor schedules, and recordkeeping requirements.',
      },
      {
        title: '02 Architecture & Technical Design',
        description:
          'We design HIPAA/DISHA-aligned data models, encrypted cloud storage for medical files, and reliable queue services.',
      },
      {
        title: '03 Full-Stack Implementation',
        description:
          'We develop intuitive interfaces for doctors, front-desk staff, and patients with integrated notification alerts.',
      },
      {
        title: '04 Deployment, Security & Maintenance',
        description:
          'We deploy on isolated secure servers with automated daily backups and 99.9% uptime guarantees.',
      },
    ],
    ctaHeadline: 'Ready to build tailored software for your medical practice?',
    ctaSubtext: 'Talk with our engineering team to architect a seamless digital workflow for your doctors and patients.',
  },
  {
    id: 'food-beverage',
    slug: 'food-beverage',
    name: 'Food & Beverage',
    iconSrc: '/industries/food-beverage.svg',
    subtitle: 'Kitchen display systems, online ordering, table reservations, and franchise inventory',
    image: '/industries/food-beverage.png',
    heroHeadline: 'Unified restaurant software from online ordering to kitchen operations.',
    heroIntro:
      'We engineer custom digital solutions for F&B brands, cloud kitchens, and multi-outlet restaurants: direct-to-consumer online ordering, Kitchen Display Systems (KDS), table QR menus, and central inventory control.',
    keyHighlights: [
      'Commission-free direct online ordering websites',
      'Real-time Kitchen Display Systems (KDS)',
      'Digital QR code table ordering & payments',
      'Central kitchen & multi-outlet recipe inventory',
    ],
    aboutHeadline: 'Protect your margins with direct customer ordering and automated kitchens.',
    aboutLead:
      'Heavy commissions from third-party aggregators and chaotic kitchen ticketing cut into food margins and cause costly order mistakes during peak dining hours.',
    aboutBody: [
      'SPANYX builds custom food and beverage software that helps restaurant brands build direct relationships with their customers. We create high-speed ordering websites with instant payment integration and automated order printing.',
      'In the kitchen, our KDS screens route items to specific prep stations (grill, bar, fry, pastry) with color-coded timers so kitchen staff cook accurately and serve orders on time.',
    ],
    capabilitiesIntro: 'Digital capabilities engineered for high-volume food operations.',
    capabilities: [
      {
        title: 'Direct Online Ordering Web Apps',
        description:
          'Fast mobile-first food ordering with modifier options, delivery zone mapping, and zero third-party commission fees.',
      },
      {
        title: 'Kitchen Display Systems (KDS)',
        description:
          'Live kitchen screens with order staging, prep timers, item bundling, and acoustic alerts to eliminate paper ticket confusion.',
      },
      {
        title: 'QR Code Dine-In Menus',
        description:
          'Contactless digital menus allowing guests to browse dishes, place orders directly to the kitchen, and pay from their table.',
      },
      {
        title: 'Recipe & Ingredient Inventory',
        description:
          'Auto-deduct raw materials when orders are fulfilled, track batch expiry, and receive auto-reorder alerts when stock runs low.',
      },
      {
        title: 'Customer Loyalty & Direct Marketing',
        description:
          'Capture customer phone numbers, reward repeat orders with points, and send targeted WhatsApp/SMS promo campaigns.',
      },
      {
        title: 'Multi-Outlet Sales Analytics',
        description:
          'Track live revenue, top-selling menu items, peak order hours, and staff performance across all franchise locations.',
      },
    ],
    approachIntro: 'Our end-to-end engineering process for F&B tech.',
    approach: [
      {
        title: '01 Discovery & Needs Assessment',
        description:
          'We assess your kitchen flow, dine-in vs delivery split, POS integrations, and multi-branch inventory structure.',
      },
      {
        title: '02 Architecture & Technical Design',
        description:
          'We specify high-concurrency order handling, low-latency WebSocket order dispatch, and thermal printer integrations.',
      },
      {
        title: '03 Full-Stack Implementation',
        description:
          'We build fast consumer menus, responsive KDS tablets, and intuitive manager dashboards with instant reporting.',
      },
      {
        title: '04 Deployment, Security & Maintenance',
        description:
          'We conduct stress tests for peak dinner rush loads and provide continuous monitoring and system updates.',
      },
    ],
    ctaHeadline: 'Ready to elevate your restaurant operations and direct sales?',
    ctaSubtext: 'Discuss your brand, outlets, and custom software requirements with our software engineers.',
  },
  {
    id: 'school-education',
    slug: 'school-education',
    name: 'School & Education',
    iconSrc: '/industries/school-education.svg',
    subtitle: 'Campus management systems, digital admissions, gradebooks, and parent communication apps',
    image: '/industries/school-education.png',
    heroHeadline: 'Centralized school software engineered for academic excellence and administrative ease.',
    heroIntro:
      'We build comprehensive institutional software for schools, colleges, and learning academies: automated student admissions, fee payment portals, digital attendance, gradebook generators, and unified parent communication.',
    keyHighlights: [
      'Digital student admissions & document processing',
      'Automated online fee collection & receipting',
      'Biometric / QR attendance & daily SMS alerts',
      'Custom report cards & academic grade analytics',
    ],
    aboutHeadline: 'Connect administrators, teachers, parents, and students in one unified portal.',
    aboutLead:
      'Educational institutions waste hundreds of administrative hours reconciling paper fee books, calculating exam percentages on spreadsheets, and fielding phone calls about student updates.',
    aboutBody: [
      'SPANYX engineers custom education ERPs built around your academic curriculum and governance rules. Admins can track batch occupancy, fee collection percentages, and staff payroll from one clear dashboard.',
      'Teachers gain simple tools to enter daily attendance and assignment marks in seconds, while parents access real-time fee payment receipts, exam schedules, and academic progress reports.',
    ],
    capabilitiesIntro: 'Core educational software capabilities for institutions of all sizes.',
    capabilities: [
      {
        title: 'Online Admissions & Enrollment',
        description:
          'Paperless admission workflows: application submission, document upload, merit list generation, and fee allocation.',
      },
      {
        title: 'Automated Fee Collection & Receipts',
        description:
          'Multi-term fee schedules, online gateway payments, partial installment tracking, fine calculations, and automatic receipt generation.',
      },
      {
        title: 'Student & Staff Attendance',
        description:
          'Record attendance via web, mobile, or biometric sync with automatic absence SMS/email alerts dispatched to parents.',
      },
      {
        title: 'Exam & Gradebook Management',
        description:
          'Define custom grading scales, enter subject scores, calculate percentile ranks, and print customized CBSE/ICSE report cards.',
      },
      {
        title: 'Timetable & Classroom Scheduling',
        description:
          'Organize teacher subject allocations, classroom periods, and lab slots with clash-detection algorithms.',
      },
      {
        title: 'Parent Communication Hub',
        description:
          'Publish circulars, holiday notices, homework tasks, and bus transport updates through a secure parent portal.',
      },
    ],
    approachIntro: 'Our structured engineering framework for institutional education software.',
    approach: [
      {
        title: '01 Discovery & Needs Assessment',
        description:
          'We evaluate your academic calendar, fee structures, grading schemes, and multi-branch requirements.',
      },
      {
        title: '02 Architecture & Technical Design',
        description:
          'We model student academic records, parent-student relationships, role hierarchies, and secure financial ledgers.',
      },
      {
        title: '03 Full-Stack Implementation',
        description:
          'We develop responsive portals for admins, educators, and parents with automated notification services.',
      },
      {
        title: '04 Deployment, Security & Maintenance',
        description:
          'We configure secure cloud infrastructure, import legacy student records, and provide onboarding support.',
      },
    ],
    ctaHeadline: 'Ready to build custom software for your educational institution?',
    ctaSubtext: 'Speak with our technical architects about your campus workflows and digital transformation goals.',
  },
  {
    id: 'tours-travel',
    slug: 'tours-travel',
    name: 'Tours & Travel',
    iconSrc: '/industries/tours-travel.svg',
    subtitle: 'Dynamic itinerary builders, package booking engines, and travel agency back-office systems',
    image: '/industries/tours-travel.png',
    heroHeadline: 'Custom booking engines and itinerary software for modern travel brands.',
    heroIntro:
      'We build bespoke travel technology: interactive day-wise tour itinerary builders, custom booking and deposit systems, multi-currency pricing, and central back-office tools for tour operators and agencies.',
    keyHighlights: [
      'Interactive day-wise itinerary builders with PDF export',
      'Custom tour package booking & deposit collection',
      'Live flight, hotel & transfer vendor vouchers',
      'Automated traveler communication & payment reminders',
    ],
    aboutHeadline: 'Deliver unforgettable travel proposals and automated booking operations.',
    aboutLead:
      'Travel agencies lose high-value bookings when prospective travelers wait days for manual Word document itineraries and slow pricing quotes.',
    aboutBody: [
      'SPANYX builds dynamic travel platforms that allow your travel consultants to assemble stunning, interactive itineraries in minutes—complete with high-res photos, hotel inclusions, daily route maps, and transparent pricing.',
      'Travelers can approve quotes, pay deposits via integrated gateways, and download comprehensive travel vouchers instantly from their mobile-friendly dashboard.',
    ],
    capabilitiesIntro: 'Travel tech features built to scale bookings and back-office efficiency.',
    capabilities: [
      {
        title: 'Dynamic Tour & Itinerary Builder',
        description:
          'Drag-and-drop days, hotels, sightseeing stops, and transport details into beautiful shareable web links and branded PDFs.',
      },
      {
        title: 'Deposit & Payment Milestone Plans',
        description:
          'Accept upfront deposits, schedule automatic balance due reminders, and track multi-currency exchange rates seamlessly.',
      },
      {
        title: 'Package Availability & Departure Dates',
        description:
          'Manage fixed group departures, seat limits, seasonal rates, and private custom tour requests with live inventory counters.',
      },
      {
        title: 'Vendor Booking & Voucher System',
        description:
          'Issue automated hotel confirmation vouchers, transport receipts, and activity tickets to suppliers and travelers.',
      },
      {
        title: 'Lead Management for Travel Agents',
        description:
          'Track inquiries from website forms and social campaigns, assign leads to agents, and monitor quote-to-booking conversion.',
      },
      {
        title: 'Traveler Document Vault',
        description:
          'Collect passport scans, visa documentation, and flight tickets securely in encrypted traveler profiles.',
      },
    ],
    approachIntro: 'Our engineering roadmap for travel platforms.',
    approach: [
      {
        title: '01 Discovery & Needs Assessment',
        description:
          'We analyze your travel packages, supplier workflows, booking milestones, and payment processing preferences.',
      },
      {
        title: '02 Architecture & Technical Design',
        description:
          'We architect itinerary data models, automated PDF generation engines, and multi-currency billing logic.',
      },
      {
        title: '03 Full-Stack Implementation',
        description:
          'We build fast consumer booking interfaces, agent quotation workspaces, and administrative analytics.',
      },
      {
        title: '04 Deployment, Security & Maintenance',
        description:
          'We deploy on scalable cloud infrastructure with automated backups and 24/7 technical monitoring.',
      },
    ],
    ctaHeadline: 'Ready to modernize your travel agency or tour booking platform?',
    ctaSubtext: 'Discuss your itineraries, booking workflows, and platform vision with our senior engineers.',
  },
  {
    id: 'b2c',
    slug: 'b2c',
    name: 'B2C',
    iconSrc: '/industries/b2c.svg',
    subtitle: 'High-conversion consumer web platforms, account portals, and customer self-service suites',
    image: '/industries/b2c.png',
    heroHeadline: 'Consumer digital products built for engagement, speed, and massive scale.',
    heroIntro:
      'We build customer-facing web applications that convert visitors into loyal users. From seamless onboarding and customer portals to integrated billing and real-time support, we engineer platforms designed for high traffic.',
    keyHighlights: [
      'Sub-second page load times on mobile networks',
      'Frictionless social and passwordless onboarding',
      'Self-service user accounts & subscription portals',
      'Personalized consumer dashboards and recommendations',
    ],
    aboutHeadline: 'Delivering the consumer speed and polish that modern buyers expect.',
    aboutLead:
      'Consumer attention is fleeting. If your web app is sluggish, confusing, or clunky on mobile, potential customers abandon in seconds.',
    aboutBody: [
      'SPANYX engineers B2C web applications with an obsession for speed, responsiveness, and intuitive design. We build clean user journeys that guide users from first discovery to checkout with zero cognitive friction.',
      'Our platforms integrate authentication, automated customer communications, secure payment processing, and event analytics, giving your marketing team clear insights into user retention.',
    ],
    capabilitiesIntro: 'Technical capabilities engineered for high-growth consumer brands.',
    capabilities: [
      {
        title: 'High-Speed Mobile-First Frontend',
        description:
          'Responsive Next.js web applications engineered for sub-second rendering, smooth animations, and top Core Web Vitals.',
      },
      {
        title: 'User Profile & Account Dashboards',
        description:
          'Clean customer portals where users manage saved preferences, order history, billing methods, and support tickets.',
      },
      {
        title: 'Recurring Billing & Checkout Flows',
        description:
          'Seamless one-click checkouts, subscription plans, digital wallets, and automated invoice delivery.',
      },
      {
        title: 'Personalized Recommendation Engines',
        description:
          'Deliver dynamic content, suggested products, and personalized offers based on user browsing behavior and history.',
      },
      {
        title: 'Customer Notification Queues',
        description:
          'Automated transactional emails, SMS alerts, and push notifications for order status, account security, and promotions.',
      },
      {
        title: 'Event Tracking & Conversion Analytics',
        description:
          'Instrument user funnels, track drop-off points, and gain deep behavioral insights to drive conversion rate optimization.',
      },
    ],
    approachIntro: 'Our structured engineering framework for B2C consumer products.',
    approach: [
      {
        title: '01 Discovery & Needs Assessment',
        description:
          'We evaluate your target demographic, key conversion funnels, brand aesthetic, and third-party integrations.',
      },
      {
        title: '02 Architecture & Technical Design',
        description:
          'We design scalable APIs, microservices, CDN caching strategies, and secure session management.',
      },
      {
        title: '03 Full-Stack Implementation',
        description:
          'We build pixel-perfect frontend interfaces, robust backends, payment integrations, and automated tests.',
      },
      {
        title: '04 Deployment, Security & Maintenance',
        description:
          'We deploy to auto-scaling cloud environments with CDN optimization, DDoS mitigation, and 24/7 uptime monitoring.',
      },
    ],
    ctaHeadline: 'Ready to launch a high-converting B2C digital platform?',
    ctaSubtext: 'Tell our engineering team about your consumer product vision and growth targets.',
  },
  {
    id: 'b2b',
    slug: 'b2b',
    name: 'B2B',
    iconSrc: '/industries/b2b.svg',
    subtitle: 'Enterprise partner portals, wholesale ordering, multi-tier approvals, and contract pricing',
    image: '/industries/b2b.png',
    heroHeadline: 'Enterprise B2B digital portals engineered for complex commercial relationships.',
    heroIntro:
      'We engineer specialized B2B portals, vendor management systems, wholesale ordering platforms, and contract workflows that simplify how companies buy from, sell to, and collaborate with their corporate partners.',
    keyHighlights: [
      'Multi-tier corporate account roles & approval hierarchies',
      'Custom contract pricing & volume discount matrices',
      'Bulk ordering, CSV uploads & requisition workflows',
      'Net-terms credit limits, invoice billing & ERP sync',
    ],
    aboutHeadline: 'Modernize enterprise trade with frictionless digital ordering and vendor portals.',
    aboutLead:
      'B2B transactions often get delayed in manual phone calls, PDF purchase orders, and error-prone pricing lookups between buyers and sales reps.',
    aboutBody: [
      'SPANYX builds B2B commerce and operational software that brings modern consumer simplicity to complex corporate commerce. Buyers log into customized corporate accounts that reflect their negotiated contract rates, tax exemptions, and credit limits.',
      'Purchase requests can trigger multi-tier internal approval workflows before orders are submitted directly to your warehouse ERP, eliminating re-keying errors and accelerating fulfillment.',
    ],
    capabilitiesIntro: 'Enterprise capabilities engineered for complex B2B commerce.',
    capabilities: [
      {
        title: 'Customer-Specific Pricing & Catalogs',
        description:
          'Display customized pricing tiers, negotiated contracts, and exclusive product catalogs per buyer organization.',
      },
      {
        title: 'Multi-User Organization Accounts',
        description:
          'Allow buyer firms to manage their own team members, branch budgets, and multi-tier approval hierarchies.',
      },
      {
        title: 'Bulk Order & Quick Reorder Tools',
        description:
          'Enable procurement teams to paste SKU lists, upload CSV purchase sheets, or duplicate previous recurring orders in seconds.',
      },
      {
        title: 'Credit Terms & Invoice Financing',
        description:
          'Manage Net 30/60/90 day credit limits, outstanding balances, automated billing statements, and payment reconciliation.',
      },
      {
        title: 'ERP & Warehouse Integration',
        description:
          'Synchronize real-time stock availability, order statuses, and shipment tracking with SAP, Oracle, or custom ERPs.',
      },
      {
        title: 'Vendor & Distributor Dashboards',
        description:
          'Provide distribution partners with dedicated sales tracking, stock replenishment, and warranty registration tools.',
      },
    ],
    approachIntro: 'Our structured engineering framework for B2B platforms.',
    approach: [
      {
        title: '01 Discovery & Needs Assessment',
        description:
          'We map your contract pricing logic, dealer networks, procurement workflows, and ERP integration requirements.',
      },
      {
        title: '02 Architecture & Technical Design',
        description:
          'We specify high-performance database schemas for complex pricing rules, role permissions, and transactional security.',
      },
      {
        title: '03 Full-Stack Implementation',
        description:
          'We build fast distributor portals, approval pipelines, accounting integrations, and automated PDF invoicing.',
      },
      {
        title: '04 Deployment, Security & Maintenance',
        description:
          'We deploy on enterprise cloud architecture with dedicated VPN/API security, automated backups, and 99.9% SLAs.',
      },
    ],
    ctaHeadline: 'Ready to build a modern B2B portal for your corporate clients?',
    ctaSubtext: 'Discuss your dealer workflows, contract structures, and integration goals with our engineering architects.',
  },
  {
    id: 'e-commerce',
    slug: 'e-commerce',
    name: 'E-commerce',
    iconSrc: '/industries/e-commerce.svg',
    subtitle: 'Custom headless storefronts, multi-warehouse inventory, and lightning-fast checkout engines',
    image: '/industries/e-commerce.png',
    heroHeadline: 'Bespoke e-commerce architectures engineered for high-volume sales.',
    heroIntro:
      'We engineer custom e-commerce web applications, headless storefronts, and multi-warehouse inventory management systems designed to deliver sub-second page loads, high checkout conversions, and zero downtime during peak flash sales.',
    keyHighlights: [
      'Headless Next.js storefronts with instant page transitions',
      'Multi-warehouse stock sync & automated fulfillment',
      'Optimized one-page checkout with native UPI & card gateways',
      'Custom promo code, discount bundle & loyalty engines',
    ],
    aboutHeadline: 'Break free from slow, rigid e-commerce templates and plugins.',
    aboutLead:
      'Generic e-commerce templates often become slow, bloated with dozens of conflicting plugins, and crash under heavy traffic during marketing campaigns.',
    aboutBody: [
      'SPANYX develops bespoke e-commerce platforms tailored to your brand’s exact purchasing experience. We build lightning-fast web storefronts that render products instantly, handle complex variations, and keep checkouts frictionless.',
      'Behind the scenes, your operations team gets automated order fulfillment, split shipments across multiple warehouses, and real-time inventory updates that prevent overselling.',
    ],
    capabilitiesIntro: 'Engineered capabilities for scaling modern digital storefronts.',
    capabilities: [
      {
        title: 'Headless Storefront Architecture',
        description:
          'Blazing fast Next.js frontends connected to robust APIs for instant product filtering, search, and seamless page transitions.',
      },
      {
        title: 'Frictionless One-Page Checkout',
        description:
          'Optimized checkout flows with auto-address fill, native UPI/card gateways, EMI options, and instant order confirmations.',
      },
      {
        title: 'Multi-Warehouse Inventory Sync',
        description:
          'Track stock levels across multiple fulfillment centers, route orders to the closest warehouse, and update counts in real time.',
      },
      {
        title: 'Custom Promotions & Bundle Engine',
        description:
          'Create tiered discounts, buy-one-get-one rules, time-limited flash sales, and customer loyalty reward points.',
      },
      {
        title: 'Order Tracking & Return Management',
        description:
          'Self-service customer order tracking, automated WhatsApp shipping updates, and streamlined return/refund workflows.',
      },
      {
        title: 'Comprehensive Sales & Inventory Analytics',
        description:
          'Detailed reporting on customer acquisition cost, average order value, cart abandonment rate, and top-performing SKUs.',
      },
    ],
    approachIntro: 'Our structured engineering framework for high-performance e-commerce.',
    approach: [
      {
        title: '01 Discovery & Needs Assessment',
        description:
          'We evaluate your product catalog scale, SKU variations, shipping logistics, payment partners, and traffic projections.',
      },
      {
        title: '02 Architecture & Technical Design',
        description:
          'We design headless commerce APIs, real-time inventory locking mechanisms, and secure PCI-compliant checkout flows.',
      },
      {
        title: '03 Full-Stack Implementation',
        description:
          'We engineer high-converting storefronts, warehouse management dashboards, logistics webhooks, and analytics pipelines.',
      },
      {
        title: '04 Deployment, Security & Maintenance',
        description:
          'We run load tests for traffic spikes, configure CDN edge caching, and provide ongoing 24/7 technical infrastructure support.',
      },
    ],
    ctaHeadline: 'Ready to build a custom, high-speed e-commerce platform?',
    ctaSubtext: 'Talk with our engineering team about your catalog, checkout requirements, and scaling roadmap.',
  },
  {
    id: 'banking-finance',
    slug: 'banking-finance',
    name: 'Banking & Finance',
    iconSrc: '/industries/banking-finance.svg',
    subtitle: 'Institutional fintech terminals, wealth management portals, and automated compliance engines',
    image: '/industries/banking-finance.png',
    heroHeadline: 'Ultra-secure fintech software engineered for transactions, wealth, and compliance.',
    heroIntro:
      'We engineer financial software platforms: trading desks, investment portfolios, lending management systems, and automated accounting suites engineered with sub-millisecond precision, bank-grade encryption, and regulatory compliance.',
    keyHighlights: [
      'Sub-millisecond WebSocket streaming & interactive charts',
      'Bank-grade AES-256 encryption & multi-factor authentication',
      'Automated P&L calculations & tax-ready ledger exports',
      'Strict audit trails & financial compliance reporting',
    ],
    aboutHeadline: 'Engineering dependability, real-time speed, and financial precision.',
    aboutLead:
      'Financial operations require zero latency tolerance, absolute accuracy in calculations, and impenetrable security protocols that protect institutional capital.',
    aboutBody: [
      'SPANYX develops institutional fintech software that delivers lightning-fast data streaming and rock-solid ledger consistency. Whether building algorithmic trading journals, wealth management dashboards, or lending workflows, our architectures prioritize precision.',
      'Our solutions incorporate comprehensive audit trails, role-based authorization, two-factor authentication, and automated reconciliation routines that satisfy strict regulatory audits.',
    ],
    capabilitiesIntro: 'Fintech engineering capabilities for financial institutions and trading firms.',
    capabilities: [
      {
        title: 'Real-Time Market Data Feeds',
        description:
          'High-throughput WebSocket streaming delivering live prices, order books, and interactive technical charting with zero lag.',
      },
      {
        title: 'Portfolio & P&L Analytics',
        description:
          'Automated mark-to-market calculations, asset allocation charts, risk metrics, and historical performance attribution.',
      },
      {
        title: 'Lending & Credit Origination',
        description:
          'Digital loan application pipelines, credit scoring integrations, EMI amortization calculators, and collection tracking.',
      },
      {
        title: 'Double-Entry Ledger Architecture',
        description:
          'Impenetrable financial accounting ledgers ensuring zero balance discrepancies, automatic debits/credits, and audit logs.',
      },
      {
        title: 'Bank-Grade Security & 2FA',
        description:
          'Multi-factor authentication, biometric logins, session timeouts, IP whitelisting, and end-to-end data encryption.',
      },
      {
        title: 'Regulatory & Tax Export Engines',
        description:
          'One-click generation of regulatory reports, capital gains summaries, GST statements, and audit documentation.',
      },
    ],
    approachIntro: 'Our rigorous engineering roadmap for financial platforms.',
    approach: [
      {
        title: '01 Discovery & Needs Assessment',
        description:
          'We evaluate your regulatory constraints, financial calculation models, data source feeds, and security mandates.',
      },
      {
        title: '02 Architecture & Technical Design',
        description:
          'We specify transactional consistency guarantees, low-latency stream processors, and air-gapped cryptographic vaults.',
      },
      {
        title: '03 Full-Stack Implementation',
        description:
          'We build reactive dashboards, robust ledger microservices, automated reconciliation jobs, and security alerts.',
      },
      {
        title: '04 Deployment, Security & Maintenance',
        description:
          'We deploy to isolated VPC clouds, undergo vulnerability assessments, and maintain strict SLA uptime coverage.',
      },
    ],
    ctaHeadline: 'Ready to build high-performance financial software?',
    ctaSubtext: 'Discuss your fintech architecture, security specifications, and algorithmic needs with our senior team.',
  },
  {
    id: 'health-beauty',
    slug: 'health-beauty',
    name: 'Health & Beauty',
    iconSrc: '/industries/health-beauty.svg',
    subtitle: 'Salon and wellness booking suites, staff allocation, loyalty rewards, and product retailing',
    image: '/industries/health-beauty.png',
    heroHeadline: 'Elevated digital booking and management software for salons, spas, and wellness centers.',
    heroIntro:
      'We engineer bespoke digital systems for premium salons, aesthetic clinics, and wellness chains: streamlined online appointment booking, stylist scheduling, customer treatment histories, and recurring membership programs.',
    keyHighlights: [
      'Frictionless client booking with stylist & service selection',
      'Staff chair scheduling & commission tracking',
      'Customer treatment notes, formulas & photo records',
      'Prepaid wellness packages & membership billing',
    ],
    aboutHeadline: 'Deliver a luxurious client experience before customers even walk through the door.',
    aboutLead:
      'Busy salons and aesthetic clinics struggle with double-booked appointment slots, forgotten customer treatment formulas, and chaotic front-desk phone calls.',
    aboutBody: [
      'SPANYX builds custom wellness software that keeps client appointments orderly and front desks calm. Clients enjoy an elegant online booking experience where they select treatments, favorite specialists, and convenient times in seconds.',
      'Behind the counter, managers can see daily chair utilization, stylist commission earnings, and inventory depletion, while staff access past formula notes and service records with one tap.',
    ],
    capabilitiesIntro: 'Tailored software features for beauty, aesthetics, and wellness operations.',
    capabilities: [
      {
        title: 'Online Client Appointment Booking',
        description:
          'Mobile-optimized booking widget displaying service durations, stylist pricing tiers, and real-time open slots.',
      },
      {
        title: 'Chair & Therapist Scheduling',
        description:
          'Visual daily calendar with drag-and-drop rescheduling, staff break allocations, and automatic double-booking prevention.',
      },
      {
        title: 'Client Treatment Cards & Notes',
        description:
          'Secure digital client cards storing hair color formulas, skin allergy histories, preferred products, and before/after photos.',
      },
      {
        title: 'Stylist Commission & Performance',
        description:
          'Automate service commission splits, retail sales bonuses, tip calculations, and staff productivity reports.',
      },
      {
        title: 'Membership & Package Billing',
        description:
          'Sell multi-session treatment packages, recurring monthly memberships, and gift vouchers with automated redemption tracking.',
      },
      {
        title: 'Automated SMS/WhatsApp Reminders',
        description:
          'Dramatically cut no-shows with automated appointment confirmations, 24-hour reminders, and review follow-up links.',
      },
    ],
    approachIntro: 'Our structured engineering framework for wellness software.',
    approach: [
      {
        title: '01 Discovery & Needs Assessment',
        description:
          'We evaluate your service catalog, booking rules, staff commission tiers, and multi-location management requirements.',
      },
      {
        title: '02 Architecture & Technical Design',
        description:
          'We design real-time calendar synchronization, secure customer data storage, and automated messaging webhooks.',
      },
      {
        title: '03 Full-Stack Implementation',
        description:
          'We engineer elegant consumer booking web apps, fast front-desk POS screens, and managerial analytics.',
      },
      {
        title: '04 Deployment, Security & Maintenance',
        description:
          'We deploy on reliable cloud servers with encrypted data backups and ongoing feature maintenance support.',
      },
    ],
    ctaHeadline: 'Ready to modernize your salon, spa, or wellness operations?',
    ctaSubtext: 'Discuss your brand experience, booking workflows, and platform goals with our software specialists.',
  },
  {
    id: 'community-web-design',
    slug: 'community-web-design',
    name: 'Community Web Design',
    iconSrc: '/industries/community-web-design.svg',
    subtitle: 'Association hubs, member directories, event registration, and collaborative resource spaces',
    image: '/industries/community-web-design.png',
    heroHeadline: 'Dedicated digital platforms engineered for member networks and professional associations.',
    heroIntro:
      'We build private community portals, alumni networks, and industry associations: member directories, event ticketing, committee voting, discussion boards, and annual membership renewal automation.',
    keyHighlights: [
      'Gated member-only directories & profile networking',
      'Event registration, ticketing & agenda management',
      'Automated annual dues renewal & receipting',
      'Document repositories, committee voting & discussions',
    ],
    aboutHeadline: 'Unite your community with a secure, engaging digital headquarters.',
    aboutLead:
      'Community associations and alumni networks often fail to engage members because information is lost in unorganized WhatsApp groups, outdated spreadsheets, and chaotic email blasts.',
    aboutBody: [
      'SPANYX builds unified community hubs that bring structure, pride, and active engagement to associations. Members can search searchable professional directories, register for conferences, and participate in moderated forums.',
      'Administrators save countless hours with automated membership fee renewals, digital voting ballots, and centralized document archives for bylaws and financial reports.',
    ],
    capabilitiesIntro: 'Engineered capabilities for active communities and member organizations.',
    capabilities: [
      {
        title: 'Member Directory & Profiles',
        description:
          'Searchable member database with filters for industry, location, chapter, and expertise, with privacy controls.',
      },
      {
        title: 'Event Ticketing & Conference Management',
        description:
          'Publish event schedules, speaker bios, and ticket tiers with instant QR-coded ticket delivery and check-in apps.',
      },
      {
        title: 'Annual Dues & Membership Automation',
        description:
          'Automated recurring membership billing, one-click online dues payment, and instant tax-compliant digital receipts.',
      },
      {
        title: 'Document Vault & Knowledge Base',
        description:
          'Organized, permission-gated repositories for board meeting minutes, bylaws, policy papers, and educational resources.',
      },
      {
        title: 'Committee Voting & Polls',
        description:
          'Secure digital elections and member surveys with cryptographic verification and audited vote tallying.',
      },
      {
        title: 'Discussion Forums & Announcements',
        description:
          'Moderated community message boards, chapter announcements, and segmented email/SMS broadcast tools.',
      },
    ],
    approachIntro: 'Our structured engineering framework for community platforms.',
    approach: [
      {
        title: '01 Discovery & Needs Assessment',
        description:
          'We evaluate your membership tiers, event calendar, governance guidelines, and communication protocols.',
      },
      {
        title: '02 Architecture & Technical Design',
        description:
          'We design role-based access models, secure member profile schemas, and event ticketing payment flows.',
      },
      {
        title: '03 Full-Stack Implementation',
        description:
          'We build engaging member dashboards, administrative management panels, and automated renewal triggers.',
      },
      {
        title: '04 Deployment, Security & Maintenance',
        description:
          'We configure secure hosting, import historical member records, and provide continuous technical support.',
      },
    ],
    ctaHeadline: 'Ready to build an official digital home for your community?',
    ctaSubtext: 'Tell our engineering team about your association, membership scale, and digital community needs.',
  },
  {
    id: 'hotels-restaurants',
    slug: 'hotels-restaurants',
    name: 'Hotels & Restaurants',
    iconSrc: '/industries/hotels-restaurants.svg',
    subtitle: 'Direct room reservations, property PMS, guest check-in, and dining management',
    image: '/industries/hotels-restaurants.png',
    heroHeadline: 'Hospitality software engineered for direct guest bookings and seamless hotel stays.',
    heroIntro:
      'We engineer hospitality platforms for boutique hotels, luxury resorts, and hotel-restaurant complexes: direct room booking engines, PMS operations, mobile guest check-in, room service ordering, and dining reservations.',
    keyHighlights: [
      'Commission-free direct room reservation engines',
      'Central Property Management System (PMS) operations',
      'Contactless guest check-in & digital room keys',
      'Integrated dining, spa & room service billing',
    ],
    aboutHeadline: 'Maximize direct bookings and elevate guest satisfaction with modern hospitality tech.',
    aboutLead:
      'Hotels surrender 18-25% of their revenue to online travel agencies (OTAs) because their own direct booking websites are slow, outdated, or confusing on mobile devices.',
    aboutBody: [
      'SPANYX builds custom hospitality platforms that make booking directly with your hotel faster, easier, and more attractive than using third-party sites. Guests enjoy interactive room previews, transparent seasonal rates, and instant booking confirmations.',
      'On property, our platforms connect front-desk check-in, housekeeping room status, and restaurant POS into one cohesive system, eliminating guest billing discrepancies at checkout.',
    ],
    capabilitiesIntro: 'Tailored technology features for hotels, resorts, and hospitality groups.',
    capabilities: [
      {
        title: 'Direct Room Booking Engine',
        description:
          'Fast mobile-friendly booking widget with live room availability, package add-ons, promo codes, and multi-currency billing.',
      },
      {
        title: 'Front-Desk Property PMS',
        description:
          'Visual room occupancy calendar, quick guest check-in/out, folio billing management, and room rate overrides.',
      },
      {
        title: 'Mobile Guest Self-Check-in',
        description:
          'Allow guests to upload ID documents, sign registration cards, and view property amenities before arriving.',
      },
      {
        title: 'Housekeeping & Maintenance Status',
        description:
          'Real-time room cleaning status updates for housekeeping teams on mobile tablets to accelerate room turnaround.',
      },
      {
        title: 'Room Service & Amenity Ordering',
        description:
          'Digital in-room dining menus allowing guests to order meals, request extra towels, or book spa treatments from their phones.',
      },
      {
        title: 'Consolidated Guest Folio Billing',
        description:
          'Automatically combine room charges, restaurant bills, spa services, and laundry into one clean final checkout invoice.',
      },
    ],
    approachIntro: 'Our structured engineering framework for hospitality platforms.',
    approach: [
      {
        title: '01 Discovery & Needs Assessment',
        description:
          'We evaluate your room inventory, seasonal pricing matrices, channel manager connections, and on-premise service flow.',
      },
      {
        title: '02 Architecture & Technical Design',
        description:
          'We design high-concurrency booking engines, OTA channel synchronization, and secure payment processing.',
      },
      {
        title: '03 Full-Stack Implementation',
        description:
          'We develop responsive guest booking sites, administrative PMS dashboards, and department task managers.',
      },
      {
        title: '04 Deployment, Security & Maintenance',
        description:
          'We deploy on enterprise cloud architecture with 99.9% uptime guarantees and 24/7 technical monitoring.',
      },
    ],
    ctaHeadline: 'Ready to drive direct hotel bookings and streamline guest operations?',
    ctaSubtext: 'Discuss your property, guest experience, and technology goals with our hospitality software architects.',
  },
  {
    id: 'jewelry-fashion',
    slug: 'jewelry-fashion',
    name: 'Jewelry & Fashion Accessories',
    iconSrc: '/industries/jewelry-fashion.svg',
    subtitle: 'Luxury bespoke e-commerce, gold rate pricing engines, custom engraving, and certification vaults',
    image: '/industries/jewelry-fashion.png',
    heroHeadline: 'Luxury digital storefronts and gold-rate pricing engines for jewelry houses.',
    heroIntro:
      'We engineer high-end e-commerce platforms and inventory systems for fine jewelers and luxury fashion brands: dynamic bullion rate pricing, custom ring and diamond builders, certificate authenticity vaults, and appointment styling.',
    keyHighlights: [
      'Live bullion/gold rate price auto-calculation',
      '360-degree interactive product viewers & ring builders',
      'GIA/IGI digital certificate verification vault',
      'VIP private showroom appointment booking',
    ],
    aboutHeadline: 'Translate luxury craft, precious metal pricing, and trust into digital elegance.',
    aboutLead:
      'High-value jewelry sales require extraordinary trust, flawless visual fidelity, and real-time pricing that automatically fluctuates with live gold and diamond market rates.',
    aboutBody: [
      'SPANYX crafts bespoke digital storefronts tailored to the exact demands of fine jewelry and fashion houses. We build high-definition product visualizers where clients inspect gemstone cuts, metal finishes, and custom engravings in intimate detail.',
      'Our backends connect to live bullion feeds to calculate product pricing dynamically based on gold weight, making charges, and diamond carat grades, protecting your margins automatically.',
    ],
    capabilitiesIntro: 'Tailored luxury capabilities for jewelry and fine fashion brands.',
    capabilities: [
      {
        title: 'Live Metal Rate Price Engine',
        description:
          'Automatically calculate retail prices based on real-time gold/silver/platinum spot prices plus stone value and making charges.',
      },
      {
        title: 'Custom Ring & Jewelry Configurator',
        description:
          'Interactive ring builder allowing customers to choose metal type, diamond shape, carat, and custom inscription with live pricing.',
      },
      {
        title: 'Authenticity Certificate Vault',
        description:
          'Digital certificate verification enabling customers to look up GIA, IGI, or hallmark numbers to verify authenticity.',
      },
      {
        title: 'High-Fidelity 360° Visualizer',
        description:
          'Display ultra-high-resolution macro photography, video loops, and 360-degree interactive spins for precious jewelry pieces.',
      },
      {
        title: 'Private Showroom Styling Appointments',
        description:
          'Enable VIP clients to book private in-store or virtual consultations with bespoke jewelry stylists.',
      },
      {
        title: 'Serialized Precious Inventory Control',
        description:
          'Track individual serialized jewelry pieces with barcode/RFID integration, weight tolerances, and consignment loans.',
      },
    ],
    approachIntro: 'Our structured engineering framework for luxury jewelry platforms.',
    approach: [
      {
        title: '01 Discovery & Needs Assessment',
        description:
          'We evaluate your precious metal pricing formulas, inventory serialization, brand aesthetic, and client buying journey.',
      },
      {
        title: '02 Architecture & Technical Design',
        description:
          'We design real-time pricing calculation microservices, high-resolution media optimization, and secure checkout gateways.',
      },
      {
        title: '03 Full-Stack Implementation',
        description:
          'We develop high-end luxury storefronts, jewelry configurators, showroom calendars, and administrative inventory tools.',
      },
      {
        title: '04 Deployment, Security & Maintenance',
        description:
          'We configure secure cloud environments with global CDN image delivery, anti-fraud screening, and ongoing SLA support.',
      },
    ],
    ctaHeadline: 'Ready to build an exquisite digital presence for your jewelry brand?',
    ctaSubtext: 'Discuss your product catalog, pricing formulas, and luxury vision with our senior engineering team.',
  },
  {
    id: 'news-blogs-publications',
    slug: 'news-blogs-publications',
    name: 'News, Blogs & Publications',
    iconSrc: '/industries/news-blogs-publications.svg',
    subtitle: 'Lightning-fast editorial CMS, paywalls, newsletter automation, and high-volume media delivery',
    image: '/industries/news-blogs-publications.png',
    heroHeadline: 'Ultra-fast publishing platforms and subscription paywalls for modern media houses.',
    heroIntro:
      'We engineer custom publishing architectures for media houses, editorial magazines, and news publications: headless editorial CMS, metered subscription paywalls, automated newsletter pipelines, and instant article delivery.',
    keyHighlights: [
      'Sub-second article delivery with edge CDN caching',
      'Metered paywalls & digital subscriber memberships',
      'Headless editorial CMS with live collaboration',
      'Automated breaking news alerts & newsletter dispatch',
    ],
    aboutHeadline: 'Engineered for viral traffic spikes, reader engagement, and digital subscriber revenue.',
    aboutLead:
      'Modern news outlets face crashing servers during breaking news events, ad-blocker revenue erosion, and clunky legacy CMS tools that slow down newsrooms.',
    aboutBody: [
      'SPANYX builds custom publishing software that can handle millions of concurrent readers without breaking a sweat. We utilize edge-cached Next.js architectures that serve articles instantly, regardless of device or connection speed.',
      'We implement intelligent monetization models: metered paywalls, premium subscriber tiers, sponsored content modules, and automated newsletter feeds that build direct relationships with your readership.',
    ],
    capabilitiesIntro: 'Engineered digital capabilities for modern newsrooms and publications.',
    capabilities: [
      {
        title: 'Headless Editorial CMS',
        description:
          'Fast, distraction-free markdown and rich-text editor for journalists with draft collaboration, scheduled publishing, and revision history.',
      },
      {
        title: 'Metered Subscription Paywall',
        description:
          'Configure free article counts, subscriber-only premium articles, recurring monthly/annual memberships, and gift subscriptions.',
      },
      {
        title: 'Edge-Cached Article Delivery',
        description:
          'Deliver content from global edge nodes with instant Core Web Vitals, rich AMP support, and high Google Discover indexing.',
      },
      {
        title: 'Automated Newsletter Pipelines',
        description:
          'Automatically assemble and dispatch daily or weekly editorial digests to segmented subscriber lists directly from published articles.',
      },
      {
        title: 'Breaking News & Push Alerts',
        description:
          'Instant web push notifications and breaking news tickers that alert subscribed readers the moment crucial stories break.',
      },
      {
        title: 'Real-Time Newsroom Analytics',
        description:
          'Monitor active concurrent readers, reading completion rates, referral sources, and author productivity in real time.',
      },
    ],
    approachIntro: 'Our structured engineering framework for publishing systems.',
    approach: [
      {
        title: '01 Discovery & Needs Assessment',
        description:
          'We evaluate your newsroom editorial flow, article volume, subscriber monetization strategy, and peak traffic history.',
      },
      {
        title: '02 Architecture & Technical Design',
        description:
          'We architect scalable headless publishing APIs, edge caching rules, paywall verification logic, and newsletter webhooks.',
      },
      {
        title: '03 Full-Stack Implementation',
        description:
          'We build fast reader-facing interfaces, intuitive editorial newsrooms, subscriber billing portals, and analytics boards.',
      },
      {
        title: '04 Deployment, Security & Maintenance',
        description:
          'We deploy on auto-scaling cloud clusters capable of handling viral breaking news surges with zero downtime.',
      },
    ],
    ctaHeadline: 'Ready to build a high-performance digital publication platform?',
    ctaSubtext: 'Talk with our engineering team about your publication, newsroom workflow, and reader monetization plans.',
  },
];

export function getIndustryBySlug(slug: string): IndustryDetail | undefined {
  return INDUSTRIES_DATA.find((ind) => ind.slug === slug || ind.id === slug);
}

