import { pgTable, serial, text, timestamp, integer, jsonb } from 'drizzle-orm/pg-core'

export const tenants = pgTable('tenants', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  subdomain: text('subdomain').notNull().unique(),
  status: text('status').notNull(), // Provisioning/Active/Suspended
  createdAt: timestamp('created_at').defaultNow().notNull(),
  plan: text('plan').notNull(),
  currentSchemaVersion: integer('current_schema_version').default(1).notNull(),
})

export const tenantDatabases = pgTable('tenant_databases', {
  tenantId: integer('tenant_id').references(() => tenants.id).primaryKey(),
  neonDbIdentifier: text('neon_db_identifier').notNull(),
  connectionSecretRef: text('connection_secret_ref'), // or encrypted
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const subscriptions = pgTable('subscriptions', {
  tenantId: integer('tenant_id').references(() => tenants.id).primaryKey(),
  provider: text('provider').notNull(),
  plan: text('plan').notNull(),
  status: text('status').notNull(),
  renewalDate: timestamp('renewal_date'),
  providerIds: jsonb('provider_ids'), // json
})

export const masterUsers = pgTable('master_users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  hashedPassword: text('hashed_password'), // or external auth id
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastLoginAt: timestamp('last_login_at'),
})

export const userTenantRoles = pgTable('user_tenant_roles', {
  masterUserId: integer('master_user_id').references(() => masterUsers.id),
  tenantId: integer('tenant_id').references(() => tenants.id),
  role: text('role').notNull(), // OwnerAdmin, TenantAdmin, Sales, Worker, Finance
}, (table) => ({
  pk: [table.masterUserId, table.tenantId],
}))

export const provisioningJobs = pgTable('provisioning_jobs', {
  tenantId: integer('tenant_id').references(() => tenants.id).primaryKey(),
  stage: text('stage').notNull(),
  status: text('status').notNull(),
  error: text('error'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const migrationRuns = pgTable('migration_runs', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id),
  targetVersion: integer('target_version').notNull(),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  finishedAt: timestamp('finished_at'),
  status: text('status').notNull(),
  errorMessage: text('error_message'),
})

export const auditLog = pgTable('audit_log', {
  id: serial('id').primaryKey(),
  actor: text('actor').notNull(),
  action: text('action').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  tenantId: integer('tenant_id').references(() => tenants.id),
  metadata: jsonb('metadata'),
})