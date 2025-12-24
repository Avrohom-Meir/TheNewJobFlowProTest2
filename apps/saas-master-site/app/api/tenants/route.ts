import { NextRequest, NextResponse } from 'next/server'

// Mock data for demonstration
let mockTenants = [
  {
    id: 1,
    name: 'Demo Tenant',
    subdomain: 'demo',
    dbUrl: 'postgresql://user:pass@localhost:5432/tenant_demo',
    ownerEmail: 'demo@example.com',
    status: 'active',
    plan: 'free',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    currentSchemaVersion: 1,
  },
]

export async function GET() {
  // Return mock tenants
  return NextResponse.json(mockTenants)
}

export async function POST(request: NextRequest) {
  try {
    const { name, subdomain, ownerEmail } = await request.json()

    if (!name || !subdomain || !ownerEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if subdomain is unique (mock check)
    const existing = mockTenants.find(t => t.subdomain === subdomain)
    if (existing) {
      return NextResponse.json({ error: 'Subdomain already exists' }, { status: 400 })
    }

    // Create mock tenant
    const newTenant = {
      id: mockTenants.length + 1,
      name,
      subdomain,
      dbUrl: `postgresql://user:pass@localhost:5432/tenant_${subdomain}`,
      ownerEmail,
      status: 'active',
      plan: 'free',
      createdAt: new Date(),
      updatedAt: new Date(),
      currentSchemaVersion: 1,
    }

    mockTenants.push(newTenant)

    return NextResponse.json(newTenant, { status: 201 })
  } catch (error) {
    console.error('Error creating tenant:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}