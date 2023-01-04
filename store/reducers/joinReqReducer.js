import { SET_JOINREQ } from "../actions/garden.js";

const initialState = [];

/**
 * this reducer is saving join-requests the active garden has open
 * the joinReq will only be loaded from the server if the current auth user is owner or admin
 * of the activeGarden
 * @param {*} state
 * @param {*} action
 * @returns
 */
const joinReqReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_JOINREQ:
      let joinReq = action.payload.joinReqs;
      state = joinReq;
      return state;
    default:
      return state;
  }
};

export default joinReqReducer;
