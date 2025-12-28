import { NextRequest, NextResponse } from 'next/server';
import { getTenantDbConnection } from '@jobflow/server';
import { sql } from 'drizzle-orm';

// POST /api/tenants/[id]/migrate - Manually add JobT table to existing tenant
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tenantId = parseInt(id);
    
    // Get tenant database connection
    const db = await getTenantDbConnection(tenantId);
    
    // SQL to create JobT table if it doesn't exist
    const createJobTableSQL = `
      CREATE TABLE IF NOT EXISTS "JobT" (
        "JobID" serial PRIMARY KEY,
        "CustomerID" integer REFERENCES "CustomerT"("CustomerID"),
        "JobTypeID" integer REFERENCES "HelperT"("ID"),
        "JobStatusID" integer REFERENCES "HelperT"("ID"),
        "Contactdate" date,
        "SiteAddress" text,
        "SitePostCode" text,
        "SiteCity" text,
        "SitePointOfContact" text,
        "PointOfContactNr" text,
        "BuildingTypeID" integer REFERENCES "HelperT"("ID"),
        "IsOccupied" boolean DEFAULT false,
        "OfficeNotes" text,
        "SurveyorNotes" text,
        "FitterNotes" text,
        "IsPaid" boolean DEFAULT false,
        "InvoiceNumber" text,
        "InvoiceSent" boolean DEFAULT false,
        "WorkStartedOn" date,
        "WorkCompletedOn" date,
        "InvoiceToOwenerAndVerwaltung" boolean DEFAULT false,
        "InvoiceAddress" text,
        "AddedTextOnInvoiceHeader" text,
        "InvoiceNumberPart" text,
        "TaxFreeJob" boolean DEFAULT false,
        "IsCreditInvoice" boolean DEFAULT false,
        "CreditInvoiceForJobID" integer REFERENCES "JobT"("JobID"),
        "JobOrderedBy" text,
        "TenantNotes" text,
        "SiteNotes" text,
        "SiteAccessInstructions" text,
        "JobSelected" boolean DEFAULT false,
        "AddUnderAddress" text
      );
    `;
    
    await db.execute(sql.raw(createJobTableSQL));
    
    return NextResponse.json({ 
      message: 'JobT table created successfully',
      tenantId 
    });
  } catch (error) {
    console.error('Error migrating tenant:', error instanceof Error ? error.message : error);
    return NextResponse.json({ 
      error: 'Failed to migrate tenant',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
