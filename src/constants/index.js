export async function getTokenLists () {
	var row_tokens;
	var response = await fetch("https://tokens.coingecko.com/uniswap/all.json");

	if (response.ok) {
		var json = await response.json()
		row_tokens = json.tokens
	} else {
		console.log("No response");
	}

	return row_tokens;
} 
