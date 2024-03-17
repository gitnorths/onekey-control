import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 8999,
    https: false,
    cors: true, // 允许跨域
    hmr: true, // 开启热更新
    // 设置反向代理，跨越
    proxy: {
      "/api": {
        target: "http://frankfu86.natapp1.cc",
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
