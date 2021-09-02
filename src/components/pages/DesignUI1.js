import React, {useState, useEffect, Fragment} from 'react';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

// import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import ChatOutlinedIcon from '@material-ui/icons/ChatOutlined';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import FilterNoneIcon from '@material-ui/icons/FilterNone';
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';
import NotificationsActiveOutlinedIcon from '@material-ui/icons/NotificationsActiveOutlined';
import FavoriteIcon from '@material-ui/icons/Favorite';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import TelegramIcon from '@material-ui/icons/Telegram';
import TwitterIcon from '@material-ui/icons/Twitter';
import CommentIcon from '@material-ui/icons/Comment';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import LocalGasStationIcon from '@material-ui/icons/LocalGasStation';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Brightness4Icon from '@material-ui/icons/Brightness4';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';


import { makeStyles, useTheme, fade } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Details from './Details';
import TokenChart from './TokenChart';

import eventBus from '../eventBus';

// *****
import { Link } from 'react-router-dom';
import $ from 'jquery';
// import { Tab, Nav } from 'react-bootstrap';
// import Header2 from '../layout/header2';  
// import Sidebar from '../layout/sidebar';
// import Footer2 from '../layout/footer2';
// import 'react-perfect-scrollbar/dist/css/styles.css';
// import PerfectScrollbar from 'react-perfect-scrollbar'
// import DepthChart from '../charts/depth';
// import RangeSlider from '../element/range-slider';
// import 'react-rangeslider/lib/index.css'
import ImageComponent from './ImageComponent';

import { useSelector, useDispatch } from "react-redux";
 
import { gql, useQuery, useLazyQuery, useSubscription  } from '@apollo/client';

// import { TVChartContainer } from '../TVChartContainer';
import {DelayInput} from 'react-delay-input';

// import {getTokenLists} from '../../constants';
// import {setTokenId, setTokens} from '../actions/tokens';

// import Moment from "react-moment"
// import eventBus from "../eventBus";

// ***
// import { widget } from './charting_library';
// import buildDatafeed from './datafeed.js';

import {client} from "../../App"

import Web3 from 'web3/dist/web3.js';



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
  NEWLY_TOKENS,
  ALL_PAIRS_QUERY,
  ALL_PAIRS_QUERY1,
  ETH_PAIR_SEARCH,
  ETH_PAIR_SEARCH1
} from "./queries";

const url = "https://graphql.bitquery.io/";
let web3 = new Web3("https://mainnet.infura.io/v3/679d36d7fac34bf29eb30f7071e7b948")
let eth = web3.eth

var selected_data = null, ethPrice = null, recommended_tokens = [];
var transactions = [], transactions1 = [], transactions2 = [];
var pair_ids = [];
var change_flag = false, newly_flag = true, newly_flag1 = true;
var prev_mint_id, prev_burn_id, isExtraAdd = false, interval_flag = true;
var flag = true;
var myInterval_5;
var newDate = (new Date()) / 1000 - 5184000;
var altToken = false ;
var tokenPrice7 = 0 ;
var tokenPrice24 = 0 ;
var transfers = 0 ;
var holders = 0 ;
var tokenPrice30 = 0 ;
var totalCirculation = 0 ;
var altLiquidity = 0 ;

var isSearched = false, isSearched1 = false;
var searchedPairs = [], newly_tokens = [];
var transactionQueue = [];

setInterval(() => {
  newly_flag = true;
  newly_flag1 = true;
}, 300000)


// *****




const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    // display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  drawerPaperDark: {
    width: drawerWidth,
    background: "linear-gradient(to left bottom, darkslategrey, rgb(0 0 0))",
    color: "white"
  },
  content: {
    [theme.breakpoints.up("sm")]: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`
    },
    // flexGrow: 1,
  },
  // content: {
    
  //   // padding: theme.spacing(3),
  // },
  listItemSize: {
  	width: "0.8em",
  },
  listItemSize_fav: {
  	width: "0.5em",
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  grow: {
    flexGrow: 1,
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
}));

function DesignUI(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);
  const matches = useMediaQuery('(min-width: 1130px)');
  const matches1 = useMediaQuery('(min-width: 930px)');


  // *****
  var myInterval = 0;
  var ethUsd =0 ;
  var tokenPrice = 0 ;
  var tokenSymbol = '' ;
  var tokenA = '' ;
  var tokenB = '' ;
  var tokenTxn = 0;
  var tokenLiquidity = 0 ;
  var dailyVolume = 0 ;
  var pooledTokenA = 0 ;
  var pooledTokenB = 0 ;


  const dispatch = useDispatch();
  const [token_name, setToken_name] = useState("");
  const [token0, setToken0] = useState(null);
  const [token1, setToken1] = useState(null);
  const [reserve0, setReserve0] = useState("");
  const [reserve1, setReserve1] = useState("");
  const [txs, setTxs] = useState([]);
  // const [newly_tokens, setNewly_tokens] = useState([]);
  const [socialLinks, setSocialLinks] = useState(null);
  // const tokenLists = useSelector(state => state.tokens);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const [executeSearchPairs, pairs] = useLazyQuery(
      PAIRS_SEARCH_QUERY
  );

  const [getTokens, token_data] = useLazyQuery(
      TOKEN_CHART
  );

  const [getExtraTokens, extra_tokens] = useLazyQuery(
      EXTRA_SEARCH_QUERY
  );


  // @ Get eth price in USD
  ethPrice = useSubscription(ETH_PRICE_QUERY);  

  var selected_pair = useSubscription(POOL_SEARCH_QUERY, {variables: {id: props.match.params.address}}); // @ Get Pair information



  // =================== @ Get newly tokens subscription
  // var newDate = (new Date()) / 1000 - 43200
  var newly_pairs = useSubscription(NEWLY_TOKENS, {variables: {date: newDate.toFixed(0).toString()}});
  if (newly_flag && newly_pairs.data !== undefined) {
    // setNewly_tokens([...newly_pairs.data.pairs]);
    newly_tokens = [...newly_pairs.data.pairs];
    newly_flag = false;
    // console.log("Newly: ", ...newly_pairs.data.pairs);
  }

  // =================== @ End newly tokens



  // @ Set Pair Ids
  var pair_ids = [];
  if (pairs.data !== undefined && pairs.data.pairs.length !== 0) {
    pairs.data.pairs.forEach(p => {
      pair_ids.push(p.id);
    })
  }

  if (newly_flag1 && selected_pair.data && (selected_pair.data.pairs.length !== 0)) {
    selected_data = selected_pair.data.pairs[0];
    var pair_data = selected_pair.data.pairs[0];

    if (pair_data.token1.symbol === "WETH" && (pair_data.token0.symbol === "USDC" || pair_data.token0.symbol === "USDT" || pair_data.token0.symbol === "DAI")) {
          setToken0(pair_data.token1);
          setToken1(pair_data.token0);
          setReserve0(pair_data.reserve1);
          setReserve1(pair_data.reserve0);
          console.log("1");
        } 
        else if (pair_data.token1.symbol === "USDC" && (pair_data.token0.symbol === "USDT" || pair_data.token0.symbol === "DAI")) {
          setToken0(pair_data.token1);
          setToken1(pair_data.token0);
          setReserve0(pair_data.reserve1);
          setReserve1(pair_data.reserve0);
          console.log("3");
        } else if (pair_data.token1.symbol === "USDT" && pair_data.token0.symbol === "DAI") {
          setToken0(pair_data.token1);
          setToken1(pair_data.token0);
          setReserve0(pair_data.reserve1);
          setReserve1(pair_data.reserve0);
          console.log("4");
        } else if ((pair_data.token0.symbol === "WETH" || pair_data.token0.symbol === "USDC" || pair_data.token0.symbol === "USDT" || pair_data.token0.symbol === "DAI") && !(pair_data.token1.symbol === "WETH" || pair_data.token1.symbol === "USDC" || pair_data.token1.symbol === "USDT" || pair_data.token1.symbol === "DAI")) {
          setToken0(pair_data.token1);
          setToken1(pair_data.token0);
          setReserve0(pair_data.reserve1);
          setReserve1(pair_data.reserve0);
          console.log("5");
        } else {
          setToken0(pair_data.token0);
          setToken1(pair_data.token1);
          setReserve0(pair_data.reserve0);
          setReserve1(pair_data.reserve1);
          console.log("6");
        }
        newly_flag1 = false;
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

      

    //   // const tvWidget
    //   if (token0 && token1) {
    //     new widget({
    //       symbol: token0.id + "|" + token1.id, // default symbol
    //       interval: '1440', // default interval
    //       timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    //       container_id: 'TVChartContainer',
    //       datafeed: buildDatafeed("pairInfo", 10000),
    //       library_path: '/charting_library/',
    //       disabled_features: ['header_symbol_search', 'symbol_search_hot_key', 'timeframes_toolbar'],
    //       theme: "Dark",
    //       timeframe: '7M',
    //       width: '100%',
    //       height: '100%',
    //       autosize: true,
    //     });
    // }

  }, [ token0, token1])

  useEffect(() => {
    clearInterval(myInterval_5)
    if (interval_flag) {
      onSet(props.match.params.address, true);
      interval_flag = false;
    }
  }, [props]);

  var onChange = async (e) => {
    try {// console.clear();
        recommended_tokens = [];
        searchedPairs = [];
        setToken_name(e.target.value);
        var value = e.target.value;
        if (value !== "") {
          setLoadingSearch(true);
          // console.log("wow")
            // Declare variables
            isExtraAdd = true;
            isSearched = true;
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
    
    
            if (e.target.value.toUpperCase() === "WETH") {
              var allPairs = await client.query({query: ETH_PAIR_SEARCH});
              if (allPairs.data.pairs.length !== 0) {
                searchedPairs = [...allPairs.data.pairs];
                // console.log("55", allPairs)
              } else {
                // console.log("55555")
                var allPairs1 = await client.query({query: ETH_PAIR_SEARCH1});
                searchedPairs = [...allPairs1.data.pairs]
              }
              setLoadingSearch(false);
            } else if (e.target.value.includes('0x') && e.target.value.length === 42) {
              console.log("This is address")
              // var pattern = new RegExp(value, "i");
              // recommended_tokens = tokenLists.tokens.filter(token => pattern.test(token.name) || pattern.test(token.symbol));
              var extra_tokens = await client.query({query: EXTRA_SEARCH_QUERY, variables: {gte: value.toLowerCase(), lte: value.toUpperCase() + "ZZZZZZZZZZ", id: value.toLowerCase()}});
    
              // console.log("extra_tokens.data.asSymbol")
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
    
                  recommended_tokens = [...temp];
                  // console.log("1")
                  
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
    
                  recommended_tokens = [...temp];
    
                  // console.log("2", recommended_tokens)
                  
                }
                  
              } else {
                if (extra_tokens.data.asAddress.length !== 0) {
                  recommended_tokens = [...extra_tokens.data.asAddress];
                  // console.log("3")
                }
              }
    
    
              // ***
              if (recommended_tokens.length !== 0) {
                var allPairs = await client.query({query: ALL_PAIRS_QUERY(recommended_tokens)});
                if (allPairs.data.pairs.length !== 0) {
                  searchedPairs = [...allPairs.data.pairs];
                  // console.log("55", allPairs)
                } 
    
                var allPairs1 = await client.query({query: ALL_PAIRS_QUERY1(recommended_tokens)});
                if (allPairs1.data.pairs.length !== 0) {
                  // console.log("55555")
                  searchedPairs = [...searchedPairs, ...allPairs1.data.pairs]
                }
                setLoadingSearch(false);
              }

            } else {
              // var pattern = new RegExp(value, "i");
              // recommended_tokens = tokenLists.tokens.filter(token => pattern.test(token.name) || pattern.test(token.symbol));
              var extra_tokens = await client.query({query: EXTRA_SEARCH_QUERY, variables: {gte: value.toLowerCase(), lte: value.toUpperCase() + "ZZZZZZZZZZ", id: value}});
    
              // console.log("extra_tokens.data.asSymbol")
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
    
                  recommended_tokens = [...temp];
                  // console.log("1")
                  
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
    
                  recommended_tokens = [...temp];
    
                  // console.log("2", recommended_tokens)
                  
                }
                  
              } else {
                if (extra_tokens.data.asAddress.length !== 0) {
                  recommended_tokens = [...extra_tokens.data.asAddress];
                  // console.log("3")
                }
              }
    
    
              // ***
              if (recommended_tokens.length !== 0) {
                var allPairs = await client.query({query: ALL_PAIRS_QUERY(recommended_tokens)});
                if (allPairs.data.pairs.length !== 0) {
                  searchedPairs = [...allPairs.data.pairs];
                  // console.log("55", allPairs)
                } 
    
                var allPairs1 = await client.query({query: ALL_PAIRS_QUERY1(recommended_tokens)});
                if (allPairs1.data.pairs.length !== 0) {
                  // console.log("55555")
                  searchedPairs = [...searchedPairs, ...allPairs1.data.pairs]
                }
                setLoadingSearch(false);
              }
    
            }
    
              
    
      }
    } catch (e) {console.log(e)}

  }

  var onSet = async (address, first) => {
    // executeSearch({variables: {symbol: address}});
    var pair_info = await client.query({query: FEED_SEARCH_QUERY, variables: { id: address }});
    if (pair_info.data && pair_info.data.pairs.length !== 0) {
      selected_data = pair_info.data.pairs[0];
      // console.log("hahaha", selected_data)

        // ***
        var t0, t1, pair_data = pair_info.data.pairs[0];

        if (pair_data.token1.symbol === "WETH" && (pair_data.token0.symbol === "USDC" || pair_data.token0.symbol === "USDT" || pair_data.token0.symbol === "DAI")) {
              setToken0(pair_data.token1);
              setToken1(pair_data.token0);
              runTransactions(pair_data.token1.id, pair_data.token0.id, pair_data.token1.decimals, pair_data.token0.decimals, pair_data.token0.derivedETH);
              getSocialLinks(pair_data.token1.id);
              setReserve0(pair_data.reserve1);
              setReserve1(pair_data.reserve0);
              getDetailInfo(pair_data.token1.id);
                  console.log("1");
                } 
                else if (pair_data.token1.symbol === "USDC" && (pair_data.token0.symbol === "USDT" || pair_data.token0.symbol === "DAI")) {
                  setToken0(pair_data.token1);
              setToken1(pair_data.token0);
              runTransactions(pair_data.token1.id, pair_data.token0.id, pair_data.token1.decimals, pair_data.token0.decimals, pair_data.token0.derivedETH);
              getSocialLinks(pair_data.token1.id);
              setReserve0(pair_data.reserve1);
              setReserve1(pair_data.reserve0);
              getDetailInfo(pair_data.token1.id);
                  console.log("3");
                } else if (pair_data.token1.symbol === "USDT" && pair_data.token0.symbol === "DAI") {
                  setToken0(pair_data.token1);
              setToken1(pair_data.token0);
              runTransactions(pair_data.token1.id, pair_data.token0.id, pair_data.token1.decimals, pair_data.token0.decimals, pair_data.token0.derivedETH);
              getSocialLinks(pair_data.token1.id);
              setReserve0(pair_data.reserve1);
              setReserve1(pair_data.reserve0);
              getDetailInfo(pair_data.token1.id);
                  console.log("4");
                } else if ((pair_data.token0.symbol === "WETH" || pair_data.token0.symbol === "USDC" || pair_data.token0.symbol === "USDT" || pair_data.token0.symbol === "DAI") && !(pair_data.token1.symbol === "WETH" || pair_data.token1.symbol === "USDC" || pair_data.token1.symbol === "USDT" || pair_data.token1.symbol === "DAI")) {
                  setToken0(pair_data.token1);
              setToken1(pair_data.token0);
              runTransactions(pair_data.token1.id, pair_data.token0.id, pair_data.token1.decimals, pair_data.token0.decimals, pair_data.token0.derivedETH);
              getSocialLinks(pair_data.token1.id);
              setReserve0(pair_data.reserve1);
              setReserve1(pair_data.reserve0);
              getDetailInfo(pair_data.token1.id);
                  console.log("5");
                } else {
                  setToken0(pair_data.token0);
              setToken1(pair_data.token1);
              runTransactions(pair_data.token0.id, pair_data.token1.id, pair_data.token0.decimals, pair_data.token1.decimals, pair_data.token1.derivedETH);
              getSocialLinks(pair_data.token0.id);
              setReserve0(pair_data.reserve0);
              setReserve1(pair_data.reserve1);
              getDetailInfo(pair_data.token0.id);
                  console.log("6");
                }

    }
    change_flag = true;
    setToken_name("");
  }


  var getDetailInfo = (address) => {
    fetch('https://api.ethplorer.io/getTokenInfo/'+address+'?apiKey=freekey' )
      .then(res => res.json())
      .then(res => {
        // console.log(res);
              if(res.price){
                  tokenPrice24 = parseFloat(res.price.diff).toFixed(2) ;
                  tokenPrice7 = parseFloat(res.price.diff7d).toFixed(2) ;
                  tokenPrice30 = parseFloat(res.price.diff30d).toFixed(2) ;

              }
              transfers = res.transfersCount ;
              holders = res.holdersCount ;
        totalCirculation = res.totalSupply/1e18 ;
      })
      .catch(console.log)
  }

  var onClick = (e) => {
    interval_flag = true;
    clearInterval(myInterval_5)
    props.history.push(e.target.id);
    // onSet(e.target.id, false);
  }

  // var runTransactions = (t0, t1) => {
  //   // console.log("Interval", myInterval_5)
  //   myInterval_5 = setInterval(() => {
  //     const query = `
  //       query {
  //         ethereum {
  //           dexTrades(options: {limit: 20, desc: "block.height"}, 
  //           exchangeName: {in: ["Uniswap", "Uniswap v2"]}, 
  //           baseCurrency: {is: "${t0}"}
  //           quoteCurrency: {is: "${t1}"}) {
  //               transaction {
  //                 hash
  //               }
  //             tradeIndex
  //             block {
  //               height
  //               timestamp {
  //                 unixtime
  //               }
  //             }
  //             baseCurrency {
  //               symbol
  //               address
  //             }
  //             buyAmount
  //             buyAmountInUsd: buyAmount(in: USD)
  //             buyCurrency {
  //               symbol
  //               address
  //             }
  //             sellAmount
  //             sellAmountInUsd: sellAmount(in: USD)
  //             sellCurrency {
  //               symbol
  //               address
  //             }
  //             sellAmountInUsd: sellAmount(in: USD)
  //             tradeAmount(in: USD)
  //             baseAmount
  //             transaction {
  //               gasValue
  //               gasPrice
  //               gas
  //               txFrom {address}
  //             }
  //           }
  //         }
  //       }
  //     `;

  //     const opts = {
  //         method: "POST",
  //         headers: {
  //             "Content-Type": "application/json",
  //             "X-API-KEY": "BQYvhnv04csZHaprIBZNwtpRiDIwEIW9"
  //         },
  //         body: JSON.stringify({
  //             query
  //         })
  //     };

  //     fetch(url, opts)
  //         .then(res => res.json())
  //         .then(res => {
  //           // console.log("TRADE", res.data.ethereum.dexTrades);
  //           if (res.data.ethereum.dexTrades) {
  //             setTxs(res.data.ethereum.dexTrades)
  //           }
  //         })
  //         .catch(console.error);
  //   }, 6000);
      
  //   // console.log("setting", myInterval);

  // }




  var runTransactions = async (t0, t1, t0_decimals, t1_decimals, stablePrice) => {
    var currentLatestBlock = await eth.getBlockNumber()
    var blockTimestamp = (await eth.getBlock(currentLatestBlock)).timestamp
    var counter = 0;


    

    var promises = []

    console.log("currentLatestBlock", currentLatestBlock, "blockTimestamp", blockTimestamp)

        // var setIntervalId = setInterval(async function() {

            try {
                // console.log("START === 1m")
                // if(counter % 6 === 5 || new Date().getTime()/1000 - blockTimestamp > 5 * 60 ) {
                currentLatestBlock = await eth.getBlockNumber()
                
                blockTimestamp = (await eth.getBlock(currentLatestBlock)).timestamp
                console.info(`New from block number: ${currentLatestBlock} at ${blockTimestamp} seconds.`)
                currentLatestBlock -= 10
                // }

                // const routerTopic = `0x000000000000000000000000${routerAddress.substr(2)}`
                const transactions = await eth.getPastLogs({
                    fromBlock: '0x' + currentLatestBlock.toString(16),
                    toBlock: 'latest',
                    address: props.match.params.address,
                    // topics:[web3.utils.sha3("adduintevent(uint256,uint256)"),c]
                })

                console.log(transactions);

                var newTxns = []
                var promise = (transaction) => {
                    return new Promise(async (resolve, reject) => {
                      var timestamp = (await eth.getBlock(transaction.blockNumber)).timestamp
                      console.log("12120");
                      resolve({
                                ...transaction,
                                timestamp
                            });
                    })
                }

                // console.log(transactions.length);
                for(var i = 0; i < transactions.length; i++) {
                    const { transactionHash, data, logIndex, blockNumber } = transactions[i]
                    const tid = transactionHash + logIndex
                    // console.log(tid);
                    const trunc = data.substr(2)
                    const chunks = []
                    for (var k = 0; k < 4; k++) {
                        const chunk = trunc.substr(k * 64, 64)
                        chunks.push(parseInt("0x" + chunk))
                    }

                    var targetTokenAmount = 0, stableTokenAmount = 0, type;
                    if (chunks[1] && chunks[2]) {
                        // console.log("BUY")
                        type = 'BUY'
                        targetTokenAmount = chunks[2] / 10 ** t0_decimals
                        stableTokenAmount = chunks[1] / 10 ** t1_decimals
                    } else if (chunks[0] && chunks[3]) {
                        // console.log("SELL")
                        type = 'SELL'
                        targetTokenAmount = chunks[0] / 10 ** t0_decimals
                        stableTokenAmount = chunks[3] / 10 ** t1_decimals
                        console.log(targetTokenAmount, stableTokenAmount, t0_decimals, t1_decimals)
                    } else {
                        // console.log("CON")
                        continue
                    }

                    const amountSpentUSD = stableTokenAmount * (ethPrice.data && ethPrice.data.bundles[0].ethPrice) * stablePrice
                    if(targetTokenAmount && stableTokenAmount) {
                        console.log("WOW")

                        const price = amountSpentUSD / targetTokenAmount
                        // const timestamp = (blockNumber - currentLatestBlock) * 14.5 + blockTimestamp - 1800 + 300
                        const transaction = {
                            type,
                            transactionHash,
                            logIndex,
                            targetTokenAmount,
                            stableTokenAmount,
                            totalSpent: amountSpentUSD,
                            price,
                            blockNumber
                            // timestamp
                        }
                        // newTxns.unshift(transaction)
                        promises.push(promise(transaction));
                    }

                }

                if(promises.length > 0) {
                    console.log(ethPrice, stablePrice)
                    // onNewTransactions(newTxns)
                    // console.log("newTxns", newTxns);
                    // promises = promises.slice(promises.length - 20, 20)
                    newTxns = await Promise.all(promises);
                    // newTxns = newTxns.sort((a, b) => (a.timestamp > b.timestamp) ? -1 : 1)
                    console.log(newTxns);
                    setTxs(newTxns);
                }

            } catch (e) {
                console.log(e.stack)
            }


        //     counter++
        // }, 10000)
  }

  var getSocialLinks = async (address) => {
    var response = await fetch(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${address}`);
    if (response.ok) {
      var json = await response.json();
      setSocialLinks(json);
      // console.log("JSON", json);
    } else {
      setSocialLinks(null);
      // window.alert("No exist social links");
    }
  }

  // console.log(recommended_tokens);

  // // @ Sort searched tokens
  // if (recommended_tokens.length !== 0) {
  //  recommended_tokens.sort((a, b) => parseFloat(a.tradeVolume) < parseFloat(b.tradeVolume) ? 1 : -1)
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
      {(searchedPairs.length !== 0) && searchedPairs.sort((a, b) => b.txCount - a.txCount).map((pair, i) => (
        <li id={pair.id} key={i} onClick={onClick} className="hand-pointer">
          <a id={pair.id} href="#">
            <ImageComponent 
              id={pair.id}
              address={pair.token0.id} /> {/**/}
             &nbsp;
            {pair.token0.symbol} - {pair.token0.name}&nbsp;/&nbsp;
            <ImageComponent 
              id={pair.id}
              address={pair.token1.id} /> {/**/}
             &nbsp;
            {pair.token1.symbol} - {pair.token1.name}<br />
            <span id={pair.id} className="token-address">Contract: {pair.id}</span> <br />
            <span id={pair.id} className="token-address">transaction count: {pair.txCount}</span>
          </a>
        </li>
      ))}
    </Fragment>
  )











  useEffect(() => {
    
  }, [])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const onClick1 = (e) => {
    const main = document.querySelector("body");
    main.classList.toggle("dark");
    // _self.props.setTheme(main.classList.value);
    console.log("dark")
    localStorage.clear();
    eventBus.dispatch("couponApply", { message: "toggle" });
  }

  const drawer = (
    <div>
      	<h3 className="text mt-4 ml-3 font-weight-bold">
          {isDark ? 
      		  <img src="/assets/images/darkl.png" alt="bsc.png" className="logo-size" />
            :
            <img src="/assets/images/bsc.png" alt="bsc.png" className="logo-size" />
          }
          &nbsp;&nbsp;&nbsp;Realchart
      	</h3>
	      <Divider />
	      <List className="list-group-weight">
	          <ListItem button key="News">
	            <ListItemIcon><ChatOutlinedIcon className={classes.listItemSize} /></ListItemIcon>
	            <ListItemText primary="News" className="list-group-weight" />
	          </ListItem>
	          <ListItem button key="Pairs">
	            <ListItemIcon><SwapHorizIcon className={classes.listItemSize} /></ListItemIcon>
	            <ListItemText primary="Pairs" />
	          </ListItem>
	          <ListItem button key="Multiswap">
	            <ListItemIcon><FilterNoneIcon className={classes.listItemSize} /></ListItemIcon>
	            <ListItemText primary="Multiswap" />
	          </ListItem>
	          <ListItem button key="Wallet">
	            <ListItemIcon><AccountBalanceWalletOutlinedIcon className={classes.listItemSize} /></ListItemIcon>
	            <ListItemText primary="Wallet" />
	          </ListItem>
	          <ListItem button key="Alert">
	            <ListItemIcon><NotificationsActiveOutlinedIcon className={classes.listItemSize} /></ListItemIcon>
	            <ListItemText primary="Alert" />
	          </ListItem>
	      </List>
	      <Divider />
	      <List className="pt-0">
	      	  <ListItem button key="Favourite">
	            &nbsp;<FavoriteIcon className={classes.listItemSize_fav} /> &nbsp;&nbsp;&nbsp; <ListItemText primary="Favourite" />
	          </ListItem>
	          <Divider />
	          <ListItem button key="Alert">
		           Your favourite pairs will appear here
	          </ListItem>
	      </List>
	      <div className="footer-icons">
	      	<Divider />
	      	<div className="d-flex p-3 fontSize-12">
  				<div className="flex-grow-1">
  					$2,543
  				</div>
  				<div className="flex-grow-1 icon-group-sm">
  					<LocalGasStationIcon /> 17
  				</div>
          <div className="flex-grow-1 icon-group-sm">
            <Brightness4Icon className="switch hand-pointer" onClick={onClick1} />
          </div>
  			</div>
  			<div className="icon-group-sm px-3 mb-3">
  				<TelegramIcon />
  				&nbsp;
  				&nbsp;
  				<TwitterIcon />
  				&nbsp;
  				&nbsp;
  				<CommentIcon />
  				&nbsp;
  				&nbsp;
  				<MailOutlineIcon />
  			</div>
  			<div className="icon-group-sm px-3 mb-3">
  				V1.0.0
  			</div>
      </div>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className="d-flex toolbar">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          {matches1 && <Typography variant="h6" noWrap>
                      Pairs
                    </Typography>}
      	  <div className={classes.search}>
            <div style={{width: !matches1?"100%":"40vw"}}>
              <div className="input-group">
                <DelayInput
                  minLength={3}
                  value={token_name}
                  delayTimeout={1500}
                  onChange={onChange}
                  className="form-control" placeholder="Name/Symbol/Contract Address"  />
                  <div className="input-group-append ">
                    <button type="button" className="btn btn-search border-0">
                      {loadingSearch ? 
                        <i className="fa fa-spinner fa-spin" style={{fontSize:"15px", color: "aliceblue"}}></i> : 
                        <i className="fa fa-search" aria-hidden="true" style={{fontSize:"15px", color: "aliceblue"}}></i>}
                    </button>
                  </div>
              </div>
                 
                {/*  filter search  */}
                <div className={token_name !== "" ? "pos-absolute" : "pos-absolute non-show"}>
                  <ul id="myUL">
                    {list}
                  </ul>
              </div>

            </div>
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
	          
        </Toolbar>

        <Divider />

        <div className="newly-tokens text-dark">
        	<span className="d-flex icon-group-sm" >
        		<img src="/assets/images/unilogo.77e75417.png" alt="logo.png" className="logo-size-sm" /> &nbsp;Trending&nbsp;
        		<HelpOutlineIcon />
        	</span>
        	&nbsp;&nbsp;
        	<Divider orientation="vertical" className={!matches ? "height-30px d-flex matches" : "height-30px d-flex"} />
        	<div className="flex-grow-1 d-flex">
        		<marquee direction="left" className="trending-box-wrp">{/**/}
		          <div className="trending-box">
		            <ul>
		              	<li><a href="#"><b>TOP10:</b></a></li>
		          		  {newly_tokens.map((token, i) => (
                      <li key={i}>
                        <a href="#" onClick={onClick} id={token.id} className="ml-3 py-2 first">
                          {(i + 1) + " " + token.token0.symbol + "/" + token.token1.symbol} {/*<i id={token.id} className="fas fa-angle-double-up arrow-area"></i>*/}
                        </a>
                      </li>
                    ))}
		            </ul>
		          </div>
		        </marquee>{/**/}
        	</div>
	        	
        </div>
      </AppBar>

      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: "drawerPaper"
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: "drawerPaper",
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
      	<div className={classes.toolbar} />
        
        {matches1 ? 
        	<div className="d-flex mt-6 main-board">
	      		<div className="details">
	      			<Details
                token0={token0}
                token1={token1}
                ethPrice={ethPrice}
                tokenPrice24={tokenPrice24}
                tokenPrice7={tokenPrice7}
                tokenPrice30={tokenPrice30}
                socialLinks={socialLinks}
                totalCirculation={totalCirculation}
                reserve0={reserve0}
                reserve1={reserve1}
                transfers={transfers}
                holders={holders}
                selected_data={selected_data}
                />
	      		</div>
	      		<div className="tokenchart flex-grow-1">
	      			<TokenChart 
                selected_data={selected_data}
                token0={token0}
                token1={token1}
                txs={txs}
                />
	      		</div>
	      	</div> : 

			     <div className="mt-3 main-board">
	      		<div className="details mx-auto">
	      			<Details
                token0={token0}
                token1={token1}
                ethPrice={ethPrice}
                tokenPrice24={tokenPrice24}
                tokenPrice7={tokenPrice7}
                tokenPrice30={tokenPrice30}
                socialLinks={socialLinks}
                totalCirculation={totalCirculation}
                reserve0={reserve0}
                reserve1={reserve1}
                transfers={transfers}
                holders={holders}
                selected_data={selected_data}
                />
	      		</div>
	      		<div className="tokenchart">
	      			<TokenChart 
                selected_data={selected_data}
                token0={token0}
                token1={token1}
                txs={txs}
                />
	      		</div>
	      	</div>
        }

      </main>
    </div>
  );
}

DesignUI.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default DesignUI;
