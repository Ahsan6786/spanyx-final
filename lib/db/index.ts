import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import bcrypt from 'bcryptjs';

function getDatabaseFilePath(): string {
  // If running in Vercel or any serverless/lambda environment with read-only root
  const isServerless =
    Boolean(process.env.VERCEL) ||
    Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
    process.env.NODE_ENV === 'production';

  if (isServerless) {
    const tmpDir = path.join('/tmp', 'spanyx_data');
    if (!fs.existsSync(tmpDir)) {
      try {
        fs.mkdirSync(tmpDir, { recursive: true });
      } catch {
        return path.join('/tmp', 'spanyx_intelligence.db');
      }
    }
    const tmpDbPath = path.join(tmpDir, 'spanyx_intelligence.db');
    // If a bundled seed db exists in process.cwd()/data, copy it over once
    const seedDbPath = path.join(process.cwd(), 'data', 'spanyx_intelligence.db');
    if (!fs.existsSync(tmpDbPath) && fs.existsSync(seedDbPath)) {
      try {
        fs.copyFileSync(seedDbPath, tmpDbPath);
      } catch (err) {
        console.warn('Could not copy bundled seed db to /tmp, will initialize fresh:', err);
      }
    }
    return tmpDbPath;
  }

  // Local development
  const localDataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(localDataDir)) {
    try {
      fs.mkdirSync(localDataDir, { recursive: true });
    } catch {
      return path.join('/tmp', 'spanyx_intelligence.db');
    }
  }
  return path.join(localDataDir, 'spanyx_intelligence.db');
}

let _db: DatabaseSync | null = null;
let _schemaInitialized = false;

export function getDb(): DatabaseSync {
  if (!_db) {
    const dbPath = getDatabaseFilePath();
    try {
      _db = new DatabaseSync(dbPath);
    } catch (openErr) {
      console.warn(`Failed to open SQLite at ${dbPath}, falling back to in-memory:`, openErr);
      _db = new DatabaseSync(':memory:');
    }

    // Set busy timeout FIRST to prevent "database is locked" errors during concurrent worker access
    try {
      _db.exec('PRAGMA busy_timeout = 10000;');
      try {
        _db.exec('PRAGMA journal_mode = WAL;');
      } catch {
        _db.exec('PRAGMA journal_mode = DELETE;');
      }
      _db.exec('PRAGMA foreign_keys = ON;');
      _db.exec('PRAGMA synchronous = NORMAL;');
    } catch (pragmaErr) {
      console.warn('SQLite PRAGMA setup warning:', pragmaErr);
    }

    if (!_schemaInitialized) {
      try {
        initSchema(_db);
      } catch (schemaErr) {
        console.error('Failed to initialize SQLite schema:', schemaErr);
      }
      _schemaInitialized = true;
    }
  }
  return _db;
}

function initSchema(db: DatabaseSync) {
  // 1. Admins table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      last_login_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // 2. Admin Sessions
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_sessions (
      id TEXT PRIMARY KEY,
      token TEXT UNIQUE NOT NULL,
      admin_id TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      user_agent TEXT,
      ip_address TEXT,
      FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
  `);

  // 3. Login attempts (rate limiting / brute-force protection)
  db.exec(`
    CREATE TABLE IF NOT EXISTS login_attempts (
      id TEXT PRIMARY KEY,
      ip_address TEXT NOT NULL,
      email TEXT NOT NULL,
      attempted_at TEXT NOT NULL,
      success INTEGER DEFAULT 0
    );
    CREATE INDEX IF NOT EXISTS idx_login_attempts_ip_time ON login_attempts(ip_address, attempted_at);
  `);

  // 4. Analytics Visitors
  db.exec(`
    CREATE TABLE IF NOT EXISTS analytics_visitors (
      id TEXT PRIMARY KEY,
      visitor_id TEXT UNIQUE NOT NULL,
      first_visit_at TEXT NOT NULL,
      last_visit_at TEXT NOT NULL,
      visit_count INTEGER DEFAULT 1,
      device_category TEXT,
      browser TEXT,
      browser_version TEXT,
      os TEXT,
      screen_resolution TEXT,
      language TEXT,
      country TEXT,
      region TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_visitors_visitor_id ON analytics_visitors(visitor_id);
    CREATE INDEX IF NOT EXISTS idx_visitors_last_visit ON analytics_visitors(last_visit_at);
  `);

  // 5. Analytics Sessions
  db.exec(`
    CREATE TABLE IF NOT EXISTS analytics_sessions (
      id TEXT PRIMARY KEY,
      session_id TEXT UNIQUE NOT NULL,
      visitor_id TEXT NOT NULL,
      started_at TEXT NOT NULL,
      ended_at TEXT,
      duration_seconds INTEGER DEFAULT 0,
      pageviews_count INTEGER DEFAULT 1,
      entry_page TEXT,
      exit_page TEXT,
      referrer TEXT,
      referring_domain TEXT,
      traffic_source TEXT DEFAULT 'Direct',
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      utm_term TEXT,
      utm_content TEXT,
      is_bounce INTEGER DEFAULT 1,
      is_engaged INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY (visitor_id) REFERENCES analytics_visitors(visitor_id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_sessions_session_id ON analytics_sessions(session_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_visitor_id ON analytics_sessions(visitor_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON analytics_sessions(started_at);
    CREATE INDEX IF NOT EXISTS idx_sessions_visitor_started ON analytics_sessions(visitor_id, started_at DESC);
  `);

  // 6. Analytics Pageviews
  db.exec(`
    CREATE TABLE IF NOT EXISTS analytics_pageviews (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      visitor_id TEXT NOT NULL,
      page_url TEXT NOT NULL,
      page_title TEXT,
      page_category TEXT DEFAULT 'general',
      entered_at TEXT NOT NULL,
      exited_at TEXT,
      time_spent_seconds INTEGER DEFAULT 0,
      scroll_depth INTEGER DEFAULT 0,
      previous_page TEXT,
      next_page TEXT,
      FOREIGN KEY (session_id) REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
      FOREIGN KEY (visitor_id) REFERENCES analytics_visitors(visitor_id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_pageviews_session_id ON analytics_pageviews(session_id);
    CREATE INDEX IF NOT EXISTS idx_pageviews_visitor_id ON analytics_pageviews(visitor_id);
    CREATE INDEX IF NOT EXISTS idx_pageviews_entered_at ON analytics_pageviews(entered_at);
    CREATE INDEX IF NOT EXISTS idx_pageviews_page_url ON analytics_pageviews(page_url);
  `);

  // 7. Analytics Events (CTAs, clicks, form submits, scroll milestones)
  db.exec(`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      visitor_id TEXT NOT NULL,
      event_name TEXT NOT NULL,
      event_category TEXT NOT NULL,
      element_id TEXT,
      element_text TEXT,
      page_url TEXT NOT NULL,
      metadata_json TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (session_id) REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
      FOREIGN KEY (visitor_id) REFERENCES analytics_visitors(visitor_id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_events_session_id ON analytics_events(session_id);
    CREATE INDEX IF NOT EXISTS idx_events_visitor_id ON analytics_events(visitor_id);
    CREATE INDEX IF NOT EXISTS idx_events_name ON analytics_events(event_name);
    CREATE INDEX IF NOT EXISTS idx_events_created_at ON analytics_events(created_at);
  `);

  // 8. Consent Records
  db.exec(`
    CREATE TABLE IF NOT EXISTS consent_records (
      id TEXT PRIMARY KEY,
      consent_id TEXT UNIQUE NOT NULL,
      visitor_id TEXT NOT NULL,
      necessary INTEGER DEFAULT 1,
      functional INTEGER DEFAULT 0,
      analytics INTEGER DEFAULT 0,
      marketing INTEGER DEFAULT 0,
      consent_status TEXT NOT NULL,
      consent_version TEXT NOT NULL,
      policy_version TEXT NOT NULL,
      user_agent TEXT,
      ip_hash TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_consent_consent_id ON consent_records(consent_id);
    CREATE INDEX IF NOT EXISTS idx_consent_visitor_id ON consent_records(visitor_id);
    CREATE INDEX IF NOT EXISTS idx_consent_created_at ON consent_records(created_at);
    CREATE INDEX IF NOT EXISTS idx_consent_status ON consent_records(consent_status);
    CREATE INDEX IF NOT EXISTS idx_consent_visitor_created ON consent_records(visitor_id, created_at DESC);
  `);

  // 9. Consent Audit Logs
  db.exec(`
    CREATE TABLE IF NOT EXISTS consent_audit_logs (
      id TEXT PRIMARY KEY,
      consent_id TEXT NOT NULL,
      visitor_id TEXT NOT NULL,
      action TEXT NOT NULL,
      categories_json TEXT NOT NULL,
      previous_categories_json TEXT,
      user_agent TEXT,
      timestamp TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_consent_audit_consent_id ON consent_audit_logs(consent_id);
    CREATE INDEX IF NOT EXISTS idx_consent_audit_timestamp ON consent_audit_logs(timestamp);
  `);

  // 10. Cookie Inventory
  db.exec(`
    CREATE TABLE IF NOT EXISTS cookie_inventory (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      provider TEXT NOT NULL,
      category TEXT NOT NULL,
      purpose TEXT NOT NULL,
      expiry TEXT NOT NULL,
      type TEXT NOT NULL,
      detected INTEGER DEFAULT 1,
      updated_at TEXT NOT NULL
    );
  `);

  // 11. Leads (Form Submissions linked to Visitor Analytics History)
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      visitor_id TEXT,
      session_id TEXT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      website TEXT,
      company_size TEXT,
      industry TEXT,
      interested_service TEXT,
      message TEXT,
      phone TEXT,
      job_designation TEXT,
      budget TEXT,
      preferred_contact_method TEXT DEFAULT 'Email',
      lead_score INTEGER DEFAULT 0,
      status TEXT DEFAULT 'New',
      traffic_source TEXT,
      first_landing_page TEXT,
      campaign_json TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
    CREATE INDEX IF NOT EXISTS idx_leads_visitor_id ON leads(visitor_id);
    CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
    CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
  `);

  // 12. Lead Activities
  db.exec(`
    CREATE TABLE IF NOT EXISTS lead_activities (
      id TEXT PRIMARY KEY,
      lead_id TEXT NOT NULL,
      activity_type TEXT NOT NULL,
      description TEXT NOT NULL,
      score_change INTEGER DEFAULT 0,
      timestamp TEXT NOT NULL,
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_lead_activities_lead_id ON lead_activities(lead_id);
  `);

  // 13. Campaign Attribution
  db.exec(`
    CREATE TABLE IF NOT EXISTS campaign_attribution (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      visitor_id TEXT NOT NULL,
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      utm_term TEXT,
      utm_content TEXT,
      referrer TEXT,
      landing_page TEXT,
      attribution_model TEXT DEFAULT 'last_touch',
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_attribution_visitor_id ON campaign_attribution(visitor_id);
  `);

  // 14. System Settings (Lead scoring weights, retention policies)
  db.exec(`
    CREATE TABLE IF NOT EXISTS system_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // 15. Data Deletion Requests (DPDP Act Compliance)
  db.exec(`
    CREATE TABLE IF NOT EXISTS data_deletion_requests (
      id TEXT PRIMARY KEY,
      visitor_id TEXT,
      email TEXT,
      status TEXT DEFAULT 'Pending',
      requested_at TEXT NOT NULL,
      processed_at TEXT,
      notes TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_deletion_email ON data_deletion_requests(email);
  `);

  // 16. Blogs (Content Management System)
  db.exec(`
    CREATE TABLE IF NOT EXISTS blogs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      excerpt TEXT,
      content TEXT NOT NULL,
      featured_image TEXT,
      author_name TEXT DEFAULT 'Spanyx Engineering Team',
      author_role TEXT DEFAULT 'Core Architecture',
      author_avatar TEXT DEFAULT '/span/small-logo.png',
      category TEXT DEFAULT 'Engineering',
      tags TEXT,
      read_time_minutes INTEGER DEFAULT 5,
      status TEXT DEFAULT 'draft',
      views INTEGER DEFAULT 0,
      published_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
    CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
    CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON blogs(published_at);
  `);

  // 17. AI Cache (Persistent Gemini Assessment & Intelligence with Hash Invalidation)
  db.exec(`
    CREATE TABLE IF NOT EXISTS ai_cache (
      id TEXT PRIMARY KEY,
      scope TEXT NOT NULL,
      target_id TEXT NOT NULL,
      data_hash TEXT NOT NULL,
      content_json TEXT NOT NULL,
      model_used TEXT NOT NULL,
      status TEXT DEFAULT 'completed',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_ai_cache_scope_target ON ai_cache(scope, target_id);
    CREATE INDEX IF NOT EXISTS idx_ai_cache_hash ON ai_cache(scope, data_hash);
  `);

  // Ensure source_page column exists on leads table
  try {
    const tableInfo = db.prepare(`PRAGMA table_info(leads)`).all() as Array<{ name: string }>;
    if (!tableInfo.some((col) => col.name === 'source_page')) {
      db.exec(`ALTER TABLE leads ADD COLUMN source_page TEXT;`);
    }
  } catch (e) {
    // Column may already exist
  }

  seedInitialData(db);
}

function seedInitialData(db: DatabaseSync) {
  // Primary administrator account
  const ADMIN_EMAIL = 'admin@spanyx.in';
  const ADMIN_PASSWORD = process.env.ADMIN_INITIAL_PASSWORD || 'Pppp0000@';
  const salt = bcrypt.genSaltSync(12);
  const passwordHash = bcrypt.hashSync(ADMIN_PASSWORD, salt);
  const now = new Date().toISOString();

  const existingAdmin = db.prepare('SELECT id FROM admins WHERE email = ?').get(ADMIN_EMAIL) as { id: string } | undefined;

  if (!existingAdmin) {
    const insertAdmin = db.prepare(`
      INSERT INTO admins (id, email, password_hash, name, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    insertAdmin.run(
      'admin_' + Math.random().toString(36).substring(2, 9),
      ADMIN_EMAIL,
      passwordHash,
      'Administrator',
      'superadmin',
      now,
      now
    );
  } else {
    // Keep password in sync with configured credentials
    const updateAdmin = db.prepare(`
      UPDATE admins SET password_hash = ?, updated_at = ? WHERE email = ?
    `);
    updateAdmin.run(passwordHash, now, ADMIN_EMAIL);
  }

  // Seed default system settings
  const defaultSettings = [
    {
      key: 'lead_scoring_weights',
      value: JSON.stringify({
        contact_form_submission: 30,
        schedule_meeting_click: 20,
        service_page_visit: 10,
        multiple_service_pages: 10,
        case_study_interaction: 5,
        repeat_visit: 5,
        high_dwell_time: 5,
      }),
    },
    {
      key: 'data_retention_days',
      value: '180', // 180 days default analytics retention
    },
    {
      key: 'tracking_config',
      value: JSON.stringify({
        enable_utm_capture: true,
        session_timeout_minutes: 30,
        scroll_depth_milestones: [25, 50, 75, 100],
        anonymize_ip: true,
      }),
    },
  ];

  const checkSetting = db.prepare('SELECT key FROM system_settings WHERE key = ?');
  const insertSetting = db.prepare('INSERT INTO system_settings (key, value, updated_at) VALUES (?, ?, ?)');

  for (const s of defaultSettings) {
    if (!checkSetting.get(s.key)) {
      insertSetting.run(s.key, s.value, new Date().toISOString());
    }
  }

  // Seed actual Spanyx Cookie Inventory
  const actualCookies = [
    {
      name: 'spx_consent',
      provider: 'Spanyx First-Party',
      category: 'Strictly Necessary',
      purpose: 'Stores visitor cookie consent choices across browser sessions and pages.',
      expiry: '365 days',
      type: 'First-party Cookie',
      detected: 1,
    },
    {
      name: 'spx_admin_token',
      provider: 'Spanyx Admin Auth',
      category: 'Strictly Necessary',
      purpose: 'HTTP-only authentication token maintaining secure administrator dashboard sessions.',
      expiry: '7 days',
      type: 'First-party Secure Cookie',
      detected: 1,
    },
    {
      name: 'spx_vid',
      provider: 'Spanyx Analytics',
      category: 'Analytics',
      purpose: 'Anonymous first-party visitor identifier for aggregating page views, sessions and engagement.',
      expiry: '365 days',
      type: 'First-party Cookie / LocalStorage',
      detected: 1,
    },
    {
      name: 'spx_sid',
      provider: 'Spanyx Analytics',
      category: 'Analytics',
      purpose: 'Temporary session identifier recording navigation sequences, dwell time and interactions.',
      expiry: '30 minutes',
      type: 'First-party Session Storage',
      detected: 1,
    },
    {
      name: 'spx_pref',
      provider: 'Spanyx Preferences',
      category: 'Functional',
      purpose: 'Remembers non-sensitive interface settings and theme state for returning visitors.',
      expiry: '180 days',
      type: 'First-party LocalStorage',
      detected: 1,
    },
    {
      name: 'spx_campaign',
      provider: 'Spanyx Marketing Attribution',
      category: 'Marketing',
      purpose: 'Preserves first-touch and last-touch UTM parameters to measure marketing source effectiveness.',
      expiry: '90 days',
      type: 'First-party Cookie / Storage',
      detected: 1,
    },
  ];

  const checkCookie = db.prepare('SELECT id FROM cookie_inventory WHERE name = ?');
  const insertCookie = db.prepare(`
    INSERT INTO cookie_inventory (id, name, provider, category, purpose, expiry, type, detected, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const nowStr = new Date().toISOString();
  for (const c of actualCookies) {
    if (!checkCookie.get(c.name)) {
      insertCookie.run(
        'cookie_' + c.name,
        c.name,
        c.provider,
        c.category,
        c.purpose,
        c.expiry,
        c.type,
        c.detected,
        nowStr
      );
    }
  }

  // Seed sample initial draft blogs if empty
  const blogCount = (db.prepare('SELECT COUNT(*) as count FROM blogs').get() as { count: number })?.count || 0;
  if (blogCount === 0) {
    const insertBlog = db.prepare(`
      INSERT INTO blogs (
        id, title, slug, excerpt, content, featured_image, author_name, author_role, author_avatar, category, tags, read_time_minutes, status, views, published_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertBlog.run(
      'blog_seed_1',
      'Engineering Next-Generation Digital Platforms: Architecture, Resiliency & Scale',
      'engineering-next-generation-digital-platforms',
      'A deep dive into how Spanyx approaches high-throughput architectures, micro-frontends, edge caching, and zero-trust security for mission-critical enterprise systems.',
      `# Engineering Next-Generation Digital Platforms

In modern digital ecosystems, standard web applications no longer suffice for mission-critical business operations. Enterprise applications demand sub-second latency, robust fault isolation, and verifiable data integrity.

## 1. The Imperative for Resilient Architecture
Distributed services require fault tolerance at every tier. Rather than building fragile monolithic structures, leading engineering organizations decouple critical user journeys into isolated, independently deployable modules.

Key architectural pillars include:
* **Edge Routing & Ingress Caching**: Distributing static assets and SSR responses to edge networks closest to users.
* **Deterministic State Management**: Eliminating race conditions and synchronization lag through single-directional data flows.
* **Asynchronous Telemetry**: Measuring telemetry and user interactions off the critical rendering path.

## 2. Security-First Engineering
Building secure applications is an architectural discipline, not a retrofitted checklist. Modern platforms implement end-to-end type safety, parameterized queries, and strict Content Security Policies by default.

## 3. Real-World Outcomes
At Spanyx, our engineering squads design platforms that seamlessly scale from hundreds to millions of concurrent interactions without degradation in performance or user experience.`,
      '/span/back-square.png',
      'Spanyx Architecture Squad',
      'System Architects',
      '/span/small-logo.png',
      'Engineering',
      'Architecture, Performance, Cloud, Scale',
      6,
      'draft',
      0,
      null,
      nowStr,
      nowStr
    );

    insertBlog.run(
      'blog_seed_2',
      'First-Party Visitor Intelligence: Balancing Privacy with Actionable Insights',
      'first-party-visitor-intelligence-privacy-analytics',
      'How modern engineering teams leverage cookieless fallbacks, granular consent, and first-party telemetry to understand audience engagement without compromising privacy compliance.',
      `# First-Party Visitor Intelligence & Compliance

With international privacy regulations such as the DPDP Act 2023 and GDPR reshaping data collection, third-party trackers are rapidly becoming obsolete.

## 1. The Shift to First-Party Signals
Businesses do not need invasive cross-site trackers to understand customer intent. By observing high-value on-site interactions—such as dwell time, section depth, and interactive calculators—engineering teams derive superior intent signals while respecting user autonomy.

## 2. Granular Consent as a Feature
Consent management should empower visitors, not obscure their choices behind deceptive patterns. A clean, transparent consent interface fosters trust and delivers higher-quality opt-in telemetry.

## 3. High-Performance Telemetry
Collecting metrics should never slow down the website. Using lightweight asynchronous payloads with Beacon API and server-side aggregation ensures zero impact on Lighthouse scores.`,
      '/span/back-square.png',
      'Spanyx Privacy & Data Team',
      'Data Engineering',
      '/span/small-logo.png',
      'Architecture',
      'Privacy, Analytics, DPDP, Telemetry',
      4,
      'draft',
      0,
      null,
      nowStr,
      nowStr
    );
  }

  // 12. Careers & Internships Postings
  db.exec(`
    CREATE TABLE IF NOT EXISTS career_postings (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      posting_type TEXT NOT NULL, -- 'internship', 'full_time', 'fresher'
      category TEXT NOT NULL,     -- 'Internship Opportunities', 'Full-Time Jobs', 'Fresher Opportunities', 'Remote Opportunities'
      department TEXT NOT NULL,
      work_mode TEXT NOT NULL,    -- 'Remote', 'Hybrid', 'On-site'
      location TEXT NOT NULL,
      duration TEXT,              -- '1 Month', '3 Months', '6 Months', 'Permanent'
      is_paid INTEGER DEFAULT 1,
      stipend TEXT,
      required_skills TEXT,
      eligibility TEXT,
      certificate_available INTEGER DEFAULT 1,
      has_ppo INTEGER DEFAULT 1,
      description TEXT NOT NULL,
      responsibilities TEXT,
      status TEXT DEFAULT 'published', -- 'published', 'draft', 'paused', 'closed'
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_career_postings_type ON career_postings(posting_type);
    CREATE INDEX IF NOT EXISTS idx_career_postings_status ON career_postings(status);
  `);

  // 13. Career Applications (Single application form with experience levels)
  db.exec(`
    CREATE TABLE IF NOT EXISTS career_applications (
      id TEXT PRIMARY KEY,
      posting_id TEXT NOT NULL,
      posting_title TEXT NOT NULL,
      posting_type TEXT NOT NULL, -- 'internship', 'job'
      applicant_name TEXT NOT NULL,
      applicant_email TEXT NOT NULL,
      applicant_phone TEXT NOT NULL,
      experience_level TEXT NOT NULL, -- 'Student', 'Fresher', 'Experienced Professional'
      current_college_or_company TEXT,
      graduation_year TEXT,
      portfolio_or_linkedin TEXT,
      resume_url_or_text TEXT,
      cover_note TEXT,
      status TEXT DEFAULT 'new', -- 'new', 'reviewing', 'shortlisted', 'interview_scheduled', 'accepted', 'rejected'
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (posting_id) REFERENCES career_postings(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_career_apps_posting ON career_applications(posting_id);
    CREATE INDEX IF NOT EXISTS idx_career_apps_type ON career_applications(posting_type);
    CREATE INDEX IF NOT EXISTS idx_career_apps_status ON career_applications(status);
  `);

  // Seed default internship and fresher opportunities if none exist
  const existingCareers = db.prepare('SELECT COUNT(*) as count FROM career_postings').get() as { count: number };
  if (existingCareers.count === 0) {
    const insertPosting = db.prepare(`
      INSERT INTO career_postings (
        id, title, slug, posting_type, category, department, work_mode, location,
        duration, is_paid, stipend, required_skills, eligibility, certificate_available,
        has_ppo, description, responsibilities, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const careersSeed = [
      {
        id: 'cp_web_dev_intern',
        title: 'Web Development Intern',
        slug: 'web-development-intern',
        posting_type: 'internship',
        category: 'Internship Opportunities',
        department: 'Engineering',
        work_mode: 'Remote',
        location: 'Remote (India)',
        duration: '3 Months (Extendable)',
        is_paid: 1,
        stipend: '₹15,000 - ₹22,000 / month',
        required_skills: 'React, Next.js, TypeScript, HTML5/CSS3, Tailwind CSS, REST APIs',
        eligibility: 'B.Tech, BCA, MCA, or related degree students / recent graduates with strong JS fundamentals',
        certificate_available: 1,
        has_ppo: 1,
        description: 'Collaborate with Spanyx core engineers to build responsive web applications, client portals, and modern interactive web experiences.',
        responsibilities: 'Develop high-performance UI components in React and Next.js; integrate backend REST and GraphQL endpoints; ensure cross-device mobile responsiveness.',
      },
      {
        id: 'cp_frontend_intern',
        title: 'Frontend Development Intern',
        slug: 'frontend-development-intern',
        posting_type: 'internship',
        category: 'Internship Opportunities',
        department: 'Engineering',
        work_mode: 'Remote',
        location: 'Remote (India)',
        duration: '3 Months',
        is_paid: 1,
        stipend: '₹15,000 - ₹20,000 / month',
        required_skills: 'TypeScript, React, Next.js, CSS Animations, Responsive Design, State Management',
        eligibility: 'Undergraduates or postgraduates with demonstrated frontend projects or GitHub repositories',
        certificate_available: 1,
        has_ppo: 1,
        description: 'Focus exclusively on clean design execution, micro-interactions, accessibility, and high-performance client rendering.',
        responsibilities: 'Translate Figma UI specifications into pixel-perfect components; optimize page rendering speeds and Core Web Vitals; build fluid animations.',
      },
      {
        id: 'cp_backend_intern',
        title: 'Backend Development Intern',
        slug: 'backend-development-intern',
        posting_type: 'internship',
        category: 'Internship Opportunities',
        department: 'Engineering',
        work_mode: 'Remote',
        location: 'Remote (India)',
        duration: '3 to 6 Months',
        is_paid: 1,
        stipend: '₹18,000 - ₹25,000 / month',
        required_skills: 'Node.js, TypeScript, PostgreSQL / SQLite, REST APIs, Redis, Docker basics',
        eligibility: 'Students or freshers with understanding of database normalization, indexing, and API security',
        certificate_available: 1,
        has_ppo: 1,
        description: 'Architect reliable backend services, database schemas, authentication systems, and microservices for high-concurrency client workloads.',
        responsibilities: 'Implement secure, parameterized database queries; build resilient API endpoints; write automated unit and integration tests.',
      },
      {
        id: 'cp_uiux_intern',
        title: 'UI/UX Design Intern',
        slug: 'ui-ux-design-intern',
        posting_type: 'internship',
        category: 'Internship Opportunities',
        department: 'Design',
        work_mode: 'Remote',
        location: 'Remote (India)',
        duration: '3 Months',
        is_paid: 1,
        stipend: '₹15,000 - ₹20,000 / month',
        required_skills: 'Figma, Design Systems, Wireframing, User Research, Typography, Prototyping',
        eligibility: 'Design students or self-taught designers with a strong design portfolio (Behance, Dribbble, or web)',
        certificate_available: 1,
        has_ppo: 1,
        description: 'Create intuitive, minimalist, Apple-inspired user experiences and design systems for enterprise software and web applications.',
        responsibilities: 'Craft wireframes, interactive prototypes, and high-fidelity mockups in Figma; conduct usability reviews; maintain design tokens.',
      },
      {
        id: 'cp_aiml_intern',
        title: 'AI/ML Intern',
        slug: 'ai-ml-intern',
        posting_type: 'internship',
        category: 'Internship Opportunities',
        department: 'Engineering',
        work_mode: 'Remote',
        location: 'Remote (India)',
        duration: '3 to 6 Months',
        is_paid: 1,
        stipend: '₹20,000 - ₹30,000 / month',
        required_skills: 'Python, PyTorch / TensorFlow, LangChain, LLM APIs, Vector Databases, Data Processing',
        eligibility: 'Students pursuing Computer Science, Data Science, or Mathematics with strong linear algebra and Python foundations',
        certificate_available: 1,
        has_ppo: 1,
        description: 'Work on cutting-edge generative AI workflows, agentic automation systems, and domain-specific LLM fine-tuning.',
        responsibilities: 'Build multi-step AI agent orchestrations; benchmark embeddings and retrieval pipelines; assist in fine-tuning internal automation models.',
      },
      {
        id: 'cp_mobile_intern',
        title: 'Mobile App Development Intern',
        slug: 'mobile-app-development-intern',
        posting_type: 'internship',
        category: 'Internship Opportunities',
        department: 'Engineering',
        work_mode: 'Remote',
        location: 'Remote (India)',
        duration: '3 Months',
        is_paid: 1,
        stipend: '₹15,000 - ₹22,000 / month',
        required_skills: 'Flutter / React Native, Dart / TypeScript, Mobile UI Patterns, State Management',
        eligibility: 'College students or freshers with at least one published or demonstrable mobile app on GitHub/stores',
        certificate_available: 1,
        has_ppo: 1,
        description: 'Develop high-performance cross-platform Android and iOS mobile applications with smooth 60fps animations.',
        responsibilities: 'Implement mobile UI screens from Figma; integrate native device APIs and push notifications; optimize memory and battery usage.',
      },
      {
        id: 'cp_digital_marketing_intern',
        title: 'Digital Marketing Intern',
        slug: 'digital-marketing-intern',
        posting_type: 'internship',
        category: 'Internship Opportunities',
        department: 'Marketing',
        work_mode: 'Remote',
        location: 'Remote (India)',
        duration: '3 Months',
        is_paid: 1,
        stipend: '₹12,000 - ₹18,000 / month',
        required_skills: 'SEO, Google Analytics, Content Marketing, Social Media Strategy, Growth Experimentation',
        eligibility: 'Passionate marketing, business, or communications students with strong analytical and writing skills',
        certificate_available: 1,
        has_ppo: 1,
        description: 'Execute organic growth initiatives, technical SEO optimizations, and B2B engagement campaigns for Spanyx solutions.',
        responsibilities: 'Analyze search trends and keyword opportunities; coordinate technical article distribution; measure campaign conversion metrics.',
      },
      {
        id: 'cp_bizdev_intern',
        title: 'Business Development Intern',
        slug: 'business-development-intern',
        posting_type: 'internship',
        category: 'Internship Opportunities',
        department: 'Business Development',
        work_mode: 'Hybrid',
        location: 'Bengaluru / Remote',
        duration: '3 to 6 Months',
        is_paid: 1,
        stipend: '₹15,000 - ₹25,000 / month + Incentives',
        required_skills: 'B2B Sales Communication, Lead Generation, Market Research, Client Presentations',
        eligibility: 'Final-year students or MBA/BBA graduates with excellent spoken and written communication',
        certificate_available: 1,
        has_ppo: 1,
        description: 'Identify enterprise partnership opportunities, engage institutional stakeholders, and assist in client discovery calls.',
        responsibilities: 'Research target universities and enterprises; draft tailored partnership briefs; coordinate initial technical qualification discussions.',
      },
      {
        id: 'cp_content_writing_intern',
        title: 'Content Writing Intern',
        slug: 'content-writing-intern',
        posting_type: 'internship',
        category: 'Internship Opportunities',
        department: 'Marketing',
        work_mode: 'Remote',
        location: 'Remote (India)',
        duration: '3 Months',
        is_paid: 1,
        stipend: '₹12,000 - ₹18,000 / month',
        required_skills: 'Technical Writing, Proofreading, Research, Storytelling, Software Domain Familiarity',
        eligibility: 'Students with exceptional English command and ability to explain complex technical concepts cleanly',
        certificate_available: 1,
        has_ppo: 1,
        description: 'Produce high-quality case studies, engineering documentation, and thought leadership articles for the Spanyx publications.',
        responsibilities: 'Interview engineering squad leads to synthesize technical case studies; write engaging website copy; ensure brand editorial consistency.',
      },
      {
        id: 'cp_junior_software_engineer',
        title: 'Associate Software Engineer',
        slug: 'associate-software-engineer',
        posting_type: 'fresher',
        category: 'Fresher Opportunities',
        department: 'Engineering',
        work_mode: 'Remote',
        location: 'Remote (India)',
        duration: 'Permanent Full-Time',
        is_paid: 1,
        stipend: '₹4.5L - ₹7.0L CTC',
        required_skills: 'TypeScript, React, Node.js, SQL, Git, Problem Solving',
        eligibility: 'Fresh graduates (2024 / 2025 / 2026 batch) with strong computer science fundamentals and projects',
        certificate_available: 0,
        has_ppo: 0,
        description: 'Join our core engineering squads as a full-time associate engineer building modern cloud platforms and enterprise web applications.',
        responsibilities: 'Build and ship full-stack web features; participate in architecture and code reviews; debug production issues.',
      },
      {
        id: 'cp_senior_cloud_architect',
        title: 'Senior Cloud & Systems Architect',
        slug: 'senior-cloud-systems-architect',
        posting_type: 'full_time',
        category: 'Full-Time Jobs',
        department: 'Engineering',
        work_mode: 'Remote',
        location: 'Remote (India)',
        duration: 'Permanent Full-Time',
        is_paid: 1,
        stipend: 'Competitive Executive Compensation',
        required_skills: 'AWS / GCP, Kubernetes, Terraform, Distributed Systems, High-Concurrency DBs',
        eligibility: '5+ years experience designing and operating multi-region distributed cloud platforms',
        certificate_available: 0,
        has_ppo: 0,
        description: 'Lead infrastructure design, zero-trust cloud security, and multi-region failover deployments across all Spanyx products.',
        responsibilities: 'Architect infrastructure-as-code deployments; implement automated disaster recovery; ensure sub-50ms global ingress response.',
      },
    ];

    for (const post of careersSeed) {
      insertPosting.run(
        post.id,
        post.title,
        post.slug,
        post.posting_type,
        post.category,
        post.department,
        post.work_mode,
        post.location,
        post.duration,
        post.is_paid,
        post.stipend,
        post.required_skills,
        post.eligibility,
        post.certificate_available,
        post.has_ppo,
        post.description,
        post.responsibilities,
        'published',
        nowStr,
        nowStr
      );
    }
  }
}


