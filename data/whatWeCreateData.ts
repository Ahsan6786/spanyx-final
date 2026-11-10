export interface ServiceCapability {
  title: string;
  description: string;
}

export interface ServiceApproachStep {
  title: string;
  description: string;
}

export interface MobileShowcase {
  image: string;
  video?: string;
  badge?: string;
  heading: string;
  description: string;
  details?: string[];
}

export interface ShowcaseCategoryDetail {
  id: string;
  slug: string;
  shortLabel: string;
  title: string;
  subtitle: string;
  image: string;
  video?: string;
  heroHeadline: string;
  heroIntro: string;
  keyHighlights: string[];
  aboutHeadline: string;
  aboutLead: string;
  aboutBody: string[];
  aboutMetrics: { label: string; value: string }[];
  mobileShowcase?: MobileShowcase;
  capabilitiesIntro: string;
  capabilities: ServiceCapability[];
  approachIntro: string;
  approach: ServiceApproachStep[];
  ctaHeadline: string;
  ctaSubtext: string;
}

export const SHOWCASE_CATEGORIES: ShowcaseCategoryDetail[] = [
  {
    id: 'erp-solutions',
    slug: 'erp-solutions',
    shortLabel: 'ERP',
    title: 'ERP Solutions',
    subtitle: 'Custom management software to run your daily operations in one place',
    image: '/erp.jpeg',
    heroHeadline:
      'One simple system to manage your team, data, and daily work.',
    heroIntro:
      'We build custom ERP software that brings all your daily operations into one place. Instead of juggling spreadsheets and separate tools, your team gets one clean dashboard to manage staff, students or clients, attendance, reports, and approvals.',
    keyHighlights: [
      'Separate login roles for admins & staff',
      'Automatic daily & monthly reports',
      'Live charts and clear numbers',
      'Built around how your team works',
    ],
    aboutHeadline:
      'Stop wasting hours on manual spreadsheets and scattered files.',
    aboutLead:
      'As your organization grows, managing everything on Excel sheets and WhatsApp messages becomes slow and confusing. Ready-made software often has too many useless buttons or misses the exact features you actually need.',
    aboutBody: [
      'At SPANYX, we build ERP software designed specifically for your organization. Whether you run an institute, a hospital, a factory, or a growing company, we create clean screens where your team can track batches, room bookings, attendance, billing, and daily tasks without confusion.',
      'You decide who can see or edit each section. Super Admins can see the full picture at a glance, while staff members only see the simple tools they need to finish their daily work quickly.',
    ],
    aboutMetrics: [
      { label: 'Everything in One Place', value: 'Staff, Data & Reports' },
      { label: 'Access Control', value: 'Admin & Staff Logins' },
      { label: 'Reports', value: 'One-Click Excel & PDF' },
    ],
    mobileShowcase: {
      image: '/erp-mob.png',
      badge: 'Mobile Dashboard Experience',
      heading: 'Manage your operations anywhere, right from your phone.',
      description:
        'Business doesn’t stop when you step away from your desk. Our ERP platforms are fully responsive, giving managers and staff instant access to live attendance, batch updates, and one-tap approval requests wherever they are.',
      details: [
        'Instant one-tap approvals for managers on the move',
        'Real-time attendance and staff logs updated live',
        'Clean mobile interface designed for fast daily decisions',
      ],
    },
    capabilitiesIntro:
      'Practical features built to save your team time every single day.',
    capabilities: [
      {
        title: 'Daily Work & Task Automation',
        description:
          'Turn slow paper forms and manual approvals into simple digital steps so your team finishes daily work in minutes instead of hours.',
      },
      {
        title: 'Clear Admin Dashboards',
        description:
          'See total counts, attendance trends, active batches, and important alerts on one clean screen with easy-to-read charts.',
      },
      {
        title: 'Staff Roles & Permissions',
        description:
          'Give different access levels to owners, managers, and staff so sensitive data stays safe and everyone sees only what they need.',
      },
      {
        title: 'Room, Stock & Resource Tracking',
        description:
          'Know exactly which rooms are occupied, what stock is available, and how resources are being used across your center or office.',
      },
      {
        title: 'Automatic Emails & Alerts',
        description:
          'Send instant email updates, reminders, and warning flags automatically when forms are submitted or deadlines are missed.',
      },
      {
        title: 'Easy Data Import & Downloads',
        description:
          'Bring in your old Excel records easily and download clean reports anytime with a single click.',
      },
    ],
    approachIntro:
      'How we build and set up your ERP system step by step.',
    approach: [
      {
        title: 'Understand Your Daily Flow',
        description:
          'We sit with your team to see how you currently track work, where time is wasted, and what reports you need every day.',
      },
      {
        title: 'Design Simple Screens',
        description:
          'We create clean, uncluttered screens so anyone on your staff can use the software comfortably without long training.',
      },
      {
        title: 'Build & Connect Everything',
        description:
          'We code the full system, set up secure logins, and make sure all forms, charts, and downloads work fast and reliably.',
      },
      {
        title: 'Move Your Data & Go Live',
        description:
          'We help import your existing records, test everything with your staff, and stay with you to make sure launch day is smooth.',
      },
    ],
    ctaHeadline: 'Have a project in mind? Let’s make it happen.',
    ctaSubtext:
      'Tell us how your organization works and we will build a clean ERP system that fits your team.',
  },
  {
    id: 'business-websites',
    slug: 'business-websites',
    shortLabel: 'Websites',
    title: 'Business Websites',
    subtitle: 'Clean, fast websites that help customers trust your company',
    image: '/websites.jpeg',
    heroHeadline:
      'Professional business websites that make a strong first impression.',
    heroIntro:
      'Your website is often the first place people check before doing business with you. SPANYX designs and builds fast, modern websites that clearly explain what you do, build trust with visitors, and bring you more customer inquiries.',
    keyHighlights: [
      'Clear message that customers understand',
      'Loads fast on phones and laptops',
      'Built to rank well on Google',
      'Easy contact and inquiry forms',
    ],
    aboutHeadline:
      'A good website explains your business clearly in seconds.',
    aboutLead:
      'When someone visits your website, they should immediately understand what you offer, why they can trust you, and how to contact you. If a site is slow, cluttered, or outdated, people leave and go to a competitor.',
    aboutBody: [
      'At SPANYX, we build business websites that look sharp, read clearly, and work smoothly on every screen size. We avoid messy layouts and focus on clean design that puts your services, past work, and company strengths front and center.',
      'Every website we deliver is built for speed, Google search visibility, and easy updates—so your business looks professional and dependable from day one.',
    ],
    aboutMetrics: [
      { label: 'Speed', value: 'Fast Loading Pages' },
      { label: 'Mobile Friendly', value: 'Works on All Phones' },
      { label: 'Search Ready', value: 'Built for Google SEO' },
    ],
    mobileShowcase: {
      image: '/businesss-mob.png',
      badge: 'Responsive Touch Architecture',
      heading: 'Engineered to turn mobile visitors into direct customer inquiries.',
      description:
        'Most of your potential clients will discover your business from their phone. We design every page to load in under a second on mobile data, with thumb-friendly buttons and direct WhatsApp integration that turns casual visits into phone calls and messages.',
      details: [
        'Loads in under a second on mobile 4G and 5G connections',
        'Direct WhatsApp and one-tap click-to-call buttons',
        'Clean typography that is effortless to read on any screen',
      ],
    },
    capabilitiesIntro:
      'Everything your company needs for a strong, reliable online presence.',
    capabilities: [
      {
        title: 'Custom Company Website Design',
        description:
          'Fresh, modern page layouts designed around your brand colors and business goals—never copied from cheap templates.',
      },
      {
        title: 'Pages Built to Bring Inquiries',
        description:
          'Clear service pages, call-to-action buttons, and simple contact forms that make it easy for visitors to reach out to you.',
      },
      {
        title: 'Mobile & Tablet Ready',
        description:
          'Most people browse on their phones. We make sure your website looks great and is easy to tap on every screen size.',
      },
      {
        title: 'Easy Content Updates',
        description:
          'Need to change text, add a new service, or post an update? We make it simple for your team to keep the website fresh.',
      },
      {
        title: 'Google Search (SEO) Setup',
        description:
          'Proper page titles, clean code, and fast image loading so customers can find your business more easily on Google.',
      },
      {
        title: 'WhatsApp, Email & CRM Links',
        description:
          'Connect your website forms directly to your email, WhatsApp, or sales tools so you never miss a customer lead.',
      },
    ],
    approachIntro:
      'A simple, clear process from first idea to launch day.',
    approach: [
      {
        title: 'Plan the Pages',
        description:
          'We discuss your business, your customers, and what pages you need so the website structure is clear from the start.',
      },
      {
        title: 'Design the Look',
        description:
          'We design clean, modern layouts with readable fonts and balanced spacing that make your business look its best.',
      },
      {
        title: 'Build the Website',
        description:
          'We turn the design into a fast, secure website that works smoothly across all modern browsers and phones.',
      },
      {
        title: 'Test & Launch',
        description:
          'We check every link, form, and mobile screen, connect your domain name, and launch your website live.',
      },
    ],
    ctaHeadline: 'Have a project in mind? Let’s make it happen.',
    ctaSubtext:
      'Let’s build a clean, fast business website that makes your company stand out.',
  },
  {
    id: 'ai-agents',
    slug: 'ai-agents',
    shortLabel: 'AI Agents',
    title: 'AI Agents',
    subtitle: 'Autonomous AI agents, intelligent workflows, and custom LLM tools',
    image: '/im1.png',
    video: '/ai.mp4',
    heroHeadline:
      'Intelligent AI agents that automate complex work and think alongside your team.',
    heroIntro:
      'We design and deploy autonomous AI agents and intelligent workflows that turn repetitive manual processes into fast, self-executing systems. From custom customer support and automated research to internal knowledge retrieval and task execution, our AI solutions work 24/7 with precision.',
    keyHighlights: [
      'Autonomous multi-step task execution',
      'Custom LLM models trained on your data',
      'RAG & internal document search',
      'Seamless API & tool integrations',
    ],
    aboutHeadline:
      'Move beyond simple chatbots to agents that actually take action.',
    aboutLead:
      'Most AI tools stop at answering questions. At Spanyx, we engineer AI agents that understand context, connect directly to your databases and APIs, make decisions, and execute multi-step workflows without human bottlenecks.',
    aboutBody: [
      'We build purpose-driven AI systems tailored to your business operations. Whether you need automated customer outreach, intelligent lead qualification, instant document analysis, or autonomous code and data verification, our agents integrate smoothly into your existing tech stack.',
      'With secure privacy boundaries, role-based guardrails, and real-time observability, you maintain full control while letting AI handle the heavy lifting.',
    ],
    aboutMetrics: [
      { label: 'Uptime & Speed', value: '24/7 Real-Time Execution' },
      { label: 'Integration', value: 'APIs, Databases & CRMs' },
      { label: 'Guardrails', value: 'Enterprise Privacy & Control' },
    ],
    mobileShowcase: {
      image: '/ai-mockk.png',
      badge: 'Mobile Agent Hub',
      heading: 'Monitor and interact with your AI agents right from your phone.',
      description:
        'Stay connected to your automated workflows anywhere. Get instant notifications when high-priority tasks complete, review agent summaries, and approve critical actions on the go.',
      details: [
        'Instant alerts for completed actions and key insights',
        'Human-in-the-loop approvals with a single tap',
        'Live execution telemetry and decision logs',
      ],
    },
    capabilitiesIntro:
      'Practical AI agent capabilities built to elevate your business efficiency.',
    capabilities: [
      {
        title: 'Autonomous Workflow Execution',
        description:
          'Agents that break complex requests into steps, retrieve information, invoke tools, and complete tasks from start to finish.',
      },
      {
        title: 'Knowledge Retrieval (RAG)',
        description:
          'Connect your internal documents, wikis, and databases so agents answer questions with exact, verified company knowledge.',
      },
      {
        title: 'Customer Experience & Support Agents',
        description:
          '24/7 intelligent support agents that understand tone, resolve customer issues, book appointments, and escalate when needed.',
      },
      {
        title: 'Data Analysis & Automated Reports',
        description:
          'Agents that ingest data from multiple systems, detect anomalies, generate clear summaries, and deliver daily reports.',
      },
      {
        title: 'Tool & API Integrations',
        description:
          'Connect agents directly with Slack, WhatsApp, Google Workspace, CRMs, ERPs, and custom backend endpoints.',
      },
      {
        title: 'Safety Guardrails & Privacy',
        description:
          'Robust hallucination prevention, data encryption, and role-based permissions ensuring enterprise-grade security.',
      },
    ],
    approachIntro:
      'How we design, train, and deploy dependable AI agents for your business.',
    approach: [
      {
        title: 'Discover & Map Workflows',
        description:
          'We identify repetitive tasks and high-leverage workflows where AI agents create immediate measurable impact.',
      },
      {
        title: 'Architect Knowledge & Tooling',
        description:
          'We connect your data sources, establish prompt architectures, and set up API actions with safe boundaries.',
      },
      {
        title: 'Develop, Test & Benchmark',
        description:
          'We test edge cases, benchmark response accuracy, and implement guardrails so the agent behaves reliably.',
      },
      {
        title: 'Deploy & Continuous Learning',
        description:
          'We launch the agent with comprehensive observability, live telemetry, and human-in-the-loop refinement.',
      },
    ],
    ctaHeadline: 'Ready to automate your workflows with intelligent AI agents?',
    ctaSubtext:
      'Tell us about your processes and let’s build custom AI agents that deliver lasting value.',
  },
  {
    id: 'scroll-driven-animations',
    slug: 'scroll-driven-animations',
    shortLabel: 'Animations',
    title: 'Scroll-Driven Animations',
    subtitle: "Plot twist — you're literally experiencing one right now",
    image: '/scroll1.png',
    heroHeadline:
      'Smooth scroll animations that make your website feel alive.',
    heroIntro:
      'Want your website to feel as smooth and engaging as the page you just scrolled through? SPANYX builds interactive scroll animations where text, images, and cards move naturally as the visitor scrolls—keeping people hooked from top to bottom.',
    keyHighlights: [
      'Smooth 60fps scroll motion',
      'Stacked cards & pinned sections',
      'Interactive product reveals',
      'Fast and lag-free on all devices',
    ],
    aboutHeadline:
      'Keep visitors engaged by turning a normal page into an interactive story.',
    aboutLead:
      'Most websites feel flat and forgettable. When a page responds smoothly as you scroll—fading headlines, stacking project cards, and revealing details step by step—people actually slow down and pay attention.',
    aboutBody: [
      'At SPANYX, we build scroll-driven animations that look impressive without making the website heavy or confusing. Every movement has a clear purpose: guiding the visitor’s eye to what matters most.',
      'We carefully tune every transition so scrolling feels buttery smooth on laptops, big monitors, and phones alike, with zero lag or sudden jumps.',
    ],
    aboutMetrics: [
      { label: 'Smoothness', value: 'Zero-Lag 60fps Motion' },
      { label: 'Style', value: 'Clean & Purposeful' },
      { label: 'Experience', value: 'Memorable Storytelling' },
    ],
    mobileShowcase: {
      image: '/scroll1.png',
      badge: 'Fluid Touch Storytelling',
      heading: 'Smooth gesture-based storytelling crafted for touchscreens.',
      description:
        'Interactive storytelling should feel just as natural under your thumb as it does on a desktop trackpad. We optimize GPU rendering so mobile visitors enjoy fluid, locked 60 FPS transitions without jitter, stutter, or battery drain.',
      details: [
        'Locked 60 FPS performance on iOS and Android devices',
        'Natural touch gestures that never hijack or lock your scroll',
        'Optimized lightweight code that protects phone battery life',
      ],
    },
    capabilitiesIntro:
      'Interactive scroll effects we can build into your website or product launch page.',
    capabilities: [
      {
        title: 'Full-Screen Story Sections',
        description:
          'Hold the screen in place while headlines and visuals smoothly fade and change as the user scrolls down.',
      },
      {
        title: 'Stacked Card Showcases',
        description:
          'Let visitors flip through your services or projects in a smooth, layered card stack—just like our We Create section.',
      },
      {
        title: 'Step-by-Step Product Reveals',
        description:
          'Highlight different parts of your product or app one step at a time as the user scrolls down the page.',
      },
      {
        title: 'Subtle Animated Backgrounds',
        description:
          'Add tasteful moving starfields, soft light effects, or interactive canvas backgrounds that don’t slow down the page.',
      },
      {
        title: 'Smooth Buttons & Pop-Up Transitions',
        description:
          'Buttons and contact pages that open with fluid, natural motion instead of harsh, sudden pop-ups.',
      },
      {
        title: 'Speed & Smoothness Tuning',
        description:
          'Have an existing animated site that feels laggy? We fix stuttery scroll effects so they run smoothly.',
      },
    ],
    approachIntro:
      'How we plan and build scroll animations that feel natural and never lag.',
    approach: [
      {
        title: 'Map the Scroll Story',
        description:
          'We plan what happens on screen as the visitor scrolls from section to section so the flow feels natural and easy to follow.',
      },
      {
        title: 'Test the Motion & Timing',
        description:
          'We fine-tune the speed and feel of every fade, slide, and card stack so nothing feels too fast or too slow.',
      },
      {
        title: 'Write Clean, Fast Code',
        description:
          'We build the animations using modern hardware-accelerated techniques so the browser never stutters.',
      },
      {
        title: 'Check Across Screens',
        description:
          'We test on trackpads, mouse wheels, and mobile touchscreens to make sure scrolling feels great everywhere.',
      },
    ],
    ctaHeadline: 'Have a project in mind? Let’s make it happen.',
    ctaSubtext:
      'Want a website with smooth, eye-catching scroll animations like this one? Let’s build it together.',
  },
  {
    id: 'brand-portfolio-websites',
    slug: 'brand-portfolio-websites',
    shortLabel: 'Portfolios',
    title: 'Brand & Portfolio Websites',
    subtitle: 'Standout websites to showcase your brand, creative work, and story',
    image: '/brand.jpeg',
    heroHeadline:
      'Show your best work in a way people will remember.',
    heroIntro:
      'Whether you are a growing brand, a design or architecture studio, a restaurant, or a creative founder, your website should reflect the quality of your work. SPANYX creates custom brand and portfolio websites that look distinct, polished, and unforgettable.',
    keyHighlights: [
      'Unique look tailored to your brand',
      'Clean project & photo galleries',
      'Crisp, high-quality image display',
      'Easy to add new projects anytime',
    ],
    aboutHeadline:
      'When your work is special, your website shouldn’t look ordinary.',
    aboutLead:
      'Clients and customers judge the quality of your brand by how you present it online. A generic layout cannot capture the care and detail you put into your products or projects.',
    aboutBody: [
      'At SPANYX, we design brand and portfolio websites that let your photos, videos, and story shine. We use clean spacing, strong typography, and smooth layouts so visitors can browse your work without clutter.',
      'From luxury brands and hospitality businesses to creative agencies and personal portfolios, we build websites that make people proud to share their link.',
    ],
    aboutMetrics: [
      { label: 'Design', value: '100% Custom Made' },
      { label: 'Visuals', value: 'Sharp Photo & Video' },
      { label: 'Feel', value: 'Clean & Memorable' },
    ],
    mobileShowcase: {
      image: '/brand-mob.png',
      badge: 'Pocket Portfolio',
      heading: 'A brand showcase that looks like an editorial design book.',
      description:
        'When you share your link over WhatsApp or email, your portfolio needs to leave an immediate executive impression. Every case study, photograph, and typography choice is tuned for high-density mobile screens, making your creative work look world-class.',
      details: [
        'Editorial-grade typography and balanced spacing',
        'High-resolution imagery that loads instantly without delay',
        'Frictionless contact button always within thumb reach',
      ],
    },
    capabilitiesIntro:
      'Designed to highlight your brand identity, projects, and story with clarity.',
    capabilities: [
      {
        title: 'Custom Brand Look & Feel',
        description:
          'Colors, fonts, and layouts chosen specifically to match your brand’s personality and style.',
      },
      {
        title: 'Project & Case Study Pages',
        description:
          'Dedicated pages to show off your best projects with before-and-after visuals, client results, and full photo sets.',
      },
      {
        title: 'Fast, High-Quality Galleries',
        description:
          'Display large, sharp photos and videos in their true proportions without making the page slow to load.',
      },
      {
        title: 'Brand Story & Team Sections',
        description:
          'Share how your brand started, what you stand for, and the people behind the work in a warm, engaging way.',
      },
      {
        title: 'Smooth Page Transitions',
        description:
          'Subtle hover effects and clean transitions between projects that make browsing your portfolio a pleasure.',
      },
      {
        title: 'Simple Portfolio Updates',
        description:
          'Add new projects, swap photos, or update your featured work easily whenever you finish something new.',
      },
    ],
    approachIntro:
      'How we turn your brand and work into a standout website.',
    approach: [
      {
        title: 'Learn Your Brand Style',
        description:
          'We look at your best projects, photos, and brand identity to decide on the right mood and layout style.',
      },
      {
        title: 'Arrange Your Work Clearly',
        description:
          'We design clean pages where your images and story get breathing room and grab attention naturally.',
      },
      {
        title: 'Build with Care',
        description:
          'We code every detail carefully so images stay sharp, fonts look crisp, and animations feel smooth.',
      },
      {
        title: 'Final Polish & Launch',
        description:
          'We review every photo and screen size with you before launching your new brand website to the world.',
      },
    ],
    ctaHeadline: 'Have a project in mind? Let’s make it happen.',
    ctaSubtext:
      'Let’s create a custom brand or portfolio website that truly represents your work.',
  },
  {
    id: 'web-applications',
    slug: 'web-applications',
    shortLabel: 'Web Apps',
    title: 'Web Applications',
    subtitle: 'Custom web apps, customer portals, and online platforms',
    image: '/WEBAPPS.jpeg',
    heroHeadline:
      'Custom web apps built to launch and grow your digital product.',
    heroIntro:
      'Have an idea for an online platform, a customer portal, a booking system, or a SaaS product? SPANYX designs and builds complete web applications from scratch—handling both the user-friendly screens and the secure backend system.',
    keyHighlights: [
      'Complete frontend & backend build',
      'Secure user logins & accounts',
      'Online payments & subscriptions',
      'AI tools & third-party connections',
    ],
    aboutHeadline:
      'Turning your software idea into a real, working product people love to use.',
    aboutLead:
      'A web application is more than a regular website—it is interactive software that people log into and use to get things done. It needs to be easy for users to understand and strong enough on the inside to handle thousands of users safely.',
    aboutBody: [
      'At SPANYX, our designers and engineers work together to build custom web applications from start to finish. Whether you are launching a new startup product, building a self-service portal for your clients, or adding AI features to your workflow, we build it cleanly and reliably.',
      'We focus on simple user flows, fast response times, and clean code so you can keep adding new features smoothly as your business grows.',
    ],
    aboutMetrics: [
      { label: 'Technology', value: 'Modern React & Next.js' },
      { label: 'Accounts', value: 'Secure User Logins' },
      { label: 'Growth', value: 'Built to Scale Smoothly' },
    ],
    mobileShowcase: {
      image: '/web-app-mob.png',
      badge: 'Native App Feel',
      heading: 'Web applications that feel as responsive as an installed app.',
      description:
        'Skip the complex App Store download process. Our web applications use modern responsive architecture so your clients and team members can submit records, complete multi-step workflows, and inspect live data directly in their mobile browser.',
      details: [
        'Instant access from any mobile browser with zero app installation',
        'Fast optimistic updates that feel as quick as native software',
        'Reliable data saving even with unstable internet connections',
      ],
    },
    capabilitiesIntro:
      'What we can build for your custom web application or online platform.',
    capabilities: [
      {
        title: 'SaaS & Subscription Platforms',
        description:
          'Launch your own software product where customers can sign up, choose a plan, and use your tool online.',
      },
      {
        title: 'Customer & Partner Portals',
        description:
          'Give your clients a private login area to track orders, download invoices, book appointments, or manage their profile.',
      },
      {
        title: 'Smart AI Features',
        description:
          'Add practical AI tools like smart chat assistants, automatic document reading, or instant content generation into your app.',
      },
      {
        title: 'Fast Databases & APIs',
        description:
          'Well-organized backend systems that save, search, and load user data quickly and safely without errors.',
      },
      {
        title: 'Logins & Online Payments',
        description:
          'Google sign-in, OTP verification, and smooth payment checkout using Razorpay, Stripe, or UPI.',
      },
      {
        title: 'Cloud Hosting & Ongoing Support',
        description:
          'We set up reliable cloud servers, automatic backups, and monitoring so your web app stays online 24/7.',
      },
    ],
    approachIntro:
      'How we take your web app from a rough idea to a live product.',
    approach: [
      {
        title: 'Map Out Features & Screens',
        description:
          'We list out every user step and feature clearly so we build exactly what your users need first.',
      },
      {
        title: 'Design Easy-to-Use Screens',
        description:
          'We design clean dashboards, forms, and menus so users immediately know how to use your app.',
      },
      {
        title: 'Build in Clear Steps',
        description:
          'We develop the app in stages and share live preview links so you can test and give feedback as we go.',
      },
      {
        title: 'Test, Secure & Launch',
        description:
          'We test logins, payments, and speed thoroughly before launching your web application to real users.',
      },
    ],
    ctaHeadline: 'Have a project in mind? Let’s make it happen.',
    ctaSubtext:
      'Tell us about your web app idea and let’s plan and build it together.',
  },
  {
    id: 'trading-fintech-platforms',
    slug: 'trading-fintech-platforms',
    shortLabel: 'Fintech',
    title: 'Trading & FinTech Platforms',
    subtitle: 'Trading terminals, live market dashboards, and financial platforms',
    image: '/trading.png',
    heroHeadline:
      'Clear, fast trading platforms and financial dashboards.',
    heroIntro:
      'In trading and finance, every second and every number matters. SPANYX builds modern trading websites, live market dashboards, and trading education platforms—like TradeMax—where traders and students get clear charts, live insights, and smooth tools.',
    keyHighlights: [
      'Live market charts & price feeds',
      'Clean trader dashboards & stats',
      'Trading courses & community portals',
      'Fast, secure member accounts',
    ],
    aboutHeadline:
      'Built for traders and financial businesses that need speed and clarity.',
    aboutLead:
      'Financial platforms often suffer from messy screens that overwhelm users with numbers. Whether someone is checking live market setups, tracking their win rate, or learning a trading strategy, the screen needs to be clean, fast, and trustworthy.',
    aboutBody: [
      'At SPANYX, we design and build trading and fintech platforms that make complex market data easy to read. From live charting terminals and signal dashboards to complete trading academies with student portals, we build everything under one roof.',
      'We pay special attention to fast data updates, clean light and dark modes, and secure user accounts so your members have a smooth, professional experience every day.',
    ],
    aboutMetrics: [
      { label: 'Market Data', value: 'Live Charts & Updates' },
      { label: 'Design', value: 'Clean Light & Dark Modes' },
      { label: 'Access', value: 'Secure Member Portals' },
    ],
    mobileShowcase: {
      image: '/trade-mob.png',
      badge: 'TradeMax Mobile Platform',
      heading: 'TradeMax mobile interface built for speed and market clarity.',
      description:
        'In active markets, every second counts. The TradeMax mobile experience brings institutional-grade execution speeds, live WebSocket price feeds, and clear risk dashboards right to your pocket so you can trade with absolute confidence anywhere.',
      details: [
        'Sub-20ms mobile order routing with zero price slippage',
        'Live real-time tick charts that update without delay',
        'Secure multi-factor authentication with biometric support',
      ],
    },
    capabilitiesIntro:
      'Solutions we build for trading platforms, market portals, and fintech businesses.',
    capabilities: [
      {
        title: 'Web Trading Terminals',
        description:
          'Clean browser-based trading screens with watchlists, live price charts, and quick controls that work without lag.',
      },
      {
        title: 'Live Charts & Market Feeds',
        description:
          'Connect live stock, forex, or crypto price feeds with interactive candlestick charts and popular indicators.',
      },
      {
        title: 'Trader Performance Dashboards',
        description:
          'Show clear stats like profit and loss, win ratios, trade history, and risk numbers in simple visual cards.',
      },
      {
        title: 'Trading Academy & Course Portals',
        description:
          'Build a complete learning platform with structured video courses, batch tracking, and student progress dashboards.',
      },
      {
        title: 'Market Alerts & Signal Tools',
        description:
          'Custom scanners and instant alerts via Telegram, email, or dashboard notifications when market setups happen.',
      },
      {
        title: 'Member Logins & Subscriptions',
        description:
          'Secure sign-ups, paid membership plans, and admin panels to manage your traders, students, and subscriptions.',
      },
    ],
    approachIntro:
      'How we build fast, reliable trading and financial platforms.',
    approach: [
      {
        title: 'Plan Data & Features',
        description:
          'We decide what market data, charts, or course features your platform needs and how users will move through it.',
      },
      {
        title: 'Design Clear Financial Screens',
        description:
          'We design sharp, easy-to-read charts, tables, and dashboards that look great in both day and night mode.',
      },
      {
        title: 'Build for Speed & Accuracy',
        description:
          'We connect live data feeds, secure user logins, and fast backend systems so numbers update smoothly.',
      },
      {
        title: 'Test & Launch Safely',
        description:
          'We test account security, payment flows, and live chart performance before opening the platform to your users.',
      },
    ],
    ctaHeadline: 'Have a project in mind? Let’s make it happen.',
    ctaSubtext:
      'Talk with SPANYX to build your trading platform, market dashboard, or fintech website.',
  },
];

export function getCategoryBySlug(
  slug: string
): ShowcaseCategoryDetail | undefined {
  return SHOWCASE_CATEGORIES.find((cat) => cat.slug === slug);
}
