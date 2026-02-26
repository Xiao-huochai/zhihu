import { lazy } from "react";
import Home from "../views/Home";

import type { LazyExoticComponent, ComponentType } from "react";

// 路由元信息类型（对应你配置中的 meta 字段）
export type RouteMeta = {
  /** 页面标题 */
  title: string;
  // 可以扩展其他自定义属性，比如：
  // auth?: boolean; // 是否需要登录
  // icon?: string; // 菜单图标
};

// 路由配置项类型（核心）
export type RouteItem = {
  /** 路由路径，支持 react-router-dom 的路径规则 */
  path: string;
  /** 路由名称（用于路由跳转/标识） */
  name: string;
  /** 路由组件（支持普通组件和懒加载组件） */
  component: ComponentType<any> | LazyExoticComponent<ComponentType<any>>;
  /** 路由元信息 */
  meta: RouteMeta;
  /** 嵌套路由（预留扩展，可选） */
  children?: RouteItem[];
  /** 是否为索引路由（可选） */
  index?: boolean;
};

const routes: RouteItem[] = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      title: "知乎日报-WebApp",
    },
  },
  {
    path: "/detail/:id",
    name: "detail",
    component: lazy(() => import("../views/Detail")),
    meta: {
      title: "新闻详情-知乎日报",
    },
  },
  {
    path: "/personal",
    name: "personal",
    component: lazy(() => import("../views/Personal")),
    meta: {
      title: "个人中心-知乎日报",
    },
  },
  {
    path: "/store",
    name: "store",
    component: lazy(() => import("../views/Store")),
    meta: {
      title: "我的收藏-知乎日报",
    },
  },
  {
    path: "/update",
    name: "update",
    component: lazy(() => import("../views/Update")),
    meta: {
      title: "修改个人信息-知乎日报",
    },
  },
  {
    path: "/login",
    name: "login",
    component: lazy(() => import("../views/Login")),
    meta: {
      title: "登录/注册-知乎日报",
    },
  },
  {
    path: "*",
    name: "404",
    component: lazy(() => import("../views/Page404")),
    meta: {
      title: "404页面-知乎日报",
    },
  },
];
export default routes;
