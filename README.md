# JobFlow SaaS

A production-grade multi-tenant SaaS web application for job management, built with Next.js, TypeScript, and Postgres.

## Architecture

This application follows a multi-tenant architecture with database-per-tenant isolation:

- **Master Database**: Control plane for tenants, subscriptions, users, and provisioning.
- **Tenant Databases**: Separate data plane for each tenant's operational data.
- **Three Front-ends**:
  - SaaS Master Site: Public site for selling subscriptions and tenant provisioning.
  - Tenant Admin App: Full JobFlow interface for office users.
  - Road App: Mobile-optimized app for field workers.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Next.js API routes, Drizzle ORM
- **Database**: Postgres (Neon)
- **Monorepo**: pnpm workspaces, Turbo

## Project Structure

```
apps/
  saas-master-site/     # Public SaaS site
  tenant-admin/         # Office admin app
  road-app/             # Field worker app
packages/
  shared/               # UI components, types, auth
  db-master/            # Master DB schema
  db-tenant/            # Tenant DB schema
  server/               # DB connectors, tenant resolution
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Postgres databases (Master and Tenant)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Avrohom-Meir/TheNewJobFlowProTest2.git
   cd TheNewJobFlowProTest2
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create `.env.local` in each app directory with:
   ```
   MASTER_DB_URL=postgresql://...
   TENANT_DB_URL=postgresql://...
   ```

4. Build the packages:
   ```bash
   pnpm build
   ```

### Running the Apps

- SaaS Master Site:
  ```bash
  pnpm dev --filter saas-master-site
  ```
  Visit: http://localhost:3000

- Tenant Admin (when implemented):
  ```bash
  pnpm dev --filter tenant-admin
  ```

- Road App (when implemented):
  ```bash
  pnpm dev --filter road-app
  ```

### Database Setup

1. Create master Postgres database
2. Create tenant Postgres databases
3. Run migrations:
   ```bash
   pnpm db:generate --filter db-master
   pnpm db:migrate --filter db-master
   pnpm db:generate --filter db-tenant
   pnpm db:migrate --filter db-tenant
   ```

## Features

### SaaS Master Site
- Tenant signup and provisioning
- Subscription management
- Owner admin dashboard

### Tenant Admin App (Planned)
- Customer management
- Job management with workflows
- Calendar and appointments
- Quotes, payments, expenses
- Bank import and matching
- Settings and translations

### Road App (Planned)
- Field worker login
- Today's appointments
- On-site notes and media upload

## Development

- Use `pnpm dev` for development
- Use `pnpm build` to build all packages
- Use `pnpm lint` for linting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary.
