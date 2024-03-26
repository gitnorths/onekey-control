import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import postcsspxtoviewport from "postcss-px-to-viewport";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
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
  css: {
    // preprocessorOptions: {
    //   scss: {
    //     additionalData: "@import '@/assets/styles/elementPlusDark.scss';",
    //   },
    // },
    postcss: {
      plugins: [
        postcsspxtoviewport({
          unitToConvert: "px", // 要转化的单位
          viewportWidth: 1920, // UI设计稿的大小
          unitPrecision: 6, // 转换后的精度
          viewportUnit: "vw", // 转换后的单位
          fontViewportUnit: "vw", // 字体转换后的单位
          propList: ["*"], // 能转换的属性，*表示所有属性，!border表示border不转
          selectorBlackList: ["ignore-"], // 指定不转换为视窗单位的类名，
          minPixelValue: 1, // 最小转换的值，小于等于1不转
          mediaQuery: false, // 是否在媒体查询的css代码中也进行转换，默认false
          replace: true, // 是否转换后直接更换属性值
          exclude: [], // 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
          include: [], // 包含那些文件或者特定文件
          landscape: false, // 是否处理横屏情况
        }),
      ],
    },
  },
});
