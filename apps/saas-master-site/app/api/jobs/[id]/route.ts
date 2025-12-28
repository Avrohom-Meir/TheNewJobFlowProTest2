import { NextRequest, NextResponse } from 'next/server';
import { jobT } from '@jobflow/db-tenant/schema';
import { getTenantDbConnection } from '@jobflow/server';
import { eq } from 'drizzle-orm';

// GET /api/jobs/[id] - Get a single job
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

    if (id === 'new') {
      return NextResponse.json({ error: 'Job not created yet' }, { status: 400 });
    }

    const jobId = parseInt(id);
    if (!Number.isFinite(jobId)) {
      return NextResponse.json({ error: 'Invalid job id' }, { status: 400 });
    }
    const db = await getTenantDbConnection(parseInt(tenantId));
    
    const [job] = await db
      .select()
      .from(jobT)
      .where(eq(jobT.id, jobId))
      .limit(1);
    
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    console.log('Fetched job, keys:', Object.keys(job), 'jobId:', (job as any).jobId, 'JobID:', (job as any).JobID);

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error fetching job:', error instanceof Error ? error.message : error);
    return NextResponse.json({ 
      error: 'Failed to fetch job',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// PUT /api/jobs/[id] - Update a job
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const tenantId = request.headers.get('x-tenant-id');
    
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 400 });
    }

    if (id === 'new') {
      return NextResponse.json({ error: 'Cannot update a new (unsaved) job' }, { status: 400 });
    }

    const jobId = parseInt(id);
    if (!Number.isFinite(jobId)) {
      return NextResponse.json({ error: 'Invalid job id' }, { status: 400 });
    }
    const db = await getTenantDbConnection(parseInt(tenantId));
    
    const [updated] = await db
      .update(jobT)
      .set(body)
      .where(eq(jobT.id, jobId))
      .returning();
    
    if (!updated) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating job:', error instanceof Error ? error.message : error);
    return NextResponse.json({ 
      error: 'Failed to update job',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// DELETE /api/jobs/[id] - Delete a job
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tenantId = request.headers.get('x-tenant-id');
    
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 400 });
    }

    if (id === 'new') {
      return NextResponse.json({ error: 'Cannot delete a new (unsaved) job' }, { status: 400 });
    }

    const jobId = parseInt(id);
    if (!Number.isFinite(jobId)) {
      return NextResponse.json({ error: 'Invalid job id' }, { status: 400 });
    }
    const db = await getTenantDbConnection(parseInt(tenantId));
    
    const [deleted] = await db
      .delete(jobT)
      .where(eq(jobT.id, jobId))
      .returning();
    
    if (!deleted) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error instanceof Error ? error.message : error);
    return NextResponse.json({ 
      error: 'Failed to delete job',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
