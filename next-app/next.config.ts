// next.config.ts
import type { NextConfig } from "next";
import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
  webpack: (config: Configuration, { isServer }) => {
    if (!isServer) {
      if (config.resolve) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          stream: false,
          net: false,
          tls: false,
          zlib: false,
        };

        config.resolve.alias = {
          ...(config.resolve.alias || {}),
          "gzip-size": false, // gzip-size 모듈 완전히 무시
          "next/dist/compiled/gzip-size": false, // Next.js 내부 gzip-size 무시
        };
      }
    }

    return config;
  },
  experimental: {
    outputFileTracingIgnores: [
      "**/node_modules/next/dist/compiled/gzip-size/**",
      "**/node_modules/gzip-size/**",
    ],
  },
};

export default nextConfig;
