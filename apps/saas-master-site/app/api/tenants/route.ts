import { NextRequest, NextResponse } from 'next/server'
import { db } from '@jobflow/db-master'
import { tenants } from '@jobflow/db-master/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const allTenants = await db.select().from(tenants)
    return NextResponse.json(allTenants)
  } catch (error) {
    console.error('Error fetching tenants:', error)
    return NextResponse.json({ error: 'Failed to fetch tenants' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, subdomain, ownerEmail } = body

    if (!name || !subdomain || !ownerEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if subdomain is unique
    const existing = await db.select().from(tenants).where(eq(tenants.subdomain, subdomain))
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Subdomain already exists' }, { status: 400 })
    }

    // For now, use a placeholder DB URL - in production, this would create a new database
    const tenantDbUrl = `postgresql://user:pass@localhost:5432/tenant_${subdomain}`

    const newTenant = await db.insert(tenants).values({
      name,
      subdomain,
      dbUrl: tenantDbUrl,
      ownerEmail,
      status: 'active',
      createdAt: new Date(),
    }).returning()

    return NextResponse.json(newTenant[0])
  } catch (error) {
    console.error('Error creating tenant:', error)
    return NextResponse.json({ error: 'Failed to create tenant' }, { status: 500 })
  }
}