import { SET_USER } from "../actions/user.js";

const initialState = { auth: {}, data: {}, gardens: [] };

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      let user = action.payload.user;
      state = user;
      return state;
    default:
      return state;
  }
};

export default userReducer;
