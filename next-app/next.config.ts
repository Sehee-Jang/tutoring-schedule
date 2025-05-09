import type { NextConfig } from "next";
import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
  webpack: (config: Configuration, { isServer }) => {
    // 서버 환경이 아닌 경우 Node.js 모듈 무효화
    if (!isServer) {
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        zlib: false,
        stream: false, // 여기서 stream을 false로 설정
      };
    }

    return config;
  },
};

export default nextConfig;
