const initialState = {
  tokens: [],
  token_id: "",
};

function tokensReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case "SET_TOKENS":
      return {
        ...state,
        tokens: payload
      };
    case "SET_TOKEN_ID":
      return {
        ...state,
        token_id: payload
      }
    default:
      return state;
  }
}

export default tokensReducer;