import postgres from 'postgres'

async function finalizeMigration() {
  const dbUrl = process.env.MASTER_DB_URL
  
  if (!dbUrl) {
    console.error('MASTER_DB_URL environment variable not set')
    process.exit(1)
  }

  const sql = postgres(dbUrl)

  try {
    console.log('Finalizing CustomerT migration...')
    
    // Step 1: Drop the foreign key from JobT (if it exists)
    try {
      await sql`ALTER TABLE "JobT" DROP CONSTRAINT IF EXISTS "JobT_CustomerID_CustomerT_ID_fk"`
      console.log('✓ Dropped old FK constraint from JobT')
    } catch (e) {
      console.log('FK constraint already dropped or doesn\'t exist')
    }
    
    // Step 2: Check and update primary key
    const [pkInfo] = await sql`
      SELECT a.attname
      FROM pg_index i
      JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
      WHERE i.indrelid = 'public."CustomerT"'::regclass AND i.indisprimary
    `
    
    if (pkInfo?.attname === 'ID') {
      console.log('Updating primary key from ID to CustomerID...')
      
      // Drop old primary key
      await sql`ALTER TABLE "CustomerT" DROP CONSTRAINT "CustomerT_pkey"`
      console.log('✓ Dropped old primary key')
      
      // Add new primary key
      await sql`ALTER TABLE "CustomerT" ADD PRIMARY KEY ("CustomerID")`
      console.log('✓ Added new primary key on CustomerID')
    } else {
      console.log('✓ Primary key already on CustomerID')
    }
    
    // Step 3: Add FK from JobT to CustomerT.CustomerID
    try {
      await sql`
        ALTER TABLE "JobT" 
        ADD CONSTRAINT "JobT_CustomerID_CustomerT_CustomerID_fk" 
        FOREIGN KEY ("CustomerID") 
        REFERENCES "CustomerT"("CustomerID") 
        ON DELETE no action ON UPDATE no action
      `
      console.log('✓ Added FK constraint from JobT to CustomerT.CustomerID')
    } catch (e: any) {
      if (e.code === '42710') {
        console.log('✓ FK constraint already exists')
      } else {
        throw e
      }
    }
    
    // Step 4: Drop old columns
    console.log('Dropping old columns...')
    await sql`ALTER TABLE "CustomerT" DROP COLUMN IF EXISTS "ID"`
    await sql`ALTER TABLE "CustomerT" DROP COLUMN IF EXISTS "Name"`
    await sql`ALTER TABLE "CustomerT" DROP COLUMN IF EXISTS "Email"`
    await sql`ALTER TABLE "CustomerT" DROP COLUMN IF EXISTS "Phone"`
    await sql`ALTER TABLE "CustomerT" DROP COLUMN IF EXISTS "Address"`
    await sql`ALTER TABLE "CustomerT" DROP COLUMN IF EXISTS "CreatedAt"`
    console.log('✓ Dropped old columns')
    
    console.log('\n✅ Migration completed successfully!')

  } catch (error) {
    console.error('Error applying migration:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

finalizeMigration()
