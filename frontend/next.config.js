/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  allowedDevOrigins: ['3.81.143.236', 'localhost', '127.0.0.1'], // change to your IP in production
};

module.exports = nextConfig;
