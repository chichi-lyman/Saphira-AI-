-- =====================================================================
-- 1. SETUP EXTENSIONS & BASE TABLES
-- =====================================================================

-- Enable UUID extension to generate secure, unguessable IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tenants Table (The individual companies/law firms)
CREATE TABLE tenants (
    tenant_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Sessions Table (Tracks who is logged in and their active token)
CREATE TABLE user_sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    session_token VARCHAR(512) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- 2. CORPORATE OPERATIONS TABLES (The data to be "Walled Off")
-- =====================================================================

-- Corporate Documents Table (Stores text chunks and processing metadata)
CREATE TABLE corporate_documents (
    document_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    raw_text TEXT NOT NULL,
    uploaded_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Saphira Audit Logs Table (Stores Saphira's automated compliance findings)
CREATE TABLE saphira_audit_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES corporate_documents(document_id) ON DELETE CASCADE,
    risk_level VARCHAR(50) NOT NULL, -- e.g., 'HIGH', 'MEDIUM', 'COMPLIANT'
    finding_summary TEXT NOT NULL,   -- Saphira's analysis of the issue
    flagged_text_passage TEXT,       -- The exact text snippet that triggered the flag
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes to ensure lighting-fast lookups under heavy business traffic
CREATE INDEX idx_docs_tenant ON corporate_documents(tenant_id);
CREATE INDEX idx_logs_tenant ON saphira_audit_logs(tenant_id);
CREATE INDEX idx_sessions_token ON user_sessions(session_token);

-- =====================================================================
-- 3. ENFORCING THE MATHEMATICAL SECURITY WALL (RLS)
-- =====================================================================

-- Turn on Row-Level Security for our operational tables
ALTER TABLE corporate_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE saphira_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create the security policy for Documents
-- This ensures a session can ONLY read/write data matching their assigned tenant ID variable
CREATE POLICY tenant_document_isolation ON corporate_documents
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

-- Create the security policy for Saphira's Audit Logs
CREATE POLICY tenant_audit_isolation ON saphira_audit_logs
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
