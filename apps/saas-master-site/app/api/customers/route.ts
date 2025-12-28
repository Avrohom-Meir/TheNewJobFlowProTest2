import { NextRequest, NextResponse } from 'next/server'
import { customerT } from '@jobflow/db-tenant/schema'
import { getTenantDbConnection } from '@jobflow/server'
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
    
    // Get tenant ID from middleware
    const tenantId = request.headers.get('x-tenant-id')
    
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 400 })
    }

    // Get tenant database connection
    const db = await getTenantDbConnection(parseInt(tenantId))
    
    // Build query
    let query = db.select().from(customerT)
    
    // Apply search filter
    if (search) {
      query = query.where(
        or(
          ilike(customerT.customerFirstName, `%${search}%`),
          ilike(customerT.customerLastName, `%${search}%`),
          ilike(customerT.companyName, `%${search}%`),
          ilike(customerT.emailAddress, `%${search}%`),
          ilike(customerT.phoneNr, `%${search}%`)
        )
      ) as any
    }
    
    // Apply sorting
    const sortColumn = (customerT as any)[sortBy] || customerT.customerId
    query = (sortOrder === 'asc' ? query.orderBy(asc(sortColumn)) : query.orderBy(desc(sortColumn))) as any
    
    // Apply pagination
    const offset = (page - 1) * limit
    query = query.limit(limit).offset(offset) as any
    
    const customers = await query
    
    // Get total count
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(customerT)

    return NextResponse.json({
      customers,
      total: Number(count),
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

    // Get tenant database connection
    const db = await getTenantDbConnection(parseInt(tenantId))
    
    // Insert customer
    const [customer] = await db.insert(customerT).values(body).returning()
    
    return NextResponse.json({
      message: 'Customer created successfully',
      customer,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 })
  }
}
