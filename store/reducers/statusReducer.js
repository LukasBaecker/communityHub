import { SET_JOINREQ } from "../actions/garden.js";
import { SET_STATUS } from "../actions/index.js";

const initialState = "idle";

/**
 * This status saves the status of the app
 * The value is a string and can be for example
 * "idle" when nothing is happening in the background and the app is ready to use
 * "loading" when something is loading and the Loading Spinner has to be rendered
 * @param {*} state
 * @param {*} action
 * @returns
 */
const statusReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_STATUS:
      let status = action.payload.status;
      state = status;
      return state;
    default:
      return state;
  }
};

export default statusReducer;
