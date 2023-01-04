export const SET_STATUS = "SET_STATUS"

//this action sets the status of the app
export const setStatus = (status) => {
  return {
    type: "SET_STATUS",
    payload: { status: status },
  };
};