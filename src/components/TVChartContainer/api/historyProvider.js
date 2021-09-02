const { useQuery, gql, ApolloProvider, ApolloClient, InMemoryCache, split, HttpLink } = require('@apollo/client');
const { WebSocketLink } = require("apollo-link-ws");
const { getMainDefinition } = require('@apollo/client/utilities');

const store = require('../../../store.js');

const httpLink = new HttpLink({
  uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'
});


const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

const TOKEN_CHART = gql`
  query TokenDayDatas($id: String!) {
    tokenDayDatas(first: 1000, orderBy: date, orderDirection: desc, where: { token: $id }) {
      id
      date
      priceUSD
      totalLiquidityToken
      totalLiquidityUSD
      totalLiquidityETH
      dailyVolumeETH
      dailyVolumeToken
      dailyVolumeUSD
    }
  }
`

const FEED_SEARCH_QUERY = gql`
  query Tokens ($id: String!) {
    tokens(where: {id: $id}) {
      symbol
      name
      tradeVolume
      derivedETH
    }
  }
`;

const ETH_PRICE_QUERY = gql`
  query {
    bundles {
      id
      ethPrice
    }
  }
`;


const url = "https://graphql.bitquery.io/";


const history = {}

export default {
	history: history,
	resolveSymbol: async function (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
		var {data} = await client.query({query: FEED_SEARCH_QUERY, variables: { id: symbolName }});

		var symbol_stub = {
			name: symbolName,
			description: data.tokens[0].symbol + "/USD",
			type: 'crypto',
			session: '24x7',
			timezone: 'Etc/UTC',
			ticker: "",
			exchange: "",
			minmov: 1,
			pricescale: 1000,
			has_intraday: true,
			has_daily: false,
			has_weekly_and_monthly: false,
			intraday_multipliers: ['30'],
			volume_precision: 8,
			data_status: 'streaming',
		}

		setTimeout(function() {
			onSymbolResolvedCallback(symbol_stub)
			// console.log('Resolving that symbol....', symbol_stub)
		}, 100)
	},
    getBars: async function(symbolInfo, resolution, from, to, first, limit) {
				      // date: {since: "2021-04-25"}
    	console.log("RESOLUTION = ", resolution);
		var query
		if (symbolInfo.name !== "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2") {
			console.log("1: ", symbolInfo.name)
			query = `
			  query {
				  ethereum(network: ethereum) {
				    dexTrades(
				      options: {asc: "timeInterval.minute"}
				      exchangeName: {is: "Uniswap"}
				      baseCurrency: {is: "${symbolInfo.name}"}
				      quoteCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}
				    ) {
				      timeInterval {
				        minute(count: 30)
				      }
				      baseCurrency {
				        symbol
				        address
				      }
				      baseAmount
				      quoteCurrency {
				        symbol
				        address
				      }
				      quoteAmount
				      tradeAmount(in: USD)
				      maximum_price: quotePrice(calculate: maximum)
				      minimum_price: quotePrice(calculate: minimum)
				      open_price: minimum(of: block, get: quote_price)
				      close_price: maximum(of: block, get: quote_price)
				    }
				  }
				}
			`;
		} else {
			console.log("2: ", symbolInfo.name)
			query = `
			  query {
				  ethereum(network: ethereum) {
				    dexTrades(
				      options: {asc: "timeInterval.minute"}
				      exchangeName: {is: "Uniswap"}
				      baseCurrency: {is: "${symbolInfo.name}"}
				      quoteCurrency: {is: "0xdac17f958d2ee523a2206206994597c13d831ec7"}
	 			    ) {
				      timeInterval {
				        minute(count: 30)
				      }
				      baseCurrency {
				        symbol
				        address
				      }
				      baseAmount
				      quoteCurrency {
				        symbol
				        address
				      }
				      volume: quoteAmount
				      quoteAmount
				      tradeAmount(in: USD)
				      maximum_price: quotePrice(calculate: maximum)
				      minimum_price: quotePrice(calculate: minimum)
				      open_price: minimum(of: block, get: quote_price)
				      close_price: maximum(of: block, get: quote_price)
				    }
				  }
				}
			`;
		}


		const opts = {
		    method: "POST",
		    headers: {
		        "Content-Type": "application/json",
		      	"X-API-KEY": "BQYvhnv04csZHaprIBZNwtpRiDIwEIW9"
		    },
		    body: JSON.stringify({
		        query
		    })
		};



		return fetch(url, opts)
		    .then(res => res.json())
	        .then(async (data) => {
	          	console.log(data.data.ethereum.dexTrades);
				if (!first) {
					console.log('CryptoCompare API error:')
					return []
				}
				if (symbolInfo.name === "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2") {
					if (data.data.ethereum.dexTrades.length) {
						var elements = [...data.data.ethereum.dexTrades];
						var bars = data.data.ethereum.dexTrades.map((el, k) => {
							if (k == 0) {
								return {
									time: new Date(elements[0].timeInterval.minute), //TradingView requires bar time in ms
									low: parseFloat(elements[0].minimum_price),
									high: parseFloat(elements[0].maximum_price),
									open: parseFloat(elements[0].open_price),
									close: parseFloat(elements[0].close_price),
									volume: parseFloat(elements[0].quoteAmount) 
								}
							} else {
								return {
									time: new Date(el.timeInterval.minute), //TradingView requires bar time in ms
									low: parseFloat(elements[k - 1].close_price) > parseFloat(el.close_price) ? (parseFloat(el.minimum_price) < parseFloat(el.close_price) ? parseFloat(el.minimum_price): parseFloat(el.close_price)): (parseFloat(el.minimum_price) < parseFloat(elements[k - 1].close_price) ? parseFloat(el.minimum_price): parseFloat(elements[k - 1].close_price)) ,
									high: parseFloat(elements[k - 1].close_price) < parseFloat(el.close_price) ? (parseFloat(el.maximum_price) > parseFloat(el.close_price) ? parseFloat(el.maximum_price): parseFloat(el.close_price)): (parseFloat(el.maximum_price) > parseFloat(elements[k - 1].close_price) ? parseFloat(el.maximum_price): parseFloat(elements[k - 1].close_price)) ,
									open: parseFloat(elements[k - 1].close_price),
									close: parseFloat(el.close_price) ,
									volume: parseFloat(el.quoteAmount) 
								}
							}
							// return {
							// 	time: new Date(el.timeInterval.minute), //TradingView requires bar time in ms
							// 	low: parseFloat(el.minimum_price),
							// 	high: parseFloat(el.maximum_price),
							// 	open: parseFloat(el.open_price),
							// 	close: parseFloat(el.close_price),
							// 	volume: parseFloat(el.quoteAmount) 
							// }
						})
					} else {
						return []
					}
				} else {
					if (data.data.ethereum.dexTrades.length !== undefined && data.data.ethereum.dexTrades.length !== 0) {
						// var elements = [...data.data.ethereum.dexTrades];
						var elements = data.data.ethereum.dexTrades.map((el, k) => {
							var offset = el.tradeAmount / el.quoteAmount;
							var element = {
								time: el.timeInterval.minute,
								minimum_price: parseFloat(el.minimum_price) * offset,
								maximum_price: parseFloat(el.maximum_price) * offset,
								open_price: parseFloat(el.open_price) * offset,
								close_price: parseFloat(el.close_price) * offset,
								quoteAmount: parseFloat(el.quoteAmount)
							}
							return element
						})
						// console.log(elements)
						var bars = elements.map((el, k) => {
							// var offset = el.tradeAmount / el.quoteAmount;
							if (k == 0) {
								return {
									time: new Date(elements[0].time), //TradingView requires bar time in ms
									low: parseFloat(elements[0].minimum_price),
									high: parseFloat(elements[0].maximum_price),
									open: parseFloat(elements[0].open_price),
									close: parseFloat(elements[0].close_price),
									volume: parseFloat(elements[0].quoteAmount) 
								}
							} else {
								return {
									time: new Date(el.time), //TradingView requires bar time in ms
									low: parseFloat(elements[k - 1].close_price) > parseFloat(el.close_price) ? (parseFloat(el.minimum_price) < parseFloat(el.close_price) ? parseFloat(el.minimum_price): parseFloat(el.close_price)): (parseFloat(el.minimum_price) < parseFloat(elements[k - 1].close_price) ? parseFloat(el.minimum_price): parseFloat(elements[k - 1].close_price)) ,
									high: parseFloat(elements[k - 1].close_price) < parseFloat(el.close_price) ? (parseFloat(el.maximum_price) > parseFloat(el.close_price) ? parseFloat(el.maximum_price): parseFloat(el.close_price)): (parseFloat(el.maximum_price) > parseFloat(elements[k - 1].close_price) ? parseFloat(el.maximum_price): parseFloat(elements[k - 1].close_price)) ,
									open: parseFloat(elements[k - 1].close_price),
									close: parseFloat(el.close_price),
									volume: parseFloat(el.quoteAmount) 
								}
							}
							// return {
							// 	time: new Date(el.timeInterval.minute), //TradingView requires bar time in ms
							// 	low: parseFloat(el.minimum_price) * offset,
							// 	high: parseFloat(el.maximum_price) * offset,
							// 	open: parseFloat(el.open_price) * offset,
							// 	close: parseFloat(el.close_price) * offset,
							// 	volume: parseFloat(el.quoteAmount) 
							// }
						})
					} else {
						console.log("wowowow", symbolInfo.name);
						var query = `
						  query {
							  ethereum(network: ethereum) {
							    dexTrades(
							      options: {asc: "timeInterval.minute"}
							      exchangeName: {is: "Uniswap"}
							      baseCurrency: {is: "${symbolInfo.name}"}
							      quoteCurrency: {is: "0xdac17f958d2ee523a2206206994597c13d831ec7"}
				 			    ) {
							      timeInterval {
							        minute(count: 30)
							      }
							      baseCurrency {
							        symbol
							        address
							      }
							      baseAmount
							      quoteCurrency {
							        symbol
							        address
							      }
							      volume: quoteAmount
							      quoteAmount
							      tradeAmount(in: USD)
							      maximum_price: quotePrice(calculate: maximum)
							      minimum_price: quotePrice(calculate: minimum)
							      open_price: minimum(of: block, get: quote_price)
							      close_price: maximum(of: block, get: quote_price)
							    }
							  }
							}
						`;


						const opts1 = {
						    method: "POST",
						    headers: {
						        "Content-Type": "application/json",
						      	"X-API-KEY": "BQYvhnv04csZHaprIBZNwtpRiDIwEIW9"
						    },
						    body: JSON.stringify({
						        query
						    })
						};

						var response = await fetch(url, opts1)
						var data = await response.json();
			          	// console.log("wow", data);
			          	if (data.data.ethereum.dexTrades.length) {
							var elements = [...data.data.ethereum.dexTrades];
							var bars = data.data.ethereum.dexTrades.map((el, k) => {
								if (k == 0) {
									return {
										time: new Date(elements[0].timeInterval.minute), //TradingView requires bar time in ms
										low: parseFloat(elements[0].minimum_price),
										high: parseFloat(elements[0].maximum_price),
										open: parseFloat(elements[0].open_price),
										close: parseFloat(elements[0].close_price),
										volume: parseFloat(elements[0].quoteAmount) 
									}
								} else {
									return {
										time: new Date(el.timeInterval.minute), //TradingView requires bar time in ms
										low: parseFloat(elements[k - 1].close_price) > parseFloat(el.close_price) ? (parseFloat(el.minimum_price) < parseFloat(el.close_price) ? parseFloat(el.minimum_price): parseFloat(el.close_price)): (parseFloat(el.minimum_price) < parseFloat(elements[k - 1].close_price) ? parseFloat(el.minimum_price): parseFloat(elements[k - 1].close_price)) ,
										high: parseFloat(elements[k - 1].close_price) < parseFloat(el.close_price) ? (parseFloat(el.maximum_price) > parseFloat(el.close_price) ? parseFloat(el.maximum_price): parseFloat(el.close_price)): (parseFloat(el.maximum_price) > parseFloat(elements[k - 1].close_price) ? parseFloat(el.maximum_price): parseFloat(elements[k - 1].close_price)) ,
										open: parseFloat(elements[k - 1].close_price),
										close: parseFloat(el.close_price) ,
										volume: parseFloat(el.quoteAmount) 
									}
								}
							})
						} else {
							var data1 = await client.query({query: FEED_SEARCH_QUERY, variables: { id: symbolInfo.name }});
							var data2 = await client.query({query: ETH_PRICE_QUERY});

							var initPrice = parseFloat(data1.data.tokens[0].derivedETH) * parseFloat(data2.data.bundles[0].ethPrice);
							var initVolume = parseFloat(data1.data.tokens[0].tradeVolume)

							console.log("lastBar2", data1, data2)
							var lastBar = {
								time: new Date(),
								low: initPrice,
								high: initPrice,
								open: initPrice,
								close: initPrice,
								volume: initVolume
							}
							history[symbolInfo.name] = {lastBar: lastBar}
							return []
						}

					}
				} 
					
						if (first) {
							console.log("lastBar1")
							var lastBar = bars[bars.length - 1]
							history[symbolInfo.name] = {lastBar: lastBar}
						} 
					return bars
				
				return []
			})
	        .catch(console.error);
	}
}
