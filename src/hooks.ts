// src/hooks.ts
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
// 导入你 store.ts 中导出的类型（关键！）
import type { RootState, AppDispatch } from "./store";

// 封装类型安全的 dispatch Hook（解决异步 thunk 类型报错）
export const useAppDispatch = () => useDispatch<AppDispatch>();

// 封装类型安全的 selector Hook（可选，但建议一起封装，后续用着方便）
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
