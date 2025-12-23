/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  transpilePackages: ['@jobflow/shared', '@jobflow/server'],
}

module.exports = nextConfig