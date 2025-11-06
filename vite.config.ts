import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// import svgr from "@svgr/rollup"; // SVG를 컴포넌트로 쓰려면 주석 해제

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 3000, // 원하는 포트
  },
});
