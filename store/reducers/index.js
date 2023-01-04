import { combineReducers } from "redux";
import gardenReducer from "./gardenReducer.js";
import joinReqReducer from "./joinReqReducer.js";
import statusReducer from "./statusReducer.js";
import userReducer from "./userReducer.js";
import authSlice from "../slices/authSlice";
import userSlice from "../slices/userSlice";

const rootReducer = combineReducers({
  authState: authSlice,
  userSlice: userSlice,
  user: userReducer,
  garden: gardenReducer,
  joinReq: joinReqReducer,
  status: statusReducer,
});

export default rootReducer;
