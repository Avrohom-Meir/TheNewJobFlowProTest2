import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as masterSchema from '@jobflow/db-master'
import * as tenantSchema from '@jobflow/db-tenant'

const masterClient = postgres(process.env.MASTER_DB_URL!)
export const masterDb = drizzle(masterClient, { schema: masterSchema })

export function getTenantDb(tenantDbUrl: string) {
  const client = postgres(tenantDbUrl)
  return drizzle(client, { schema: tenantSchema })
}