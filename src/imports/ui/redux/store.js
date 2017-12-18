import thunk from 'redux-thunk';
import immutable from 'immutable';
import devToolsEnhancer from 'remote-redux-devtools';
import { routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import { createStore, applyMiddleware, compose } from 'redux';

import reducers from './reducers';
import client from '../apollo/ApolloClient';

// Initial state
// TODO: maybe factor this out into the /reducers module and make a holistic module
import authInitialState from './reducers/auth/authInitialState';
import intlInitialState from './reducers/intl/intlInitialState';

const initialState = immutable.fromJS({
	intl: intlInitialState,
	auth: authInitialState
});

// create a redux store by providing reducers and middleware
// we also need to provide client.middleware() to let apollo/redux know about eachother.
// we use devToolsEnhancer which lets us add redux devtools at some point.

const history = createHistory();

const middleware = [thunk, client.middleware(), routerMiddleware(history)];

const enhancers = [applyMiddleware(...middleware)];

if (process.env.NODE_ENV === 'development') {
	enhancers.push(devToolsEnhancer({ suppressConnectErrors: false }));
}

const store = createStore(reducers, initialState, compose(...enhancers));

export default store;
