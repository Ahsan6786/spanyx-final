-- ==============================================================================
-- Migration Rollback: 001_initial_schema_down.sql
-- Description: Revert Core Schema for Spanyx Intelligence & Web Platform
-- Database: PostgreSQL 16+ / 18
-- Author: Senior PostgreSQL Database Architect
-- ==============================================================================

DROP TABLE IF EXISTS career_applications CASCADE;
DROP TABLE IF EXISTS career_postings CASCADE;
DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS data_deletion_requests CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;
DROP TABLE IF EXISTS lead_activities CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS cookie_inventory CASCADE;
DROP TABLE IF EXISTS consent_audit_logs CASCADE;
DROP TABLE IF EXISTS consent_records CASCADE;
DROP TABLE IF EXISTS campaign_attribution CASCADE;
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS analytics_pageviews CASCADE;
DROP TABLE IF EXISTS analytics_sessions CASCADE;
DROP TABLE IF EXISTS analytics_visitors CASCADE;
DROP TABLE IF EXISTS login_attempts CASCADE;
DROP TABLE IF EXISTS admin_sessions CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

DELETE FROM schema_migrations WHERE version = '001';

