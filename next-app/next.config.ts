import type { NextConfig } from "next";
import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
  webpack: (config: Configuration, { isServer }) => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          fs: false,
          zlib: false,
          net: false,
          tls: false,
          stream: false,
          "gzip-size": false,
        },
        alias: {
          "gzip-size": false,
        },
      };
    }

    return config;
  },
};

export default nextConfig;
