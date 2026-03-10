import routes from "./routes";
import { Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import { Mask, SpinLoading } from "antd-mobile";
import type { RouteItem } from "./routes";
import {
  useNavigate,
  useSearchParams,
  useLocation,
  useParams,
} from "react-router-dom";

const Element = function Element(props: RouteItem) {
  let { component: Component, meta } = props;
  let { title = "知乎日报" } = meta || {};
  document.title = title;

  const navigate = useNavigate(),
    location = useLocation(),
    params = useParams(),
    [usp] = useSearchParams();

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
