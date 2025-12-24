import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const client = postgres(process.env.MASTER_DB_URL!)
export const masterDb = drizzle(client, { schema })