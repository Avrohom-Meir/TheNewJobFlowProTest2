import postgres from 'postgres'

async function checkSchema() {
  const dbUrl = process.env.MASTER_DB_URL
  
  if (!dbUrl) {
    console.error('MASTER_DB_URL environment variable not set')
    process.exit(1)
  }

  const sql = postgres(dbUrl)

  try {
    // Check current schema of CustomerT
    const columns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'CustomerT'
      ORDER BY ordinal_position
    `
    
    console.log('Current CustomerT columns:')
    console.table(columns)
    
    // Check constraints
    const constraints = await sql`
      SELECT constraint_name, constraint_type
      FROM information_schema.table_constraints
      WHERE table_name = 'CustomerT'
    `
    
    console.log('\nCurrent CustomerT constraints:')
    console.table(constraints)

  } catch (error) {
    console.error('Error checking schema:', error)
  } finally {
    await sql.end()
  }
}

checkSchema()
