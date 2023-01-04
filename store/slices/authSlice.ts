import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: boolean = false;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    unauthorize: (state) => {
      return false;
    },
    authorize: (state) => {
      return true;
    },
  },
});

export const { unauthorize, authorize } = authSlice.actions;
export default authSlice.reducer;
