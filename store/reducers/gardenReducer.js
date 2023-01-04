import { SET_GARDEN } from "../actions/garden.js";

const initialState = { garden: {}, myRole: "none" };

const gardenReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_GARDEN:
      let garden = action.payload.garden;
      state = garden;
      return state;
    default:
      return state;
  }
};

export default gardenReducer;
