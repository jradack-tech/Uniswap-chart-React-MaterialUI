// import { GET_PAIR_ADDRESS, GET_TOKEN_NAME } from './bitqueries'

const url = "https://graphql.bitquery.io/";

const opts = (query) => ({
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "X-API-KEY": "BQYvhnv04csZHaprIBZNwtpRiDIwEIW9"
    },
    body: JSON.stringify({
        query
    })
});


export const getData = async (symbolInfo, customFrom, customTo, resolution, latestBar) => {
    console.log(resolution, "===", symbolInfo.name)
    
    var str = symbolInfo.name.split("|");
    console.log(str[0], "==================", str[1]);
    var query = `
        query {
            ethereum {
              dexTrades(
                options: {asc: "timeInterval.minute"}
                exchangeName: {in: ["Uniswap", "Uniswap v2"]}
                date: {since: "${(new Date(customFrom * 1000)).toISOString()}", till: "${(new Date(customTo * 1000)).toISOString()}"}
                baseCurrency: {is: "${str[0]}"}
                quoteCurrency: {is: "${str[1]}"}
              ) {
                timeInterval {
                  minute(count: ${resolution})
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


    var res = await fetch(url, opts(query))
    var data = await res.json()

    var bars = [];

    console.log("init", data.data.ethereum.dexTrades);
    // if (!first) {
    //     console.log('CryptoCompare API error:')
    // }
    

    if (data.data.ethereum.dexTrades.length !== 0) {
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
            return element;
        })
        // console.log(elements)
        bars = elements.map((el, k) => {
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
        })
    }

    // console.log(bars)

    return bars;
}
    