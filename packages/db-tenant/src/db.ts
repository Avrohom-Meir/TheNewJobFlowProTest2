import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Cache for tenant database connections
const tenantDbCache = new Map<string, ReturnType<typeof drizzle>>()

export function getTenantDb(tenantDbUrl: string) {
  if (!tenantDbCache.has(tenantDbUrl)) {
    const client = postgres(tenantDbUrl)
    const db = drizzle(client, { schema })
    tenantDbCache.set(tenantDbUrl, db)
  }
  return tenantDbCache.get(tenantDbUrl)!
}

// For now, we'll use schema-per-tenant in the same database
// Each tenant will have their tables in a separate schema
export function getTenantDbBySchema(baseDbUrl: string, schemaName: string) {
  const modifiedUrl = `${baseDbUrl}?schema=${schemaName}`
  return getTenantDb(modifiedUrl)
}
