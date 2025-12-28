import { masterDb } from './db'
import { eq } from 'drizzle-orm'
import { tenants } from '@jobflow/db-master'
import { getTenantDb } from '@jobflow/db-tenant'

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
  
  // If tenant has a specific dbUrl, use it
  if (tenant.dbUrl) {
    return getTenantDb(tenant.dbUrl)
  }
  
  // Otherwise, use schema-per-tenant approach with master DB
  const baseDbUrl = process.env.MASTER_DB_URL!
  const schemaName = `tenant_${tenantId}`
  return getTenantDb(`${baseDbUrl}?options=-c search_path%3D${schemaName}`)
}