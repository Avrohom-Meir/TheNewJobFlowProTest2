CREATE TABLE IF NOT EXISTS "ActiveJobT" (
	"ID" serial PRIMARY KEY NOT NULL,
	"JobID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "AppointmentColourT" (
	"ID" serial PRIMARY KEY NOT NULL,
	"TypeID" integer NOT NULL,
	"Colour" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "AppointmentT" (
	"ID" serial PRIMARY KEY NOT NULL,
	"JobID" integer,
	"TypeID" integer,
	"Date" date NOT NULL,
	"Time" time,
	"Notes" text,
	"Confirmed" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "CustomerT" (
	"ID" serial PRIMARY KEY NOT NULL,
	"Name" text NOT NULL,
	"Email" text,
	"Phone" text,
	"Address" text,
	"CreatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "DevTranslationT" (
	"ID" serial PRIMARY KEY NOT NULL,
	"Key" text NOT NULL,
	"Value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ExpenseT" (
	"ID" serial PRIMARY KEY NOT NULL,
	"JobID" integer,
	"Description" text,
	"Amount" numeric NOT NULL,
	"Receipt" text,
	"Date" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "HelperT" (
	"ID" serial PRIMARY KEY NOT NULL,
	"TypeID" integer NOT NULL,
	"Name" text NOT NULL,
	"ExtraFields" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "JobDetailT" (
	"ID" serial PRIMARY KEY NOT NULL,
	"JobID" integer NOT NULL,
	"Description" text,
	"Quantity" numeric,
	"Price" numeric
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "JobLableT" (
	"ID" serial PRIMARY KEY NOT NULL,
	"JobID" integer NOT NULL,
	"Label" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "JobT" (
	"ID" serial PRIMARY KEY NOT NULL,
	"CustomerID" integer,
	"StatusID" integer,
	"TypeID" integer,
	"Description" text,
	"CreatedAt" timestamp DEFAULT now() NOT NULL,
	"UpdatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "LetterT" (
	"ID" serial PRIMARY KEY NOT NULL,
	"TypeID" integer,
	"Content" text,
	"Placeholders" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "MaintenanceT" (
	"ID" serial PRIMARY KEY NOT NULL,
	"JobID" integer,
	"Issue" text NOT NULL,
	"Resolved" boolean DEFAULT false,
	"ResolvedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "OnSiteNoteT" (
	"ID" serial PRIMARY KEY NOT NULL,
	"JobID" integer NOT NULL,
	"Note" text,
	"Media" jsonb,
	"CreatedAt" timestamp DEFAULT now() NOT NULL,
	"CreatedBy" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PaymentT" (
	"ID" serial PRIMARY KEY NOT NULL,
	"JobID" integer,
	"Amount" numeric NOT NULL,
	"MethodID" integer,
	"Date" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "QuoteT" (
	"ID" serial PRIMARY KEY NOT NULL,
	"JobID" integer NOT NULL,
	"Total" numeric,
	"Status" text DEFAULT 'Draft',
	"CreatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SettingHelperT" (
	"ID" serial PRIMARY KEY NOT NULL,
	"SettingID" integer NOT NULL,
	"Name" text NOT NULL,
	"Value" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SettingT" (
	"ID" serial PRIMARY KEY NOT NULL,
	"Key" text NOT NULL,
	"Value" text,
	"Description" text,
	CONSTRAINT "SettingT_Key_unique" UNIQUE("Key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "StatusHistoryT" (
	"ID" serial PRIMARY KEY NOT NULL,
	"JobID" integer NOT NULL,
	"OldStatusID" integer,
	"NewStatusID" integer NOT NULL,
	"ChangedAt" timestamp DEFAULT now() NOT NULL,
	"ChangedBy" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TransactionImportT" (
	"ID" serial PRIMARY KEY NOT NULL,
	"Date" date NOT NULL,
	"Description" text,
	"Amount" numeric NOT NULL,
	"MatchedJobID" integer,
	"Status" text DEFAULT 'Unmatched'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TranslationT" (
	"ID" serial PRIMARY KEY NOT NULL,
	"Key" text NOT NULL,
	"Value" text NOT NULL,
	"Language" text DEFAULT 'en'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TrustedDomainT" (
	"ID" serial PRIMARY KEY NOT NULL,
	"Domain" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TypeT" (
	"ID" serial PRIMARY KEY NOT NULL,
	"Name" text NOT NULL,
	"Description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UpdateT" (
	"ID" serial PRIMARY KEY NOT NULL,
	"Version" text NOT NULL,
	"Description" text,
	"AppliedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ActiveJobT" ADD CONSTRAINT "ActiveJobT_JobID_JobT_ID_fk" FOREIGN KEY ("JobID") REFERENCES "JobT"("ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "AppointmentColourT" ADD CONSTRAINT "AppointmentColourT_TypeID_HelperT_ID_fk" FOREIGN KEY ("TypeID") REFERENCES "HelperT"("ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "AppointmentT" ADD CONSTRAINT "AppointmentT_JobID_JobT_ID_fk" FOREIGN KEY ("JobID") REFERENCES "JobT"("ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "AppointmentT" ADD CONSTRAINT "AppointmentT_TypeID_HelperT_ID_fk" FOREIGN KEY ("TypeID") REFERENCES "HelperT"("ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ExpenseT" ADD CONSTRAINT "ExpenseT_JobID_JobT_ID_fk" FOREIGN KEY ("JobID") REFERENCES "JobT"("ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "HelperT" ADD CONSTRAINT "HelperT_TypeID_TypeT_ID_fk" FOREIGN KEY ("TypeID") REFERENCES "TypeT"("ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "JobDetailT" ADD CONSTRAINT "JobDetailT_JobID_JobT_ID_fk" FOREIGN KEY ("JobID") REFERENCES "JobT"("ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "JobLableT" ADD CONSTRAINT "JobLableT_JobID_JobT_ID_fk" FOREIGN KEY ("JobID") REFERENCES "JobT"("ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "JobT" ADD CONSTRAINT "JobT_CustomerID_CustomerT_ID_fk" FOREIGN KEY ("CustomerID") REFERENCES "CustomerT"("ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "JobT" ADD CONSTRAINT "JobT_StatusID_HelperT_ID_fk" FOREIGN KEY ("StatusID") REFERENCES "HelperT"("ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "JobT" ADD CONSTRAINT "JobT_TypeID_HelperT_ID_fk" FOREIGN KEY ("TypeID") REFERENCES "HelperT"("ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "LetterT" ADD CONSTRAINT "LetterT_TypeID_TypeT_ID_fk" FOREIGN KEY ("TypeID") REFERENCES "TypeT"("ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "MaintenanceT" ADD CONSTRAINT "MaintenanceT_JobID_JobT_ID_fk" FOREIGN KEY ("JobID") REFERENCES "JobT"("ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "OnSiteNoteT" ADD CONSTRAINT "OnSiteNoteT_JobID_JobT_ID_fk" FOREIGN KEY ("JobID") REFERENCES "JobT"("ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PaymentT" ADD CONSTRAINT "PaymentT_JobID_JobT_ID_fk" FOREIGN KEY ("JobID") REFERENCES "JobT"("ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PaymentT" ADD CONSTRAINT "PaymentT_MethodID_HelperT_ID_fk" FOREIGN KEY ("MethodID") REFERENCES "HelperT"("ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "QuoteT" ADD CONSTRAINT "QuoteT_JobID_JobT_ID_fk" FOREIGN KEY ("JobID") REFERENCES "JobT"("ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SettingHelperT" ADD CONSTRAINT "SettingHelperT_SettingID_SettingT_ID_fk" FOREIGN KEY ("SettingID") REFERENCES "SettingT"("ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "StatusHistoryT" ADD CONSTRAINT "StatusHistoryT_JobID_JobT_ID_fk" FOREIGN KEY ("JobID") REFERENCES "JobT"("ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "StatusHistoryT" ADD CONSTRAINT "StatusHistoryT_OldStatusID_HelperT_ID_fk" FOREIGN KEY ("OldStatusID") REFERENCES "HelperT"("ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "StatusHistoryT" ADD CONSTRAINT "StatusHistoryT_NewStatusID_HelperT_ID_fk" FOREIGN KEY ("NewStatusID") REFERENCES "HelperT"("ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TransactionImportT" ADD CONSTRAINT "TransactionImportT_MatchedJobID_JobT_ID_fk" FOREIGN KEY ("MatchedJobID") REFERENCES "JobT"("ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
