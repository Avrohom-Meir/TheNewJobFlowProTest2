import { NextRequest, NextResponse } from 'next/server'
import { customerT } from '@jobflow/db-tenant/schema'
import { eq, ilike, or, and, sql, desc, asc } from 'drizzle-orm'

// GET /api/customers - List customers with search, sort, filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'customerId'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    // Get tenant ID from middleware (TODO: implement tenant detection)
    // For now, we'll use a placeholder
    const tenantId = request.headers.get('x-tenant-id')
    
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 400 })
    }

    // Get tenant database connection
    // TODO: Implement getTenantDb function
    // const db = await getTenantDb(tenantId)
    
    // For now, return mock data
    const mockCustomers = [
      {
        customerId: 1,
        customerFirstName: 'John',
        customerLastName: 'Doe',
        companyName: 'Acme Corp',
        emailAddress: 'john@acme.com',
        phoneNr: '555-0100',
        customerSince: '2024-01-15',
        customerSelected: false,
      }
    ]

    return NextResponse.json({
      customers: mockCustomers,
      total: 1,
      page,
      limit,
    })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}

// POST /api/customers - Create a new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const tenantId = request.headers.get('x-tenant-id')
    
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 400 })
    }

    // TODO: Validate body against CustomerT schema
    // TODO: Get tenant database and insert customer
    
    return NextResponse.json({
      message: 'Customer created successfully',
      customer: { ...body, customerId: 1 },
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 })
  }
}
