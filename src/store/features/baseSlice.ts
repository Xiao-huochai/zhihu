import { createSlice } from "@reduxjs/toolkit";
const baseSlice = createSlice({
  name: "task",
  initialState: {
    oi: "8848",
  },
  reducers: {
    getOi(state, action) {
      console.log(action);
      state.oi = action.payload;
    },
  },
});
// 得到用于派发的type
export let { getOi } = baseSlice.actions;
export default baseSlice.reducer;
