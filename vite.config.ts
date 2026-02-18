import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import pxtorem from "postcss-pxtorem";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
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
});
