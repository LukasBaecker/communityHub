import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type statusType = "idle" | "loading" | "createNewUser";
const initialState = "idle" as statusType;

const statusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    done(state) {
      state = "idle";
      return state;
    },
    loading(state) {
      state = "loading";
      return state;
    },
    creatingNewUser(state) {
      state = "createNewUser";
      return state;
    },
  },
});

export const { done, loading, creatingNewUser } = statusSlice.actions;
export default statusSlice.reducer;
