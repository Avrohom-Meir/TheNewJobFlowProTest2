import { NextRequest, NextResponse } from 'next/server'
import { masterDb } from '@jobflow/server'
import { tenants, tenantDatabases } from '@jobflow/db-master'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import fs from 'fs'
import path from 'path'
import { createApiClient } from '@neondatabase/api-client'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const subdomain = searchParams.get('subdomain')

  try {
    if (subdomain) {
      // Get specific tenant by subdomain
      const result = await masterDb
        .select()
        .from(tenants)
        .where(eq(tenants.subdomain, subdomain))
        .limit(1)
      return NextResponse.json(result[0] || null)
    } else {
      // Get all tenants
      const result = await masterDb.select().from(tenants)
      return NextResponse.json(result)
    }
  } catch (error) {
    console.error('Error fetching tenants:', error)
    return NextResponse.json({ error: 'Failed to fetch tenants' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, subdomain, ownerEmail, plan = 'free' } = await request.json()

    if (!name || !subdomain || !ownerEmail) {
      return NextResponse.json({ error: 'Missing required fields: name, subdomain, ownerEmail' }, { status: 400 })
    }

    // Check if subdomain is unique
    const existing = await masterDb
      .select()
      .from(tenants)
      .where(eq(tenants.subdomain, subdomain))
      .limit(1)

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Subdomain already exists' }, { status: 400 })
    }

    // Create new tenant record first
    const newTenant = {
      name,
      subdomain,
      ownerEmail,
      status: 'provisioning',
      plan,
      currentSchemaVersion: 1,
    }

    const result = await masterDb.insert(tenants).values(newTenant).returning()
    const tenant = result[0]

    // Provision tenant project/database using Neon API
    try {
      // In production, you'd create a separate Neon project per tenant
      // For demo purposes, we're using the same Neon database with schema isolation

      const neonApi = createApiClient({
        apiKey: process.env.NEON_API_KEY, // Would need to set this
      })

      // This would create a new project:
      // const projectResponse = await neonApi.createProject({
      //   project: {
      //     name: `${name} - ${subdomain}`,
      //     pg_version: 16,
      //     region_id: 'aws-us-east-1', // or appropriate region
      //   },
      // })
      // const project = projectResponse.data
      // const connectionDetails = await neonApi.getConnectionDetails({
      //   projectId: project.id,
      //   branchId: project.default_branch_id,
      // })
      // const dbUrl = connectionDetails.data.connection_string

      // For demo: simulate with schema-based approach
      const schemaName = `tenant_${subdomain}`
      const dbUrl = `postgresql://neondb_owner:npg_vCk0Ixu5gfrs@ep-plain-wildflower-aburknkd-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&schema=${schemaName}`

      // Create schema in the shared database
      const masterClient = postgres(process.env.MASTER_DB_URL!)
      await masterClient`CREATE SCHEMA IF NOT EXISTS ${masterClient.unsafe(schemaName)}`
      await masterClient.end()

      // Apply tenant schema to the new schema
      const tenantClient = postgres(dbUrl)
      const migrationPath = path.join(process.cwd(), '../../packages/db-tenant/drizzle/0000_colossal_blue_marvel.sql')
      const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')
      await tenantClient.unsafe(migrationSQL)
      await tenantClient.end()

      // Update tenant with dbUrl and status
      await masterDb
        .update(tenants)
        .set({ dbUrl, status: 'active' })
        .where(eq(tenants.id, tenant.id))

      // Insert into tenant_databases
      await masterDb.insert(tenantDatabases).values({
        tenantId: tenant.id,
        neonDbIdentifier: schemaName, // In production, this would be project.id
      })

    } catch (provisionError) {
      console.error('Provisioning error:', provisionError)
      // Update status to failed
      await masterDb
        .update(tenants)
        .set({ status: 'failed' })
        .where(eq(tenants.id, tenant.id))
      return NextResponse.json({ error: 'Failed to provision tenant database' }, { status: 500 })
    }

    // Fetch updated tenant
    const updatedTenant = await masterDb
      .select()
      .from(tenants)
      .where(eq(tenants.id, tenant.id))
      .limit(1)

    return NextResponse.json(updatedTenant[0], { status: 201 })
  } catch (error) {
    console.error('Error creating tenant:', error)
    return NextResponse.json({ error: 'Failed to create tenant' }, { status: 500 })
  }
}