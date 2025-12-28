import { NextRequest, NextResponse } from 'next/server'
import { customerT } from '@jobflow/db-tenant/schema'
import { getTenantDbConnection } from '@jobflow/server'
import { eq } from 'drizzle-orm'

// GET /api/customers/[id] - Get a single customer
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const tenantId = request.headers.get('x-tenant-id')
    
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 400 })
    }

    const customerId = parseInt(id)
    
    // Get tenant database connection
    const db = await getTenantDbConnection(parseInt(tenantId))
    
    const [customer] = await db
      .select()
      .from(customerT)
      .where(eq(customerT.customerId, customerId))
      .limit(1)
    
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    return NextResponse.json(customer)
  } catch (error) {
    console.error('Error fetching customer:', error)
    return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 })
  }
}

// PUT /api/customers/[id] - Update a customer
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const tenantId = request.headers.get('x-tenant-id')
    
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 400 })
    }

    const customerId = parseInt(id)
    
    // Get tenant database connection
    const db = await getTenantDbConnection(parseInt(tenantId))
    
    const [updated] = await db
      .update(customerT)
      .set(body)
      .where(eq(customerT.customerId, customerId))
      .returning()
    
    if (!updated) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'Customer updated successfully',
      customer: updated,
    })
  } catch (error) {
    console.error('Error updating customer:', error)
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 })
  }
}

// DELETE /api/customers/[id] - Delete a customer
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const tenantId = request.headers.get('x-tenant-id')
    
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 400 })
    }

    const customerId = parseInt(id)
    
    // Get tenant database connection
    const db = await getTenantDbConnection(parseInt(tenantId))
    
    const [deleted] = await db
      .delete(customerT)
      .where(eq(customerT.customerId, customerId))
      .returning()
    
    if (!deleted) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'Customer deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting customer:', error)
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 })
  }
}
