import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TODO: check images config
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/215x215/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
