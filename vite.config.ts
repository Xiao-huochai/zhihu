import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import pxtorem from "postcss-pxtorem";
import babel from "vite-plugin-babel";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({
      babelConfig: {
        presets: [
          [
            "@babel/preset-env",
            {
              targets: {
                chrome: "49",
                ios: "10",
              },
            },
          ],
        ],
      },
    }),
  ],
  css: {
    postcss: {
      plugins: [
        //响应式插件布局设置
        pxtorem({
          rootValue: 75, // 基准值，通常设置为设计稿宽度的 1/10，例如 750 设计稿设 75
          propList: ["*"], // 需要转换的属性，* 表示所有属性
          selectorBlackList: [".ignore-"], // 忽略的选择器
          exclude: /node_modules/i, // 忽略 node_modules 文件
          // 其他配置...
        }),
      ],
    },
  },
  // 配置服务器（含跨域代理）
  server: {
    open: true, // 启动时自动打开浏览器（可选）
    port: 5173, // 前端本地服务端口（可选，默认 5173）
    // 核心：跨域代理配置
    proxy: {
      // 1. 基础代理示例（匹配以 /api 开头的请求）
      "/api": {
        target: "http://localhost:7100", // 后端接口的基础地址（替换为你的真实后端地址）
        changeOrigin: true, // 开启跨域（必须，Vite 会模拟请求的 Origin 为目标地址）
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // 重写路径（可选）
        // 示例：前端请求 /api/user → 代理后请求 http://localhost:8080/user
      },

      // 2. 多域名代理（可选，如有多个后端服务）
      "/admin": {
        target: "https://admin.example.com", // 另一个后端服务地址
        changeOrigin: true,
        secure: false, // 如果后端是 https 且证书不合法，需要设为 false（可选）
        // 无 rewrite：前端请求 /admin/login → 代理后请求 https://admin.example.com/admin/login
      },

      // 3. 匹配所有请求（慎用，适合全量代理）
      // '/': {
      //   target: 'http://192.168.1.100:9090',
      //   changeOrigin: true,
      // },
    },
  },
});
