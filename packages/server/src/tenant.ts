import { masterDb } from './db'
import { eq } from 'drizzle-orm'
import { tenants, tenantDatabases } from '@jobflow/db-master'

export async function getTenantBySubdomain(subdomain: string) {
  const result = await masterDb
    .select()
    .from(tenants)
    .where(eq(tenants.subdomain, subdomain))
    .limit(1)

  if (result.length === 0) return null

  const tenant = result[0]

  const dbResult = await masterDb
    .select()
    .from(tenantDatabases)
    .where(eq(tenantDatabases.tenantId, tenant.id))
    .limit(1)

  if (dbResult.length === 0) return null

  return {
    ...tenant,
    dbUrl: dbResult[0].connectionSecretRef, // assuming it's the url
  }
}