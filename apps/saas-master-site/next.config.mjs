/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  transpilePackages: ['@jobflow/shared', '@jobflow/server', '@jobflow/db-master', '@jobflow/db-tenant'],
}

export default nextConfig