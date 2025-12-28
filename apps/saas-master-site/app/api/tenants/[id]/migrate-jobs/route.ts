import { NextRequest, NextResponse } from 'next/server';
import { getTenantDbConnection } from '@jobflow/server';
import { sql } from 'drizzle-orm';

// POST /api/tenants/[id]/migrate-jobs - Add missing columns to JobT table
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tenantId = parseInt(id);
    
    const db = await getTenantDbConnection(tenantId);
    
    // Add all missing columns to JobT table
    const alterTableSQL = `
      -- Add extended job fields
      ALTER TABLE "JobT" ADD COLUMN IF NOT EXISTS "JobTypeID" integer;
      ALTER TABLE "JobT" ADD COLUMN IF NOT EXISTS "JobStatusID" integer;
      ALTER TABLE "JobT" ADD COLUMN IF NOT EXISTS "Contactdate" date;
      ALTER TABLE "JobT" ADD COLUMN IF NOT EXISTS "SiteAddress" text;
      ALTER TABLE "JobT" ADD COLUMN IF NOT EXISTS "SitePostCode" text;
      ALTER TABLE "JobT" ADD COLUMN IF NOT EXISTS "SiteCity" text;
      ALTER TABLE "JobT" ADD COLUMN IF NOT EXISTS "SitePointOfContact" text;
      ALTER TABLE "JobT" ADD COLUMN IF NOT EXISTS "PointOfContactNr" text;
      ALTER TABLE "JobT" ADD COLUMN IF NOT EXISTS "BuildingTypeID" integer;
      ALTER TABLE "JobT" ADD COLUMN IF NOT EXISTS "IsOccupied" boolean DEFAULT false;
      ALTER TABLE "JobT" ADD COLUMN IF NOT EXISTS "OfficeNotes" text;
      ALTER TABLE "JobT" ADD COLUMN IF NOT EXISTS "SurveyorNotes" text;
      ALTER TABLE "JobT" ADD COLUMN IF NOT EXISTS "FitterNotes" text;
      ALTER TABLE "JobT" ADD COLUMN IF NOT EXISTS "IsPaid" boolean DEFAULT false;
      ALTER TABLE "JobT" ADD COLUMN IF NOT EXISTS "InvoiceNumber" text;
      ALTER TABLE "JobT" ADD COLUMN IF NOT EXISTS "InvoiceSent" boolean DEFAULT false;
      ALTER TABLE "JobT" ADD COLUMN IF NOT EXISTS "WorkStartedOn" date;
      ALTER TABLE "JobT" ADD COLUMN IF NOT EXISTS "WorkCompletedOn" date;
      ALTER TABLE "JobT" ADD COLUMN IF NOT EXISTS "InvoiceToOwenerAndVerwaltung" boolean DEFAULT false;
      ALTER TABLE "JobT" ADD COLUMN IF NOT EXISTS "InvoiceAddress" text;
      ALTER TABLE "JobT" ADD COLUMN IF NOT EXISTS "AddedTextOnInvoiceHeader" text;
      ALTER TABLE "JobT" ADD COLUMN IF NOT EXISTS "InvoiceNumberPart" text;
      ALTER TABLE "JobT" ADD COLUMN IF NOT EXISTS "TaxFreeJob" boolean DEFAULT false;
      ALTER TABLE "JobT" ADD COLUMN IF NOT EXISTS "IsCreditInvoice" boolean DEFAULT false;
      ALTER TABLE "JobT" ADD COLUMN IF NOT EXISTS "CreditInvoiceForJobID" integer;
      ALTER TABLE "JobT" ADD COLUMN IF NOT EXISTS "JobOrderedBy" text;
      ALTER TABLE "JobT" ADD COLUMN IF NOT EXISTS "TenantNotes" text;
      ALTER TABLE "JobT" ADD COLUMN IF NOT EXISTS "SiteNotes" text;
      ALTER TABLE "JobT" ADD COLUMN IF NOT EXISTS "SiteAccessInstructions" text;
      ALTER TABLE "JobT" ADD COLUMN IF NOT EXISTS "JobSelected" boolean DEFAULT false;
      ALTER TABLE "JobT" ADD COLUMN IF NOT EXISTS "AddUnderAddress" text;
    `;
    
    await db.execute(sql.raw(alterTableSQL));
    
    return NextResponse.json({ 
      message: 'JobT table columns added successfully',
      tenantId 
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ 
      error: 'Failed to migrate JobT table',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
