import { getData } from "./helper"
import Axios from 'axios';


import { useQuery, gql, ApolloProvider, ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from '@apollo/client/utilities';



const httpLink = new HttpLink({
  uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'
});

const wsLink = new WebSocketLink({
  uri: 'wss://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
  options: {
    reconnect: true,
    connectionParams: {
      headers: {
        Authorization: "Bearer yourauthtoken",
      },
    },
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});

const ETH_PRICE_QUERY = gql`
  subscription{
    bundles {
      id
      ethPrice
    }
  }
`;

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

const PRICE_QUERY = gql`
  query Tokens ($id: String!) {
    tokens(where: {id: $id}) {
      id
      symbol
      name
      totalLiquidity
      tradeVolume
      txCount
      derivedETH
      totalSupply
    }
  }
`;

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







const configurationData = {
    supported_resolutions: ['15', '30', '60', '240', '720', '1440'],
};

const INTERVAL_SECONDS = {
    '1m': 60,
    '5m': 300,
    '10m': 600,
    '15m': 900,
    '30m': 1800,
    '1h': 3600,
    '4h': 14400,
    '12h': 43200,
    '24h': 86400
}

const url = "https://graphql.bitquery.io/";

export default function buildDatafeed(pairInfo, pricescale) {
    
    var lastFrom
    var latestBar
    var initialPriceSet = false

    function convertResolution(resolution) {
        var interval
        if(resolution === '1') {
            interval = '1m'
        } else if(resolution === '5') {
            interval = '5m'
        } else if (resolution === '10') {
            interval = '10m'
        } else if (resolution === '15') {
            interval = '15m'
        } else if( resolution ==='30') {
            interval = '30m'
        } else if(resolution === '60') {
            interval = '1h'
        } else if (resolution === '240') {
            interval = '4h'
        } else if (resolution === '720') {
            interval = '12h'
        } else if (resolution === '1440') {
            interval = '24h'
        } else {
            interval = resolution
        }
        return interval
    }

    var allbars = [];
    var beforeResolution, currentResolution, count = 0;

    var observer = client.subscribe({query: ETH_PRICE_QUERY});

    var _subs = []

    return {
        onReady: (callback) => {
            setTimeout(() => callback(configurationData));
        },
        searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
            onResultReadyCallback([{
                symbol: 'test1',
                full_name: 'test test',
                description: 'test desc',
                exchange: 'exchange test',
                typ: 'crypto'
            }])
        },
        resolveSymbol: async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
            var str = symbolName.split("|");
            var {data} = await client.query({query: FEED_SEARCH_QUERY, variables: { id: str[0] }});

            setTimeout(() => onSymbolResolvedCallback({
                minmov: 1,
                pricescale,
                name: symbolName,
                ticker: symbolName,
                session: '24x7',
                timezone: 'America/New_York',
                description: data.tokens[0].symbol ? (data.tokens[0].symbol + "/USD") : "USD",
                supported_resolution:  ['15', '30', '60', '240', '720', '1440'],
                has_intraday: true,
                intraday_multipliers:  ['15', '30', '60', '240', '720', '1440'],
                volume_precision: 2,
            }))
        },
        getBars: (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, first) => {

            currentResolution = resolution;
            if (!beforeResolution) {
                beforeResolution = resolution;
            } 


            var interval = convertResolution(resolution)
            const seconds = INTERVAL_SECONDS[interval]

            var customFrom, customTo
            if(lastFrom) {
                customTo = lastFrom - seconds
                customFrom = customTo - 200 * seconds
            } else {
                customTo = Math.floor(new Date().getTime() / 1000)
                customFrom = Math.floor(new Date().getTime() / 1000) - 200 * seconds
            }



            if (beforeResolution !== currentResolution) {
                console.log("bump")
                allbars = [];
                beforeResolution = currentResolution;
                customTo = Math.floor(new Date().getTime() / 1000)
                customFrom = Math.floor(new Date().getTime() / 1000) - 200 * seconds
                count = 0;
                latestBar = null;
                // setTimeout(() => onHistoryCallback(allbars, {noData: false }))
            }

            lastFrom = customFrom

            console.log("from-", customFrom, "to-", customTo, "countBack", symbolInfo.name);

            Axios.post("https://graphapi.realcharts.io/api/ohlc/uniswap", {
                symbol: symbolInfo.name,
                customFrom,
                customTo,
                resolution
            })
                .then(res => {
                    // console.log("result", result)
                    var result = res.data;

                    var bars = result.map(p => {
                        var date
                        if(isNaN(p.time)) {
                            date = new Date(p.time)
                        } else {
                            date = new Date(p.time)
                        } 
                        return {
                            time: date.getTime(),
                            open: p.open,
                            close: p.close,
                            low: p.low,
                            high: p.high,
                            volume: p.volume
                        }
                    })

                    console.log(allbars.length)
                        
                    if(bars.length > 0) {
                        console.log("bingo")
                        latestBar = bars[bars.length - 1]
                        for (var i = 0; i < bars.length; i ++) {
                            var duplicateIndex = allbars.findIndex(bar => bar.time === bars[i].time)
                            if (duplicateIndex !== -1) allbars.splice(duplicateIndex, 1);
                        }
                        allbars = [...bars, ...allbars]
                        
                        setTimeout(() => onHistoryCallback(allbars, {noData: false }))
                        // bars = [];
                        // if(!initialPriceSet) {
                        //     // handlePriceChange(latestBar.close)
                        //     initialPriceSet = true
                        // }
                        // onHistoryCallback(bars, {noData: false})
                    } else {
                        // while (count < 100) {
                        //     console.log(count)
                        //     // onHistoryCallback(allbars, {noData: false })
                        //     setTimeout(() => onHistoryCallback(allbars, {noData: false }))
                        //     count ++;
                        //     // latestBar = null
                        // }
                        // if (count >= 100) {
                            setTimeout(() => onHistoryCallback([], { noData: true }))
                        // }
                    }
                    
                })
                .catch(console.error);

        },
        subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
            console.log('[subscribeBars]: Method call with subscribeUID:', subscribeUID);
            const seconds = INTERVAL_SECONDS[convertResolution(resolution)]
            var str = symbolInfo.name.split("|");

            var newSub = {
                subscribeUID,
                resolution,
                symbolInfo,
                lastBar: latestBar,
                listener: onRealtimeCallback,
            }
            _subs.push(newSub)

            console.log(observer)

            if (observer !== null)  {observer.subscribe({
                next(aaaa) {
                    console.log(aaaa.data.bundles[0].ethPrice);
                    var sub = _subs[_subs.length - 1];
                    
                    if (sub) {

                     client.query({query: PRICE_QUERY, variables: { id: str[0] }})
                        .then(({data}) => {
                            console.log("he", data.tokens[0].derivedETH * aaaa.data.bundles[0].ethPrice);
                            var data1 = {
                              priceUSD: 0,
                              tradeVolume: 0
                            };
                            data1.priceUSD = data.tokens[0].derivedETH * aaaa.data.bundles[0].ethPrice;
                            data1.tradeVolume = data.tokens[0].tradeVolume;
            
                            var _lastBar = updateBar(data1, sub)
                    
                           // console.log("obs3 + ", _lastBar)
                            sub.listener(_lastBar)
                            // update our own record of lastBar
                            sub.lastBar = _lastBar
                        })
                    }
                },
                error(err) { console.error('err', err); },
            });}

                
        },
        unsubscribeBars: (subscriberUID) => {
            console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
            // // endPolling()
            observer = null;
            lastFrom = null
        },

    }

    // Take a single trade, and subscription record, return updated bar
    function updateBar(data, sub) {
      // console.log(data);
       var lastBar = sub.lastBar
       let resolution = sub.resolution
       console.log(resolution)

         var _lastBar;
         const seconds = INTERVAL_SECONDS[convertResolution(resolution)]
         var txTime = Math.floor((new Date()).getTime() / seconds) * seconds
         
         console.log(txTime)
        
        if (lastBar) {
            if (2 * seconds * 1000 >= txTime - lastBar.time && txTime - lastBar.time >= seconds * 1000) {
              // create a new candle, use last close as open **PERSONAL CHOICE**
              console.log(txTime - lastBar.time)
              _lastBar = {
               time: (new Date(lastBar.time)).getTime() + seconds * 1000,
               open: lastBar.close,
               high: lastBar.close,
               low: lastBar.close,
               close: parseFloat(data.priceUSD),
               volume: parseFloat(lastBar.volume)
              }
           } else {
              // if (data.tokenDayDatas.length !== 0) {
                // update lastBar candle!
                // console.log(data.tokenDayDatas)
                if (data.priceUSD < lastBar.low) {
                 lastBar.low = parseFloat(data.priceUSD)
                } else if (data.priceUSD > lastBar.high) {
                 lastBar.high = parseFloat(data.priceUSD)
                }
                
                lastBar.volume = parseFloat(lastBar.volume)
                lastBar.close = parseFloat(data.priceUSD)
                _lastBar = lastBar
                // console.log(_lastBar);
              // }
           }
        } 
        // else {
        //     _lastBar = {
        //        time: txTime,
        //        open: data.priceUSD,
        //        high: data.priceUSD,
        //        low: data.priceUSD,
        //        close: parseFloat(data.priceUSD),
        //        volume: parseFloat(0)
        //     }
        // }

       return _lastBar
    }

}


    