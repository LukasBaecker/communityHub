import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface UserState {
  auth: object;
  data: { firstname: string; name: string; groups: object[] };
  groups: object[];
}

const initialState = {
  auth: {},
  data: { firstname: "", name: "", groups: [] },
  groups: [],
} as UserState;

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
  },
});

export const { logout, setUser } = userSlice.actions;
export default userSlice.reducer;
