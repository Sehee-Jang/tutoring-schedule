import type { NextConfig } from "next";
import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
  webpack: (config: Configuration, { isServer }) => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve?.fallback,
          fs: false,
          stream: false,
          net: false,
          tls: false,
          zlib: false,
        },
        alias: {
          ...config.resolve?.alias,
          "gzip-size": false, // gzip-size 무시
        },
      };
    }

    return config;
  },
};

export default nextConfig;
