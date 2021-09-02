import React, {useEffect} from 'react';

// ***
import { widget } from './charting_library';
import buildDatafeed from './datafeed.js';
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css';

// ***
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import useMediaQuery from '@material-ui/core/useMediaQuery';

import eventBus from '../eventBus';


function createData(t, token0) {
  const date = (new Date(t.block.timestamp.unixtime * 1000)).toLocaleString();
  const type = t.buyCurrency.symbol === token0.symbol ? "SELL" : "BUY";
  const priceusd = (t.tradeAmount / t.baseAmount).toFixed(4)
  const amountquote = t.buyCurrency.symbol === token0.symbol ? t.buyAmount.toFixed(4) : t.sellAmount.toFixed(4)
  const amountbase = t.buyCurrency.symbol !== token0.symbol ? t.buyAmount.toFixed(4) : t.sellAmount.toFixed(4)
  const maker = t.transaction.txFrom.address
  return {date, type, priceusd, amountquote, amountbase, maker };
}



const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});




var isDark1 = true;
var tempToken0 = "", tempToken1 = "", tempIsDark1 = false;


const TokenChart = ({selected_data, token0, token1, txs}) => {
  const classes = useStyles();
  const [isDark, setIsDark] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [rows, setRows] = React.useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const matches1 = useMediaQuery('(max-width: 930px)');
  const matches2 = useMediaQuery('(max-width: 600px)');

  useEffect(() => {
    if (txs.length !== 0 && token0) {
      console.log("+++++++++++++++++++++++++++")
      var temp = txs.map((t) => createData(t, token0));
      setRows([...temp])
    } 
  }, [txs])


  const columns = [
    { id: 'date', label: 'Date', minWidth: 200 },
    { id: 'type', label: 'Type', minWidth: 70 },
    {
      id: 'priceusd',
      label: 'Price(USD)',
      minWidth: 170,
      align: 'right',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'amountquote',
      label: 'Amount(' + (token0 && token0.symbol) + ')',
      minWidth: 170,
      align: 'right',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'amountbase',
      label: 'Amount(' + (token1 && token1.symbol) + ')',
      minWidth: 170,
      align: 'right',
      format: (value) => value.toFixed(2),
    },
    {
      id: 'maker',
      label: 'Maker',
      minWidth: 170,
      align: 'center',
      format: (value) => value.toFixed(2),
    },
  ];


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
     if (token0 && token1) {
      console.log("==========00000000000")
        new widget({
          symbol: token0.id + "|" + token1.id, // default symbol
          interval: '1440', // default interval
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          container_id: 'TVChartContainer',
          datafeed: buildDatafeed("pairInfo", 10000),
          library_path: '/charting_library/',
          custom_css_url: "./style.css",
          disabled_features: ['header_symbol_search', 'symbol_search_hot_key', 'timeframes_toolbar'],
          theme: isDark1 ? "Dark": "Light",
          timeframe: '7M',
          width: '100%',
          height: '100%',
          autosize: true,
        });
        console.log(token0, token1)

        tempToken0 = token0.id;
        tempToken1 = token1.id;
        tempIsDark1 = isDark1;
    }
    
    // tvWidget.onChartReady(() => {
    //  tvWidget.addCustomCSSFile('my-custom-css.css')
    //    setTimeout(() => {
    //      tvWidget.applyOverrides({
    //        "paneProperties.background": 'Dark' === 'Dark' ? "darkslategrey" : "#ffffff"
    //      })
    //    }, 0);
    // });

    
    
  }, [isDark, token0, token1])

  useEffect(() => {
    localStorage.clear();
    eventBus.on("couponApply", (data) =>{
        console.log(data.message);
        var temp = !isDark;
        setIsDark({isDark: temp})
        isDark1 = !isDark1
        console.log(isDark)
    });
  }, [])

  return (
    <div>
      <div>
        <div id="TVChartContainer" className="TVChartContainer" />
      </div>
      <div>
        <Paper className={classes.root}>
            <TableContainer className={classes.container}>
              <Table stickyHeader aria-label="sticky table" size="small">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth, fontWeight: 'bold' }}
                        className="thead-color"
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                        {columns.map((column, i) => {
                          const value = row[column.id];
                          return (
                            column.id === "type" ? 
                              <TableCell key={column.id} align={column.align} className={value === "SELL" ? "tbody-color type-sell":"tbody-color type-buy"}>
                                {column.format && typeof value === 'number' ? column.format(value) : value}
                              </TableCell>
                              :
                              <TableCell key={column.id} align={column.align} className="tbody-color">
                                {column.id === "maker" ? <a target="_blank" href={"https://etherscan.com/address/"+value}>{value.substr(0,15)}...</a> : value}
                              </TableCell>
                            
                              
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              labelRowsPerPage="S"
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              className="pagination-color"
            />
          </Paper>
      </div>
    </div>
  )
}


export default TokenChart;