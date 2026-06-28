/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Serialize build workers to keep peak memory low when bundling the heavy
  // map engine (MapLibre). Helps constrained build environments.
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
};

export default nextConfig;
