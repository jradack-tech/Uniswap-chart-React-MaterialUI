import React, { Component, Fragment } from 'react';

class Tables extends Component {
	render() {
		return (
		<Fragment>	
			<section id="trade-sec">
		        <div className="row">
		          <div className="col-lg-4">
		            <div className="trade-wrp">
		              <ul className="token-info-list card">
		                <li className="pair-name">
		                  <div className="small_icon">
		                    <div className="top_btn">
		                      <button type="button" className="btn">Trade</button>
		                      <div className="commmunity-icon-wrp">
		                        <a href="#"
		                          ><img src="/assets/images/icon1.f856abc5.png"
		                        /></a>
		                        <a href="#"
		                          ><img
		                            src="data:image/png;base64,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"
		                        /></a>
		                        <a href="#"
		                          ><img src="/assets/images/icon3.4c144ffe.png"
		                        /></a>
		                        <a href="#"
		                          ><img
		                            src="data:image/png;base64,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"
		                        /></a>
		                        <a href="#"
		                          ><img
		                            src="data:image/png;base64,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"
		                        /></a>
		                        <a href="#"
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
		                    <div className="uni-name"><span> UNI</span></div>
		                    <div className="left-content-per">
		                      <h3>4.25%</h3>
		                    </div>
		                  </div>
		                </li>
		                <li className="my-1 data-volume">
		                  <span>Market cap : </span
		                  ><span className="data-volume-right"> 79306.1756928</span>
		                </li>
		                <li className="my-1 data-volume">
		                  <span>Circulating supply : </span
		                  ><span className="data-volume-right"> 14336</span>
		                </li>
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
		                <li className="my-1 data-volume">
		                  <span>Pool ETH : </span
		                  ><span className="data-volume-right"> 47899.70</span>
		                </li>
		                <li className="my-1 data-volume">
		                  <span>Pooled UNI : </span
		                  ><span className="data-volume-right"> 8965429.28</span>
		                </li>
		                <li className="my-1 data-volume">
		                  <span>Holders : </span
		                  ><span className="data-volume-right"> 119749</span>
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
		                      <div
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
		          <div className="col-lg-8">
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
		                      <table
		                        id="zero-config"
		                        className="table table-hover"
		                        style={{width: 100}}
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
		</Fragment>
		)
	}
}

export default Tables;