import {
  createSlice,
  type PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import api from "../../api";
import type {
  GetStoreListResponse,
  StoreList,
  StoreNewsResponse,
} from "../../api";

type StoreState = {
  code: number | string;
  codeText: string;
  data: StoreList;
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
};

const initialState: StoreState = {
  code: 0,
  codeText: "收藏列表",
  data: [],
  loading: "idle",
  error: null,
};
// 获取收藏列表
export const getStoreListAsync = createAsyncThunk<
  StoreList,
  void,
  {
    rejectValue: {
      code: number | string;
      message: string;
    };
  }
>("store/getStoreListAsync", async (_, { rejectWithValue }) => {
  try {
    // 发起请求
    const response: GetStoreListResponse = await api.getStoreList();

    // 后端业务失败
    if (response.code !== 0) {
      return rejectWithValue({
        code: response.code,
        message: response.codeText || "获取收藏列表失败",
      });
    }

    // 成功时只返回真正需要的数据
    return response.data;
  } catch (error: any) {
    // 网络异常/代码异常
    return rejectWithValue({
      code: 1,
      message: error?.message || "网络异常，获取收藏列表失败",
    });
  }
});
// 收藏新闻
export const storeNewsAsync = createAsyncThunk<
  StoreNewsResponse,
  { newsId: string | number },
  {
    rejectValue: {
      code: number | string;
      message: string;
    };
  }
>("store/storeNewsAsync", async (params, { rejectWithValue, dispatch }) => {
  try {
    const response = await api.storeNews(params);

    if (response.code !== 0) {
      return rejectWithValue({
        code: response.code,
        message: response.codeText || "收藏新闻失败",
      });
    }

    // 收藏成功后，重新拉取收藏列表
    dispatch(getStoreListAsync());

    return response;
  } catch (error: any) {
    return rejectWithValue({
      code: 1,
      message: error?.message || "网络异常，收藏新闻失败",
    });
  }
});
// 移除收藏
export const removeStoreAsync = createAsyncThunk<
  StoreNewsResponse,
  { id: string | number },
  {
    rejectValue: {
      code: number | string;
      message: string;
    };
  }
>("store/removeStoreAsync", async (params, { rejectWithValue, dispatch }) => {
  try {
    // console.log(params);

    const response = await api.removeStore(params);
    // console.log(response);

    if (response.code !== 0) {
      return rejectWithValue({
        code: response.code,
        message: response.codeText || "移除收藏失败",
      });
    }

    // 删除成功后刷新收藏列表
    dispatch(getStoreListAsync());

    return response;
  } catch (error: any) {
    return rejectWithValue({
      code: 1,
      message: error?.message || "网络异常，移除收藏失败",
    });
  }
});

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    setStoreList(state, action: PayloadAction<StoreList>) {
      state.data = action.payload;
    },
    clearStoreList(state) {
      state.data = [];
      state.code = 0;
      state.codeText = "已清空收藏列表";
      state.loading = "idle";
      state.error = null;
    },
    removeTargetNews(state, action: PayloadAction<number | string>) {
      state.data = state.data.filter((item) => {
        const isNotTarget = +item.id !== +action.payload;
        return isNotTarget;
      });
    }, //在视觉上先行动
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStoreListAsync.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(getStoreListAsync.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.code = 0;
        state.codeText = "获取收藏列表成功";
        state.data = action.payload;
      })
      .addCase(getStoreListAsync.rejected, (state, action) => {
        state.loading = "failed";
        state.code = action.payload?.code ?? 1;
        //空值合并操作符：只有当左侧值为 null/undefined 时，才会取右侧的值；空字符串 ""、0、false 这类「假值」不会触发右侧
        state.codeText = action.payload?.message ?? "获取收藏列表失败";
        state.error =
          action.payload?.message ?? action.error.message ?? "未知错误";
        // 优先取 action.payload.message → 其次取 action.error.message → 最后用 "未知错误" 兜底
      })
      .addCase(storeNewsAsync.fulfilled, (state, action) => {
        state.code = action.payload.code;
        state.codeText = action.payload.codeText || "收藏成功";
      })
      .addCase(storeNewsAsync.rejected, (state, action) => {
        state.code = action.payload?.code ?? 1;
        state.codeText = action.payload?.message ?? "收藏失败";
        state.error =
          action.payload?.message ?? action.error.message ?? "未知错误";
      })
      .addCase(removeStoreAsync.fulfilled, (state, action) => {
        state.code = action.payload.code;
        state.codeText = action.payload.codeText || "移除收藏成功";
      })
      .addCase(removeStoreAsync.rejected, (state, action) => {
        state.code = action.payload?.code ?? 1;
        state.codeText = action.payload?.message ?? "移除收藏失败";
        state.error =
          action.payload?.message ?? action.error.message ?? "未知错误";
      });
  },
});
// 得到用于派发的type
export let { setStoreList, clearStoreList, removeTargetNews } =
  storeSlice.actions;
export default storeSlice.reducer;
