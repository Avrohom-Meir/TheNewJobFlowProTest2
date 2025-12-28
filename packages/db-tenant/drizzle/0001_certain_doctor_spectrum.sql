ALTER TABLE "JobT" DROP CONSTRAINT "JobT_CustomerID_CustomerT_ID_fk";
--> statement-breakpoint
ALTER TABLE "CustomerT" ADD COLUMN "CustomerID" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "CustomerT" ADD COLUMN "CustomerFirstName" text;--> statement-breakpoint
ALTER TABLE "CustomerT" ADD COLUMN "CustomerLastName" text;--> statement-breakpoint
ALTER TABLE "CustomerT" ADD COLUMN "CompanyName" text;--> statement-breakpoint
ALTER TABLE "CustomerT" ADD COLUMN "CompanyNumber" text;--> statement-breakpoint
ALTER TABLE "CustomerT" ADD COLUMN "FirstLineAddress" text;--> statement-breakpoint
ALTER TABLE "CustomerT" ADD COLUMN "SecondLineAddress" text;--> statement-breakpoint
ALTER TABLE "CustomerT" ADD COLUMN "PostCode" text;--> statement-breakpoint
ALTER TABLE "CustomerT" ADD COLUMN "Town" text;--> statement-breakpoint
ALTER TABLE "CustomerT" ADD COLUMN "EmailAddress" text;--> statement-breakpoint
ALTER TABLE "CustomerT" ADD COLUMN "WebSiteURL" text;--> statement-breakpoint
ALTER TABLE "CustomerT" ADD COLUMN "PhoneNr" text;--> statement-breakpoint
ALTER TABLE "CustomerT" ADD COLUMN "MobileNr" text;--> statement-breakpoint
ALTER TABLE "CustomerT" ADD COLUMN "CustomerSince" date;--> statement-breakpoint
ALTER TABLE "CustomerT" ADD COLUMN "Title" integer;--> statement-breakpoint
ALTER TABLE "CustomerT" ADD COLUMN "Notes" text;--> statement-breakpoint
ALTER TABLE "CustomerT" ADD COLUMN "AccountsEmailAddress" text;--> statement-breakpoint
ALTER TABLE "CustomerT" ADD COLUMN "InvoiceDueDate" integer;--> statement-breakpoint
ALTER TABLE "CustomerT" ADD COLUMN "CustomerSelected" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "CustomerT" ADD COLUMN "CustomerBankRef" text;--> statement-breakpoint
ALTER TABLE "CustomerT" ADD COLUMN "GroupedUnder" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "CustomerT" ADD CONSTRAINT "CustomerT_Title_HelperT_ID_fk" FOREIGN KEY ("Title") REFERENCES "HelperT"("ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "JobT" ADD CONSTRAINT "JobT_CustomerID_CustomerT_CustomerID_fk" FOREIGN KEY ("CustomerID") REFERENCES "CustomerT"("CustomerID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "CustomerT" DROP COLUMN IF EXISTS "ID";--> statement-breakpoint
ALTER TABLE "CustomerT" DROP COLUMN IF EXISTS "Name";--> statement-breakpoint
ALTER TABLE "CustomerT" DROP COLUMN IF EXISTS "Email";--> statement-breakpoint
ALTER TABLE "CustomerT" DROP COLUMN IF EXISTS "Phone";--> statement-breakpoint
ALTER TABLE "CustomerT" DROP COLUMN IF EXISTS "Address";--> statement-breakpoint
ALTER TABLE "CustomerT" DROP COLUMN IF EXISTS "CreatedAt";