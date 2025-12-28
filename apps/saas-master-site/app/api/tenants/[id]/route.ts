import { NextRequest, NextResponse } from 'next/server'
import { masterDb } from '@jobflow/server'
import { tenants } from '@jobflow/db-master'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantId = parseInt(params.id)
    const { status } = await request.json()

    if (!status) {
      return NextResponse.json({ error: 'Status required' }, { status: 400 })
    }

    await masterDb
      .update(tenants)
      .set({ status })
      .where(eq(tenants.id, tenantId))

    return NextResponse.json({ message: 'Tenant updated' })
  } catch (error) {
    console.error('Error updating tenant:', error)
    return NextResponse.json({ error: 'Failed to update tenant' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantId = parseInt(params.id)

    // Get tenant info
    const tenantResult = await masterDb
      .select()
      .from(tenants)
      .where(eq(tenants.id, tenantId))
      .limit(1)

    if (tenantResult.length === 0) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    const tenant = tenantResult[0]

    // Drop database if exists
    if (tenant.dbUrl) {
      try {
        const masterClient = postgres(process.env.MASTER_DB_URL!)
        const dbName = tenant.dbUrl.split('/').pop()
        await masterClient`DROP DATABASE IF EXISTS ${masterClient.unsafe(dbName!)} WITH (FORCE)`
        await masterClient.end()
      } catch (dbError) {
        console.error('Error dropping database:', dbError)
        // Continue with deletion
      }
    }

    // Delete from tenant_databases and tenants
    await masterDb.delete(tenants).where(eq(tenants.id, tenantId))

    return NextResponse.json({ message: 'Tenant deleted' })
  } catch (error) {
    console.error('Error deleting tenant:', error)
    return NextResponse.json({ error: 'Failed to delete tenant' }, { status: 500 })
  }
}