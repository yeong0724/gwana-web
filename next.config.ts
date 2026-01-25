import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.toss.im',
      },
      {
        protocol: 'https',
        hostname: 'gwana-images.s3.ap-northeast-2.amazonaws.com',
      },
    ],
  },
  async rewrites() {
    return [];
  },
};

export default nextConfig;
