export const SET_GARDEN = "SET_GARDEN";
export const SET_JOINREQ = "SET_JOINREQ";

export const setGarden = (garden) => {
  return {
    type: "SET_GARDEN",
    payload: { garden: garden },
  };
};

//action to set the joinRequests of the current active garden
//should be set empty when user is not "owner" nor "admin"
export const setJoinReq = (joinReqs) => {
  return {
    type: "SET_JOINREQ",
    payload: { joinReqs: joinReqs },
  };
};
