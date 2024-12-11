/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.ctfassets.net', 'downloads.ctfassets.net'],
    unoptimized: true,
  },
  output: 'standalone',
}

module.exports = nextConfig
