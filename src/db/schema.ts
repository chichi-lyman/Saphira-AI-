import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

// Define the 'users' table.
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define the 'tasks' table mapped to Cloud SQL
export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull(), // associated user uid or creator
  title: text('title').notNull(),
  priority: text('priority').notNull(), // 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
  status: text('status').notNull().default('BACKLOG'), // 'BACKLOG', 'TODO', 'IN_PROGRESS', 'DONE'
  dependencies: text('dependencies'), // comma-separated or text representations of dependencies
  contextSummary: text('context_summary'),
  sourceChannel: text('source_channel').default('GOOGLE_CHAT_SYNCHRONIZED'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define the 'memory_episodes' table mapped to Cloud SQL
export const memoryEpisodes = pgTable('memory_episodes', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull(),
  interactionType: text('interaction_type').notNull(), // 'TEXT', 'VISION', 'AUDIO', 'CODE', 'CROSS_SILO'
  structuredContext: text('structured_context').notNull(),
  rawPayload: text('raw_payload'),
  timestamp: timestamp('timestamp').defaultNow(),
});

export const tenants = pgTable('tenants', {
  tenantId: text('tenant_id').primaryKey(),
  companyName: text('company_name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const userSessions = pgTable('user_sessions', {
  sessionId: text('session_id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  userEmail: text('user_email').notNull(),
  sessionToken: text('session_token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const corporateDocuments = pgTable('corporate_documents', {
  documentId: text('document_id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  fileName: text('file_name').notNull(),
  rawText: text('raw_text').notNull(),
  uploadedBy: text('uploaded_by').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const saphiraAuditLogs = pgTable('saphira_audit_logs', {
  logId: text('log_id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  documentId: text('document_id').notNull(),
  riskLevel: text('risk_level').notNull(),
  findingSummary: text('finding_summary').notNull(),
  flaggedTextPassage: text('flagged_text_passage'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const clmIntegrations = pgTable('clm_integrations', {
  integrationId: text('integration_id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  platformName: text('platform_name').notNull(),
  apiEndpointMasked: text('api_endpoint_masked').notNull(),
  webhookSecretHash: text('webhook_secret_hash').notNull(),
  isActive: boolean('is_active').default(true),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const zkpVerificationLogs = pgTable('zkp_verification_logs', {
  proofId: text('proof_id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  documentId: text('document_id'),
  verificationKeyHash: text('verification_key_hash').notNull(),
  publicInputs: jsonb('public_inputs').notNull(),
  proofPayload: jsonb('proof_payload').notNull(),
  isMathematicallyValid: boolean('is_mathematically_valid').notNull(),
  verifiedAt: timestamp('verified_at').defaultNow(),
});

export const swarmAgentLogs = pgTable('swarm_agent_logs', {
  executionId: text('execution_id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  parentDocumentId: text('parent_document_id'),
  assignedAgentProfile: text('assigned_agent_profile').notNull(),
  taskDescription: text('task_description').notNull(),
  executionStatus: text('execution_status').default('PENDING'),
  errorTraceback: text('error_traceback'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define relationships for the 'users' table.
export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
  memoryEpisodes: many(memoryEpisodes),
}));
