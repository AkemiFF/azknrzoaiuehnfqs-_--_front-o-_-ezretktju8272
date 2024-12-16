// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // async rewrites() {
  //   return [
  //     {
  //       source: '/dashboard/:path*',
  //       destination: '/admin/:path*',
  //     },
  //   ];
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'http',
        hostname: '192.168.88.57',
      },

      {
        protocol: 'http',
        hostname: '34.122.163.41',
      },

      {
        protocol: 'https',
        hostname: 'admin-server.craft-aftrip.com',
      },
    ],
  },
};

export default nextConfig;
