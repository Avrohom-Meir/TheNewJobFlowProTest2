/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  transpilePackages: ['@jobflow/shared', '@jobflow/server'],
}

export default nextConfig