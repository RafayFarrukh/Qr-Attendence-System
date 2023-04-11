export const initialState = null;

export const reducer = (state, action) => {
  if (action.type === "USER") {
    return {
      ...state,
      user: action.payload,
    };
  } 
  else if (action.type === "CLEAR") {
    return null;
  }
  else if (action.type === "FETCH_TOKEN") {
    return {
      ...state,
      token: action.payload,
    };
  }
  else if (action.type === "FetchClassId"){
      return {
      ...state,
      classId: action.payload,
    };
  }
  return state;
};
