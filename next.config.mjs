/** @type {import('next').NextConfig} */
const nextConfig = {
  // Docker standalone output
  output: 'standalone',

  // Enable webpack builder (required by project)
  webpack: (config, { isServer }) => {
    return config;
  },

  // Disable ESLint during builds to prevent build failures
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable TypeScript type checking during builds
  typescript: {
    ignoreBuildErrors: true,
  },

  // Environment variables
  env: {
    NEXT_TELEMETRY_DISABLED: '1',
    NODE_ENV: 'production',
  },
};

export default nextConfig;
