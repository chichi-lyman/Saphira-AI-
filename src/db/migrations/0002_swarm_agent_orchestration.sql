-- Extension Layer: Initialize the UUID extension to generate secure keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tenants Table: Core tracking of distinct corporate accounts or customer brands
CREATE TABLE IF NOT EXISTS tenants (
    tenant_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Sessions Table: Session tracking linked directly to the tenants table
CREATE TABLE IF NOT EXISTS user_sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    token_string TEXT UNIQUE NOT NULL,
    account_email VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Corporate Documents Table: Multi-tenant file ingestion schema
CREATE TABLE IF NOT EXISTS corporate_documents (
    document_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    raw_file_text TEXT,
    brand_metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- External CLM Integrations Table: Mapping platform identifiers
CREATE TABLE IF NOT EXISTS clm_integrations (
    integration_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    platform_name VARCHAR(50) NOT NULL, -- 'Ironclad', 'DocuSign CLM', 'Clio', 'Filevine'
    masked_access_endpoint TEXT NOT NULL,
    hashed_webhook_key TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Zero-Knowledge Proof Logs Table: Client-side cryptographic validations
CREATE TABLE IF NOT EXISTS zkp_proof_logs (
    proof_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    document_id UUID REFERENCES corporate_documents(document_id) ON DELETE CASCADE,
    public_input_hash TEXT NOT NULL,
    proof_json_array JSONB NOT NULL,
    verification_state BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Swarm Agent Logs Table: Extended audit trail for background agent tasks
CREATE TABLE IF NOT EXISTS swarm_agent_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    agent_name VARCHAR(100) NOT NULL,
    step_description TEXT NOT NULL,
    execution_state VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Executing', 'Success', 'Failed'
    error_traceback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_swarm_agent_names CHECK (
        agent_name IN (
            'Agent Zero', 
            'Aura', 
            'SecOps', 
            'CodingAgent', 
            'antigravity_preview', 
            'ai_talk_radio', 
            'customer_support', 
            'data_analyst', 
            'document_processor', 
            'repo_maintainer'
        )
    )
);

-- Row-Level Security Activation: Force constraints across tracking tables
ALTER TABLE corporate_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE clm_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE zkp_proof_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE swarm_agent_logs ENABLE ROW LEVEL SECURITY;

-- Tenant Partition Isolation Policies: Automatic filtration via app context variable
CREATE POLICY tenant_isolation_policy ON corporate_documents 
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY tenant_isolation_policy ON clm_integrations 
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY tenant_isolation_policy ON zkp_proof_logs 
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY tenant_isolation_policy ON swarm_agent_logs 
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

-- Performance Search Indexing: Optimize data retrieval under heavy enterprise loads
CREATE INDEX IF NOT EXISTS idx_documents_tenant ON corporate_documents(tenant_id);
CREATE INDEX IF NOT EXISTS idx_clm_tenant ON clm_integrations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_zkp_tenant ON zkp_proof_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_swarm_tenant ON swarm_agent_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_swarm_agent_name_status ON swarm_agent_logs(agent_name, execution_state);
