/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone", // Keeps production builds minimal and lightweight
  
  // Required structure for Next.js 14.2.5
  experimental: {
    allowedDevOrigins: [
      'localhost', 
      '127.0.0.1', 
      '3.88.6.231', 
    ], 
  },
};

module.exports = nextConfig;
