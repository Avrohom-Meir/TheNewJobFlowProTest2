import { NextRequest, NextResponse } from 'next/server';
import { jobT } from '@jobflow/db-tenant/schema';
import { getTenantDbConnection } from '@jobflow/server';

// POST /api/jobs - Create a new job
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const tenantId = request.headers.get('x-tenant-id');
    
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 400 });
    }

    if (!body.customerId) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }

    const db = await getTenantDbConnection(parseInt(tenantId));
    
    const [newJob] = await db
      .insert(jobT)
      .values(body)
      .returning();
    
    console.log('Created job, keys:', Object.keys(newJob), 'jobId:', (newJob as any).jobId, 'JobID:', (newJob as any).JobID);
    
    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error instanceof Error ? error.message : error);
    return NextResponse.json({ 
      error: 'Failed to create job',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
