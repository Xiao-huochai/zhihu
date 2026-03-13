import routes from "./routes";
import { Route, Routes } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { Mask, SpinLoading, Toast } from "antd-mobile";
import type { RouteItem } from "./routes";
import {
  useNavigate,
  useSearchParams,
  useLocation,
  useParams,
} from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../hooks";
import { queryUserInfo } from "../store/features/baseSlice";
import type { RootState } from "../store";
import _ from "../assets/utils";
import KeepAlive from "react-activation";
const Element = function Element(props: RouteItem) {
  let { component: Component, meta, path } = props;
  const navigate = useNavigate(),
    location = useLocation(),
    params = useParams(),
    [usp] = useSearchParams(),
    dispatch = useAppDispatch();

  // 先看redux是否存储了对应的数据 如果没有
  // 直接请求用户信息(登陆过有token可以直接向后端请求数据)
  const { info: userInfo, loading } = useAppSelector(
    (state: RootState) => state.base,
  );
  let checkList = ["/personal", "/store", "/update"];
  const isProtected = checkList.includes(path);
  const token = _.storage.get("tk");
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
  // 2. 核心鉴权与跳转逻辑 (副作用)
  useEffect(() => {
    // 如果是受保护页面
    if (isProtected) {
      // 情况 A: 根本没有 Token -> 直接踢回登录页
      if (!token) {
        Toast.show({ icon: "fail", content: "请先登录" });
        // 使用 navigate 跳转，加上 replace 防止回退死循环
        navigate(`/login?to=${path}`, { replace: true });
        return;
      }

      // 情况 B: 有 Token，但没用户信息 (说明是刷新了页面) -> 发起请求
      if (!userInfo && loading === "idle") {
        // 发起异步请求
        dispatch(queryUserInfo())
          .unwrap() // unwrap 允许我们在组件里捕获原本的 promise 结果
          .then(() => {
            // 请求成功，Redux 会自动更新，组件重新渲染，进入下方的正常渲染流程
          })
          .catch(() => {
            // 请求失败 (Token 过期或失效) -> 踢回登录页
            Toast.show({ icon: "fail", content: "登录已过期" });
            navigate(`/login?to=${path}`, { replace: true });
          });
      }
    }
  }, [isProtected, token, userInfo, loading, dispatch, navigate, path]);

  if (isProtected && !userInfo) {
    // 如果正在加载中，或者是刚刷新页面准备去加载 -> 显示 loading 遮罩
    // 这样避免页面闪烁，或者直接跳回登录页的错误
    return (
      <Mask visible={true} opacity="thick">
        <div
          style={{
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <SpinLoading color="white" style={{ "--size": "48px" }} />
          <div style={{ marginTop: 10 }}>加载用户信息...</div>
        </div>
      </Mask>
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
          let { name, path, keepAlive } = item;
          // 基础元素
          const routeElement = <Element {...item} />;

          // 如果需要缓存，用 KeepAlive 包裹
          const finalElement = keepAlive ? (
            <KeepAlive cacheKey={name}>{routeElement}</KeepAlive>
          ) : (
            routeElement
          );

          return <Route key={name} path={path} element={finalElement}></Route>;
        })}
      </Routes>
    </Suspense>
  );
}
