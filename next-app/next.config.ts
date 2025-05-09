import type { NextConfig } from "next";
import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
  webpack: (config: Configuration, { isServer }) => {
    if (!isServer) {
      // config.resolve가 존재하는지 확인
      config.resolve = config.resolve || { fallback: {}, alias: {} };

      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        zlib: false,
        stream: false, // stream을 false로 설정
      };

      config.resolve.alias = {
        ...config.resolve.alias,
        stream: false, // stream alias도 false로 설정
      };
    }

    return config;
  },
};

export default nextConfig;
