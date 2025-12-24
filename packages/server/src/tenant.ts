import { masterDb } from './db'
import { eq } from 'drizzle-orm'
import { tenants } from '@jobflow/db-master'

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