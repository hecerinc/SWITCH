// client.js
// @desc Main client init file

import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

// APOLLO SPECIFIC
import createHistory from 'history/createBrowserHistory';
import { ApolloProvider } from 'react-apollo';
import { ConnectedRouter } from 'react-router-redux';
import { IntlProvider } from 'react-intl-redux';

import client from '/imports/ui/apollo/ApolloClient';
import store from '/imports/ui/redux/store';
import { initLocale } from '/imports/ui/redux/reducers/intl/intlActions';
import RouterContainer from '/imports/ui/containers/Router/routerContainer';

const history = createHistory();

Meteor.startup(() => {
	document.body.innerHTML = '<div id="react-root"></div>';
	// TODO: not yet implemented
	// store.dispatch(initLocale());
	render(
		<ApolloProvider client={client} store={store}>
			<IntlProvider intlSelector={state => state.get('intl').toJS()}>
				<ConnectedRouter history={history}>
					<RouterContainer />
				</ConnectedRouter>
			</IntlProvider>
		</ApolloProvider>,
		document.getElementById('react-root')
	);
});
