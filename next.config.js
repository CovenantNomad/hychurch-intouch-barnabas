/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/api',
        destination: `https://hychurch-dev.duckdns.org:3000/graphql`,
      },
    ]
  },
}

module.exports = nextConfig
