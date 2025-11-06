import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    target: "es2022",
    rollupOptions: {
      treeshake: "recommended",
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (id.includes("react")) return "vendor-react";
          if (id.includes("firebase") || id.includes("@firebase"))
            return "vendor-firebase";
          if (id.includes("date-fns")) return "vendor-date";
          if (id.includes("@radix-ui")) return "vendor-radix";
          if (id.includes("lucide-react")) return "vendor-icons";

          // 기타 node_modules는 한데 모아 처리
          return "vendor";
        },
      },
    },
    // 경고 기준을 잠깐 높이고 싶으면 주석 해제
    // chunkSizeWarningLimit: 900,
  },
});
