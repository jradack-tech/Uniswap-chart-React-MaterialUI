import React, {useState, useEffect, Fragment} from 'react';
import $ from 'jquery';
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';

import TradingViewWidget, { Themes } from 'react-tradingview-widget';

import { gql, useQuery, useLazyQuery, useSubscription  } from '@apollo/client';

import { TVChartContainer } from '../TVChartContainer';

import {getTokenLists} from '../../constants';
import {setTokenId, setTokens} from '../../actions/tokens';

import Moment from "react-moment"
import eventBus from "../eventBus";

import { widget } from './charting_library';
import buildDatafeed from './datafeed.js';

import { 
	ETH_PRICE_QUERY_FIRST,
	FEED_SEARCH_QUERY,
	EXTRA_SEARCH_QUERY,
	POOL_SEARCH_QUERY,
	PAIRS_SEARCH_QUERY,
	ETH_PRICE_QUERY,
	GET_TOKEN_DATA,
	GET_MINT,
	GET_BURN,
	TOKEN_CHART,
	NEWLY_TOKENS
} from "./queries";

const url = "https://graphql.bitquery.io/";


var selected_data = null, ethPrice = null, recommended_tokens = [];
var transactions = [], transactions1 = [], transactions2 = [];
var pair_ids = [];
var change_flag = false, newly_flag = true;
var prev_mint_id, prev_burn_id, isExtraAdd = false;
var flag = true;
var myInterval_5;
var newDate = (new Date()) / 1000 - 518400;

setInterval(() => {
	newly_flag = true;
}, 300000)

function Uniswapexplorer (props) {
	var myInterval = 0, interval_flag = true;
	const dispatch = useDispatch();
	const [token_name, setToken_name] = useState("");
	const [token_id, setToken_id] = useState("");
	const [txs, setTxs] = useState([]);
	const [newly_tokens, setNewly_tokens] = useState([]);
	const [socialLinks, setSocialLinks] = useState(null);
	const tokenLists = useSelector(state => state.tokens);
	
	const [executeSearch, { loading, data }] = useLazyQuery(
	    FEED_SEARCH_QUERY
	);

	if (data !== undefined && data.tokens.length !== 0) {
		selected_data = data.tokens[0];
	}

	const [executeSearchPair, pair_data] = useLazyQuery(
	    POOL_SEARCH_QUERY
	);

	const [executeSearchPairs, pairs] = useLazyQuery(
	    PAIRS_SEARCH_QUERY
	);

	const [getTokens, token_data] = useLazyQuery(
	    TOKEN_CHART
	);

	const [getExtraTokens, extra_tokens] = useLazyQuery(
	    EXTRA_SEARCH_QUERY
	);

	// const [getNewlytokens, newly_tokens] = useLazyQuery(
	//     NEWLY_TOKENS
	// );

	// @ Get eth price in USD
	ethPrice = useSubscription(ETH_PRICE_QUERY);  

	var selected_token = useSubscription(GET_TOKEN_DATA, {variables: {id: token_id}}); // @ Get Token information



	// =================== @ Get newly tokens subscription
	// var newDate = (new Date()) / 1000 - 43200
	var newly_pairs = useSubscription(NEWLY_TOKENS, {variables: {date: newDate.toFixed(0).toString()}});
	if (newly_flag && newly_pairs.data !== undefined) {
		setNewly_tokens(newly_pairs.data.pairs);
		newly_flag = false;
		console.log("Newly: ", newly_pairs);
	}

	// =================== @ End newly tokens



	// @ Set Pair Ids
	var pair_ids = [];
	if (pairs.data !== undefined && pairs.data.pairs.length !== 0) {
		pairs.data.pairs.forEach(p => {
			pair_ids.push(p.id);
		})
	}

	if (isExtraAdd && (extra_tokens.data !== undefined)) {
		console.log("extra_tokens.data.asSymbol")
		recommended_tokens = [];
		var temp = [];

		if (extra_tokens.data.asSymbol.length !== 0 || extra_tokens.data.asName.length !== 0) {
			if (extra_tokens.data.asSymbol.length <= extra_tokens.data.asName.length) {
				temp = [...extra_tokens.data.asName]; 
				extra_tokens.data.asSymbol.forEach(token => {
					var findToken = extra_tokens.data.asName.find(t => t.address === token.address)
					// console.log(findToken)
					if (!findToken) {
						temp.push(token);
					} else {
						console.log("Exist");
					}
				});

				temp.forEach(token => {
					var findToken = tokenLists.tokens.find(t => t.address === token.id || t.id === token.id)
					// console.log(findToken)
					if (!findToken) {
						recommended_tokens.push(token);
					} else {
						var tempToken = {
							...token,
							logoURI: findToken.logoURI
						}
						recommended_tokens.push(tempToken);
					}
				});
			} else {
				temp = [...extra_tokens.data.asSymbol]; 
				extra_tokens.data.asName.forEach(token => {
					var findToken = extra_tokens.data.asSymbol.find(t => t.address === token.address)
					// console.log(findToken)
					if (!findToken) {
						temp.push(token);
					} else {
						console.log("Exist");
					}
				});

				temp.forEach(token => {
					var findToken = tokenLists.tokens.find(t => t.address === token.id || t.id === token.id)
					// console.log(findToken)
					if (!findToken) {
						recommended_tokens.push(token);
					} else {
						var tempToken = {
							...token,
							logoURI: findToken.logoURI
						}
						recommended_tokens.push(tempToken);
					}
				});
			}
				
		} else {
			if (extra_tokens.data.asAddress.length !== 0) {
				var findToken = tokenLists.tokens.find(t => t.address === extra_tokens.data.asAddress[0].id || t.id === extra_tokens.data.asAddress[0].id)
				// console.log(findToken)
				if (!findToken) {
					recommended_tokens.push(extra_tokens.data.asAddress[0]);
				} else {
					var tempToken = {
						...extra_tokens.data.asAddress[0],
						logoURI: findToken.logoURI
					}
					recommended_tokens.push(tempToken);
				}
			}
		}
		console.log(recommended_tokens)
		isExtraAdd = false;
	}


	if ((selected_token.data !== undefined) && (selected_token.data.tokens.length !== 0)) {
		selected_data = selected_token.data.tokens[0];
	}
	

	useEffect(() => {
	    // ctrending js
	    $(document).ready(function() {
	      $(".box").hide(); //hide
	      $(".red").show(); //set default class to be shown here, or remove to hide all
	    });
	    $(".form-area").change(function() {
	      //on change do stuff
	      $(".box").hide(); //hide all with .box class
	      $("." + $(this).val()).show(); //show selected option's respective element
	    });
	    // dtrending js
	    $(document).ready(function() {
	      $(".box1").hide(); //hide
	      $(".blue").show(); //set default class to be shown here, or remove to hide all
	    });
	    $(".form-area2").change(function() {
	      //on change do stuff
	      $(".box1").hide(); //hide all with .box class
	      $("." + $(this).val()).show(); //show selected option's respective element
	    });

	    if (tokenLists.tokens.length === 0) {
	    	getTokenLists()
			 	.then(res => {
			 		dispatch(setTokens(res));
			 		// onSet(props.match.params.address, false);
	    			console.log("1props.match.params.address")
			 	})
	    } else {
	    	if (flag) {
	    		console.log("2props.match.params.address")
	    		onSet(props.match.params.address, true);
	    		flag = false;
	    	}
	    	
	    } 

	    // const tvWidget
		    new widget({
		      symbol: token_id ? token_id: "SYMBOL", // default symbol
		      interval: '30', // default interval
		      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		      container_id: 'TVChartContainer',
		      datafeed: buildDatafeed("pairInfo", 10000),
		      library_path: '/charting_library/',
		      disabled_features: ['header_symbol_search', 'symbol_search_hot_key', 'timeframes_toolbar'],
		      theme: "Dark",
		      timeframe: '1D',
		      width: '100%',
		      height: '100%',
		      autosize: true,
		    });

	}, [tokenLists])

	var onChange = (e) => {
		// console.clear();
		recommended_tokens = [];
		setToken_name(e.target.value);
		var value = e.target.value;
		if (value !== "") {
			// console.log("wow")
			setTimeout((e) => {
				// Declare variables
				isExtraAdd = true;
				var input, filter, ul, li, a, i, txtValue;
				filter = value.toUpperCase();
				ul = document.getElementById("myUL");
				li = ul.getElementsByTagName('li');

				// Loop through all list items, and hide those who don't match the search query
				for (i = 0; i < li.length; i++) {
				  a = li[i].getElementsByTagName("a")[0];
				  txtValue = a.textContent || a.innerText;
				  if (txtValue.toUpperCase().indexOf(filter) > -1) {
				    li[i].style.display = "";
				  } else {
				    li[i].style.display = "none";
				  }
				}

				// var pattern = new RegExp(value, "i");
				// recommended_tokens = tokenLists.tokens.filter(token => pattern.test(token.name) || pattern.test(token.symbol));
				getExtraTokens({variables: {gte: value.toLowerCase(), lte: value.toUpperCase() + "ZZZZZZZZZZZZZZZZZZZZZZZ", id: value}})
			}, 1500);
		}

	}

	var onSet = (address, first) => {
		console.log("e.target.id");
		runTransactions(address);
		eventBus.dispatch("couponApply", { message: address });
		// selected_data = data.tokens.find(d => d.id === e.target.id);
		setToken_id(address);
		dispatch(setTokenId(address));
		executeSearch({variables: {symbol: address}});
		executeSearchPair({variables: {id: address}});
		executeSearchPairs({variables: {id: address}});
		setToken_name("");
		change_flag = true;
		getSocialLinks(address);
	}

	var onClick = (e) => {
		interval_flag = true;
		clearInterval(myInterval_5)
		props.history.push(e.target.id);
		onSet(e.target.id, false);
	}

	var runTransactions = address => {
		myInterval_5 = setInterval(() => {
			const query = `
			  query {
			    ethereum {
			      dexTrades(options: {limit: 10, desc: "block.height"}, 
			      exchangeName: {is: "Uniswap"}, 
			      baseCurrency: {is: "${address}"}
			      buyCurrency: {in: ["${address}", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "0xdac17f958d2ee523a2206206994597c13d831ec7"]}
            	  sellCurrency: {in: ["${address}", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "0xdac17f958d2ee523a2206206994597c13d831ec7"]}) {
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

			fetch(url, opts)
			    .then(res => res.json())
			    .then(res => {
			    	console.log("TRADE", res.data.ethereum.dexTrades);
			    	if (res.data.ethereum.dexTrades) {
			    		setTxs(res.data.ethereum.dexTrades)
			    	}
			    })
			    .catch(console.error);
		}, 6000);
			
		console.log("setting", myInterval);

	}

	var getSocialLinks = async (address) => {
		var response = await fetch(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${address}`);
		if (response.ok) {
			var json = await response.json();
			setSocialLinks(json);
			console.log("JSON", json);
		} else {
			setSocialLinks(null);
			window.alert("No exist social links");
		}
	}

	// console.log(recommended_tokens);

	// // @ Sort searched tokens
	// if (recommended_tokens.length !== 0) {
	// 	recommended_tokens.sort((a, b) => parseFloat(a.tradeVolume) < parseFloat(b.tradeVolume) ? 1 : -1)
	// }

	var convertString = (str) => {
		if (str.indexOf("usd") !== -1) {
			return str.replace(/ usd/g,"");
		} else {
			return str.replace(/ /g,"-");
		}
	}

	var list = (
		<Fragment>
			{(recommended_tokens.length !== 0) && recommended_tokens.map((token, i) => (
				<li id={token.address !== undefined ? token.address: token.id} key={i}>

						<a id={token.address !== undefined ? token.address: token.id} href="#" onClick={onClick}>
							<img id={token.address !== undefined ? token.address: token.id} src={token.logoURI !== undefined ? token.logoURI : "/assets/images/zero.png"} alt="logo" className="logo-size" />
							 &nbsp;&nbsp;&nbsp;
							{token.name} - {token.symbol} <br />
							<span id={token.address !== undefined ? token.address: token.id} className="token-address">Contract: {token.address !== undefined ? token.address: token.id}</span> <br />
							<span id={token.address !== undefined ? token.address: token.id} className="token-address">Trade Volume: {token.tradeVolume}</span>
						</a>
					
				</li>
			))}
		</Fragment>
	)

	return (
		<div>
			
			<div>
			    <div className="container">
			      <div className="trending-sec">
			        <marquee direction="left" className="trending-box-wrp">{/**/}
			          <div className="trending-box">
			            <ul>
			              <li><a href="#"><b>TOP10:</b></a></li>
			              	{newly_tokens.map((token, i) => (
			              		<li key={i}>
				              	  <a href="#" onClick={onClick} id={token.token0.id} className="ml-3 py-2 first">
				              	    {(i + 1) + "" + token.token0.symbol} {/* <i className="fas fa-angle-double-up arrow-area"></i>
				              	    0% */}
				              	  </a>
				              	</li>
			              	))}
			            </ul>
			          </div>
			        </marquee>{/**/}

			        <div className="search-box pos-relative">
			          <div className="input-group">
			            <input 
			            	onChange={onChange}
			            	value={token_name}
			            	type="text" className="form-control" placeholder="Symbol/Name/Contract Address" />
			            <div className="input-group-append ">
			              <button type="button" className="btn btn-search">
			                <i className="fa fa-search" aria-hidden="true"></i>
			              </button>
			            </div>
			          </div>
		          	  {/*  filter search  */}
		          	  <div className={token_name !== "" ? "pos-absolute" : "pos-absolute non-show"}>
			          	<ul id="myUL">
					  	  {list}
					  	</ul>
			          </div>
			    	  {/*  end filter search  */}
			        </div>

				    

			      </div>

			      <section id="chart-sec2 flex-container">
			        <div className="row">
			          <div className="col-lg-4">
			            <div className="collect-wallet-box">
			              <div className="panel panel-primary">
			                <div className="tab-menu-heading">
			                  <div className="tabs-menu ">
			                    {/* */}
				                    <ul className="nav panel-tabs">
				                      <li>
				                        <a href="#tab1" className="active" data-toggle="tab">Buy</a>
				                      </li>
				                      <li>
				                        <a href="#tab2" data-toggle="tab" className="">Sell</a>
				                      </li>
				                    </ul> 
			                	
			                  </div>
			                </div>
			                <div className="panel-body tabs-menu-body">
			                  <div className="tab-content">
			                    <div className="tab-pane active" id="tab1">

			                	<div className="cooent-box">
			                        <div className="cooent-child1">
			                          <span>No Wallet connected</span>
			                          <select className="custom-select custom-select2"
			                            ><option>UNI</option
			                            ><option value="1">One</option
			                            ><option value="2">Two</option
			                            ><option value="3">Three</option></select
			                          >
			                        </div>
			                        <div className="cooent-child2">
			                          <span>0.0000 USD</span>
			                          <h3>00.00</h3>
			                        </div>
			                      </div>

			                	{/* Display Token Name/Symbol 

			                      	<div className="price-box">
			                      		<div className="price-left">
			                      		</div>
				                        <div className="price-right">
				                        	<p className="display-3 text-center"><b>{(selected_data && ethPrice) && selected_data.symbol + "(" + selected_data.name + ") /" } </b>  USD
			                        		 </p>
				                        </div>
				                    </div>*/}
			                      
			                      <div className="price-box">
			                        <div className="price-left">
			                          <div className="child-price-wrp">
			                            <div className="dollar">
			                              <i className="fas fa-dollar-sign"></i>
			                            </div>
			                            <div className="buy-price">
			                              <span>USD</span>
			                              <p>BUY PRICE</p>
			                            </div>
			                          </div>
			                        </div>
			                        <div className="price-right">
			                          <p>${(selected_data && ethPrice.data) && (parseFloat(selected_data.derivedETH) * parseFloat(ethPrice.data.bundles[0].ethPrice)) }</p>
			                        </div>
			                      </div>
			                      <div className="order-type-wrp">
			                        <div className="order-child1">
			                          <span
			                            >Order Type <i className="far fa-question-circle"></i
			                          ></span>
			                          <p><a href="#">Limit</a> | <a href="#">Market</a></p>
			                        </div>
			                        <div className="order-child2">
			                          <i
			                            className="far fa-arrow-alt-circle-up text-success"
			                          ></i>
			                        </div>
			                      </div>

			                      {/*

			                      <div className="order-type-wrp">
			                        <div className="order-child1">
			                          <span
			                            >Total Liquidity: 
			                          </span>
			                        </div>
			                        <div className="order-child1">
			                          <p>${(selected_data && ethPrice.data) && (parseFloat(selected_data.totalLiquidity)).toFixed(3) }</p>
			                        </div>
			                      </div>

			                      <div className="order-type-wrp">
			                        <div className="order-child1">
			                          <span
			                            >Trade Volume: 
			                          </span>
			                        </div>
			                        <div className="order-child1">
			                          <p>${(selected_data && ethPrice.data) && (parseFloat(selected_data.tradeVolume) * parseFloat(ethPrice.data.bundles[0].ethPrice)).toFixed(3) }</p>
			                        </div>
			                      </div>

			                      <div className="order-type-wrp">
			                        <div className="order-child1">
			                          <span
			                            >Total tx: 
			                          </span>
			                        </div>
			                        <div className="order-child1">
			                          <p>{(selected_data && ethPrice.data) && parseFloat(selected_data.txCount) }</p>
			                        </div>
			                      </div>

								*/}
			                      <div className="usdt-box">
			                        <div className="usdt-box1">
			                          <span>No Wallet connected</span>
			                          <select className="custom-select custom-select3"
			                            ><option >USTD</option
			                            ><option value="1">One</option
			                            ><option value="2">Two</option
			                            ><option value="3">Three</option></select
			                          >
			                        </div>
			                        <div className="usdt-box2">
			                          <span>0.0000 USD</span>
			                          <p>00.00</p>
			                        </div>
			                      </div>
			                  
			                      <div className="btn-connect-wrp">
			                        <button>Connect Wallet</button>
			                      </div>
			                  
			                    </div>
			                    <div className="tab-pane" id="tab2">
			                      <div className="cooent-box">
			                        <div className="cooent-child1">
			                          <span>No Wallet connected</span>
			                          <select className="custom-select custom-select2"
			                            ><option >UNI</option
			                            ><option value="1">One</option
			                            ><option value="2">Two</option
			                            ><option value="3">Three</option></select
			                          >
			                        </div>
			                        <div className="cooent-child2">
			                          <span>0.0000 USD</span>
			                          <h3>00.00</h3>
			                        </div>
			                      </div>
			                      <div className="price-box">
			                        <div className="price-left">
			                          <div className="child-price-wrp">
			                            <div className="dollar">
			                              <i className="fas fa-dollar-sign"></i>
			                            </div>
			                            <div className="buy-price">
			                              <span>USD</span>
			                              <p>BUY PRICE</p>
			                            </div>
			                          </div>
			                        </div>
			                        <div className="price-right">
			                          <p>$31.095176232306265</p>
			                        </div>
			                      </div>
			                      <div className="order-type-wrp">
			                        <div className="order-child1">
			                          <span
			                            >Order Type <i className="far fa-question-circle"></i
			                          ></span>
			                          <p><a href="#">Limit</a> | <a href="#">Market</a></p>
			                        </div>
			                        <div className="order-child2">
			                          <i
			                            className="far fa-arrow-alt-circle-up text-success"
			                          ></i>
			                        </div>
			                      </div>
			                      <div className="usdt-box">
			                        <div className="usdt-box1">
			                          <span>No Wallet connected</span>
			                          <select className="custom-select custom-select3"
			                            ><option >USTD</option
			                            ><option value="1">One</option
			                            ><option value="2">Two</option
			                            ><option value="3">Three</option></select
			                          >
			                        </div>
			                        <div className="usdt-box2">
			                          <span>0.0000 USD</span>
			                          <p>00.00</p>
			                        </div>
			                      </div>
			                      <div className="btn-connect-wrp">
			                        <button>Connect Wallet</button>
			                      </div>
			                    </div>
			                  </div>
			                </div>
			              </div>
			            </div>
			          </div>


			          <div className="col-lg-8">
			            <div className="inner-chart">
			            	<div id="TVChartContainer" className="TVChartContainer" />
			            	{/*<TVChartContainer match={props.match} />*/}
			            	{/*
			               	<img src="/assets/images/chart1.jpg" /> 
			              	*/}

			            </div>
			          </div>
			        </div>

			        {/*
						<div className="row mt-5">
							<div className="col-lg-12">
								<TVChartContainer />
							</div>
			        	</div>
			       	*/}
			        

			      </section>
			      
			      {/* <OtherTables /> */}
			      <section id="trade-sec">
			        <div className="row">
			          <div className="col-lg-4">
			            <div className="trade-wrp">
			              <ul className="mt-4 token-info-list card">
			                <li className="pair-name">
			                  <div className="small_icon">
			                    <div className="top_btn">
			                      <button type="button" className="btn">Trade</button>
			                      <div className="commmunity-icon-wrp">
			                        <a href={"https://etherscan.io/token/" + props.match.params.address} target="_blank"
			                          ><img src="/assets/images/icon1.f856abc5.png"
			                        /></a>
			                        <a href={"https://unicrypt.network/amm/uni/token/" + props.match.params.address} target="_blank"
			                          ><img
			                            src="data:image/png;base64,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"
			                        /></a>
			                        <a href={socialLinks !== null && "https://www.coingecko.com/en/coins/" + socialLinks.id} target="_blank"
			                          ><img src="/assets/images/icon3.4c144ffe.png"
			                        /></a>
			                        <a href={socialLinks !== null && "https://t.me/" + socialLinks.links.telegram_channel_identifier} target="_blank"
			                          ><img
			                            src="data:image/png;base64,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"
			                        /></a>{/**/}
			                        <a href={socialLinks !== null && "https://twitter.com/" + socialLinks.links.twitter_screen_name} target="_blank"
			                          ><img
			                            src="data:image/png;base64,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"
			                        /></a>
			                        <a href="https://quickswap.exchange/" target="_blank"
			                          ><img
			                            src="data:image/png;base64,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"
			                        /></a>
			                      </div>
			                      <button type="button" className="btn">
			                        <i className="fas fa-heart"></i>
			                      </button>
			                    </div>
			                  </div>
			                </li>
			                <li>
			                  <div className="total-wrp">
			                    <div className="uni-name">
			                    	<span> 
				                    	<b>{(selected_data && ethPrice) && selected_data.symbol }
				                    		<small>({(selected_data && ethPrice) &&selected_data.name})</small> 
				                    	</b>
			                    	</span>
			                    </div>
			                    <div className="left-content-per">
			                      <h3></h3>
			                    </div>
			                  </div>
			                </li>
			                <li>
			                  <div className="total-wrp">
			                    <div className="uni-name"><span></span></div>
			                    <div className="left-content-per">
			                      <h3>
			                      $ {(selected_data && ethPrice.data) && (parseFloat(selected_data.derivedETH) * parseFloat(ethPrice.data.bundles[0].ethPrice))}
			                      </h3>
			                    </div>
			                  </div>
			                </li>
			                <li className="my-1 data-volume">
			                  <span>Market cap : </span
			                  ><span className="data-volume-right"> 
			                  	$ {(selected_data && ethPrice.data) && (parseFloat(selected_data.derivedETH) * parseFloat(ethPrice.data.bundles[0].ethPrice) * parseFloat(selected_data.totalSupply)).toFixed(3) }
			                  </span>
			                </li>
			                <li className="my-1 data-volume">
			                  <span>Circulating supply : </span
			                  ><span className="data-volume-right"> 
			                  	{(selected_data && ethPrice.data) && parseFloat(selected_data.totalSupply) }
			                  </span>
			                </li>
			            {/*
			            	<li className="my-1 data-volume">
			                  <span>Website : </span
			                  ><span className="data-volume-right">NA</span>
			                </li>
			                <li className="my-1 data-volume">
			                  <span>Contract : </span
			                  ><span className="data-volume-right"
			                    ><span className="begintext">testhello</span></span
			                  >
			                </li>
			            */}
			                
			                <li className="my-1 data-volume">
			                  <span>Pool ETH : </span
			                  ><span className="data-volume-right"> 
			                  		{(pair_data.data !== undefined && pair_data.data.pairs.length !== 0) && parseFloat(pair_data.data.pairs[0].reserve1).toFixed(2)}
			                  </span>
			                </li>
			                <li className="my-1 data-volume">
			                  <span>Pooled {(selected_data !== null) ? selected_data.symbol: ""} : </span
			                  ><span className="data-volume-right">
			                  		{(pair_data.data !== undefined && pair_data.data.pairs.length !== 0) && parseFloat(pair_data.data.pairs[0].reserve0).toFixed(2)}
			                  </span>
			                </li>

			              </ul>
			            </div>
			            <div className="rating-box-wrp">
			              <div className="rating-box">
			                <div className="rating-box1">
			                  <div className="circle-progressbar">Yes</div>
			                  <b>Lp locked</b>
			                </div>
			                <div className="rating-box1">
			                  <div className="circle-progressbar">Yes</div>
			                  <b>TT locked</b>
			                </div>
			                <div className="rating-box1">
			                  <div className="circle-progressbar red-d">No</div>
			                  <b>Minting</b>
			                </div>
			                <div className="rating-box1">
			                  <div className="circle-progressbar red-d">No</div>
			                  <b>Audit</b>
			                </div>
			                <div className="rating-box1">
			                  <div className="progress blue">
			                    <span className="progress-left">
			                      <span className="progress-bar"></span>
			                    </span>
			                    <span className="progress-right">
			                      <span className="progress-bar"></span>
			                    </span>
			                    <div className="progress-value">Low</div>
			                  </div>
			                  <b>Risk Level</b>
			                </div>
			              </div>
			              <div className="col-sm-12">
			                <div className="wrp-comunity">
			                  <div className="community-content"><h3>Community trust</h3></div>
			                  <div className="like-progressbar">
			                    <div className="progress2">
			                      <span className="left-like"
			                        ><i className="far fa-thumbs-up"></i>70%</span
			                      >
			                      {/*<div
			                        role="progressbar"
			                        aria-valuenow="5"
			                        aria-valuemin="0"
			                        aria-valuemax="100"
			                        className="progress-bar bg-success"
			                        style={{width:100}}

			                      ></div>
			                      <div
			                        role="progressbar"
			                        aria-valuenow="30"
			                        aria-valuemin="0"
			                        aria-valuemax="100"
			                        className="progress-bar bg-warning"
			                        style={{width:100}}

			                      ></div>
			                  */}
			                      <span><i className="far fa-thumbs-down"></i>30%</span>
			                    </div>
			                  </div>
			                </div>
			              </div>
			            </div>
			            <div className="whatchlist-wrp">
			              <div>
			                <div className="panel panel-primary">
			                  <div className="tab-menu-heading">
			                    <div className="tabs-menu ">
			                      {/* Tabs */}
			                      <ul className="nav panel-tabs">
			                        <li>
			                          <a href="#tab5" className="active" data-toggle="tab"
			                            >Watchlist</a
			                          >
			                        </li>
			                        <li>
			                          <a href="#tab6" data-toggle="tab" className=""
			                            >Top gainers</a
			                          >
			                        </li>
			                        <li>
			                          <a href="#tab7" data-toggle="tab">Top losers</a>
			                        </li>
			                      </ul>
			                    </div>
			                  </div>
			                  <div className="panel-body tabs-menu-body">
			                    <div className="tab-content">
			                      <div className="tab-pane active" id="tab5">
			                        <div className="list-watch">
			                          <ul>
			                            <li>
			                              <div className="wrp-listcontent">
			                                <div className="watchlist-img">
			                                  <img
			                                    src="/assets/images/unitrade.c68e3a38.png"
			                                  />
			                                </div>
			                                <div className="watchlist-content">
			                                  <h4>UniTrade</h4>
			                                </div>
			                              </div>
			                            </li>
			                            <li>
			                              <div className="wrp-listcontent">
			                                <div className="watchlist-img">
			                                  <img
			                                    src="/assets/images/unilayer.a88824b7.png"
			                                  />
			                                </div>
			                                <div className="watchlist-content">
			                                  <h4>Unilayer</h4>
			                                </div>
			                              </div>
			                            </li>
			                            <li>
			                              <div className="wrp-listcontent">
			                                <div className="watchlist-img">
			                                  <img
			                                    src="/assets/images/unilogo.77e75417.png"
			                                  />
			                                </div>
			                                <div className="watchlist-content">
			                                  <h4>Uniswap</h4>
			                                </div>
			                              </div>
			                            </li>
			                            <li>
			                              <div className="wrp-listcontent">
			                                <div className="watchlist-img">
			                                  <img
			                                    src="/assets/images/unitrade.c68e3a38.png"
			                                  />
			                                </div>
			                                <div className="watchlist-content">
			                                  <h4>UniTrade</h4>
			                                </div>
			                              </div>
			                            </li>
			                            <li>
			                              <div className="wrp-listcontent">
			                                <div className="watchlist-img">
			                                  <img
			                                    src="/assets/images/unilayer.a88824b7.png"
			                                  />
			                                </div>
			                                <div className="watchlist-content">
			                                  <h4>Unilayer</h4>
			                                </div>
			                              </div>
			                            </li>
			                            <li>
			                              <div className="wrp-listcontent">
			                                <div className="watchlist-img">
			                                  <img
			                                    src="/assets/images/unilogo.77e75417.png"
			                                  />
			                                </div>
			                                <div className="watchlist-content">
			                                  <h4>Uniswap</h4>
			                                </div>
			                              </div>
			                            </li>
			                          </ul>
			                        </div>
			                      </div>
			                      <div className="tab-pane" id="tab6">
			                        <div className="list-watch">
			                          <ul>
			                            <li>
			                              <div className="wrp-listcontent">
			                                <div className="watchlist-img">
			                                  <img
			                                    src="/assets/images/unitrade.c68e3a38.png"
			                                  />
			                                </div>
			                                <div className="watchlist-content">
			                                  <h4>UniTrade</h4>
			                                </div>
			                              </div>
			                            </li>
			                            <li>
			                              <div className="wrp-listcontent">
			                                <div className="watchlist-img">
			                                  <img
			                                    src="/assets/images/unilayer.a88824b7.png"
			                                  />
			                                </div>
			                                <div className="watchlist-content">
			                                  <h4>Unilayer</h4>
			                                </div>
			                              </div>
			                            </li>
			                            <li>
			                              <div className="wrp-listcontent">
			                                <div className="watchlist-img">
			                                  <img
			                                    src="/assets/images/unilogo.77e75417.png"
			                                  />
			                                </div>
			                                <div className="watchlist-content">
			                                  <h4>Uniswap</h4>
			                                </div>
			                              </div>
			                            </li>
			                            <li>
			                              <div className="wrp-listcontent">
			                                <div className="watchlist-img">
			                                  <img
			                                    src="/assets/images/unitrade.c68e3a38.png"
			                                  />
			                                </div>
			                                <div className="watchlist-content">
			                                  <h4>UniTrade</h4>
			                                </div>
			                              </div>
			                            </li>
			                            <li>
			                              <div className="wrp-listcontent">
			                                <div className="watchlist-img">
			                                  <img
			                                    src="/assets/images/unilayer.a88824b7.png"
			                                  />
			                                </div>
			                                <div className="watchlist-content">
			                                  <h4>Unilayer</h4>
			                                </div>
			                              </div>
			                            </li>
			                            <li>
			                              <div className="wrp-listcontent">
			                                <div className="watchlist-img">
			                                  <img
			                                    src="/assets/images/unilogo.77e75417.png"
			                                  />
			                                </div>
			                                <div className="watchlist-content">
			                                  <h4>Uniswap</h4>
			                                </div>
			                              </div>
			                            </li>
			                          </ul>
			                        </div>
			                      </div>
			                      <div className="tab-pane " id="tab7">
			                        <div className="list-watch">
			                          <ul>
			                            <li>
			                              <div className="wrp-listcontent">
			                                <div className="watchlist-img">
			                                  <img
			                                    src="/assets/images/unitrade.c68e3a38.png"
			                                  />
			                                </div>
			                                <div className="watchlist-content">
			                                  <h4>UniTrade</h4>
			                                </div>
			                              </div>
			                            </li>
			                            <li>
			                              <div className="wrp-listcontent">
			                                <div className="watchlist-img">
			                                  <img
			                                    src="/assets/images/unilayer.a88824b7.png"
			                                  />
			                                </div>
			                                <div className="watchlist-content">
			                                  <h4>Unilayer</h4>
			                                </div>
			                              </div>
			                            </li>
			                            <li>
			                              <div className="wrp-listcontent">
			                                <div className="watchlist-img">
			                                  <img
			                                    src="/assets/images/unilogo.77e75417.png"
			                                  />
			                                </div>
			                                <div className="watchlist-content">
			                                  <h4>Uniswap</h4>
			                                </div>
			                              </div>
			                            </li>
			                            <li>
			                              <div className="wrp-listcontent">
			                                <div className="watchlist-img">
			                                  <img
			                                    src="/assets/images/unitrade.c68e3a38.png"
			                                  />
			                                </div>
			                                <div className="watchlist-content">
			                                  <h4>UniTrade</h4>
			                                </div>
			                              </div>
			                            </li>
			                            <li>
			                              <div className="wrp-listcontent">
			                                <div className="watchlist-img">
			                                  <img
			                                    src="/assets/images/unilayer.a88824b7.png"
			                                  />
			                                </div>
			                                <div className="watchlist-content">
			                                  <h4>Unilayer</h4>
			                                </div>
			                              </div>
			                            </li>
			                            <li>
			                              <div className="wrp-listcontent">
			                                <div className="watchlist-img">
			                                  <img
			                                    src="/assets/images/unilogo.77e75417.png"
			                                  />
			                                </div>
			                                <div className="watchlist-content">
			                                  <h4>Uniswap</h4>
			                                </div>
			                              </div>
			                            </li>
			                          </ul>
			                        </div>
			                      </div>
			                    </div>
			                  </div>
			                </div>
			              </div>
			            </div>
			          </div>
			          <div className="col-lg-8 mt-5">
			            <div className="tab-box">
			              <div className="panel panel-primary">
			                <div className="tab-menu-heading">
			                  <div className="tabs-menu ">
			                    {/* Tabs */}
			                    <ul className="nav panel-tabs panel-tabs-area">
			                      <li>
			                        <a href="#tab17" className="active" data-toggle="tab"
			                          >Trade History</a
			                        >
			                      </li>
			                      <li><a href="#tab18" data-toggle="tab">Exchange</a></li>
			                      <li>
			                        <a href="#tab19" data-toggle="tab">Most Voted Coins</a>
			                      </li>
			                    </ul>
			                  </div>
			                </div>
			              </div>
			            </div>
			            <div className="tabs-menu-body">
			              <div className="tab-content">
			                <div className="tab-pane active " id="tab17">
			                  <div className="widget-content widget-content-area br-6">
			                    <div className="table-responsive mt-4">
			                      
			                        { txs !== undefined && txs.length !== 0 && txs[0].baseCurrency.symbol !== "USDT" && txs[0].baseCurrency.symbol !== "WETH" ?
			                          	(txs[0].buyCurrency.symbol === "USDT" || txs[0].sellCurrency.symbol === "USDT" ? 
			                          		(<table
						                        id="zero-config"
						                        className="table table-hover"
						                      >
						                        <thead>
				                          			<tr>
							                          	<th>Date</th>
							                            <th>Type</th>
							                            <th>Price(USD)</th>
							                            <th>Price(USDT)</th>
							                            <th>Amount {selected_data && (selected_data.symbol === "WETH" ? "USDT" : selected_data.symbol)}</th>
							                            <th>Amount USDT</th>
							                            <th>Maker</th>
							                        </tr>
							                    </thead>
												<tbody>
												{txs.map((t, k) => (
					                        		<tr key={k}>
							                            <td>
							                            	<Moment format="YYYY/MM/DD hh:mm:ss a">{new Date(t.block.timestamp.unixtime * 1000)}</Moment>
							                            </td>
							                            <td>{t.buyCurrency.address === props.match.params.address.toLowerCase() ? "SOLD" : "BOUGHT"}</td>
							                            <td>${t.buyCurrency.address === props.match.params.address.toLowerCase() ? (t.sellAmount / t.buyAmount) : (t.buyAmount / t.sellAmount)}</td>
							                            <td>{t.buyCurrency.address === props.match.params.address.toLowerCase() ? (t.tradeAmount / t.buyAmount) : (t.tradeAmount / t.sellAmount)}</td>
							                            <td>{t.buyCurrency.address === props.match.params.address.toLowerCase() ? (t.buyAmount) : (t.sellAmount)}</td>
							                            <td>{t.buyCurrency.address === props.match.params.address.toLowerCase() ? (t.sellAmount) : (t.buyAmount)}</td>
							                            <td>{t.transaction.txFrom.address}</td>
							                        </tr>
					                        	))}
					                        	</tbody>
					                        </table>

					                        ) : 
					                        (
					                          <table
						                        id="zero-config"
						                        className="table table-hover"
						                      >
						                        <thead>
				                          			<tr>
							                          	<th>Date</th>
							                            <th>Type</th>
							                            <th>Price(USD)</th>
							                            <th>Price(ETH)</th>
							                            <th>Amount {selected_data && (selected_data.symbol === "WETH" ? "USDT" : selected_data.symbol)}</th>
							                            <th>Total ETH</th>
							                            <th>Maker</th>
							                        </tr>
							                    </thead>
												<tbody>
												{txs.map((t, k) => (
					                        		<tr key={k}>
							                            <td>
							                            	<Moment format="YYYY/MM/DD hh:mm:ss a">{new Date(t.block.timestamp.unixtime * 1000)}</Moment>
							                            </td>
							                            <td>{t.buyCurrency.address === props.match.params.address.toLowerCase() ? "SOLD" : "BOUGHT"}</td>
							                            <td>${t.buyCurrency.address === props.match.params.address.toLowerCase() ? (t.tradeAmount / t.buyAmount) : (t.tradeAmount / t.sellAmount)}</td>
							                            <td>{t.buyCurrency.address === props.match.params.address.toLowerCase() ? (t.sellAmount / t.buyAmount) : (t.buyAmount / t.sellAmount)}</td>
							                            <td>{t.buyCurrency.address === props.match.params.address.toLowerCase() ? (t.buyAmount) : (t.sellAmount)}</td>
							                            <td>{t.buyCurrency.address === props.match.params.address.toLowerCase() ? (t.sellAmount) : (t.buyAmount)}</td>
							                            <td>{t.transaction.txFrom.address}</td>
							                        </tr>
					                        	))}
					                        	</tbody>
					                        </table>
					                        )
			                          	) : 
			                          	(
				                          <table
					                        id="zero-config"
					                        className="table table-hover"
					                      >
					                        <thead>
			                          			<tr>
						                          	<th>Date</th>
						                            <th>Type</th>
						                            <th>Price(USD)</th>
						                            <th>Price(ETH)</th>
						                            <th>Amount {selected_data && (selected_data.symbol === "WETH" ? "USDT" : selected_data.symbol)}</th>
						                            <th>Total ETH</th>
						                            <th>Maker</th>
						                        </tr>
						                    </thead>
											<tbody>
											{txs.map((t, k) => (
				                        		<tr key={k}>
						                            <td>
						                            	<Moment format="YYYY/MM/DD hh:mm:ss a">{new Date(t.block.timestamp.unixtime * 1000)}</Moment>
						                            </td>
						                            <td>{t.buyCurrency.address === props.match.params.address.toLowerCase() ? "BOUGHT" : "SOLD"}</td>
						                            <td>${t.buyCurrency.address === props.match.params.address.toLowerCase() ? (t.sellAmount / t.buyAmount) : (t.buyAmount / t.sellAmount)}</td>
						                            <td>1</td>
						                            <td>{t.buyCurrency.address === props.match.params.address.toLowerCase() ? (t.sellAmount) : (t.buyAmount)}</td>
						                            <td>{t.buyCurrency.address === props.match.params.address.toLowerCase() ? (t.buyAmount) : (t.sellAmount)}</td>
						                            <td>{t.transaction.txFrom.address}</td>
						                        </tr>
				                        	))}
				                        	</tbody>
				                        </table>

				                      )
			                        }
			                    </div>
			                  </div>
			                </div>
			                <div className="tab-pane  " id="tab18">
			                  <div className="widget-content widget-content-area br-6">
			                    <div className="table-responsive mt-4">
			                      <table
			                        id="zero-config21"
			                        className="table table-hover"
			                        style={{width:100}}
			                      >
			                        <thead>
			                          <tr>
			                            <th>Exchange</th>
			                            <th>Pair (USD)</th>
			                            <th>Spread</th>
			                            <th>+2% Depth</th>
			                            <th>-2% Depth</th>
			                            <th>24h Volume</th>
			                            <th>Volume %</th>
			                            <th>Last Traded</th>
			                            <th>Trust</th>
			                            <th>Score</th>
			                          </tr>
			                        </thead>
			                        <tbody>
			                          <tr>
			                            <td
			                              colSpan="11"
			                              valign="top"
			                              className="dataTables_empty"
			                            >
			                              No data available in table
			                            </td>
			                          </tr>
			                        </tbody>
			                      </table>
			                    </div>
			                  </div>
			                </div>
			                <div className="tab-pane " id="tab19">
			                  <div className="widget-content widget-content-area br-6">
			                    <div className="table-responsive mt-4">
			                      <table
			                        id="zero-config22"
			                        className="table table-hover"
			                        style={{width:100}}

			                      >
			                        <thead>
			                          <tr>
			                            <th>Date & Time</th>
			                            <th>Order</th>
			                            <th>Price (USD)</th>
			                            <th>Token QTY</th>
			                            <th>Total USD</th>
			                            <th>Address</th>
			                          </tr>
			                        </thead>
			                        <tbody>
			                          <tr>
			                            <td className="firsttd">3/17/2021, 10:01:58 AM</td>
			                            <td><span className="buy-td">Buy</span></td>
			                            <td>30.832259420507086</td>
			                            <td>908.47621426954450317</td>
			                            <td>$28010.37431571877363463797465365243</td>
			                            <td>0xa57bd00134b2850b2a1c55860c9e9ea100fdd6cf</td>
			                          </tr>
			                          <tr>
			                            <td className="firsttd">3/17/2021, 10:01:58 AM</td>
			                            <td><span className="buy-td">Buy</span></td>
			                            <td>30.832259420507086</td>
			                            <td>908.47621426954450317</td>
			                            <td>$28010.37431571877363463797465365243</td>
			                            <td>0xa57bd00134b2850b2a1c55860c9e9ea100fdd6cf</td>
			                          </tr>
			                          <tr>
			                            <td className="firsttd">3/17/2021, 10:01:58 AM</td>
			                            <td><span className="sell-td">Sell</span></td>
			                            <td>30.832259420507086</td>
			                            <td>908.47621426954450317</td>
			                            <td>$28010.37431571877363463797465365243</td>
			                            <td>0xa57bd00134b2850b2a1c55860c9e9ea100fdd6cf</td>
			                          </tr>
			                          <tr>
			                            <td className="firsttd">3/17/2021, 10:01:58 AM</td>
			                            <td><span className="buy-td">Buy</span></td>
			                            <td>30.832259420507086</td>
			                            <td>908.47621426954450317</td>
			                            <td>$28010.37431571877363463797465365243</td>
			                            <td>0xa57bd00134b2850b2a1c55860c9e9ea100fdd6cf</td>
			                          </tr>
			                          <tr>
			                            <td className="firsttd">3/17/2021, 10:01:58 AM</td>
			                            <td><span className="buy-td">Buy</span></td>
			                            <td>30.832259420507086</td>
			                            <td>908.47621426954450317</td>
			                            <td>$28010.37431571877363463797465365243</td>
			                            <td>0xa57bd00134b2850b2a1c55860c9e9ea100fdd6cf</td>
			                          </tr>
			                          <tr>
			                            <td className="firsttd">3/17/2021, 10:01:58 AM</td>
			                            <td><span className="buy-td">Buy</span></td>
			                            <td>30.832259420507086</td>
			                            <td>908.47621426954450317</td>
			                            <td>$28010.37431571877363463797465365243</td>
			                            <td>0xa57bd00134b2850b2a1c55860c9e9ea100fdd6cf</td>
			                          </tr>
			                          <tr>
			                            <td className="firsttd">3/17/2021, 10:01:58 AM</td>
			                            <td><span className="sell-td">Sell</span></td>
			                            <td>30.832259420507086</td>
			                            <td>908.47621426954450317</td>
			                            <td>$28010.37431571877363463797465365243</td>
			                            <td>0xa57bd00134b2850b2a1c55860c9e9ea100fdd6cf</td>
			                          </tr>
			                          <tr>
			                            <td className="firsttd">3/17/2021, 10:01:58 AM</td>
			                            <td><span className="sell-td">Sell</span></td>
			                            <td>30.832259420507086</td>
			                            <td>908.47621426954450317</td>
			                            <td>$28010.37431571877363463797465365243</td>
			                            <td>0xa57bd00134b2850b2a1c55860c9e9ea100fdd6cf</td>
			                          </tr>
			                          <tr>
			                            <td className="firsttd">3/17/2021, 10:01:58 AM</td>
			                            <td><span className="buy-td">Buy</span></td>
			                            <td>30.832259420507086</td>
			                            <td>908.47621426954450317</td>
			                            <td>$28010.37431571877363463797465365243</td>
			                            <td>0xa57bd00134b2850b2a1c55860c9e9ea100fdd6cf</td>
			                          </tr>
			                        </tbody>
			                      </table>
			                    </div>
			                  </div>
			                </div>
			              </div>
			            </div>
			          </div>
			        </div>
			      </section>
			      <section id="popular-sec">
			        <div className="row">
			          <div className="col-lg-4">
			            <div className="social-trending-box">
			              <div className="panel panel-primary">
			                <div className="tab-menu-heading">
			                  <div className="tabs-menu ">
			                    {/* Tabs */}
			                    <ul className="nav panel-tabs">
			                      <li>
			                        <a href="#tab25" className="active" data-toggle="tab"
			                          >Popular</a
			                        >
			                      </li>
			                      <li><a href="#tab26" data-toggle="tab">Newest</a></li>
			                      <li><a href="#tab27" data-toggle="tab">Following</a></li>
			                    </ul>
			                  </div>
			                </div>
			                <div className="panel-body tabs-menu-body">
			                  <div className="tab-content">
			                    <div className="tab-pane active " id="tab25">
			                      <div className="popular-content">
			                        <h3>API3 Fundamental Analysis</h3>
			                        <p>
			                          No listing in Binance yet When there will be a listing
			                          on binance the price is several times higher like RSR
			                          last time Partners Alliance Block, Matic, Kleros,
			                          Curve Grid, Streamer, Curve Labs, Emurgo SOSV,
			                          Pantera,DLab, Chain API , Placeholder, PrimeDAO,
			                          Accomplice
			                        </p>
			                        <div className="author-wrp">
			                          <div className="author_box">
			                            <div className="auther-img">
			                              <img src="/assets/images/man.aec20cdb.jpg" />
			                            </div>
			                            <div className="author-content"><p>Mike Allen</p></div>
			                          </div>
			                          <div className="like-content">
			                            <button>
			                              <i className="far fa-thumbs-up"></i><span>510</span>
			                            </button>
			                          </div>
			                        </div>
			                        <div className="lke-comment-wrp">
			                          <div className="comment-content">
			                            <textarea placeholder="Write"></textarea>
			                            <div className="connect_btn">
			                              <a href="#" className="btn">Connect Wallet</a>
			                            </div>
			                          </div>
			                        </div>
			                      </div>
			                    </div>
			                    <div className="tab-pane  " id="tab26">
			                      <div className="popular-content">
			                        <h3>API3 Fundamental Analysis</h3>
			                        <p>
			                          No listing in Binance yet When there will be a listing
			                          on binance the price is several times higher like RSR
			                          last time Partners Alliance Block, Matic, Kleros,
			                          Curve Grid, Streamer, Curve Labs, Emurgo SOSV,
			                          Pantera,DLab, Chain API , Placeholder, PrimeDAO,
			                          Accomplice
			                        </p>
			                        <div className="author-wrp">
			                          <div className="author_box">
			                            <div className="auther-img">
			                              <img src="/assets/images/man.aec20cdb.jpg" />
			                            </div>
			                            <div className="author-content"><p>Mike Allen</p></div>
			                          </div>
			                          <div className="like-content">
			                            <button>
			                              <i className="far fa-thumbs-up"></i><span>510</span>
			                            </button>
			                          </div>
			                        </div>
			                        <div className="lke-comment-wrp">
			                          <div className="comment-content">
			                            <textarea placeholder="Write"></textarea>
			                            <div className="connect_btn">
			                              <a href="#" className="btn">Connect Wallet</a>
			                            </div>
			                          </div>
			                        </div>
			                      </div>
			                    </div>
			                  </div>
			                </div>
			              </div>
			            </div>
			          </div>
			          <div className="col-lg-8">
			            <div className="row">
			              <div className="col-sm-12 col-md-6">
			                <div className="centered-cover card">
			                  <div className="flex-break">
			                    <div className="rending-wrp">
			                      <span className="trending-h">Coingecko Trending</span>
			                      <select className="form-area">
			                        <option value="c1h">1 hour</option>
			                        <option value="c1d">1 day</option>
			                        <option value="c7d">7 day</option>
			                      </select>
			                    </div>
			                    {/* the trick here is the select options must have the same value as the their repective element's class */}
			                    <div className="box red c1h">
			                      <ul className="trending-list">
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#1</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/1t.png" />
			                              </div>
			                              <span>GRO</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$33.19 (46.2%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#2</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/2t.png" />
			                              </div>
			                              <span>88mph</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$159.82 (85.9%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#3</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/yop.png" />
			                              </div>
			                              <span>YOP</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$1.30 (67.0%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#4</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/api.png" />
			                              </div>
			                              <span>API3 (API3)</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$3.87 (-7.0%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#5</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/ip.png" />
			                              </div>
			                              <span>INJ</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$8.68 (29.1%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#6</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/eth.png" />
			                              </div>
			                              <span>Ethereum</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$1,392.21 (12.3%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#7</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/ec.png" />
			                              </div>
			                              <span>Enjin Coin</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$0.34 (42.8%)</p>
			                            </div>
			                          </div>
			                        </li>
			                      </ul>
			                    </div>
			                    <div className="box c7d">
			                      <ul className="trending-list">
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#1</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/1t.png" />
			                              </div>
			                              <span>GRO</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$33.19 (46.2%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#2</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/2t.png" />
			                              </div>
			                              <span>88mph</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$159.82 (85.9%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#3</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/yop.png" />
			                              </div>
			                              <span>YOP</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$1.30 (67.0%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#4</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/api.png" />
			                              </div>
			                              <span>API3 (API3)</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$3.87 (-7.0%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#5</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/ip.png" />
			                              </div>
			                              <span>INJ</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$8.68 (29.1%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#6</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/eth.png" />
			                              </div>
			                              <span>Ethereum</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$1,392.21 (12.3%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#7</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/ec.png" />
			                              </div>
			                              <span>Enjin Coin</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$0.34 (42.8%)</p>
			                            </div>
			                          </div>
			                        </li>
			                      </ul>
			                    </div>
			                    <div className="box c1d">
			                      <ul className="trending-list">
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#1</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/1t.png" />
			                              </div>
			                              <span>GRO</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$33.19 (46.2%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#2</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/2t.png" />
			                              </div>
			                              <span>88mph</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$159.82 (85.9%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#3</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/yop.png" />
			                              </div>
			                              <span>YOP</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$1.30 (67.0%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#4</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/api.png" />
			                              </div>
			                              <span>API3 (API3)</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$3.87 (-7.0%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#5</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/ip.png" />
			                              </div>
			                              <span>INJ</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$8.68 (29.1%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#6</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/eth.png" />
			                              </div>
			                              <span>Ethereum</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$1,392.21 (12.3%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#7</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/ec.png" />
			                              </div>
			                              <span>Enjin Coin</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$0.34 (42.8%)</p>
			                            </div>
			                          </div>
			                        </li>
			                      </ul>
			                    </div>
			                  </div>
			                </div>
			              </div>
			              <div className="col-sm-12 col-md-6">
			                <div className="centered-cover card">
			                  <div className="flex-break">
			                    <div className="rending-wrp">
			                      <span className="trending-h">Dextools Trending</span>
			                      <select className="form-area2">
			                        <option value="d1h">1 hour</option>
			                        <option value="d1d">1 day</option>
			                        <option value="d7d">7 day</option>
			                      </select>
			                    </div>
			                    {/* the trick here is the select options must have the same value as the their repective element's class */}
			                    <div className="box1 blue d1h">
			                      <ul className="trending-list">
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#1</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/wise.png" />
			                              </div>
			                              <span>Wise</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$0.58 (-2.06%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#2</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/yop.png" />
			                              </div>
			                              <span>YOP</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$1.30 (43.48%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#3</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/glch.png" />
			                              </div>
			                              <span>GLCH</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$0.18 (7.53%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#4</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/api.png" />
			                              </div>
			                              <span>API3</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$3.83 (-19.71%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#5</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/slm.png" />
			                              </div>
			                              <span>SLM</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$0.08 (-6.74%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#6</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/rock.png" />
			                              </div>
			                              <span>ROOK</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$327.30 (-12.46%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#7</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/prq.png" />
			                              </div>
			                              <span>PRQ</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$1.34 (-16.15%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#8</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/share.png" />
			                              </div>
			                              <span>SHARE</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$0.93 (29.77%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#9</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/pols.png" />
			                              </div>
			                              <span>POLS</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$1.41 (-23.24%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#10</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/zero.png" />
			                              </div>
			                              <span>ZERO</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$0.083 (26.52%)</p>
			                            </div>
			                          </div>
			                        </li>
			                      </ul>
			                    </div>
			                    <div className="box1 d7d">
			                      <ul className="trending-list">
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#1</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/wise.png" />
			                              </div>
			                              <span>Wise</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$0.58 (-2.06%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#2</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/yop.png" />
			                              </div>
			                              <span>YOP</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$1.30 (43.48%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#3</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/glch.png" />
			                              </div>
			                              <span>GLCH</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$0.18 (7.53%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#4</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/api.png" />
			                              </div>
			                              <span>API3</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$3.83 (-19.71%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#5</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/slm.png" />
			                              </div>
			                              <span>SLM</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$0.08 (-6.74%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#6</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/rock.png" />
			                              </div>
			                              <span>ROOK</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$327.30 (-12.46%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#7</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/prq.png" />
			                              </div>
			                              <span>PRQ</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$1.34 (-16.15%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#8</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/share.png" />
			                              </div>
			                              <span>SHARE</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$0.93 (29.77%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#9</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/pols.png" />
			                              </div>
			                              <span>POLS</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$1.41 (-23.24%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#10</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/zero.png" />
			                              </div>
			                              <span>ZERO</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$0.083 (26.52%)</p>
			                            </div>
			                          </div>
			                        </li>
			                      </ul>
			                    </div>
			                    <div className="box1 d1d">
			                      <ul className="trending-list">
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#1</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/wise.png" />
			                              </div>
			                              <span>Wise</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$0.58 (-2.06%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#2</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/yop.png" />
			                              </div>
			                              <span>YOP</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$1.30 (43.48%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#3</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/glch.png" />
			                              </div>
			                              <span>GLCH</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$0.18 (7.53%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#4</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/api.png" />
			                              </div>
			                              <span>API3</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$3.83 (-19.71%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#5</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/slm.png" />
			                              </div>
			                              <span>SLM</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$0.08 (-6.74%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#6</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/rock.png" />
			                              </div>
			                              <span>ROOK</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$327.30 (-12.46%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#7</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/prq.png" />
			                              </div>
			                              <span>PRQ</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$1.34 (-16.15%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#8</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/share.png" />
			                              </div>
			                              <span>SHARE</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$0.93 (29.77%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#9</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/pols.png" />
			                              </div>
			                              <span>POLS</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$1.41 (-23.24%)</p>
			                            </div>
			                          </div>
			                        </li>
			                        <li>
			                          <div className="trending-child-f">
			                            <div className="number-r">#10</div>
			                            <div className="image-c">
			                              <div className="img-trend-icon">
			                                <img src="/assets/images/zero.png" />
			                              </div>
			                              <span>ZERO</span>
			                            </div>
			                            <div className="company-money">
			                              <p>$0.083 (26.52%)</p>
			                            </div>
			                          </div>
			                        </li>
			                      </ul>
			                    </div>
			                  </div>
			                </div>
			              </div>
			            </div>
			          </div>
			        </div>
			      </section>

			    </div>
			  </div>

		</div>
	)
}

export default Uniswapexplorer;