import { NextRequest, NextResponse } from 'next/server'
import { masterDb } from '@jobflow/server'
import { tenants, tenantDatabases } from '@jobflow/db-master'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import fs from 'fs'
import path from 'path'

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

    // Create new tenant
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

    // Provision tenant database
    try {
      const dbName = `tenant_${subdomain}`
      const dbUrl = `postgresql://postgres:password@localhost:5432/${dbName}`

      // Create database
      const masterClient = postgres(process.env.MASTER_DB_URL!)
      await masterClient`CREATE DATABASE ${masterClient.unsafe(dbName)}`
      await masterClient.end()

      // Apply tenant schema
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
        neonDbIdentifier: dbName,
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