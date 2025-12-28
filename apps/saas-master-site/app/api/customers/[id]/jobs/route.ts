import { NextRequest, NextResponse } from 'next/server';
import { jobT } from '@jobflow/db-tenant/schema';
import { getTenantDbConnection } from '@jobflow/server';
import { eq } from 'drizzle-orm';

// GET /api/customers/[id]/jobs - Get all jobs for a customer
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tenantId = request.headers.get('x-tenant-id');
    
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 400 });
    }

    const customerId = parseInt(id);
    const db = await getTenantDbConnection(parseInt(tenantId));
    
    const jobs = await db
      .select()
      .from(jobT)
      .where(eq(jobT.customerId, customerId));
    
    console.log('Jobs fetched:', jobs.length, 'First job keys:', jobs[0] ? Object.keys(jobs[0]) : 'none');
    console.log('First job sample:', jobs[0]);
    
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching customer jobs:', error instanceof Error ? error.message : error);
    return NextResponse.json({ 
      error: 'Failed to fetch jobs',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
