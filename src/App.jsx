import * as React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

import './App.css';

import Navigation from './components/layout/Navigation';
import Uniswapexplorer from './components/pages/Uniswapexplorer';
import DesignUI from './components/pages/DesignUI';
import Footer from './components/layout/Footer';


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

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});

class App extends React.Component {
	render() {
		return (
			<ApolloProvider client={client}>
			  <Provider store={store}>
		        <Router>
		          <React.Fragment>
		            {/* <Navbar /> 
		            <ExchangeRates />
		            <Navigation />*/}
		            <Switch>
		            	<Route exact path="/">
		            		{/*<Redirect to="/uniswapexplorer/0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc"></Redirect>*/}
		            		<Redirect to="/bigswapexplorer/0xd3d2e2692501a5c9ca623199d38826e513033a17" ></Redirect>
		            	</Route>
		              <Route path="/uniswapexplorer/:address" component={Uniswapexplorer} />
		              <Route path="/bigswapexplorer/:address" component={DesignUI} />
		            </Switch>
		            {/*<Footer />*/}
		          </React.Fragment>
		        </Router>
		      </Provider>
		    </ApolloProvider>
			
		);
	}
}

export default App;
