import { createSlice } from "@reduxjs/toolkit";
const storeSlice = createSlice({
  name: "store",
  initialState: {
    mystore: "8848",
  },
  reducers: {
    getOi(state, action) {
      console.log(action);
      state.mystore = action.payload;
    },
  },
});
// 得到用于派发的type
export let { getOi } = storeSlice.actions;
export default storeSlice.reducer;
