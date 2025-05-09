import type { NextConfig } from "next";
import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
  webpack: (config: Configuration, { isServer }) => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve?.fallback,
          fs: false, // 파일 시스템 모듈을 완전히 무시
          stream: false,
          net: false,
          tls: false,
          zlib: false,
        },
      };
    }

    return config;
  },
};

export default nextConfig;
