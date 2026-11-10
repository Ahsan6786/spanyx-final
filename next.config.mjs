import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  outputFileTracingRoot: __dirname,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Prevent macOS APFS race conditions with Webpack packfile cache
      config.watchOptions = {
        aggregateTimeout: 200,
        poll: false,
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        // Cache immutable static build assets indefinitely
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache static images and icons in public/ root and subfolders
        source: '/:file*\\.(webp|avif|png|jpg|jpeg|svg|ico|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=2592000',
          },
        ],
      },
      {
        // Cache static video assets in root and subfolders
        source: '/:file*\\.(mp4|webm)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=5184000',
          },
        ],
      },
      {
        source: '/(span|partners|industries|team)/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=2592000',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
