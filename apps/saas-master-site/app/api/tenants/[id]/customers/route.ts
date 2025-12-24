import { NextRequest, NextResponse } from 'next/server'

// Mock data for demonstration
const mockCustomers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    company: 'Acme Corp',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1234567891',
    company: 'Tech Solutions',
    createdAt: new Date('2024-01-20'),
  },
]

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const tenantId = parseInt(id)

    // Mock tenant lookup
    const mockTenants = [
      { id: 1, name: 'Demo Tenant', dbUrl: 'mock' },
      { id: 2, name: 'Test Tenant', dbUrl: 'mock' },
    ]
    const tenant = mockTenants.find(t => t.id === tenantId)

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    // Return mock customers for the tenant
    return NextResponse.json({
      tenant: tenant.name,
      customers: mockCustomers
    })
  } catch (error) {
    console.error('Error fetching tenant customers:', error)
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}