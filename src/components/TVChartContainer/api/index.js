import historyProvider from './historyProvider'
import stream from './stream'

const supportedResolutions = ["30", "60", "120", "240", "1440", "W", "M"]

const config = {
    supported_resolutions: supportedResolutions
}; 

var custom_resolution = "30";

export default {
	onReady: cb => {
		console.log('=====onReady running')	
		setTimeout(() => cb(config), 0)
		
	},
	searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
		console.log('====Search Symbols running')
	},
	resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
		// expects a symbolInfo object in response
		console.log('======resolveSymbol running')
		// console.log('resolveSymbol:',{symbolName})
		// var split_data = symbolName.split(/[:/]/)
		// console.log(symbolName)
		historyProvider.resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback);
		
		
		// onResolveErrorCallback('Not feeling it today')

	},
	getBars: function(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
		// console.log('=====getBars running')
		// console.log('function args',arguments)
		// console.log(`Requesting bars between ${new Date(from * 1000).toISOString()} and ${new Date(to * 1000).toISOString()}`)
		historyProvider.getBars(symbolInfo, resolution, from, to, firstDataRequest)
			.then(bars => {
				if (bars.length) {
					onHistoryCallback(bars, {noData: false})
				} else {
					onHistoryCallback(bars, {noData: true})
				}
				// console.log("here+++", bars);
			}).catch(err => {
				console.log({err})
				onErrorCallback(err)
			})

	},
	subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
		console.log('=====subscribeBars runnning', symbolInfo)
		stream.subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback)
	},
	unsubscribeBars: subscriberUID => {
		console.log('=====unsubscribeBars running')

		stream.unsubscribeBars(subscriberUID)
	},
	// calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
	// 	//optional
	// 	console.log('=====calculateHistoryDepth running', resolution)


	// },
	getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
		//optional
		console.log('=====getMarks running')
	},
	getTimeScaleMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
		//optional
		console.log('=====getTimeScaleMarks running')
	},
	getServerTime: cb => {
		console.log('=====getServerTime running')
	}
}
