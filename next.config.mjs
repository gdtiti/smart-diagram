/** @type {import('next').NextConfig} */
const nextConfig = {
  // Docker standalone output
  output: 'standalone',

  // Enable webpack builder (required by project)
  webpack: (config, { isServer }) => {
    return config;
  },

  // Disable TypeScript type checking during builds
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
