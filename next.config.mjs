/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('_http_common');
    }
    return config;
  },
};

export default nextConfig;
