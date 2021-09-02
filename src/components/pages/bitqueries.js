export const GET_USD_OF_TOKEN = (base, quote) => `
  {
    ethereum {
      dexTrades(
        options: {limit: 1, desc: "block.height"}
        exchangeName: {in: ["Uniswap", "Uniswap v2"]}
        baseCurrency: {is: "${base}"}
        quoteCurrency: {is: "${quote}"}
      ) {
        block {
          height
          timestamp {
            unixtime
          }
        }
        buyCurrency {
          symbol
          address
        }
        sellCurrency {
          symbol
          address
          name
        }
        tradeAmount(in: USD)
        baseAmount
      }
    }
  }
`

export const SEARCH_TOKEN = (str) => `
  query {
    search(string: "${str}", network: bsc, limit: 50) {
      network {
        network
      }
      subject {
        ... on Currency {
          address
          name
          symbol
        }
      }
    }
  }
`

export const GET_TRANSACTIONS = (base, quote) => `
  query {
    ethereum {
      dexTrades(options: {limit: 10, desc: "block.height"}, 
      exchangeName: {in: ["Uniswap", "Uniswap v2"]}, 
      baseCurrency: {is: "${base}"}
      quoteCurrency: {is: "${quote}"}) {
          transaction {
            hash
          }
        tradeIndex
        block {
          height
          timestamp {
            unixtime
          }
        }
        baseCurrency {
          symbol
          address
        }
        buyAmount
        buyAmountInUsd: buyAmount(in: USD)
        buyCurrency {
          symbol
          address
        }
        sellAmount
        sellAmountInUsd: sellAmount(in: USD)
        sellCurrency {
          symbol
          address
        }
        sellAmountInUsd: sellAmount(in: USD)
        tradeAmount(in: USD)
        baseAmount
        transaction {
          gasValue
          gasPrice
          gas
          txFrom {address}
        }
      }
    }
  }
`;


export const GET_TOTAL_LIQUIDITY = (base, quote) => `
  {
    ethereum {
      dexTrades(
        exchangeName: {in: ["Uniswap", "Uniswap v2"]},
        baseCurrency: {is: "${base}"}
        quoteCurrency: {is: "${quote}"}
      ) {
        count
        tradeAmount(in: USD)
      }
    }
  }
`

export const GET_DAILY_VOLUME = (base, quote) => `
  {
    ethereum {
      dexTrades(
        options: {desc: "timeInterval.minute", limit: 1}
        exchangeName: {in: ["Uniswap", "Uniswap v2"]}
        baseCurrency: {is: "${base}"}
        quoteCurrency: {is: "${quote}"}
      ) {
        timeInterval {
          minute(count: 1440)
        }
        tradeAmount(in: USD)
      }
    }
  }
`

export const GET_POOL = (base, quote, pair_address) => (
   `
      {
        ethereum {
          address(address: {is: "${pair_address}"}) {
            balances(
              currency: {in: ["${base}", "${quote}"]}
            ) {
              currency {
                symbol
                address
              }
              value
            }
          }
        }
      }
    `
)
 

export const GET_TOTAL_TX = (base, quote) => `
  {
    ethereum {
      dexTrades(
        exchangeName: {in: ["Uniswap", "Uniswap v2"]}
        baseCurrency: {is: "${base}"}
        quoteCurrency: {is: "${quote}"}
      ) {
        count
      }
    }
  }
`

export const GET_HOLDERS = (base, quote) => `
  {
    ethereum {
      dexTrades(
        exchangeName: {in: ["Uniswap", "Uniswap v2"]}
        baseCurrency: {is: "${base}"}
        quoteCurrency: {is: "${quote}"}
      ) {
        holders : count(uniq: takers)
      }
    }
  }
`

export const GET_PAIR_ADDRESS = (address) => `
  {
    ethereum {
      dexTrades(
        options: {limit: 1}
        exchangeName: {in: ["Uniswap", "Uniswap v2"]}
        baseCurrency: {is: "${address}"}
        quoteCurrency: {in: ["0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c", "0xe9e7cea3dedca5984780bafc599bd69add087d56"]}
      ) {
        smartContract {
          address {
            address
          }
        }
        baseCurrency {
          name
          symbol
        }
      }
    }
  }
`

export const GET_PAIRS = (addresses) => `
  {
    ethereum {
      dexTrades(
        options: {desc: "tradeAmount", limit: 15}
        exchangeName: {in: ["Uniswap", "Uniswap v2"]}
        tradeAmountUsd: {notIn: 0}
        baseCurrency: {in: [${addresses}]}
        smartContractAddress: {notIn: ["0xa527a61703d82139f8a06bc30097cc9caa2df5a6"]}
      ) {
        baseCurrency {
          address
          symbol
          name
        }
        buyCurrency {
          address
          symbol
          name
        }
        sellCurrency {
          address
          symbol
          name
        }
        smartContract {
          address {
            address
          }
        }
        trade: count
        tradeAmount(in: USD)
      }
    }
  }
`

export const GET_TOKEN = (pair_address) => {
  // if (pair_address === "") {
    return `
      {
        ethereum {
          dexTrades(
            options: {desc: "tradeAmount", limit: 1}
            exchangeName: {in: ["Uniswap", "Uniswap v2"]}
            smartContractAddress: {is: "${pair_address}"}
          ) {
            baseCurrency {
              address
              name
              symbol
            }
            quoteCurrency {
              address
              name
              symbol
            }
            tradeAmount(in: USD)
            baseAmount
            side
          }
        }
      }
    `
  // }
}

export const GET_TOKEN_NAME = (base) => `
  {
    ethereum {
      dexTrades(
        options: {limit: 1}
        exchangeName: {in: ["Uniswap", "Uniswap v2"]}
        baseCurrency: {is: "${base}"}
      ) {
        baseCurrency {
          name
          address
          symbol
        }
      }
    }
  }
`

      
