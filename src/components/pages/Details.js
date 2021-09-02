import React from 'react';

import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';

import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Tooltip from '@material-ui/core/Tooltip';

import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import SwapVertOutlinedIcon from '@material-ui/icons/SwapVertOutlined';
import NotificationsOutlinedIcon from '@material-ui/icons/NotificationsOutlined';
import ShareRoundedIcon from '@material-ui/icons/ShareRounded';
import StarBorderRoundedIcon from '@material-ui/icons/StarBorderRounded';
import FilterNoneIcon from '@material-ui/icons/FilterNone';

//*****
import ImageComponent from './ImageComponent';




function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

// function a11yProps(index) {
//   return {
//     id: `full-width-tab-${index}`,
//     'aria-controls': `full-width-tabpanel-${index}`,
//   };
// }

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
}));



const AntTabs = withStyles({
  root: {
    borderBottom: '1px solid #e8e8e8',
  },
  indicator: {
    backgroundColor: '#1890ff',
  },
})(Tabs);


const AntTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    minWidth: 72,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeightRegular,
    // marginRight: theme.spacing(4),
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      color: '#40a9ff',
      opacity: 1,
    },
    '&$selected': {
      color: '#1890ff',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#40a9ff',
      outline: 0
    },
    '&:focusVisible': {
      outline: 0
    },
  },
  selected: {},
}))((props) => <Tab {...props} />);



const Details = ({token0, token1, ethPrice, tokenPrice24, tokenPrice7, tokenPrice30, socialLinks, totalCirculation, reserve0, reserve1, transfers, holders, selected_data}) => {
	const [value, setValue] = React.useState(0);
	const classes = useStyles();
  	const theme = useTheme();

	const handleChange = (event, newValue) => {
	    setValue(newValue);
	};

	const handleChangeIndex = (index) => {
	   setValue(index);
	};

	return (
		<div>
			<div className="p-2">
				<div className="d-flex mb-3">
					<div className="flex-grow-1">
						<Tooltip title="UNISWAP" arrow>
						  <div>
						  	<img src="/assets/images/unitrade.c68e3a38.png" alt="unitrade" className="logo-size-sm-0" /> &nbsp; UNISWAP
						  </div>
						</Tooltip>
					</div>
					<div className="flex-grow-1 text-right icon-group-sm">
						<Tooltip title="Add metamask" arrow>
						  <img src="/assets/images/meta.jpg" alt="meta" className="logo-size-sm-0" />
						</Tooltip>
						&nbsp;
						&nbsp;
						<Tooltip title="Shared Link" arrow>
						  <ShareRoundedIcon fontSize="small" />
						</Tooltip>
						&nbsp;
						&nbsp;
						<Tooltip title="Multiswap" arrow>
						  <FilterNoneIcon fontSize="small"  />
						</Tooltip>
						&nbsp;
						&nbsp;
						<Tooltip title="Favourite" arrow>
						  <StarBorderRoundedIcon fontSize="small" />
						</Tooltip>
					</div>
				</div>
				<h3 className="font-weight-bold">{token0 && token1 && <React.Fragment><ImageComponent id={token0.id} address={token0.id} /> {token0.symbol}/{token1.symbol}</React.Fragment>}</h3>

				<h3 className="font-weight-medium text-green">${(token0 && ethPrice.data) && (parseFloat(token0.derivedETH) * parseFloat(ethPrice.data.bundles[0].ethPrice)).toFixed(6)}</h3>

				{/*<h4 className="text-green">0.000231 WETH</h4>*/}
			</div>
				

			<div className="mb-4">
				<table className="table table-sm table-borderless">
					<tbody className="text-center tablecolor">
						<tr>
							<td>24h</td>
							<td>7D</td>
							<td>30D</td>
						</tr>
						<tr>
							<td>{tokenPrice24}%</td>
							<td>{tokenPrice7}%</td>
							<td>{tokenPrice30}%</td>
						</tr>
					</tbody>
				</table>
			</div>


			<Divider />


			<div className="my-3 px-3 mx-2">
				<div className="d-flex justify-space-between">
					<Button
						className="w-100 bg-lightsky font-weight-medium"
				        startIcon={<AccountBalanceWalletOutlinedIcon />}
				        >Connect Wallet</Button>
				</div>
			</div>


			<Divider />


			<div className="commmunity-icon-wrp m-3">
                <a href={token0 ? "https://etherscan.io/token/" + token0.id: "#"} target="_blank"
                  ><img src="/assets/images/icon1.f856abc5.png"
                /></a>
                <a href={token0 ? "https://etherscan.io/token/" + token0.id: "#"} target="_blank"
                  ><img
                    src="data:image/png;base64,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"
                /></a>
                {
									socialLinks !== null && socialLinks.links.twitter_screen_name != "" && 
                  <a className="socialLink" href={socialLinks !== null && "https://twitter.com/" + socialLinks.links.twitter_screen_name} target="_blank" ><img src="/assets/images/icon5.png" alt="twitter" /></a>

								}
								{
									socialLinks !== null && socialLinks.links.telegram_channel_identifier != "" && 
                  <a className="socialLink" href={socialLinks !== null && "https://t.me/" + socialLinks.links.telegram_channel_identifier} target="_blank" ><img src="/assets/images/icon4.png" alt="telegram" /></a>

								}
								{
									socialLinks !== null && socialLinks.links.repos_url.github != "" && 
                  <a className="socialLink" href={socialLinks !== null &&   socialLinks.links.repos_url.github} target="_blank" ><img  src="/assets/images/github.png" alt="github" /></a>

								}
								{
									socialLinks !== null && socialLinks.links.announcement_url[0] != "" && 
            		  <a className="socialLink" href={socialLinks !== null &&   socialLinks.links.announcement_url[0]} target="_blank" ><img  src="/assets/images/medium.png" alt="medium" /></a>

								}

								{
									socialLinks !== null && socialLinks.links.homepage[0] != "" && 
                  <a className="socialLink" href={socialLinks !== null &&   socialLinks.links.homepage[0]} target="_blank" ><img src="/assets/images/icon6.png" alt="page" /></a>

								}

								{
									socialLinks !== null && socialLinks.links.chat_url[0] != "" && 
                  <a className="socialLink" href={socialLinks !== null &&   socialLinks.links.chat_url[0]} target="_blank" ><img  src="/assets/images/discord.png" alt="discord" /></a>

								}
            </div>


			<Divider />


			<div>
				<div>
					<AntTabs 
						value={value}
						onChange={handleChange} 
			      variant="fullWidth"
			        >
			          <AntTab icon={<InfoOutlinedIcon />} label="Info" />
			          <AntTab icon={<SwapVertOutlinedIcon />} label="Swap" />
			          <AntTab icon={<NotificationsOutlinedIcon />} label="Alert" />
			        </AntTabs>
		        </div>
		        <SwipeableViews
			        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
			        index={value}
			        onChangeIndex={handleChangeIndex}
			        className="p-1"
			      >
			        <TabPanel value={value} index={0} dir={theme.direction}>
			          	
			        	<h6 className="text-medium">BUY UNI TOKENS</h6>
			        	<Button
									className="w-100 bg-success text-white font-weight-bold mb-2"
					        startIcon={<img src="/assets/images/unitrade.c68e3a38.png" alt="Unitrade" className="logo-size-sm-0" />}
					        >1Inchi ></Button>
					    	<Button
										className="w-100 bg-success text-white font-weight-bold mb-5"
						        startIcon={<img src="/assets/images/unilogo.77e75417.png" alt="Unitrade" className="logo-size-sm-0" />}
						        >Uniswap ></Button>
						    <h6 className="mb-5 text-medium font-weight-bold">UNISWAP V2 POOL INFO</h6>
						    <div className="d-flex mb-3 fontSize-12">
									<div className="flex-grow-1">
										Pair address
									</div>
									<div className="flex-grow-1 text-right font-weight-bold">
										<Tooltip title={selected_data ? selected_data.id : "0x000"} arrow>
											<div>
												{selected_data ? selected_data.id.substr(0, 4) + "..." + selected_data.id.substr(39, 4) : "0x...00000"}
											</div>
										</Tooltip>
									</div>
								</div>
								<div className="d-flex mb-3 fontSize-12">
									<div className="flex-grow-1">
										Total liquidity
									</div>
									<div className="flex-grow-1 text-right font-weight-bold">
										${ token0 && token1 &&
												  parseFloat(reserve0 / reserve1 * totalCirculation).toFixed(4)}
									</div>
								</div>
								{/*<div className="d-flex mb-3 fontSize-12">
									<div className="flex-grow-1">
										24H volume
									</div>
									<div className="flex-grow-1 text-right font-weight-bold">
										$0.00
									</div>
								</div>*/}
								<div className="d-flex mb-3 fontSize-12">
									<div className="flex-grow-1">
										Pooled {token0 && token0.symbol}
									</div>
									<div className="flex-grow-1 text-right font-weight-bold">
										{token0 && parseFloat(reserve0).toFixed(5)}
									</div>
								</div>
								<div className="d-flex mb-3 fontSize-12">
									<div className="flex-grow-1">
										Pooled {token1 && token1.symbol}
									</div>
									<div className="flex-grow-1 text-right font-weight-bold">
										{token1 && parseFloat(reserve1).toFixed(5)}
									</div>
								</div>
								<div className="d-flex mb-5 fontSize-12">
									<div className="flex-grow-1">
										Total tx
									</div>
									<div className="flex-grow-1 text-right font-weight-bold">
										{transfers}
									</div>
								</div>

							    <h6 className="mb-5 text-medium font-weight-bold">UNI TOKEN INFO</h6>
							    <div className="d-flex mb-3 fontSize-12">
									<div className="flex-grow-1">
										Token address
									</div>
									<div className="flex-grow-1 text-right font-weight-bold">
										<Tooltip title={token0 ? token0.id : "0x000"} arrow>
											<div>
												{token0 && token0.id.substr(0, 4) + "..." + token0.id.substr(39, 4)}
											</div>
										</Tooltip>
									</div>
								</div>
								{/*<div className="d-flex mb-3 fontSize-12">
									<div className="flex-grow-1">
										Contract
									</div>
									<div className="flex-grow-1 text-right">
										View contract
									</div>
								</div>*/}
								{/*<div className="d-flex mb-3 fontSize-12">
									<div className="flex-grow-1">
										Holders
									</div>
									<div className="flex-grow-1 text-right">
										{holders}
									</div>
								</div>*/}
								{/*<div className="d-flex mb-3 fontSize-12">
									<div className="flex-grow-1">
										Total Supply
									</div>
									<div className="flex-grow-1 text-right">
										Not available
									</div>
								</div>*/}
								{/*<div className="d-flex mb-3 fontSize-12">
									<div className="flex-grow-1">
										Circulating supply
									</div>
									<div className="flex-grow-1 text-right">
										{totalCirculation}
									</div>
								</div>
								<div className="d-flex mb-3 fontSize-12">
									<div className="flex-grow-1">
										Market cap
									</div>
									<div className="flex-grow-1 text-right">
										${ethPrice.data && parseFloat(totalCirculation) * parseFloat(ethPrice.data.bundles[0].ethPrice).toFixed(4)}
									</div>
								</div>*/}
								{/*<div className="d-flex mb-3 fontSize-12">
									<div className="flex-grow-1">
										All-time-high
									</div>
									<div className="flex-grow-1 text-right">
										Not available
									</div>
								</div>
								<div className="d-flex mb-3 fontSize-12">
									<div className="flex-grow-1">
										All-time-low
									</div>
									<div className="flex-grow-1 text-right">
										Not available
									</div>
								</div>*/}

			        </TabPanel>
			        <TabPanel value={value} index={1} dir={theme.direction}>
			          Coming soon
			        </TabPanel>
			        <TabPanel value={value} index={2} dir={theme.direction}>
			          Coming soon
			        </TabPanel>
			    </SwipeableViews>
			</div>		


		</div>
	)
}


export default Details;