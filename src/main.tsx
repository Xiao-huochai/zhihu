import "lib-flexible";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./assets/reset.min.css";
/* 处理移动端最大宽度和根字体大小（TS 版本） */
(function () {
  // 定义核心处理函数，添加完整的 TS 类型
  const handleMax: () => void = function handleMax() {
    // 获取 html 根元素（非空断言 + 类型标注）
    const html = document.documentElement as HTMLHtmlElement;
    // 获取 root 容器，增加空值校验
    const root = document.getElementById("root");
    const deviceW = html.clientWidth;

    // 确保 root 元素存在再设置样式
    if (root) {
      root.style.maxWidth = "750px";
    }

    // 当屏幕宽度 >= 750px 时，固定根字体大小为 75px
    if (deviceW >= 750) {
      html.style.fontSize = "75px";
    }
  };

  // 初始化执行一次
  handleMax();
  // 监听窗口大小变化，绑定处理函数（添加事件类型标注）
  window.addEventListener("resize", handleMax);
})();
createRoot(document.getElementById("root")!).render(<App />);
