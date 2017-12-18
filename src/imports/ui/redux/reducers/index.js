import { combineReducers } from 'redux-immutable';
// Apollo
import client from '/imports/ui/apollo/ApolloClient';

// Reducers
import routerReducer from './route';
import intlReducer from './intl/intlReducer';
import authReducer from './auth/authReducer';

const rootReducer = combineReducers({
  apollo: client.reducer(),
  routing: routerReducer,
  intl: intlReducer, // internationalization
  auth: authReducer
});

export default rootReducer;
