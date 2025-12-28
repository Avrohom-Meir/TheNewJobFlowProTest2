import { masterDb } from './db'
import { eq } from 'drizzle-orm'
import { tenants, tenantDatabases } from '@jobflow/db-master'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as tenantSchema from '@jobflow/db-tenant'

export async function getTenantBySubdomain(subdomain: string) {
  const result = await masterDb
    .select()
    .from(tenants)
    .where(eq(tenants.subdomain, subdomain))
    .limit(1)

  if (result.length === 0) return null

  return result[0]
}

export async function getTenantById(id: number) {
  const result = await masterDb
    .select()
    .from(tenants)
    .where(eq(tenants.id, id))
    .limit(1)

  if (result.length === 0) return null

  return result[0]
}

export async function getTenantDbConnection(tenantId: number) {
  const tenant = await getTenantById(tenantId)
  if (!tenant) throw new Error('Tenant not found')

  // Determine schema name for this tenant.
  // Prefer stored neonDbIdentifier in tenantDatabases; fallback to subdomain-based schema.
  let schemaName: string | null = null
  const mapping = await masterDb
    .select()
    .from(tenantDatabases)
    .where(eq(tenantDatabases.tenantId, tenantId))
    .limit(1)

  if (mapping.length > 0) {
    schemaName = mapping[0].neonDbIdentifier
  } else if (tenant.subdomain) {
    schemaName = `tenant_${tenant.subdomain}`
  } else {
    schemaName = `tenant_${tenantId}`
  }

  const baseDbUrl = tenant.dbUrl || process.env.MASTER_DB_URL!

  // Create a dedicated client, set search_path for the session, then wrap with drizzle.
  const client = postgres(baseDbUrl)
  if (schemaName) {
    // Restrict to tenant schema only to avoid falling back to public
    await client.unsafe(`SET search_path TO "${schemaName}"`)
  }
  const db = drizzle(client, { schema: tenantSchema })
  return db
}