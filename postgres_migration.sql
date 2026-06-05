-- =====================================================================
-- ADVANCED LEGAL TECH & CRYPTOGRAPHIC PROOF SCHEMA EXTENSION
-- =====================================================================

-- Enforce the use of the UUID extension established in the core schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- External CLM Integrations Table (Tracks connected corporate platforms)
CREATE TABLE IF NOT EXISTS clm_integrations (
    integration_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    platform_name VARCHAR(100) NOT NULL, -- e.g., 'Ironclad', 'DocuSign_CLM'
    api_endpoint_masked VARCHAR(512) NOT NULL,
    webhook_secret_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Zero-Knowledge Proof Logs Table (Validates mathematical truth without data leak)
CREATE TABLE IF NOT EXISTS zkp_verification_logs (
    proof_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    document_id TEXT REFERENCES corporate_documents(document_id) ON DELETE SET NULL,
    verification_key_hash VARCHAR(255) NOT NULL,
    public_inputs JSONB NOT NULL,              -- Cryptographic public parameter hashes
    proof_payload JSONB NOT NULL,              -- Actual zk-SNARK proof structure
    is_mathematically_valid BOOLEAN NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Advanced Swarm Sub-Agent Execution Tracking Table
CREATE TABLE IF NOT EXISTS swarm_agent_logs (
    execution_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    parent_document_id TEXT REFERENCES corporate_documents(document_id) ON DELETE CASCADE,
    assigned_agent_profile VARCHAR(100) NOT NULL, -- e.g., 'Aura_Legal_Researcher', 'Agent_Zero_SecOps'
    task_description TEXT NOT NULL,
    execution_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, EXECUTING, SUCCESS, FAILED
    error_traceback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- ROW-LEVEL SECURITY (RLS) EXTENSION ENFORCEMENT
-- =====================================================================
ALTER TABLE clm_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE zkp_verification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE swarm_agent_logs ENABLE ROW LEVEL SECURITY;

-- Apply identical mathematical walls to guarantee cross-tenant isolation
DROP POLICY IF EXISTS clm_tenant_isolation ON clm_integrations;
CREATE POLICY clm_tenant_isolation ON clm_integrations
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''));

DROP POLICY IF EXISTS zkp_tenant_isolation ON zkp_verification_logs;
CREATE POLICY zkp_tenant_isolation ON zkp_verification_logs
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''));

DROP POLICY IF EXISTS swarm_tenant_isolation ON swarm_agent_logs;
CREATE POLICY swarm_tenant_isolation ON swarm_agent_logs
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''));

-- High-performance optimization indexes
CREATE INDEX IF NOT EXISTS idx_clm_tenant ON clm_integrations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_zkp_tenant ON zkp_verification_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_swarm_tenant ON swarm_agent_logs(tenant_id);
