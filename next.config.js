/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '', // No port needed
        pathname: '/v0/b/**.appspot.com/o/**', 
      }
    ]
  }
}

module.exports = nextConfig
