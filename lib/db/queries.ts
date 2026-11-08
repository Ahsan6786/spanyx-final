import { getDb } from './index';
import crypto from 'node:crypto';

export interface DateFilter {
  startDate?: string;
  endDate?: string;
}

export function getDateClause(columnName: string, filter?: DateFilter): { clause: string; params: string[] } {
  if (!filter || (!filter.startDate && !filter.endDate)) {
    return { clause: '1=1', params: [] };
  }
  const conditions: string[] = [];
  const params: string[] = [];
  if (filter.startDate) {
    conditions.push(`${columnName} >= ?`);
    params.push(filter.startDate);
  }
  if (filter.endDate) {
    conditions.push(`${columnName} <= ?`);
    params.push(filter.endDate);
  }
  return { clause: conditions.join(' AND '), params };
}

// ==========================================
// 1. ANALYTICS QUERIES
// ==========================================

export function getDashboardOverview(filter?: DateFilter) {
  const db = getDb();
  const sessionDate = getDateClause('started_at', filter);
  const visitorDate = getDateClause('created_at', filter);
  const pageviewDate = getDateClause('entered_at', filter);
  const leadDate = getDateClause('created_at', filter);

  // Total sessions & bounce & engaged & avg duration
  const sessionStats = db.prepare(`
    SELECT
      COUNT(*) as total_sessions,
      COALESCE(AVG(duration_seconds), 0) as avg_duration,
      SUM(CASE WHEN is_bounce = 1 THEN 1 ELSE 0 END) as bounce_count,
      SUM(CASE WHEN is_engaged = 1 THEN 1 ELSE 0 END) as engaged_count
    FROM analytics_sessions
    WHERE ${sessionDate.clause}
  `).get(...sessionDate.params) as any;

  // Unique visitors in date range
  const visitorStats = db.prepare(`
    SELECT
      COUNT(DISTINCT visitor_id) as unique_visitors,
      COUNT(*) as total_visitors,
      SUM(CASE WHEN visit_count > 1 THEN 1 ELSE 0 END) as returning_visitors
    FROM analytics_visitors
    WHERE ${visitorDate.clause}
  `).get(...visitorDate.params) as any;

  // Total Pageviews
  const pageviewStats = db.prepare(`
    SELECT COUNT(*) as total_pageviews
    FROM analytics_pageviews
    WHERE ${pageviewDate.clause}
  `).get(...pageviewDate.params) as any;

  // Contact Form Submissions / Leads
  const leadStats = db.prepare(`
    SELECT COUNT(*) as total_leads
    FROM leads
    WHERE ${leadDate.clause}
  `).get(...leadDate.params) as any;

  const totalSessions = sessionStats?.total_sessions || 0;
  const totalLeads = leadStats?.total_leads || 0;
  const conversionRate = totalSessions > 0 ? ((totalLeads / totalSessions) * 100).toFixed(2) : '0.00';
  const bounceRate = totalSessions > 0 ? (((sessionStats?.bounce_count || 0) / totalSessions) * 100).toFixed(1) : '0.0';

  return {
    total_visitors: visitorStats?.total_visitors || 0,
    unique_visitors: visitorStats?.unique_visitors || 0,
    total_sessions: totalSessions,
    returning_visitors: visitorStats?.returning_visitors || 0,
    avg_session_duration: Math.round(sessionStats?.avg_duration || 0),
    total_pageviews: pageviewStats?.total_pageviews || 0,
    contact_submissions: totalLeads,
    conversion_rate: conversionRate,
    bounce_rate: bounceRate,
    engaged_sessions: sessionStats?.engaged_count || 0,
  };
}

// Chart: Visitors and Sessions over time (grouped by day)
export function getTimelineStats(filter?: DateFilter) {
  const db = getDb();
  const sessionDate = getDateClause('started_at', filter);

  const rows = db.prepare(`
    SELECT
      substr(started_at, 1, 10) as date,
      COUNT(DISTINCT visitor_id) as visitors,
      COUNT(*) as sessions
    FROM analytics_sessions
    WHERE ${sessionDate.clause}
    GROUP BY substr(started_at, 1, 10)
    ORDER BY date ASC
  `).all(...sessionDate.params) as any[];

  return rows;
}

// Chart: Traffic Sources breakdown
export function getTrafficSourcesStats(filter?: DateFilter) {
  const db = getDb();
  const sessionDate = getDateClause('started_at', filter);

  const rows = db.prepare(`
    SELECT
      COALESCE(traffic_source, 'Direct') as source,
      COUNT(*) as sessions,
      COUNT(DISTINCT visitor_id) as visitors
    FROM analytics_sessions
    WHERE ${sessionDate.clause}
    GROUP BY traffic_source
    ORDER BY sessions DESC
  `).all(...sessionDate.params) as any[];

  return rows;
}

// Chart: Device Category & Browser breakdown
export function getDeviceDistribution(filter?: DateFilter) {
  const db = getDb();
  const visitorDate = getDateClause('created_at', filter);

  const devices = db.prepare(`
    SELECT
      COALESCE(device_category, 'Desktop') as category,
      COUNT(*) as count
    FROM analytics_visitors
    WHERE ${visitorDate.clause}
    GROUP BY device_category
    ORDER BY count DESC
  `).all(...visitorDate.params) as any[];

  const browsers = db.prepare(`
    SELECT
      COALESCE(browser, 'Other') as browser,
      COUNT(*) as count
    FROM analytics_visitors
    WHERE ${visitorDate.clause}
    GROUP BY browser
    ORDER BY count DESC
    LIMIT 6
  `).all(...visitorDate.params) as any[];

  return { devices, browsers };
}

// Table: Popular Pages
export function getPopularPages(limit: number = 20, filter?: DateFilter) {
  const db = getDb();
  const pageviewDate = getDateClause('entered_at', filter);

  const rows = db.prepare(`
    SELECT
      page_url,
      COALESCE(page_title, page_url) as page_title,
      COUNT(*) as views,
      COUNT(DISTINCT visitor_id) as unique_visitors,
      ROUND(AVG(time_spent_seconds), 1) as avg_time,
      ROUND(AVG(scroll_depth), 1) as avg_scroll
    FROM analytics_pageviews
    WHERE ${pageviewDate.clause}
    GROUP BY page_url
    ORDER BY views DESC
    LIMIT ?
  `).all(...pageviewDate.params, limit) as any[];

  return rows;
}

// Table: Visitors List
export function getVisitorsList(page: number = 1, pageSize: number = 15, search?: string) {
  const db = getDb();
  const offset = (page - 1) * pageSize;

  let query = `
    SELECT
      v.visitor_id,
      v.first_visit_at,
      v.last_visit_at,
      v.visit_count,
      v.device_category,
      v.browser,
      v.os,
      COALESCE(v.country, 'Unknown') as country,
      COALESCE(v.region, 'Unknown') as region,
      (SELECT traffic_source FROM analytics_sessions WHERE visitor_id = v.visitor_id ORDER BY started_at DESC LIMIT 1) as last_source,
      (SELECT COUNT(*) FROM analytics_pageviews WHERE visitor_id = v.visitor_id) as total_pages,
      (SELECT SUM(duration_seconds) FROM analytics_sessions WHERE visitor_id = v.visitor_id) as total_duration,
      (SELECT consent_status FROM consent_records WHERE visitor_id = v.visitor_id ORDER BY created_at DESC LIMIT 1) as consent_status
    FROM analytics_visitors v
  `;

  const params: any[] = [];
  if (search && search.trim()) {
    query += ` WHERE v.visitor_id LIKE ? OR v.browser LIKE ? OR v.country LIKE ? OR v.device_category LIKE ? `;
    const term = `%${search.trim()}%`;
    params.push(term, term, term, term);
  }

  query += ` ORDER BY v.last_visit_at DESC LIMIT ? OFFSET ? `;
  params.push(pageSize, offset);

  const visitors = db.prepare(query).all(...params);

  // Total count
  let countQuery = `SELECT COUNT(*) as total FROM analytics_visitors`;
  const countParams: any[] = [];
  if (search && search.trim()) {
    countQuery += ` WHERE visitor_id LIKE ? OR browser LIKE ? OR country LIKE ? OR device_category LIKE ? `;
    const term = `%${search.trim()}%`;
    countParams.push(term, term, term, term);
  }
  const total = (db.prepare(countQuery).get(...countParams) as any)?.total || 0;

  return {
    visitors,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

// Detailed Visitor Journey & Timeline
export function getVisitorDetails(visitorId: string) {
  const db = getDb();

  const visitor = db.prepare(`SELECT * FROM analytics_visitors WHERE visitor_id = ?`).get(visitorId) as any;
  if (!visitor) return null;

  const sessions = db.prepare(`
    SELECT * FROM analytics_sessions WHERE visitor_id = ? ORDER BY started_at DESC
  `).all(visitorId);

  const pageviews = db.prepare(`
    SELECT * FROM analytics_pageviews WHERE visitor_id = ? ORDER BY entered_at DESC
  `).all(visitorId);

  const events = db.prepare(`
    SELECT * FROM analytics_events WHERE visitor_id = ? ORDER BY created_at DESC
  `).all(visitorId);

  const consent = db.prepare(`
    SELECT * FROM consent_records WHERE visitor_id = ? ORDER BY created_at DESC LIMIT 1
  `).get(visitorId);

  const lead = db.prepare(`
    SELECT * FROM leads WHERE visitor_id = ? ORDER BY created_at DESC LIMIT 1
  `).get(visitorId);

  return {
    visitor,
    sessions,
    pageviews,
    events,
    consent,
    lead,
  };
}

// ==========================================
// 2. SERVICE INTEREST DETECTION
// ==========================================

export function getServiceInterestStats(filter?: DateFilter) {
  const db = getDb();
  const pageDate = getDateClause('entered_at', filter);

  // Map known URLs to Services
  const rows = db.prepare(`
    SELECT
      page_url,
      COUNT(*) as views,
      COUNT(DISTINCT visitor_id) as visitors,
      SUM(time_spent_seconds) as total_time,
      AVG(scroll_depth) as avg_scroll
    FROM analytics_pageviews
    WHERE ${pageDate.clause}
    GROUP BY page_url
  `).all(...pageDate.params) as any[];

  const serviceCategories = [
    { key: 'erp-solutions', name: 'ERP & Enterprise Solutions', pattern: /erp/i },
    { key: 'business-websites', name: 'Business & Brand Websites', pattern: /business-websites|brand-portfolio/i },
    { key: 'ai-agents', name: 'AI Agents & Automation', pattern: /ai-agent/i },
    { key: 'web-applications', name: 'Custom Web Applications', pattern: /web-application/i },
    { key: 'fintech-trading', name: 'Trading & FinTech Platforms', pattern: /trading-fintech|banking-finance/i },
    { key: 'real-estate', name: 'Real Estate Platforms', pattern: /real-estate/i },
    { key: 'healthcare', name: 'Healthcare & Medical Tech', pattern: /medical-doctors|health-beauty/i },
    { key: 'education', name: 'Higher Education & EdTech', pattern: /school-education/i },
    { key: 'ecommerce', name: 'E-Commerce & Digital Commerce', pattern: /e-commerce|b2c|b2b/i },
  ];

  // Aggregate stats per service
  const statsMap: Record<string, {
    key: string;
    name: string;
    views: number;
    visitors: Set<string>;
    totalTime: number;
    avgScroll: number;
    ctaClicks: number;
    interestScore: number;
  }> = {};

  for (const s of serviceCategories) {
    statsMap[s.key] = {
      key: s.key,
      name: s.name,
      views: 0,
      visitors: new Set(),
      totalTime: 0,
      avgScroll: 0,
      ctaClicks: 0,
      interestScore: 0,
    };
  }

  for (const row of rows) {
    for (const s of serviceCategories) {
      if (s.pattern.test(row.page_url)) {
        const item = statsMap[s.key];
        item.views += row.views;
        item.totalTime += row.total_time || 0;
        item.avgScroll = Math.max(item.avgScroll, row.avg_scroll || 0);
      }
    }
  }

  // Get CTA clicks on these service pages
  const eventDate = getDateClause('created_at', filter);
  const events = db.prepare(`
    SELECT page_url, COUNT(*) as cta_count
    FROM analytics_events
    WHERE event_category = 'cta_click' AND ${eventDate.clause}
    GROUP BY page_url
  `).all(...eventDate.params) as any[];

  for (const ev of events) {
    for (const s of serviceCategories) {
      if (s.pattern.test(ev.page_url)) {
        statsMap[s.key].ctaClicks += ev.cta_count;
      }
    }
  }

  // Calculate Interest Score:
  // Formula: (views * 2) + (total_time_minutes * 1.5) + (ctaClicks * 5) + (avgScroll * 0.1)
  const result = Object.values(statsMap).map((item) => {
    const timeMinutes = Math.round(item.totalTime / 60);
    const score = Math.round((item.views * 2) + (timeMinutes * 1.5) + (item.ctaClicks * 6) + (item.avgScroll * 0.1));
    return {
      key: item.key,
      name: item.name,
      views: item.views,
      total_time_seconds: item.totalTime,
      avg_scroll: Math.round(item.avgScroll),
      cta_clicks: item.ctaClicks,
      interest_score: score,
    };
  }).sort((a, b) => b.interest_score - a.interest_score);

  return result;
}

// ==========================================
// 3. LEADS & POTENTIAL CLIENTS
// ==========================================

export function getLeadsList(page: number = 1, pageSize: number = 15, status?: string, search?: string) {
  const db = getDb();
  const offset = (page - 1) * pageSize;

  let query = `SELECT * FROM leads WHERE 1=1 `;
  const params: any[] = [];

  if (status && status !== 'All') {
    query += ` AND status = ? `;
    params.push(status);
  }

  if (search && search.trim()) {
    query += ` AND (name LIKE ? OR email LIKE ? OR company LIKE ? OR interested_service LIKE ?) `;
    const term = `%${search.trim()}%`;
    params.push(term, term, term, term);
  }

  query += ` ORDER BY created_at DESC LIMIT ? OFFSET ? `;
  params.push(pageSize, offset);

  const leads = db.prepare(query).all(...params);

  // Total count
  let countQuery = `SELECT COUNT(*) as total FROM leads WHERE 1=1 `;
  const countParams: any[] = [];
  if (status && status !== 'All') {
    countQuery += ` AND status = ? `;
    countParams.push(status);
  }
  if (search && search.trim()) {
    countQuery += ` AND (name LIKE ? OR email LIKE ? OR company LIKE ? OR interested_service LIKE ?) `;
    const term = `%${search.trim()}%`;
    countParams.push(term, term, term, term);
  }
  const total = (db.prepare(countQuery).get(...countParams) as any)?.total || 0;

  return {
    leads,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

export function getLeadDetails(leadId: string) {
  const db = getDb();
  const lead = db.prepare(`SELECT * FROM leads WHERE id = ?`).get(leadId) as any;
  if (!lead) return null;

  const activities = db.prepare(`
    SELECT * FROM lead_activities WHERE lead_id = ? ORDER BY timestamp DESC
  `).all(leadId);

  // Associated visitor history
  let visitorJourney = null;
  if (lead.visitor_id) {
    const pageviews = db.prepare(`
      SELECT * FROM analytics_pageviews WHERE visitor_id = ? ORDER BY entered_at DESC LIMIT 25
    `).all(lead.visitor_id);
    const sessions = db.prepare(`
      SELECT * FROM analytics_sessions WHERE visitor_id = ? ORDER BY started_at DESC LIMIT 10
    `).all(lead.visitor_id);
    visitorJourney = { pageviews, sessions };
  }

  return { lead, activities, visitorJourney };
}

export function updateLeadStatus(leadId: string, status: string, notes?: string) {
  const db = getDb();
  const now = new Date().toISOString();

  db.prepare(`UPDATE leads SET status = ?, updated_at = ? WHERE id = ?`).run(status, now, leadId);

  // Record activity
  db.prepare(`
    INSERT INTO lead_activities (id, lead_id, activity_type, description, timestamp)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    crypto.randomUUID(),
    leadId,
    'status_change',
    `Status updated to "${status}"${notes ? ': ' + notes : ''}`,
    now
  );

  return true;
}

// ==========================================
// 4. COOKIE CONSENT & INVENTORY
// ==========================================

export function getConsentOverview() {
  const db = getDb();

  const total = (db.prepare(`SELECT COUNT(*) as count FROM consent_records`).get() as any)?.count || 0;
  const acceptedAll = (db.prepare(`
    SELECT COUNT(*) as count FROM consent_records WHERE consent_status = 'accepted_all'
  `).get() as any)?.count || 0;
  const rejectedOptional = (db.prepare(`
    SELECT COUNT(*) as count FROM consent_records WHERE consent_status = 'rejected_optional'
  `).get() as any)?.count || 0;
  const custom = (db.prepare(`
    SELECT COUNT(*) as count FROM consent_records WHERE consent_status = 'custom'
  `).get() as any)?.count || 0;
  const withdrawn = (db.prepare(`
    SELECT COUNT(*) as count FROM consent_records WHERE consent_status = 'withdrawn'
  `).get() as any)?.count || 0;

  // Category consent counts
  const functionalConsents = (db.prepare(`SELECT COUNT(*) as count FROM consent_records WHERE functional = 1`).get() as any)?.count || 0;
  const analyticsConsents = (db.prepare(`SELECT COUNT(*) as count FROM consent_records WHERE analytics = 1`).get() as any)?.count || 0;
  const marketingConsents = (db.prepare(`SELECT COUNT(*) as count FROM consent_records WHERE marketing = 1`).get() as any)?.count || 0;

  const acceptanceRate = total > 0 ? (((acceptedAll + custom) / total) * 100).toFixed(1) : '0.0';

  return {
    total_records: total,
    accepted_all: acceptedAll,
    rejected_optional: rejectedOptional,
    custom: custom,
    withdrawn: withdrawn,
    acceptance_rate: acceptanceRate,
    category_rates: {
      necessary: 100,
      functional: total > 0 ? Math.round((functionalConsents / total) * 100) : 0,
      analytics: total > 0 ? Math.round((analyticsConsents / total) * 100) : 0,
      marketing: total > 0 ? Math.round((marketingConsents / total) * 100) : 0,
    },
  };
}

export function getConsentRecords(page: number = 1, pageSize: number = 15, search?: string) {
  const db = getDb();
  const offset = (page - 1) * pageSize;

  let query = `SELECT * FROM consent_records `;
  const params: any[] = [];
  if (search && search.trim()) {
    query += ` WHERE consent_id LIKE ? OR visitor_id LIKE ? OR consent_status LIKE ? `;
    const term = `%${search.trim()}%`;
    params.push(term, term, term);
  }
  query += ` ORDER BY created_at DESC LIMIT ? OFFSET ? `;
  params.push(pageSize, offset);

  const records = db.prepare(query).all(...params);

  let countQuery = `SELECT COUNT(*) as total FROM consent_records `;
  const countParams: any[] = [];
  if (search && search.trim()) {
    countQuery += ` WHERE consent_id LIKE ? OR visitor_id LIKE ? OR consent_status LIKE ? `;
    const term = `%${search.trim()}%`;
    countParams.push(term, term, term);
  }
  const total = (db.prepare(countQuery).get(...countParams) as any)?.total || 0;

  return {
    records,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

export function getCookieInventory() {
  const db = getDb();
  return db.prepare(`SELECT * FROM cookie_inventory ORDER BY category, name`).all();
}

// ==========================================
// 5. DATA RETENTION & DELETION
// ==========================================

export function runDataRetentionCleanup(retentionDays: number = 180) {
  const db = getDb();
  const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000).toISOString();

  // Delete pageviews and events older than cutoff
  const deletedPageviews = db.prepare(`DELETE FROM analytics_pageviews WHERE entered_at < ?`).run(cutoffDate);
  const deletedEvents = db.prepare(`DELETE FROM analytics_events WHERE created_at < ?`).run(cutoffDate);
  const deletedSessions = db.prepare(`DELETE FROM analytics_sessions WHERE started_at < ?`).run(cutoffDate);

  return {
    cutoffDate,
    deleted_pageviews: deletedPageviews.changes,
    deleted_events: deletedEvents.changes,
    deleted_sessions: deletedSessions.changes,
  };
}

export function deleteVisitorData(identifier: string) {
  const db = getDb();
  // Identifier can be visitor_id or lead email
  let deletedCount = 0;

  // Check if visitor_id
  const visitor = db.prepare(`SELECT visitor_id FROM analytics_visitors WHERE visitor_id = ?`).get(identifier) as any;
  if (visitor) {
    db.prepare(`DELETE FROM analytics_pageviews WHERE visitor_id = ?`).run(identifier);
    db.prepare(`DELETE FROM analytics_events WHERE visitor_id = ?`).run(identifier);
    db.prepare(`DELETE FROM analytics_sessions WHERE visitor_id = ?`).run(identifier);
    db.prepare(`DELETE FROM consent_records WHERE visitor_id = ?`).run(identifier);
    db.prepare(`DELETE FROM analytics_visitors WHERE visitor_id = ?`).run(identifier);
    deletedCount++;
  }

  // Check if email in leads
  const lead = db.prepare(`SELECT id, visitor_id FROM leads WHERE email = ?`).get(identifier) as any;
  if (lead) {
    db.prepare(`DELETE FROM lead_activities WHERE lead_id = ?`).run(lead.id);
    db.prepare(`DELETE FROM leads WHERE id = ?`).run(lead.id);
    if (lead.visitor_id) {
      db.prepare(`DELETE FROM analytics_visitors WHERE visitor_id = ?`).run(lead.visitor_id);
    }
    deletedCount++;
  }

  return { success: true, deleted: deletedCount > 0 };
}

// ==========================================
// 8. BLOGS / CONTENT MANAGEMENT QUERIES
// ==========================================

export interface BlogItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  author_name: string;
  author_role: string | null;
  author_avatar: string | null;
  category: string;
  tags: string | null;
  read_time_minutes: number;
  status: 'draft' | 'published';
  views: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export function getAllBlogs(options?: {
  status?: string;
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): { blogs: BlogItem[]; total: number } {
  const db = getDb();
  const conditions: string[] = ['1=1'];
  const params: any[] = [];

  if (options?.status && options.status !== 'all') {
    conditions.push('status = ?');
    params.push(options.status);
  }

  if (options?.category && options.category !== 'all') {
    conditions.push('category = ?');
    params.push(options.category);
  }

  if (options?.search && options.search.trim()) {
    conditions.push('(title LIKE ? OR excerpt LIKE ? OR content LIKE ? OR tags LIKE ?)');
    const q = `%${options.search.trim()}%`;
    params.push(q, q, q, q);
  }

  const whereClause = conditions.join(' AND ');
  const total = (db.prepare(`SELECT COUNT(*) as count FROM blogs WHERE ${whereClause}`).get(...params) as any)?.count || 0;

  const limit = options?.limit || 50;
  const offset = options?.offset || 0;

  const blogs = db.prepare(`
    SELECT * FROM blogs
    WHERE ${whereClause}
    ORDER BY
      CASE WHEN status = 'published' AND published_at IS NOT NULL THEN published_at ELSE created_at END DESC
    LIMIT ? OFFSET ?
  `).all(...params, limit, offset) as unknown as BlogItem[];

  return { blogs, total };
}

export function getPublishedBlogs(options?: {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): { blogs: BlogItem[]; total: number } {
  return getAllBlogs({
    status: 'published',
    category: options?.category,
    search: options?.search,
    limit: options?.limit || 20,
    offset: options?.offset || 0,
  });
}

export function getBlogById(id: string): BlogItem | null {
  const db = getDb();
  const blog = db.prepare('SELECT * FROM blogs WHERE id = ?').get(id) as unknown as BlogItem | undefined;
  return blog || null;
}

export function getBlogBySlug(slug: string): BlogItem | null {
  const db = getDb();
  const blog = db.prepare('SELECT * FROM blogs WHERE slug = ?').get(slug) as unknown as BlogItem | undefined;
  return blog || null;
}

export function createBlog(data: Partial<BlogItem>): BlogItem {
  const db = getDb();
  const id = data.id || 'blog_' + crypto.randomUUID().replace(/-/g, '').substring(0, 12);
  const now = new Date().toISOString();

  // Create clean slug
  let slug = data.slug || data.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'article';
  // Ensure uniqueness
  const existing = db.prepare('SELECT id FROM blogs WHERE slug = ?').get(slug);
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  // Calculate estimated reading time
  const wordCount = (data.content || '').trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const status = data.status || 'draft';
  const publishedAt = status === 'published' ? (data.published_at || now) : null;

  db.prepare(`
    INSERT INTO blogs (
      id, title, slug, excerpt, content, featured_image,
      author_name, author_role, author_avatar, category, tags,
      read_time_minutes, status, views, published_at, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.title || 'Untitled Blog Post',
    slug,
    data.excerpt || '',
    data.content || '',
    data.featured_image || null,
    data.author_name || 'Spanyx Engineering Team',
    data.author_role || 'Core Team',
    data.author_avatar || '/span/small-logo.png',
    data.category || 'Engineering',
    data.tags || '',
    readTime,
    status,
    0,
    publishedAt,
    now,
    now
  );

  return getBlogById(id)!;
}

export function updateBlog(id: string, data: Partial<BlogItem>): BlogItem | null {
  const db = getDb();
  const existing = getBlogById(id);
  if (!existing) return null;

  const now = new Date().toISOString();

  let slug = data.slug || existing.slug;
  if (data.slug && data.slug !== existing.slug) {
    const slugExists = db.prepare('SELECT id FROM blogs WHERE slug = ? AND id != ?').get(data.slug, id);
    if (slugExists) {
      slug = `${data.slug}-${Date.now().toString(36)}`;
    }
  }

  const status = data.status !== undefined ? data.status : existing.status;
  let publishedAt = existing.published_at;
  if (status === 'published' && !publishedAt) {
    publishedAt = data.published_at || now;
  } else if (data.published_at !== undefined) {
    publishedAt = data.published_at;
  }

  const content = data.content !== undefined ? data.content : existing.content;
  const wordCount = content.trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  db.prepare(`
    UPDATE blogs SET
      title = ?,
      slug = ?,
      excerpt = ?,
      content = ?,
      featured_image = ?,
      author_name = ?,
      author_role = ?,
      author_avatar = ?,
      category = ?,
      tags = ?,
      read_time_minutes = ?,
      status = ?,
      published_at = ?,
      updated_at = ?
    WHERE id = ?
  `).run(
    data.title !== undefined ? data.title : existing.title,
    slug,
    data.excerpt !== undefined ? data.excerpt : existing.excerpt,
    content,
    data.featured_image !== undefined ? data.featured_image : existing.featured_image,
    data.author_name !== undefined ? data.author_name : existing.author_name,
    data.author_role !== undefined ? data.author_role : existing.author_role,
    data.author_avatar !== undefined ? data.author_avatar : existing.author_avatar,
    data.category !== undefined ? data.category : existing.category,
    data.tags !== undefined ? data.tags : existing.tags,
    readTime,
    status,
    publishedAt,
    now,
    id
  );

  return getBlogById(id);
}

export function deleteBlog(id: string): boolean {
  const db = getDb();
  const res = db.prepare('DELETE FROM blogs WHERE id = ?').run(id);
  return res.changes > 0;
}

export function incrementBlogViews(idOrSlug: string) {
  const db = getDb();
  db.prepare(`
    UPDATE blogs SET views = views + 1 WHERE id = ? OR slug = ?
  `).run(idOrSlug, idOrSlug);
}

export function getBlogStats() {
  const db = getDb();
  const stats = db.prepare(`
    SELECT
      COUNT(*) as total_posts,
      SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published_posts,
      SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft_posts,
      COALESCE(SUM(views), 0) as total_views
    FROM blogs
  `).get() as any;

  return {
    total_posts: stats?.total_posts || 0,
    published_posts: stats?.published_posts || 0,
    draft_posts: stats?.draft_posts || 0,
    total_views: stats?.total_views || 0,
  };
}

// ==========================================
// 8. CAREERS & INTERNSHIP POSTINGS & APPLICATIONS
// ==========================================

export interface CareerPostingItem {
  id: string;
  title: string;
  slug: string;
  posting_type: 'internship' | 'full_time' | 'fresher';
  category: string;
  department: string;
  work_mode: string;
  location: string;
  duration: string | null;
  is_paid: number;
  stipend: string | null;
  required_skills: string | null;
  eligibility: string | null;
  certificate_available: number;
  has_ppo: number;
  description: string;
  responsibilities: string | null;
  status: 'published' | 'draft' | 'paused' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface CareerApplicationItem {
  id: string;
  posting_id: string;
  posting_title: string;
  posting_type: 'internship' | 'job';
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  experience_level: 'Student' | 'Fresher' | 'Experienced Professional';
  current_college_or_company: string | null;
  graduation_year: string | null;
  portfolio_or_linkedin: string | null;
  resume_url_or_text: string | null;
  cover_note: string | null;
  status: 'new' | 'reviewing' | 'shortlisted' | 'interview_scheduled' | 'accepted' | 'rejected';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function getCareerPostings(options?: {
  category?: string;
  posting_type?: string;
  status?: string;
  search?: string;
}): CareerPostingItem[] {
  const db = getDb();
  let query = 'SELECT * FROM career_postings WHERE 1=1';
  const params: any[] = [];

  if (options?.status) {
    query += ' AND status = ?';
    params.push(options.status);
  }

  if (options?.category && options.category !== 'All') {
    if (options.category === 'Remote Opportunities') {
      query += ' AND (work_mode LIKE ? OR location LIKE ?)';
      params.push('%Remote%', '%Remote%');
    } else {
      query += ' AND category = ?';
      params.push(options.category);
    }
  }

  if (options?.posting_type && options.posting_type !== 'All') {
    query += ' AND posting_type = ?';
    params.push(options.posting_type);
  }

  if (options?.search && options.search.trim()) {
    query += ' AND (title LIKE ? OR required_skills LIKE ? OR department LIKE ?)';
    const term = `%${options.search.trim()}%`;
    params.push(term, term, term);
  }

  query += ' ORDER BY created_at DESC';
  return db.prepare(query).all(...params) as unknown as CareerPostingItem[];
}

export function getCareerPostingBySlug(slug: string): CareerPostingItem | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM career_postings WHERE slug = ?').get(slug);
  return (row as unknown as CareerPostingItem) || null;
}

export function getCareerPostingById(id: string): CareerPostingItem | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM career_postings WHERE id = ?').get(id);
  return (row as unknown as CareerPostingItem) || null;
}

export function createCareerPosting(data: Partial<CareerPostingItem>): CareerPostingItem {
  const db = getDb();
  const id = data.id || `cp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const title = (data.title || 'New Opportunity').trim();
  const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `role-${Date.now()}`;
  let slug = baseSlug;
  let counter = 1;
  while (db.prepare('SELECT id FROM career_postings WHERE slug = ?').get(slug)) {
    slug = `${baseSlug}-${counter++}`;
  }

  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO career_postings (
      id, title, slug, posting_type, category, department, work_mode, location,
      duration, is_paid, stipend, required_skills, eligibility, certificate_available,
      has_ppo, description, responsibilities, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    title,
    slug,
    data.posting_type || 'internship',
    data.category || (data.posting_type === 'internship' ? 'Internship Opportunities' : 'Full-Time Jobs'),
    data.department || 'Engineering',
    data.work_mode || 'Remote',
    data.location || 'Remote (India)',
    data.duration || (data.posting_type === 'internship' ? '3 Months' : 'Permanent Full-Time'),
    data.is_paid !== undefined ? (data.is_paid ? 1 : 0) : 1,
    data.stipend || 'Competitive',
    data.required_skills || '',
    data.eligibility || '',
    data.certificate_available !== undefined ? (data.certificate_available ? 1 : 0) : 1,
    data.has_ppo !== undefined ? (data.has_ppo ? 1 : 0) : 1,
    data.description || '',
    data.responsibilities || '',
    data.status || 'published',
    now,
    now
  );

  return getCareerPostingById(id)!;
}

export function updateCareerPosting(id: string, data: Partial<CareerPostingItem>): CareerPostingItem | null {
  const db = getDb();
  const existing = getCareerPostingById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  db.prepare(`
    UPDATE career_postings SET
      title = ?,
      posting_type = ?,
      category = ?,
      department = ?,
      work_mode = ?,
      location = ?,
      duration = ?,
      is_paid = ?,
      stipend = ?,
      required_skills = ?,
      eligibility = ?,
      certificate_available = ?,
      has_ppo = ?,
      description = ?,
      responsibilities = ?,
      status = ?,
      updated_at = ?
    WHERE id = ?
  `).run(
    data.title !== undefined ? data.title : existing.title,
    data.posting_type !== undefined ? data.posting_type : existing.posting_type,
    data.category !== undefined ? data.category : existing.category,
    data.department !== undefined ? data.department : existing.department,
    data.work_mode !== undefined ? data.work_mode : existing.work_mode,
    data.location !== undefined ? data.location : existing.location,
    data.duration !== undefined ? data.duration : existing.duration,
    data.is_paid !== undefined ? (data.is_paid ? 1 : 0) : existing.is_paid,
    data.stipend !== undefined ? data.stipend : existing.stipend,
    data.required_skills !== undefined ? data.required_skills : existing.required_skills,
    data.eligibility !== undefined ? data.eligibility : existing.eligibility,
    data.certificate_available !== undefined ? (data.certificate_available ? 1 : 0) : existing.certificate_available,
    data.has_ppo !== undefined ? (data.has_ppo ? 1 : 0) : existing.has_ppo,
    data.description !== undefined ? data.description : existing.description,
    data.responsibilities !== undefined ? data.responsibilities : existing.responsibilities,
    data.status !== undefined ? data.status : existing.status,
    now,
    id
  );

  return getCareerPostingById(id);
}

export function deleteCareerPosting(id: string): boolean {
  const db = getDb();
  const res = db.prepare('DELETE FROM career_postings WHERE id = ?').run(id);
  return res.changes > 0;
}

export function createCareerApplication(data: {
  posting_id: string;
  posting_title: string;
  posting_type: 'internship' | 'job';
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  experience_level: 'Student' | 'Fresher' | 'Experienced Professional';
  current_college_or_company?: string;
  graduation_year?: string;
  portfolio_or_linkedin?: string;
  resume_url_or_text?: string;
  cover_note?: string;
}): CareerApplicationItem {
  const db = getDb();
  const id = `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO career_applications (
      id, posting_id, posting_title, posting_type, applicant_name, applicant_email,
      applicant_phone, experience_level, current_college_or_company, graduation_year,
      portfolio_or_linkedin, resume_url_or_text, cover_note, status, notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', '', ?, ?)
  `).run(
    id,
    data.posting_id,
    data.posting_title,
    data.posting_type,
    data.applicant_name,
    data.applicant_email,
    data.applicant_phone,
    data.experience_level,
    data.current_college_or_company || null,
    data.graduation_year || null,
    data.portfolio_or_linkedin || null,
    data.resume_url_or_text || null,
    data.cover_note || null,
    now,
    now
  );

  return db.prepare('SELECT * FROM career_applications WHERE id = ?').get(id) as unknown as CareerApplicationItem;
}

export function getCareerApplications(options?: {
  posting_type?: string;
  experience_level?: string;
  status?: string;
  posting_id?: string;
  search?: string;
}): CareerApplicationItem[] {
  const db = getDb();
  let query = 'SELECT * FROM career_applications WHERE 1=1';
  const params: any[] = [];

  if (options?.posting_type && options.posting_type !== 'All') {
    query += ' AND posting_type = ?';
    params.push(options.posting_type);
  }

  if (options?.experience_level && options.experience_level !== 'All') {
    query += ' AND experience_level = ?';
    params.push(options.experience_level);
  }

  if (options?.status && options.status !== 'All') {
    query += ' AND status = ?';
    params.push(options.status);
  }

  if (options?.posting_id) {
    query += ' AND posting_id = ?';
    params.push(options.posting_id);
  }

  if (options?.search && options.search.trim()) {
    query += ' AND (applicant_name LIKE ? OR applicant_email LIKE ? OR posting_title LIKE ?)';
    const term = `%${options.search.trim()}%`;
    params.push(term, term, term);
  }

  query += ' ORDER BY created_at DESC';
  return db.prepare(query).all(...params) as unknown as CareerApplicationItem[];
}

export function updateCareerApplicationStatus(id: string, status: string, notes?: string): boolean {
  const db = getDb();
  const now = new Date().toISOString();
  let query = 'UPDATE career_applications SET status = ?, updated_at = ?';
  const params: any[] = [status, now];

  if (notes !== undefined) {
    query += ', notes = ?';
    params.push(notes);
  }

  query += ' WHERE id = ?';
  params.push(id);

  const res = db.prepare(query).run(...params);
  return res.changes > 0;
}

export function getCareersStats() {
  const db = getDb();
  const postingStats = db.prepare(`
    SELECT
      COUNT(*) as total_postings,
      SUM(CASE WHEN posting_type = 'internship' THEN 1 ELSE 0 END) as total_internships,
      SUM(CASE WHEN posting_type = 'fresher' THEN 1 ELSE 0 END) as total_freshers,
      SUM(CASE WHEN posting_type = 'full_time' THEN 1 ELSE 0 END) as total_jobs,
      SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as active_postings,
      SUM(CASE WHEN status = 'paused' THEN 1 ELSE 0 END) as paused_postings
    FROM career_postings
  `).get() as any;

  const appStats = db.prepare(`
    SELECT
      COUNT(*) as total_applications,
      SUM(CASE WHEN posting_type = 'internship' THEN 1 ELSE 0 END) as internship_applications,
      SUM(CASE WHEN posting_type = 'job' THEN 1 ELSE 0 END) as job_applications,
      SUM(CASE WHEN experience_level = 'Student' THEN 1 ELSE 0 END) as student_applicants,
      SUM(CASE WHEN experience_level = 'Fresher' THEN 1 ELSE 0 END) as fresher_applicants,
      SUM(CASE WHEN experience_level = 'Experienced Professional' THEN 1 ELSE 0 END) as experienced_applicants,
      SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_applications,
      SUM(CASE WHEN status = 'shortlisted' THEN 1 ELSE 0 END) as shortlisted_applications
    FROM career_applications
  `).get() as any;

  return {
    postings: {
      total: postingStats?.total_postings || 0,
      internships: postingStats?.total_internships || 0,
      freshers: postingStats?.total_freshers || 0,
      jobs: postingStats?.total_jobs || 0,
      active: postingStats?.active_postings || 0,
      paused: postingStats?.paused_postings || 0,
    },
    applications: {
      total: appStats?.total_applications || 0,
      internships: appStats?.internship_applications || 0,
      jobs: appStats?.job_applications || 0,
      students: appStats?.student_applicants || 0,
      freshers: appStats?.fresher_applicants || 0,
      experienced: appStats?.experienced_applicants || 0,
      new: appStats?.new_applications || 0,
      shortlisted: appStats?.shortlisted_applications || 0,
    },
  };
}


