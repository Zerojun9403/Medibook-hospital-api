/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://54.252.47.101:8080/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
