import type { NextConfig } from "next";
import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
  webpack: (config: Configuration, { isServer }) => {
    if (!isServer) {
      if (config.resolve) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false, // 파일 시스템 모듈을 완전히 무시
          stream: false, // 스트림 모듈 무시
          net: false, // 네트워크 모듈 무시
          tls: false, // TLS 모듈 무시
          zlib: false, // 압축 모듈 무시
          "gzip-size": false, // gzip-size 모듈 무시
        };
      }
    }
    return config;
  },
  experimental: {
    outputFileTracingIgnores: [
      "**/node_modules/next/dist/compiled/gzip-size/**",
    ],
  },
};

export default nextConfig;
