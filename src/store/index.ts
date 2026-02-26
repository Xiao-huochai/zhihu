import { configureStore } from "@reduxjs/toolkit";
import baseReducer from "./features/baseSlice";
import storeReducer from "./features/storeSlice";
import reduxLogger from "redux-logger";
import reduxPromise from "redux-promise";

const store = configureStore({
  reducer: {
    base: baseReducer,
    store: storeReducer,
  },
  middleware: (getDefaultMiddleware) => {
    // 先获取默认中间件，再拼接自定义中间件
    return getDefaultMiddleware().concat(reduxLogger, reduxPromise);
  },
});
export default store;
