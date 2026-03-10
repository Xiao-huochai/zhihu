import routes from "./routes";
import { Route, Routes } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { Mask, SpinLoading } from "antd-mobile";
import type { RouteItem } from "./routes";
import {
  useNavigate,
  useSearchParams,
  useLocation,
  useParams,
} from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../hooks";
import type { RootState } from "../store";
import { queryUserInfo } from "../store/features/baseSlice";
const Element = function Element(props: RouteItem) {
  let { component: Component, meta, path } = props;
  const navigate = useNavigate(),
    location = useLocation(),
    params = useParams(),
    [usp] = useSearchParams();
  const { info: userInfo } = useAppSelector((state: RootState) => state.base);
  let checkList = ["/personal", "/store", "/update"];
  let dispatch = useAppDispatch();
  useEffect(() => {
    if (meta?.title) {
      document.title = meta.title;
    }
    const init = async () => {
      try {
        let oi = await dispatch(queryUserInfo()); //
        console.log(oi);
      } catch (error) {
        console.log(error);
      }
    };
    if (!userInfo && checkList.includes(path)) {
      console.log(path);
      init();
    }
  }, [dispatch, meta]);

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
