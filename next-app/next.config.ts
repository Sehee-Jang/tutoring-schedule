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
          net: false,
          tls: false,
          zlib: false,
          stream: require.resolve("stream-browserify"),
        },
        alias: {
          ...config.resolve?.alias,
          stream: require.resolve("stream-browserify"),
        },
      };
    }

    return config;
  },
};

export default nextConfig;
