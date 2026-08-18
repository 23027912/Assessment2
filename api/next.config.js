/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone", // Keeps production builds minimal and lightweight
  allowedDevOrigins: ['3.90.37.120', 'localhost', '127.0.0.1'], // change to your IP in production
};

module.exports = nextConfig;
