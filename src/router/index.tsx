import routes from "./routes";
import { Route, Routes } from "react-router-dom";
import { Suspense } from "react";

const Element = function Element(props: any) {
  let { component: Component } = props;

  return <Component />;
};

export default function RouterView() {
  return (
    <Suspense fallback={<>loading</>}>
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
