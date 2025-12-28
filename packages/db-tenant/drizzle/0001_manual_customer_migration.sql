-- Manual migration to properly restructure CustomerT table

-- Step 1: Drop the foreign key constraint first
ALTER TABLE "JobT" DROP CONSTRAINT IF EXISTS "JobT_CustomerID_CustomerT_ID_fk";

-- Step 2: Add new columns to CustomerT
ALTER TABLE "CustomerT" ADD COLUMN IF NOT EXISTS "CustomerID" serial;
ALTER TABLE "CustomerT" ADD COLUMN IF NOT EXISTS "CustomerFirstName" text;
ALTER TABLE "CustomerT" ADD COLUMN IF NOT EXISTS "CustomerLastName" text;
ALTER TABLE "CustomerT" ADD COLUMN IF NOT EXISTS "CompanyName" text;
ALTER TABLE "CustomerT" ADD COLUMN IF NOT EXISTS "CompanyNumber" text;
ALTER TABLE "CustomerT" ADD COLUMN IF NOT EXISTS "FirstLineAddress" text;
ALTER TABLE "CustomerT" ADD COLUMN IF NOT EXISTS "SecondLineAddress" text;
ALTER TABLE "CustomerT" ADD COLUMN IF NOT EXISTS "PostCode" text;
ALTER TABLE "CustomerT" ADD COLUMN IF NOT EXISTS "Town" text;
ALTER TABLE "CustomerT" ADD COLUMN IF NOT EXISTS "EmailAddress" text;
ALTER TABLE "CustomerT" ADD COLUMN IF NOT EXISTS "WebSiteURL" text;
ALTER TABLE "CustomerT" ADD COLUMN IF NOT EXISTS "PhoneNr" text;
ALTER TABLE "CustomerT" ADD COLUMN IF NOT EXISTS "MobileNr" text;
ALTER TABLE "CustomerT" ADD COLUMN IF NOT EXISTS "CustomerSince" date;
ALTER TABLE "CustomerT" ADD COLUMN IF NOT EXISTS "Title" integer;
ALTER TABLE "CustomerT" ADD COLUMN IF NOT EXISTS "Notes" text;
ALTER TABLE "CustomerT" ADD COLUMN IF NOT EXISTS "AccountsEmailAddress" text;
ALTER TABLE "CustomerT" ADD COLUMN IF NOT EXISTS "InvoiceDueDate" integer;
ALTER TABLE "CustomerT" ADD COLUMN IF NOT EXISTS "CustomerSelected" boolean DEFAULT false;
ALTER TABLE "CustomerT" ADD COLUMN IF NOT EXISTS "CustomerBankRef" text;
ALTER TABLE "CustomerT" ADD COLUMN IF NOT EXISTS "GroupedUnder" text;

-- Step 3: Drop the old primary key and add the new one
ALTER TABLE "CustomerT" DROP CONSTRAINT IF EXISTS "CustomerT_pkey";
ALTER TABLE "CustomerT" ADD PRIMARY KEY ("CustomerID");

-- Step 4: Add foreign key constraints
DO $$ BEGIN
 ALTER TABLE "CustomerT" ADD CONSTRAINT "CustomerT_Title_HelperT_ID_fk" FOREIGN KEY ("Title") REFERENCES "HelperT"("ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "JobT" ADD CONSTRAINT "JobT_CustomerID_CustomerT_CustomerID_fk" FOREIGN KEY ("CustomerID") REFERENCES "CustomerT"("CustomerID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Step 5: Drop old columns
ALTER TABLE "CustomerT" DROP COLUMN IF EXISTS "ID";
ALTER TABLE "CustomerT" DROP COLUMN IF EXISTS "Name";
ALTER TABLE "CustomerT" DROP COLUMN IF EXISTS "Email";
ALTER TABLE "CustomerT" DROP COLUMN IF EXISTS "Phone";
ALTER TABLE "CustomerT" DROP COLUMN IF EXISTS "Address";
ALTER TABLE "CustomerT" DROP COLUMN IF EXISTS "CreatedAt";
