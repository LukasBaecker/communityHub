import { PayloadAction, createSlice } from "@reduxjs/toolkit";

//TODO: define the groupType to use it for the initial state
type groupType = {};
const initialState: object = {};

const activeGroupSlice = createSlice({
  name: "activeGroupe",
  initialState,
  reducers: {
    setActiveGroup: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setActiveGroup } = activeGroupSlice.actions;
export default activeGroupSlice.reducer;
