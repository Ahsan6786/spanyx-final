-- ==============================================================================
-- Migration: 001_initial_schema.sql
-- Description: Core Schema for Spanyx Intelligence & Web Platform
-- Database: PostgreSQL 16+ / 18
-- Author: Senior PostgreSQL Database Architect
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Schema Migrations Tracking Table
CREATE TABLE IF NOT EXISTS schema_migrations (
    id SERIAL PRIMARY KEY,
    version VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    checksum VARCHAR(64)
);

-- 3. Identity & Access Management: Admins
CREATE TABLE IF NOT EXISTS admins (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(120) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);

-- 4. Identity & Access Management: Admin Sessions
CREATE TABLE IF NOT EXISTS admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token VARCHAR(128) UNIQUE NOT NULL,
    admin_id VARCHAR(64) NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_agent TEXT,
    ip_address INET
);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_id ON admin_sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);

-- 5. Security & Rate Limiting: Login Attempts
CREATE TABLE IF NOT EXISTS login_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address INET NOT NULL,
    email VARCHAR(255) NOT NULL,
    attempted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip_time ON login_attempts(ip_address, attempted_at);
CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(email);

-- 6. Visitor Analytics: Unique Visitors
CREATE TABLE IF NOT EXISTS analytics_visitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id VARCHAR(64) UNIQUE NOT NULL,
    first_visit_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_visit_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    visit_count INT NOT NULL DEFAULT 1,
    device_category VARCHAR(30),
    browser VARCHAR(50),
    browser_version VARCHAR(30),
    os VARCHAR(50),
    screen_resolution VARCHAR(30),
    language VARCHAR(20),
    country VARCHAR(60),
    region VARCHAR(60),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_visitors_visitor_id ON analytics_visitors(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitors_last_visit ON analytics_visitors(last_visit_at DESC);

-- 7. Visitor Analytics: User Sessions
CREATE TABLE IF NOT EXISTS analytics_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(64) UNIQUE NOT NULL,
    visitor_id VARCHAR(64) NOT NULL REFERENCES analytics_visitors(visitor_id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMPTZ,
    duration_seconds INT NOT NULL DEFAULT 0,
    pageviews_count INT NOT NULL DEFAULT 1,
    entry_page TEXT,
    exit_page TEXT,
    referrer TEXT,
    referring_domain TEXT,
    traffic_source VARCHAR(100) DEFAULT 'Direct',
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_term VARCHAR(100),
    utm_content VARCHAR(100),
    utm_params JSONB,
    is_bounce BOOLEAN NOT NULL DEFAULT TRUE,
    is_engaged BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_sessions_session_id ON analytics_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_sessions_visitor_id ON analytics_sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON analytics_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_traffic_source ON analytics_sessions(traffic_source);
CREATE INDEX IF NOT EXISTS idx_sessions_utm_params ON analytics_sessions USING GIN (utm_params);

-- 8. Visitor Analytics: Pageviews
CREATE TABLE IF NOT EXISTS analytics_pageviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(64) NOT NULL REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
    visitor_id VARCHAR(64) NOT NULL REFERENCES analytics_visitors(visitor_id) ON DELETE CASCADE,
    page_url TEXT NOT NULL,
    page_title TEXT,
    page_category VARCHAR(60) DEFAULT 'general',
    entered_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    exited_at TIMESTAMPTZ,
    time_spent_seconds INT NOT NULL DEFAULT 0,
    scroll_depth INT NOT NULL DEFAULT 0,
    previous_page TEXT,
    next_page TEXT
);
CREATE INDEX IF NOT EXISTS idx_pageviews_session_id ON analytics_pageviews(session_id);
CREATE INDEX IF NOT EXISTS idx_pageviews_visitor_id ON analytics_pageviews(visitor_id);
CREATE INDEX IF NOT EXISTS idx_pageviews_entered_at ON analytics_pageviews(entered_at DESC);
CREATE INDEX IF NOT EXISTS idx_pageviews_page_url ON analytics_pageviews(page_url);

-- 9. Visitor Analytics: Interactions & Events
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(64) NOT NULL REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
    visitor_id VARCHAR(64) NOT NULL REFERENCES analytics_visitors(visitor_id) ON DELETE CASCADE,
    event_name VARCHAR(100) NOT NULL,
    event_category VARCHAR(60) NOT NULL,
    element_id VARCHAR(100),
    element_text TEXT,
    page_url TEXT NOT NULL,
    metadata_json JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_events_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_visitor_id ON analytics_events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_events_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_metadata ON analytics_events USING GIN (metadata_json);

-- 10. Marketing: Campaign Attribution
CREATE TABLE IF NOT EXISTS campaign_attribution (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(64) NOT NULL REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
    visitor_id VARCHAR(64) NOT NULL REFERENCES analytics_visitors(visitor_id) ON DELETE CASCADE,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_term VARCHAR(100),
    utm_content VARCHAR(100),
    referrer TEXT,
    landing_page TEXT,
    attribution_model VARCHAR(40) DEFAULT 'last_touch',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_attribution_session_id ON campaign_attribution(session_id);
CREATE INDEX IF NOT EXISTS idx_attribution_visitor_id ON campaign_attribution(visitor_id);

-- 11. Privacy & DPDP Compliance: Consent Records
CREATE TABLE IF NOT EXISTS consent_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consent_id VARCHAR(64) UNIQUE NOT NULL,
    visitor_id VARCHAR(64) UNIQUE NOT NULL,
    necessary BOOLEAN NOT NULL DEFAULT TRUE,
    functional BOOLEAN NOT NULL DEFAULT FALSE,
    analytics BOOLEAN NOT NULL DEFAULT FALSE,
    marketing BOOLEAN NOT NULL DEFAULT FALSE,
    consent_status VARCHAR(30) NOT NULL,
    consent_version VARCHAR(20) NOT NULL,
    policy_version VARCHAR(20) NOT NULL,
    user_agent TEXT,
    ip_hash VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_consent_consent_id ON consent_records(consent_id);
CREATE INDEX IF NOT EXISTS idx_consent_visitor_id ON consent_records(visitor_id);

-- 12. Privacy & DPDP Compliance: Consent Audit Logs (Immutable)
CREATE TABLE IF NOT EXISTS consent_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consent_id VARCHAR(64) NOT NULL,
    visitor_id VARCHAR(64) NOT NULL,
    action VARCHAR(50) NOT NULL,
    categories_json JSONB NOT NULL,
    previous_categories_json JSONB,
    user_agent TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_consent_audit_consent_id ON consent_audit_logs(consent_id);
CREATE INDEX IF NOT EXISTS idx_consent_audit_visitor_id ON consent_audit_logs(visitor_id);
CREATE INDEX IF NOT EXISTS idx_consent_audit_timestamp ON consent_audit_logs(timestamp DESC);

-- 13. Privacy & DPDP Compliance: Cookie Inventory
CREATE TABLE IF NOT EXISTS cookie_inventory (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(100) UNIQUE NOT NULL,
    provider VARCHAR(100) NOT NULL,
    category VARCHAR(60) NOT NULL,
    purpose TEXT NOT NULL,
    expiry VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    detected BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_cookie_inventory_name ON cookie_inventory(name);
CREATE INDEX IF NOT EXISTS idx_cookie_inventory_category ON cookie_inventory(category);

-- 14. CRM & Contact Us: Leads
CREATE TABLE IF NOT EXISTS leads (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    visitor_id VARCHAR(64),
    session_id VARCHAR(64),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(150),
    website VARCHAR(255),
    company_size VARCHAR(60),
    industry VARCHAR(100),
    interested_service TEXT NOT NULL,
    message TEXT,
    phone VARCHAR(50),
    job_designation VARCHAR(100),
    budget VARCHAR(60),
    preferred_contact_method VARCHAR(40) DEFAULT 'Email',
    lead_score INT NOT NULL DEFAULT 0,
    status VARCHAR(40) NOT NULL DEFAULT 'New',
    traffic_source VARCHAR(100),
    first_landing_page TEXT,
    campaign_json JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_visitor_id ON leads(visitor_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_lead_score ON leads(lead_score DESC);

-- 15. CRM & Contact Us: Lead Activities
CREATE TABLE IF NOT EXISTS lead_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id VARCHAR(64) NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    activity_type VARCHAR(60) NOT NULL,
    description TEXT NOT NULL,
    score_change INT NOT NULL DEFAULT 0,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_lead_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_activities_timestamp ON lead_activities(timestamp DESC);

-- 16. Platform Configuration: System Settings
CREATE TABLE IF NOT EXISTS system_settings (
    key VARCHAR(80) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 17. Privacy Compliance: Data Deletion Requests
CREATE TABLE IF NOT EXISTS data_deletion_requests (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    visitor_id VARCHAR(64),
    email VARCHAR(255),
    status VARCHAR(30) NOT NULL DEFAULT 'Pending',
    requested_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMPTZ,
    notes TEXT
);
CREATE INDEX IF NOT EXISTS idx_deletion_email ON data_deletion_requests(email);
CREATE INDEX IF NOT EXISTS idx_deletion_status ON data_deletion_requests(status);

-- 18. CMS: Blogs
CREATE TABLE IF NOT EXISTS blogs (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    author_name VARCHAR(100) DEFAULT 'Spanyx Engineering Team',
    author_role VARCHAR(100) DEFAULT 'Core Architecture',
    author_avatar TEXT DEFAULT '/span/small-logo.png',
    category VARCHAR(60) DEFAULT 'Engineering',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    read_time_minutes INT DEFAULT 5,
    status VARCHAR(30) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    views INT NOT NULL DEFAULT 0,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON blogs(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_tags ON blogs USING GIN (tags);

-- 19. Careers: Postings
CREATE TABLE IF NOT EXISTS career_postings (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    posting_type VARCHAR(40) NOT NULL CHECK (posting_type IN ('internship', 'full_time', 'fresher')),
    category VARCHAR(80) NOT NULL,
    department VARCHAR(80) NOT NULL,
    work_mode VARCHAR(40) NOT NULL CHECK (work_mode IN ('Remote', 'Hybrid', 'On-site')),
    location VARCHAR(100) NOT NULL,
    duration VARCHAR(40),
    is_paid BOOLEAN NOT NULL DEFAULT TRUE,
    stipend VARCHAR(80),
    required_skills TEXT,
    eligibility TEXT,
    certificate_available BOOLEAN NOT NULL DEFAULT TRUE,
    has_ppo BOOLEAN NOT NULL DEFAULT TRUE,
    description TEXT NOT NULL,
    responsibilities TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'paused', 'closed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_career_postings_slug ON career_postings(slug);
CREATE INDEX IF NOT EXISTS idx_career_postings_type ON career_postings(posting_type);
CREATE INDEX IF NOT EXISTS idx_career_postings_status ON career_postings(status);

-- 20. Careers: Candidate Applications
CREATE TABLE IF NOT EXISTS career_applications (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    posting_id VARCHAR(64) NOT NULL REFERENCES career_postings(id) ON DELETE CASCADE,
    posting_title VARCHAR(200) NOT NULL,
    posting_type VARCHAR(40) NOT NULL,
    applicant_name VARCHAR(150) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    applicant_phone VARCHAR(50) NOT NULL,
    experience_level VARCHAR(50) NOT NULL CHECK (experience_level IN ('Student', 'Fresher', 'Experienced Professional')),
    current_college_or_company TEXT,
    graduation_year VARCHAR(20),
    portfolio_or_linkedin TEXT,
    resume_url_or_text TEXT,
    cover_note TEXT,
    status VARCHAR(40) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'shortlisted', 'interview_scheduled', 'accepted', 'rejected')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_career_apps_posting ON career_applications(posting_id);
CREATE INDEX IF NOT EXISTS idx_career_apps_type ON career_applications(posting_type);
CREATE INDEX IF NOT EXISTS idx_career_apps_status ON career_applications(status);
CREATE INDEX IF NOT EXISTS idx_career_apps_email ON career_applications(applicant_email);
CREATE INDEX IF NOT EXISTS idx_career_apps_created_at ON career_applications(created_at DESC);

-- Record migration execution
INSERT INTO schema_migrations (version, name, checksum)
VALUES ('001', 'initial_schema', md5('001_initial_schema_v1'))
ON CONFLICT (version) DO NOTHING;

