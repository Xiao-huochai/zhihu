import routes from "./routes";
import { Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import { Mask, SpinLoading } from "antd-mobile";
import type { RouteItem } from "./routes";

const Element = function Element(props: RouteItem) {
  let { component: Component, meta } = props;
  let { title = "知乎日报" } = meta || {};
  document.title = title;
  return <Component />;
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
