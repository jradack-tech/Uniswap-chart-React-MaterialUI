import { gql } from '@apollo/client';


export const ALL_TOKENS = gql`
  query Tokens($lastID: String) {
    tokens (first: 1000, where: {id_gt: $lastID, totalLiquidity_not: 0, tradeVolume_not: 0}) {
      id
      name
      symbol
      tradeVolume
      totalLiquidity
      decimals
    }
  }
`

export const ETH_PRICE_QUERY_FIRST = gql`
  query bundles {
    bundles(where: { id: "1" }) {
      ethPrice
    }
  }
`

export const FEED_SEARCH_QUERY = gql`
  query Pairs ($id: String!) {
    pairs (where: {id: $id}) {
      token0 {
        id
        symbol
        name
        derivedETH
        decimals
      }
      token1 {
        id
        symbol
        name
        derivedETH
        decimals
      }

      id
      reserve0
      reserve1
      totalSupply
      txCount
      liquidityProviderCount
    }
  }
`;

export const EXTRA_SEARCH_QUERY = gql`
  query Tokens ($gte: String, $lte: String, $id: String) {
    asSymbol: tokens(where: { symbol_gte: $gte, symbol_lte: $lte, totalLiquidity_not: 0, tradeVolume_not: 0 }, first: 20, orderBy:txCount, orderDirection: desc ) {
      id
      symbol
      name
      totalLiquidity
      tradeVolume
      txCount
      derivedETH
      totalSupply
      decimals
    }
    asName: tokens(where: { name_gte: $gte, name_lte: $lte, totalLiquidity_not: 0, tradeVolume_not: 0 }, first: 20, orderBy:txCount, orderDirection: desc) {
      id
      symbol
      name
      totalLiquidity
      tradeVolume
      txCount
      derivedETH
      totalSupply
      decimals
    }
    asAddress: tokens(where: { id: $id}) {
      id
      symbol
      name
      totalLiquidity
      tradeVolume
      txCount
      derivedETH
      totalSupply
      decimals
    }
  }
`;

export const POOL_SEARCH_QUERY = gql`
  subscription Pairs ($id: String!) {
    pairs (where: {id: $id}) {
      token1 {
        derivedETH
        id
        symbol
        name
        decimals
      }
      token0 {
        id
        symbol
        name
        derivedETH
        decimals
      }
      id
      reserve0
      reserve1
      totalSupply
      txCount
      liquidityProviderCount
    }
  }
`;

export const PAIRS_SEARCH_QUERY = gql`
  query Pairs ($id: String!) {
    pairs(where: {token0_contains: $id}) {
      id
    }
  }
`;

export const ALL_PAIRS_QUERY = (recommended_tokens) => {
  if (recommended_tokens.length !== 0) {
    var pairIds = `"` + recommended_tokens[0].id + `"`
    for (var i = 1; i < recommended_tokens.length; i ++) {
      pairIds = pairIds + `, "` + recommended_tokens[i].id + `"`
    }
    var query = `query Pairs {
          pairs (orderBy: txCount, orderDirection: desc, first: 10, where: {token0_in: [${pairIds}]}) {
            token0 {
              id
              symbol
              name
              decimals
            }
            token1 {
              id
              symbol
              name
              decimals
            }
            id
            reserve0
            reserve1
            totalSupply
            txCount
            liquidityProviderCount
          }
      }
    `;

    return gql(query)
  } else {
    var query = `query Pairs {
          pairs (first: 10, where: {token1_in: []}) {
            token0 {
              id
              symbol
              name
              decimals
            }
            token1 {
              id
              symbol
              name
              decimals
            }
            id
            reserve0
            reserve1
            totalSupply
            txCount
            liquidityProviderCount
          }
      }
    `;

    return gql(query)
  }
    
}


export const ALL_PAIRS_QUERY1 = (recommended_tokens) => {
  if (recommended_tokens.length !== 0) {
    var pairIds = `"` + recommended_tokens[0].id + `"`
    for (var i = 1; i < recommended_tokens.length; i ++) {
      pairIds = pairIds + `, "` + recommended_tokens[i].id + `"`
    }
    var query = `query Pairs {
          pairs (first: 6, orderBy: txCount, orderDirection: desc, where: {token1_in: [${pairIds}]}) {
            token0 {
              id
              symbol
              name
              decimals
            }
            token1 {
              id
              symbol
              name
              decimals
            }
            id
            reserve0
            reserve1
            totalSupply
            txCount
            liquidityProviderCount
          }
      }
    `;

    return gql(query)
  } else {
    var query = `query Pairs {
          pairs (first: 10, where: {token1_in: []}) {
            token0 {
              id
              symbol
              name
              decimals
            }
            token1 {
              id
              symbol
              name
              decimals
            }
            id
            reserve0
            reserve1
            totalSupply
            txCount
            liquidityProviderCount
          }
      }
    `;

    return gql(query)
  }
    
}

export const ETH_PRICE_QUERY = gql`
  subscription{
    bundles {
      id
      ethPrice
    }
  }
`;

export const GET_TOKEN_DATA = gql`
  subscription Tokens ($id: String!){
    tokens(where: {id: $id}) {
      id
      symbol
      name
      totalLiquidity
      tradeVolume
      txCount
      derivedETH
      totalSupply
      decimals
    }
}
`;

export const GET_MINT = gql`
    subscription Mints ($pair_ids: [Bytes]!) {
    mints (where: {pair_in: $pair_ids}, orderBy: timestamp, orderDirection: desc,  first: 5) {
      id
      to
      timestamp
      amount0
      amount1
      amountUSD
    }
  }
`;

export const GET_BURN = gql`
    subscription Burns ($pair_ids: [Bytes]!) {
    burns (where: {pair_in: $pair_ids}, orderBy: timestamp, orderDirection: desc,  first: 5) {
      id
      sender
      timestamp
      amount0
      amount1
      amountUSD
    }
  }
`;


export const TOKEN_CHART = gql`
  query TokenDayDatas($tokenAddr: String!, $skip: Int!) {
    tokenDayDatas(first: 1000, skip: $skip, orderBy: date, orderDirection: desc, where: { token: $tokenAddr }) {
      id
      date
      priceUSD
      totalLiquidityToken
      totalLiquidityUSD
      totalLiquidityETH
      dailyVolumeETH
      dailyVolumeToken
      dailyVolumeUSD
      mostLiquidPairs {
        id
        token0 {
          id
          derivedETH
        }
        token1 {
          id
          derivedETH
        }
      }
    }
  }
`

export const NEWLY_TOKENS = gql`
  subscription Pairs($date: String) {
    pairs (first: 10, orderBy: createdAtTimestamp, orderDirection: desc, where: {createdAtTimestamp_gte: $date, volumeUSD_gt: 2000000}) {
      id
      token1 {
        name
        symbol
        id
        decimals
      }
      token0 {
        name
        symbol
        id
        decimals
      }
      createdAtTimestamp
      volumeUSD
      volumeToken0
      volumeToken1
      untrackedVolumeUSD
    }
  }

`

export const ETH_PAIR_SEARCH = gql`
  query Pairs {
    pairs (first: 10, orderBy:txCount, orderDirection: desc,  where: {id_in: ["0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc", "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11", "0x811beed0119b4afce20d2583eb608c6f7af1954f", "0xd3d2e2692501a5c9ca623199d38826e513033a17", "0xbb2b8038a1640196fbe3e38816f3e67cba72d940", "0xf82d8ec196fb0d56c6b82a8b1870f09502a49f88", "0xa2107fa5b38d9bbd2c461d6edf11b11a50f6b974", "0x2fdbadf3c4d5a8666bc06645b8358ab803996e28", "0xb6ca52c7916ad7960c12dc489fd93e5af7ca257f", "0xce84867c3c02b05dc570d0135103d3fb9cc19433"]}) {
    token0 {
      id
      symbol
      name
      derivedETH
      decimals
    }
    token1 {
      id
      symbol
      name
      decimals
    }
    id
    reserve0
    reserve1
    totalSupply
    txCount
    liquidityProviderCount
  }
}
`

export const ETH_PAIR_SEARCH1 = gql`
  query Pairs {
    pairs (first: 10, orderBy: txCount, orderDirection: desc, where: {token1: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}) {
      token0 {
        id
        symbol
        name
        decimals
      }
      token1 {
        id
        symbol
        name
        decimals
      }
      id
      reserve0
      reserve1
      totalSupply
      txCount
      liquidityProviderCount
    }
}
`