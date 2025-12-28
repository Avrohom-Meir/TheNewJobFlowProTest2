import postgres from 'postgres'

const sql = postgres('postgresql://neondb_owner:npg_vCk0Ixu5gfrs@ep-plain-wildflower-aburknkd-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require')

async function run() {
  try {
    // Test connection
    const result = await sql`SELECT 1`
    console.log('Connection successful:', result)

    // Apply schema
    const fs = await import('fs')
    const path = await import('path')
    const migrationPath = path.join(process.cwd(), '../db-master/drizzle/0000_clever_pepper_potts.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')
    await sql.unsafe(migrationSQL)
    console.log('Schema applied successfully')
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await sql.end()
  }
}

run()