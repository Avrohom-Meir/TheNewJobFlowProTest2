// src/db.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as masterSchema from "@jobflow/db-master";
import * as tenantSchema from "@jobflow/db-tenant";
var masterClient = postgres(process.env.MASTER_DB_URL);
var masterDb = drizzle(masterClient, { schema: masterSchema });
function getTenantDb(tenantDbUrl) {
  const client = postgres(tenantDbUrl);
  return drizzle(client, { schema: tenantSchema });
}

// src/tenant.ts
import { eq } from "drizzle-orm";
import { tenants, tenantDatabases } from "@jobflow/db-master";
async function getTenantBySubdomain(subdomain) {
  const result = await masterDb.select().from(tenants).where(eq(tenants.subdomain, subdomain)).limit(1);
  if (result.length === 0)
    return null;
  const tenant = result[0];
  const dbResult = await masterDb.select().from(tenantDatabases).where(eq(tenantDatabases.tenantId, tenant.id)).limit(1);
  if (dbResult.length === 0)
    return null;
  return {
    ...tenant,
    dbUrl: dbResult[0].connectionSecretRef
    // assuming it's the url
  };
}
export {
  getTenantBySubdomain,
  getTenantDb,
  masterDb
};
//# sourceMappingURL=index.mjs.map