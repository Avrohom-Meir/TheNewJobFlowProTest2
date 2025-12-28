import postgres from 'postgres'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function applyMigration() {
  const dbUrl = process.env.MASTER_DB_URL
  
  if (!dbUrl) {
    console.error('MASTER_DB_URL environment variable not set')
    process.exit(1)
  }

  const sql = postgres(dbUrl)

  try {
    // Read the manual migration file
    const migrationPath = path.join(__dirname, '../drizzle/0001_manual_customer_migration.sql')
    const migrationSql = fs.readFileSync(migrationPath, 'utf-8')

    console.log('Applying migration to Neon database...')
    
    // Execute the entire migration as a single transaction
    await sql.begin(async (sql) => {
      // Split by semicolon and filter out comments and empty lines
      const statements = migrationSql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'))

      for (const statement of statements) {
        const trimmed = statement.trim()
        if (trimmed) {
          console.log(`Executing: ${trimmed.substring(0, 80)}...`)
          await sql.unsafe(trimmed)
        }
      }
    })

    console.log('Migration applied successfully!')
  } catch (error) {
    console.error('Error applying migration:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

applyMigration()
