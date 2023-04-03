import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type alertType = {
  visible: boolean;
  level: "danger" | "warning" | "success" | "none";
  message: string;
};

const initialState: alertType = { visible: false, level: "none", message: "" };

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    setAlert(state, action: PayloadAction<alertType>) {
      console.log("here it is ");
      return action.payload;
    },
    clearAlert(state) {
      state = { visible: false, level: "none", message: "" };
      return state;
    },
  },
});

export const { setAlert, clearAlert } = alertSlice.actions;
export default alertSlice.reducer;
