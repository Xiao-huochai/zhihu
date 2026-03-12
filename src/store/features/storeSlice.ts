import {
  createSlice,
  type PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import api from "../../api";
import type { GetStoreListResponse } from "../../api";

export const getStoreListAsync = createAsyncThunk(
  "store/getStoreListAsync",
  async (__, { rejectWithValue, dispatch }) => {
    try {
      // 发起请求
      const response = await api.getStoreList();
      if (response.code !== 0) {
        console.log("获取收藏列表失败 code!==0");
        return rejectWithValue({
          code: response.code,
          message: response.codeText || "获取收藏列表失败",
        });
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        code: 1,
        message: error.message || "网络异常,获取收藏列表失败",
      });
    }
  },
);

const initialState: GetStoreListResponse = {
  code: 0,
  codeText: "收藏列表",
  data: [
    {
      id: 0,
      userId: 0,
      news: {
        id: 0,
        title: "标题",
        image: "http",
      },
    },
  ],
};
const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    getOi(state, action) {
      console.log(action);
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getStoreListAsync.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});
// 得到用于派发的type
export let { getOi } = storeSlice.actions;
export default storeSlice.reducer;
