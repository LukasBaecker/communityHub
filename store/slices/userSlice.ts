import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserState, UserAuthState } from "../../types";

const initialState = {
  auth: {},
  data: { firstname: "", name: "", groups: [] },
  groups: [],
} as UserState;

//TODO: adding a type for all teh things I am using here: groups
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state = {
        auth: {},
        data: { firstname: "", name: "", groups: [] },
        groups: [],
      };
      return state;
    },
    setUser(state, action: PayloadAction<UserState>) {
      state = action.payload;
      return state;
    },
    setUserAuth(state, action: PayloadAction<UserAuthState>) {
      state = {
        auth: action.payload.auth,
        data: action.payload.data,
        groups: state.groups,
      };
      return state;
    },
    addGroup(state, action: PayloadAction<Object>) {
      if (!state.groups.find((o) => o.name === action.payload.name)) {
        state.groups.push(action.payload);
      }
    },
  },
});

export const { logout, setUser, addGroup, setUserAuth } = userSlice.actions;
export default userSlice.reducer;
