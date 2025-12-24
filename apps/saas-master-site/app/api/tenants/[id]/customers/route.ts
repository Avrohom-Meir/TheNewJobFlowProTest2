import { NextRequest, NextResponse } from 'next/server'
import { getTenantById } from '@jobflow/server'
import { getTenantDb } from '@jobflow/server'
import { customers } from '@jobflow/db-tenant/schema'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantId = parseInt(params.id)
    const tenant = await getTenantById(tenantId)

    if (!tenant || !tenant.dbUrl) {
      return NextResponse.json({ error: 'Tenant not found or not provisioned' }, { status: 404 })
    }

    const tenantDb = getTenantDb(tenant.dbUrl)
    const tenantCustomers = await tenantDb.select().from(customers)

    return NextResponse.json({
      tenant: tenant.name,
      customers: tenantCustomers
    })
  } catch (error) {
    console.error('Error fetching tenant customers:', error)
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}