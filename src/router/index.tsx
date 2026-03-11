import routes from "./routes";
import { Navigate, Route, Routes } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { Mask, SpinLoading, Toast } from "antd-mobile";
import type { RouteItem } from "./routes";
import {
  useNavigate,
  useSearchParams,
  useLocation,
  useParams,
} from "react-router-dom";
import { useAppSelector } from "../hooks";
import type { RootState } from "../store";
const Element = function Element(props: RouteItem) {
  let { component: Component, meta, path } = props;
  const navigate = useNavigate(),
    location = useLocation(),
    params = useParams(),
    [usp] = useSearchParams();
  const { info: userInfo } = useAppSelector((state: RootState) => state.base);
  let checkList = ["/personal", "/store", "/update"];
  const needLogin = !userInfo && checkList.includes(path);

  // 1. 副作用逻辑抽离到 useEffect，更符合 React 规范
  useEffect(() => {
    if (meta?.title) {
      document.title = meta.title;
    }
  }, [meta?.title]); // 依赖变化时才执行
  // 2. 处理“未登录提示”的副作用 (修改点)

  // 1. 纯函数 (Pure Function) 纯函数与副作用
  // 一个函数如果满足以下两点，就是纯函数：

  // 输入决定输出：给它相同的参数，它永远返回相同的结果（1 + 1 永远等于 2）。
  // 无副作用：除了计算返回值，不干任何“私活”，不影响函数外部的世界。

  // 2. 副作用 (Side Effects)
  // 只要你的函数做了计算返回值以外的事情，并且这些事情会影响到外部环境，就叫副作用。

  // 常见的副作用包括：

  // 修改 DOM：比如 document.title = '...'，或者你的 Toast.show()（它在页面上挂载了一个新的 DOM 节点）。
  // 数据请求：fetch 或 axios（因为服务器状态变了，或者你拿到数据了）。
  // 订阅：window.addEventListener（你修改了浏览器的事件监听列表）。
  // 定时器：setTimeout、setInterval。
  // Console.log：严格来说也是副作用（因为它修改了控制台的输出），但 React 允许这个作为调试例外。

  useEffect(() => {
    if (needLogin) {
      //react组件渲染过程中不能直接调用生成div改变页面的函数 要放在useEffect里面
      Toast.show({
        icon: "fail",
        content: "请登录",
      });
    }
  }, [needLogin, userInfo]); // 依赖变化时执行

  // 3. 渲染逻辑：如果需要登录，返回 Navigate 组件进行重定向
  if (needLogin) {
    return (
      <Navigate
        to={{
          pathname: "/login",
          search: `?to=${path}`,
        }}
        replace // 建议加上 replace，防止用户点浏览器返回键陷入死循环
      />
    );
  }

  return (
    <Component
      location={location}
      params={params}
      usp={usp}
      navigate={navigate}
    />
  );
};

export default function RouterView() {
  return (
    <Suspense
      fallback={
        <Mask visible={true} opacity={"thick"}>
          <SpinLoading style={{ "--size": "100px" }} />
        </Mask>
      }
    >
      <Routes>
        {routes.map((item) => {
          let { name, path } = item;
          return (
            <Route
              key={name}
              path={path}
              element={<Element {...item} />}
            ></Route>
          );
        })}
      </Routes>
    </Suspense>
  );
}
