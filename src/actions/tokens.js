
export const setTokens = (data) => dispatch => {
	dispatch({
		type: "SET_TOKENS",
		payload: data
	});
};

export const setTokenId = (data) => dispatch => {
	dispatch({
		type: "SET_TOKEN_ID",
		payload: data
	});
};
