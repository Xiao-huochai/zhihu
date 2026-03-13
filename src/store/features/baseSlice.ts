import {
  createSlice,
  type PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import type { UserInfo } from "../../api";
import api from "../../api";

// 异步方法
export const queryUserInfo = createAsyncThunk(
  "task/queryUserInfo", // action命名空间，格式：slice名/动作名
  async (_, { rejectWithValue }): Promise<any> => {
    try {
      // 1. 发起请求，指定返回类型为 ApiResponse<UserInfo>
      const response = await api.queryUserInfo();
      // 2. 校验接口状态码
      if (response.code !== 0) {
        // 非 0 则抛出错误，用 rejectWithValue 封装错误信息
        console.log("获取用户信息失败 code!==0");
        return rejectWithValue({
          code: response.code,
          message: response.codeText || "获取用户信息失败",
        });
      }
      // 3. 状态码正确，只返回 data 部分（核心数据）
      // 也可以直接dispatch触发方法更改状态
      // dispatch(updateInfo(response.data));
      return response.data;
    } catch (error: any) {
      // 4. 捕获网络错误/接口异常（比如 404、500、网络断开）
      return rejectWithValue({
        code: 1,
        message: error.message || "网络异常，获取用户信息失败",
      });
    }
  },
);

interface InitialState {
  info: UserInfo | null;
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: { code: number; message: string } | null;
}
const initialState: InitialState = {
  info: null,
  loading: "idle",
  error: null,
};
const baseSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    // 更新登录者信息
    updateInfo(state, action: PayloadAction<UserInfo>) {
      state.info = action.payload;
    },
    clearUserInfo(state) {
      state.info = null;
    },
  },
  extraReducers: (builder) => {
    // 如果fulfilled了则赋值
    builder
      .addCase(queryUserInfo.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.info = action.payload; //也可以dispatch吗
      })
      // 如果fulfilled了则赋值
      .addCase(queryUserInfo.pending, (state) => {
        state.loading = "pending";
      }) // 如果fulfilled了则赋值
      .addCase(queryUserInfo.rejected, (state, action) => {
        // 这里通过action.payload拿到rejectWithValue传出的错误信息
        state.loading = "failed";
        // 设置错误信息
        state.error = action.payload as { code: number; message: string };
      });
  },
});
// 得到用于派发的type
export let { updateInfo, clearUserInfo } = baseSlice.actions;
export default baseSlice.reducer;
