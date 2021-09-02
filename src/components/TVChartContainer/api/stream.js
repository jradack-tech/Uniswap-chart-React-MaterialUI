// api/stream.js
import historyProvider from './historyProvider.js'
import { useQuery, gql, ApolloProvider, ApolloClient, InMemoryCache, split, HttpLink, useSubscription } from '@apollo/client';
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from '@apollo/client/utilities';
const store = require('../../../store.js');


var selected_token = null;
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

window.id = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

// console.log("here", id);
var observer = client.subscribe({query: ETH_PRICE_QUERY});

var _subs = []

// export const setResolution = (symbolInfo=null, resolution, updateCb=null, uid=0) => {
//   if (uid === 0) {
//     var tempElement = _subs[_subs.length - 1];
//     var temp = _subs.slice(0, _subs.length - 1);
//     var ele = {
//        temp.uid,
//        resolution,
//        temp.symbolInfo,
//        lastBar: historyProvider.history[symbolInfo.name].lastBar,
//        listener: temp.updateCb,
//     }
//     temp.push(ele);
//     _subs = [...temp];
//   } else {
//     var newSub = {
//        uid,
//        resolution,
//        symbolInfo,
//        lastBar: historyProvider.history[symbolInfo.name].lastBar,
//        listener: updateCb,
//       }
//     _subs.push(newSub)
//     console.log(_subs);
//   }
    
// }

export default {
 subscribeBars: async function(symbolInfo, resolution, updateCb, uid, resetCache) {
  console.log("R====", resolution)
  window.id = symbolInfo.name
  
  // setResolution(symbolInfo, resolution, updateCb, uid)
    // symbol_name_array = symbolInfo.name.split("-");
  // console.log(historyProvider.history[symbolInfo.name].lastBar);
    console.log(historyProvider.history[symbolInfo.name]);
    var newSub = {
     uid,
     resolution,
     symbolInfo,
     lastBar: historyProvider.history[symbolInfo.name].lastBar,
     listener: updateCb,
    }
  _subs.push(newSub)
 },
 unsubscribeBars: function(uid) {
  // var subIndex = _subs.findIndex(e => e.uid === uid)
  // if (subIndex === -1) {
  //  //console.log("No subscription found for ",uid)
  //  return
  // }
  // var sub = _subs[subIndex]
  // socket.emit('SubRemove', {subs: [sub.channelString]})
  // _subs.splice(subIndex, 1)
 }
}


// Take a single trade, and subscription record, return updated bar
function updateBar(data, sub) {
  // console.log(data);
   var lastBar = sub.lastBar
   let resolution = sub.resolution
   // if (resolution.includes('D')) {
   //    // 1 day in minutes === 1440
   //    resolution = 1440
   // } else if (resolution.includes('W')) {
   //    // 1 week in minutes === 10080
   //    resolution = 10080
   // }
  var coeff = resolution * 60
     console.log(resolution);
     var rounded = Math.floor((new Date()).getTime() / coeff) * coeff
     var lastBarSec = lastBar.time / 1000
     var _lastBar
     // console.log("data***", rounded)
     // console.log((new Date(lastBar.time)).getDate() + 1);
     // console.log((new Date()).getDate());
   
  if ((new Date()).getTime() / 1000 - (new Date(lastBar.time)).getTime() / 1000 > 1800) {
      // create a new candle, use last close as open **PERSONAL CHOICE**
      _lastBar = {
       time: rounded,
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
   return _lastBar
}


if (observer !== null)  {observer.subscribe({
      next(aaaa) {
        // console.log(aaaa.data.bundles[0].ethPrice);
        // console.log(data);
         var sub = _subs[_subs.length - 1];
         
         if (sub) {
          // if ((new Date()).getTime() / 1000 < sub.lastBar.time / 1000) {
          //   return
          //  }
          // console.log("hi-", sub);

          client.query({query: PRICE_QUERY, variables: { id: sub.symbolInfo.name }})
            .then(({data}) => {
              console.log("he", data.tokens[0].derivedETH * aaaa.data.bundles[0].ethPrice);
                var data1 = {
                  priceUSD: 0,
                  tradeVolume: 0
                };
                data1.priceUSD = data.tokens[0].derivedETH * aaaa.data.bundles[0].ethPrice;
                data1.tradeVolume = data.tokens[0].tradeVolume;

                var _lastBar = updateBar(data1, sub)
      
                // send the most recent bar back to TV's realtimeUpdate callback
               // console.log("obs3 + ", _lastBar)
                sub.listener(_lastBar)
                // update our own record of lastBar
                sub.lastBar = _lastBar
            })
          
          
             
         }
      },
      error(err) { console.error('err', err); },
    });}

