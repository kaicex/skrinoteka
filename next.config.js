/** @type {import('next').NextConfig} */
const nextConfig = {
  // distDir: 'dist', // Закомментировано, значит используется стандартная папка .next
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
      },
    ],
  },
}

module.exports = nextConfig
