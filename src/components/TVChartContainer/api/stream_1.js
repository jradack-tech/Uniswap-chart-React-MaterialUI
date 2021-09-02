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
  subscription TokenDayDatas($id: String!) {
    tokenDayDatas(first: 1, orderBy: date, orderDirection: desc, where: { token: $id }) {
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
`;

window.id = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

// console.log("here", id);
var observer;

var _subs = []

export default {
 subscribeBars: async function(symbolInfo, resolution, updateCb, uid, resetCache) {
  if (observer !== undefined) {
    observer.subscribe().unsubscribe();
    console.log(observer.subscribe().closed())
    observer = null;
  }
  console.log("R====", resolution)
  window.id = symbolInfo.name
  
  observer = client.subscribe({query: ETH_PRICE_QUERY, variables: { id: symbolInfo.name}});
  console.log(observer);
    // symbol_name_array = symbolInfo.name.split("-");
  // console.log(historyProvider.history[symbolInfo.name].lastBar);
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
  console.log(observer.subscribe())

  observer.subscribe().unsubscribe();

  observer = null;
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
     console.log("data***", rounded)
     // console.log((new Date(lastBar.time)).getDate() + 1);
     // console.log((new Date()).getDate());
   
  if ((new Date()).getDate() > (new Date(lastBar.time)).getDate() + 1) {
      // create a new candle, use last close as open **PERSONAL CHOICE**
      _lastBar = {
       time: rounded,
       open: lastBar.close,
       high: lastBar.close,
       low: lastBar.close,
       close: parseFloat(data.tokenDayDatas[0].priceUSD),
       volume: parseFloat(data.tokenDayDatas[0].dailyVolumeToken)
      }
   } else {
      // if (data.tokenDayDatas.length !== 0) {
        // update lastBar candle!
        // console.log(data.tokenDayDatas)
        if (data.tokenDayDatas[0].priceUSD < lastBar.low) {
         lastBar.low = parseFloat(data.tokenDayDatas[0].priceUSD)
        } else if (data.tokenDayDatas[0].priceUSD > lastBar.high) {
         lastBar.high = parseFloat(data.tokenDayDatas[0].priceUSD)
        }
        
        lastBar.volume = parseFloat(data.tokenDayDatas[0].dailyVolumeToken)
        lastBar.close = parseFloat(data.tokenDayDatas[0].priceUSD)
        _lastBar = lastBar
        // console.log(_lastBar);
      // }
   }
   return _lastBar
}

// // takes symbolInfo object as input and creates the subscription string to send to CryptoCompare
// function createChannelString(symbolInfo) {
//   var channel = symbolInfo.name.split(/[:/]/)
//   const exchange = channel[0] === 'GDAX' ? 'Coinbase' : channel[0]
//   const to = channel[2]
//   const from = channel[1]
//  // subscribe to the CryptoCompare trade channel for the pair and exchange
//   return `0~${exchange}~${from}~${to}`
// }


setTimeout(() => {
  if (observer !== undefined || observer !== null)  {
    console.log(_subs[_subs.length - 1]);
    observer.subscribe({
        next({data}) {
          console.log(data);
          // console.log(data);
           var sub = _subs[_subs.length - 1];
           
           if (sub) {
            // if ((new Date()).getTime() / 1000 < sub.lastBar.time / 1000) {
            //   return
            //  }
            
            var _lastBar = updateBar(data, sub)
    
            // send the most recent bar back to TV's realtimeUpdate callback
           // console.log("obs3 + ", _lastBar)
            sub.listener(_lastBar)
            // update our own record of lastBar
            sub.lastBar = _lastBar
           }
        },
        error(err) { console.error('err', err); },
      });}
}, 30000)

  

