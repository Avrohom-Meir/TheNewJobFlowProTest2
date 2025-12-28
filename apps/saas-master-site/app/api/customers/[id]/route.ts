import { NextRequest, NextResponse } from 'next/server'
import { customerT } from '@jobflow/db-tenant/schema'
import { eq } from 'drizzle-orm'

// GET /api/customers/[id] - Get a single customer
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantId = request.headers.get('x-tenant-id')
    
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 400 })
    }

    const customerId = parseInt(params.id)
    
    // TODO: Get tenant database and fetch customer
    // const db = await getTenantDb(tenantId)
    // const customer = await db.select().from(customerT).where(eq(customerT.customerId, customerId)).limit(1)
    
    // Mock data for now
    const mockCustomer = {
      customerId,
      customerFirstName: 'John',
      customerLastName: 'Doe',
      companyName: 'Acme Corp',
      emailAddress: 'john@acme.com',
      phoneNr: '555-0100',
      customerSince: '2024-01-15',
      customerSelected: false,
    }

    return NextResponse.json(mockCustomer)
  } catch (error) {
    console.error('Error fetching customer:', error)
    return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 })
  }
}

// PUT /api/customers/[id] - Update a customer
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const tenantId = request.headers.get('x-tenant-id')
    
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 400 })
    }

    const customerId = parseInt(params.id)
    
    // TODO: Get tenant database and update customer
    // const db = await getTenantDb(tenantId)
    // const updated = await db.update(customerT).set(body).where(eq(customerT.customerId, customerId)).returning()

    return NextResponse.json({
      message: 'Customer updated successfully',
      customer: { ...body, customerId },
    })
  } catch (error) {
    console.error('Error updating customer:', error)
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 })
  }
}

// DELETE /api/customers/[id] - Delete a customer
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantId = request.headers.get('x-tenant-id')
    
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 400 })
    }

    const customerId = parseInt(params.id)
    
    // TODO: Get tenant database and delete customer
    // const db = await getTenantDb(tenantId)
    // await db.delete(customerT).where(eq(customerT.customerId, customerId))

    return NextResponse.json({
      message: 'Customer deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting customer:', error)
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 })
  }
}
