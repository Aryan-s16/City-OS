/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // ESLint v9 + Next 14 incompatibility; lint via CI separately
  },
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
};

export default nextConfig;
