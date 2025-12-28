import postgres from 'postgres'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function applyMasterSchema() {
  const dbUrl = process.env.MASTER_DB_URL
  
  if (!dbUrl) {
    console.error('MASTER_DB_URL environment variable not set')
    process.exit(1)
  }

  const sql = postgres(dbUrl)

  try {
    const migrationPath = path.join(__dirname, '../drizzle/0000_clever_pepper_potts.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')
    console.log('Applying master DB schema...')
    await sql.unsafe(migrationSQL)
    console.log('✅ Master DB schema applied successfully!')
  } catch (error: any) {
    if (error.code === '42P07') {
      console.log('✅ Master DB schema already exists')
    } else {
      console.error('Error applying schema:', error)
      process.exit(1)
    }
  } finally {
    await sql.end()
  }
}

applyMasterSchema()
